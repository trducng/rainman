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
import { Animated, PanResponder, Text, View } from 'react-native';

import style from '../styles/components/DynamicViewPager';
import CONSTANTS from '../constants/Layout';
import { VERBOSE } from '../constants/Meta';


type Props = {
  onSwipedRight: Function,
  onSwipedLeft: Function,
  onSwipedFail: Function,
  getLeftPage: Function,
  getRightPage: Function,
  getMainPage: Function,
  style?: Object
}

type State = {
  scrollValue: Animated.View
}

/**
 * The DynamicViewPager handles efficiently showing pages through swiping left
 * and right. This component is most effective when the developer cannot
 * know the amount of pages that the view pager should handle, or when the order
 * of pages is unpredictable. Since the content is dynamically generated, this
 * component will not handle data, but instead it will only be responsible for
 * showing the supplied data.
 *
 * Basically, there are 3 main methods that you will need to supply, each
 * method should return a React component:
 *    - getMainPage: will display the current page
 *    - getLeftPage: will display the left page to the current page
 *    - getRightPage: will display the right page to the current page
 *
 * There are also handlers that will fired up when pages are swiped, with self-
 * explanatory name below:
 *    - onSwipedRight
 *    - onSwipedLeft
 *    - onSwipedFail
 *
 *  Users can provide styling with the `style` prop.
 *
 * TODO:
 *    - if any page has animation or video or music (that runs, then swiping)
 *      might refresh it, creating an annoying lag
 *    - handle cases when the amount of page is 0 and 1
 *    - handle non-loop use case
 */
class DynamicViewPager extends React.Component<Props, State> {

  _panResponder: Object;

  constructor(props: Object) {
    super(props);
    this.state = {
      scrollValue: new Animated.Value(0-CONSTANTS.window.width)
    };
  }

  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: (evt, gestureState) => {
        if (VERBOSE >= 5) {
          console.log('DynamicViewPager: onStartShouldSetPanResponder');
        }
        return true;
      },
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (VERBOSE >= 5) {
          console.log('DynamicViewPager: onMoveShouldSetPanResponder');
        }
        return true;
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        if (VERBOSE >= 5) {
          console.log('DynamicViewPager: onMoveShouldSetPanResponderCapture');
        }
        return true;
      },

      onPanResponderGrant: (evt, gestureState) => {
        // The gesture has started. Show visual feedback so the user knows
        // what is happening!

        // gestureState.d{x,y} will be set to zero now
        if (VERBOSE >= 5) {
          console.log('DynamicViewPager: onPanResponderGrant');
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        // The most recent move distance is gestureState.move{X,Y}

        // The accumulated gesture distance since becoming responder is
        // gestureState.d{x,y}
        if (VERBOSE >= 5) {
          console.log('vx: ' + gestureState.vx);
          console.log('vy: ' + gestureState.vy);
          console.log('xO: ' + gestureState.x0);
          console.log('moveX: ' + gestureState.moveX);
        }
        this.state.scrollValue.setValue(-CONSTANTS.window.width + gestureState.dx);
      },
      onPanResponderTerminationRequest: (evt, gestureState) => {
        console.log('onPanResponderTerminationRequest');
        return true;
      },
      onPanResponderRelease: this._handlePanResponseEnd,
      onPanResponderTerminate: this._handlePanResponseEnd,
      onShouldBlockNativeResponder: (evt, gestureState) => {
        // Returns whether this component should block native components from
        // becoming the JS responder. Returns true by default. Is currently
        // only supported on android.
        if (VERBOSE >= 5) {
          console.log('DynamicViewPager: onShouldBlockNativeResponder');
        }
        return true;
      },
    });
  }

  render() {

    var viewWrapper = (this.props.style
      ? style.viewWrapper
      : [style.viewWrapper, this.props.style]);

    return (
      <View style={viewWrapper}>
        <Animated.View
         style={[style.main, {transform: [{translateX: this.state.scrollValue}]}]}
         {...this._panResponder.panHandlers}>
          <View style={style.pageWrapper}>
            {this.props.getLeftPage()}
          </View>
          <View style={style.pageWrapper}>
            {this.props.getMainPage()}
          </View>
          <View style={style.pageWrapper}>
            {this.props.getRightPage()}
          </View>
        </Animated.View>
      </View>
    );
  }

  _handlePanResponseEnd = (e: Object, gestureState: Object) => {

    if (VERBOSE >= 5) {
      console.log('onPanResponderRelease');
      console.log('This is gestureState');
      console.log('stateID: ' + gestureState.stateID);
      console.log('moveX: ' + gestureState.moveX);
      console.log('moveY: ' + gestureState.moveY);
      console.log('x0: ' + gestureState.x0);
      console.log('y0: ' + gestureState.y0);
      console.log('dx: ' + gestureState.dx);
      console.log('dy: ' + gestureState.dy);
      console.log('vx: ' + gestureState.vx);
      console.log('vy: ' + gestureState.vy);
    }

    var relativeSwipeDistance = gestureState.dx / CONSTANTS.window.width;
    var vx = gestureState.vx;

    if (relativeSwipeDistance < -0.3 || (relativeSwipeDistance < 0 && vx <= -1)) {
      Animated.timing(
        this.state.scrollValue,
        { toValue: -2 * CONSTANTS.window.width, duration: 250 }
      ).start((event) => {
        if (event.finished) {
          if (VERBOSE >= 4) {
            console.log("onSwipedRight");
          }
          this.props.onSwipedRight();
          this.state.scrollValue.setValue(-CONSTANTS.window.width);
        }
      });
    } else if (relativeSwipeDistance > 0.3 || (relativeSwipeDistance > 0 && vx >= 1)) {
      Animated.timing(
        this.state.scrollValue,
        { toValue: 0, duration: 250 }
      ).start((event) => {
        if (event.finished) {
          if (VERBOSE >= 4) {
            console.log("onSwipedLeft");
          }
          this.props.onSwipedLeft();
          this.state.scrollValue.setValue(-CONSTANTS.window.width);
        }
      });
    } else {
      Animated.timing(
       this.state.scrollValue,
       {toValue: -CONSTANTS.window.width, duration: 200 }
      ).start((event) => {
        if (event.finished) {
          if (VERBOSE >= 4) {
            console.log('onSwipedFail');
            console.log('vx: ' + vx);
          }
          this.props.onSwipedFail();
        }
      });
    }
  }
}

export default DynamicViewPager;
