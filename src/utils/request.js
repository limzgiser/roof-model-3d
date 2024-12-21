import axios from "axios";
import { message } from "ant-design-vue";
// import qs from "qs";
axios.defaults.baseURL = ""; // api基础地址
//post请求头
axios.defaults.headers.post["Content-Type"] =
    "application/x-www-form-urlencoded;charset=UTF-8";
//设置超时
axios.defaults.timeout = 60000;
// 'http://47.98.166.97/stringline-test'
let env = import.meta.env;
const baseUrl = env.VITE_BASE_API;
const loginUrl = env.VITE_DOMAIN_API;
axios.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axios.interceptors.response.use(
    (response) => {
        // 返回的数据
        return response;
    },
    (error) => {
        if (error.response.status === 401) {
            //对应的token过期的操作
            localStorage.setItem("@_token", "");
            if (import.meta.env.MODE !== "development") {
                location.href = loginUrl;
            } else {
                message.destroy();
                message.error(error.response.data.msg);
            }
        }
        return Promise.reject(error.response);
    }
);
export default function request(api, params = {}, method = "get") {
    var data = params;
    let tokenStr = localStorage.getItem("@_token");
    let token = tokenStr ? JSON.parse(tokenStr).token : "";
    // 演示用
    if (!token) {
        token = localStorage.getItem("token");
    }
    let headers = {
        "Content-Type": "application/json",
        Authorization: token ? token : "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyb29mQWRtaW4iLCJpc3MiOiI3NTAxMzgiLCJhcHBDb2RlIjoicm9vZiIsImxvZ2luX3VzZXJfa2V5IjoiZGUxNGE4NjAtNGUxNi00NjRlLWE1NTEtNjg5MmY1MTI4NWM4In0.GI-RWd59zwef27S5y2NFWCTjao_LSLJkci8PjrQFco4"
    }
    return new Promise((resolve, reject) => {
        axios({
            method: method,
            url: api,
            data: data,
            baseURL: baseUrl,
            headers: headers,
        })
            .then((res) => {
                if (res.data.code == 200) {
                    resolve(res.data);
                } else {
                    // 打印接口错误提示
                    // ....
                    console.error(res.data.msg);
                    message.destroy();
                    message.error(res.data.msg);
                }
            })
            .catch((error) => {
                if (error.data.code === 401) {
                    //对应的token过期的操作
                    localStorage.setItem("@_token", "");
                    if (import.meta.env.MODE !== "development") {
                        location.href = loginUrl;

                    } else {
                        message.destroy();
                        message.error(error.data.msg);
                    }
                }

                reject(error.data);
            });
    });
}

