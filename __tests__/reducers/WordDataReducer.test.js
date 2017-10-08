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
import { addWord, deleteWord, editWord,
         changeWordScore, setCurrentWord } from '../../src/api/WordActions';
import { getAllWords } from '../../src/api/WordListActions';
import { DEFAULT_SCORE } from '../../src/constants/Meta';

describe('WordDataReducer: test edge cases', () => {
  test('wordData is incorrectly initialized', () => {
    let result = {
      ALL_WORDS: [],
      SORTED_SCORES: {},
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


var currentState = {
  ALL_WORDS: [
    {
      'id': 0,
      'word': 'savant',
      'def': 'a learned person.',
      'n': true,
      'v': false,
      'adj': true,
      'adv': false,
      'score': 4
    },
    {
      'id': 1,
      'word': 'martinet',
      'def': 'a strict disciplinarian.',
      'n': true,
      'v': true,
      'adj': true,
      'adv': false,
      'score': 5
    },
    {
      'id': 2,
      'word': 'solarium',
      'def': 'a room filled with glass.',
      'n': true,
      'v': false,
      'adv': true,
      'adj': false,
      'score': 2
    }
  ],
  SORTED_SCORES: {
    2: [[2, 'solarium', 'a room filled with glass.']],
    4: [[0, 'savant', 'a learned person.']],
    5: [[1, 'martinet', 'a strict disciplinarian.']]
  },
  CURRENT_WORD: 2
};

describe('WordDataReducer: use cases', () => {
  test('GET_ALL_WORDS does not return all words and sorted scores', () => {
    let action = getAllWords([
      [
        'savant',
        JSON.stringify({
          'id': 1, 'word': 'savant', 'def': 'a learned person',
          'n': true, 'adj': false, 'v': false, 'adv': false, 'score': 10
        })
      ],

      [
        'martinet',
        JSON.stringify({
          'id': 2, 'word': 'martinet', 'def': 'a strict disciplinarian.',
          'n': true, 'v': true, 'adj': true, 'adv': false, 'score': 10
        })
      ],
      [
        'solarium',
        JSON.stringify({
          'id': 3, 'word': 'solarium', 'def': 'a room filled with glass.',
          'n': true, 'v': false, 'adv': true, 'adj': false, 'score': 2
        })
      ]
    ]);
    let result = {
      ALL_WORDS: [
        {
          'id': 1, 'word': 'savant', 'def': 'a learned person',
          'n': true, 'adj': false, 'v': false, 'adv': false, 'score': 10
        },
        {
          'id': 2, 'word': 'martinet', 'def': 'a strict disciplinarian.',
          'n': true, 'v': true, 'adj': true, 'adv': false, 'score': 10
        },
        {
          'id': 3, 'word': 'solarium', 'def': 'a room filled with glass.',
          'n': true, 'v': false, 'adv': true, 'adj': false, 'score': 2
        }
      ],
      SORTED_SCORES: {
        2: [[3, 'solarium', 'a room filled with glass.']],
        10: [
          [1, 'savant', 'a learned person'],
          [2, 'martinet', 'a strict disciplinarian.']
        ]
      },
      CURRENT_WORD: 0
    };
    expect(wordData(initialState, action)).toEqual(result);
  });

  test('EDIT_WORD doesn\'t correctly edit non-word, non-def data', () => {
    let result = JSON.parse(JSON.stringify(currentState));
    result['ALL_WORDS'][2] = {
      'id': 2,
      'word': 'solarium',
      'def': 'a room filled with glass.',
      'n': false,
      'v': true,
      'adj': false,
      'adv': true,
      'score': 2
    };

    expect(wordData(
      currentState,
      editWord(
        2, 'solarium', 'a room filled with glass.', false, true,
        false, true, 'solarium', false
      )
    )).toEqual(result);
  });

  test('EDIT_WORD does\'t correctly edit definition data', () => {
    let result = JSON.parse(JSON.stringify(currentState));
    result['ALL_WORDS'][2] = {
      'id': 2,
      'word': 'solarium',
      'def': 'a learned superman.',
      'n': true,
      'v': true,
      'adj': true,
      'adv': true,
      'score': 2
    };
    result['SORTED_SCORES'][2] = [
      [2, 'solarium', 'a learned superman.']
    ];

    expect(wordData(
      currentState,
      editWord(
        2, 'solarium', 'a learned superman.', true, true,
        true, true, 'solarium', false
      )
    ));
  });

  test('EDIT_WORD doesn\'t correctly edit word term', () => {
    let result = JSON.parse(JSON.stringify(currentState));
    result['ALL_WORDS'] = [
      {
        'id': 0,
        'word': 'savant',
        'def': 'a learned person.',
        'n': true,
        'v': false,
        'adj': true,
        'adv': false,
        'score': 4
      },
      {
        'id': 2,
        'word': 'martinet',
        'def': 'a room filled with some glass.',
        'n': true,
        'v': true,
        'adj': true,
        'adv': false,
        'score': 2
      }
    ];
    result['SORTED_SCORES'] = {
      2: [[2, 'martinet', 'a room filled with some glass.']],
      4: [[0, 'savant', 'a learned person.']],
    };
    result['CURRENT_WORD'] = 1;

    expect(wordData(
      currentState,
      editWord(
        2, 'martinet', 'a room filled with some glass.', true,
        true, true, false, 'solarium', true
      )
    )).toEqual(result);
  });

  test('ADD_WORD does\'t correctly add new word', () => {
    let result = JSON.parse(JSON.stringify(currentState));
    result['ALL_WORDS'].push({
      'id': 3,
      'word': 'restive',
      'def': 'a state of restless confusion.',
      'n': false,
      'v': false,
      'adv': false,
      'adj': true,
      'score': DEFAULT_SCORE
    });

    try {
      result['SORTED_SCORES'][DEFAULT_SCORE].push([
        3, 'restive', 'a state of restless confusion.'
      ]);
    } catch (error) {
      if (error instanceof TypeError) {
        result['SORTED_SCORES'][DEFAULT_SCORE] = [[
          3, 'restive', 'a state of restless confusion.'
        ]];
      } else {
        throw error;
      }
    }

    expect(wordData(
      currentState,
      addWord(
        3, 'restive', 'a state of restless confusion.',
        false, false, true, false)
    )).toEqual(result);
  });

  test('DELETE doesn\'t correctly remove word', () => {
    let result = JSON.parse(JSON.stringify(currentState));
    result['ALL_WORDS'] = [
      {
        'id': 0,
        'word': 'savant',
        'def': 'a learned person.',
        'n': true,
        'v': false,
        'adj': true,
        'adv': false,
        'score': 4
      },
      {
        'id': 1,
        'word': 'martinet',
        'def': 'a strict disciplinarian.',
        'n': true,
        'v': true,
        'adj': true,
        'adv': false,
        'score': 5
      }
    ]
    result['SORTED_SCORES'] = {
      4: [[0, 'savant', 'a learned person.']],
      5: [[1, 'martinet', 'a strict disciplinarian.']]
    };
    result['CURRENT_WORD'] = 1;

    expect(wordData(currentState, deleteWord('solarium'))).toEqual(result);
  });

  test('CHANGE_WORD_SCORE doesn\'t correctly change score', () => {
    let result = JSON.parse(JSON.stringify(currentState));
    result['SORTED_SCORES'] = {
      2: [[2, 'solarium', 'a room filled with glass.']],
      5: [
        [1, 'martinet', 'a strict disciplinarian.'],
        [0, 'savant', 'a learned person.'],
      ]
    };

    expect(wordData(
      currentState,
      changeWordScore(0, 'savant', 'a learned person.', 4, 1)
    )).toEqual(result);
  });

  test('SET_CURRENT_WORD doesn\'t change word index correctly', () => {
    var result = {...currentState};
    result['CURRENT_WORD'] = 0;

    expect(wordData(currentState, setCurrentWord(0))).toEqual(result);
  });
});
