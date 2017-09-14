<template lang="html">
  <div class="df-subPoem">
    <div class="main-left">
      <router-link :to="poem.profileUrl">
        <img :src="poem.user.avatar" alt="avatar" class="avatar">
      </router-link>
      <el-button class="vote btn-default btn-act" @click="toggleVoted" v-if="voted">{{ voteCount }}</el-button>
      <el-button class="vote btn-default" @click="toggleVoted" v-else>{{ voteCount }}</el-button>
    </div>
    <div class="main-right">
      <header class="header">
        <router-link class="title" :to="poem.poemUrl">{{ poem.title }}</router-link>
        <template v-if="isFavorite">
          <el-button class="favor btn-default btn-act" @click="toggleFavored" v-if="favored">
            <i class="fa fa-heart"></i>
          </el-button>
          <el-button class="favor btn-default" @click="toggleFavored" v-else>
            <i class="fa fa-heart-o"></i>
          </el-button>
        </template>
        <el-button class="trash btn-default" v-else>
          <i class="fa fa-trash-o"></i>
        </el-button>
      </header>
      <div class="info">
        <span>
          <i class="fa fa-user"></i><router-link :to="poem.profileUrl">{{ poem.authorName }}</router-link>
        </span>
        <span>
          <i class="fa fa-clock-o"></i>{{ poem.publish_time }}
        </span>
        <span v-if="poem.pageviews_count>0">
          <i class="fa fa-eye"></i>{{ poem.pageviews_count }}
        </span>
      </div>
      <div class="body">
        <div class="content" ref="body" v-html="poem.body" @click="toggleExpand" v-if="isExpand"></div>
        <div class="content" ref="body" v-html="summary" @click="toggleExpand" v-else></div>
      </div>
      <footer class="footer">
        <div class="c-tags" v-if="poem.tags.length > 0">
          <i class="fa fa-tags"></i>
          <el-tag v-for="(tag,index) in poem.tags" :key="index" class="tag">{{ tag.name }}</el-tag>
        </div>
        <div class="feedback">
          <a v-if="poem.comments_count>0" @click="toggleCommentDialog">
            <i class="fa fa-comment-o"></i>{{ poem.comments_count }}&nbsp;条评论
          </a>
          <a>
            <i class="fa fa-share"></i>分享
          </a>
        </div>
      </footer>
    </div>
    <el-dialog class="comment-dialog" v-model="commentDialogVisible">
      <comment
        :comments="poem.comments"
        :modelId="poem.id"
        :isIndex="true"
      ></comment>
    </el-dialog>
  </div>
</template>

<script>
import {
  mapActions,
  mapGetters
} from 'vuex'
import Comment from '@/components/comment'
export default {
  name: 'subPoem',
  props: {
    poem: {
      type: Object,
      default: {}
    },
    isFavorite: {
      type: Boolean,
      default: true
    }
  },
  components: {
    Comment
  },
  computed: {
    summary() {
      const body = this.poem.body
      let summary = this.poem.summary
      if (body.length > summary.length) {
        summary += '<span class="ellipsis">...</span>'
      }
      return summary
    },
    ...mapGetters([
      'poemStatus',
      'poemCurrentPage'
    ])
  },
  data() {
    return {
      favored: false,  // 收藏状态
      voted: false,    // 点赞状态
      voteCount: 0,    // 点赞总数
      isExpand: false,  // 是否全部显示
      commentDialogVisible: false
    }
  },
  created() {
    this.loadStatus()
  },
  methods: {
    loadStatus() {
      this.favored = this.poem.favored
      this.voted = this.poem.voted
      this.voteCount = this.poem.likes_count
    },
    // 切换诗文显示内容
    toggleExpand() {
      this.isExpand = !this.isExpand
      if (this.isExpand) {
        this.$refs.body.className += ' is-collapse'
      } else {
        this.$refs.body.className = this.$refs.body.className.replace(/(\s|^)+is-collapse{1}(\s|$)+/, '')
      }
    },
    // 切换点赞状态
    async toggleVoted() {
      await this.togglePoemVoted(this.poem.id)
      this.voted = this.poemStatus.voted
      if (this.voted) {
        this.voteCount += 1
      } else {
        this.voteCount -= 1
      }
    },
    // 切换收藏状态
    async toggleFavored() {
      await this.togglePoemFavored(this.poem.id)
      this.favored = this.poemStatus.favored
    },
    toggleCommentDialog() {
      this.commentDialogVisible = !this.commentDialogVisible
    },
    ...mapActions([
      'togglePoemVoted',
      'togglePoemFavored'
    ])
  }
}
</script>
<style lang="stylus">
@import '../../common/stylus/common'

.df-subPoem
  fj()
  margin 20px 0
  border-bottom 1px solid Extra-Light-Grey
  .main-left
    margin-right 20px
    .avatar
      wh(120px,120px)
      border-radius 10px
      box-shadow 0 1px 1px rgba(0,0,0,.2)
    .vote
      display block
      margin 10px auto
  .main-right
    position relative
    margin 0 !important
    width 100%
    .header
      .title
        display inline-block
        font(1.5em,mgreen(.8))
        text-decoration none
        transition all .3s
        &:hover
          text-decoration underline
          color Green
          transform translateY(-3px)
      .favor,.trash
        float right
    .info
      margin 5px 0
      &>span:first-child
        &>a
          text-decoration none
          color Green
      span
       margin-right 5px
       font(.8em,Silver)
       &>i
         margin-right 5px
    .body
      margin 10px 0 20px 0
      font(.8em,Silver)
      .content
        max-height 120px
        overflow hidden
        padding-bottom 20px
        word-break break-all
        line-height 2em
        cursor pointer
        .ellipsis
          color Green
        *
          display inline-block
          margin 0
      .is-collapse
        max-height none
        word-break break-all
        *
          display block
     .footer
      fj(space-between)
      position absolute
      bottom 5px
      left 0
      width 100%
      .feedback
        float right
        margin-bottom 5px
        &>a
          margin-left 10px
          font(.7em,Silver)
          text-decoration none
          transition all .2s
          &:hover,&:focus
            color Green
            cursor pointer
          &>i
            margin-right 5px
  .comment-dialog
    .el-dialog__header
      .el-dialog__headerbtn
        i:hover,i:focus
          color Green
          transition all .2s
</style>
