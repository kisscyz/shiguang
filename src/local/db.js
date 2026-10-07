/**
 * 本地数据中心 —— 纯静态版的数据层，替代原来的 SpringBoot 后端接口。
 * 所有页面组件保持不动，src/utils/request.js 会把接口调用分发到这里。
 *
 * 数据分两类：
 * 1. 基础内容（文章、相册、收藏等）：写死在下方，可直接改。
 * 2. 用户产生的内容（评论、留言、微言）：localStorage 持久化，种子数据 + 用户新增合并。
 */

const AVATAR = "./images/avatar.jpg";

function lsGet(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v ? JSON.parse(v) : fallback;
  } catch (e) {
    return fallback;
  }
}

function lsSet(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    // 忽略存储异常
  }
}

function now() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, "0");
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate()) + " " +
    p(d.getHours()) + ":" + p(d.getMinutes()) + ":" + p(d.getSeconds());
}

// ================= 1. 网站信息 =================
// 注意：webTitle 提供字符串（store 会 split 成逐字数组）；
// notices / randomCover 提供 JSON 字符串（store 会 JSON.parse）。

const webInfo = {
  id: 1,
  webName: "拾光小站",
  webTitle: "在山水之间，拾一段光",
  notices: JSON.stringify([
    "欢迎来到拾光小站 ✨",
    "本站已切换为纯静态版本，托管于 GitHub Pages"
  ]),
  randomCover: JSON.stringify([
    "./images/hero-banner.jpg",
    "./images/essays/banner.jpg",
    "./images/travel/hero-aurora.jpg",
    "./images/album/kyoto.jpg"
  ]),
  footer: "© 2026 拾光小站",
  backgroundImage: "./images/hero-banner.jpg",
  avatar: AVATAR,
  status: 1,
  waifuJson: "",
  historyAllCount: 1024,
  defaultStoreType: "local"
};

const sysConfig = {
  beian: "",
  webStaticResourcePrefix: "./",
  qiniuUrl: "",
  "qiniu.downloadUrl": ""
};

// ================= 2. 文章分类 =================

const sortInfo = [
  {
    id: 1,
    sortName: "随笔",
    sortDescription: "灵感碎片、日常吐槽、深夜感慨 —— 随身携带的情绪收纳盒",
    sortType: 0,
    priority: 1,
    countOfSort: 6,
    labels: [
      { id: 11, labelName: "日常", countOfLabel: 4 },
      { id: 12, labelName: "感悟", countOfLabel: 2 }
    ]
  },
  {
    id: 2,
    sortName: "游记",
    sortDescription: "走过的地方，看过的风景",
    sortType: 0,
    priority: 2,
    countOfSort: 2,
    labels: [
      { id: 21, labelName: "徒步", countOfLabel: 1 },
      { id: 22, labelName: "旅行", countOfLabel: 1 }
    ]
  }
];

const SORT_NAMES = { 1: "随笔", 2: "游记" };
const LABEL_NAMES = { 11: "日常", 12: "感悟", 21: "徒步", 22: "旅行" };

// ================= 3. 文章 =================

