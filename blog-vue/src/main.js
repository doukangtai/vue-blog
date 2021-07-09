import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import 'normalize.css/normalize.css'
import axios from "axios";
import {Message} from "element-ui";

// axios.defaults.baseURL = 'http://47.105.170.162/proxy'
// axios.defaults.baseURL = 'http://localhost:8081/proxy'

axios.interceptors.request.use(value => {
  let userStr = store.state.user;
  if (userStr != '' && userStr != undefined && userStr != '{}') {
    let userObj = JSON.parse(userStr)
    let token = userObj.token
    if (token != undefined && token != '') {
      value.headers.token = token
    }
  }
  return value;
}, error => {
  Message.error({message: '请求超时'});
  return Promise.resolve(error);
});

axios.interceptors.response.use(value => {
  return value;
}, error => {
  window.localStorage.removeItem('user')
  if (error.response.status == 500 || error.response.status == 504) {
    Message.error({message: '服务器挂掉了'});
  } else if (error.response.status == 404) {
    Message.error({message: '页面找不到'});
  } else if (error.response.status == 403) {
    Message.error({message: '没有权限访问'});
  } else if (error.response.status == 401) {
    Message.error({message: '未登录，请先登录'});
    router.push({path: '/login'})
  } else {
    Message.error({message: '找到了未知错误'});
  }
  return Promise.resolve(error);
});

Vue.config.productionTip = false

Vue.use(mavonEditor);

router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    const user = store.state.user
    if (user == '{}' || user == undefined || user == '') {
      next({path: '/login'});
    } else {
      next();
    }
  } else {
    next();
  }
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
