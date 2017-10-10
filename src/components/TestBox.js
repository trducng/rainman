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
import { View, Text, TouchableWithoutFeedback } from 'react-native';

import style from '../styles/components/TestBox';


type Props = {
  question: string,
  correct: string,
  incorrect: Array<string>,
  onUpdate: Function,
}

type State = {
  correctChoice: number,
  userChoice: number,
  selectable: boolean,
}

class TestBox extends React.Component<Props, State> {

  constructor(props: Object) {
    super(props);

    this.state = {
      correctChoice: this._getRandomIndex(),
      userChoice: 0,
      selectable: true,
    };
  }

  componentWillReceiveProps(nextProps: Object) {
    if (nextProps.question !== this.props.question) {
      this.setState({
        correctChoice: this._getRandomIndex(),
        userChoice: 0,
        selectable: true
      });
    }
  }

  render() {
    return (
      <View style={style.main}>
        <Text style={style.question}>{ this.props.question }?</Text>
        { this.getChoices() }
      </View>
    );
  }

  getChoices = () => {
    var { correct, incorrect } = this.props;
    var items = [];
    var key = 1, incorrectIdx = 0;

    while (key <= incorrect.length+1) {
      let selected = key === this.state.userChoice;
      let correctChoice = key === this.state.correctChoice;
      let text = correctChoice ? correct : incorrect[incorrectIdx++];

      items.push(this._getChoice(key, selected, correctChoice, text));
      key++;
    }

    return items;
  }

  _getChoice = (key: number, selected: boolean, correct: boolean, text: string) => {
    if (!selected) {
      return this._getChoiceComponent(
        key, text, correct, selected, [style.choiceWrapper], [style.choiceText]
      );
    }

    let choiceWrapper = correct
      ? [style.choiceWrapper, style.choiceWrapperCorrect]
      : [style.choiceWrapper, style.choiceWrapperIncorrect];
    let textWrapper = correct
      ? [style.choiceText, style.choiceTextCorrect]
      : [style.choiceText, style.choiceTextIncorrect];

    return this._getChoiceComponent(
      key, text, correct, selected, choiceWrapper, textWrapper
    );

  }

  _getChoiceComponent = ( key: number, text: string, correct: boolean,
   selected: boolean, wrapperStyle: Array<Object>, textStyle: Array<Object>) => {

    return (
      <TouchableWithoutFeedback key={key.toString()}
       onPress={() => {
         if (!this.state.selectable) return;
         if (correct) {
           this.setState({ userChoice: key, selectable: false });
           setTimeout(this.props.onUpdate, 1000);
         } else {
           this.setState({ userChoice: key });
         }
       }}>
        <View style={wrapperStyle}>
          <Text style={textStyle}>{ text }</Text>
        </View>
      </TouchableWithoutFeedback>
    );

  }

  _getRandomIndex = () => {
    return Math.floor(Math.random() * (this.props.incorrect.length+1) + 1);
  }
}

export default TestBox;