const articles = [
  {
    id: 101,
    articleTitle: "春山夜行，灯火如星",
    articleCover: "./images/album/zhangjiajie.jpg",
    articleContent: "春山夜行，灯火如星。\n\n春夜游过山间，灯火如繁星点点，夜色渐深，松涛与溪水交响，静听自然的低语。\n\n> 有些路，一个人走反而更清楚自己要去哪。\n\n📍 山间 · 心情：平静",
    username: "拾光",
    userId: 1,
    createTime: "2024-04-12 20:00:00",
    updateTime: "2024-04-12 20:00:00",
    viewCount: 328,
    commentCount: 4,
    likeCount: 36,
    videoUrl: "",
    commentStatus: true,
    hasVideo: false,
    sortId: 1,
    labelId: 11,
    sort: { sortName: "随笔" },
    label: { labelName: "日常" }
  },
  {
    id: 102,
    articleTitle: "雨后西湖，适合发呆",
    articleCover: "./images/album/xiamen.jpg",
    articleContent: "雨后西湖，适合发呆。\n\n雨停了，巷子里的青石板泛着潮湿的光，茶烟从屋檐缝隙升起。\n\n> 一个下午，一杯茶，什么都不做，也是一种抵达。\n\n📍 杭州 · 心情：放松",
    username: "拾光",
    userId: 1,
    createTime: "2024-04-08 15:30:00",
    updateTime: "2024-04-08 15:30:00",
    viewCount: 512,
    commentCount: 8,
    likeCount: 64,
    videoUrl: "",
    commentStatus: true,
    hasVideo: false,
    sortId: 1,
    labelId: 11,
    sort: { sortName: "随笔" },
    label: { labelName: "日常" }
  },
  {
    id: 103,
    articleTitle: "墨染秋叶，笔下闲云",
    articleCover: "./images/album/kyoto.jpg",
    articleContent: "墨染秋叶，笔下闲云。\n\n秋叶渐染时，墨色也随之更深。于宣纸上一笔闲云，任它随风散去远方。\n\n> 写字和走路一样，慢下来才看得清。\n\n📍 书房 · 心情：专注",
    username: "拾光",
    userId: 1,
    createTime: "2024-04-03 21:00:00",
    updateTime: "2024-04-03 21:00:00",
    viewCount: 286,
    commentCount: 3,
    likeCount: 29,
    videoUrl: "",
    commentStatus: true,
    hasVideo: false,
    sortId: 1,
    labelId: 11,
    sort: { sortName: "随笔" },
    label: { labelName: "日常" }
  },
  {
    id: 104,
    articleTitle: "整理旧照片",
    articleCover: "./images/album/shanghai.jpg",
    articleContent: "整理旧照片，发现三年前的自己站在同一座山前，笑得没心没肺。\n\n山还是那座山，人已经走了很远。\n\n> 挺好的。\n\n📍 相册 · 心情：怀旧",
    username: "拾光",
    userId: 1,
    createTime: "2024-03-28 19:00:00",
    updateTime: "2024-03-28 19:00:00",
    viewCount: 431,
    commentCount: 6,
    likeCount: 52,
    videoUrl: "",
    commentStatus: true,
    hasVideo: false,
    sortId: 1,
    labelId: 12,
    sort: { sortName: "随笔" },
    label: { labelName: "感悟" }
  },
  {
    id: 105,
    articleTitle: "楼下的桂花开了",
    articleCover: "./images/hero-banner.jpg",
    articleContent: "楼下的桂花开了，香气拐着弯钻进窗户。\n\n决定今晚不加班，去江边走一走。\n\n> 生活偶尔也需要一点不务正业。\n\n📍 江边 · 心情：愉悦",
    username: "拾光",
    userId: 1,
    createTime: "2024-03-20 18:20:00",
    updateTime: "2024-03-20 18:20:00",
    viewCount: 377,
    commentCount: 5,
    likeCount: 48,
    videoUrl: "",
    commentStatus: true,
    hasVideo: false,
    sortId: 1,
    labelId: 11,
    sort: { sortName: "随笔" },
    label: { labelName: "日常" }
  },
  {
    id: 106,
    articleTitle: "极光之夜的后遗症",
    articleCover: "./images/travel/hero-aurora.jpg",
    articleContent: "极光之夜的后遗症：看什么都觉得不够亮。\n\n回来一周了，梦里还是那片绿色的天。\n\n> 有些风景，看过就再也忘不掉。\n\n📍 挪威 · 心情：震撼",
    username: "拾光",
    userId: 1,
    createTime: "2024-03-15 22:00:00",
    updateTime: "2024-03-15 22:00:00",
    viewCount: 689,
    commentCount: 11,
    likeCount: 87,
    videoUrl: "",
    commentStatus: true,
    hasVideo: false,
    sortId: 1,
    labelId: 12,
    sort: { sortName: "随笔" },
    label: { labelName: "感悟" }
  },
  {
    id: 201,
    articleTitle: "冰川极光：七日挪威峡湾徒步纪实",
    articleCover: "./images/travel/hero-aurora.jpg",
    articleContent: "## 行程概览\n\n当极光划破北极圈的夜空，吕瑟峡湾的冰川在星光下泛着冷调的蓝。七日徒步，穿越最震撼的峡湾线，从卑尔根出发，深入极地边缘，体验冰与光的诗篇。\n\n本次路线全长约 68 公里，海拔爬升 1200m，沿途经过冰川湖、雪山营地、古老渔村。我们选择三月出发，正值极光季高峰，夜晚气温 -8℃ 至 -2℃，日间晴好，适合徒步与摄影。\n\n## 徒步路线 & 每日记录\n\n- **Day 1.** 卑尔根 → 弗拉姆，冰川列车初体验\n- **Day 3.** 攀登布道石，悬崖日落\n- **Day 5.** 冰川宿营 & 极光守夜\n\n第三天是最难忘的一天。清晨五点出发，背着十五公斤的包，沿着之字形山路上行。下午四点登顶布道石时，云层正好裂开一道缝，阳光像舞台灯一样打在峡湾上，同行的人都安静了。\n\n## 极光观测与拍摄建议\n\n![第三天营地极光](./images/travel/fig-camp.jpg)\n\n- **最佳观测时间：** 23:00–02:00，避开月光，KP 值 ≥ 4 时成功率更高。\n- **摄影参数：** ISO 1600–3200，f/2.8，快门 15–20 秒，三脚架必备。\n- **推荐设备：** 广角镜头 14–24mm，防寒电池保温套。\n\n## 装备清单与保暖指南\n\n三层穿衣是铁律：排汗内衣 + 抓绒中间层 + 防风冲锋衣。手套备两副（一薄一厚），帽子遮住耳朵，暖宝宝贴满鞋垫。极寒下手机半小时就关机，充电宝贴身放，用保温套裹住相机电池。\n\n## 摄影技巧 & 相机设置\n\n手动对焦拧到无穷远再回拨一点，用实时取景放大星星确认合焦。前景找个小木屋或枯树做剪影，画面立刻有故事。别只顾拍——留十分钟给自己，躺下来看极光在头顶流动。\n\n## 安全提示 & 当地注意\n\n布道石一带无护栏，风大时贴着内侧走；冰川行走务必跟向导，不要独自上冰。挪威商店周日大多关门，补给提前买好。\n\n> 最后一晚，极光如期而至——所有的寒冷和疲惫都值得。",
    username: "拾光",
    userId: 1,
    createTime: "2024-03-15 10:00:00",
    updateTime: "2024-03-18 10:00:00",
    viewCount: 2800,
    commentCount: 2,
    likeCount: 186,
    videoUrl: "",
    commentStatus: true,
    hasVideo: false,
    sortId: 2,
    labelId: 21,
    sort: { sortName: "游记" },
    label: { labelName: "徒步" }
  },
  {
    id: 202,
    articleTitle: "一场说走就走的旅行 —— 云南",
    articleCover: "https://picsum.photos/seed/shiguang-yunnan/800/450",
    articleContent: "## 说走就走\n\n暑中期的云南之行，主打一个休闲式穷游，看心不看攻略。\n\n大理的洱海，苍山洱海，风花雪月。早上在古城里晃悠，下午租个电动车环洱海，晚上找家小馆子吃菌子火锅。\n\n## 丽江古城\n\n丽江古城适合迷路。青石板路弯弯绕绕，每家店都飘着咖啡香。晚上去酒吧街听一场民谣，第二天睡到自然醒。\n\n## 碎碎念\n\n> 旅行不一定要去远方，把日子过成旅行也一样。",
    username: "拾光",
    userId: 1,
    createTime: "2024-01-10 14:00:00",
    updateTime: "2024-01-10 14:00:00",
    viewCount: 1150,
    commentCount: 0,
    likeCount: 92,
    videoUrl: "",
    commentStatus: true,
    hasVideo: false,
    sortId: 2,
    labelId: 22,
    sort: { sortName: "游记" },
    label: { labelName: "旅行" }
  }
];

