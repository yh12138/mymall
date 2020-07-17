<template>
	<div class="recommend-wrap">
		<div class="recommend-item" v-for="item in recommends">
			<a :href="item.link">
				<p><img :src="item.image" alt="" class="recommend-img"></p>
				<p>{{item.title}}</p>
			</a>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'HomeRecommend',
		props: {
			recommends: {
				type: Array,
				default() {
					return []
				}
			}
		}
	}
</script>

<style scoped>
	.recommend-wrap {
		display: flex;
    width: 100%;
    text-align: center;
		background-color: #fff;
		font-size: 12px;
    font-family: "Arial Black";
		padding: 10px 0 20px;
		border-bottom: 8px solid #ededed;
	}
  .recommend-item{
    flex: 1;
  }
  .recommend-item img{
    height: 70px;
    width: 70px;
    margin-bottom: 10px;
  }
</style>
