/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict
 * @format
 */

// flowlint unsafe-getters-setters:off

import type {DOMHighResTimeStamp} from './PerformanceEntry';

import {PerformanceEntry} from './PerformanceEntry';

export type DetailType = mixed;

export type PerformanceMarkOptions = {
  detail?: DetailType,
  startTime?: DOMHighResTimeStamp,
};

export type TimeStampOrName = DOMHighResTimeStamp | string;

export type PerformanceMeasureInit = {
  detail?: DetailType,
  startTime: DOMHighResTimeStamp,
  duration: DOMHighResTimeStamp,
};

class PerformanceMarkTemplate extends PerformanceEntry {
  // We don't use private fields because they're significantly slower to
  // initialize on construction and to access.
  _detail: DetailType;

  // This constructor isn't really used. See `PerformanceMark` below.
  constructor(markName: string, markOptions?: PerformanceMarkOptions) {
    super({
      name: markName,
      entryType: 'mark',
      startTime: markOptions?.startTime ?? performance.now(),
      duration: 0,
    });

    if (markOptions) {
      this._detail = markOptions.detail;
    }
  }

  get detail(): DetailType {
    return this._detail;
  }
}

// This is the real value we're exporting where we define the class a function
// so we don't need to call `super()` and we can avoid the performance penalty
// of the current code transpiled with Babel.
// We should remove this when we have built-in support for classes in the
// runtime.
export const PerformanceMark: typeof PerformanceMarkTemplate =
  // $FlowExpectedError[incompatible-type]
  function PerformanceMark(
    this: PerformanceMarkTemplate,
    markName: string,
    markOptions?: PerformanceMarkOptions,
  ) {
    this.__name = markName;
    this.__entryType = 'mark';
    this.__startTime = markOptions?.startTime ?? performance.now();
    this.__duration = 0;

    if (markOptions) {
      this._detail = markOptions.detail;
    }
  };

// $FlowExpectedError[prop-missing]
PerformanceMark.prototype = PerformanceMarkTemplate.prototype;

class PerformanceMeasureTemplate extends PerformanceEntry {
  // We don't use private fields because they're significantly slower to
  // initialize on construction and to access.
  _detail: DetailType;

  // This constructor isn't really used. See `PerformanceMeasure` below.
  constructor(measureName: string, measureOptions: PerformanceMeasureInit) {
    super({
      name: measureName,
      entryType: 'measure',
      startTime: measureOptions.startTime,
      duration: measureOptions.duration,
    });

    if (measureOptions) {
      this._detail = measureOptions.detail;
    }
  }

  get detail(): DetailType {
    return this._detail;
  }
}

// We do the same here as we do for `PerformanceMark` for performance reasons.
export const PerformanceMeasure: typeof PerformanceMeasureTemplate =
  // $FlowExpectedError[incompatible-type]
  function PerformanceMeasure(
    this: PerformanceMeasureTemplate,
    measureName: string,
    measureOptions: PerformanceMeasureInit,
  ) {
    this.__name = measureName;
    this.__entryType = 'measure';
    this.__startTime = measureOptions.startTime;
    this.__duration = measureOptions.duration;

    if (measureOptions) {
      this._detail = measureOptions.detail;
    }
  };

// $FlowExpectedError[prop-missing]
PerformanceMeasure.prototype = PerformanceMeasureTemplate.prototype;
