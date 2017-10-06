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

import { ID, WORD, DEFINITION,
         NOUN, VERB, ADJECTIVE, ADVERB, SCORE } from '../constants/DB';
import { DEFAULT_SCORE, VERBOSE } from '../constants/Meta';


export const initialState = {

  // has structure of: [
  //  {id, word...}, {id, word...},...
  // ]
  ALL_WORDS: [],

  // has structure of: {
  //    score1: [[id, word, def], [id, word, def], [id, word, def]...],
  //    score2: [...],
  //    ...
  // }
  SORTED_SCORES: {},
  CURRENT_WORD: 0
}

export const wordData = (state: Object = initialState, action: Object) => {

  switch (action.type) {

    case 'GET_ALL_WORDS':
      var allWords = action.words.map(item => JSON.parse(item[1]));
      allWords.sort((a, b) => a[ID] - b[ID]);

      var sortedScores = {};
      for (var i=0; i<allWords.length; i++) {
        var wordObj = allWords[i];
        try {
          sortedScores[wordObj[SCORE]].push([
            wordObj[ID], wordObj[WORD], wordObj[DEFINITION]
          ]);
        } catch (error) {
          if (error instanceof TypeError) {
            sortedScores[wordObj[SCORE]] = [[
              wordObj[ID], wordObj[WORD], wordObj[DEFINITION]
            ]];
          } else {
            throw error;
          }
        }
      }

      return {
        ALL_WORDS: allWords,
        SORTED_SCORES: sortedScores,
        CURRENT_WORD: state.CURRENT_WORD
      }


    case 'EDIT_WORD':
      if (VERBOSE >= 5) {
        console.log(`WordDataReducer: EDIT_WORD - ${action[WORD]}: `
          + `wordNotExisted (${action.wordNotExisted})`);
      }

      var allWords = [];
      var sortedScores = {};

      for (var i=0, l=state.ALL_WORDS.length; i<l; i++) {
        var wordObj = state.ALL_WORDS[i];

        if (action[ID] === wordObj[ID]) {
          let word = {};
          word[ID] = wordObj[ID]; word[SCORE] = wordObj[SCORE];
          word[WORD] = action[WORD]; word[DEFINITION] = action[DEFINITION];
          word[NOUN] = action[NOUN]; word[VERB] = action[VERB];
          word[ADJECTIVE] = action[ADJECTIVE]; word[ADVERB] = action[ADVERB];

          wordObj = word;
        } else if (action[WORD] === wordObj[WORD]) {
          continue;
        }
        allWords[i] = wordObj;

        try {
          sortedScores[wordObj[SCORE]].push([
            wordObj[ID], wordObj[WORD], wordObj[DEFINITION]
          ]);
        } catch (error) {
          if (error instanceof TypeError) {
            sortedScores[wordObj[SCORE]] = [[
              wordObj[ID], wordObj[WORD], wordObj[DEFINITION]
            ]];
          } else {
            throw error;
          }
        }
      }

      if (action.wordNotExisted) {
        return {
          ALL_WORDS: allWords,
          SORTED_SCORES: sortedScores,
          CURRENT_WORD: state.CURRENT_WORD
        }
      } else {
        return {
          ALL_WORDS: allWords,
          SORTED_SCORES: sortedScores,
          CURRENT_WORD: Math.min(
            state.CURRENT_WORD,
            Math.max(allWords.length-1, 0)
          )
        }
      }


    case 'ADD_WORD':
      let word = {};
      word[ID] = action.id; word[WORD] = action.word;
      word[DEFINITION] = action.def; word[NOUN] = action.n;
      word[VERB] = action.v; word[ADJECTIVE] = action.adj;
      word[ADVERB]= action.adv; word[SCORE] = DEFAULT_SCORE;

      return {
        ALL_WORDS: [...state.ALL_WORDS, word],
        SORTED_SCORES: [state.ALL_WORDS.length, ...state.SORTED_SCORES],
        CURRENT_WORD: state.CURRENT_WORD
      }


    case 'CHANGE_WORD_SCORE':
      return {
        ALL_WORDS: state.ALL_WORDS.map((wordObj) =>
          (wordObj[ID] === action.id)
            ? {...wordObj, score: wordObj.score + action.val}
            : wordObj),
        SORTED_SCORES: state.SORTED_SCORES,
        CURRENT_WORD: state.CURRENT_WORD
      }


    case 'DELETE_WORD':
      if (VERBOSE >= 5) {
        console.log(`WordDataReducer: DELETE_WORD for ${action.word}`);
      }

      var allWords = [];
      var sortedScores = [];
      var length = state.SORTED_SCORES.length;

      return {
        ALL_WORDS: state.ALL_WORDS.filter((wordObj) => wordObj[WORD] !== action.word),
        SORTED_SCORES: state.SORTED_SCORES,
        CURRENT_WORD: Math.max(state.CURRENT_WORD - 1, 0)
      }


    case 'SET_CURRENT_WORD':
      return {
        ALL_WORDS: state.ALL_WORDS,
        SORTED_SCORES: state.SORTED_SCORES,
        CURRENT_WORD: action.index
      }


    default:
      return state;
  }
};
