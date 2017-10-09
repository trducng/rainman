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

import { ID, WORD, DEFINITION, NOUN, VERB,
        ADJECTIVE, ADVERB, SCORE, LAST_OPENED } from '../constants/DB';
import { DEFAULT_SCORE, VERBOSE, INSTALLED_DAY } from '../constants/Meta';
import { binarySearchArray } from '../api/utils';


export const initialState = {
  WORDS: {},
  ALL_IDS: [],

  SORTED_SCORES: [],

  NOUNS: [],
  VERBS: [],
  ADJECTIVES: [],
  ADVERBS: [],

  CURRENT_WORD: -1
}


const switchWordKind = (array: Array<number>, id: number,
 val: boolean): Array<number> => {
  if (val) {
    if (binarySearchArray(array, id) === -1) {
      var idx = binarySearchArray(array, id, true);
      return [...array.slice(0, idx), id, ...array.slice(idx)];
    } else {
      return array;
    }

  } else {
    if (binarySearchArray(array, id) === -1) {
      return array;
    } else {
      var idx = binarySearchArray(array, id);
      return [...array.slice(0, idx), ...array.slice(idx+1)];
    }
  }
}


const editWordNonExisting = (state: Object, action: Object): Object => {

  return {
    WORDS: {
      ...state.WORDS,
      [action.id]: {
        word: action.word,
        def: action.def
      }
    },
    ALL_IDS: state.ALL_IDS,
    SORTED_SCORES: state.SORTED_SCORES,

    NOUNS: switchWordKind(state.NOUNS, action.id, action.n),
    VERBS: switchWordKind(state.VERBS, action.id, action.v),
    ADJECTIVES: switchWordKind(state.ADJECTIVES, action.id, action.adj),
    ADVERBS: switchWordKind(state.ADVERBS, action.id, action.adv),

    CURRENT_WORD: state.CURRENT_WORD
  }
}


const editWordExisting = (state: Object, action: Object): Object => {

  // Remove all traces of the replaced word
  var id = state.ALL_IDS[action.replacedIdx];
  var sortedScoresIdx = binarySearchArray(state.SORTED_SCORES, id);

  var nIdx = binarySearchArray(state.NOUNS, id);
  var vIdx = binarySearchArray(state.VERBS, id);
  var adjIdx = binarySearchArray(state.ADJECTIVES, id);
  var advIdx = binarySearchArray(state.ADVERBS, id);

  var n=state.NOUNS, v=state.VERBS, adj=state.ADJECTIVES, adv=state.ADVERBS;

  if (nIdx !== -1) {
    n = [...n.slice(0, nIdx), ...n.slice(nIdx+1)];
  }
  if (vIdx !== -1) {
    v = [...v.slice(0, vIdx), ...v.slice(vIdx+1)];
  }
  if (adjIdx !== -1) {
    adj = [...adj.slice(0, adjIdx), ...adj.slice(adjIdx+1)];
  }
  if (advIdx !== -1) {
    adv = [...adv.slice(0, advIdx), ...adv.slice(advIdx+1)];
  }

  return {
    WORDS: {
      ...state.WORDS,
      [action.id]: {
        word: action.word,
        def: action.def
      }
    },
    ALL_IDS: [
      ...state.ALL_IDS.slice(0, action.replacedIdx),
      ...state.ALL_IDS.slice(action.replacedIdx+1)
    ],
    SORTED_SCORES: [
      ...state.SORTED_SCORES.slice(0, sortedScoresIdx),
      ...state.SORTED_SCORES.slice(sortedScoresIdx+1)
    ],

    NOUNS: switchWordKind(n, action.id, action.n),
    VERBS: switchWordKind(v, action.id, action.v),
    ADJECTIVES: switchWordKind(adj, action.id, action.adj),
    ADVERBS: switchWordKind(adv, action.id, action.adv),

    CURRENT_WORD: Math.min(
      state.CURRENT_WORD,
      Math.max(state.ALL_IDS.length-2, 0)
    )
  }
}


