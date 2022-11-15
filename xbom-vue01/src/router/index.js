import Vue from 'vue'
import Router from 'vue-router'

import HelloWorld from '@/components/HelloWorld'
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import Home from '@/components/Home.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },{  
	  path: '/Login',
	  name: 'Login',
	  component: Login,
		hidden:true
	},{
	  path: '/Register',
	  name: 'Register',
	  component: Register,
	  isRouterAlive:true,
		hidden:true
	},{
		path: '/home',
		name: '主页',
		component: Home,
		hidden: true,
		meta: {
			requireAuth: true
		}
	}
  ]
})
