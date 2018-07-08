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

const defaultTimeMess = 'SET time at {time}, cost {interval} ms from last SET!';
const Times = [];
export const setTime = (message = defaultTimeMess) => {
  Times.push(new Date());
  const t = Times[Times.length - 1];
  if (Times.length < 2) {
    console.log(message.replace('{time}', t).replace('{interval}', 0));
  } else {
    const last =  Times[Times.length - 2];
    console.log(message.replace('{time}', t).replace('{interval}', t.getTime() - last.getTime()));
  }
}