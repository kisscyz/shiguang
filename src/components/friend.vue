<template>
  <div>
    <div class="friend-wrap">
      <div class="friend-main">
        <!-- 添加友链 -->
        <div class="form-wrap-new">
          <div v-if="!letterOpen" class="letter-cover" @click="letterOpen = true">
            <div class="letter-cover-emoji">✉️</div>
            <div class="letter-cover-title">有朋自远方来</div>
            <div class="letter-cover-hint">点击写信，申请交换友链</div>
          </div>
          <div v-else class="letter-paper my-animation-slide-bottom">
            <div class="form-main">
              <div>
                <h3 style="text-align: center">有朋自远方来</h3>
                <div>
                  <div class="myCenter form-friend">
                    <div class="user-title">
                      <div>名称：</div>
                      <div>简介：</div>
                      <div>封面：</div>
                      <div>网址：</div>
                    </div>
                    <div class="user-content">
                      <div>
                        <el-input maxlength="30" v-model="friend.title"></el-input>
                      </div>
                      <div>
                        <el-input maxlength="120" v-model="friend.introduction"></el-input>
                      </div>
                      <div>
                        <el-input maxlength="200" v-model="friend.cover"></el-input>
                      </div>
                      <div>
                        <el-input maxlength="200" v-model="friend.url"></el-input>
                      </div>
                    </div>
                  </div>
                  <div class="myCenter" style="margin-top: 20px">
                    <proButton :info="'提交'"
                               @click.native.stop="submitFriend()"
                               :before="$constant.before_color_2"
                               :after="$constant.after_color_2">
                    </proButton>
                  </div>
                </div>
                <p class="letter-foot">欢迎交换友链</p>
              </div>
            </div>
          </div>
        </div>

        <div style="font-size: 20px;font-weight: bold;margin-top: 40px">🌸本站信息</div>
        <div>
          <blockquote>
            <div>网站名称: {{$constant.friendWebName}}</div>
            <div>网址: {{$constant.friendUrl}}</div>
            <div>头像: {{$constant.friendAvatar}}</div>
            <div>描述: {{$constant.friendIntroduction}}</div>
            <div>网站封面: {{$constant.friendCover}}</div>
          </blockquote>
        </div>
        <div style="font-size: 20px;font-weight: bold">🌸申请方式</div>
        <div>
          <blockquote>
            <div>点击上方信封✨✨✨</div>
            <div>不会添加带有广告营销和没有实质性内容的友链🚫🚫🚫</div>
            <div>申请之前请将本网站添加为您的友链哦🎟️🎟️🎟️</div>
          </blockquote>
        </div>

        <hr>

        <h2 style="margin-top: 60px">♥️青出于蓝</h2>
        <card :resourcePathList="friendList['♥️青出于蓝']" @clickResourcePath="clickFriend"></card>

        <hr>

        <h2 style="margin-top: 60px">🥇友情链接</h2>
        <card :resourcePathList="friendList['🥇友情链接']" @clickResourcePath="clickFriend"></card>
      </div>
    </div>
  </div>
</template>

