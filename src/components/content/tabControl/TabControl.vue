<template>
	<div class="tab-control-wrap">
		<div class="tab-control-item"
			 v-for="(item,index) in titles"
			 :class="{active: index === currentIndex}"
			 @click="tabItemClick(index)">
			<span>{{item}}</span>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'TabControl',
		props: {
			titles: {
				type: Array,
				default() {
					return []
				}
			}
		},
		data() {
			return {
				currentIndex: 0
			}
		},
		methods: {
			tabItemClick(index) {
				this.currentIndex = index;
				this.$emit('tabItemClick',index)
			}
		}
	}
</script>

<style scoped>
  .tab-control-wrap{
    display: flex;
    text-align: center;
    font-size: 15px;
    height: 40px;
    line-height: 40px;
    background-color: #fff;
  }
  .tab-control-item{
    flex:1;
  }
  .tab-control-item span{
    padding: 5px;
  }
  .active{
    color: var(--color-high-text);

  }
  .active span{
    border-bottom: 3px solid var(--color-high-text);
  }
</style>
