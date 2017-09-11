<template lang="html">
  <div class="df-authorInfo">
    <header class="header">
      <router-link :to="page.profileUrl">
        <img class="avatar" :src="page.user.avatar" alt="avatar">
      </router-link>
      <div class="info">
        <router-link :to="{ path: `/user/${page.user.name}/works` }">
          <p>作品<span>{{ page.user.works_count }}</span></p>
        </router-link>
        <router-link :to="{ path: `/user/${page.user.name}/followers` }">
          <p>关注<span>{{ page.user.followers_count }}</span></p>
        </router-link>
        <router-link :to="{ path: `/user/${page.user.name}/followings` }">
          <p>粉丝<span>{{ page.user.followings_count }}</span></p>
        </router-link>
      </div>
      <div class="clearfix"></div>
    </header>
    <div class="body">
      <div class="item">
        <i class="fa fa-user"></i>
        <p>
          <router-link class="tdu" :to="page.profileUrl">{{ page.authorName }}</router-link>
        </p>
      </div>
      <div class="item">
        <i class="fa fa-map-marker"></i>
        <p>{{ page.user.location }}</p>
      </div>
      <div class="item">
        <i class="fa fa-lemon-o"></i>
        <p>{{ page.dynasty }}</p>
      </div>
      <div class="item">
        <i class="fa fa-road"></i>
        <p>{{ page.user.signature }}</p>
      </div>
      <div class="item">
        <i class="fa fa-book"></i>
        <p>
          <router-link
            class="tdu"
            v-for="(work,index) in works"
            :key="index"
            :to="work.workUrl"
            >《{{ work.workName }}》</router-link>
            <span class="more" v-if="isMoreWorks" @click="toggleWorksDialog">全部作品</span>
        </p>
      </div>
    </div>
    <footer class="footer" v-if="page.user.id !== profile.id">
      <el-button class="btn-default" @click="toggleReplyDialog"><i class="fa fa-envelope-o"></i></el-button>
      <el-button
        class="btn-pub"
        @click="toggleAuthorFollowed(page.user.id)"
        v-if="status.followed"
      >已关注</el-button>
      <el-button
        class="btn-default"
        @click="toggleAuthorFollowed(page.user.id)"
        v-else
      >关注Ta</el-button>
    </footer>
    <el-dialog
      custom-class="c-reply works-dialog"
      title="全部作品"
      :visible.sync="worksDialogVisible"
      >
      <header class="header">
        <div class="box">
          作者：<router-link class="tdu" :to="page.profileUrl">{{ page.authorName }}</router-link>
        </div>
        <div class="box">
          作品总数：<span class="total-works">{{ page.user.works_count }}</span>
        </div>
      </header>
      <div class="body">
        <div class="item-wrapper" v-if="this.page.user.poems.length > 0">
          <h3 class="title">诗文</h3>
          <div class="item" v-for="(poem,index) in this.page.user.poems" :key="index">
            <router-link class="tdu" :to="poem.workUrl">《{{ poem.workName }}》</router-link>
            <span>{{ poem.publish_time }}</span>
          </div>
        </div>
        <div class="item-line"></div>
        <div class="item-wrapper" v-if="this.page.user.appreciations.length > 0">
          <h3 class="title">品鉴</h3>
          <div class="item" v-for="(apprec,index) in this.page.user.appreciations" :key="index">
            <router-link class="tdu" :to="apprec.workUrl">《{{ apprec.workName }}》</router-link>
            <span>{{ apprec.publish_time }}</span>
          </div>
        </div>
      </div>
    </el-dialog>
    <el-dialog
      custom-class="c-reply"
      title="发送私信"
      size="tiny"
      :visible.sync="replyDialogVisible"
      >
      <header class="header">
        <span class="title">收信人：</span>
        <span class="receiver">{{ page.user.nickname }}</span>
      </header>
      <el-form class="c-form" ref="form" :model="form" :rules="rules">
        <el-form-item prop="body">
          <el-input
            v-model="form.body"
            type="textarea"
            resize="none"
            :autosize="{ minRows: 4, maxRows: 6}"
          ></el-input>
        </el-form-item>
      </el-form>
      <footer slot="footer">
        <el-button class="btn-default" type="text" @click="toggleReplyDialog">取消</el-button>
        <el-button class="btn-default" :loading="isLoading" @click="submitForm">确定</el-button>
      </footer>
    </el-dialog>
  </div>
