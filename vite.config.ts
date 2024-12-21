/*
 * @Author: wujian
 * @Date: 2022-05-05 13:20:28
 * @LastEditors: wujian
 * @LastEditTime: 2022-11-25 17:43:52
 * @FilePath: \sungrow\vite.config.js
 * @Description: 
 * @email: 281919544@qq.com
 * Copyright (c) 2022 by wujian 281919544@qq.com, All Rights Reserved. 
 */
import { defineConfig } from "vite";
import { resolve } from "path";
import Components from "unplugin-vue-components/vite";
import { AntDesignVueResolver } from "unplugin-vue-components/resolvers";
import vue from "@vitejs/plugin-vue";
function pathResolve(dir) {
    return resolve(__dirname, ".", dir);
}

export default defineConfig({
    /**
     * 在生产环境的基本公共路径。
     * @default '/'
     */
    base: "/isolarroof-3d/",
    /**
     * 构建输出目录。如果目录存在，它将在构建之前被删除。
     * @default 'dist'
     */
    preview: {
        // 是否自动在浏览器打开
        // open: true,
        // 是否开启 https
        // https: false,
    },
    // 引入第三方的配置
    /* optimizeDeps: {
      include: ['moment', 'axios'],
    }, */
    resolve: {
        // 目录别名
        alias: {
            "/@/": pathResolve("src"),
        },
    },
    // 打包后静态资源 js/css/image 存放目录，@default '_assets'
    //   assetsDir: '',
    server: {
        // 代理 123

        proxy: {
            "/api": {
                target: 'http://116.62.184.16/stringline',
                // target: 'http://121.40.64.25/stringline',
                // target: 'http://192.168.133.11/stringline',
                // target: 'http://192.168.135.15:8091',
                // target: 'http://192.168.135.121:8091',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
            },
            '/_api2': {
                target: 'http://192.168.135.15:8090',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/_api2/, '')
            }
        },
        // 是否开启 https
        // https: false,
        // 服务端渲染
        // ssr: false,
        host: "0.0.0.0",
        port: 3001,
        https: false,
        hmr: true
    },
    build: {
        outDir: "dist",
    },
    plugins: [
        vue(),
        Components({
            resolvers: [AntDesignVueResolver()],
        }),
    ],
});

