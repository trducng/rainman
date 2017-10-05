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
import { connect } from 'react-redux';

import { appBarStyle } from '../styles';
import { screenGeneral } from '../styles/screens';
import style from '../styles/screens/ShuffleScreen';

import { changeWordScore } from '../api/WordActions';
import DynamicViewPager from '../components/DynamicViewPager';

import { ID, WORD, DEFINITION } from '../constants/DB';
import { VERBOSE } from '../constants/Meta';


type Props = {
  sortedScores: Object,
  changeScore: Function,
};

type State = {
  show: boolean
}


class ShuffleScreen extends React.Component<Props, State> {

  static navigationOptions = {
    title: 'Shuffle',
    headerTintColor: 'white',
    headerStyle: appBarStyle,
  }

  constructor(props: Object) {
    super(props);
    this.state = {
      show: false
    }
  }

  render() {
    return (
      <DynamicViewPager
        getLeftPage={this._getLeftPage}
        getRightPage={this._getRightPage}
        getMainPage={this._getMainPage}
        onSwipedLeft={this._onSwipedLeft}
        onSwipedRight={this._onSwipedRight}
        onSwipedFail={this._onSwipedFail}
      />
    );
  }

  _getLeftPage = () => {
    return (
      <View style={[screenGeneral, style.main]}>
        <Text style={style.word}>The next word</Text>
      </View>
    );
  }

  _getRightPage = () => {
    return (
      <View style={[screenGeneral, style.main]}>
        <Text style={style.word}>The next word</Text>
      </View>
    );
  }

  _getMainPage = () => {
    console.log('Show: ' + this.state.show.toString());
    if (!this.state.show) {
      return (
        <TouchableWithoutFeedback
          onPress={this._show}
          style={screenGeneral}
        >
          <View style={style.main}>
            <Text style={style.word}>The current word</Text>
          </View>
        </TouchableWithoutFeedback>
      );
    } else {
      return (
        <View style={[screenGeneral, style.main]}>
          <Text style={style.word}>The current word</Text>
          <Text style={style.def}>Tadaaaaa it shows</Text>
        </View>
      );
    }
  }

  _show = () => {
    this.setState((prevState) => {
      return {show: true}
    });
  }

  _onSwipedLeft = () => {
    this.setState((prevState) => {
      return {show: false}
    });
  }

  _onSwipedRight = () => {
    this.setState((prevState) => {
      return {show: false}
    });
  }

  _onSwipedFail = () => {}
}

const mapStateToProps = (state, ownProps) => {
  return {
    sortedScores: state.wordData.SORTED_SCORES
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    changeScore: (word, increase) => dispatch(changeWordScore(word, increase)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ShuffleScreen);
