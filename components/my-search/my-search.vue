<template>
	<view class="my-search-container" :style="{ 'background-color': bgcolor}" @click="searchBoxHandle">
		<view class="my-search-box" :style="{ 'border-radius': radius + 'px'}">
			<uni-icons type="search" size="20"></uni-icons>
			<text class="placehoider">搜索</text>
		</view>
	</view>
</template>

<script>
	export default {
		name:"my-search",
		// 这里将这两个属性对外暴露，是不想把样式写死，其他人拿到时也可以自己修改需要的样式
		props: {
			// 背景颜色
			bgcolor: {
				type: String,
				default: '#C00000'
			},
			// 圆角尺寸
			radius: {
				type: Number,
				default: 18
			}
		},
		data() {
			return {
				
			};
		},
		
		methods: {
			searchBoxHandle() {
				
				this.$emit('searchClick')
			}
		}
	}
</script>

<style lang="scss">
.my-search-container {
	height: 50px;
	// background-color: #c00000;
	display: flex;
	align-items: center;
	padding: 0 10px;
	
	.my-search-box {
		height: 36px;
		width: 100%;
		background-color: #FFFFFF;
		// border-radius: 18px;
		display: flex;
		justify-content: center;
		align-items: center;
		
		.placehoider {
			font-size: 15px;
			margin-left: 8px;
		}
	}
}
</style>