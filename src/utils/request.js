/**
 * 纯静态版请求层 —— 替代原来的 axios 后端调用。
 * 保持 get / post / upload / uploadQiniu 签名不变，
 * 内部按接口路径分发到 src/local/db.js 的本地数据。
 * 返回形状与原来一致：{ code: 200, message, data }。
 */
import db from "../local/db";

function stripHost(url) {
  let path = String(url || "");
  const m = path.match(/^https?:\/\/[^/]+(\/.*)$/);
  if (m) {
    path = m[1];
  }
  const q = path.indexOf("?");
  if (q !== -1) {
    path = path.slice(0, q);
  }
  return path;
}

function ok(data) {
  return Promise.resolve({ code: 200, message: "操作成功", data: data });
}

// 未覆盖到的接口：打一条警告并返回空数据，保证页面不崩
function unhandled(key) {
  if (typeof console !== "undefined" && console.warn) {
    console.warn("[本地数据] 暂未覆盖接口:", key);
  }
  return ok(null);
}

const routes = {
  // 网站信息
  "GET /webInfo/getWebInfo": () => ok(db.getWebInfo()),
  "GET /webInfo/getSortInfo": () => ok(db.getSortInfo()),
  "GET /webInfo/getAdmire": () => ok(db.getAdmire()),
  "GET /webInfo/listAdminLovePhoto": () => ok(db.listAdminLovePhoto()),
  "GET /webInfo/listTreeHole": () => ok(db.listTreeHole()),
  "POST /webInfo/saveTreeHole": (p) => ok(db.saveTreeHole(p)),
  "GET /webInfo/deleteTreeHole": () => ok(db.deleteTreeHole()),
  "POST /webInfo/listResourcePath": (p) => ok(db.listResourcePath(p)),
  "GET /webInfo/listFunny": () => ok(db.listFunny()),
  "GET /webInfo/listFriend": () => ok(db.listFriend()),
  "POST /webInfo/saveFriend": (p) => ok(db.saveFriend(p)),
  "GET /webInfo/listCollect": () => ok(db.listCollect()),
  "POST /webInfo/updateWebInfo": () => ok(db.noop()),
  "POST /webInfo/updateResourcePath": () => ok(db.noop()),

  // 文章
  "POST /article/listArticle": (p) => ok(db.listArticle(p)),
  "GET /article/listSortArticle": () => ok(db.listSortArticle()),
  "GET /article/getArticleById": (p) => ok(db.getArticleById(p)),

  // 评论
  "GET /comment/getCommentCount": (p) => ok(db.getCommentCount(p)),
  "POST /comment/listComment": (p) => ok(db.listComment(p)),
  "POST /comment/saveComment": (p) => ok(db.saveComment(p)),

  // 微言 / 记录
  "POST /weiYan/listWeiYan": (p) => ok(db.listWeiYan(p)),
  "POST /weiYan/saveWeiYan": (p) => ok(db.saveWeiYan(p)),
  "GET /weiYan/deleteWeiYan": (p) => ok(db.deleteWeiYan(p)),
  "POST /weiYan/listNews": (p) => ok(db.listNews(p)),
  "POST /weiYan/saveNews": (p) => ok(db.saveNews(p)),

  // 用户（本地访客模式）
  "GET /user/subscribe": (p) => ok(db.subscribe(p)),
  "GET /user/logout": () => ok(db.noop()),
  "POST /user/login": () => ok(db.getUser()),
  "POST /user/regist": () => ok(db.getUser()),
  "POST /user/updateUserInfo": () => ok(db.getUser()),
  "POST /user/updateForForgetPassword": () => ok(db.noop()),
  "POST /user/updateSecretInfo": () => ok(db.getUser()),
  "GET /user/getCodeForForgetPassword": () => ok(db.noop()),
  "GET /user/getCodeForBind": () => ok(db.noop()),

  // 系统配置
  "GET /sysConfig/listSysConfig": () => ok(db.getSysConfig()),
  "POST /sysConfig/saveOrUpdateConfig": () => ok(db.noop()),
  "GET /sysConfig/listConfig": () => ok(db.noop()),
  "GET /sysConfig/deleteConfig": () => ok(db.noop()),

  // 恋爱 / 家（静态版不展示该栏目，保留空实现防止报错）
  "POST /family/saveFamily": () => ok(db.noop()),
  "GET /family/getFamily": () => ok(db.noop()),
  "GET /family/getAdminFamily": () => ok(db.noop()),
  "GET /family/listRandomFamily": () => ok([]),
  "GET /family/listFamily": () => ok([]),
  "GET /family/deleteFamily": () => ok(db.noop()),
  "GET /family/changeLoveStatus": () => ok(db.noop()),

  // 资源上传（静态版不支持上传，直接返回空）
  "GET /qiniu/getUpToken": () => ok(""),
  "POST /resource/upload": () => ok(""),
  "POST /resource/saveResource": () => ok(db.noop()),
  "GET /resource/listResource": () => ok({ records: [], total: 0, current: 1, size: 10 }),
  "GET /resource/deleteResource": () => ok(db.noop()),
  "GET /resource/changeResourceStatus": () => ok(db.noop())
};

export default {
  post(url, params = {}, isAdmin = false, json = true) {
    const key = "POST " + stripHost(url);
    const fn = routes[key];
    if (!fn) {
      return unhandled(key);
    }
    return fn(params || {});
  },

  get(url, params = {}, isAdmin = false) {
    const key = "GET " + stripHost(url);
    const fn = routes[key];
    if (!fn) {
      return unhandled(key);
    }
    return fn(params || {});
  },

  upload(url, param, isAdmin = false, option) {
    return ok("");
  },

  uploadQiniu(url, param) {
    return ok("");
  }
};
