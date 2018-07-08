const errors = [];
/**
 * 集中处理error
 * @param {Error} err 
 */
export const throwError = (err) => {
    if(err instanceof Error) {
        errors.push(err);
    }
}

export const handleErrors = (handler = defaultHandler) => {
    errors.forEach(err => handler(err));
    errors.splice(0, errors.length);
}

const defaultHandler = err => {
    console.error(err);
}