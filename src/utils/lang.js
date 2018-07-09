import { ObjectTypes } from './constant';
/**
 * 获取 type  首字母大写
 * @param {*} obj 
 * @returns {String} type 'Object', 'Array', 'Function', 'Symbol', 'Number', 'String', 'Boolean', 'Undefined','Null','Date', 'RegExp'
 */
export const getType = obj => toString.call(obj).replace(/\[object ([^\]]+)\]/, (t, t1) => t1);

export const SymbolFactory = (title,getable = false) => (desc, get = false) => (getable || get) ? Symbol.for(`${title}#${desc}`) : Symbol(`${title}#${desc}`);

/**
 * 深拷贝
 * @param {*} obj 
 * @returns {*} objCopy
 */
export const deepcopy = obj => {
    if (lang.isObject(obj)) {
        let t = {};
        Object.keys(obj).forEach(k => t[k] = deepcopy(obj[k]));
        return t;
    }
    if (lang.isArray(obj)) {
        return obj.map(t => deepcopy(t));
    }
    return obj;
}

/**
 * 深比较
 * @param {*} obj 
 * @param {*} cmp 
 * @returns {Boolean} isEqual
 */
export const deepEqual = (obj, cmp) => {
    // 类型不同不用比了
    if(getType(obj) !== getType(cmp)) return false;
    if (lang.isObject(obj) && lang.isObject(cmp)) {
        const ks = Object.keys(obj);
        return deepEqual(ks, Object.keys(cmp)) &&
            ks.findIndex(k => !deepEqual(obj[k], cmp[k])) === -1;
    }
    if (lang.isArray(obj) && lang.isArray(cmp)) {
        return obj.length === cmp.length && obj.findIndex((t, i) => !deepEqual(t, cmp[i])) === -1;
    }
    return Object.is(obj, cmp);
}

const lang =  ObjectTypes.reduce((mol,t) => {
    mol[`is${t}`] = obj => getType(obj) === t;
    return mol;
}, {
    getType,
    SymbolFactory,
    deepcopy,
    deepEqual,
    isNode: obj => obj instanceof Node,
    isUnval: obj => lang.isUndefined(obj) || lang.isNull(obj),
    isEmpty: obj => lang.isUnval(obj) || obj === '' || (lang.isArray(obj) && obj.length === 0) || Object.is(obj, NaN),
});

export default lang;