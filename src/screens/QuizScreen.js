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
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

import { appBarStyle } from '../styles/';
import { screenGeneral } from '../styles/screens';
import style from '../styles/screens/QuizScreen';

import { Queue, randInt, choice } from '../api/utils';

import StatusBarButtonHolder from '../components/StatusBarButtonHolder';
import TestBox from '../components/TestBox';

import { WORD, DEFINITION } from '../constants/DB';


type Props = {
  words: Array<Object>,
  ids: Array<number>,
  nouns: Array<number>,
  verbs: Array<number>,
  adjs: Array<number>,
  advs: Array<number>
}

type State = {
  avoid: Queue,
  l0: Array<number>,
  l1: Array<number>,
  l2: Array<number>,
  l3: Array<number>,
  question: string,
  correct: string,
  incorrect: Array<string>
}

class QuizScreen extends React.Component<Props, State> {

  static navigationOptions = {
    title: 'Quiz',
    headerTintColor: 'white',
    headerStyle: appBarStyle
  };

  constructor(props) {
    super(props);

    var queueLength = Math.min(Math.floor(props.ids.length / 2), 10);
    this.state = {
      length: props.ids.length,
      avoid: new Queue(queueLength),
      l0: props.nouns,
      l1: props.verbs,
      l2: props.adjs,
      l3: props.advs,
      question: '',
      correct: '',
      incorrect: []
    };
  }

  componentWillMount() {
    this.prepareQA();
  }

  render() {
    if (this.props.ids.length < 2) {
      return (
        <View style={[screenGeneral, style.main]}>
          <Text style={style.def}>
            The current amount of number is indequate to quiz
            , please add more words to proceed
          </Text>
        </View>
      );
    }

    return (
      <View style={[screenGeneral, style.main]}>
        <TestBox
         correct={this.state.correct}
         incorrect={this.state.incorrect}
         question={this.state.question}
         onUpdate={this.prepareQA} />
      </View>
    );
  }

 prepareQA = () => {
   var wordPool = this._getWordPool();
   var question = this._checkValidChoices(wordPool);

   question = question !== -1
    ? wordPool.splice(question, 1)[0]
    : [
        ...wordPool.slice(0, wordPool.indexOf(this.state.avoid.peekNewest())),
        ...wordPool.slice(wordPool.indexOf(this.state.avoid.peekNewest())+1)
      ].splice(randInt(0, 2), 1, this.state.avoid.peekNewest())[0];

   var order = Math.random() > 0.5 ? [WORD, DEFINITION] : [DEFINITION, WORD];

   this.setState(prevState => {
     return {
       question: this.props.words[question][order[0]],
       correct: this.props.words[question][order[1]],
       incorrect: wordPool.map(item => this.props.words[item][order[1]]),
       avoid: prevState.avoid.immutePush(question)
     }
   })
 }

  /**
   * Get a collection of word indices that will be used as questions and
   * answers.
   */
  _getWordPool = (): Array<number> => {
    var rand = 'l' + randInt(0, 3).toString(),
        grace = 5;
    var array = this.state[rand].length>15 ? this.state[rand] : this.props.ids;

    var result = choice(array, 4);
    while ((this._checkValidChoices(result) === -1) && (grace-- > 0)) {
      result = choice(array, 4);
    }

    return result;
  }

  /**
   * Return the index of first element in `choices` that does not appear in
   * this.state.avoid. Return -1 if none satisfies.
   */
  _checkValidChoices = (choices: Array<number>): number => {
    for (var i=0; i<choices.length; i++) {
      if (!this.state.avoid.contains(choices[i])) {
        return i;
      }
    }
    return -1;
  }

}

const mapStateToProps = (state, ownProps) => {
  return {
    words: state.wordData.WORDS,
    ids: state.wordData.ALL_IDS,
    nouns: state.wordData.NOUNS,
    verbs: state.wordData.VERBS,
    adjs: state.wordData.ADJECTIVES,
    advs: state.wordData.ADVERBS
  }
}


export default connect(mapStateToProps)(QuizScreen);
