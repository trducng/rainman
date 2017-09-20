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
import { Animated, Dimensions, PanResponder, Text, View } from 'react-native';


class DynamicViewPager extends React.Component {

  constructor(props) {
    super(props);
    var deviceWidth = Dimensions.get('window').width;
    this.state = {
      currentPage: 0,
      allPages: ["Page 1", "Page 2", "Page 3", "Page 4"],
      swiping: false,
      scrollValue: new Animated.Value(0-deviceWidth),
    };
  }

  _handlePanResponseEnd = (e: Object, gestureState: Object) => {
    // console.log('onPanResponderRelease');
    // console.log('This is gestureState');
    // console.log('stateID: ' + gestureState.stateID);
    // console.log('moveX: ' + gestureState.moveX);
    // console.log('moveY: ' + gestureState.moveY);
    // console.log('x0: ' + gestureState.x0);
    // console.log('y0: ' + gestureState.y0);
    // console.log('dx: ' + gestureState.dx);
    // console.log('dy: ' + gestureState.dy);
    // console.log('vx: ' + gestureState.vx);
    // console.log('vy: ' + gestureState.vy);
    var deviceWidth = Dimensions.get('window').width;
    var relativeSwipeDistance = gestureState.dx / Dimensions.get('window').width;
    var vx = gestureState.vx;

    if (relativeSwipeDistance < -0.3 ||
        (relativeSwipeDistance < 0 && vx <= -1)) {
      Animated.timing(this.state.scrollValue,
        {
          toValue: -2 * deviceWidth,
          duration: 250
        }).start((event) => {
          if (event.finished) {
            this.setState(prevState => {
              return {
                currentPage: (prevState.currentPage + 1) % 4,
              };
            });
            this.state.scrollValue.setValue(-deviceWidth);
          }
        });
      console.log("Swipe right");
      console.log('currentPage: ' + this.state.currentPage)
    } else if (relativeSwipeDistance > 0.3 ||
        (relativeSwipeDistance > 0 && vx >= 1)) {
      Animated.timing(this.state.scrollValue,
        {
          toValue: 0,
          duration: 250
        }).start((event) => {
          if (event.finished) {
            this.setState(prevState => {
              return {
                currentPage: (prevState.currentPage + 1) % 4
              };
            });
            this.state.scrollValue.setValue(-deviceWidth);
          }
        });
      console.log("Swipe left");
      console.log('currentPage: ' + this.state.currentPage);
    } else {
      Animated.timing(this.state.scrollValue,
        {
          toValue: -deviceWidth,
          duration: 200
        }).start();
      console.log("No swipe!");
      console.log('vx: ' + vx);
    }
    console.log('End swipe!');
    console.log('');

  }

  _getLeftPage = () => {
    console.log('Get Left Page');
    var deviceWidth = Dimensions.get('window').width;
    return (
      <View style={{width: deviceWidth, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 20}}>{this.state.allPages[(this.state.currentPage+1) % 4]}</Text>
      </View>
    );
  }

  _getRightPage = () => {
    console.log('Get Right Page');
    var deviceWidth = Dimensions.get('window').width;
    return (
      <View style={{width: deviceWidth, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 20}}>{this.state.allPages[(this.state.currentPage+1) % 4]}</Text>
      </View>
    );
  }

  _getMainPage = () => {
    console.log('Get Main Page');
    var deviceWidth = Dimensions.get('window').width;
    return (
      <View style={{width: deviceWidth, flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text style={{fontSize: 20}}>{this.state.allPages[this.state.currentPage]}</Text>
      </View>
    );
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        // console.log('onStartShouldSetPanResponder');
        return true;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // console.log('onMoveShouldSetPanResponder');
        return true;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        // console.log('onMoveShouldSetPanResponderCapture');
        return true;
      },

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.d{x,y} will be set to zero now
        // console.log('onPanResponderGrant');
        console.log('Start swipe');
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}

        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        // console.log('vx: ' + gestureState.vx);
        // console.log('vy: ' + gestureState.vy);
        // console.log('xO: ' + gestureState.x0);
        // console.log('moveX: ' + gestureState.moveX);
        var deviceWidth = Dimensions.get('window').width;
        this.state.scrollValue.setValue(-deviceWidth + gestureState.dx);
      },
      onPanResponderTerminationRequest: (evt, gestureState) => {
        console.log('onPanResponderTerminationRequest');
        return true;
      },
      onPanResponderRelease: this._handlePanResponseEnd,
      onPanResponderTerminate: (evt, gestureState) => {
        // Another component has become the responder, so this gesture
        // should be cancelled
        console.log('onPanResponderTerminate');
      },
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from
        // becoming the JS responder. Returns true by default. Is currently
        // only supported on android.
        // console.log('onShouldBlockNativeResponder');
        return true;
      },
    });
  }

  render() {
    var deviceWidth = Dimensions.get('window').width;
    const style = {
      width: 3 * deviceWidth,
      flex: 1,
      flexDirection: 'row'
    }

    // var translateX = this.state.scrollValue.interpolate({
    //   inputRange: [-deviceWidth, deviceWidth],
    //   outputRange:
    // });

    return (
      <View style={{flex: 1}}>
        <Animated.View style={[style, {transform: [{translateX: this.state.scrollValue}]}]} {...this._panResponder.panHandlers}>
          {this._getLeftPage()}
          {this._getMainPage()}
          {this._getRightPage()}
        </Animated.View>
      </View>
    );
  }

}

export default DynamicViewPager;
