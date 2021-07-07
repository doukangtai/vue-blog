import axios from "axios";
import {Message} from "element-ui";
import store from '.././store'

axios.interceptors.request.use(value => {
  let userObj = store.state.user;
  if (!userObj || JSON.stringify(userObj) === "{}" || userObj.length === 0) {

  }
  return value;
}, error => {
  Message.error({message: '请求超时'});
  return Promise.resolve(error);
});

axios.interceptors.response.use(value => {
  return value;
}, error => {
  if (error.response.status == 500 || error.response.status == 504) {
    Message.error({message: '服务器挂掉了'});
  } else if (error.response.status == 404) {
    Message.error({message: '页面找不到'});
  } else if (error.response.status == 403) {
    Message.error({message: '没有权限访问'});
  } else if (error.response.status == 401) {
    Message.error({message: '未登录，请先登录'});
  } else {
    Message.error({message: '找到了未知错误'});
  }
  return Promise.resolve(error);
});

export const postRequest = (url, params) => {
  return axios({
    url: url,
    method: 'post',
    data: params,
    transformRequest: [function (data) {
      let param = '';
      for (let dt in data) {
        param += encodeURIComponent(dt) + '=' + encodeURIComponent(data[dt]) + '&';
      }
      return param;
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
};

export const putRequest = (url, params) => {
  return axios({
    url: url,
    method: 'put',
    data: params,
    transformRequest: [function (data) {
      let param = '';
      for (let dt in data) {
        param += encodeURIComponent(dt) + '=' + encodeURIComponent(data[dt]) + '&';
      }
      return param;
    }],
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
};

export const deleteRequest = (url) => {
  return axios({
    url: url,
    method: 'delete',
  })
};

export const getRequest = (url) => {
  return axios({
    url: url,
    method: 'get',
  })
};

export const getRequestPage = (url, params) => {
  return axios({
    url: url,
    method: 'get',
    data: params
  })
};

export const uploadFileRequest = (url, params) => {
  return axios({
    url: url,
    method: 'post',
    data: params,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};
