<template lang="html">
  <canvas id="df-dot"></canvas>
</template>

<script>
import './js'
export default {
  name: 'dot',
  props: {
    numDot: {
      type: Number,
      default: 50
    },
    radDot: {
      type: Number,
      default: 75
    },
    isLine: {
      type: Boolean,
      default: true
    },
    lineDist: {
      type: Number,
      default: 200
    },
    opacity: {
      type: Number,
      default: 0.5
    },
    vxRange: {
      type: Number,
      default: 1
    },
    vyRange: {
      type: Number,
      default: 1
    }
  },
  mounted() {
    window.Dot('df-dot', {
      // canvas 默认宽高
      cW: window.innerWidth,
      cH: window.innerHeight,

      // 粒子数目
      numDot: this.numDot,

      // 粒子半径
      radDot: this.radDot,

      // 大小是否不同
      isRangeRad: true,

      // 粒子颜色
      dotColor: '#42b983',

      // 是否连线
      isLine: this.isLine,

      // 线条长度
      lineDist: this.lineDist,

      // 线条颜色
      lineColor: '#42b983',

      // 反弹系数
      bounce: 1,

      // 透明度
      opacity: this.opacity,

      // 是否触摸连线
      isTouch: true,

      // x方向运动速度
      vxRange: this.vxRange,

      // y方向运动速度
      vyRange: this.vyRange,

      // 是否与边界碰撞检测
      isWallCollisionTest: true,

      // 球体间是否发生碰撞检测
      isBallCollisionTest: true
    })
  }
}
</script>

<style lang="stylus" scoped>
  #df-dot
    position absolute
    z-index -1
</style>
