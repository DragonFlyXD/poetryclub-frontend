<template lang="html">
  <div class="df-apprec">
    <div class="main">
      <sub-apprec></sub-apprec>
    </div>
  </div>
</template>

<script>
import SubApprec from '@/components/subApprec'
export default {
  name: 'appreciation',
  components: {
    SubApprec
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/common'

.df-apprec
  fj(center,center)
  margin-top 20px
  .main
    width 50%
    position relative
    .spinner
      position absolute
      width 100%
    .last-page
      color Red
</style>
