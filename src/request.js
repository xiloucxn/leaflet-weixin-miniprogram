import { notification, message } from "antd";

let isTrue;

function checkStatus(response) {
  if (!isTrue) {
    notification.config({
      duration: 5,
      top: 50,
    });
    message.config({
      duration: 5,
    });
    isTrue = true;
  }
  return response;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then((data) => ({ data }))
    .catch((err) => {
      console.log("网络连接不可用", err);
      return { data: { success: false, error: err, result: null } };
    });
}