// ================= 4. 记录（微言时间流） =================

const weiYanSeeds = [
  { id: 307, content: "小站改版：玻璃拟态新皮肤上线\n全站换成 Facebook 蓝 + 玻璃拟态风格，卡片、按钮、侧栏全部磨砂化，手机端也做了单列适配。", createTime: "2024-04-12 10:00:00", userId: 1 },
  { id: 306, content: "发布随笔《雨后西湖，适合发呆》\n雨后的杭州，巷子泛着潮湿的光。有些下午就该浪费在发呆里。", createTime: "2024-04-08 16:00:00", userId: 1 },
  { id: 305, content: "相册新增「京都 · 樱道晚照」\n整理好了京都之行的照片，樱花季的晚照，美得不像话。", createTime: "2024-04-03 20:00:00", userId: 1 },
  { id: 304, content: "发布游记《冰川极光：七日挪威峡湾徒步纪实》\n七日徒步，68 公里，KP5 级极光爆发。这是今年最难忘的一次出发。", createTime: "2024-03-15 10:00:00", userId: 1 },
  { id: 303, content: "百宝箱上线：资源中心开放\n把私藏的写作灵感库、摄影参数表、行李清单都整理进了百宝箱。", createTime: "2024-02-20 14:00:00", userId: 1 },
  { id: 302, content: "发布游记《一场说走就走的旅行 —— 云南》\n暑中期的云南之行，主打一个休闲式穷游，看心不看攻略。", createTime: "2024-01-10 14:00:00", userId: 1 },
  { id: 301, content: "拾光小站正式上线 🎉\n纯静态博客第一版发布，部署在 GitHub Pages，免费、快速、无需服务器。", createTime: "2024-01-01 00:00:00", userId: 1 }
];