<script>
  const card = () => import( "./common/card");
  const proButton = () => import( "./common/proButton");

  export default {
    components: {
      card,
      proButton
    },

    data() {
      return {
        letterOpen: false,
        friendList: {},
        friend: {
          title: "",
          introduction: "",
          cover: "",
          url: ""
        }
      }
    },

    computed: {},

    watch: {},

    created() {
      this.getFriends();
    },

    mounted() {

    },

    methods: {
      submitFriend() {
        if (this.$common.isEmpty(this.$store.state.currentUser)) {
          this.$message({
            message: "请先登录！",
            type: "error"
          });
          return;
        }

        if (this.friend.title.trim() === "") {
          this.$message({
            message: "你还没写名称呢~",
            type: "warning"
          });
          return;
        }

        if (this.friend.introduction.trim() === "") {
          this.$message({
            message: "你还没写简介呢~",
            type: "warning"
          });
          return;
        }

        if (this.friend.cover.trim() === "") {
          this.$message({
            message: "你还没设置封面呢~",
            type: "warning"
          });
          return;
        }

        if (this.friend.url.trim() === "") {
          this.$message({
            message: "你还没写网址呢~",
            type: "warning"
          });
          return;
        }

        this.$http.post(this.$constant.baseURL + "/webInfo/saveFriend", this.friend)
          .then((res) => {
            $(".form-wrap").css({"height": "447px", "top": "0"});
            this.$message({
              type: 'success',
              message: '提交成功，待管理员审核！'
            });
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      clickFriend(path) {
        if (!this.$common.isEmpty(path)) {
          window.open(path);
        }
      },
      getFriends() {
        this.$http.get(this.$constant.baseURL + "/webInfo/listFriend")
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.friendList = res.data;
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

  .friend-main {
    max-width: 1200px;
    margin: 40px auto;
    border-radius: 10px;
    padding: 40px;
    background: rgba(255, 255, 255, .85);
  }

  .friend-main h2 {
    font-size: 20px;
  }

  hr {
    position: relative;
    margin: 40px auto;
    border: 2px dashed var(--lightGreen);
    overflow: visible;
  }

  hr:before {
    position: absolute;
    top: -14px;
    left: 5%;
    color: var(--lightGreen);
    content: '❄';
    font-size: 30px;
    line-height: 1;
    transition: all 1s ease-in-out;
  }

  hr:hover:before {
    left: calc(95% - 20px);
  }

  .form-wrap {
    margin: 0 auto;
    overflow: hidden;
    width: 530px;
    height: 447px;
    position: relative;
    top: 0;
    transition: all 1s ease-in-out .3s;
    z-index: 0;
    cursor: pointer;
  }

  /* 纯静态版：信封申请改为卡片式 */
  .form-wrap-new {
    margin: 0 auto;
    max-width: 560px;
  }

  .letter-cover {
    cursor: pointer;
    text-align: center;
    padding: 48px 20px;
    border-radius: 16px;
    background: linear-gradient(135deg, #fff5f7 0%, #f0f7ff 100%);
    border: 2px dashed var(--lightGreen);
    transition: all 0.3s ease;
    user-select: none;
  }

  .letter-cover:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }

  .letter-cover-emoji {
    font-size: 56px;
    line-height: 1;
  }

  .letter-cover-title {
    font-size: 22px;
    font-weight: bold;
    margin-top: 14px;
    letter-spacing: 4px;
  }

  .letter-cover-hint {
    color: #999;
    font-size: 14px;
    margin-top: 10px;
  }

  .letter-paper {
    background: var(--white);
    border-radius: 16px;
    padding: 28px 24px 20px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
  }

  .letter-foot {
    font-size: 12px;
    text-align: center;
    color: #999;
    margin: 12px 0 0;
  }


  .before-img {
    position: absolute;
    bottom: 126px;
    left: 0;
    background-repeat: no-repeat;
    width: 530px;
    height: 317px;
    z-index: -100;
  }

  .after-img {
    position: absolute;
    bottom: -2px;
    left: 0;
    background-repeat: no-repeat;
    width: 530px;
    height: 259px;
    z-index: 100;
  }

  .friend-wrap {
    color: var(--black);
  }

  .envelope {
    position: relative;
    margin: 0 auto;
    transition: all 1s ease-in-out .3s;
    padding: 200px 20px 20px;
  }

  .form-main {
    background: var(--white);
    margin: 0 auto;
    border-radius: 10px;
    overflow: hidden;
  }


  .user-title {
    text-align: right;
    user-select: none;
  }

  .user-content {
    text-align: left;
  }

  .user-title div {
    height: 55px;
    line-height: 55px;
    text-align: center;
  }

  .user-content > div {
    height: 55px;
    display: flex;
    align-items: center;
  }

  .user-content >>> .el-input__inner {
    border: none;
    height: 35px;
    background: var(--whiteMask);
  }

  .form-friend {
    margin-top: 12px;
    background-color: #eee;
    border: #ddd 1px solid;
    padding: 20px 0;
  }

  blockquote {
    line-height: 2;
    border-left: 0.2rem solid #ed6ea0;
    padding: 10px 1rem;
    background-color: #ffe6fa;
    border-radius: 4px;
    margin: 20px auto;
    color: var(--maxGreyFont);
  }

  @media screen and (max-width: 700px) {
    .form-wrap {
      width: auto;
    }

    .before-img {
      width: auto;
    }

    .after-img {
      width: auto;
    }
  }

  @media screen and (max-width: 500px) {
    .friend-main {
      padding: 40px 15px;
    }
  }
</style>
