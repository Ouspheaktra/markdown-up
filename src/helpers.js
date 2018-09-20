export const removeDuplicate = arrArg => arrArg.filter((elem, pos, arr) => arr.indexOf(elem) === pos);
export const lastItem = array => array.length ? array[array.length - 1] : undefined;