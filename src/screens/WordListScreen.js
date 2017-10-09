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
import { connect } from 'react-redux';

import { appBarStyle } from '../styles';
import { screenGeneral } from '../styles/screens';

import WordListItem from '../components/WordListItem';
import SearchBox from '../components/SearchBox';

import { searchWord } from '../api/WordListActions';
import { setCurrentWord } from '../api/WordActions';
import { binarySearchArray } from '../api/utils';

import { ID, WORD, DEFINITION } from '../constants/DB';


type Props = {
  ids: Array<number>,
  filteredIds: Array<number>,
  words: Object,
  navigation: Object,
  setWord: Function
}


export const filterWordList = (
 words: Object, ids: Array<number>, searchTerm: string) => {

  if (searchTerm === '') {
    return ids;
  }

  var s = searchTerm.toLowerCase();
  return ids.filter(id => {
    return (
        words[id][WORD].toLowerCase().indexOf(s)
      + words[id][DEFINITION].toLowerCase().indexOf(s)
    ) > -2;
  });
}


class WordListScreen extends React.Component<Props> {

  static navigationOptions({ navigation, screenProps }) {
    return {
      title: 'Word List',
      headerTintColor: 'white',
      headerStyle: appBarStyle,
      headerRight: (<SearchBox
        onChangeText={screenProps.onSearch}
        value={screenProps.searchTerm}/>
      ),
    }
  }

  render() {
    var { words, ids } = this.props;

    if (ids.length === 0) {
      return (
        <View style={screenGeneral}>
          <Text>Your deck is empty, please add some words!</Text>
        </View>
      );
    }

    return (
      <View style={screenGeneral}>
        <FlatList
          style={{flex: 1}}
          data={this.props.filteredIds}
          keyExtractor={(item, index) => item}
          renderItem={({item, index}) => (
            <WordListItem
              word={words[item][WORD]} def={words[item][DEFINITION]}
              onPress={() => {
                this.props.setWord(binarySearchArray(ids, item));
                this.props.navigation.navigate('Detail')}}
            />
          )}
        />
      </View>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  return {
    words: state.wordData.WORDS,
    filteredIds: filterWordList(
      state.wordData.WORDS, state.wordData.ALL_IDS, state.searchTerm
    ),
    ids: state.wordData.ALL_IDS
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setWord: (idx) => dispatch(setCurrentWord(idx))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WordListScreen);
