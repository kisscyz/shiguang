<template>
  <div>
    <div style="background: var(--background);padding: 25px 25px 0;">
      <!-- 封面 -->
      <div class="weiyan-header my-animation-slide-top">
        <img class="index-video" :src="'./images/weiYan-banner-night-sky.jpg'" alt="记录"/>
        <div class="weiyan-hero">
          <div class="weiyan-hero-title">记录</div>
          <div class="weiyan-hero-desc">微言小义 · 记录生活点滴</div>
        </div>
      </div>
    </div>

    <div style="background: var(--background);animation: hideToShow 2.5s">
      <div>
        <treeHole :treeHoleList="treeHoleList"
                  :avatar="!$common.isEmpty($store.state.currentUser)?$store.state.currentUser.avatar:$store.state.webInfo.avatar"
                  @launch="launch"
                  @deleteTreeHole="deleteTreeHole">
        </treeHole>
        <proPage :current="pagination.current"
                 :size="pagination.size"
                 :total="pagination.total"
                 :buttonSize="3"
                 :color="$constant.pageColor"
                 @toPage="toPage">
        </proPage>
      </div>

      <!-- 页脚 -->
      <myFooter :showFooter="showFooter"></myFooter>
    </div>

    <el-dialog title="微言"
               :visible.sync="weiYanDialogVisible"
               width="40%"
               :before-close="handleClose"
               :append-to-body="true"
               destroy-on-close
               :close-on-click-modal="false"
               center>
      <div>
        <div class="myCenter" style="padding-bottom: 20px">
          <el-radio-group v-model="isPublic">
            <el-radio-button :label="true">公开</el-radio-button>
            <el-radio-button :label="false">私密</el-radio-button>
          </el-radio-group>
        </div>
        <commentBox :disableGraffiti="true"
                    @submitComment="submitWeiYan">
        </commentBox>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  const myFooter = () => import( "./common/myFooter");
  const treeHole = () => import( "./common/treeHole");
  const proPage = () => import( "./common/proPage");
  const commentBox = () => import( "./comment/commentBox");

  export default {
    components: {
      myFooter,
      treeHole,
      proPage,
      commentBox
    },

    data() {
      return {
        treeHoleList: [],
        pagination: {
          current: 1,
          size: 10,
          total: 0
        },
        weiYanDialogVisible: false,
        isPublic: true,
        showFooter: false
      }
    },

    computed: {},

    watch: {},

    created() {
      this.getWeiYan();
    },

    mounted() {

    },

    methods: {
      toPage(page) {
        this.pagination.current = page;
        window.scrollTo({
          top: 240,
          behavior: "smooth"
        });
        this.getWeiYan();
      },
      launch() {
        if (this.$common.isEmpty(this.$store.state.currentUser)) {
          this.$message({
            message: "请先登录！",
            type: "error"
          });
          return;
        }

        this.weiYanDialogVisible = true;
      },
      handleClose() {
        this.weiYanDialogVisible = false;
      },
      submitWeiYan(content) {
        let weiYan = {
          content: content,
          isPublic: this.isPublic
        };

        this.$http.post(this.$constant.baseURL + "/weiYan/saveWeiYan", weiYan)
          .then((res) => {
            this.getWeiYan();
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
        this.handleClose();
      },
      deleteTreeHole(id) {
        if (this.$common.isEmpty(this.$store.state.currentUser)) {
          this.$message({
            message: "请先登录！",
            type: "error"
          });
          return;
        }

        this.$confirm('确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'success',
          center: true
        }).then(() => {
          this.$http.get(this.$constant.baseURL + "/weiYan/deleteWeiYan", {id: id})
            .then((res) => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.pagination.current = 1;
              this.getWeiYan();
            })
            .catch((error) => {
              this.$message({
                message: error.message,
                type: "error"
              });
            });
        }).catch(() => {
          this.$message({
            type: 'success',
            message: '已取消删除!'
          });
        });
      },
      getWeiYan() {
        this.$http.post(this.$constant.baseURL + "/weiYan/listWeiYan", this.pagination)
          .then((res) => {
            this.showFooter = false;
            if (!this.$common.isEmpty(res.data)) {
              res.data.records.forEach(c => {
                c.content = c.content.replace(/\n{2,}/g, '<div style="height: 12px"></div>');
                c.content = c.content.replace(/\n/g, '<br/>');
                c.content = this.$common.faceReg(c.content);
                c.content = this.$common.pictureReg(c.content);
              });
              this.treeHoleList = res.data.records;
              this.pagination.total = res.data.total;
            }
            this.$nextTick(() => {
              this.showFooter = true;
              this.$common.imgShow(".tree-hole-box .pictureReg");
            });
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

  .weiyan-header {
    margin: 35px auto 30px;
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

  .weiyan-hero {
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

  .weiyan-hero-title {
    font-size: 38px;
    font-weight: bold;
    letter-spacing: 8px;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
  }

  .weiyan-hero-desc {
    margin-top: 10px;
    font-size: 14px;
    opacity: 0.9;
    letter-spacing: 2px;
  }

  @media screen and (max-width: 800px) {
    .weiyan-header {
      height: 260px;
      margin: 40px 12px 20px;
    }

    .weiyan-hero-title {
      font-size: 30px;
    }
  }

</style>
