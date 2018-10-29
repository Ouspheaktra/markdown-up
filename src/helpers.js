export const removeDuplicate = arrArg => arrArg.filter((elem, pos, arr) => arr.indexOf(elem) === pos);
export const lastItem = array => array.length ? array[array.length - 1] : undefined;
export const clearObject = (obj) => Object.keys(obj).forEach(k => obj.hasOwnProperty(k) && delete obj[k]);
export const regexToString = (regex) => {
    regex = regex.toString();
    regex = regex.substring(1, regex.length - 1)
    return regex
}