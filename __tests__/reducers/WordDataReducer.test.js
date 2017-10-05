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

import { initialState, wordData } from '../../src/reducers/WordDataReducer';

describe('WordDataReducer: test edge cases', () => {
  test('wordData is incorrectly initialized', () => {
    let result = {
      ALL_WORDS: [],
      SORTED_SCORES: [],
      CURRENT_WORD: 0
    };
    expect(initialState).toEqual(result);
  });

  test('wordData does not return state for unknown action type', () => {
    let result = {
      ALL_WORDS: [{id: 0, word: 'solarium', def: 'room'},
                  {id: 1, word: 'savant', def: 'a learned person'}],
      SORTED_SCORES: {'3': [['solarium', 'room'], ['savant', 'a learned person']]},
      CURRENT_WORD: 1
    };
    let action = {
      type: 'HUH?'
    };
    expect(wordData(result, action)).toEqual(result);
  })
});
