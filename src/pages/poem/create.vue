<template lang="html">
  <div class="df-createPoem">
    <el-form class="main c-form" ref="form" :model="form" :rules="rules">
      <el-form-item prop="title">
        <el-input
          placeholder="诗文标题，1-50个字符之间。"
          v-model="form.title"
        ></el-input>
      </el-form-item>
      <el-form-item prop="category">
        <el-select
          class="c-select category"
          popper-class="c-popper"
          v-model="form.category"
          placeholder="请选择一个诗文类型"
          :filter-method="fetchCategory"
        >
          <el-option
            v-for="(category, index) in categories"
            :key="index"
            :value="category.id"
            :label="category.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-tag
          class="tag"
          v-for="(tag,key) in form.dynamicTags"
          :key="key"
          :closable="true"
          :close-transition="true"
          @close="closeTag(tag)"
        >{{ tag }}</el-tag>
        <el-input
          v-if="iptVisible"
          v-model="iptValue"
          ref="saveTagIpt"
          placeholder="标签名不能重复，且数量不能大于5个。"
          @keyup.enter.native="confirmIpt"
          @blur="confirmIpt"
        ></el-input>
        <el-button
          v-else
          class="show-input"
          @click="showIpt"
        >添加标签</el-button>
      </el-form-item>
      <el-form-item prop="body">
        <quill-editor
          class="c-quill"
          ref="quill"
          v-model="form.body"
          :options="editorOptions"
        ></quill-editor>
      </el-form-item>
      <el-form-item>
        <el-button
        class="publish"
        :loading="isLoading"
        @click="submitForm"
        >{{ isEditPage ? '更新作品' : '发表作品' }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from '@/api'
import { mapGetters, mapActions } from 'vuex'
import {
  quillEditor
} from 'vue-quill-editor'
export default {
  name: 'createPoem',
  components: {
    quillEditor
  },
  data() {
    return {
      isEditPage: false,  // 是否编辑页面
      form: {
        title: '', // 标题
        category: '', // 分类名
        dynamicTags: [], // 标签
        body: '' // 诗文内容
      },
      categories: [], // 分类列表
      iptVisible: false,
      iptValue: '',
      editorOptions: { // quill 编辑器配置
        theme: 'bubble',
        placeholder: '诗文内容，支持Markdown语法。'
      },
      isLoading: false, // 按钮是否在加载
      dialogVisible: false,
      rules: { // 表单验证规则
        title: [
          {
            required: true,
            message: '标题不能为空。',
            trigger: 'blur'
          },
          {
            min: 1,
            max: 50,
            message: '标题必须介于1-50个字符之间。',
            trigger: 'blur'
          }
        ],
        category: [
          {
            required: true,
            type: 'number',
            message: '分类不能为空。',
            trigger: 'change'
          }
        ],
        body: [{
          required: true,
          message: '内容不能为空。',
          trigger: 'blur'
        }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'poem'
    ])
  },
  async created() {
    await this.fetchCategory()
    this.checkoutPage()
  },
  methods: {
    async checkoutPage() {
      const route = this.$router.currentRoute.name
      // 若为编辑页面
      if (route === 'editPoem') {
        this.isEditPage = true
        const poemId = this.$router.currentRoute.params.poem_id
        // 加载待编辑诗文的内容
        await this.loadPoem(`poem/${poemId}`)
        // 表单项集合
        const formItems = ['title', 'dynamicTags', 'category', 'body']
        // 填充表单数据
        formItems.map(item => {
          if (item === 'category') {
            this.categories.some(category => {
              if (category.id === this.poem['category_id']) {
                this.form.category = category.id
                return true
              }
            })
          } else if (item === 'dynamicTags' && this.poem['tags'].length > 0) {
            // 若为诗文标签
            this.poem['tags'].forEach(item => {
              this.form['dynamicTags'].push(item.name)
            })
          } else if (this.poem[item]) {
            this.form[item] = this.poem[item]
          }
        })
      }
    },
    // 远程获取分类列表
    async fetchCategory() {
      await api.get('category').then(response => {
        this.categories = response.data
      })
    },
    // 去除标签
    closeTag(tag) {
      this.form.dynamicTags.splice(this.form.dynamicTags.indexOf(tag), 1)
    },
    // 显示标签输入框
    showIpt() {
      this.iptVisible = true
      this.$nextTick(() => {
        this.$refs['saveTagIpt'].$refs.input.focus()
      })
    },
    // 检验标签的合法性
    confirmIpt() {
      if (this.iptValue) {
        // 若标签名重复
        if (this.form.dynamicTags.indexOf(this.iptValue) > -1) {
          this.$message({
            message: '旅行者，标签名不能重复。',
            type: 'error',
            customClass: 'c-msg'
          })
        } else if (this.form.dynamicTags.length >= 5) {
          // 若标签数大于5
          this.$message({
            message: '旅行者，诗文最大标签数不能大于5。',
            type: 'error',
            customClass: 'c-msg'
          })
        } else {
          // 若未重复，则储存该标签
          this.form.dynamicTags.push(this.iptValue)
        }
      }
      this.iptVisible = false
      this.iptValue = ''
    },
    // 提交表单
    submitForm() {
      this.$refs['form'].validate(async valid => {
        if (valid) {
          this.isLoading = true
          // 若为编辑诗文页面
          if (this.isEditPage) {
            const poemId = this.poem.id
            await api.put(`poem/${poemId}`, this.form).then(response => {
              this.isLoading = false
              if (response.data.updated) {
                this.$message({
                  message: '诗文更新成功。',
                  type: 'success',
                  customClass: 'c-msg'
                })
              } else {
                this.$message({
                  message: '诗文更新失败。',
                  type: 'error',
                  customClass: 'c-msg'
                })
              }
            }).catch(error => {
              this.isLoading = false
              this.$message({
                message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~',
                type: 'error',
                customClass: 'c-msg',
                duration: 0,
                showClose: true
              })
              Promise.reject(error)
            })
          } else {
            // 若为创建诗文页面
            await api.post('poem', this.form).then(response => {
              this.isLoading = false
              // 诗文创建成功
              if (response.data.created) {
                this.$router.push(`/poem/${response.data.poem.id}`)
                this.$message({
                  message: '诗文创建成功。',
                  type: 'success',
                  customClass: 'c-msg'
                })
              } else if (response.status === 422) {
                // 参数错误
                this.$message({
                  message: response.statusText,
                  type: 'error',
                  customClass: 'c-msg'
                })
              } else {
                this.$message({
                  message: response.data.error.message,
                  type: 'error',
                  customClass: 'c-msg'
                })
              }
            }).catch(error => {
              this.isLoading = false
              this.$message({
                message: '旅行者，诗词小筑出了点状况，您可以稍后再来光顾，拜托啦/(ㄒoㄒ)/~~',
                type: 'error',
                customClass: 'c-msg',
                duration: 0,
                showClose: true
              })
              Promise.reject(error)
            })
          }
        }
        return false
      })
    },
    ...mapActions([
      'loadPoem'
    ])
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/common'

.df-createPoem
  fj(center)
  margin-top 50px
 .main
   width 50%
   .category
     width 100%
   .tag
     margin 0 20px 20px 0
   .show-input
     &::before
       margin-right 5px
       font-size 1.2em
       content '\2723'
   .publish
     width 100%
</style>
