<template>
	 <view>
	    <view class="goods-list">
	      <view v-for="(goods, i) in goodsList" :key="i" @click="gotoDetail(goods)">
			<my-goods :goods="goods"></my-goods>
	      </view>
	    </view>
	  </view>
</template>

<script>
	export default {
		data() {
			return {
				// 请求参数对象
				queryObj: {
					query: '',
					cid: '',
					pagenum: 1,
					pagesize: 10
				},
				
				goodsList: [],
				total: 0,
				// 节流阀
				isloading: false
			};
		},
		
		// 在首页点击商品，跳转到商品列表页面，用options在页面一加载的时候接收点击携带的参数
		onLoad(options) {
			// console.log(options)
			this.queryObj.query = options.query || ''
			this.queryObj.cid = options.cid || ''
			
			this.getGoodsList()
		},
		
		methods: {
			async getGoodsList(cb) {
				// 打开节流阀
				this.isloading = true
				const {data: res} = await uni.$http.get('/api/public/v1/goods/search', this.queryObj)
				
				// 关闭节流阀
				this.isloading = false
				cb && cb()
				if(res.meta.status !== 200) return uni.$showMsg()
				
				// this.goodsList = res.message.goods
				this.goodsList = [...this.goodsList, ...res.message.goods]
				this.total = res.message.total
				
			},
			
			// 点击列表跳转商品详情页面
			gotoDetail(goods) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + goods.goods_id
				})
			}
		},
		
		// 上拉加载更多,当页面滚动到底部时执行的加载更多方法
		onReachBottom() {
			// 数据加载到最后 一条时关闭请求
			if(this.queryObj.pagenum*this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕')
			// 当前正在请求其他数据
			if(this.isloading) return
			// 让页码值自增
			this.queryObj.pagenum++
			this.getGoodsList()
		},
		
		// 下拉刷新
		onPullDownRefresh() {
			// 重置关键数据，重新发起请求
			this.queryObj.pagenum = 1
			this.total = 0
			this.isloading = false
			this.goodsList = []
			
			this.getGoodsList(() => uni.stopPullDownRefresh())
		}
	}
</script>

<style lang="scss">

</style>
