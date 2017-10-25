<template lang="html">
  <div class="df-register">
    <dot></dot>
    <div class="main-wrapper">
      <div class="alert">
        <el-alert
          title="旅行者，注册成功。不过还需前往注册邮箱处，激活账户才能成功登录。些许邮箱在垃圾邮件才能找到，:)"
          type="success"
          v-show="alertVisible"
          v-if="isSuccess"
        ></el-alert>
        <el-alert
          title="旅行者，注册失败。您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~"
          type="error"
          v-show="alertVisible"
          v-else
        ></el-alert>
      </div>
      <div class="main">
        <div class="form-wrapper">
          <el-form class="form c-form" ref="form" :rules="rules" :model="form">
            <el-form-item label="用户名" prop="name">
              <el-input
                placeholder="您的用户名和登录名"
                v-model="form.name"
                @blur="showPlaceholder"
                @focus="hidePlaceholder"
              ></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email" v-if="emailVisible">
              <el-input
                v-model="form.email"
                placeholder="建议使用常用邮箱"
                @blur="showPlaceholder"
                @focus="hidePlaceholder"
              ></el-input>
              <!-- <el-button class="reg-validate" type="text" @click="toggleEmail">手机验证</el-button> -->
            </el-form-item>
            <el-form-item label="手机" prop="mobile" v-else>
              <el-input
                placeholder="建议使用常用手机号码"
                @blur="showPlaceholder"
                @focus="hidePlaceholder"
              ></el-input>
              <el-button class="validate" type="text" @click="toggleEmail">邮箱验证</el-button>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-input
                placeholder="密码至少6位"
                type="password"
                v-model="form.password"
                @blur="showPlaceholder"
                @focus="hidePlaceholder"
              ></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="password_confirmation">
              <el-input
                placeholder="请再次输入您的密码"
                type="password"
                v-model="form.password_confirmation"
                @focus="hidePlaceholder"
                @blur="showPlaceholder"
              ></el-input>
            </el-form-item>
            <el-form-item prop="protocol">
              <el-checkbox v-model="form.protocol">
                阅读并同意
                <el-button type="text" @click="showDialog">诗词小筑用户注册和版权声明</el-button>
              </el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-button
                class="publish"
                :loading="isLoading"
                :disabled="isRegistered"
                @click="submitForm"
                >立即注册
              </el-button>
            </el-form-item>
          </el-form>
        </div>
        <el-dialog class="register-dialog c-dialog" title="诗词小筑用户相关和版权声明" v-model="dialogVisible">
          <span>用户同意所有以下条款后才能成为诗词小筑(以下简称本站)的正式注册用户。</span>
          <div class="about-user">
            <h3>本站用户相关</h3>
            <span>1. 用户在本站发布相关原创诗文(文章)须为用户个人创作所得。</span>
            <span>2. 用户注册成功后，即拥有在本站发布诗文(文章)、水贴、提交意见的权利。</span>
            <span>3. 不得传输或发表任何违法犯罪的、辱骂性的、淫秽的、庸俗的诗文(文章)。</span>
            <span>4. 不得传输或发表任何破坏宪法和法律、破坏国家统一与煽动民族仇恨、民族歧视、破坏民族团结的言论。</span>
          </div>
          <div class="copyright">
            <h3>本站版权声明</h3>
            <span>1. 本站的所有原创诗文(文章)归原创作者所有，未经其本人同意，不得擅自转载。</span>
          </div>
          <span slot="footer">
            <el-button class="btn-default" @click='showDialog'>同意并继续</el-button>
          </span>
        </el-dialog>
    </div>
  </div>
  </div>
</template>

