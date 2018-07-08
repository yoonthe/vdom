'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @author Yoonthe
 * @description 定义各种 通用 常量
 */

// events

// resource window / document / 引用资源 的加载与卸载
var ResourceEvents = exports.ResourceEvents = ['cached', 'error', 'abort', 'load', 'beforeunload', 'unload'];

// 焦点事件
var FocusEvents = exports.FocusEvents = ['focus', 'blur'];

// css 动画&过渡
var CssEvents = exports.CssEvents = ['animationstart', 'animationend', 'animationiteration', 'animationcancel', 'transitionend'];

// 表单事件
var FormEvents = exports.FormEvents = ['reset', 'submit', 'input', 'change'];

// 视图事件
var ViewEvents = exports.ViewEvents = ['fullscreenchange', 'fullscreenerror', 'resize', 'scroll'];

// 剪切板事件
var ClipboardEvents = exports.ClipboardEvents = ['cut', 'copy', 'paste', 'selectstart', 'selectionchange'];

// 键盘事件
var KeyboardEvents = exports.KeyboardEvents = ['keydown', 'keypress', 'keyup'];

// 鼠标事件
var MouseEvents = exports.MouseEvents = ['mouseenter', 'mouseover', 'mousemove', 'mousedown', 'mouseup', 'click', 'dbclick', 'contextmenu', 'wheel', 'mouseleave', 'mouseout', 'select', 'pointerlockchange', 'pointerlockerror'];

// 拖放事件
var DragEvents = exports.DragEvents = ['drag', 'dragstart', 'dragend', 'dragenter', 'dragover', 'dragleave', 'drop'];

// 媒体事件
var MediaEvents = exports.MediaEvents = ['durationchange', 'loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'ended', 'emptied', 'stalled', 'suspend', 'play', 'playing', 'pause', 'waiting', 'seeking', 'seeked', 'ratechange', 'timeupdate', 'volumechange', 'complete', 'ended', 'audioprocess'];

// all events

var AllEvents = exports.AllEvents = [].concat(ResourceEvents, FocusEvents, CssEvents, FormEvents, ViewEvents, ClipboardEvents, KeyboardEvents, MouseEvents, DragEvents, MediaEvents);