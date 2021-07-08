import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: window.localStorage.getItem('user') == null ? JSON.stringify({}) : window.localStorage.getItem('user')
  },
  mutations: {
    login(state, user) {
      let userStr = JSON.stringify(user)
      state.user = userStr;
      window.localStorage.setItem('user', userStr);
    },
    logout(state) {
      state.user = '';
      window.localStorage.removeItem('user');
    }
  },
  actions: {
  },
  modules: {
  }
})
