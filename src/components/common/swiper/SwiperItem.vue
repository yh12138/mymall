<template>
  <div class="slide">
    <slot></slot>
    <!--每个滑片都只放了一个插槽-->
  </div>
</template>

<script>
  export default {
    name: 'Slide'
  }
</script>

<style scoped>
  .slide {
    width: 100%;
    flex-shrink: 0;
  }

  .slide img {
    /* 后代选择器 */
    width: 100%;
  }
</style>
