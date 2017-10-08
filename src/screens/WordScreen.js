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
import { Alert, View, Text } from 'react-native';
import { connect } from 'react-redux';

import { appBarStyle } from '../styles';
import { screenGeneral } from '../styles/screens';
import style from '../styles/screens/WordScreen';

import StatusBarButtonHolder from '../components/StatusBarButtonHolder';
import DynamicViewPager from '../components/DynamicViewPager';

import { ID, WORD, DEFINITION } from '../constants/DB';
import { VERBOSE } from '../constants/Meta';

import { mod } from '../api/utils';
import { setCurrentWord } from '../api/WordActions';


type Props = {
  navigation: Object,
  currentWord: number,
  allWords: Array<{
    idx: number, word: string, def: string, n: boolean, v: boolean,
    adj: boolean, adv: boolean, score: number
  }>,
  setWord: Function
}


class WordScreen extends React.Component<Props> {

  static navigationOptions = ({ navigation, screenProps }) => {
    let { params } = navigation.state;
    let { allWords, currentWord, onDeleteWord } = screenProps;

    return {
      title: 'Word Detail',
      headerTintColor: 'white',
      headerStyle: appBarStyle,
      headerRight: (<StatusBarButtonHolder
        onDelete={() => {
          if (VERBOSE >= 5) {
            console.log('WordScreen: delete index: ' + currentWord);
          }
          Alert.alert(
            `Confirm Delete`,
            `Are you sure to delete the word '${allWords[currentWord][WORD]}'?`,
            [
              {text: 'Cancel'},
              {text: 'Delete', onPress: () => {
                if (VERBOSE >= 5) {
                  console.log('WordScreen: delete word');
                }
                navigation.goBack();
                onDeleteWord(allWords[currentWord][WORD]);
              }}
            ],
            { cancelable: false }
          );
        }}
        onEdit={() => {
          if (VERBOSE >= 5) {
            console.log('WordScreen: edit index: ' + currentWord);
          }
          navigation.navigate('Edit', {word: allWords[currentWord]});
        }} />
      ),
    }
  }

  render() {
    return (
      <DynamicViewPager
        onSwipedRight={this._onSwipedRight}
        onSwipedLeft={this._onSwipedLeft}
        onSwipedFail={this._onSwipedFail}
        getLeftPage={this._getLeftPage}
        getRightPage={this._getRightPage}
        getMainPage={this._getMainPage}
      />
    );
  }

  _getLeftPage = () => {
    if (VERBOSE >= 5) {
      console.log('WordScreen: get left page');
    }

    if (this.props.allWords.length === 0) {
      return (
        <View style={[screenGeneral, style.main]}>
          <Text style={style.word}>This deck is empty!</Text>
          <Text style={style.def}>There are currently no words, please add some!</Text>
        </View>
      )
    }

    var word = this.props.allWords[
      mod(this.props.currentWord - 1, this.props.allWords.length)
    ];

    return (
      <View style={[screenGeneral, style.main]} >
        <Text style={style.word}>{word[WORD]}</Text>
        <Text style={style.def}>{word[DEFINITION]}</Text>
      </View>
    );
  }

  _getRightPage = () => {
    if (VERBOSE >= 5) {
      console.log('WordScreen: get right page');
    }

    if (this.props.allWords.length === 0) {
      return (
        <View style={[screenGeneral, style.main]}>
          <Text style={style.word}>This deck is empty!</Text>
          <Text style={style.def}>There are currently no words, please add some!</Text>
        </View>
      )
    }

    var word = this.props.allWords[mod(this.props.currentWord + 1,
                                       this.props.allWords.length)];

    return (
      <View style={[screenGeneral, style.main]} >
        <Text style={style.word}>{word[WORD]}</Text>
        <Text style={style.def}>{word[DEFINITION]}</Text>
      </View>
    );
  }

  _getMainPage = () => {
    if (VERBOSE >= 5) {
      console.log('Get Main Page');
      console.log('Current word');
      console.log(this.props.currentWord);
      console.log('allWords');
      console.log(this.props.allWords);
    }

    if (this.props.allWords.length === 0) {
      return (
        <View style={[screenGeneral, style.main]}>
          <Text style={style.word}>This deck is empty!</Text>
          <Text style={style.def}>There are currently no words, please add some!</Text>
        </View>
      )
    }

    var word = this.props.allWords[this.props.currentWord];

    return (
      <View style={[screenGeneral, style.main]} >
        <Text style={style.word}>{word[WORD]}</Text>
        <Text style={style.def}>{word[DEFINITION]}</Text>
      </View>
    );
  }

  _onSwipedRight = () => {
    this.props.setWord(mod(this.props.currentWord + 1,
                           this.props.allWords.length));

  }

  _onSwipedLeft = () => {
    this.props.setWord(mod(this.props.currentWord - 1,
                           this.props.allWords.length));
  }

  _onSwipedFail = () => {}

}

const mapStateToProps = (state, ownProps) => {
  return {
    currentWord: state.wordData.CURRENT_WORD,
    allWords: state.wordData.ALL_WORDS
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    setWord: (idx) => dispatch(setCurrentWord(idx))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WordScreen);