export const wordData = (state: Object = initialState, action: Object): Object => {
  switch (action.type) {

    case 'GET_ALL_WORDS': {
      var words = {}, allIds = [];
      var sortedScores = [];
      var n = [], v = [], adj = [], adv = [];

      for (var i=0, l=action.words.length; i<l; i++) {
        var wordObj = JSON.parse(action.words[i][1]);

        words[wordObj[ID]] = {
          word: wordObj[WORD],
          def: wordObj[DEFINITION]
        };
        allIds.push(wordObj[ID]);

        sortedScores.push([
          wordObj[ID],
          wordObj[LAST_OPENED] * wordObj[SCORE] * Math.sqrt(wordObj[SCORE])
        ]);

        if (wordObj[NOUN]) {
          n.push(wordObj[ID]);
        }
        if (wordObj[VERB]) {
          v.push(wordObj[ID]);
        }
        if (wordObj[ADJECTIVE]) {
          adj.push(wordObj[ID]);
        }
        if (wordObj[ADVERB]) {
          adv.push(wordObj[ID]);
        }
      }

      allIds.sort((a, b) => a - b);

      sortedScores.sort((a, b) => a[1] - b[1]);
      sortedScores = sortedScores.map((item) => item[0]);

      n.sort((a, b) => a - b);
      v.sort((a, b) => a - b);
      adj.sort((a, b) => a - b);
      adv.sort((a, b) => a - b);

      return {
        WORDS: words,
        ALL_IDS: allIds,
        SORTED_SCORES: sortedScores,
        NOUNS: n,
        VERBS: v,
        ADJECTIVES: adj,
        ADVERBS: adv,
        CURRENT_WORD: state.CURRENT_WORD
      };
    }

    case 'ADD_WORD': {

      return {
        WORDS: {
          ...state.WORDS,
          [action.id]: {
            word: action.word,
            def: action.def
          }
        },
        ALL_IDS: [...state.ALL_IDS, action.id],
        SORTED_SCORES: [action.id, ...state.SORTED_SCORES.slice(0)],
        NOUNS: action.n ? [...state.NOUNS, action.id] : state.NOUNS,
        VERBS: action.v ? [...state.VERBS, action.id] : state.VERBS,
        ADJECTIVES: action.adj ? [...state.ADJECTIVES, action.id] : state.ADJECTIVES,
        ADVERBS: action.adv ? [...state.ADVERBS, action.id] : state.ADVERBS,
        CURRENT_WORD: state.CURRENT_WORD
      }
    }

    case 'EDIT_WORD': {

      if (action.replacedIdx === -1) {
        return editWordNonExisting(state, action);
      } else {
        return editWordExisting(state, action);
      }

    }

    case 'DELETE_WORD': {
      var idx = binarySearchArray(state.ALL_IDS, action.id);
      var sortedScoresIdx = state.SORTED_SCORES.indexOf(action.id);

      return {
        WORDS: state.WORDS,
        ALL_IDS: [...state.ALL_IDS.slice(0, idx), ...state.ALL_IDS.slice(idx+1)],
        SORTED_SCORES: [
          ...state.SORTED_SCORES.slice(0, sortedScoresIdx),
          ...state.SORTED_SCORES.slice(sortedScoresIdx+1)
        ],
        NOUNS: switchWordKind(state.NOUNS, action.id, false),
        VERBS: switchWordKind(state.VERBS, action.id, false),
        ADJECTIVES: switchWordKind(state.ADJECTIVES, action.id, false),
        ADVERBS: switchWordKind(state.ADVERBS, action.id, false),
        CURRENT_WORD: Math.min(
          state.CURRENT_WORD,
          Math.max(state.ALL_IDS.length-2, 0)
        )
      };
    }

    case 'SET_CURRENT_WORD': {
      return {
        WORDS: state.WORDS,
        ALL_IDS: state.ALL_IDS,
        SORTED_SCORES: state.SORTED_SCORES,
        NOUNS: state.NOUNS,
        VERBS: state.VERBS,
        ADJECTIVES: state.ADJECTIVES,
        ADVERBS: state.ADVERBS,
        CURRENT_WORD: action.index
      }
    }

    default: {
      return state;
    }
  }
}
