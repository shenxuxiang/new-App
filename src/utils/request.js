import 'whatwg-fetch';

const CREDENTIALS = 'include';
const HEADERS = {
  'Content-Type': 'application/x-www-form-urlencoded',
  Accept: 'application/json',
};
const MODE = 'cors';

const computedURL = (requUrl, payload) => {
  let url = `${requUrl}?`;
  Object.keys(payload).forEach((item) => {
    url += `${item}=${payload[item]}&`;
  });
  return url.slice(0, url.length - 1);
};

const sendRequest = (requUrl, payload = {}, reqMethod = 'GET', reqHeaders = HEADERS, isFormData = false) => {
  const method = reqMethod.toUpperCase();
  const url = method === 'POST' ? requUrl : computedURL(requUrl, payload);
  const headers = !isFormData ? reqHeaders : {};
  const body = !isFormData ? JSON.stringify(payload) : payload;
  const options = {
    method,
    headers,
    body,
    credentials: CREDENTIALS,
    mode: MODE,
  };
  if (method === 'GET') delete options.body;
  return new Promise((resolve, reject) => {
    fetch(url, options)
      .then(resp => resp.json()
        .then((json) => {
          if (resp.ok) return json;
          return Promise.reject({
            ...json,
            status: resp.status,
            statusText: resp.statusText,
            msg: resp.statusText,
          });
        })
        .catch(err => Promise.reject({ msg: 'request_error' })))
      .then(data => resolve(data))
      .catch(err => reject(err));
  });
};

export default sendRequest;
