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
import { Platform, TouchableHighlight, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import style from '../styles/components/StatusBarButtonHolder';


type Props = {
  onEdit?: Function,
  onDelete?: Function,
  onShare?: Function,
  onOpenSetting?: Function,
}


export default class StatusBarButtonHolder extends React.Component<Props> {
  render() {
    var buttons = [];

    if (typeof this.props.onShare !== 'undefined') {
      let shareIcon = Platform.OS === 'ios' ? 'ios-share-outline' : 'md-share';
      buttons.push(
        <TouchableHighlight key='share' onPress={this.props.onShare}>
          <Ionicons name={shareIcon} size={25} color={'white'} style={style.icon} />
        </TouchableHighlight>
      )
    }

    if (typeof this.props.onEdit !== 'undefined') {
      let editIcon = Platform.OS === 'ios' ? 'ios-create-outline' : 'ios-create';
      buttons.push(
        <TouchableHighlight key='edit' onPress={this.props.onEdit}>
          <Ionicons name={editIcon} size={25} color={'white'} style={style.icon} />
        </TouchableHighlight>
      );
    }

    if (typeof this.props.onDelete !== 'undefined') {
      let removeIcon = Platform.OS === 'ios' ? 'ios-trash-outline' : 'md-trash';
      buttons.push(
        <TouchableHighlight key='remove' onPress={this.props.onDelete}>
          <Ionicons name={removeIcon} size={25} color={'white'} style={style.icon} />
        </TouchableHighlight>
      );
    }

    if (typeof this.props.onOpenSetting !== 'undefined') {
      let settingIcon = Platform.OS === 'ios' ? 'ios-settings-outline' : 'md-settings';
      buttons.push(
        <TouchableHighlight key='settings' onPress={this.props.onOpenSetting}>
          <Ionicons name={settingIcon} size={25} color={'white'} style={style.icon} />
        </TouchableHighlight>
      )
    }

    return (
      <View style={style.main} >
        {buttons.map((item) => item)}
      </View>
    );
  }
}
