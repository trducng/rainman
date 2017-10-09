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
import { addWord, editWord, deleteWord,
         setCurrentWord } from '../../src/api/WordActions';
import { getAllWords } from '../../src/api/WordListActions';
import { DEFAULT_SCORE } from '../../src/constants/Meta';


var currentState = {
  WORDS: {
    7: {
      word: 'martinet',
      def: 'a strict disciplinarian.'
    },
    1: {
      word: 'savant',
      def: 'a learned person.'
    },
    4: {
      word: 'venal',
      def: 'susceptible to bribery.'
    },
    2: {
      word: 'solarium',
      def: 'a room filled with glass.'
    },
    6: {
      word: 'excel',
      def: 'to be exceptionally good at something.'
    }
  },
  ALL_IDS: [1, 2, 4, 6, 7],
  SORTED_SCORES: [6, 7, 2, 1, 4],
  NOUNS: [1, 2, 7],
  VERBS: [6],
  ADJECTIVES: [4, 6],
  ADVERBS: [],
  CURRENT_WORD: 4
};

describe('`wordData` reducer edge cases', () => {
  test('`wordData` is incorrectly initialized', () => {
    let result = {
      WORDS: {},
      ALL_IDS: [],

      SORTED_SCORES: [],

      NOUNS: [],
      VERBS: [],
      ADJECTIVES: [],
      ADVERBS: [],

      CURRENT_WORD: -1
    };

    expect(initialState).toEqual(result);
  });

  test('`wordData` does not return state for unknown action type', () => {
    let action = {
      type: 'HUH?'
    };

    expect(wordData(currentState, action)).toEqual(currentState);
  })
});

describe('`wordData` reducer common use cases', () => {
  test('GET_ALL_WORDS does not correctly get all states', () => {
    let action = getAllWords([
      [
        'martinet',
        JSON.stringify({
          id: 7, word: 'martinet', def: 'a strict disciplinarian.', n: true,
          v: false, adj: false, adv: false, score: 5, last: 4
        })  // score * sqrt(score) * last = 44
      ],
      [
        'savant',
        JSON.stringify({
          id: 1, word: 'savant', def: 'a learned person.', n: true, v: false,
          adj: false, adv: false, score: 15, last: 2
        })  // score * sqrt(score) * last = 116
      ],
      [
        'venal',
        JSON.stringify({
          id: 4, word: 'venal', def: 'susceptible to bribery.', n: false,
          v: false, adj: true, adv: false, score: 17, last: 2
        })  // score * sqrt(score) * last = 140
      ],
      [
        'solarium',
        JSON.stringify({
          id: 2, word: 'solarium', def: 'a room filled with glass.', n: true,
          v: false, adj: false, adv: false, score: 3, last: 20
        })  // score * sqrt(score) * last = 103
      ],
      [
        'excel',
        JSON.stringify({
          id: 6, word: 'excel', def: 'to be exceptionally good at something.',
          n: false, v: true, adj: true, adv: false, score: 1, last: 30
        })  // score * sqrt(score) * last = 30
      ]
    ]);
    let result = JSON.parse(JSON.stringify(currentState));
    result['CURRENT_WORD'] = -1;

    expect(wordData(initialState, action)).toEqual(result);
  });

  test('ADD_WORD does not correctly add new word', () => {
    let result = JSON.parse(JSON.stringify(currentState));
    result['WORDS'][8] = {
      word: 'restive',
      def: 'a state of restless confusion.'
    };
    result['SORTED_SCORES'] = [8, 6, 7, 2, 1, 4];
    result['ALL_IDS'] = [1, 2, 4, 6, 7, 8];
    result['ADJECTIVES'] = [4, 6, 8];

    expect(wordData(
      currentState,
      addWord(
        8, 'restive', 'a state of restless confusion.',
        false, false, true, false
      )
    )).toEqual(result);
  });

  test('EDIT_WORD does not correctly update in normal cases', () => {
    let result = JSON.parse(JSON.stringify(currentState));
    result['WORDS'][1]['def'] = 'a super learned person.';
    result['NOUNS'] = [2, 7];
    result['ADJECTIVES'] = [1, 4, 6];
    result['ADVERBS'] = [1];

    expect(wordData(
      currentState,
      editWord(
        1, 'savant', 'a super learned person.', false, false,
        true, true, -1
      )
    )).toEqual(result);

  })

  test('EDIT_WORD does not correctly update when the term is changed', () => {
    let result = JSON.parse(JSON.stringify(currentState));
    result['WORDS'][4]['word'] = 'venality';
    result['NOUNS'] = [1, 2, 4, 7];
    result['ADJECTIVES'] = [6];

    expect(wordData(
      currentState,
      editWord(
        4, 'venality', 'susceptible to bribery.', true, false, false, false, -1
      )
    )).toEqual(result);
  });

  test('EDIT_WORD does not correctly update when term is changed '
   + 'to existing term', () => {
    let result = JSON.parse(JSON.stringify(currentState));
    result['WORDS'][7]['word'] = 'venal';
    result['WORDS'][7]['def'] = 'a bribed disciplinarian.';
    result['ALL_IDS'] = [1, 2, 6, 7];
    result['SORTED_SCORES'] = [6, 7, 2, 1];
    result['ADJECTIVES'] = [6, 7];
    result['ADVERBS'] = [7];
    result['CURRENT_WORD'] = 3;

    expect(wordData(
      currentState,
      editWord(
        7, 'venal', 'a bribed disciplinarian.', true, false, true, true, 2
      )
    )).toEqual(result);
  });

  test('DELETE_WORD does not correctly remove word', () => {
    let result = JSON.parse(JSON.stringify(currentState));
    result['ALL_IDS'] = [1, 2, 4, 6];
    result['SORTED_SCORES'] = [6, 2, 1, 4];
    result['NOUNS'] = [1, 2];
    result['CURRENT_WORD'] = 3;

    expect(wordData(currentState, deleteWord(7))).toEqual(result);
  });

  test('SET_CURRENT_WORD does not change current index correctly', () => {
    let result = JSON.parse(JSON.stringify(currentState));
    result['CURRENT_WORD'] = 2;

    expect(wordData(currentState, setCurrentWord(2))).toEqual(result);
  });
});
