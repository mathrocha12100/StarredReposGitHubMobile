import React, { Component } from 'react';
import PropTypes from 'prop-types';
import api from '../../services/api';

import {
  Container,
  Avatar,
  Name,
  Bio,
  Header,
  Stars,
  Starred,
  OwnerAvatar,
  Info,
  Title,
  Author,
  Box,
  Smile,
  DontHaveFavRepo,
  Loading,
  LoadMorePages,
} from './styles';

export default class User extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('user').name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    stars: [],
    page: 1,
    loading: true,
    refreshing: false,
    isLoadingMore: false,
  };

  async componentDidMount() {
    this.load();
  }

  load = async (page = 1) => {
    if (page > 1) {
      this.setState({ isLoadingMore: true });
    }
    const { stars } = this.state;
    const { navigation } = this.props;
    const user = navigation.getParam('user');

    const response = await api.get(`/users/${user.login}/starred`, {
      params: { page },
    });

    this.setState({
      stars: page >= 2 ? [...stars, ...response.data] : response.data,
      page,
      loading: false,
      refreshing: false,
      isLoadingMore: false,
    });
  };

  loadMore = () => {
    const { page, stars } = this.state;
    if (stars.length >= 30) {
      const nextPage = page + 1;

      this.load(nextPage);
    }
  };

  refreshList = () => {
    this.setState({ refreshing: true, stars: [] }, this.load);
  };

  handleNavigate = item => {
    const { navigation } = this.props;

    navigation.navigate('Starred', { item });
  };

  render() {
    const { navigation } = this.props;
    const { stars, loading, refreshing, isLoadingMore } = this.state;
    const user = navigation.getParam('user');
    const arrayLength = stars.length;
    return (
      <Container>
        <Header>
          <Avatar source={{ uri: user.avatar }} />
          <Name>{user.name}</Name>
          <Bio>{user.bio === null ? 'Sem descrição' : user.bio}</Bio>
        </Header>
        {loading ? (
          <Loading />
        ) : arrayLength === 0 ? (
          <Box>
            <Smile>:(</Smile>
            <DontHaveFavRepo>
              Esse usuario não possue repositorios marcados como favoritos
            </DontHaveFavRepo>
          </Box>
        ) : (
          <Stars
            data={stars}
            keyExtractor={star => String(star.id)}
            refreshing={refreshing}
            onEndReachedThreshold={0.2}
            onEndReached={this.loadMore}
            renderItem={({ item }) => (
              <Starred onPress={() => this.handleNavigate(item)}>
                <OwnerAvatar source={{ uri: item.owner.avatar_url }} />
                <Info>
                  <Title>{item.name}</Title>
                  <Author>{item.owner.login}</Author>
                </Info>
              </Starred>
            )}
          />
        )}
        {isLoadingMore ? <LoadMorePages /> : null}
      </Container>
    );
  }
}
