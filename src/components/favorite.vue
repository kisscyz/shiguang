<template>
  <div>
    <div class="favorite-container">
      <!-- 封面 -->
      <div class="favorite-header my-animation-slide-top">
        <!-- 背景图片（纯静态版：原视频资源缺失，改用本地横幅图） -->
        <img class="index-video" :src="'./images/treasure/banner-bg.jpg'" alt="百宝箱"/>
        <div class="nav-hero">
          <div class="nav-hero-title">百宝箱</div>
          <div class="nav-hero-desc">我的工具导航 · 好用的网站都在这里</div>
          <div class="nav-search">
            <i class="el-icon-search"></i>
            <input v-model="searchKey" placeholder="搜索工具，一触即达…" maxlength="20"/>
          </div>
        </div>
      </div>

      <!-- 工具导航 -->
      <div class="nav-content my-animation-slide-bottom">
        <div v-for="(tools, category) in filteredNav" :key="category" class="nav-category">
          <div class="nav-category-title">
            <span>{{ category }}</span>
            <span class="nav-category-count">{{ tools.length }}</span>
          </div>
          <div class="nav-grid">
            <div v-for="tool in tools" :key="tool.id" class="nav-card" @click="toUrl(tool.url)">
              <div class="nav-card-icon" :style="{ background: tool.color }">{{ tool.emoji }}</div>
              <div class="nav-card-body">
                <div class="nav-card-name">{{ tool.title }}</div>
                <div class="nav-card-desc">{{ tool.introduction }}</div>
              </div>
              <i class="el-icon-top-right nav-card-arrow"></i>
            </div>
          </div>
        </div>
        <div v-if="$common.isEmpty(filteredNav)" class="nav-empty">
          没有找到「{{ searchKey }}」相关的工具，换个关键词试试
        </div>

        <!-- 友人帐 -->
        <div class="nav-category">
          <div class="nav-category-title">
            <span>👯 友人帐</span>
          </div>
          <friend></friend>
        </div>
      </div>
    </div>

    <!-- 页脚 -->
    <div style="background: var(--favoriteBg)">
      <myFooter></myFooter>
    </div>
  </div>
</template>

<script>

  const myFooter = () => import( "./common/myFooter");
  const friend = () => import( "./friend");

  export default {
    components: {
      myFooter,
      friend
    },

    data() {
      return {
        searchKey: "",
        collects: {}
      }
    },

    computed: {
      filteredNav() {
        const key = (this.searchKey || "").trim().toLowerCase();
        if (!key) {
          return this.collects;
        }
        const result = {};
        Object.keys(this.collects).forEach((category) => {
          const matched = this.collects[category].filter((t) =>
            (t.title + t.introduction).toLowerCase().indexOf(key) !== -1
          );
          if (matched.length > 0) {
            result[category] = matched;
          }
        });
        return result;
      }
    },

    watch: {},

    created() {
      this.getCollect();
    },

    mounted() {

    },

    methods: {
      toUrl(url) {
        if (!this.$common.isEmpty(url)) {
          window.open(url, "_blank");
        }
      },
      getCollect() {
        this.$http.get(this.$constant.baseURL + "/webInfo/listCollect")
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.collects = res.data;
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      }
    }
  }
</script>

<style scoped>

  .favorite-container {
    padding: 25px;
    background: var(--favoriteBg);
  }

  .favorite-header {
    margin: 60px auto 30px;
    height: 330px;
    position: relative;
    overflow: hidden;
    border-radius: 20px;
    max-width: 1200px;
  }

  .index-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .nav-hero {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--white);
    background: rgba(20, 40, 80, 0.25);
  }

  .nav-hero-title {
    font-size: 38px;
    font-weight: bold;
    letter-spacing: 8px;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
  }

  .nav-hero-desc {
    margin-top: 10px;
    font-size: 14px;
    opacity: 0.9;
    letter-spacing: 2px;
  }

  .nav-search {
    margin-top: 22px;
    display: flex;
    align-items: center;
    background: rgba(255, 255, 255, 0.92);
    border-radius: 999px;
    padding: 10px 20px;
    width: min(420px, 80%);
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.18);
    color: var(--greyFont);
  }

  .nav-search input {
    border: none;
    outline: none;
    background: transparent;
    margin-left: 8px;
    width: 100%;
    font-size: 14px;
    color: var(--black);
  }

  .nav-content {
    max-width: 1200px;
    margin: 0 auto;
    padding-bottom: 30px;
  }

  .nav-category {
    margin-top: 34px;
  }

  .nav-category-title {
    display: flex;
    align-items: center;
    font-size: 20px;
    font-weight: bold;
    color: var(--black);
    margin-bottom: 16px;
    padding-left: 4px;
  }

  .nav-category-title::before {
    content: "";
    width: 5px;
    height: 22px;
    border-radius: 3px;
    background: var(--themeBackground);
    margin-right: 10px;
  }

  .nav-category-count {
    margin-left: 10px;
    font-size: 12px;
    font-weight: normal;
    color: var(--white);
    background: var(--themeBackground);
    border-radius: 999px;
    padding: 2px 10px;
  }

  .nav-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  .nav-card {
    display: flex;
    align-items: center;
    background: var(--white);
    border-radius: 14px;
    padding: 16px;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
    position: relative;
  }

  .nav-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(46, 102, 255, 0.16);
  }

  .nav-card-icon {
    width: 52px;
    height: 52px;
    min-width: 52px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
  }

  .nav-card-body {
    margin-left: 14px;
    overflow: hidden;
    width: calc(100% - 66px);
  }

  .nav-card-name {
    font-size: 15px;
    font-weight: bold;
    color: var(--black);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nav-card-desc {
    margin-top: 6px;
    font-size: 12px;
    color: var(--greyFont);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .nav-card-arrow {
    position: absolute;
    right: 12px;
    top: 12px;
    color: var(--lightGray);
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .nav-card:hover .nav-card-arrow {
    opacity: 1;
  }

  .nav-empty {
    text-align: center;
    padding: 60px 0;
    color: var(--greyFont);
    font-size: 15px;
  }

  @media screen and (max-width: 1100px) {
    .nav-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media screen and (max-width: 800px) {
    .favorite-container {
      padding: 12px;
    }

    .favorite-header {
      height: 260px;
      margin-top: 40px;
    }

    .nav-hero-title {
      font-size: 30px;
    }

    .nav-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }

    .nav-card {
      padding: 12px;
    }

    .nav-card-icon {
      width: 44px;
      height: 44px;
      min-width: 44px;
      font-size: 24px;
      border-radius: 12px;
    }
  }

  @media screen and (max-width: 480px) {
    .nav-grid {
      grid-template-columns: 1fr 1fr;
    }

    .nav-card-desc {
      display: none;
    }
  }
</style>
