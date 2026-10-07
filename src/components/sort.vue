<template>
  <div>
    <!-- 两句诗 -->
    <div class="my-animation-slide-top">
      <twoPoem></twoPoem>
    </div>

    <div style="background: var(--background);padding-top: 40px;" class="my-animation-slide-bottom">
      <div class="sort-page-container">
        <div class="sort-main">
      <!-- 标签 -->
      <div class="sort-warp shadow-box" v-if="!$common.isEmpty(sort) && !$common.isEmpty(sort.labels)">
        <div v-for="(label, index) in sort.labels" :key="index"
             :class="{isActive: !$common.isEmpty(labelId) && parseInt(labelId) === label.id}"
             @click="listArticle(label)">
          <proTag :info="label.labelName+' '+label.countOfLabel"
                  :color="$constant.before_color_list[Math.floor(Math.random() * 6)]"
                  style="margin: 12px">
          </proTag>
        </div>
      </div>

      <!-- 文章 -->
      <div class="article-wrap">
        <articleList :articleList="articles"></articleList>
        <div class="pagination-wrap">
          <div @click="pageArticles()" class="pagination" v-if="pagination.total !== articles.length">
            下一页
          </div>
          <div v-else style="user-select: none">
            ~~到底啦~~
          </div>
        </div>
      </div>
        </div>
        <!-- 右侧栏（与首页同一侧栏） -->
        <div class="sort-aside">
          <myAside @selectSort="selectSort" @selectArticle="selectArticle"></myAside>
        </div>
      </div>
      <!-- 页脚 -->
      <myFooter></myFooter>
    </div>
  </div>
</template>

<script>
  const twoPoem = () => import( "./common/twoPoem");
  const proTag = () => import( "./common/proTag");
  const articleList = () => import( "./articleList");
  const myAside = () => import( "./myAside");
  const myFooter = () => import( "./common/myFooter");

  export default {
    components: {
      twoPoem,
      proTag,
      articleList,
      myAside,
      myFooter
    },

    data() {
      return {
        sortId: this.$route.query.sortId,
        labelId: this.$route.query.labelId,
        sort: null,
        pagination: {
          current: 1,
          size: 10,
          total: 0,
          searchKey: "",
          sortId: this.$route.query.sortId,
          labelId: this.$route.query.labelId
        },
        articles: []
      }
    },

    computed: {},

    watch: {
      $route() {
        this.pagination = {
          current: 1,
          size: 10,
          total: 0,
          searchKey: "",
          sortId: this.$route.query.sortId,
          labelId: this.$route.query.labelId
        };
        this.articles.splice(0, this.articles.length);
        this.sortId = this.$route.query.sortId;
        this.labelId = this.$route.query.labelId;
        this.getSort();
        this.getArticles();
      }
    },

    created() {
      this.getSort();
      this.getArticles();
    },

    mounted() {
    },

    methods: {
      pageArticles() {
        this.pagination.current = this.pagination.current + 1;
        this.getArticles();
      },

      getSort() {
        let sortInfo = this.$store.state.sortInfo;
        if (!this.$common.isEmpty(sortInfo)) {
          let sortArray = sortInfo.filter(f => {
            return f.id === parseInt(this.sortId);
          });
          if (!this.$common.isEmpty(sortArray)) {
            this.sort = sortArray[0];
          }
        }
      },
      listArticle(label) {
        this.labelId = label.id;
        this.pagination = {
          current: 1,
          size: 10,
          total: 0,
          searchKey: "",
          sortId: this.$route.query.sortId,
          labelId: label.id
        };
        this.articles.splice(0, this.articles.length);
        this.$nextTick(() => {
          this.getArticles();
        });
      },
      getArticles() {
        this.$http.post(this.$constant.baseURL + "/article/listArticle", this.pagination)
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.articles = this.articles.concat(res.data.records);
              this.pagination.total = res.data.total;
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      selectSort(sort) {
        this.$router.push({path: '/sort', query: {sortId: sort.id}});
      },
      selectArticle(articleSearch) {
        this.pagination = {
          current: 1,
          size: 10,
          total: 0,
          searchKey: "",
          sortId: this.$route.query.sortId,
          labelId: null,
          articleSearch: articleSearch
        };
        this.articles.splice(0, this.articles.length);
        this.$nextTick(() => {
          this.getArticles();
        });
      }
    }
  }
</script>

<style scoped>

  .sort-page-container {
    display: flex;
    justify-content: center;
    width: 90%;
    padding: 0 20px 40px 20px;
    margin: 0 auto;
    flex-direction: row;
  }

  .sort-main {
    width: 70%;
    max-width: 850px;
  }

  .sort-aside {
    width: 300px;
    max-width: 300px;
    margin-left: 20px;
  }

  .sort-warp {
    width: 100%;
    margin: 0 auto;
    padding: 20px;
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;
  }

  .article-wrap {
    width: 100%;
    margin: 40px auto;
    min-height: 600px;
  }

  .isActive {
    animation: scale 1.5s ease-in-out infinite;
  }

  .pagination-wrap {
    display: flex;
    justify-content: center;
    margin-top: 40px;
  }

  .pagination {
    padding: 13px 15px;
    border: 1px solid var(--lightGray);
    border-radius: 3rem;
    color: var(--greyFont);
    width: 100px;
    user-select: none;
    cursor: pointer;
    text-align: center;
  }

  .pagination:hover {
    border: 1px solid var(--themeBackground);
    color: var(--themeBackground);
    box-shadow: 0 0 5px var(--themeBackground);
  }


  @media screen and (max-width: 1000px) {
    .sort-page-container {
      flex-direction: column;
      width: 100%;
    }

    .sort-main {
      width: 100%;
      max-width: unset;
    }

    .sort-aside {
      width: 100%;
      max-width: unset;
      margin: 40px auto 0;
    }
  }

  @media screen and (max-width: 900px) {
    .sort-warp {
      width: 90%;
    }

    .article-wrap {
      width: 90%;
    }
  }
</style>
