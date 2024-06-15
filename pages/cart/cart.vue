<template>
<view>
	<view class="cart-container" v-if="cart.length !== 0">
		<!-- 收获地址 -->
		<my-address></my-address>
		
		<!-- 商品列表的标题区 -->
		<view class="cart-title">
			<uni-icons type="shop" size="18"></uni-icons>
			<view class="cart-title-text">购物车</view>
		</view>
		
		<!-- 循环渲染购物车的商品信息 -->
			<!-- 复用组件，绑定数据 -->
		<uni-swipe-action>
			<!-- 滑动删除 -->
			<block v-for="(goods, i) in cart" :key="i">
				<uni-swipe-action-item :right-options="options" @click="swipeItemClickHandler(goods)">
					<my-goods :goods="goods" :show-radio="true" @radio-change="radioChangeHandler" :show-num="true" @num-change="unmberChangeHandler"></my-goods>
				</uni-swipe-action-item>
			</block>
		</uni-swipe-action>
		
		
		<!-- 自定义结算组件 -->
		<my-settle></my-settle>
				
	</view>
	
	<!-- 空购物车状态 -->
	<view class="empty-cart" v-else>
		<image src="../../static/cart_empty@2x.png" class="empty-img"></image>
		<text class="tip-text">空空如也</text>
	</view>
	
	
</view>
</template>

<script>
	import { mapGetters, mapState, mapMutations } from 'vuex'
	export default {
		computed: {
			...mapGetters('m_cart', ['total']),
			...mapState('m_cart', ['cart'])
		},
		
		watch: {
			total() {
				this.setBadge()
			}
		},
		
		// 一进页面就调用方法
		onShow() {
			 this.setBadge()
		},
		
		data() {
			return {
				options: [{
					text: '删除',
					style: {
						backgroundColor: '#C00000'
					}
				}]
			};
		},
		
		
		methods: {
			// 逻辑是， 先在vuex中更新cart.js的数据状态，然后在自定义组件中提交方法，购物车组件中监听方法
			...mapMutations('m_cart', ['updateGoodsState', 'updateGoodsCount', 'removeGoodsById']),
			setBadge() {
				uni.setTabBarBadge({
					index: 2,
					text: this.total + ''
				})
			},
			
			radioChangeHandler(e) {
				this.updateGoodsState(e)
			},
			
			unmberChangeHandler(e) {
				this.updateGoodsCount(e)
			},
			
			swipeItemClickHandler(goods) {
				this.removeGoodsById(goods.goods_id)
			}
		}
	}
</script>

<style lang="scss">
.cart-container {
  padding-bottom: 50px;
  
  .cart-title {
    height: 40px;
    display: flex;
    align-items: center;
    font-size: 14px;
    padding-left: 5px;
    border-bottom: 1px solid #efefef;
    
    .cart-title-text {
      margin-left: 10px;
    }
  }
}


// 空购物车
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 150px;

  .empty-img {
    width: 90px;
    height: 90px;
  }

  .tip-text {
    font-size: 12px;
    color: gray;
    margin-top: 15px;
  }
}
</style>
