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
  assetsAreLoaded: boolean,
  dataLoaded: boolean
}


export default class App extends React.Component<Props, State> {

  constructor(props: Object) {
    super(props);
    this.state = {
      assetsAreLoaded: false,
      dataLoaded: false,
    };
  }

  store = createStore(AppReducer);


  componentWillMount() {
    this._loadAssetsAsync();
    retrieveAll(this._loadData);
    // setItem("savant", JSON.stringify({
    //   'idx': 0,
    //   'word': 'savant',
    //   'def': 'a learned person, especially a distinguished scientist',
    //   'n': true,
    //   'v': false,
    //   'adj': true,
    //   'adv': false,
    //   'score': 4
    // }));
    // setItem("martinet", JSON.stringify({
    //   'idx': 1,
    //   'word': 'martinet',
    //   'def': 'a strict disciplinarian, especially in the armed forces.',
    //   'n': true,
    //   'v': true,
    //   'adj': true,
    //   'adv': false,
    //   'score': 5
    // }));
    // setItem("solarium", JSON.stringify({
    //   'idx': 2,
    //   'word': 'solarium',
    //   'def': 'a room fitted with extensive areas of glass to admit sunlight.',
    //   'n': true,
    //   'v': false,
    //   'adv': true,
    //   'adj': false,
    //   'score': 2
    // }))
  }

  render() {
    if (!this.state.assetsAreLoaded && !this.props.skipLoadingScreen &&
        !this.state.dataLoaded) {
      return <AppLoading />;
    } else {

      return (
        <Provider store={this.store}>
          <RootNavigation />
        </Provider>
      );
    }
  }

  async _loadAssetsAsync() {
    try {
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
      this.setState({ assetsAreLoaded: true });
    }
  }

  _loadData = (error, result) => {
    this.setState({ dataLoaded: true});
    this.store.dispatch(getAllWords(result));
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