// 文章历程（process.vue 时间轴）：articleId -> 记录数组
const newsSeeds = {};

// ================= 5. 留言弹幕（树洞） =================

const treeHoleSeeds = [
  { id: 903, avatar: AVATAR, message: "拾光小站换新皮肤啦，欢迎常来坐坐～" },
  { id: 902, avatar: AVATAR, message: "挪威的极光真的值得一看，有机会一定要去一次" },
  { id: 901, avatar: AVATAR, message: "随笔区记录日常碎片，想到什么写什么" }
];

// ================= 6. 文章评论 =================
// key: `${source}_${commentType}`，如 "201_article"

const commentSeeds = {
  "201_article": [
    {
      id: 601,
      avatar: AVATAR,
      username: "星空旅人",
      userId: 3,
      createTime: "2024-03-20 10:00:00",
      commentContent: "KP5 的极光太幸运了！布道石那段看得我心跳加速，明年也想去",
      childComments: {
        records: [
          {
            id: 602,
            avatar: AVATAR,
            username: "拾光",
            userId: 1,
            createTime: "2024-03-20 12:30:00",
            commentContent: "哈哈，三月去成功率最高，记得提前查 KP 指数～",
            parentCommentId: 601,
            parentUserId: 3,
            parentUsername: "星空旅人"
          }
        ],
        total: 1
      }
    },
    {
      id: 603,
      avatar: AVATAR,
      username: "山野信徒",
      userId: 4,
      createTime: "2024-03-22 09:15:00",
      commentContent: "装备清单很实用，已收藏。暖宝宝贴鞋垫这个细节太真实了",
      childComments: { records: [], total: 0 }
    }
  ]
};

// ================= 7. 相册（旅拍） =================

let __photoId = 1000;
function makePhotos(classify, cover, title, date, extraSeeds) {
  const list = [{ id: __photoId++, cover: cover, title: title, createTime: date + " 12:00:00", classify: classify, url: cover }];
  (extraSeeds || []).forEach((seed, i) => {
    const c = "https://picsum.photos/seed/" + seed + "/600/400";
    list.push({ id: __photoId++, cover: c, title: title + " · 其" + (i + 2), createTime: date + " 12:00:00", classify: classify, url: c });
  });
  return list;
}

