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

import { INDEX, WORD, DEFINITION,
         NOUN, VERB, ADJECTIVE, ADVERB, SCORE } from '../constants/DB';


var initialState = {
  ALL_WORDS: [],
  SORTED_SCORES: []
}

export const wordData = (state = initialState, action) => {
  switch (action.type) {

    case 'GET_ALL_WORDS':
      var words = action.words.map(item => JSON.parse(item[1]));
      words.sort((a, b) => a[INDEX] - b[INDEX]);

      var sortedScores = [];
      for (var i=0; i<words.length; i++) {
        sortedScores.push([i, words[i][SCORE]]);
      }
      sortedScores.sort((first, second) => first[1] - second[1]);
      sortedScores = sortedScores.map(item => item[0]);

      return {
        ALL_WORDS: words,
        SORTED_SCORES: sortedScores
      }

    case 'EDIT_WORD':
      console.log('Reducer EDIT_WORD: '+ action.word);
      console.log('Reducer EDIT_WORD: ' + action.def);

      return {
        ALL_WORDS: state.ALL_WORDS.map((wordObj) => {
          if (action.id === wordObj[INDEX]) {
            let word = {...wordObj};
            word[WORD] = action.word; word[DEFINITION] = action.def;
            word[NOUN] = action.n; word[VERB] = action.v;
            word[ADJECTIVE] = action.adj; word[ADVERB] = action.adv;
            return word;
          } else {
            return wordObj;
          }
        }),
        SORTED_SCORES: state.SORTED_SCORES,
      }

    case 'ADD_WORD':
      let word = {};
      word[INDEX] = state.ALL_WORDS[state.ALL_WORDS.length - 1][INDEX] + 1;
      word[WORD] = action.word; word[DEFINITION] = action.def;
      word[NOUN] = action.n; word[VERB] = action.v;
      word[ADJECTIVE] = action.adj, word[ADVERB]= action.adv;

      return {
        ALL_WORDS: [...state.ALL_WORDS, word],
        SORTED_SCORES: [state.ALL_WORDS.length, ...state.SORTED_SCORES]
      }

    case 'CHANGE_WORD_SCORE':
      return {
        ALL_WORDS: state.ALL_WORDS.map((wordObj) =>
          (wordObj[INDEX] === action.id)
            ? {...wordObj, score: wordObj.score + action.val}
            : wordObj),
        SORTED_SCORES: state.SORTED_SCORES
      }

    default:
      return state;
  }
};
