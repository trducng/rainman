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

import { addWord, editWord, deleteWord,
         setCurrentWord } from '../../src/api/TestActions';

describe('testing all WordActions\' action creators', () => {
  test('`addWord` creates incorrect action', () => {
    var result = {
      type: 'ADD_WORD',
      id: 0,
      word: 'savant',
      def: 'a learned person.',
      n: true,
      v: false,
      adj: false,
      adv: false
    };

    expect(addWord(
      0, 'savant', 'a learned person.', true,
      false, false, false
    )).toEqual(result);
  });

  test('`editWord` creates incorrect action', () => {
    var result = {
      type: 'EDIT_WORD',
      id: 0,
      word: 'savant',
      def: 'a learned person.',
      n: false,
      v: true,
      adj: false,
      adv: false,
      replacedIdx: 5
    };

    expect(editWord(
      0, 'savant', 'a learned person.', false,
      true, false, false, 5
    )).toEqual(result);
  });

  test('`deleteWord` creates incorrect action', () => {
    var result = {
      type: 'DELETE_WORD',
      id: 1
    };

    expect(deleteWord(1)).toEqual(result);
  });

  test('`setCurrentWord` creates incorrect action', () => {
    var result = {
      type: 'SET_CURRENT_WORD',
      index: 4
    };

    expect(setCurrentWord(4)).toEqual(result);
  });
});
