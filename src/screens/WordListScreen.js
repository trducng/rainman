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
import { displayWord } from '../api/WordActions';
import { ID, WORD, DEFINITION } from '../constants/DB';


type Props = {
  wordList: Array<{
    idx: number, word: string, def: string, n: boolean, v: boolean,
    adj: boolean, adv: boolean, score: number
  }>,
  allWords: Array<{
    idx: number, word: string, def: string, n: boolean, v: boolean,
    adj: boolean, adv: boolean, score: number
  }>,
  navigation: Object,
  setCurrentWord: Function
}


export const filterWordList = (
 wordList: Array<{
  idx: number, word: string, def: string, n: boolean, v: boolean,
  adj: boolean, adv: boolean, score: number}>,
 searchTerm: string) => {

  if (searchTerm === '') {
    return wordList;
  }

  var s = searchTerm.toLowerCase();
  return wordList.filter(wordObj => {
    return (wordObj[WORD].toLowerCase().indexOf(s)
          + wordObj[DEFINITION].toLowerCase().indexOf(s)) > -2;
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
    return (
      <View style={screenGeneral}>
        <FlatList
          style={{flex: 1}}
          data={this.props.wordList}
          keyExtractor={(item, index) => item[ID]}
          renderItem={({item, index}) => (
            <WordListItem
              word={item[WORD]} def={item[DEFINITION]}
              onPress={() => {
                let idx = this.props.allWords.findIndex(i => item[WORD] === i[WORD]);
                this.props.setCurrentWord(idx);
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
    wordList: filterWordList(state.wordData.ALL_WORDS, state.searchTerm),
    allWords: state.wordData.ALL_WORDS
  }
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setCurrentWord: (idx) => dispatch(displayWord(idx))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WordListScreen);
