
const defaultMessage = '{actual} is not equal {expected}';
export const assert = (actual, expected, message = defaultMessage) => {
  if (actual === expected) {
    return assert;
  } else {
    throw new Error(message.replace('{actual}', actual).replace('{expected}', expected));
  }
};
const defaultBlockMessage = 'Test {name} passed!';
const defaultErrorMessage = 'Test {name} failed!';
export const block = (name, callback, message = defaultBlockMessage, errMessage = defaultErrorMessage) => {
  try {
    callback();
    console.log(message.replace('{name}', name));
  } catch(err) {
      console.error(err);
      console.error(errMessage);
  }
}