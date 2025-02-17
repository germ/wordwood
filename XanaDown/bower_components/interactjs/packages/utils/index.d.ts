import * as arr from './arr';
import * as dom from './domUtils';
import * as is from './is';
import win from './window';
export declare function warnOnce<T>(this: T, method: (...args: any) => any, message: string): (this: T) => any;
export declare function _getQBezierValue(t: number, p1: number, p2: number, p3: number): number;
export declare function getQuadraticCurvePoint(startX: number, startY: number, cpX: number, cpY: number, endX: number, endY: number, position: number): {
    x: number;
    y: number;
};
export declare function easeOutQuad(t: number, b: number, c: number, d: number): number;
export declare function copyAction(dest: Interact.ActionProps, src: Interact.ActionProps): import("@interactjs/core/Interaction").ActionProps<any>;
export { default as browser } from './browser';
export { default as clone } from './clone';
export { default as events } from './events';
export { default as extend } from './extend';
export { default as getOriginXY } from './getOriginXY';
export { default as hypot } from './hypot';
export { default as normalizeListeners } from './normalizeListeners';
export { default as pointer } from './pointerUtils';
export { default as raf } from './raf';
export { default as rect } from './rect';
export { default as Signals } from './Signals';
export { win, arr, dom, is };