const albumDefs = [
  { classify: "九寨沟", cover: "./images/album/jiuzhai.jpg", title: "九寨沟 · 碧水叠瀑", date: "2024-04-10", seeds: ["sg-jiuzhai-1", "sg-jiuzhai-2", "sg-jiuzhai-3"] },
  { classify: "上海", cover: "./images/album/shanghai.jpg", title: "上海 · 外滩夜色", date: "2024-04-08", seeds: ["sg-shanghai-1", "sg-shanghai-2", "sg-shanghai-3"] },
  { classify: "京都", cover: "./images/album/kyoto.jpg", title: "京都 · 樱道晚照", date: "2024-04-05", seeds: ["sg-kyoto-1", "sg-kyoto-2", "sg-kyoto-3"] },
  { classify: "敦煌", cover: "./images/album/dunhuang.jpg", title: "敦煌 · 鸣沙月泉", date: "2024-04-02", seeds: ["sg-dunhuang-1", "sg-dunhuang-2", "sg-dunhuang-3"] },
  { classify: "张家界", cover: "./images/album/zhangjiajie.jpg", title: "张家界 · 云雾林瀑", date: "2024-03-28", seeds: ["sg-zhangjiajie-1", "sg-zhangjiajie-2", "sg-zhangjiajie-3"] },
  { classify: "厦门", cover: "./images/album/xiamen.jpg", title: "厦门 · 鼓浪屿海崖", date: "2024-03-20", seeds: ["sg-xiamen-1", "sg-xiamen-2", "sg-xiamen-3"] },
  { classify: "挪威", cover: "https://picsum.photos/seed/pick-norway/600/375", title: "挪威 · 峡湾极光", date: "2024-03-15", seeds: ["sg-norway-1", "sg-norway-2", "sg-norway-3"] },
  { classify: "成都", cover: "https://picsum.photos/seed/pick-chengdu/600/375", title: "成都 · 宽窄巷子", date: "2024-02-20", seeds: ["sg-chengdu-1", "sg-chengdu-2", "sg-chengdu-3"] },
  { classify: "丽江", cover: "https://picsum.photos/seed/pick-lijiang/600/375", title: "丽江 · 古城人家", date: "2024-01-28", seeds: ["sg-lijiang-1", "sg-lijiang-2", "sg-lijiang-3"] },
  { classify: "呼伦贝尔", cover: "https://picsum.photos/seed/pick-hulunbuir/600/375", title: "呼伦贝尔 · 草原晨雾", date: "2023-12-20", seeds: ["sg-hulunbuir-1", "sg-hulunbuir-2", "sg-hulunbuir-3"] },
  { classify: "大理", cover: "https://picsum.photos/seed/pick-yunnan2/600/375", title: "大理 · 洱海日出", date: "2024-01-15", seeds: ["sg-dali-1", "sg-dali-2", "sg-dali-3"] },
  { classify: "杭州", cover: "https://picsum.photos/seed/pick-hangzhou/600/375", title: "杭州 · 西湖雨后", date: "2024-04-06", seeds: ["sg-hangzhou-1", "sg-hangzhou-2", "sg-hangzhou-3"] }
];

const lovePhotoClassifies = albumDefs.map((a) => ({ classify: a.classify, count: 4 }));
const lovePhotos = [];
albumDefs.forEach((a) => {
  makePhotos(a.classify, a.cover, a.title, a.date, a.seeds).forEach((p) => lovePhotos.push(p));
});

// ================= 8. 百宝箱 =================

const collects = {
  "创作灵感": [
    { id: 911, cover: "./images/treasure/icon-wand.png", title: "写作灵感库", introduction: "开头三行写不出？来这里抓一把灵感", url: "" },
    { id: 912, cover: "./images/treasure/icon-doc.png", title: "读书笔记", introduction: "读过的书，划过的线，都在这里", url: "" },
    { id: 913, cover: "./images/treasure/icon-cloud.png", title: "云端草稿本", introduction: "没写完的念头，先存在云里", url: "" }
  ],
  "影像美学": [
    { id: 914, cover: "./images/treasure/icon-image.png", title: "图片素材库", introduction: "站内配图与摄影存档", url: "" },
    { id: 915, cover: "./images/treasure/icon-palette.png", title: "配色灵感卡", introduction: "好看的配色，随手收录", url: "" },
    { id: 916, cover: "./images/treasure/icon-layout.png", title: "摄影参数表", introduction: "拍星空、拍人像的参数备忘", url: "" }
  ],
  "出行装备": [
    { id: 917, cover: "./images/treasure/icon-seal.png", title: "旅行攻略集", introduction: "走过的路，整理成攻略", url: "" },
    { id: 918, cover: "./images/treasure/icon-audio.png", title: "行李清单", introduction: "出发前照着打勾，少带不焦虑", url: "" }
  ]
};

// 曲乐：暂无音频资源，保持空数组（funny.vue 会自动隐藏该区块）
const funnys = [];

