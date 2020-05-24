import Vue from 'vue'
import Router from 'vue-router'
import Main from '../components/Main.vue'
import Scan from '../components/Scan.vue'
import Detail from '../components/Detail.vue'
import Detection from '../components/Detection.vue'
import Report from '../components/Report.vue'
import User from '../components/User.vue'
import Info from '../components/Info.vue'
import Setting from '../components/settings/Setting.vue'
import Sites from '../components/views/Sites.vue'
import Vuln from '../components/views/Vuln.vue'
import UserEdit from '../components/views/UserEdit.vue'
import Login from '../components/Login.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {path:'/login',name:'Login',component:Login},
    {
      path: '/',
      name: 'Main',
      component: Main,
      children:[
        {path: '/scan',component: Scan},
        {path: '/detail',component: Detail},
        {path: '/detection', component: Detection},
        {path: '/info',component: Info},
        {path: '/report',component:Report },
        {path: '/user',component: User},
        {path: '/setting',component: Setting},
        {path: '/vuln/:id',component:Vuln},
        {path: '/sites/:siteshash',component:Sites},
        {path: '/user/:id/edit',component:UserEdit}


      ]


    }


  ]
});

