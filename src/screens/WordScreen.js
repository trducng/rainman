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

import { appBarStyle } from '../styles';
import { screenGeneral } from '../styles/screens';
import style from '../styles/screens/WordScreen';

import StatusBarButtonHolder from '../components/StatusBarButtonHolder';
import DynamicViewPager from '../components/DynamicViewPager';

import { INDEX, WORD, DEFINITION } from '../constants/DB';


class WordScreen extends React.Component {

  static navigationOptions = ({ navigation }) => {
    let { params } = navigation.state;
    return {
      title: 'Word Detail',
      headerTintColor: 'white',
      headerStyle: appBarStyle,
      headerRight: (<StatusBarButtonHolder
          onDelete={() => console.log('Delete index: ' + params.data[params.index][INDEX])}
          onEdit={() => navigation.navigate('Edit', {word: params.data[params.index]})} />
      ),
    }
  }

  constructor(props: Object) {
    super(props);
    this.state = {
      currentPage: 0,
      allPages: ["Page 1", "Page 2", "Page 3", "Page 4"],
    }
  }

  render() {
    var { params } = this.props.navigation.state;

    if (typeof params === 'undefined') {
      return <View><Text>Empty</Text></View>;
    }

    // return (
    //   <View style={[screenGeneral, style.main]}>
    //     <Text style={style.word}>{params.data[params.index][WORD]}</Text>
    //     <Text style={style.def}>{params.data[params.index][DEFINITION]}</Text>
    //   </View>
    // );
    return (
      <DynamicViewPager
        onSwipedRight={this._onSwipedRight}
        onSwipedLeft={this._onSwipedLeft}
        onSwipedFail={this._onSwipedFail}
        getLeftPage={this._getLeftPage}
        getRightPage={this._getRightPage}
        getMainPage={this._getMainPage}
      />
    );
  }

  _getLeftPage = () => {
    console.log('Get Left Page');
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text style={{fontSize: 20}}>{this.state.allPages[(this.state.currentPage+1) % 4]}</Text>
      </View>
    );
  }

  _getRightPage = () => {
    console.log('Get Right Page Holaaaaaaaaaaaaaaa');
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text style={{fontSize: 20}}>{this.state.allPages[(this.state.currentPage+1) % 4]}</Text>
      </View>
    );
  }

  _getMainPage = () => {
    console.log('Get Main Page');
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text style={{fontSize: 20}}>{this.state.allPages[this.state.currentPage]}</Text>
      </View>
    );
  }

  _onSwipedRight = () => {
    this.setState(prevState => {
      return {
        currentPage: (prevState.currentPage + 1) % 4,
      };
    });
  }

  _onSwipedLeft = () => {
    this.setState(prevState => {
      return {
        currentPage: (prevState.currentPage + 1) % 4
      };
    });
  }

  _onSwipedFail = () => {}

}

export default WordScreen;
