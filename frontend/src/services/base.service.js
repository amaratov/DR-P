import axios from 'axios';
import * as qs from 'qs';

class BaseService {
  axiosCall({ path, params, body, headers, method, contentType, responseType = 'json' }) {
    const url = `${path}`;
    const options = {
      method: method || 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': contentType || 'application/json',
        ...headers,
      },
      crossDomain: true,
      withCredentials: false,
      timeout: 0,
      responseType,
      url,
      params,
      paramsSerializer: params => {
        return qs.stringify(params, { arrayFormat: 'indices' });
      },
    };
    if (body) {
      options.data = body;
    }

    return axios(options);
  }
}

export default BaseService;
