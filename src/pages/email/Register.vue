<template lang="html">
  <div class="df-emailVerify">
    <div class="alert">
      <el-alert
        title="激活账号成功"
        type="success"
        description="旅行者，恭喜你注册成功。之后的日子里，诗词小筑会一直陪着你。直至终焉， :)"
        v-if="isSuccess"
        v-show="isShow"
      ></el-alert>
      <el-alert
        title="激活账号失败"
        type="error"
        description="旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~"
        v-show="isShow"
        v-else
      ></el-alert>
    </div>
    <div class="poem">
      <h3 class="title">《 选 择 》</h3>
      <div class="main">
        <div class="box">
          <p>每一条道路上都有出发的人</p>
          <p>每个人头顶上都有一方天空</p>
          <p>每一方天空上都有莫测的云</p>
          <p>每一朵云都兆示着命运</p>
        </div>
        <div class="box">
          <p>无声的选择方向</p>
          <p>一颗星辰或者一双眼睛</p>
          <p>人怎样选择世界</p>
          <p>世界就怎样地选择人</p>
        </div>
        <div class="box">
          <p>默默地选择起点</p>
          <p>骄傲地选择归程</p>
          <p>夜间选择黎明的人</p>
          <p>黎明选择他为自由的风</p>
        </div>
        <div class="box">
          <p>选择飞鸟或者一片落叶</p>
        <p>选择岩石或者一阵灰尘</p>
          <p>谁在无可选择中选择</p>
          <p>他就是被选择的人</p>
        </div>
        <div class="box">
          <p>每个人都有一颗无名的心</p>
          <p>每颗心都有寂寞的时辰</p>
          <p>谁选择寂寞的世界</p>
          <p>世界选择他的歌声</p>
        </div>
        <div class="box">
          <p>流星在选择中下沉</p>
          <p>太阳在选择中上升</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  mapMutations
} from 'vuex'
import api from '@/api'
export default {
  name: 'emailRegister',
  data() {
    return {
      // 是否验证成功
      isSuccess: false,
      isShow: false
    }
  },
  created() {
    // 验证toke值
    this.validateToken()
  },
  methods: {
    validateToken() {
      this.TOGGLE_LOADING_STATUS()
      // 获取token值
      const token = this.$router.currentRoute.query.token
      if (!token) {
        // 若token值为空
        this.isSuccess = false
        setTimeout(() => {
          this.TOGGLE_LOADING_STATUS()
        }, 0)
      } else {
        // 发起请求，验证token值
        api.get(`email/register/verify?token=${token}`).then(response => {
          this.TOGGLE_LOADING_STATUS()
          this.isShow = true
          this.isSuccess = response.data.registered
        }).catch(error => {
          this.TOGGLE_LOADING_STATUS()
          this.isShow = true
          Promise.reject(error)
        })
      }
    },
    ...mapMutations([
      'TOGGLE_LOADING_STATUS'
    ])
  }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/common'

.df-emailVerify
  .alert
    margin-top 10px
    text-align center
  .poem
    position fixed
    top 50%
    left 50%
    width 100%
    transform translate(-50%,-50%)
    .title
      text-align center
      color Green
    .main
      fj(space-around)
      .box
        color Silver
</style>
