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
 *     * Neither the name of this software authors nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
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

import WordListScreen, { filterWordList } from '../../src/screens/WordListScreen';
import { INDEX, WORD, DEFINITION,
         NOUN, VERB, ADJECTIVE, ADVERB, SCORE } from '../../src/constants/DB';

test('filter words and definition with search term', () => {
  let original = [
    {"idx":0,
     "word":"savant",
     "def":"a learned person, especially a distinguished scientist",
     "n":true,
     "v":false,
     "adj":true,
     "adv":false,
     "score":4},
    {"idx":1,
     "word":"martinet",
     "def":"a strict disciplinarian, especially in the armed forces.",
     "n":true,
     "v":true,
     "adj":true,
     "adv":false,
     "score":5},
    {"idx":2,
     "word":"solarium",
     "def":"a room fitted with extensive areas of glass to admit sunlight.",
     "n":true,
     "v":false,
     "adv":true,
     "adj":false,
     "score":2}
  ]

  let result = [
    {"idx":0,
     "word":"savant",
     "def":"a learned person, especially a distinguished scientist",
     "n":true,
     "v":false,
     "adj":true,
     "adv":false,
     "score":4},
    {"idx":1,
     "word":"martinet",
     "def":"a strict disciplinarian, especially in the armed forces.",
     "n":true,
     "v":true,
     "adj":true,
     "adv":false,
     "score":5},
  ]

  expect(filterWordList(original, 'an')).toEqual(result);
})
