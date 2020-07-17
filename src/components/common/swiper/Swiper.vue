<template>
  <div id="hy-swiper">
    <div
      class="swiper"
      @touchstart="touchStart"
      @touchmove="touchMove"
      @touchend="touchEnd"
    >
      <slot></slot>
      <!--大插槽-->
    </div>
    <slot name="indicator"></slot>
    <div class="indicator">
      <slot name="indicator" v-if="showIndicator && slideCount > 1">
        <div
          v-for="(item, index) in slideCount"
          class="indi-item"
          :key="index"
          :class="{ active: index === currentIndex - 1 }"
        ></div>
      </slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Swiper',
    props: {
      //属性，暴露出去
      interval: {
        // 轮播间隔
        type: Number,
        default: 3000
      },
      animDuration: {
        // 这个可能是开始轮播的时间？还是动画的持续时间？
        type: Number,
        default: 300
      },
      moveRatio: {
        // 拖动松开后会切换图片的拖动比例
        type: Number,
        default: 0.25
      },
      showIndicator: {
        // 指示器是否显示，默认true
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        slideCount: 0,
        totalWidth: 0, // swiper的宽度
        swiperStyle: {}, // swiper样式是什么意思
        currentIndex: 1, // 当前的轮播图片的索引
        scrolling: false //是否正在滚动
      }
    },
    mounted() {
      //安装好后的钩子, 或者说是dom渲染好以后
      setTimeout(() => {
        // 1. 操作dom,在前后添加Slide
        this.handleDom()
        // 2. 开启定时器
        this.startTimer()
      }, 100)
    },
    methods: {
      /**
       * 定时器操作, 有点看不懂
       */
      startTimer() {
        this.playTimer = window.setInterval(() => {
          // window.setInterval()函数用于在指定的周期调用函数
          // 该方法会不停地调用函数，直到clearInterval()被调用或者窗口被关闭
          // 所以这里的意思是每过this.interval时间，调用一次下面的函数。
          this.currentIndex++
          this.scrollContent(-this.currentIndex * this.totalWidth)
        }, this.interval)
      },
      stopTimer() {
        // window.setInterval()函数的返回值作为window.clearInterval()函数的参数
        window.clearInterval(this.playTimer)
      },
      /**
       * 滚到正确的位置
       */
      scrollContent(currentPosition) {
        // 0.设置正在滚动
        this.scrolling = true

        // 1. 开始滚动动画
        this.swiperStyle.transition = 'transform' + this.animDuration + 'ms' // swiperStyle添加对象
        this.setTransform(currentPosition) // 这个函数在后面定义
        // 2. 判断滚动到的位置
        this.checkPosition()
        // 4. 滚动完成
        this.scrolling = false
      },

      /**
       * 校验正确的位置
       */
      checkPosition() {
        window.setTimeout(() => {
          // 1.校验正确的位置
          this.swiperStyle.transition = '0ms'
          if (this.currentIndex >= this.slideCount + 1) {
            // 因为之前操作dom的时候在前后分别克隆了两个节点，所以这里如果到了最后一帧后面克隆的帧，则导向第一帧
            // 并在this.animDuration之后，滑向下一张
            this.currentIndex = 1
            this.setTransform(-this.currentIndex * this.totalWidth)
          } else if (this.currentIndex <= 0) {
            // 同上，导向最后一张图
            this.currentIndex = this.slideCount
            this.setTransform(-this.currentIndex * this.totalWidth)
          }

          // 2. 结束移动后的回调
          this.$emit('transitionEnd', this.currentIndex - 1)
        }, this.animDuration)
      },

      /**
       * 设置滚动的位置
       */
      setTransform(position) {
        this.swiperStyle.transform = `translate3d(${position}px, 0, 0)`
        this.swiperStyle[
          '-webkit-transform'
        ] = `translate3d(${position}px), 0, 0`
        this.swiperStyle['-ms-transform'] = `translate3d(${position}px), 0, 0`
      },

      /**
       * 操作dom, 在DOM前后添加Slide
       */
      handleDom() {
        // 1. 获取要操作的元素
        let swiperEl = document.querySelector('.swiper') // 匹配指定css选择器的第一个元素，所以传入的参数为选择器
        //console.log(swiperEl) // 看看匹配到的是啥
        let slidesEls = swiperEl.getElementsByClassName('slide') // swiperItem的插槽外包裹的div有 class="slide"
        // 返回的是HTMLCollection(集合?数组？)
        //console.log(slidesEls)

        // 2. 保存滑片个数
        this.slideCount = slidesEls.length

        // 3. 如果大于1个，那么在前后分别添加一个slide
        if (this.slideCount > 1) {
          let cloneFirst = slidesEls[0].cloneNode(true)
          let cloneLast = slidesEls[this.slideCount - 1].cloneNode(true)
          swiperEl.insertBefore(cloneLast, slidesEls[0])
          swiperEl.append(cloneFirst)
          this.totalWidth = swiperEl.offsetWidth
          this.swiperStyle = swiperEl.style
        }

        // 4. 让swiper元素显示第一个（目前显示的是前面添加的最后一个元素）
        this.setTransform(-this.totalWidth) // 右移一个滑片的宽度
      },

      /**
       * 拖动事件处理
       */
      touchStart(e) {
        // 1. 如果正在滚动，那么不可以拖动
        if (this.scrolling) {
          return
        }

        // 2. 停止计时器
        this.stopTimer()

        // 3. 保存开始滚动的位置
        this.startX = e.touches[0].pageX // 这是在做什么？
        console.log('startX' + this.startX)
      },

      touchMove(e) {
        // 1. 计算出用户拖动的距离
        this.currentX = e.touches[0].pageX
        this.distance = this.currentX - this.startX
        let currentPosition = -this.currentIndex * this.totalWidth
        let moveDistance = this.distance + currentPosition

        // 2. 设置当前的位置
        this.setTransform(moveDistance)
      },

      touchEnd(e) {
        // 1. 获取移动的距离
        let currentMove = Math.abs(this.distance)

        // 2. 判断最终的距离
        if (this.distance === 0) {
          return
        } else if (
          this.distance > 0 &&
          currentMove > this.totalWidth * this.moveRatio
        ) {
          // 如果右移的距离大于指定比例
          this.currentIndex--
        } else if (
          this.distance < 0 &&
          currentMove > this.totalWidth * this.moveRatio
        ) {
          // 如果左移的距离大于指定比例
          this.currentIndex++
        }

        // 3. 移动到正确的位置
        this.scrollContent(-this.currentIndex * this.totalWidth)

        // 4. 移动完成后重新开启定时器
        this.startTimer()
      },

      /**
       * 控制上一个，下一个
       */
      previous() {
        this.changeItem(-1)
      },

      next() {
        this.changeItem(1)
      },

      changeItem(num) {
        // 1. 移除定时器
        this.stopTimer()

        // 2. 修改index和位置
        this.currentIndex += num
        this.scrollContent(-this.currentIndex * this.totalWidth)

        // 3. 添加定时器
        this.startTimer()
      }
    }
  }
</script>

<style scoped>
  #hy-swiper {
    overflow: hidden;
    position: relative;
  }

  .swiper {
    display: flex;
  }

  .indicator {
    display: flex;
    justify-content: center;
    position: absolute;
    width: 100%;
    bottom: 8px;
  }

  .indi-item {
    box-sizing: border-box;
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background-color: #fff;
    line-height: 8px;
    text-align: center;
    font-size: 12px;
    margin: 0 5px;
  }

  .indi-item.active {
    background-color: rgba(212, 62, 46, 1);
  }
</style>
