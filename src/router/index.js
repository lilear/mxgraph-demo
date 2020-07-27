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
        path: '/styleSheet',
        name: 'StyleSheet',
        component: () => import('../components/StyleSheet.vue')
      },
      {
        path: '/hustomToolbar',
        name: 'HtmlToolbar',
        component: () => import('../components/HtmlToolbar/index.vue')
      },
      {
        path: '/shapeToolbar',
        name: 'ShapeToolbar',
        component: () => import('../components/ShapeToolbar/index.vue')
      },
      {
        path: '/editNode',
        name: 'EditNode',
        component: () => import('../components/EditNode/index.vue')
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
