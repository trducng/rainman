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
import { Platform, TextInput, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import style from '../styles/components/SearchBox';


type Props = {
  onChangeText: Function,
  value: string
}


export class SearchBox extends React.Component<Props> {
  render() {
    let iconName = Platform.OS === 'ios' ? 'ios-search' : 'md-search';

    return (
      <View style={style.wrapper}>
        <View style={style.main}>
          <Ionicons name={iconName} size={20} color={'white'} style={style.icon}/>
          <TextInput
            autoCorrect={false} style={style.text}
            placeholder={"Search"} placeholderTextColor={'white'}
            returnKeyType={'search'} selectTextOnFocus={true}
            underlineColorAndroid={'transparent'} returnKeyType={'next'}
            onChangeText={this.props.onChangeText}
            value={this.props.value}
          />
        </View>
      </View>
    );
  }
}

export default SearchBox;
