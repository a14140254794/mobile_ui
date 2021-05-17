import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 获取所有vue文件
function getViews() {
  return require.context('../views', true, /\.vue$/);
}
// 首字母转换大写
function viewToUpperCase(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
// 首字母转换小写
function viewToLowerCase(str) {
  return str.charAt(0).toLowerCase() + str.slice(1);
}
const vueRouters = () => {
  const routerList = [];
  const requireRouters = getViews();
  requireRouters.keys().forEach((fileSrc) => {
    console.log(fileSrc,"文件")
    // 获取 views 文件下的文件名
    const viewSrc = requireRouters(fileSrc);
    const file =  viewSrc.default;
    // 首字母转大写
    const vueRouterUpper = viewToUpperCase(file.name);
    // 首字母转小写
    const vueRouterLower =  viewToLowerCase(file.name);
    const fileNameSrc = fileSrc.replace(/^\.\//, '');
    // 是否自动注册路由依据每个文件里的 isRouter 属性 避免注册不用的路由
    if (file.isRouter) {
      // 注册路由
      routerList.push({
        path: `/${vueRouterLower}`,
        name: `${vueRouterUpper}`,
        component:resolve => require([`@/views/${fileNameSrc}`], resolve)
      });
    }
  }); 
  return routerList;
};

const indexRouter = [
  { 
    path: '/',
    component:resolve => require(["@/views/index"], resolve)
  }
];
let routes = []
routes = indexRouter.concat(vueRouters())
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
