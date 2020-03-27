import Vue from 'vue'
import Router from 'vue-router'

import store from '@/store'

Vue.use(Router)

export default new Router({
  mode:'history',
  routes: [
    {
      path: '/',
      redirect:'/login',
      beforeEnter(to,from,next){
        if(store.getters.token){
          next('/manager')
        }else{
          next()
        }
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login'),
      beforeEnter(to,from,next){
        if(store.getters.token){
          next('/manager')
        }else{
          next()
        }
      }
    },
    {
      path: '/forget',
      name: 'Forget',
      component: () => import('@/views/forget')
    },
    {
      path: '/reset',
      name: 'Reset',
      component: () => import('@/views/reset')
    },
    {
      path: '/register',
      name: 'Register',
      component: () => import('@/views/register')
    },
    {
      path:'/companyInfo',
      name:'CompanyInfo',
      component: () => import('@/views/companyInfo')
    },
    {
      path:'/certification',
      name:'Certification',
      component: () => import('@/views/certification')
    },
    {
      path: '/waitingPeriod',
      name: 'WaitingPeriod',
      component: () => import('@/views/waitingPeriod')
    },
    {
      path: '/manager',
      name: 'index',
      component: () => import('@/layout'),
      redirect:'/manager/contract',
      beforeEnter(to,from,next){
        if(store.getters.token){
          next()
        }else{
          store.commit('DELETE_TOKEN')
          next('/login')
        }
      },
      children:[
        {
          path: '/manager/invoic',
          name:'Invoic',
          component: () => import('@/components/manager/invoic'),
          meta:{keepAlive:true,title:['Invoic']}
        },
        {
          path: '/manager/company/basic',
          name:'Basic',
          component: () => import('@/components/manager/company/basic'),
          meta:{keepAlive:true,title:['Company','Basic']}
        },
        {
          path: '/manager/company/safe',
          name:'Safe',
          component: () => import('@/components/manager/company/safe'),
          meta:{keepAlive:true,title:['Company','Safe']}
        },
        {
          path: '/manager/project',
          name:'Project',
          component: () => import('@/components/manager/project'),
          meta:{keepAlive:true,title:['Project']}
        },
        {
          path: '/manager/project/projectDetail',
          name:'ProjectDetail',
          component: () => import('@/components/manager/project/projectDetail'),
          meta:{keepAlive:true,title:['Project','ProjectDetail'] },
          beforeEnter(to,from,next){
            if(store.getters.userInfo.userStatus == 1){
              next()
            }else{
              next('/manager')
            }
          }
        },
        {
          path: '/manager/contract',
          name:'Contract',
          component: () => import('@/components/manager/contract'),
          meta:{keepAlive:true,title:['Contract']},
          beforeEnter(to,from,next){
            if(store.getters.userInfo.userStatus == 1){
              next()
            }else{
              next('/manager')
            }
          }
        },
        {
          path:'/manager/contract/contractDetail',
          name:"ContractDetail",
          component: () => import('@/components/manager/contract/contractDetail'),
          meta:{keepAlive:true,title:['Contract','ContractDetail'] },
          beforeEnter(to,from,next){
            if(store.getters.userInfo.userStatus == 1){
              next()
            }else{
              next('/manager')
            }
          }
        },
        {
          path: '/manager/employee',
          name:'Employee',
          component: () => import('@/components/manager/employee'),
          meta:{keepAlive:true,title:['Employee']},
          beforeEnter(to,from,next){
            if(store.getters.userInfo.userStatus == 1){
              next()
            }else{
              next('/manager')
            }
          }
        },
        {
          path: '/manager/employee/employeeDetail',
          name:'EmployeeDetail',
          component: () => import('@/components/manager/employee/employeeDetail'),
          meta:{keepAlive:true,title:['Employee','EmployeeDetail']},
          beforeEnter(to,from,next){
            if(store.getters.userInfo.userStatus == 1){
              next()
            }else{
              next('/manager')
            }
          }
        }
      ]
    }
  ]
})
