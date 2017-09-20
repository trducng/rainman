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
import { Button, View, Text } from 'react-native';
import { connect } from 'react-redux';

import { appBarStyle } from '../styles/';
import { screenGeneral } from '../styles/screens';

import StatusBarButtonHolder from '../components/StatusBarButtonHolder';
import InputTextWithLabel from '../components/InputTextWithLabel';
import ListSelectable from '../components/ListSelectable';
import NormalButton from '../components/NormalButton';

import { INDEX, WORD, DEFINITION,
         NOUN, VERB, ADJECTIVE, ADVERB, SCORE } from '../constants/DB';

import { editWord } from '../api/WordActions';
import { mergeItem } from '../api/AsyncDB';


class EditScreen extends React.Component {

  constructor(props) {
    super(props);

    let { params } = this.props.navigation.state;
    this.state = {
      id: typeof params === 'undefined' ? -1 : params.word[INDEX],
      word: typeof params === 'undefined' ? '' : params.word[WORD],
      def: typeof params === 'undefined' ? '' : params.word[DEFINITION],
      n: typeof params === 'undefined' ? false : params.word[NOUN],
      v: typeof params === 'undefined' ? false : params.word[VERB],
      adj: typeof params === 'undefined' ? false : params.word[ADJECTIVE],
      adv: typeof params === 'undefined' ? false : params.word[ADVERB],
    }
  }

  static navigationOptions = ({navigation}) => {
    let { params } = navigation.state;
    return {
      title: 'Edit Word',
      headerTintColor: 'white',
      headerStyle: appBarStyle,
      headerRight: (<StatusBarButtonHolder
        onDelete={() => console.log('Delete: ' + params.word['word'])}
      />),
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
          onPress={() => {

            this.props.onEdit(this.state.id, this.state.word,
              this.state.def, this.state.n, this.state.v,
              this.state.adj, this.state.adv);

            // TODO: change key from word to index
            let obj = {};
            obj[INDEX] = this.state.id; obj[WORD] = this.state.word;
            obj[DEFINITION] = this.state.def; obj[NOUN] = this.state.n;
            obj[VERB] = this.state.v; obj[ADJECTIVE] = this.state.adj;
            obj[ADVERB] = this.state.adv;
            mergeItem(this.state.word, obj);

            this.props.navigation.goBack();
          }}/>
      </View>
    );

  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
}
const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onEdit: (id, word, def, n, v, adj, adv) => dispatch(editWord(id, word, def, n, v, adj, adv)),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(EditScreen);
