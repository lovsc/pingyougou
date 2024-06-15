export default {
	namespaced: true,
	
	state: () => ({
		address: JSON.parse(uni.getStorageSync('address') || '{}'),
		
		token: uni.getStorageSync('token') || '',
		
		userinfo: JSON.parse(uni.getStorageSync('userinfo') || '{}')
	}),
	
	
	mutations: {
		// 更新收货地址
		updateAddress(state, address) {
			state.address = address
			// 2. 通过 this.commit() 方法，调用 m_user 模块下的 saveAddressToStorage 方法将 address 对象持久化存储到本地
			this.commit('m_user/saveAddressToStorage')
		},
		
		// 本地持久化存储
		saveAddressToStorage(state) {
		    uni.setStorageSync('address', JSON.stringify(state.address))
			
		},
		
		// 获取用户信息
		updateUserInfo(state, userinfo) {
			state.userinfo = userinfo
			
			this.commit('m_user/saveUserInfoToStorage')
		},
		
		saveUserInfoToStorage(state) {
			uni.setStorageSync('userinfo', JSON.stringify(state.userinfo))
		},
		
		
		// 更新token
		updateToken(state, token) {
			state.token = token
			uni.setStorageSync('token', token)
		}
	},
	
	getters: {
		
		 // 收货详细地址的计算属性
		  addstr(state) {
		    if (!state.address.provinceName) return ''
		
		    // 拼接 省，市，区，详细地址 的字符串并返回给用户
		    return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
		  }
		
	}
	
}