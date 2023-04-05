# UJCMS-CP

UJCMS-CP 是 UJCMS 的后台前端项目。使用 Vue 3、Vite、TypeScript、ElementPlus、TailwindCSS、VueRouter、VueI18n 开发。

需要启动`UJCMS`主项目才可以使用，不可单独运行（无法访问后端接口）。

如不需要修改`UJCMS`的后台界面，则不必启动此项目。`UJCMS`的`/src/main/webapp/cp`目录已包含本项目编译后的代码，直接运行`UJCMS`主项目即可。

## 搭建步骤

- 使用 vscode 开发工具。
- 安装 node 环境。Node 14.18+ / 16+ 版本。
- 使用淘宝 npm 镜像。
- 安装依赖，执行：npm install
- 启动程序，执行：npm run dev
- 访问：http://localhost:9520
- 用户名：admin，密码：password。

# 修改后台标识

- 修改`.env`文件中的`VITE_APP_TITLE=UJCMS`配置，可改变登录页、后台左侧导航等处的`UJCMS`标识。
- 替换`/public/favicon.png`图片，可改变浏览器标签页上显示的图标。
- 修改`/src/layout/components/AppSidebar/Logo.vue`文件中的`svg`图标，可改变后台左侧导航处 LOGO 图标。

## 编译及部署

- 执行：npm run build
- 编译后的程序在`/dist`目录。
- 将`/dist`目录里的文件拷贝至主项目 UJCMS 的`/src/main/webapp/cp`目录下（先将原目录下的文件删除）。

## 前后端分开部署

通常前端和后端程序部署到同一个应用，即将前端程序复制到主项目 UJCMS 的`/cp`目录。以演示站点为例，后端接口地址为`https://demo.ujcms.com/api`,前端访问地址则为`https://demo.ujcms.com/cp/`。这样可以避免跨域问题，是最简单的部署方式。

如果需要将前后端部署到不同域名或端口，如后端接口地址为`http://www.example.com/api`，前端地址为`http://www.frontend.com`。由于前后端域名不同，前端直接访问后端接口会出现跨域错误。这时需要在前端服务器部署反向代理，解决跨域问题。以`nginx`为例：

```
# 代理 api 接口
location /api {
    proxy_pass http://www.example.com;
}
# 代理上传文件
location /uploads {
    proxy_pass http://www.example.com;
}
```

开发模式启动时，情况也类似，后端接口地址为`http://localhost:8080/api`，前端地址为`http://localhost:9520`。前后端端口不同，也属于跨域。但前端开发在状态启动时，会自动开启代理，相关配置在`vite.config.ts`文件中。类似以下代码：

```
proxy: {
    '/api': {
        target: env.VITE_PROXY,
        changeOrigin: true,
    },
    '/uploads': {
        target: env.VITE_PROXY,
        changeOrigin: true,
    },
},
```

## 菜单和角色权限配置

如果进行二次开发，需新增功能，可在`/src/router/index.ts`文件中配置菜单。

并可在`/src/data.ts`文件中配置权限，配置好的权限会在`角色管理 - 权限设置`中的`功能权限`中显示。

配置内容：

```
export function getPermsTreeData(): any[] {
  const {
    global: { t },
  } = i18n;
  const perms = [
    ...
  ]
}
```
