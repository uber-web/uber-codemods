// Copyright (c) 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

import omit from 'just-omit';
const otherOmit = require('just-omit');

import omit from 'just-omit/extra';
const otherOmit = require('just-omit/extra');

import dontTouch from 'object.omit-dont-touch';
const dontTouch = require('object.omit-dont-touch');

import dontTouch from './object.omit';
const dontTouch = require('./object.omit');

import dontTouch from 'dont-touch-object.omit';
const dontTouch = require('dont-touch-object.omit');

const dontTouch = 'object.omit';
const dontTouch = '';

const props = omit(
  {
    a: 1,
    b: 2,
    c: 3
  },
  ['a', 'c']
);
