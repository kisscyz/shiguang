<template>
  <div>
    <!-- 封面：全屏通栏 -->
    <div class="travel-banner my-animation-slide-top">
      <img class="banner-img" :src="'./images/travel/banner-night-lake.jpg'" alt="旅拍集"/>
      <div class="banner-hero">
        <div class="banner-hero-title">旅拍集</div>
        <div class="banner-hero-desc">这里是我的旅拍哦 · 每一张照片都是一次美好的记忆</div>
      </div>
    </div>

    <div class="travel-container">
      <div class="travel-content my-animation-slide-bottom">
        <!-- 标签 -->
        <div class="photo-title-warp" v-if="!$common.isEmpty(photoTitleList)">
          <div v-for="(item, index) in photoTitleList" :key="index"
               :class="{isActive: photoPagination.classify === item.classify}"
               @click="changePhotoTitle(item.classify)">
            <proTag :info="item.classify+' '+item.count"
                    :color="$constant.before_color_list[Math.floor(Math.random() * 6)]"
                    style="margin: 12px">
            </proTag>
          </div>
        </div>

        <div class="photo-title">
          {{photoPagination.classify}}
        </div>

        <photo :resourcePathList="photoList"></photo>
        <div class="pagination-wrap">
          <div @click="pagePhotos()" class="pagination" v-if="photoPagination.total !== photoList.length">
            下一页
          </div>
          <div v-else style="user-select: none">
            ~~到底啦~~
          </div>
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
  const photo = () => import( "./common/photo");
  const proTag = () => import( "./common/proTag");

  export default {
    components: {
      photo,
      proTag,
      myFooter
    },

    data() {
      return {
        photoPagination: {
          current: 1,
          size: 10,
          total: 0,
          resourceType: "lovePhoto",
          classify: ""
        },
        photoTitleList: [],
        photoList: []
      }
    },

    computed: {},

    watch: {},

    created() {
      this.getPhotoTitles();
    },

    mounted() {

    },

    methods: {
      getPhotoTitles() {
        this.$http.get(this.$constant.baseURL + "/webInfo/listAdminLovePhoto")
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.photoTitleList = res.data;
              this.photoPagination = {
                current: 1,
                size: 10,
                total: 0,
                resourceType: "lovePhoto",
                classify: this.photoTitleList[0].classify
              };
              this.changePhoto();
            }
          })
          .catch((error) => {
            this.$message({
              message: error.message,
              type: "error"
            });
          });
      },
      changePhotoTitle(classify) {
        if (classify !== this.photoPagination.classify) {
          this.photoPagination = {
            current: 1,
            size: 10,
            total: 0,
            resourceType: "lovePhoto",
            classify: classify
          };
          this.photoList = [];
          this.changePhoto();
        }
      },
      pagePhotos() {
        this.photoPagination.current = this.photoPagination.current + 1;
        this.changePhoto();
      },
      changePhoto() {
        this.$http.post(this.$constant.baseURL + "/webInfo/listResourcePath", this.photoPagination)
          .then((res) => {
            if (!this.$common.isEmpty(res.data)) {
              this.photoList = this.photoList.concat(res.data.records);
              this.photoPagination.total = res.data.total;
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

  .travel-container {
    padding: 25px;
    background: var(--favoriteBg);
  }

  .travel-banner {
    width: 100%;
    height: 50vh;
    min-height: 320px;
    position: relative;
    overflow: hidden;
    color: var(--white);
    user-select: none;
  }

  .banner-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .banner-hero {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(20, 40, 80, 0.25);
  }

  .banner-hero-title {
    font-size: 38px;
    font-weight: bold;
    letter-spacing: 8px;
    text-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
  }

  .banner-hero-desc {
    margin-top: 12px;
    font-size: 14px;
    opacity: 0.9;
    letter-spacing: 2px;
  }

  @media screen and (max-width: 800px) {
    .travel-banner {
      height: 38vh;
      min-height: 260px;
    }

    .banner-hero-title {
      font-size: 30px;
    }
  }

  .travel-content {
    margin: 0 auto;
    max-width: 1200px;
  }

  .photo-title-warp {
    max-width: 1150px;
    margin: 50px auto;
    padding: 20px;
    border-radius: 10px;
    display: flex;
    flex-wrap: wrap;
  }

  .isActive {
    animation: scale 2.5s ease-in-out infinite;
  }

  .photo-title {
    text-align: center;
    font-size: 30px;
    font-weight: 700;
    line-height: 80px;
    letter-spacing: 2px;
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

  @media screen and (max-width: 1150px) {
    .photo-title-warp {
      max-width: 780px;
    }
  }

</style>
