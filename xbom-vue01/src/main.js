import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import VueRouter from 'vue-router'
import store from './store'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import {getRequest} from './utils/api'
import {postRequest} from './utils/api'
import {postJsonRequest} from './utils/api'
import {uploadFileRequest} from './utils/api'
import {deleteRequest} from './utils/api'
import {putRequest} from './utils/api'
import {initMenu} from './utils/utils'
import {isNotNullORBlank} from './utils/utils'
import {apiDownLoad} from './utils/api'
import {upDateRequest} from './utils/api'
upDateRequest
import './utils/filter_utils'
import 'font-awesome/css/font-awesome.min.css'
// import './style/theme/index.css';
import axios from 'axios'
import * as echarts from 'echarts';
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';
import Print from './plugs/print.js';

// import print from 'print-js'


Vue.prototype.$echarts = echarts
Vue.prototype.$http = axios


Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(ViewUI);
Vue.use(Print);

Vue.prototype.getRequest = getRequest;
//针对json类型单独定义的方法
Vue.prototype.postJsonRequest = postJsonRequest;
Vue.prototype.postRequest = postRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.putRequest = putRequest;
Vue.prototype.uploadFileRequest = uploadFileRequest;
Vue.prototype.apiDownLoad = apiDownLoad;
Vue.prototype.upDateRequest = upDateRequest;
Vue.prototype.isNotNullORBlank = isNotNullORBlank;

Vue.config.productionTip = false

router.beforeEach((to, from, next)=> {
    if (to.name == 'Login') {
      next();
      return;
    }
    var name = store.state.user.name;
    if (name == '未登录') {
      if (to.meta.requireAuth || to.name == null) {
        next({path: '/', query: {redirect: to.path}})
      } else {
        next();
      }
    } else {
      initMenu(router, store);
      if(to.path=='/chat')
        store.commit("updateMsgList", []);
      next();
    }
  }
)


new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
  components: {App},
  // template: '<App/>'
})
