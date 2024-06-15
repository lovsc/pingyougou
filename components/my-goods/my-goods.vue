<template>
	<view class="goods-item">
	  <!-- 商品左侧图片区域 -->
	  <view class="goods-item-left">
		  <!-- 外界传过来的goods对象有一个属性控制check是否被选中 -->
		  <radio :checked="goods.goods_state" color="#c00000" v-if="showRadio" @click="radioClickHandler"></radio>
	    <image :src="goods.goods_small_logo || defaultPic" class="goods-pic"></image>
	  </view>
	  <!-- 商品右侧信息区域 -->
	  <view class="goods-item-right">
	    <!-- 商品标题 -->
	    <view class="goods-name">{{goods.goods_name}}</view>
	    <view class="goods-info-box">
	      <!-- 商品价格 -->
	      <view class="goods-price">￥{{goods.goods_price.toFixed(2)}}</view>
		  
		  <uni-number-box :min="1" :value="goods.goods_count" v-if="showNum" @change="numChangeHandler"></uni-number-box>
	    </view>
	  </view>
	</view>
</template>

<script>
	export default {
		name:"my-goods",
		
		props: {
			goods: {
				type: Object,
				default: {}
			},
			
			// 控制radio的显示和隐藏
			showRadio: {
				type: Boolean,
				default: false
			},
			
			// 控制商品数量
			showNum: {
				type: Boolean,
				default: false
			}
		},
		
		data() {
			return {
				// 默认图片
				defaultPic: 'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
			};
		},
		
		methods: {
			
			// 选框按钮点击事件
			radioClickHandler() {
				// 对外触发一个radio-change事件， 携带参数，点击的时候状态state取反，实现点击取消再点击
				this.$emit('radio-change', {
					goods_id: this.goods.goods_id,
					goods_state: !this.goods.goods_state
				})
			},
			
			// 监听数量变化事件
			numChangeHandler(val) {
				
				this.$emit('num-change', {
					goods_id: this.goods.goods_id,
					goods_count: +val
				})
			}
		}
	}
</script>

<style lang="scss">
.goods-item {
  display: flex;
  padding: 10px 5px;
  border-bottom: 1px solid #f0f0f0;

  .goods-item-left {
    margin-right: 5px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	

    .goods-pic {
      width: 100px;
      height: 100px;
      display: block;
    }
  }

  .goods-item-right {
    display: flex;
	flex: 1;
    flex-direction: column;
    justify-content: space-between;

    .goods-name {
      font-size: 13px;
    }

	.goods-info-box {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
    .goods-price {
      font-size: 16px;
      color: #c00000;
    }
  }
}
</style>