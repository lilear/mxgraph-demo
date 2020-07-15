import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    redirect: { name: 'HelloWorld' },
    children: [
      {
        path: '/helloworld',
        name: 'HelloWorld',
        component: () => import('../components/HelloWorld.vue')
      },
      {
        path: '/graphToXml',
        name: 'GraphToXml',
        component: () => import('../components/GraphToXml.vue')
      },
      {
        path: '/playground',
        name: 'Playground',
        component: () => import('../components/Playground.vue')
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
