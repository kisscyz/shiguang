# 拾光小站 · 纯静态版

个人博客「拾光小站」的纯静态版本，部署于 GitHub Pages：https://kisscyz.github.io/shiguang/

## 说明

本站前端基于 [POETIZE](https://github.com/aLittleDonkey/poetize) 开源项目（**GNU AGPLv3**）的 Vue2 前端代码修改而来：

- 保留了原项目的整站样式与交互，仅替换了站点内容（文章、相册、收藏等均为本站原创内容）；
- 移除了 SpringBoot 后端依赖，所有数据接口改为读取本地数据（`src/local/db.js`），评论 / 留言 / 微言等写入操作降级为浏览器 localStorage 本地存储；
- 移除了后台管理、登录注册、聊天室等需要服务端的模块；
- 路由改为 hash 模式，以适配 GitHub Pages 纯静态托管。

## 协议

本项目遵循原项目的 **GNU Affero General Public License v3.0**（见 `LICENSE` 文件）。
原项目作者：aLittleDonkey（https://github.com/aLittleDonkey/poetize）。

## 本地开发

```bash
npm ci
NODE_OPTIONS=--openssl-legacy-provider npx vue-cli-service serve
```

## 构建与部署

```bash
NODE_OPTIONS=--openssl-legacy-provider npx vue-cli-service build
```

构建产物在 `dist/`，推送到 `gh-pages` 分支后由 GitHub Pages 发布。
