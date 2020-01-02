import React, { Component } from 'react';
import { WebView } from 'react-native-webview';
import PropTypes from 'prop-types';
import { Loading } from './styles';

export default class Starred extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.getParam('item').full_name,
  });

  static propTypes = {
    navigation: PropTypes.shape({
      getParam: PropTypes.func,
    }).isRequired,
  };

  render() {
    const { navigation } = this.props;
    const ownerNameAndRepo = navigation.getParam('item').full_name;
    const link = `https://github.com/${ownerNameAndRepo}`;
    return (
      <WebView
        source={{ uri: link }}
        startInLoadingState
        renderLoading={() => <Loading />}
      />
    );
  }
}
