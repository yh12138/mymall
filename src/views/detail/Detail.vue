<template>
  <div id="detail">
    <detail-nav-bar class="detail-nav" @titleClick="selectDetailIndex" ref="nav"/>
    <scroll class="content" ref="scroll" @scroll="contentScroll" :probe-type="3" >
      <detail-swiper :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shop"/>
      <detail-goods-info :detail-info="detailInfo" @detailImageLoad="detailImageLoad"/>
      <detail-param-info :param-info="paramInfo" ref="param" />
      <detail-comment-info :comment-info="commentInfo" ref="comment"/>
      <goods-list ref="recommend" :goods="recommends" />
    </scroll>
    <detail-bottom-bar @addToCart="addToCart"/>
    <back-top @click.native="backTop" v-show="showBackTop"></back-top>
    <toast ref="toast" :message="message" :show="show"/>
  </div>
</template>

<script>
  import DetailNavBar from './childComps/DetailNavBar';
  import DetailSwiper from './childComps/DetailSwiper';
  import DetailBaseInfo from './childComps/DetailBaseInfo';
  import DetailShopInfo from './childComps/DetailShopInfo';
  import DetailGoodsInfo from './childComps/DetailGoodsInfo';
  import DetailParamInfo from './childComps/DetailParamInfo';
  import DetailCommentInfo from "./childComps/DetailCommentInfo";
  import GoodsList from "components/content/goods/GoodsList";
  import DetailBottomBar from "./childComps/DetailBottomBar";
  import Toast from "components/common/toast/Toast";

  import Scroll from 'components/common/scroll/Scroll';
  import {getDetail, Goods, Shop, GoodsParam, getRecommend} from "network/detail";

  import {itemListenerMixin,backTopMixin} from "common/mixin";
  import {TOP_DISTANCE} from "common/const";
  import {mapActions} from 'vuex';

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailParamInfo,
      DetailCommentInfo,
      GoodsList,
      DetailBottomBar,
      Scroll,
      Toast
    },
    mixins:[itemListenerMixin,backTopMixin],
    data() {
      return {
        iid: null,
        topImages: [],
        goods: {},
        shop: {},
        detailInfo: {},
        paramInfo: {},
        commentInfo:{},
        recommends: [],
        refresh: null,
        themeTops: [],
        currentIndex: 0,
        message:'ss',
        show:false
      }
    },
    created() {
      // 1.保存传入的iid
      this.iid = this.$route.query.iid;
      // 2.根据iid请求详情数据
      getDetail(this.iid).then(res => {
        // 1.获取顶部的图片轮播数据
        //console.log(res);
        const data = res.result;
        this.topImages = data.itemInfo.topImages;

        // 2.获取商品信息
        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);

        // 3.创建店铺信息的对象
        this.shop = new Shop(data.shopInfo);

        // 4.保存商品的详情数据
        this.detailInfo = data.detailInfo;

        // 5.获取参数的信息
        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule);

        //6.保存评论数据
        if (data.rate.list){
          this.commentInfo =data.rate.list[0];
        }
        //给param、comment、recommend找到offsetTop，这个时候组件虽渲染了，但图片没有缓存好
        // this.$nextTick(()=>{
        //   this.themeTops.push(0);
        //   this.themeTops.push(this.$refs.param.$el.offsetTop);
        //   this.themeTops.push(this.$refs.comment.$el.offsetTop);
        //   this.themeTops.push(this.$refs.recommend.$el.offsetTop);
        // })

      })
      // 3.请求推介数据
      getRecommend().then(res => {
        // 1.获取顶部的图片轮播数据
        this.recommends=res.data.list;

      })
    },
    mounted() {

    },
    destroyed() {
      //取消全局事件监听
      this.$bus.$off('goodsItemImgLoad',this.itemImgLisnter);
    },
    methods: {
      ...mapActions([
        'addCart'
      ]),
      //detail图片加载完后
      detailImageLoad() {
        this.$refs.scroll.refresh();
        // this.refresh();//在mixin中有refresh
        this.themeTops=[];
        this.themeTops.push(0);
        this.themeTops.push(this.$refs.param.$el.offsetTop);
        this.themeTops.push(this.$refs.comment.$el.offsetTop);
        this.themeTops.push(this.$refs.recommend.$el.offsetTop);

      },
      //选择Detail主题
      selectDetailIndex(index){

        this.$refs.scroll.scrollTo(0,-this.themeTops[index],500);
      },
      contentScroll(position){
        // 监听滚动到某个主题
        this._listenScrollTheme(-position.y);
        //判断BackTop是否显示
        this.showBackTop = (-position.y) > TOP_DISTANCE;
      },
      _listenScrollTheme(positionY){
        let length = this.themeTops.length;
        for (let i = 0; i < length; i++) {
          let iPos = this.themeTops[i];
          /**
           * 判断的方案:
           *  方案一:
           *    条件: (i < (length-1) && currentPos >= iPos && currentPos < this.themeTops[i+1]) || (i === (length-1) && currentPos >= iPos),
           *    优点: 不需要引入其他的内容, 通过逻辑解决
           *    缺点: 判断条件过长, 并且不容易理解
           *  方案二:
           *    条件: 给themeTops最后添加一个很大的值, 用于和最后一个主题的top进行比较.
           *    优点: 简洁明了, 便于理解
           *    缺点: 需要引入一个较大的int数字
           * 疑惑: 在第一个判断中, 为什么不能直接判断(currentPos >= iPos)即可?
           * 解答: 比如在某一个currentPos大于第0个时, 就会break, 不会判断后面的i了.
           */
          if ((i < (length-1) && positionY >= iPos && positionY < this.themeTops[i+1])||
            (i === (length-1) && positionY >= iPos)){
            if (this.currentIndex !== i) {
              this.currentIndex = i;
              this.$refs.nav.currentIndex = this.currentIndex;
            }
          }
        }
      },
      // backTopClick(){
      //   this.$refs.scroll.scrollTo(0,0,500);
      // },
      addToCart(){
		    // 1.获取该商品信息
        const obj = {}
        obj.iid = this.iid
        obj.imgURL = this.topImages[0]
        obj.title = this.goods.title
        obj.desc = this.goods.desc
        obj.price = this.goods.realPrice
        //2.添加到Store中的mutations
        //this.$store.commit('addCart',obj);
        //2.添加到Store中的actions
        this.$store.dispatch('addCart',obj).then((res)=>{
          //显示Toast
          /*1.普通方式封装
           this.show=true;
           this.message=res;
           setTimeout(()=>{
             this.show=false;
             this.message='';
           },1500);*/
          //2.插件封装
          this.$toast({message: res});

        });
      }
    }
  }
</script>

<style scoped>
  #detail {
    position: relative;
    z-index: 1;
    background-color: #fff;
    height: 100vh;
  }

  .detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
  }

  .content {
    height: calc(100% - 93px);
  }
</style>
