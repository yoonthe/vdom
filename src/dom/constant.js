/**
 * @author Yoonthe
 * @description 定义各种 通用 常量
 */

// events

// resource window / document / 引用资源 的加载与卸载
export const ResourceEvents = ['cached', 'error', 'abort', 'load', 'beforeunload', 'unload'];

// 焦点事件
export const FocusEvents = ['focus', 'blur'];

// css 动画&过渡
export const CssEvents = ['animationstart', 'animationend', 'animationiteration', 'animationcancel', 'transitionend'];

// 表单事件
export const FormEvents = ['reset', 'submit', 'input', 'change'];

// 视图事件
export const ViewEvents = ['fullscreenchange', 'fullscreenerror', 'resize', 'scroll'];

// 剪切板事件
export const ClipboardEvents = ['cut', 'copy', 'paste', 'selectstart', 'selectionchange'];

// 键盘事件
export const KeyboardEvents = ['keydown', 'keypress', 'keyup'];

// 鼠标事件
export const MouseEvents = ['mouseenter', 'mouseover', 'mousemove', 'mousedown', 'mouseup', 'click', 'dbclick', 'contextmenu', 'wheel', 'mouseleave', 'mouseout','select','pointerlockchange', 'pointerlockerror'];

// 拖放事件
export const DragEvents = ['drag', 'dragstart', 'dragend', 'dragenter', 'dragover', 'dragleave', 'drop'];

// 媒体事件
export const MediaEvents = ['durationchange', 'loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'ended', 'emptied', 'stalled', 'suspend', 'play', 'playing', 'pause', 'waiting', 'seeking', 'seeked', 'ratechange', 'timeupdate', 'volumechange', 'complete', 'ended', 'audioprocess'];

// all events

export const AllEvents = [].concat(ResourceEvents, FocusEvents, CssEvents, FormEvents, ViewEvents, ClipboardEvents, KeyboardEvents, MouseEvents, DragEvents, MediaEvents);