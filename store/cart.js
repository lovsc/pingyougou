export default {
	namespaced: true,
	
	// 这里state写为一个箭头函数，是规范模块化管理，确保每个模块返回的都是独立的，而不是一个单纯的普通对象 const state = {}
	state: () => ({
		// 购物车的数组，用来存储购物车中每个商品的信息对象
		// 每个商品的信息对象，都包含如下6个属性
		// { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
		// 从本地获取添加的购物车数据
		cart: JSON.parse(uni.getStorageSync('cart') || '[]')
	}),
	
	mutations: {
		// 方法接收的第一个参数为state固定的，第二个是我们接收的商品信息对象，循环state中的数组cart，判断每一项的goods_id等于接收过来goods_id
		addToCart(state, goods) {
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			// 如果不等于，就将传过来的商品信息追加到数组cart中
			if (!findResult) {
				state.cart.push(goods)
			}else {
				findResult.goods_count++
			}
			
			// 当商品被添加到购物车之后，就调用saveToStorage方法进行持久化存储到本地
			// commit触发mutations中的方法，因为在cart.js中我们开启了命名空间，所以提交时前面要加上模块的名字
			this.commit('m_cart/saveToStorage')
		},
		
		// 数据持久化，将购物车信息持久存储在本地
		saveToStorage(state) {
			uni.setStorageSync('cart', JSON.stringify(state.cart))
		},
		
		
		// 更新是商品购物车中商品选中的状态
		updateGoodsState(state, goods) {
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			
			if(findResult) {
				findResult.goods_state = goods.goods_state
				
				this.commit('m_cart/saveToStorage')
			}
		},
		
		// 更新商品购物车选中数量
		updateGoodsCount(state, goods) {
			const findResult = state.cart.find(x => x.goods_id === goods.goods_id)
			if (findResult) {
				findResult.goods_count = goods.goods_count
				
				this.commit('m_cart/saveToStorage')
			}
		},
		
		// 删除购物车商品
		removeGoodsById(state, goods_id) {
			state.cart = state.cart.filter(x => x.goods_id !== goods_id)
			this.commit('m_cart/saveToStorage')
		},
		
		// 更新所有商品的勾选状态
		updateAllGoodsState(state, newState) {
			// 遍历状态中的数组，为每一项的状态赋一个新值
			state.cart.forEach(x => x.goods_state = newState)
			this.commit('m_cart/saveToStorage')
		}
	},
	
	// 对state中的数据进行计算，相当于.vue中的计算属性
	getters: {
		// 购物车中所以商品的总数量
		total(state) {
			let c = 0
			state.cart.forEach(x => c += x.goods_count)
			return c
		},
		
		// 动态渲染购物车商品的数量
		checkedCount(state) {
			// 返回一个goods_state为true的数组
			// reduce 第一个参数是一个回调函数，函数的第一个参数total为一个累加器，item表示当前数组也就是filter返回的数组的每一项
			// 将没一轮的累加赋值给total, reduce方法的第二个参数为一个初始值
			return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
		},
		
		// 计算已经勾选商品的总价
		checkedGoodsAmount(state) {
			return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count * item.goods_price, 0).toFixed(2)
		}
	}
}