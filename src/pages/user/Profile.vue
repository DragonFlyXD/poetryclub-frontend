<template lang="html">
  <div class="df-profile">
    <header class="header">
      <div class="left">
        <div class="avatar">
          <img class="now-avatar" :src="userProfile.avatar" alt="avatar">
          <el-upload
            class="update-avatar"
            :name="uploadOptions.name"
            :action="uploadOptions.action"
            :headers="uploadOptions.headers"
            :show-file-list="uploadOptions.showFileList"
            :before-upload="beforeAvatarUpload"
            :on-success="handleAvatarSuccess"
            :on-error="handleAvatarError"
            v-if="isOwns"
          >
            <p>旅行者，换个与汝相依的头像。 :)</p>
          </el-upload>
        </div>
      </div>
      <div class="mid">
        <h1 class="name">{{ userProfile.nickname }}</h1>
        <div class="info">
          <div class="box" @click="works">
            <span>文章</span>
            <span>{{ userProfile.works_count }}</span>
          </div>
          <div class="box" @click="followers">
            <span>关注</span>
            <span>{{ userProfile.followers_count }}</span>
          </div>
          <div class="box" @click="followings">
            <span>粉丝</span>
            <span>{{ userProfile.followings_count }}</span>
          </div>
          <el-button class="btn-pub" @click="toggleProfileDialog" v-if="isOwns">修改个人资料</el-button>
        </div>
      </div>
      <div class="right">
        <el-progress
          class="c-progress"
          type="circle"
          :percentage="completion"
          :stroke-width="8"
          :width="200"
        ></el-progress>
      </div>
    </header>
    <div class="body">
      <dot></dot>
      <div class="content">
        <div class="box">
          <h4>昵称</h4>
          <span>{{ userProfile.nickname }}</span>
        </div>
        <div class="box">
          <h4>性别</h4>
          <span>{{ userProfile.gender }}</span>
        </div>
        <div class="box">
          <h4>生日</h4>
          <span>{{ userProfile.birthday }}</span>
        </div>
        <div class="box">
          <h4>私人语录</h4>
          <span class="f-taj">{{ userProfile.signature }}</span>
        </div>
        <div class="box">
           <h4>居住地</h4>
          <span>{{ userProfile.location }}</span>
        </div>
        <div class="box">
          <h4>职业</h4>
          <span>{{ userProfile.occupation }}</span>
        </div>
        <div class="box">
          <h4>个人简历</h4>
          <span>{{ userProfile.bio }}</span>
        </div>
        <div class="box">
          <h4>最钟爱的诗人</h4>
          <span>{{ userProfile.poet }}</span>
        </div>
      </div>
    </div>
    <el-dialog title="编辑个人信息" :visible.sync="dialogVisible" custom-class="profile-dialog c-dialog">
      <div class="form-wrapper">
        <el-form class="c-form form" label-width="100px" ref="userProfile" :model="userProfile" :rules="rules">
          <el-form-item label="昵称" prop="nickname">
            <el-input
            v-model="userProfile.nickname"
            :placeholder="placeholder.nickname"
            @focus="hidePlaceholder"
            @blur="showPlaceholder"
            ></el-input>
          </el-form-item>
          <el-form-item label="性别" prop="gender">
            <el-radio-group v-model="userProfile.gender" fill="#42b983" text-color="rgba(66,185,131,.8)">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="生日" prop="birthday">
            <el-date-picker
              v-model="userProfile.birthday"
              type="date"
              :placeholder="placeholder.birthday"
              :editable="false"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="私人语录" prop="signature">
            <el-input
              type="textarea"
              v-model="userProfile.signature"
              :placeholder="placeholder.signature"
              :rows="2"
              @focus="hidePlaceholder"
              @blur="showPlaceholder"
            ></el-input>
          </el-form-item>
          <el-form-item label="居住地" prop="location">
            <el-input
              :placeholder="placeholder.location"
              v-model="userProfile.location"
              @focus="hidePlaceholder"
              @blur="showPlaceholder"
            ></el-input>
          </el-form-item>
          <el-form-item label="职业" prop="occupation">
            <el-input
              :placeholder="placeholder.occupation"
              v-model="userProfile.occupation"
              @focus="hidePlaceholder"
              @blur="showPlaceholder"
            ></el-input>
          </el-form-item>
          <el-form-item label="个人简介" prop="bio">
            <el-input
              type="textarea"
              v-model="userProfile.bio"
              :placeholder="placeholder.bio"
              :autosize="{minRows:4,maxRows:20}"
              @focus="hidePlaceholder"
              @blur="showPlaceholder"
            ></el-input>
          </el-form-item>
          <el-form-item label="最钟爱的诗人" prop="poet">
            <el-input
              :placeholder="placeholder.poet"
              v-model="userProfile.poet"
              @focus="hidePlaceholder"
              @blur="showPlaceholder"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="publish" @click="submitForm">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api'
