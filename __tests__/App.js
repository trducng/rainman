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

import 'react-native';
import React from 'react';
import App from '../App';
import renderer from 'react-test-renderer';

// remove all the keys named 'key', crude implementation
const filterKeys = (state) => {
  if ( (state instanceof Function)
    || (state instanceof String)
    || (state instanceof Number) ) {
    return state;

  } else if (state instanceof Array) {

    var result = [];
    for (var idx=0; idx < state.length; idx++) {
      result.push(filterKeys(state[idx]));
    }
    // console.log(state.length);
    return result;

  } else if (state instanceof Object) {

    var result = {};
    for (var key in state) {
      if (Object.prototype.hasOwnProperty.call(state, key)
        && !(key === 'key')) {
        // console.log(key);
        result[key] = filterKeys(state[key]);
      }
    }
    return result;

  } else {
    return state;
  }
}

var a = {
  'name': {
    'routes': [
      {
        'route': {
          'key': 'Init-id-12312331',
          'routeName': 'List'
        },
        'id': 'asdalk;kljlsdkf'
      },
      {
        'route': {
          'key': 'Init-id-121112121211',
          'routeName': 'Quiz'
        },
        'id': 'asdfasdfasdfas'
      }
    ],
    'confusing': {
      'hello': 'world',
      'love': 'Mai'
    }
  },
  'dummyShit': 21231,
  'otherDummyShit': 'hkljdflsk'
}


test('renders the loading screen', async () => {
  const tree = renderer.create(<App />).toJSON();
  expect(tree).toMatchSnapshot();
});

// // test('renders the root without loading screen', async () => {
// //   const tree = filterKeys(renderer.create(<App skipLoadingScreen />).toJSON());
// //   expect(tree).toMatchSnapshot();
// // });
