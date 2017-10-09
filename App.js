/**
 * Copyright (c) 2017, Duc Nguyen
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of this software authors nor the names of its
 *       contributors may be used to endorse or promote products derived from
 *       this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL DUC NGUYEN BE LIABLE FOR ANY DIRECT, INDIRECT,
 * INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 * NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @flow
 */

import { AppLoading, Asset, Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';

import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

import AppReducer from './src/reducers';
import RootNavigation from './src/navigation/RootNavigation';

import { retrieveAll, setItem, multiRemove } from './src/api/AsyncDB';

import { getAllWords } from './src/api/WordListActions';


type Props = {
  skipLoadingScreen?: boolean
}

type State = {
  loaded: boolean,
}


export default class App extends React.Component<Props, State> {

  constructor(props: Object) {
    super(props);
    this.state = {
      loaded: false,
    };
  }

  store = createStore(AppReducer);


  componentWillMount() {
    this._loadAssetsAsync();
  }

  render() {

    if (!this.state.loaded && !this.props.skipLoadingScreen) {
      return <AppLoading />;
    }

    return (
      <Provider store={this.store}>
        <RootNavigation />
      </Provider>
    );
  }

  async _loadAssetsAsync() {
    try {
      retrieveAll(this._loadData);
      await Promise.all([
        Asset.loadAsync([
          require('./lib/assets/images/robot-dev.png'),
          require('./lib/assets/images/robot-prod.png'),
        ]),
        Font.loadAsync([
          // This is the font that we are using for our tab bar
          Ionicons.font,
          // We include SpaceMono because we use it in HomeScreen.js. Feel free
          // to remove this if you are not using it in your app
          { 'space-mono': require('./lib/assets/fonts/SpaceMono-Regular.ttf') },
        ]),
      ]);
    } catch (e) {
      // In this case, you might want to report the error to your error
      // reporting service, for example Sentry
      console.warn(
        'There was an error caching assets (see: App.js), perhaps due to a ' +
          'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e);
    } finally {
      this.setState({ loaded: true });
    }
  }

  _loadData = (error, result) => {
    this.store.dispatch(getAllWords(result));
  }

}
