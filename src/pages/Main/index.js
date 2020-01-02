import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Keyboard, View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
  RemoveButton,
} from './styles';
import api from '../../services/api';

export default class Main extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }).isRequired,
  };

  state = {
    newUser: '',
    users: [],
    loading: false,
    error: false,
  };

  async componentDidMount() {
    const users = await AsyncStorage.getItem('users');

    if (users) {
      this.setState({ users: JSON.parse(users) });
    }
  }

  async componentDidUpdate(_, prevState) {
    const { users } = this.state;

    if (prevState.users !== users) {
      AsyncStorage.setItem('users', JSON.stringify(users));
    }
  }

  handleAddUser = async () => {
    const { users, newUser } = this.state;
    const isDuplicated = users.find(user => user.login === newUser);
    if (newUser !== '') {
      this.setState({ loading: true });
      try {
        if (isDuplicated) {
          throw new Error();
        }
        const response = await api.get(`/users/${newUser}`);
        const data = {
          name: response.data.name,
          login: response.data.login,
          bio: response.data.bio,
          avatar: response.data.avatar_url,
        };

        this.setState({
          users: [...users, data],
          newUser: '',
          loading: false,
        });
      } catch (e) {
        this.setState({
          loading: false,
          newUser: '',
          error: true,
        });
      }
    }

    Keyboard.dismiss();
  };

  handleRemoveUser = userName => {
    const { users } = this.state;
    this.setState({
      users: users.filter(user => user.login !== userName),
    });
  };

  handleNavigate = user => {
    const { navigation } = this.props;

    navigation.navigate('User', { user });
  };

  static navigationOptions = {
    title: 'Usuários',
  };

  render() {
    const { users, newUser, loading, error } = this.state;

    return (
      <Container>
        <Form>
          <Input
            autoCorrect={false}
            autoCapitalize="none"
            placeholder={
              error
                ? 'Repositorio invalido, não existe ou já está na lista!'
                : 'Adcionar usuario'
            }
            placeholderTextColor={error ? 'red' : '#999'}
            value={newUser}
            onChangeText={text => this.setState({ newUser: text })}
            returnKeyType="send"
            onSubmitEditing={this.handleAddUser}
            borderColor={error}
            onTouchStart={() => this.setState({ error: false })}
          />
          <SubmitButton loading={loading} onPress={this.handleAddUser}>
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Icon name="add" size={20} color="#FFF" />
            )}
          </SubmitButton>
        </Form>

        <List
          data={users}
          keyExtractor={user => user.login}
          renderItem={({ item }) => (
            <User>
              <View
                style={{
                  width: '100%',
                  alignItems: 'flex-end',
                }}
              >
                <RemoveButton onPress={() => this.handleRemoveUser(item.login)}>
                  <Icon name="close" size={16} color="#fff" />
                </RemoveButton>
              </View>

              <Avatar source={{ uri: item.avatar }} />
              <Name>{item.name}</Name>
              <Bio>{item.bio === null ? 'Sem descrição' : item.bio}</Bio>

              <ProfileButton onPress={() => this.handleNavigate(item)}>
                <ProfileButtonText>Ver Perfil</ProfileButtonText>
              </ProfileButton>
            </User>
          )}
        />
      </Container>
    );
  }
}
