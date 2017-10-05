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

import { setCurrentWord, editWord, deleteWord,
         addWord, changeScore } from '../../src/api/WordActions';

test('display with word index action', () => {
  let result = {
    type: 'SET_CURRENT_WORD',
    index: 5
  };
  expect(setCurrentWord(5)).toEqual(result);
});

test('edit word with appropriate information', () => {
  let result = {
    type: 'EDIT_WORD',
    id: 4,
    word: 'Savant',
    def: 'a learned person',
    n: true, v: false, adj: true, adv: false,
    oldWord: 'Solarium', wordNotExisted: true
  };
  expect(editWord(4, 'Savant', 'a learned person', true,
                  false, true, false, 'Solarium', true)).toEqual(result);
});

test('add word with appropriate information', () => {
  let result = {
    type: 'ADD_WORD',
    word: 'Savant',
    def: 'a learned person',
    n: true, v: true, adj: true, adv: true,
    score: 6,
  };
  expect(addWord('Savant', 'a learned person',
                 true, true, true, true)).toEqual(result);
});

test('delete word by word name (a [WORD] entry should be unique)', () => {
  let result = {
    type: 'DELETE_WORD',
    word: 'solarium'
  };
  expect(deleteWord('solarium')).toEqual(result);
});

test('changeScore', () => {
  let result = {
      type: 'CHANGE_WORD_SCORE',
      id: 1,
      val: -1
  };
  expect(changeScore(1, -1)).toEqual(result);
});
