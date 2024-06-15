<template>
	<view>
		<view class="search-box">
			<uni-search-bar placeholder="请输入搜索内容" :radius="100" @input="input" cancelButton="none" focus="true" ></uni-search-bar>
		</view>
		
		<!-- 搜索建议表 -->
		<view class="sugg-list" v-if="searchResults.length !==0">
			<view class="sugg-item" v-for="(item, index) in searchResults" :key="index" @click="gotoDetail(item)" >
				<view class="goods-name">{{ item.goods_name}}</view>
				<uni-icons type="arrowright" size="16"></uni-icons>
			</view>
		</view>
		
		<!-- 搜索历史 -->
		<view class="history-box" v-else>
			<!-- 标题区 -->
			<view class="history-title">
				<text>搜索历史</text>
				<uni-icons @click="clean" type="trash" size="17"></uni-icons>
			</view>
			<!-- 列表区 -->
			<view class="history-list">
				<uni-tag @click="gotoGoodsList(item)" :text="item" v-for="(item, index) in historyList" :key="index"></uni-tag>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				timer: null,
				kw: "",
				// 搜索的结果列表
				searchResults: [],
				// 搜索历史的数组
				historyList: []
				
			};
		},
		onLoad() {
			this.historyList = JSON.parse(uni.getStorageSync('kw') || '[]')
		},
		
		methods: {
			input(e) {
				clearTimeout(this.timer)
				
				// 防抖处理
				this.timer = setTimeout(() => {
					this.kw = e
					this.getSearchList()
				}, 700)
			},
			async getSearchList() {
				// 判断搜索关键词是否为空
				if(this.kw.length === 0) {
					this.searchResults = []
					return
				}
				const {data: res} = await uni.$http.get('/api/public/v1/goods/qsearch', {query: this.kw })
				if(res.meta.status !== 200) return uni.$showMsg()
				
				this.searchResults = res.message
				
				this.saveSearchHistory()
			},
			
			// 点击搜索到的关键词跳转
			gotoDetail(item) {
				uni.navigateTo({
					url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
				})
			},
			
			// 存储搜索历史记录
			saveSearchHistory() {
				// this.historyList.push(this.kw)
				
				// 解决搜索关键词存储重复的问题
				const set = new Set(this.historyList)
				set.delete(this.kw)
				set.add(this.kw)
				this.historyList = Array.from(set)
				
				// 持久化的存储搜素历史
				uni.setStorageSync('kw', JSON.stringify(this.historyList))
				
			},
			
			// 清空搜索历史
			clean() {
				this.historyList = []
				uni.setStorageSync('kw', '[]')
			},
		
			// 点击搜索出的列表跳转到分包里的商品列表页面
			gotoGoodsList(kw) {
				uni.navigateTo({
					url: '/subpkg/goods_list/goods_list?query=' + kw
				})
			}
			
		},
		// 计算属性，将搜索先后顺序矫正
		computed: {
			histories() {
				// 把里面的元素进行反转
				return [...this.historyList.reverse()]
			}
		}
	}
</script>

<style lang="scss">
.search-box {
	position: sticky;
	top: 0;
	z-index: 999;
}
.sugg-list {
	padding: 0 5px;
	
	.sugg-item{
		display: flex;
		align-items: center;
		justify-content: space-between;
		font-size: 12px;
		padding: 13px 0;
		border-bottom: 1px solid #efefef;
		 
		
		.goods-name{
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			
		}
	}
}
.history-box{
	padding: 0 5px;
	
	.history-title{
		display: flex;
		justify-content: space-between;
		height: 40px;
		align-items: center;
		font-size: 13px;
		border-bottom: 1px solid #efefef;
	}
	.history-list{
		display: flex;
		flex-wrap: wrap;
		
		.uni-tag{
			margin-top: 5px;
			margin-right: 5px;
		}
	}
}
</style>
