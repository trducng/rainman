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
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import WordListScreen from '../screens/WordListScreen';
import EditScreen from '../screens/EditScreen';
import WordScreen from '../screens/WordScreen';

import { deleteItem } from '../api/AsyncDB';
import { searchWord } from '../api/WordListActions';
import { deleteWord, setCurrentWord } from '../api/WordActions';

type Props = {
  dispatch: Function,
  nav: Object,
  searchTerm: string,
  currentWord: number,
  allWords: Array<{
    idx: number, word: string, def: string, n: boolean, v: boolean,
    adj: boolean, adv: boolean, score: number
  }>
}


export const WordListNavigator = StackNavigator({
  WordList: { screen: WordListScreen },
  Edit: { screen: EditScreen },
  Detail: { screen: WordScreen },
});

/**
 * Integrate react-navigation state into redux state tree. Note that:
 *    - navigation: the navigation state that now stored in redux
 *    - screenProps: react-navigation - the props that will be passed to each
 *      child screen's navigationOptions
 */
class WordListTempNavigator extends React.Component<Props> {
  render() {
    return (
      <WordListNavigator
        navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.nav
        })}
        screenProps={{
          searchTerm: this.props.searchTerm,
          onSearch: (term) => this.props.dispatch(searchWord(term)),
          currentWord: this.props.currentWord,
          allWords: this.props.allWords,
          onDeleteWord: (word) => {
            deleteItem(word, () => {
              this.props.dispatch(deleteWord(word));
            });
          }
        }}
      />
    );
  }
}

const mapStateToProps = state => ({
  nav: state.navWordList,

  // pass to WordListScreen's navigationOptions
  searchTerm: state.searchTerm,

  // pass to WordScreen's navigationOptions
  currentWord: state.wordData.CURRENT_WORD,
  allWords: state.wordData.ALL_WORDS,
});



const WordListStackNavigator = connect(mapStateToProps)(WordListTempNavigator);

WordListStackNavigator.navigationOptions = {
  title: 'Word List',
}

export default WordListStackNavigator;
