<template>
	<view>
		
		<!-- 搜索组件 -->
		<view class="search-box">
			<my-search @searchClick="gotoSearch"></my-search>
		</view>
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
			<swiper-item v-for="(item,index) in swiperList" :key="index">
				<navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
					<image :src="item.image_src"></image>
				</navigator>
			</swiper-item>
		</swiper>
		
		
		<!-- 分类导航区域 -->
		<view class="nav-list">
		   <view class="nav-item" v-for="(item, i) in navList" :key="i" @click="navClickHandler(item)">
		     <image :src="item.image_src" class="nav-img"></image>
		   </view>
		</view>
		
		
		<!-- 楼层区域 -->
		<view class="floor-list">
		  <view class="floor-item" v-for="(item, i) in floorList" :key="i">
		    <!-- 楼层标题 -->
		    <image :src="item.floor_title.image_src" class="floor-title"></image>
			<!-- 楼层的图片区域 有分左边和右边-->
			<view class="floor-img-box">
				<navigator class="left-img-box" :url="item.product_list[0].url">
					<image :src="item.product_list[0].image_src" :style="{width: item.product_list[0].image_width + 'rpx'}" mode="widthFix"></image>
				</navigator>
				
				<view class="right-img-box">
					<navigator class="right-ing-item" v-for="(item2,i2) in item.product_list" :key="i2" v-if="i2 !== 0" :url="item2.url">
						<image :src="item2.image_src" :style="{width: item2.image_width + 'rpx'}" mode="widthFix"></image>
					</navigator>
				</view>
			</view>
			
			
		  </view>
		</view>
		
		
	</view>
</template>

<script>
	export default {
		
		data() {
			return {
				
				swiperList: [],
				
				navList: [],
				
				floorList: []
			};
		},
		
		onLoad() {
			// 调用方法。获取轮播图的数据
			this.getSwiperList()
			this.getNavList()
			this.getFloorList()
		},
		
		methods: {
			async getSwiperList() {
				const { data: res } = await uni.$http.get('/api/public/v1/home/swiperdata')
				// 如果请求失败
				if (res.meta.status !== 200) return uni.$showMsg()
					
				
				// 成功后将数据赋值给数组
				this.swiperList = res.message
				
			},
			
			// 获取导肮数据
			async getNavList() {
				const { data: res } = await uni.$http.get('/api/public/v1/home/catitems')
				if (res.meta.status !== 200) return uni.$showMsg()
				
				this.navList = res.message 
			},
			
			// 点击导航跳转
			navClickHandler(item) {
				if(item.name === '分类') {
					uni.switchTab({
						url: '/pages/cate/cate'
					})
				}
			},
			
			// 获取首页楼层数据的方法
			async getFloorList() {
				const { data: res } = await uni.$http.get('/api/public/v1/home/floordata')
				if (res.meta.status !== 200) return uni.$showMsg()
				
				// 对数据进行处理
				// 将请求回来的数据进行循环，第一次循环遍历的是每个楼层，第二次循环遍历的是每个楼层下商品的地址值
				// 给每一个楼层的视频挂载一个自定义属性url
				res.message.forEach(floor => {
					floor.product_list.forEach(prod => {
						prod.url = '/subpkg/goods_list/goods_list?' + prod.navigator_url.split('?')[1]
					})
				})
				this.floorList = res.message
			},
			
			// 搜索组件
			gotoSearch() {
				uni.navigateTo({
					url: '/subpkg/search/search'
				})
			}
		}
	
	}
</script>

<style lang="scss">
swiper{
	height: 330rpx;
	.swiper-item
	image {
		width: 100%;
		height: 10;
	}
}
.nav-list {
  display: flex;
  justify-content: space-around;
  margin: 15px 0;

  .nav-img {
    width: 130rpx;
    height: 130rpx;
  }
}

.floor-title {
  height: 60rpx;
  width: 100%;
  display: flex;
}

.right-img-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

.floor-img-box {
  display: flex;
  padding-left: 10rpx;
}

.search-box {
	position: sticky;
	top: 0;
	z-index: 999;
}
</style>
