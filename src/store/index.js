import Vue from 'vue'
import Vuex from 'vuex'
import app from './modules/app'
import getters from './getters'



export default new Vuex.Store({
  modules: {
    app
  },
  state: {},
  mutations: {
  },
  actions: {},
  getters
})


// export default {
//   install: (app) => {
//     app.use(Vuex)
//     const store = new Vuex.Store({
//       modules: {
//         apps
//       },
//       state: {},
//       mutations: {
//       },
//       actions: {},
//       getters
//     })
//     app.config.globalProperties.$store = store
//   }
// }