</template>

<script>
import {
  mapActions, mapGetters
} from 'vuex'
export default {
  name: 'authorInfo',
  props: {
    page: {
      type: Object,
      default: {}
    },
    status: {
      type: Object,
      default: {}
    }
  },
  computed: {
    works() {
      let poems = this.page.user.poems
      let apprecs = this.page.user.appreciations
      const pl = poems.length
      const al = apprecs.length
      let works = []
      // 若该用户的诗文与品鉴的数量大于5，则显示更多作品按钮
      if (pl + al > 5) {
        this.isMoreWorks = true
      }
      // 抉择诗文和品鉴的显示数量
      if (pl > 3 && al > 3) {
        works = poems.slice(0, 3).concat(apprecs.slice(0, 2))
      } else if (pl > 3 && al < 3) {
        works = poems.slice(0, (5 - al)).concat(apprecs)
      } else if (pl < 3 && al > 3) {
        works = poems.concat(apprecs.slice(0, (5 - pl)))
      } else {
        works = poems.concat(apprecs)
      }
      return works
    },
    ...mapGetters([
      'profile'
    ])
  },
  data() {
    return {
      replyDialogVisible: false,
      worksDialogVisible: false,
      // 是否有更多作品( > 5)
      isMoreWorks: false,
      form: {
        body: '',
        user: this.page.user.id
      },
      rules: {
        body: [
          {
            required: true,
            message: '私信内容不能为空。',
            trigger: 'blur'
          },
          {
            min: 6,
            message: '私信内容至少为6个字符。',
            trigger: 'blur'
          }
        ]
      },
      isLoading: false
    }
  },
  methods: {
    // 提交私信表单
    async submitForm() {
      this.isLoading = true
      await this.$refs['form'].validate(valid => {
        if (valid) {
          this.storeInboxMessage(this.form)
        }
      })
      this.isLoading = false
      // 清空表单内容
      this.form.body = ''
      // 关闭对话框
      this.toggleReplyDialog()
    },
    // 切换用户关注
    toggleAuthorFollowed(user) {
      if (this.$router.currentRoute.name === 'poemView') {
        this.togglePoemAuthorFollowed(user)
      } else {
        this.toggleApprecAuthorFollowed(user)
      }
    },
    toggleReplyDialog() {
      this.replyDialogVisible = !this.replyDialogVisible
    },
    toggleWorksDialog() {
      this.worksDialogVisible = !this.worksDialogVisible
    },
    ...mapActions([
      'togglePoemAuthorFollowed',
      'toggleApprecAuthorFollowed',
      'storeInboxMessage'
    ])
  }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/common'

.df-authorInfo
  margin 10px 0 40px 0
  .header
    .avatar
      margin-right 10px
      wh(100px,100px)
      border-radius 5px
      box-shadow 0 1px 1px rgba(0,0,0,.2)
    .info
      float right
      font(.9em,Silver)
      a
        text-decoration none
        color Silver
        &:hover
          color Red
          & span
            color Red
      span
        float right
        display inline-block
        margin-left 50px
        font(1em,Green)
  .body
    margin-top 5px
    .item
      fj()
      margin 7px 0
      vertical-align top
      line-height 2em
      color Silver
      &>p
        margin 0
        font-size .8em
      &>i
        margin 7px 10px 0 0
        color Light-Green
      .more
        display block
        margin 10px 0 20px 0
        border 1px solid Light-Silver
        border-radius 3px
        font-size 1.1em
        text-align center
        cursor pointer
        transition all .2s
        &:hover,&:focus
          border-color Silver
  .footer
    margin-top 20px
    color Silver
    &>button:last-child
      float right
.works-dialog
  .header
    fj(space-around)
    .total-works
      color Red
  .body
    margin 20px 0
    .item-line
      height 1px
      margin 20px 0
      background-color Extra-Light-Silver
    .item
      fj(space-between)
</style>
