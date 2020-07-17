<template>
  <div id="app" class="wrapper">
    <keep-alive exclude="Detail">
      <router-view></router-view>
    </keep-alive>
    <main-tab-bar class="main-tab-bar"/>
  </div>
</template>

<script>
  import MainTabBar from "components/content/mainTabbar/MainTabBar";
  export default {
    name: 'app',
    components: {
      MainTabBar
    }
  }
</script>

<style>
  @import "assets/css/base.css";
  .main-tab-bar{
    width: 100%;
  }
</style>
