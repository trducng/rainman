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

import StatusBarButtonHolder from '../components/StatusBarButtonHolder';
import InputTextWithLabel from '../components/InputTextWithLabel';
import ListSelectable from '../components/ListSelectable';
import NormalButton from '../components/NormalButton';

import { ID, WORD, DEFINITION,
         NOUN, VERB, ADJECTIVE, ADVERB, SCORE } from '../constants/DB';

import { editWord } from '../api/WordActions';
import { deleteItem, mergeItem, multiRemove, setItem } from '../api/AsyncDB';


type Props = {
    onEdit: Function,
    navigation: Object,
    allWords: Array<Object>
}

type State = {
  id?: number,
  word: string,
  oldWord: string,
  def?: string,
  n?: boolean,
  v?: boolean,
  adj?: boolean,
  adv?: boolean
}


class EditScreen extends React.Component<Props, State> {

  static navigationOptions = ({navigation}) => {
    let { params } = navigation.state;
    return {
      title: 'Edit Word',
      headerTintColor: 'white',
      headerStyle: appBarStyle
    }
  }

  constructor(props) {
    super(props);

    let { params } = this.props.navigation.state;
    this.state = {
      id: typeof params === 'undefined' ? -1 : params.word[ID],
      word: typeof params === 'undefined' ? '' : params.word[WORD],
      oldWord: typeof params === 'undefined'? '' : params.word[WORD],
      def: typeof params === 'undefined' ? '' : params.word[DEFINITION],
      n: typeof params === 'undefined' ? false : params.word[NOUN],
      v: typeof params === 'undefined' ? false : params.word[VERB],
      adj: typeof params === 'undefined' ? false : params.word[ADJECTIVE],
      adv: typeof params === 'undefined' ? false : params.word[ADVERB],
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
      <View style={screenGeneral}>
        <InputTextWithLabel
          multiline={false} label={'Word'} value={this.state.word}
          onChangeText={(text) => this.setState({word: text})} />
        <InputTextWithLabel
          multiline={true} label={'Definition'} value={this.state.def}
          onChangeText={(text) => this.setState({def: text})}/>
        <ListSelectable items={vocabTypes} />
        <NormalButton
          onPress={this._onEdit}/>
      </View>
    );

  }

  _onEdit = () => {
    var obj = {};
    obj[ID] = this.state.id; obj[WORD] = this.state.word;
    obj[DEFINITION] = this.state.def; obj[NOUN] = this.state.n;
    obj[VERB] = this.state.v; obj[ADJECTIVE] = this.state.adj;
    obj[ADVERB] = this.state.adv;

    var wordNotExisted = true;
    var theSameWords = (this.state.word.toLowerCase()
      === this.state.oldWord.toLowerCase());

    if (theSameWords) {
      mergeItem(this.state.oldWord, obj);
    } else {
      wordNotExisted = (this.props.allWords.findIndex((wordObj, index) => {
        return wordObj[WORD] === this.state.word
      }) === -1);

      if (wordNotExisted) {
        deleteItem(this.state.oldWord, () => {
          setItem(this.state.word, obj);
        });
      }
    }

    if (wordNotExisted) {
      this.props.onEdit(
        this.state.id, this.state.word, this.state.def,
        this.state.n, this.state.v, this.state.adj, this.state.adv,
        this.state.oldWord, wordNotExisted
      );
      this.props.navigation.goBack();
    } else {
      Alert.alert(
        `Possible duplication`,
        (`The word '${this.state.word}' already exists. ` +
         `The old word will be replaced. Do you wish to continue?`),
        [
          {text: 'Cancel'},
          {text: 'Replace', onPress: () => {
            this.props.onEdit(
              this.state.id, this.state.word, this.state.def,
              this.state.n, this.state.v, this.state.adj, this.state.adv,
              this.state.oldWord, wordNotExisted
            );
            this.props.navigation.goBack();
            multiRemove([this.state.oldWord, this.state.word], () => {
              setItem(this.state.word, obj);
            });
          }}
        ],
        { cancelable: false }
      );
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    allWords: state.wordData.ALL_WORDS
  };
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onEdit: (id, word, def, n, v, adj, adv, oldWord, wordNotExisted) => {
      dispatch(editWord(id, word, def, n, v, adj, adv, oldWord, wordNotExisted));
    },
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(EditScreen);
