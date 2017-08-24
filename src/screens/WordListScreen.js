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
 *     * Neither the name of this software authors nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
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

import Expo from 'expo';
import React from 'react';
import { View, StyleSheet, FlatList, Text } from 'react-native';

import { appBarStyle } from '../styles';
import { screenGeneral } from '../styles/screens';
import ListItem from '../components/ListItem';
import SearchBox from '../components/SearchBox';


class WordListScreen extends React.Component {

  static navigationOptions = {
    title: 'Word List',
    headerTintColor: 'white',
    headerStyle: appBarStyle,
    headerRight: <SearchBox />,
  }

  render() {
    let data = [];
    for (var i=0; i<100; i++) {
      data.push({
        key: i,
        word: 'Key ' + i,
        def: 'This is item' + i
      });
    }

    console.log("This is data length: " + data.length);

    return (
      <View style={screenGeneral}>
        <FlatList
          style={{flex: 1}}
          data={data}
          renderItem={({item}) => <ListItem word={item.word} def={item.def} />}
        />
      </View>
    );
  }
}


export default WordListScreen;
