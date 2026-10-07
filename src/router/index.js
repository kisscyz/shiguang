import Vue from 'vue'
import VueRouter from 'vue-router'

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
}

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: () => import('../components/home'),
    children: [{
      path: "/",
      name: "index",
      component: () => import('../components/index')
    }, {
      path: "/sort",
      name: "sort",
      component: () => import('../components/sort')
    }, {
      path: "/article/:id",
      name: "article",
      component: () => import('../components/article')
    }, {
      path: "/weiYan",
      name: "weiYan",
      component: () => import('../components/weiYan')
    }, {
      path: "/favorite",
      name: "favorite",
      component: () => import('../components/favorite')
    }, {
      path: "/travel",
      name: "travel",
      component: () => import('../components/travel')
    }, {
      path: "/message",
      name: "message",
      component: () => import('../components/message')
    }, {
      path: "/about",
      name: "about",
      component: () => import('../components/about')
    }, {
      path: "/letter",
      name: "letter",
      component: () => import('../components/letter')
    }]
  }
]

const router = new VueRouter({
  routes: routes,
  scrollBehavior(to, from, savedPosition) {
    return {x: 0, y: 0}
  }
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!Boolean(localStorage.getItem("adminToken"))) {
      next({
        path: '/verify',
        query: {redirect: to.fullPath}
      });
    } else {
      next();
    }
  } else {
    next();
  }
})

export default router
