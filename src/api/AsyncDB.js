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

import { AsyncStorage } from 'react-native';
import { VERBOSE } from '../constants/Meta';

export const retrieveAll = (callback: Function) => {
  AsyncStorage.getAllKeys((err, keys) => {
    AsyncStorage.multiGet(keys, callback);
  });
};

export const setItem = (k: string, v: Object) => {
  AsyncStorage.setItem(k, JSON.stringify(v), (err) => {
    if (VERBOSE >= 5) {
      console.log(`AsyncDB: setItem - ${k}`);
    }
  });
};

export const getItem = (k: string, f: Function) => {
  AsyncStorage.getItem(k, f);
};

export const deleteItem = (k: string, callback?: Function) => {
  if (typeof callback === 'undefined') {
    AsyncStorage.removeItem(k);
  } else {
    AsyncStorage.removeItem(k, callback);
  }
};

export const multiRemove = (k: Array<string>, callback?: Function) => {
  if (typeof callback === 'undefined') {
    AsyncStorage.multiRemove(k);
  } else {
    AsyncStorage.multiRemove(k, callback);
  }
};

export const mergeItem = (k: string, v: Object) => {
  AsyncStorage.mergeItem(k, JSON.stringify(v));
};
