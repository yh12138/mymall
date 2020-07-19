import {TOP_DISTANCE} from "./const";
import BackTop from 'components/content/backTop/BackTop'
import {POP, NEW, SELL} from "./const";
import {debounce} from "./utils"
//回到顶部
export const backTopMixin = {
	components: {
		BackTop
	},
	data() {
		return {
			showBackTop: false
		}
	},
	methods: {
		backTop() {
			this.$refs.scroll.scrollTo(0, 0, 1000)
		}
	}
}

export const tabControlMixin = {
	data: function () {
		return {
			currentType: SELL
		}
	},
	methods: {
		tabClick(index) {
			switch (index) {
				case 0:
					this.currentType = POP
					break
				case 1:
					this.currentType = NEW
					break
				case 2:
					this.currentType = SELL
					break
			}
			//console.log(this.currentType);
		}
	}
}

export const itemListenerMixin = {
  data(){
    return {
      itemImgLisnter: null,
      refresh: null
    }
  },
  mounted() {
    //1.监听goodsItem图片加载完成
    this.refresh = debounce(this.$refs.scroll.refresh,500);
    this.itemImgLisnter=()=>{
      this.refresh();
    }
    this.$bus.$on('goodsItemImgLoad',this.itemImgLisnter);
    console.log("ttt");
  }
}