// 友人帐：初始为空，可通过页面表单申请（保存在本地）
const friendSeeds = [];

// ================= 数据访问方法 =================

function paginate(list, params) {
  const current = Number(params.current) || 1;
  const size = Number(params.size) || 10;
  const start = (current - 1) * size;
  return { records: list.slice(start, start + size), total: list.length, current: current, size: size };
}

function getGuest() {
  let u = lsGet("currentUser", null);
  if (!u || typeof u !== "object" || !("id" in u)) {
    u = { id: 0, username: "访客", avatar: AVATAR, subscribe: "[]" };
    lsSet("currentUser", u);
  }
  return u;
}

const db = {
  // ---- 网站信息 ----
  getWebInfo() { return webInfo; },
  getSortInfo() { return sortInfo; },
  getSysConfig() { return sysConfig; },
  getAdmire() { return []; },

  // ---- 文章 ----
  listArticle(params) {
    params = params || {};
    let list = articles.slice();
    if (params.sortId !== undefined && params.sortId !== null && params.sortId !== "") {
      list = list.filter((a) => a.sortId === Number(params.sortId));
    }
    if (params.labelId !== undefined && params.labelId !== null && params.labelId !== "") {
      list = list.filter((a) => a.labelId === Number(params.labelId));
    }
    const key = params.searchKey || params.articleSearch;
    if (key) {
      list = list.filter((a) => (a.articleTitle + "\n" + a.articleContent).indexOf(key) !== -1);
    }
    list.sort((a, b) => b.createTime.localeCompare(a.createTime));
    if (params.recommendStatus) {
      list = list.slice(0, 4);
    }
    return paginate(list, params);
  },

  listSortArticle() {
    const result = {};
    sortInfo.forEach((s) => {
      result[s.id] = articles
        .filter((a) => a.sortId === s.id)
        .sort((a, b) => b.createTime.localeCompare(a.createTime))
        .slice(0, 6);
    });
    return result;
  },

  getArticleById(params) {
    params = params || {};
    const found = articles.find((a) => a.id === Number(params.id));
    return found || null;
  },

  // ---- 评论 ----
  _commentKey(params) { return params.source + "_" + (params.commentType || params.type || "article"); },

  listComment(params) {
    params = params || {};
    const key = this._commentKey(params);
    const stored = lsGet("db_comments_" + key, null);
    const list = stored !== null ? stored : (commentSeeds[key] || []);
    if (params.floorCommentId) {
      const floor = list.find((c) => c.id === Number(params.floorCommentId));
      const child = (floor && floor.childComments) || { records: [], total: 0 };
      return { records: child.records, total: child.total, current: 1, size: params.size || 5 };
    }
    return paginate(list, params);
  },

  getCommentCount(params) {
    params = params || {};
    const key = this._commentKey(params);
    const stored = lsGet("db_comments_" + key, null);
    const list = stored !== null ? stored : (commentSeeds[key] || []);
    let total = list.length;
    list.forEach((c) => {
      if (c.childComments && c.childComments.records) total += c.childComments.records.length;
    });
    return total;
  },

  saveComment(params) {
    params = params || {};
    const key = this._commentKey(params);
    const stored = lsGet("db_comments_" + key, null);
    const list = stored !== null ? stored : JSON.parse(JSON.stringify(commentSeeds[key] || []));
    const guest = getGuest();
    if (params.floorCommentId) {
      const floor = list.find((c) => c.id === Number(params.floorCommentId));
      if (floor) {
        if (!floor.childComments) floor.childComments = { records: [], total: 0 };
        let parentName = "楼主";
        floor.childComments.records.forEach((r) => {
          if (r.id === Number(params.parentCommentId)) parentName = r.username;
        });
        if (floor.id === Number(params.parentCommentId)) parentName = floor.username;
        const child = {
          id: Date.now(),
          avatar: guest.avatar,
          username: guest.username,
          userId: guest.id,
          createTime: now(),
          commentContent: params.commentContent,
          parentCommentId: params.parentCommentId,
          parentUserId: params.parentUserId,
          parentUsername: parentName
        };
        floor.childComments.records.push(child);
        floor.childComments.total = floor.childComments.records.length;
      }
    } else {
      list.unshift({
        id: Date.now(),
        avatar: guest.avatar,
        username: guest.username,
        userId: guest.id,
        createTime: now(),
        commentContent: params.commentContent,
        childComments: { records: [], total: 0 }
      });
    }
    lsSet("db_comments_" + key, list);
    return null;
  },

  // ---- 微言（记录） ----
  _weiYanList() {
    const stored = lsGet("db_weiyan", null);
    return stored !== null ? stored : weiYanSeeds.slice();
  },

  listWeiYan(params) {
    const list = this._weiYanList().slice().sort((a, b) => b.createTime.localeCompare(a.createTime));
    return paginate(list, params || {});
  },

  saveWeiYan(params) {
    params = params || {};
    const guest = getGuest();
    const list = this._weiYanList();
    list.unshift({
      id: Date.now(),
      content: params.content,
      createTime: now(),
      userId: guest.id,
      isPublic: params.isPublic
    });
    lsSet("db_weiyan", list);
    return null;
  },

  deleteWeiYan(params) {
    params = params || {};
    const list = this._weiYanList().filter((w) => w.id !== Number(params.id));
    lsSet("db_weiyan", list);
    return null;
  },

  // ---- 文章历程 ----
  listNews(params) {
    params = params || {};
    const key = "db_news_" + params.source;
    const stored = lsGet(key, null);
    const list = stored !== null ? stored : (newsSeeds[params.source] || []);
    return paginate(list.slice().sort((a, b) => b.createTime.localeCompare(a.createTime)), params);
  },

  saveNews(params) {
    params = params || {};
    const guest = getGuest();
    const key = "db_news_" + params.source;
    const stored = lsGet(key, null);
    const list = stored !== null ? stored : ((newsSeeds[params.source] || []).slice());
    list.unshift({ id: Date.now(), content: params.content, createTime: params.createTime || now(), userId: guest.id });
    lsSet(key, list);
    return null;
  },

  // ---- 树洞留言 ----
  listTreeHole() {
    const stored = lsGet("db_treehole", null);
    return stored !== null ? stored : treeHoleSeeds.slice();
  },

  saveTreeHole(params) {
    params = params || {};
    const guest = getGuest();
    const item = { id: Date.now(), avatar: params.avatar || guest.avatar, message: params.message };
    const list = this.listTreeHole();
    list.push(item);
    lsSet("db_treehole", list);
    return item;
  },

  deleteTreeHole() { return null; },

  // ---- 相册 ----
  listAdminLovePhoto() { return lovePhotoClassifies; },

  listResourcePath(params) {
    params = params || {};
    let list = lovePhotos.slice();
    if (params.classify) {
      list = list.filter((p) => p.classify === params.classify);
    }
    list.sort((a, b) => b.createTime.localeCompare(a.createTime));
    return paginate(list, params);
  },

  // ---- 百宝箱 ----
  listCollect() { return collects; },

  listFunny() { return funnys; },

  listFriend() {
    const stored = lsGet("db_friends", null);
    const list = stored !== null ? stored : friendSeeds.slice();
    // 模板按 friendList['🥇友情链接'] / friendList['♥️青出于蓝'] 取值
    return { "🥇友情链接": list, "♥️青出于蓝": [] };
  },

  saveFriend(params) {
    params = params || {};
    const stored = lsGet("db_friends", null);
    const list = stored !== null ? stored : friendSeeds.slice();
    list.push({
      id: Date.now(),
      cover: params.cover || AVATAR,
      title: params.title,
      introduction: params.introduction,
      url: params.url
    });
    lsSet("db_friends", list);
    return null;
  },

  // ---- 用户（本地访客模式，无真实登录） ----
  getUser() { return getGuest(); },

  subscribe(params) {
    params = params || {};
    const guest = getGuest();
    let arr = [];
    try { arr = JSON.parse(guest.subscribe || "[]"); } catch (e) { arr = []; }
    const labelId = Number(params.labelId);
    if (params.flag) {
      if (arr.indexOf(labelId) === -1) arr.push(labelId);
    } else {
      arr = arr.filter((id) => id !== labelId);
    }
    guest.subscribe = JSON.stringify(arr);
    lsSet("currentUser", guest);
    return guest;
  },

  noop() { return null; }
};

export default db;
