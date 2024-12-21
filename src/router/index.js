import {
    createRouter,
    createWebHashHistory,
    createWebHistory,
} from "vue-router";
// import { store } from '@/store';
import layout from "../components/LayOut.vue";
// 静态路由
export const constantRoutes = [
    {
        path: "/",
        component: layout,
        meta: {},
        children: [
            {
                path: "/isolarroof-3d/:id",
                name: "Index",
                component: () => import("../views/Index.vue"),
                meta: {},
            },
            {
                path: "/isolarroof-3d/ref/:id",
                name: "Ref-Index",
                component: () => import("../views/index-ref.vue"),
                meta: {},
            },
        ],
    },
];

const router = createRouter({
    history: createWebHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
    scrollBehavior: () => ({
        top: 0,
    }),
    routes: constantRoutes,
});

//   router.beforeEach((to, from, next) => {

//   });

export default router;

