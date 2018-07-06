import { isObject, isFunction, isArray, isBoolean } from 'lodash';

export const SymbolFactory = (title,getable = false) => (desc, get = false) => (getable || get) ? Symbol.for(`${title}#${desc}`) : Symbol(`${title}#${desc}`);
