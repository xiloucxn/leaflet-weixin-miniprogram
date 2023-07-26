import qs from "qs";
//通用工具模块

/**
 * 将对象转换为 URL 查询参数字符串
 *
 * e.g.
 *
 * const obj = { a: 'b', b: 'c', c: null, d: undefined, e: ['e1', 'e2']  };
 *
 * const existingUrl = 'https://aa.com/getUser';
 *
 * const paramString = getParamString(obj, existingUrl)
 *
 * 结果 https://aa.com/getUser?a=b&b=c&c&e=e1&e=e2
 *
 * @export
 * @param {*} obj
 * @param {*} existingUrl
 * @param {*} options
 * @return {*}
 */
export function getParamString(obj, existingUrl, options) {
  const paramString = qs.stringify(obj, { arrayFormat: "repeat", ...options });
  return (
    existingUrl +
    (existingUrl && existingUrl.indexOf("?") !== -1 ? "&" : "?") +
    paramString
  );
}

/**
 * 移除对象中的 null 和 undefined 属性
 *
 * e.g.
 *
 * const obj = { a: 'b', b: 'c', c: null, d: undefined }
 *
 * const newObj = removeNullUndefinedProperties(obj)
 *
 * 结果：{ a: 'b', b: 'c' }
 *
 * @param {*} obj
 * @return {*}
 */
export function removeNullUndefinedProperties(obj) {
  for (let key in obj) {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
  }
  return obj;
}

export var lastMapIndex = 0;
export function getMapIndex() {
  lastMapIndex = ++lastMapIndex;
  return lastMapIndex;
}
