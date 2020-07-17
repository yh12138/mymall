<template>
  <div id="home">
    <nav-bar class="home-nav">
      <template v-slot:center>
        <div>
          购物街
        </div>
      </template>
    </nav-bar>
    <tab-control  :titles="['流行','新款','精选']"
                  @tabItemClick="tabItemClick" ref="tabcon1"
                  class="tab-control" v-show="tabControlFixed"></tab-control>
    <scroll class="content" ref="scroll"
            :probe-type="3"
            :pull-up-load="true"
            @scroll="contentScroll"
            @pullingUp="loadMore"
            >
      <home-swiper :banners="banners" @swiperImageLoad="swiperImageLoad"></home-swiper>
      <home-recommend :recommends="recommends"></home-recommend>
      <home-feature></home-feature>
      <tab-control  :titles="['流行','新款','精选']"
                   @tabItemClick="tabItemClick" ref="tabcon2" ></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <back-top @click.native="backTopClick" v-show="showBackTop"></back-top>
  </div>
</template>

<script>
  //公共组件
  import NavBar from "components/common/navbar/NavBar";
  import Scroll from 'components/common/scroll/Scroll'
  //自己的组件
  import HomeSwiper from "./childComps/HomeSwiper";
  import HomeRecommend from "./childComps/HomeRecommend";
  import HomeFeature from "./childComps/HomeFeature";
  import GoodsList from "components/content/goods/GoodsList";
  import TabControl from "components/content/tabControl/TabControl";
  import BackTop from "components/content/backTop/BackTop";
  //数据
  import {getHomeMultidata,getHomeGoods} from "network/home";

  import {itemListenerMixin} from "common/mixin"


  export default {
    name: "Home",
    components:{
      NavBar,
      HomeSwiper,
      HomeRecommend,
      HomeFeature,
      TabControl,
      GoodsList,
      Scroll,
      BackTop
    },
    mixins:[itemListenerMixin],
    data(){
      return {
        banners:[],
        recommends:[],
        goods:{
          'pop':{page:0,list:[]},
          'new':{page:0,list:[]},
          'sell':{page:0,list:[]},
        },
        currentType :'pop',
        showBackTop : false,
        tabOffsetTop : 0,
        tabControlFixed : false,
        saveY: 0
      }
    },
    computed:{
      showGoods(){
        return this.goods[this.currentType].list
      }
    },
    destroyed() {
      console.log('home destroyed');
    },
    activated() {
      this.$refs.scroll.scrollTo(0, this.saveY, 0);
      //刷新
      this.$refs.scroll.refresh();
    },
    deactivated() {
      this.saveY = this.$refs.scroll.getScrollY();

      //取消全局事件监听
      this.$bus.$off('goodsItemImgLoad',this.itemImgLisnter);
    },
    created() {
      // 1.请求多个数据
      this._getHomeMultidata();

      //2.请求商品数据
      this._getHomeGoods('pop');
      this._getHomeGoods('new');
      this._getHomeGoods('sell');


    },
    mounted() {
      //1.监听goodsItem图片加载完成
      // const refresh = this.debounce(this.$refs.scroll.refresh,500);
      //
      // this.itemImgLisnter=()=>{
      //   refresh();
      // }
      // this.$bus.$on('goodsItemImgLoad',this.itemImgLisnter);
      // console.log("ggg");

    },
    methods:{

      /**
       *
       * 网络请求相关方法
       */

      _getHomeMultidata(){
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list //res指向对象 函数执行完之后，变量res会被回收 如果不再有引用，会触发垃圾回收，将返回的对象回收
          // 上面的赋值将res指向的对象的地址赋值给了result，则result指向对象，结果对象仍被引用，所以不会被回收
          this.recommends = res.data.recommend.list
        })
      },
      _getHomeGoods(type){
        const page = this.goods[type].page + 1;
        getHomeGoods(type,page).then(res => {
          this.goods[type].list.push(...res.data.list);
          // this.goods[type].list.concat(res.data.list);
          this.goods[type].page+=1;

          // 完成加载更多数据
          this.$refs.scroll.finishedPullUp();
        })
      },


      /**
       *
       * 事件监听相关方法
       */
      tabItemClick(index){
        switch (index) {
          case 0:
            this.currentType='pop';
            break;
          case 1:
            this.currentType='new';
            break;
          case 2:
            this.currentType='sell';
            break;
        }
        this.$refs.tabcon1.currentIndex=index;
        this.$refs.tabcon2.currentIndex=index;
      },
      backTopClick(){
        this.$refs.scroll.scrollTo(0,0,500);
      },
      //Scroll回到最初位置
      contentScroll(position) {
        //判断BackTop是否显示
        this.showBackTop = (-position.y) >1000;
        //判断TabControl 是否吸顶
        this.tabControlFixed = (-position.y) > this.tabOffsetTop;
      },
      //Scroll到低端时，加载更多数据
      loadMore(){
        this._getHomeGoods(this.currentType)
      },
      //防抖动函数
      debounce(func,delay){
        let timer=null;
        return function (...args) {
          if (timer)  clearTimeout(timer);
          timer=setTimeout(()=>{
            func.apply(this,args);
          },delay);
        }
      },
      swiperImageLoad(){
        //获取tab-control的offsetTop
        //所有组件都有属性$el：用于获取组件中的元素
        this.tabOffsetTop = this.$refs.tabcon2.$el.offsetTop;
      }
    }

  }
</script>

<style scoped>
  #home{
    /*padding-top: 44px;*/
    width: 100%;
    /*vh-视口*/
    height: 100vh;
    position: relative;
  }
  .home-nav{
    background-color: var(--color-tint);
    color: aliceblue;
    /*在使用浏览器原生滚动时, 为了让导航不跟随一起滚动*/
    /*position: fixed;*/
    /*top: 0;*/
    /*left: 0;*/
    /*right: 0;*/
    /*z-index: 9;*/
  }
  /*.content{*/
  /*  height: calc(100% - 93px);*/
  /*  overflow: hidden;*/
  /*  margin-top: 44px;*/
  /*}*/
  .content{
    overflow: hidden;
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }
  .tab-control{
    position: relative;
    z-index: 9;
  }
</style>
