<template lang="html">
  <div class="df-pageView">
    <header class="header">
      <h2 class="title">{{ page.title }}</h2>
      <div class="info">
        <span>
          <i class="fa fa-user-o"></i><router-link
          class="name"
          :to="{ path : page.profileUrl}"
          >{{ page.authorName }}</router-link>
        </span>
        <span v-if="model === 'appreciation'">
          <i class="fa fa-clock-o"></i>{{ page.publish_time }}
        </span>
        <span v-else>
          <i class="fa fa-lemon-o"></i>{{ page.dynasty }}
        </span>
        <el-button
          class="btn-can edit"
          v-if="page.user_id === profile.id"
          @click="editPage"
        >编辑</el-button>
      </div>
    </header>
    <div class="body">
      <div class="content" v-html="page.body" v-highlight></div>
    </div>
    <footer class="footer">
      <div class="actions">
        <el-tooltip
          content="收藏Ta"
          placement="top"
          effect="light"
          :openDelay="1000"
        >
          <el-button class="btn-act" @click="toggleFavored" v-if="status.favored">
            <i class="fa fa-heart"></i>
          </el-button>
          <el-button @click="toggleFavored" v-else>
            <i class="fa fa-heart-o"></i>
          </el-button>
        </el-tooltip>
        <el-tooltip
          v-if="this.model === 'poem'"
          content="给Ta写赏析"
          placement="top"
          effect="light"
          :openDelay="1000"
        >
          <el-button class="btn-act" @click="createApprec" v-if="status.appreciated">
            <i class="fa fa-pencil-square"></i>
          </el-button>
          <el-button @click="createApprec" v-else>
            <i class="fa fa-pencil-square-o"></i>
          </el-button>
        </el-tooltip>
        <el-tooltip
          content="赞Ta"
          placement="top"
          effect="light"
          :openDelay="1000"
        >
          <el-button class="btn-act" @click="toggleVoted" v-if="status.voted">
            <i class="fa fa-thumbs-up"></i>
          </el-button>
          <el-button @click="toggleVoted" v-else>
            <i class="fa fa-thumbs-o-up"></i>
          </el-button>
        </el-tooltip>
        <el-tooltip
          content="分享Ta于世人"
          placement="top"
          effect="light"
          :openDelay="1000"
        >
          <el-button>
            <i class="fa fa-share-square-o"></i>
          </el-button>
        </el-tooltip>
        <el-tooltip
          class="rate"
          content="旅行者，你的旨意我们已收到！"
          placement="top"
          effect="light"
          v-if="status.rated"
        >
          <el-rate
            v-model="status.rated"
            :colors="['rgba(66,185,131,.5)','rgba(66,185,131,.8)','#42b983']"
            disabled
          ></el-rate>
        </el-tooltip>
        <el-rate
          class="rate"
          v-model="rating"
          :colors="['rgba(66,185,131,.5)','rgba(66,185,131,.8)','#42b983']"
          @click.native="storeRated"
          v-else
        ></el-rate>
      </div>
    </footer>
  </div>
</template>

<script>
import {
  mapActions, mapGetters
} from 'vuex'
export default {
  name: 'pageView',
  props: {
    page: {
      type: Object,
      default: {}
    },
    status: {
      type: Object,
      default: {}
    },
    model: {
      type: String,
      default: 'poem'
    }
  },
  data() {
    return {
      rating: 0
    }
  },
  computed: {
    ...mapGetters([
      'profile'
    ])
  },
  methods: {
    toggleVoted() {
      if (this.model === 'poem') {
        this.togglePoemVoted(this.page.id)
      } else if (this.model === 'appreciation') {
        this.toggleApprecVoted(this.page.id)
      }
    },
    toggleFavored() {
      if (this.model === 'poem') {
        this.togglePoemFavored(this.page.id)
      } else if (this.model === 'appreciation') {
        this.toggleApprecFavored(this.page.id)
      }
    },
    storeRated() {
      // 拼接评分项
      const ratingLevel = 'rating_' + this.rating
      let rating = {
        'model': this.page.id,
        'type': this.model
      }
      rating[ratingLevel] = 1
      if (this.model === 'poem') {
        this.storePoemRated(rating)
      } else if (this.model === 'appreciation') {
        this.storeApprecRated(rating)
      }
    },
    createApprec() {
      this.$router.push(`/appreciation/create?poem=${this.page.id}`)
    },
    editPage() {
      if (this.model === 'poem') {
        this.$router.push(`${this.$router.currentRoute.path}/edit`)
      } else if (this.model === 'appreciation') {
        this.$router.push(`${this.$router.currentRoute.path}/edit?poem=${this.page.poem_id}`)
      }
    },
    ...mapActions([
      'togglePoemVoted',
      'togglePoemFavored',
      'storePoemRated',
      'toggleApprecVoted',
      'toggleApprecFavored',
      'storeApprecRated'
    ])
  }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/common'

.df-pageView
  margin-bottom 50px
  color Silver
  .header
    .info
      margin 5px 0
      .edit
        float right
      .name
        text-decoration none
        color Green
      span
       margin-right 5px
       font-size .8em
       color Silver
       &>i
         margin-right 5px
  .body
    .content
      word-break break-all
      line-height 2em
  .footer
    margin-top 20px
    .actions
      button
        text-align center
        color Silver
        &:hover
          border-color Green
          color Green
          animation skAct 1s cubic-bezier(1,.5,.8,1)
        &:focus
          border-color inherit
      .rate
        float right
        margin-top 10px
</style>
