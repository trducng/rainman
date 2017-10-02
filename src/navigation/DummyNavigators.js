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
 * This file contains many dummy navigators, intended to make use of react-
 * navigation's status bar of Stack navigator (to avoid potential implementation
 * errors and inconsistencies)
 */

import React from 'react';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import EditScreen from '../screens/EditScreen';
import WordScreen from '../screens/WordScreen';
import QuizScreen from '../screens/QuizScreen';


type Props = {
  dispatch: Function,
  nav: Object
}


/**
 * Create all stack navigators for these single screens
 */
export const AddScreenNavigator = StackNavigator({
  DummyAdd: { screen: EditScreen },
});

export const WordScreenNavigator = StackNavigator({
  DummyDetail: { screen: WordScreen },
});

export const QuizScreenNavigator = StackNavigator({
  DummyQuiz: { screen: QuizScreen},
});


/**
 * Create wrapper for those navigators
 */
class AddScreenWrapper extends React.Component<Props> {
  render() {
    return (
      <AddScreenNavigator
        navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.nav
        })}
      />
    );
  }
}

class WordScreenWrapper extends React.Component<Props> {
  render() {
    return (
      <WordScreenNavigator
        navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.nav
        })}
      />
    );
  }
}

class QuizScreenWrapper extends React.Component<Props> {
  render() {
    return (
      <QuizScreenNavigator
        navigation={addNavigationHelpers({
          dispatch: this.props.dispatch,
          state: this.props.nav
        })}
      />
    );
  }
}


/**
 * Integrate react-navigation to redux
 */
const mapStateToPropsAdd = state => ({nav: state.navAdd });
const AddNavigator = connect(mapStateToPropsAdd)(AddScreenWrapper);

const mapStateToPropsWord = state => ({nav: state.navWord});
const WordNavigator = connect(mapStateToPropsWord)(WordScreenWrapper);

const mapStateToPropsQuiz = state => ({nav: state.navQuiz});
const QuizNavigator = connect(mapStateToPropsQuiz)(QuizScreenWrapper);


/**
 * Some minor edits and export
 */
AddNavigator.navigationOptions = {title: 'Add'};
WordNavigator.navigationOptions = {title: 'Shuffle'};
QuizNavigator.navigationOptions = {title: 'Quiz'};

export { AddNavigator, WordNavigator, QuizNavigator };
