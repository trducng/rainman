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

export const mod = (n: number, m: number): number => {
  return ((n % m) + m) % m;
};


/**
 * Perform binary search on a sorted array of numbers
 */
export const binarySearchArray = (
 array: Array<number>, element: number,
 getSupposedIndex: boolean = false): number => {
   var minIndex = 0;
   var maxIndex = array.length - 1;
   var currentIndex = 0;
   var currentElement;

   while (minIndex <= maxIndex) {
       currentIndex = (minIndex + maxIndex) / 2 | 0;
       currentElement = array[currentIndex];

       if (currentElement < element) {
           minIndex = currentIndex + 1;
       }
       else if (currentElement > element) {
           maxIndex = currentIndex - 1;
       }
       else {
           return currentIndex;
       }
   }

   if (getSupposedIndex) {
     // This condition is necessary since `currentIndex` is initialized at a
     // lower value so that it is biased toward a lower value.
     if (minIndex === array.length) {
       return currentIndex + 1;
     }
     return currentIndex;
   }

   return -1;
};


/**
 * Select a random number from lower (inclusive) to upper (inclusive)
 */
export const randInt = (lower: number, upper: number) => {
  return lower + Math.floor(Math.random() * (upper + 1 - lower));
}


/**
 * Select `amount` of random elements from `array`
 */
export const choice = (array: Array<number>, amount: number): Array<number> => {
  var idx = -1, length = array.length;

  amount = amount <= length ? amount : length;
  var result = [...array];

  while (++idx < amount) {
    var rand = randInt(idx, length-1);
    var value = result[rand];

    result[rand] = result[idx];
    result[idx] = value;
  }

  result.length = amount;
  return result;
}


/**
 * Simple queue
 */
export class Queue {
  array: Array<any>;
  length: number;
  newPointer: number;
  oldPointer: number;

  static copy(old: Queue): Queue {
    var obj = new Queue(old.getLength());
    obj._setState(
      old.asArray(), old.getLength(), old.getNewPointer(), old.getOldPointer()
    );
    return obj;
  }

  constructor(length: number) {
    this.array = [];
    this.length = length;
    this.newPointer = 0;
    this.oldPointer = -1;
  }

  isEmpty() {
    return this.oldPointer === -1;
  }

  isFull() {
    return this.newPointer === this.oldPointer;
  }

  asArray() {
    return this.array.slice(0, this.length);
  }

  contains(item: any) {
    if (this.isEmpty()) {
      return false;
    }

    if (this.newPointer === this.oldPointer) {
      return this.array.indexOf(item) !== -1;
    } else if (this.newPointer > this.oldPointer) {
      return this.array.slice(this.oldPointer, this.newPointer).indexOf(item) !== -1;
    } else {
      return [
        ...this.array.slice(this.oldPointer),
        ...this.array.slice(0, this.newPointer)
      ].indexOf(item) !== -1;
    }
  }

  push(item: any) {
    this.array[this.newPointer] = item;
    if (this.isEmpty() || this.isFull()) {
      this.oldPointer = mod(this.oldPointer + 1, this.length);
    }
    this.newPointer = mod(this.newPointer + 1, this.length);
    return item;
  }

  pop() {
    if (this.isEmpty()) {
      return;
    }
    var item = this.array[this.oldPointer];
    this.oldPointer = mod(this.oldPointer + 1, this.length);
    if (this.oldPointer === this.newPointer) {
      this.oldPointer = -1;
      this.newPointer = 0;
    }
    return item;
  }

  getLength(): number {
    return this.length;
  }

  getNewPointer(): number {
    return this.newPointer;
  }

  getOldPointer(): number {
    return this.oldPointer;
  }

  _setState(array: Array<any>, length: number,
   newPointer: number, oldPointer: number) {
    this.array = array,
    this.length = length;
    this.newPointer = newPointer;
    this.oldPointer = oldPointer;
  }

  immutePush(item: any): Queue {
    var obj = Queue.copy(this);
    obj.push(item);
    return obj;
  }

  peekOldest(): any {
    if (this.isEmpty()) return;
    return this.array[this.oldPointer];
  }

  peekNewest(): any {
    if (this.isEmpty()) return;
    return this.array[mod(this.newPointer-1, this.length)];
  }
}
