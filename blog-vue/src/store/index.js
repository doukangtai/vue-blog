import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: window.localStorage.getItem('user') || {}
  },
  mutations: {
    login(state, user) {
      state.user = user;
      window.localStorage.setItem('user', user);
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
