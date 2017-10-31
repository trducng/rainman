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
import { Alert, Button, View, Text } from 'react-native';
import { connect } from 'react-redux';

import { appBarStyle } from '../styles/';
import { screenGeneral } from '../styles/screens';

import ActionBar from '../components/ActionBar';
import StatusBarButtonHolder from '../components/StatusBarButtonHolder';
import InputTextWithLabel from '../components/InputTextWithLabel';
import ListSelectable from '../components/ListSelectable';
import NormalButton from '../components/NormalButton';

import { DEFAULT_SCORE, VERBOSE, DAYS_IN_MILISECS,
         INSTALLED_DAY } from '../constants/Meta';

import { ID, WORD, DEFINITION, NOUN, VERB,
         ADJECTIVE, ADVERB, SCORE, LAST_OPENED } from '../constants/DB';

import { addWord } from '../api/WordActions';
import { setItem } from '../api/AsyncDB';


type Props = {
  words: Object,
  ids: Array<number>,
  onAdd: Function
};

type State = {
  word: string,
  def: string,
  n: boolean,
  v: boolean,
  adj: boolean,
  adv: boolean
};


class AddScreen extends React.Component<Props, State> {

  constructor(props: Object) {
    super(props);
    this.state = {
      word: '',
      def: '',
      n: false,
      v: false,
      adj: false,
      adv: false
    }
  }

  render() {
    let vocabTypes = [
      {key: 'Noun',
       fill: this.state.n,
       onPress: () => this.setState(prevState => ({n: !prevState.n}))},
      {key: 'Verb',
       fill: this.state.v,
       onPress: () => this.setState(prevState => ({v: !prevState.v}))},
      {key: 'Adjective',
       fill: this.state.adj,
       onPress: () => this.setState(prevState => ({adj: !prevState.adj}))},
      {key: 'Adverb',
       fill: this.state.adv,
       onPress: () => this.setState(prevState => ({adv: !prevState.adv}))},
    ];

    return (
      <View style={{flex: 1}}>
        <ActionBar title='Add' />
        <View style={screenGeneral}>
          <InputTextWithLabel
            multiline={false} label={'Word'} value={this.state.word}
            onChangeText={(text) => this.setState({word: text})} />
          <InputTextWithLabel
            multiline={true} label={'Definition'} value={this.state.def}
            onChangeText={(text) => this.setState({def: text})}/>
          <ListSelectable items={vocabTypes} />
          <NormalButton value='Add' onPress={this._onAdd}/>
        </View>
      </View>

    );
  }

  _reset = () => {
    this.setState({
      word: '',
      def: '',
      n: false,
      v: false,
      adj: false,
      adv: false
    });
  }

  _onAdd = () => {
    if (this._checkIsEmpty()) {
      Alert.alert(
        'Word and Definition are required',
        'Please fill in both Word and Definition',
        [{text: 'OK'}]
      );
      return
    }

    if (this._checkIsDuplicate()) {
      Alert.alert(
        `Word '${this.state.word}' already exists`,
        `Please add new word or correct '${this.state.word}' in the word list`,
        [
          {text: 'Cancel'},
          {text: 'Reset', onPress: this._reset}
        ]
      );
      return
    }

    var obj = {};
    obj[WORD] = this.state.word; obj[DEFINITION] = this.state.def;
    obj[NOUN] = this.state.n; obj[VERB] = this.state.v;
    obj[ADJECTIVE] = this.state.adj; obj[ADVERB] = this.state.adv;
    obj[SCORE] = DEFAULT_SCORE;
    obj[LAST_OPENED] = Math.round(Date.now() / DAYS_IN_MILISECS) - INSTALLED_DAY;
    if (this.props.ids.length > 0) {
      obj[ID] = this.props.ids[this.props.ids.length-1] + 1;
    } else {
      obj[ID] = 1;
    }

    this.props.onAdd(
      obj[ID], obj[WORD], obj[DEFINITION], obj[NOUN], obj[VERB],
      obj[ADJECTIVE], obj[ADVERB]
    );
    setItem(this.state.word, obj);
    this._reset();
  }

  _checkIsEmpty = (): boolean => {
    if (this.state.word.trim() === '' || this.state.def.trim() === '') {
      return true
    }
    return false
  }

  _checkIsDuplicate = (): boolean => {
    var { words, ids } = this.props;
    for (var i=0, l=ids.length; i<l; i++) {
      if (words[ids[i]][WORD] === this.state.word) {
        return true;
      }
    }
    return false;
  }

}


const mapStateToProps = (state, ownProps) => {
  return {
    words: state.wordData.WORDS,
    ids: state.wordData.ALL_IDS
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onAdd: (id, word, def, n, v, adj, adv) => {
      dispatch(addWord(id, word, def, n, v, adj, adv))
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(AddScreen);
