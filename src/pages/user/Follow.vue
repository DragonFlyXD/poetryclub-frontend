<template lang="html">
  <div class="df-follower">
    <intro :intro="followersIntro" v-if="isFollowerList"></intro>
    <intro :intro="followingsIntro" v-else></intro>
    <div class="main-wrapper">
      <div class="main" v-if="localData.length > 0">
        <div
          class="item"
          v-for="(item,index) in localData"
          :key="index"
          >
          <div class="content-wrapper">
            <router-link :to="{ path: item.profileUrl }">
              <img class="avatar" :src="item.avatar" alt="avatar">
            </router-link>
            <div class="content">
              <router-link class="tdu" :to="{ path: item.profileUrl }">
                <h2 class="name">{{ item.nickname }}</h2>
              </router-link>
              <p class="signature">{{ item.profile.signature }}</p>
              <div class="meta">
                <router-link :to="{ path: `/user/${item.name}/works` }">
                  <span>{{ item.works_count }}</span>作品
                </router-link>
                <router-link :to="{ path: `/user/${item.name}/followers` }">
                  <span>{{ item.followers_count }}</span>关注
                </router-link>
                <router-link class="last" :to="{ path: `/user/${item.name}/followings` }">
                  <span>{{ item.followings_count }}</span>粉丝
                </router-link>
              </div>
            </div>
          </div>
          <div class="action">
            <el-button class="btn-pub" @click="toggleUserFollowed(item.id, index)" v-if="item.followed">已关注</el-button>
            <el-button class="btn-can" @click="toggleUserFollowed(item.id, index)" v-else>关注Ta</el-button>
          </div>
        </div>
      </div>
      <blank-area v-else></blank-area>
    </div>
  </div>
</template>
<script>
import api from '@/api'
import Intro from '@/components/intro'
import BlankArea from '@/components/blankArea'
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  name: 'userFollow',
  components: {
    Intro,
    BlankArea
  },
  data() {
    return {
      followersIntro: {
        title: '关注列表',
        content: '旅行者，关注列表记录了你在诗词小筑的一点一滴。从激活密纹之力，收藏诗文，到关注别人与被他人关注，它似回马灯般闪烁于你我之心。诗词小筑，休憩之所，愿能与君共飨片刻温存。',
        icon: 'fa fa-heartbeat'
      },
      followingsIntro: {
        title: '粉丝列表',
        content: '旅行者，粉丝列表记录了你在诗词小筑的一点一滴。从激活密纹之力，收藏诗文，到关注别人与被他人关注，它似回马灯般闪烁于你我之心。诗词小筑，休憩之所，愿能与君共飨片刻温存。',
        icon: 'fa fa-gavel'
      },
      isFollowerList: false,
      localData: []
    }
  },
  computed: {
    ...mapGetters([
      'poemStatus'
    ])
  },
  created() {
    this.getLocalData()
  },
  watch: {
    '$route' (to, from) {
      this.getLocalData()
    }
  },
  methods: {
    // 检查页面是 关注列表 or 粉丝列表
    checkoutPage() {
      // 若页面为 关注列表
      if (this.$router.currentRoute.name === 'userFollower') {
        this.isFollowerList = true
      } else {
        this.isFollowerList = false
      }
    },
    // 获取关注数据
    getLocalData() {
      this.TOGGLE_LOADING_STATUS()
      this.checkoutPage()
      api.get(this.$router.currentRoute.path).then(response => {
        this.TOGGLE_LOADING_STATUS()
        this.localData = response.data
      }).catch(error => {
        this.TOGGLE_LOADING_STATUS()
        this.$message({
          message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~',
          type: 'error',
          customClass: 'c-msg',
          duration: 0,
          showClose: true
        })
        Promise.reject(error)
      })
    },
    // 切换关注状态
    async toggleUserFollowed(id, index) {
      await this.toggleAuthorFollowed(id)
      this.localData[index]['followed'] = this.poemStatus.followed
    },
    ...mapMutations([
      'TOGGLE_LOADING_STATUS'
    ]),
    ...mapActions([
      'toggleAuthorFollowed'
    ])
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/common'

  .df-follower
    .main-wrapper
      fj(center)
      margin-bottom 20px
      .main
        width 60%
        .item
          fj(space-between)
          padding 20px 0
          border-bottom 1px solid Extra-Light-Grey
          .content-wrapper
            fj()
            .content
              margin-left 20px
              .name
                margin 0
              .signature
                color Extra-Light-Black
              .meta
                a
                  text-decoration none
                  color Silver
                  &::after
                    content '\2726'

                .last::after
                  content ''
                span
                  margin-right 5px
            .avatar
              wh(100px, 100px)
              border-radius 5px
              box-shadow 0 1px 1px rgba(0,0,0,.2)
          .action
            fj(center,center)
</style>
