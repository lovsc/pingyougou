<template>
  <view>
    <!-- 选择收货地址的盒子 -->
    <view class="address-choose-box" v-if="JSON.stringify(address) === '{}'">
      <button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
    </view>
    
    <!-- 收货地址信息文本 -->
    <view class="address-info-box" v-else @click="chooseAddress">
      <view class="row1">
        <view class="row1-left">
          <view class="username">收货人：<text>{{ address.userName }}</text></view>
        </view>
        <view class="row1-right">
          <view class="phone">电话：<text>{{ address.telNumber }}</text></view>
          <uni-icons type="arrowright" size="16"></uni-icons>
        </view>
      </view>
      <view class="row2">
        <view class="row2-left">收货地址：</view>
        <view class="row2-right">{{ addstr }}</view>
      </view>
    </view>
    
    <!-- 底部边框线 -->
    <image src="/static/cart_border@2x.png" class="address-border"></image>
  </view>
</template>


<script>
	
import { mapState, mapMutations, mapGetters } from 'vuex'

export default {
  name: "my-address",
  data() {
    return {
      // address: {}
    };
  },
  
  methods: {
	  
	  // 用户在点击选择收货地址的时候，触发函数chooseAddress方法，方法返回收货地址信息，然后调用updateAddress方法将信息参数succ携带过去，vuex就将数据进行存储和更新
	  
	  ...mapMutations('m_user', ['updateAddress']),
     async chooseAddress() {
         // 调用 uni.chooseAddress 方法，返回一个数据，如果成功第一个值err为null ,第二个值为一个对象，是返回的具体的地址参数
        const [err, succ] = await uni.chooseAddress().catch(err => err)
       
           // 用户成功的选择了收货地址
           if (err === null && succ.errMsg === 'chooseAddress:ok') {
             // 为 data 里面的收货地址对象赋值
             // this.address = succ
			 
			 this.updateAddress(succ)
           }
       },
	   
 
  },
  
  computed: {
	  
	  ...mapState('m_user', ['address']),
	  ...mapGetters('m_user', ['addstr'])  // 将下面的详细地址抽离到vuex中
    // 收货详细地址的计算属性 最后这个指定这个函数的返回值为拼接后的结果，在结构语法中就可以直接使用，因为会返回一个结果
    // addstr() { 
    //   if (!this.address.provinceName) return ''
    //   return this.address.provinceName + this.address.cityName + this.address.countyName + this.address.detailInfo
    // }
  },
  
  
}
</script>


<style lang="scss">
.address-border{
	display: block;
	width: 100%;
	height: 5px;
}
.address-choose-box {
	height: 90px;
	display: flex;
	justify-content: center;
	align-items: center;
}


// 渲染收货信息的盒子
.address-info-box {
  font-size: 12px;
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 5px;

  // 第一行
  .row1 {
    display: flex;
    justify-content: space-between;

    .row1-right {
      display: flex;
      align-items: center;

      .phone {
        margin-right: 5px;
      }
    }
  }

  // 第二行
  .row2 {
    display: flex;
    align-items: center;
    margin-top: 10px;

    .row2-left {
      white-space: nowrap;
    }
  }
}
</style>