<script>
import api from '@/api'
import c from '@/common/js'
import Dot from '@/components/dot'
export default {
  name: 'userRegister',
  components: {
    Dot
  },
  data() {
    return {
      form: {  // 用户注册信息
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        protocol: true
      },
      rules: {  // 表单验证规则
        name: [{
          required: true,
          message: '用户名不能为空。',
          trigger: 'blur'
        }, {
          min: 2,
          max: 20,
          message: '用户名必须介于2-20个字符之间。',
          trigger: 'blur'
        }, {
          type: 'string',
          pattern: /^[\u4E00-\u9FFFa-zA-Z0-9_-]{2,20}$/,
          message: '格式不正确。',
          trigger: 'blur'
        }, {
          validator: this.validateUsername,
          trigger: 'blur'
        }],
        email: [{
          required: true,
          message: '邮箱不能为空。',
          trigger: 'blur'
        }, {
          max: 50,
          message: '邮箱不能大于50个字符。',
          trigger: 'blur'
        }, {
          type: 'string',
          pattern: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
          message: '格式不正确。',
          trigger: 'blur'
        }, {
          validator: this.validateEmail,
          trigger: 'blur'
        }],
        mobile: [{
          required: true,
          message: '手机号码不能为空。',
          trigger: 'blur'
        }, {
          len: 11,
          message: '手机号码必须是11个字符。',
          trigger: 'blur'
        }, {
          type: 'string',
          pattern: /^1\d{10}$/,
          message: '格式不正确。',
          trigger: 'blur'
        }, {
          validator: this.validateMobile,
          trigger: 'blur'
        }],
        password: [{
          required: true,
          message: '密码不能为空。',
          trigger: 'blur'
        }, {
          min: 6,
          max: 20,
          message: '密码必须介于6-20个字符之间。',
          trigger: 'blur'
        }, {
          type: 'string',
          pattern: /^[a-zA-Z0-9_-]{6,20}$/,
          message: '格式不正确。',
          trigger: 'blur'
        }],
        password_confirmation: [{
          validator: this.validatePassword,
          trigger: 'blur'
        }],
        protocol: [{
          validator: this.validateProtocol,
          trigger: 'change'
        }]
      },
      dialogVisible: false,  // 协议对话框可视度
      alertVisible: false,  // 警告框可视度
      emailVisible: true,   // email输入框可视度
      lastPlaceholder: '',
      isLoading: false,  //  注册按钮是否正在加载
      isRegistered: false,  // 是否已注册
      isSuccess: false   // 是否注册成功
    }
  },
  created() {
    c.logged()
  },
  methods: {
    // 验证用户名是否存在
    validateUsername(r, v, cb) {
      api.post('user/register', this.form).then(response => {
        response.data.name ? cb(new Error('用户名已经存在。')) : cb()
      })
    },
    // 验证邮箱是否存在
    validateEmail(r, v, cb) {
      api.post('user/register', this.form).then(response => {
        response.data.email ? cb(new Error('邮箱已经存在。')) : cb()
      })
    },
    // 验证手机号码是否存在
    validateMobile(r, v, cb) {
      api.post('user/register', this.form).then(response => {
        response.data.mobile ? cb(new Error('手机号码已经存在。')) : cb()
      })
    },
    // 验证密码
    validatePassword(rule, value, cb) {
      if (value === '') {
        cb(new Error('请再次输入密码。'))
      } else if (value !== this.form.password) {
        cb(new Error('两次输入密码不一致。'))
      } else {
        cb()
      }
    },
    // 验证协议
    validateProtocol(rule, value, cb) {
      value ? cb() : cb(new Error('请同意协议并勾选。'))
    },
    // 提交表单
    submitForm() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          // 指定请求为正式提交表单
          this.form.is_submit = true
          this.isLoading = true
          api.post('user/register', this.form).then(response => {
            this.isLoading = false
            // 如果用户名含有非法字符
            if (response.data.error) {
              if (response.data.error.http_code === 400) {
                this.$message({
                  message: response.data.error.message,
                  type: 'error',
                  customClass: 'c-msg',
                  showClose: true
                })
              }
            } else if (response.data.registered) {
              // 注册成功
              this.isSuccess = true
              this.isRegistered = true
            } else {
              // 注册失败
              this.isSuccess = false
            }
            this.alertVisible = true
          }).catch(error => {
            this.isLoading = false
            this.$message({message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~', type: 'error', customClass: 'c-msg', duration: 0, showClose: true})
            Promise.reject(error)
          })
        }
        return false
      })
    },
    showDialog() {
      this.dialogVisible = !this.dialogVisible
    },
    toggleEmail() {
      this.emailVisible = !this.emailVisible
    },
    showPlaceholder(e) {
      e.target.placeholder = this.lastPlaceholder
    },
    hidePlaceholder(e) {
      this.lastPlaceholder = e.target.placeholder
      e.target.placeholder = ''
    }
  }
}
</script>
<style lang="stylus" scoped>
@import '../../common/stylus/common'

.df-register
  height 100%
  .main-wrapper
    width 100%
    .alert
      margin-top 10px
      text-align center
    .main
      fj(center,center)
      .form-wrapper
        width 33.3%
        .form
          .publish
            width 100%
      .register-dialog
        .about-user,.copyright
          &>span
            display inline-block
            line-height 2em
            color Silver
</style>
