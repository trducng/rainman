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

import React from 'react';
import { AsyncStorage, FlatList, Text, View } from 'react-native';
import { AppLoading } from 'expo';

import { getItem, mergeItem, setItem } from '../api/AsyncDB';
import { SETTINGS, NOTIFICATION, DEFAULT_SETTINGS, SETTING_ITEMS,
  DESCRIPTION_COLLECTION, TITLE_COLLECTION, FUNCTION_COLLECTION
} from '../constants/Settings';

import SettingItem from '../components/SettingItem';

import { appBarStyle } from '../styles';
import { screenGeneral } from '../styles/screens';

type Props = {};

type State = {
  loaded: boolean,
  [NOTIFICATION: string]: boolean,
};


class SettingsScreen extends React.Component<Props, State> {
  static navigationOptions = {
    title: 'Settings',
    headerTintColor: 'white',
    headerStyle: appBarStyle,
  }

  constructor(props: Object) {
    super(props);
    this.state = {
      loaded: false,
      [NOTIFICATION]: false
    }
  }

  componentWillMount() {
    AsyncStorage.getItem(SETTINGS, (error, result) => {
      if (result !== null) {
        this.setState((prevState) => {
          var settings = JSON.parse(result);
          return {
            loaded: true,
            [NOTIFICATION]: settings[NOTIFICATION],
          }
        });
      } else {
        AsyncStorage.setItem(SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
        this.setState((prevState) => {
          return {
            loaded: true,
            ...DEFAULT_SETTINGS
          }
        })
      }
    });
  }

  render() {

    if (!this.state.loaded) {
      return <AppLoading />;
    }

    var settings = SETTING_ITEMS.map((s) => {
      return {
        key: s,
        title: TITLE_COLLECTION[s],
        description: DESCRIPTION_COLLECTION[s],
        value: this.state[s]
      }
    });

    return (
      <View style={[screenGeneral]}>
        <FlatList
          style={{paddingTop: 8, flex: 1}}
          data={settings}
          keyExtractor={(item, index) => item['key']}
          renderItem={({item, index}) => {
            return (<SettingItem
              title={item['title']}
              value={item['value']}
              description={item['description']}
              onValueChange={(value) => {
                let key = item['key']
                FUNCTION_COLLECTION[key](value);
                this._toggleSetting(key, value);
              }}
            />);
          }}
        />
      </View>
    );
  }

  _toggleSetting(key: string, value: boolean) {

    this.setState((prevState) => {
      return {
        loaded: false
      };
    });

    var settings: Object = SETTING_ITEMS.reduce((accum, i) => {
      accum[i] = this.state[i];
      return accum;
    }, {});
    settings[key] = value;

    mergeItem(SETTINGS, settings);
    this.setState((prevState) => {
      return {
        loaded: true,
        [key]: value
      };
    });
  }
}

export default SettingsScreen;
