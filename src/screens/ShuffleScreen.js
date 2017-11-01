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
import { View, StatusBar, Text, TouchableWithoutFeedback } from 'react-native';
import { connect } from 'react-redux';

import { appBarStyle } from '../styles';
import { screenGeneral } from '../styles/screens';
import style from '../styles/screens/ShuffleScreen';

import ActionBar from '../components/ActionBar';
import DynamicViewPager from '../components/DynamicViewPager';
import LAYOUT_CONSTANTS from '../constants/Layout';

import { getItem, mergeItem } from '../api/AsyncDB';

import { ID, WORD, DEFINITION, SCORE } from '../constants/DB';
import { VERBOSE } from '../constants/Meta';


type Props = {
  words: Object,
  sortedScores: Array<number>,
  shuffleFirstWord: number,
};

type State = {
  showed: boolean,
  currentWord: number,
  nextWord: number
}


class ShuffleScreen extends React.Component<Props, State> {

  percentile: Array<number> = [
    0, 2.5, 4.87, 6.82, 8.22, 9.12, 9.57, 9.795, 9.9075, 9.96375, 10
  ];

  constructor(props: Object) {
    super(props);

    var { shuffleFirstWord } = this.props;

    this.state = {
      showed: false,
      currentWord: Number.isInteger(shuffleFirstWord) && shuffleFirstWord >= 1
        ? this.props.shuffleFirstWord
        : this.props.sortedScores[this._getRandomWordIndex()],
      nextWord: this.props.sortedScores[this._getRandomWordIndex()]
    }
  }

  componentWillReceiveProps(nextProps) {

    var currentWord;

    // user clicking notification case
    if (
     (Number.isInteger(nextProps.shuffleFirstWord)) &&
     (nextProps.shuffleFirstWord != this.props.shuffleFirstWord) &&
     (nextProps.shuffleFirstWord > 0)
    ) {
      currentWord = nextProps.shuffleFirstWord;
    } else {
      currentWord = nextProps.sortedScores[this._getRandomWordIndex()];
    }

    this.setState((prevState) => {
      return {
        showed: false,
        currentWord: currentWord,
        nextWord: nextProps.sortedScores[this._getRandomWordIndex()]
      };
    });
    
  }

  render() {
    return (
      <View style={{flex: 1, overflow: 'hidden'}} removeClippedSubviews={true}>
        <ActionBar title='Shuffle' />
        <DynamicViewPager
          getLeftPage={this._getLeftPage}
          getRightPage={this._getRightPage}
          getMainPage={this._getMainPage}
          onSwipedLeft={this._onSwipedLeft}
          onSwipedRight={this._onSwipedRight}
          onSwipedFail={this._onSwipedFail}
        />
      </View>

    );
  }

  _getLeftPage = () => {
    if (this.props.sortedScores.length === 0) {
      return this._blankPage();
    }

    try {
      var word = this.props.words[this.state.nextWord];
      return (
        <View style={[screenGeneral, style.main]}>
          <Text style={style.word}>{ word[WORD] }</Text>
        </View>
      );
    } catch(e) {
      console.log(e);
      throw e;
    }

  }

  _getRightPage = () => {
    if (this.props.sortedScores.length === 0) {
      return this._blankPage();
    }

    var word = this.props.words[this.state.nextWord];
    return (
      <View style={[screenGeneral, style.main]}>
        <Text style={style.word}>{ word[WORD] }</Text>
      </View>
    );
  }

  _getMainPage = () => {
    if (this.props.sortedScores.length === 0) {
      return this._blankPage();
    }

    var word = this.props.words[this.state.currentWord];
    if (!this.state.showed) {
      return (
        <TouchableWithoutFeedback
          onPress={this._show}
          style={screenGeneral}
        >
          <View style={style.main}>
            <Text style={style.word}>{ word[WORD] }</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    } else {
      return (
        <View style={[screenGeneral, style.main]}>
          <Text style={style.word}>{ word[WORD] }</Text>
          <Text style={style.def}>{ word[DEFINITION] }</Text>
        </View>
      );
    }
  }

  _onSwipedLeft = () => {
    if (this.props.sortedScores.length === 0) return;
    var word = this.props.words[this.state.currentWord][WORD];
    getItem(word, (error, result) => {
      var wordObj = JSON.parse(result);
      mergeItem(word, {
        [SCORE]: wordObj[SCORE] + 1
      });
    });
    this._onSwiped();
  }

  _onSwipedRight = () => {
    if (this.props.sortedScores.length === 0) return;
    var word = this.props.words[this.state.currentWord][WORD];
    getItem(word, (error, result) => {
      var wordObj = JSON.parse(result);
      mergeItem(word, {
        [SCORE]: wordObj[SCORE] <= 1 ? 1 : wordObj[SCORE] - 1
      });
    });
    this._onSwiped();
  }

  _onSwipedFail = () => {}

  _blankPage = () => {
    return (
      <View style={[screenGeneral, style.main]}>
        <Text style={style.word}>This deck is empty!</Text>
        <Text style={style.def}>There are currently no words, please add some!</Text>
      </View>
    );
  }

  _getRandomWordIndex = () => {
    var length = this.props.sortedScores.length;
    if (length <= 100) {
      return Math.floor(Math.random() * (length - 0) + 0);
    } else {
      let rand = Math.floor(Math.random() * 10);
      let lower = Math.floor((length/10) * this.percentile[rand]);
      let upper = Math.ceil((length/10) * this.percentile[rand+1]);
      return Math.floor(Math.random() * (upper - lower) + lower);
    }
  }

  _onSwiped = () => {
    var idx = this._getRandomWordIndex();
    if (this.props.sortedScores.length > 5) {
      while (this.props.sortedScores[idx] === this.state.nextWord) {
        idx = this._getRandomWordIndex();
      }
    }

    this.setState((prevState) => {
      return {
        showed: false,
        currentWord: prevState.nextWord,
        nextWord: this.props.sortedScores[idx]
      };
    });
  }

  _show = () => {
    this.setState((prevState) => {
      return {showed: true}
    });
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    shuffleFirstWord: state.shuffleFirstWord,
    words: state.wordData.WORDS,
    sortedScores: state.wordData.SORTED_SCORES
  }
}

export default connect(mapStateToProps)(ShuffleScreen);