import Dot from '@/components/dot'
import {
  mapGetters,
  mapActions,
  mapMutations
} from 'vuex'
export default {
  name: 'userProfile',
  components: {
    Dot
  },
  data() {
    return {
      placeholder: {
        nickname: '行不更名坐不改姓',
        birthday: '生日格式：1996-07-21',
        signature: '私人语录即一句话显逼格，最长为140个字符',
        location: '旅行者，仙乡何处 (黑人问号)',
        occupation: '说，你会干啥 (和善的眼神)',
        bio: '远方来的人儿，介绍下自己呗 (善意的笑容)',
        poet: '重要的、不能忘记的、不想忘记的诗人。他(她)，是谁？'
      },
      rules: {
        nickname: [
          {
            min: 2,
            max: 20,
            message: '昵称必须介于2-20个字符之间。',
            trigger: 'blur'
          },
          {
            type: 'string',
            pattern: /^[\u4E00-\u9FFFa-zA-Z0-9_-]{2,20}$/,
            message: '格式不正确。',
            trigger: 'blur'
          }
        ],
        signature: [{
          max: 50,
          message: '私人语录不能大于140个字符。',
          trigger: 'blur'
        }],
        location: [{
          max: 50,
          message: '居住地不能大于50个字符。',
          trigger: 'blur'
        }],
        occupation: [{
          max: 50,
          message: '职业不能大于50个字符。',
          trigger: 'blur'
        }],
        bio: [{
          max: 400,
          message: '个人简介不能大于400个字符。',
          trigger: 'blur'
        }],
        poet: [{
          max: 50,
          message: '最钟爱的诗文不能大于50个字符。',
          trigger: 'blur'
        }]
      },
      userProfile: {},  // 个人信息 or 用户信息
      uploadOptions: {
        name: 'avatar',  // 上传图片字段名
        action: 'http://www.dragonflyxd.com/api/user/avatar',  // 上传图片地址
        headers: {  // 上传图片的请求头部
          'Authorization': 'Bearer ' + window.localStorage.ACCESS_TOKEN,
          'Accept': 'application/json'
        },
        showFileList: false   // 是否显示已上传文件列表
      },  // 上传图片配置信息
      dialogVisible: false,
      lastPlaceholder: '',
      isOwns: false,
      completion: 0, // 个人信息完善百分比
      matches: [  // 个人信息匹配项
        'nickname',  // 昵称
        'gender',  // 性别
        'birthday',  // 生日
        'signature',  // 个性签名
        'location',  // 居住地
        'occupation',  // 职位
        'bio',  // 个人简历
        'poet'  // 最爱之诗人
      ],
      pickerOptions: {
        // 禁用日期
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'isLogined',
      'profile'
    ])
  },
  created() {
    // 检查是否是个人信息页面
    this.checkoutOwns()
    // 加载用户数据
    this.loadUserProfile(this.$router.currentRoute.path)
  },
  watch: {
    // 用户信息页面 和 个人信息页面 复用同一组件，而原来的组件实例会被复用，所以生命周期钩子不会再被调用
    // 因此需要侦听路由变化，来加载数据
    '$route' (to, from) {
      this.checkoutOwns()
      this.loadUserProfile(to.path)
    }
  },
  methods: {
    // 检查该页面属于个人信息页面 or 用户信息页面
    checkoutOwns() {
      if (this.$router.currentRoute.path === '/user/profile') {
        this.isOwns = true
      }
    },
    // 加载个人信息
    async loadUserProfile(path) {
      // 若加载的为个人信息页面
      if (this.isOwns) {
        await this.loadProfile()
        this.userProfile = this.profile
      } else {
        this.TOGGLE_LOADING_STATUS()
        await api.get(path).then(response => {
          this.TOGGLE_LOADING_STATUS()
          this.userProfile = response.data
        }).catch(error => {
          this.TOGGLE_LOADING_STATUS()
          this.$message({message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~', type: 'error', customClass: 'c-msg', duration: 0, showClose: true})
          Promise.reject(error)
        })
      }
      // 检查个人信息的完善程度
      this.checkoutCompletion()
    },
    // // 检查个人信息的完善程度
    checkoutCompletion() {
      let cnt = 0
      this.matches.forEach(item => {
        // 获取完成总数
        this.userProfile[item] && cnt++
      })
      // 计算个人信息完成百分比
      this.completion = cnt * 100 / this.matches.length
    },
    // 上传图片前的钩子
    beforeAvatarUpload(f) {
      const isJPGorPNG = f.type === 'image/jpeg' || f.type === 'image/png'
      const is500K = f.size / 1024 / 1024 < 0.5
      // 上传图片类型必须为 JPG or PNG
      if (!isJPGorPNG) {
        this.$message({
          message: '上传头像图片必须是JPG或PNG格式。',
          type: 'warning',
          customClass: 'c-msg'
        })
      }
      // 上传图片大小必须小于 500k
      if (!is500K) {
        this.$message({
          message: '上传头像图片大小不能超过500K。',
          type: 'warning',
          customClass: 'c-msg'
        })
      }
      return isJPGorPNG && is500K
    },
    // 上传图片失败时的钩子
    handleAvatarError(err, f) {
      this.$message({message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~', type: 'error', customClass: 'c-msg', duration: 0, showClose: true})
      Promise.reject(err)
    },
    // 上传图片成功时的钩子
    handleAvatarSuccess(res, f) {
      // 若上传成功，则更新头像
      res.avatar && this.updateAvatar(res.avatar)
    },
    // 提交个人信息表单
    submitForm() {
      // 修改生日的日期格式
      if (this.userProfile.birthday) {
        this.userProfile.birthday = this.dateFormatter(this.userProfile.birthday)
      }
      // 验证表单数据的合法性
      this.$refs['userProfile'].validate(async valid => {
        // 如果验证成功，则提交数据
        if (valid) {
          // 修改数据
          await this.updateProfile()
          this.userProfile = this.profile
          // 更新个人信息完成度
          this.checkoutCompletion()
          // 隐藏对话框
          this.dialogVisible = false
        }
      })
    },
    works() {
      this.$router.push(`/user/${this.userProfile.name}/works`)
    },
    followings() {
      this.$router.push(`/user/${this.userProfile.name}/followings`)
    },
    followers() {
      this.$router.push(`/user/${this.userProfile.name}/followers`)
    },
    dateFormatter(date) {
      return new Date(date).toLocaleDateString()
    },
    toggleProfileDialog() {
      this.dialogVisible = !this.dialogVisible
    },
    showPlaceholder(e) {
      e.target.placeholder = this.lastPlaceholder
    },
    hidePlaceholder(e) {
      this.lastPlaceholder = e.target.placeholder
      e.target.placeholder = ''
    },
    ...mapMutations([
      'TOGGLE_LOADING_STATUS'
    ]),
    ...mapActions([
      'loadProfile',
      'updateProfile',
      'updateAvatar'
    ])
  }

}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/common'

.df-profile
  .header
    fj(space-around)
    margin-top 20px
    padding-top 20px
    background-color Extra-Light-Grey
    .left
      width 16.6%
      .avatar
        position relative
        wh(200px,200px)
        border-radius 200px
        box-shadow 0 1px 1px rgba(0,0,0,.2)
        text-align center
        overflow hidden
        &:hover
          cursor pointer
          &>.update-avatar
            bottom 0
        .now-avatar
          wh(200px,200px)
        .update-avatar
          position absolute
          bottom -100px
          left 0
          wh(100%,100px)
          line-height 2em
          background linear-gradient(to bottom right,Extra-Light-Grey,White)
          color Green
          transition all .3s ease
          cursor pointer
          .el-upload__files
            display none
          p
            font-size .9em
    .mid
      width 25%
      text-align center
      letter-spacing 3px
      color Green
      .name
        &::before
          margin-right 20px
          content '\5B'
        &::after
          margin-left 20px
          content '\5D'
      .info
        margin-top 5px
        .box
          display inline-block
          margin-left 20px
          transition color .1s
          &:hover
            color Red
            cursor pointer
          span
            display block
            font-size 1.3em
          & span:nth-child(1)
            margin-bottom 10px
            font-weight bold
          & span:nth-child(2)
            font-size 1.1em
        button
          margin-top 10px
    .right
      width 16.6%
      &:hover
        cursor pointer
  .body
    z-index 1
    fj(center,center)
    padding 20px 0
    .content
      width 33.3%
      .box
        text-align center
        overflow hidden
        span
          color Silver
  .profile-dialog
    .form-wrapper
      fj(center)
      .form
        width 75%
        .publish
          width 100%
</style>
