<template>
	<!-- 这里是解决一进页面价格闪烁undefind问题 -->
	<view v-if="goods_info.goods_name" class="goods-detail-container">
		<!-- 轮播图区域 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
		  <swiper-item v-for="(item, i) in goods_info.pics" :key="i">
		    <image :src="item.pics_big" @click="preview(i)"></image>
		  </swiper-item>
		</swiper>
		
		<!-- 商品信息区域 -->
		<view class="goods-info-box">
			<!-- 这里不用写循环，点击商品列表跳转到商品详情的时候携带有参数，将请求回来的数据已经在data中赋值，就可以直接插值表达式使用 -->
		  <!-- 商品价格 -->
		  <view class="price">￥{{goods_info.goods_price}}</view>
		  <!-- 信息主体区域 -->
		  <view class="goods-info-body">
		    <!-- 商品名称 -->
		    <view class="goods-name">{{goods_info.goods_name}}</view>
		    <!-- 收藏 -->
		    <view class="favi">
		      <uni-icons type="star" size="18" color="gray"></uni-icons>
		      <text>收藏</text>
		    </view>
		  </view>
		  <!-- 运费 -->
		  <view class="yf">快递：免运费</view>
		</view>
		
		<!-- 使用内置组件渲染html标签，将富文本渲染出来 -->
		<rich-text :nodes="goods_info.goods_introduce"></rich-text>
		
		<!-- 商品导航 -->
		<view class="goods_nav">
			<uni-goods-nav :fill="true"  :options="options" :buttonGroup="buttonGroup"  @click="onClick" @buttonClick="buttonClick" />
		</view>
	</view>
</template>

<script>
	// 组件中获取状态中的数据，我们在vuex的cart.js中存储购物车的信息，命名为'm_cart'将它挂载到store.js的入口文件上
	// 导入辅助函数，将数据映射到当前组件进行数据使用，计算属性中相当于拿到购物车模块cart.js中state的数据cart[]
	import { mapState, mapMutations, mapGetters } from 'vuex'
	export default {
		computed: {
			...mapState('m_cart', []),
			...mapGetters('m_cart', ['total'])
		},
		watch: {
			// 监听映射过来的方法，方法里面的属性info变化
			// 如果是浅层监听，虽然在cart.js中我们已经将数据存储到本地了，刷新和重新编译的时候购物车信息的info并没有加载到
			// 我们只做了一层的浅层监听，要开启深度监听
			
			total: {
				// const findResult = this.options.find(x => x.text === '购物车')
				// if (findResult) {
				// 	findResult.info = newVal
				// }
				
				handler(newVal) {
					const findResult = this.options.find(x => x.text === '购物车')
					if (findResult) {
						findResult.info = newVal
					}
				},
				immediate: true  // 在属性初始化时立即执行一次监听器函数, 让本地购物车的信息回显在视图层
			}
		},
		data() {
			return {
				goods_info: {},
					options: [{
									icon: 'shop',
									text: '店铺',
									infoBackgroundColor: '#007aff',
									infoColor: "#f5f5f5"
								}, {
									icon: 'cart',
									text: '购物车',
									// 这里应该初始值为零，购物车高亮默认不显示，点击添加的时候会进行数据计算
									info: 0
								}],
								buttonGroup: [{
										text: '加入购物车',
										backgroundColor: 'linear-gradient(90deg, #FFCD1E, #FF8A18)',
										color: '#fff'
									},
									{
										text: '立即购买',
										backgroundColor: 'linear-gradient(90deg, #FE6035, #EF1224)',
										color: '#fff'
									}
								],
								customButtonGroup: [{
										text: '加入购物车',
										backgroundColor: 'linear-gradient(90deg, #1E83FF, #0053B8)',
										color: '#fff'
									},
									{
										text: '立即购买',
										backgroundColor: 'linear-gradient(90deg, #60F3FF, #088FEB)',
										color: '#fff'
									}
								],
								customButtonGroup1: [{
									text: '立即购买',
									backgroundColor: 'linear-gradient(90deg, #FE6035, #EF1224)',
									color: '#fff'
								}]
				
			};
		},
		
		onLoad(options) {

			const goods_id = options.goods_id 
			this.getGoodsDetail(goods_id)
		},
		
		methods: {
			
			// 映射cart.js中的方法addToCart()到组件
			...mapMutations('m_cart', ['addToCart']),
			async getGoodsDetail(goods_id) {
				const {data: res} = await uni.$http.get('/api/public/v1/goods/detail', {goods_id})
				
				if(res.meta.status !== 200) return uni.$showMsg()
				// 处理图片间隙，将返回的数据属性进行一个修改
				res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g, '<img style="display:block;"').replace(/webp/g, 'jpg')
				this.goods_info = res.message
			},
			
			// 点击轮播图预览图片
			preview(i) {
				uni.previewImage({
					current: i,
					urls: this.goods_info.pics.map(x => x.pics_big)
				})
			},
			
			// 点击导航业务跳转
			onClick(e) {
				if(e.content.text === '购物车') {
					uni.switchTab({
						url: '/pages/cart/cart'
					})
				}
			},
			buttonClick(e) {
				 const goods = {
				         goods_id: this.goods_info.goods_id,      
				         goods_name: this.goods_info.goods_name,  
				         goods_price: this.goods_info.goods_price, 
				         goods_count: 1,                           
				         goods_small_logo: this.goods_info.goods_small_logo, 
				         goods_state: true                         
				      }
				// 调用方法，将对象传过去
				this.addToCart(goods)

			}
		}
	}
</script>

<style lang="scss">
swiper {
  height: 750rpx;

  image {
    width: 100%;
    height: 100%;
  }
}

// 商品信息区域的样式
.goods-info-box {
  padding: 10px;
  padding-right: 0;

  .price {
    color: #c00000;
    font-size: 18px;
    margin: 10px 0;
  }

  .goods-info-body {
    display: flex;
    justify-content: space-between;

    .goods-name {
      font-size: 13px;
      padding-right: 10px;
    }
    // 收藏区域
    .favi {
      width: 120px;
      font-size: 12px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-left: 1px solid #efefef;
      color: gray;
    }
  }

  // 运费
  .yf {
    margin: 10px 0;
    font-size: 12px;
    color: gray;
  }
}

// 商品导航
.goods-detail-container {
	padding-bottom: 50px;
}
.goods_nav {
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
}
</style>
