<template lang="html">
  <div class="df-reply">
    <el-form ref="form" :model="form" :rules="rules" class="main c-form">
      <el-form-item prop="receiver">
        <el-autocomplete
          class="receiver"
          placeholder="搜索用户"
          v-model="form.receiver"
          popper-class="c-popper popper"
          icon="search"
          custom-item="receiver-item"
          :fetch-suggestions="fetchReceiver"
          @select="handleSelect"
        ></el-autocomplete>
      </el-form-item>
      <el-form-item prop="body">
        <el-input
          class="content"
          placeholder="私信内容"
          type="textarea"
          resize="none"
          v-model="form.body"
          :autosize="{ minRows: 4, maxRows: 6}"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="btn-default" type="text" @click="toggleDialog">取消</el-button>
        <el-button
          class="btn-default"
          :isLoading="isLoading"
          @click="submitForm">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Vue from 'vue'
// 自定义的输入建议列表项组件
Vue.component('receiver-item', {
  functional: true,
  render: (h, ctx) => {
    let item = ctx.props.item
    return h('li', ctx.data, [
      h('img', { attrs: { class: 'avatar', alt: 'avatar', src: item.avatar } }),
      h('div', { attrs: { class: 'main' } }, [
        h('span', { attrs: { class: 'name' } }, [ item.nickname ]),
        h('span', { attrs: { class: 'signature' } }, [ item.signature ])
      ])
    ])
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  }
})
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'reply',
  data() {
    return {
      form: {
        receiver: '',
        user: 0,
        body: ''
      },
      // 搜索的收信人
      receivers: [],
      isLoading: false,
      rules: {
        receiver: [
          {
            required: true,
            message: '收信人不能为空',
            trigger: 'blur'
          },
          {
            validator: this.checkReceiver,
            trigger: 'change'
          }
        ],
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
      }
    }
  },
  computed: {
    ...mapGetters([
      'users',
      'profile'
    ])
  },
  methods: {
    // 远程搜索用户
    async fetchReceiver(queryStr, cb) {
      await this.fetchUser(queryStr)
      cb(this.users)
    },
    // 检测收信人是否合法
    checkReceiver(rule, value, cb) {
      const user = this.form.user
      if (user) {
        if (user === this.profile.id) {
          cb('旅行者，收信人不能为自己呀。:-O')
        } else {
          cb()
        }
      } else {
        cb('旅行者，收信人必须从下拉列表中选择。')
      }
    },
    // 列表项被选择时的事件
    handleSelect(item) {
      this.form.receiver = item.nickname
      this.form.user = item.user_id
    },
    // 提交私信表单
    submitForm() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          this.isLoading = true
          await this.storeInboxMessage(this.form)
          this.isLoading = false
          // 清空私信表单
          this.form = {}
          // 关闭对话框
          this.toggleDialog()
        }
      })
    },
    toggleDialog() {
      this.$emit('isCancel')
    },
    ...mapActions([
      'storeInboxMessage',
      'fetchUser'
    ])
  }
}
</script>

<style lang="stylus">
@import '../../common/stylus/common'

.df-reply
  .main
    .receiver
      width 100%

.popper
  li
    fj()
    padding 10px
    &:hover
      .signature
        color Dark-White !important
    .avatar
      wh(36px, 36px)
      border-radius 5px
    .main
      margin-left 10px
      line-height normal
      .name
        display block
      .signature
        overflow hidden
        font(.8em, Silver)
        text-overflow ellipsis
        white-space nowrap
</style>
