// 1. 导入 Vue 和 Vuex
import Vue from 'vue'
import Vuex from 'vuex'
// cart.js里面有我们购物车的数据，我们引用它的数据并命名为moduleCart
import moduleCart from '@/store/cart.js'
import moduleUser from '@/store/user.js'

// 2. 将 Vuex 安装为 Vue 的插件
Vue.use(Vuex)

// 3. 创建 Store 的实例对象
const store = new Vuex.Store({
  // TODO：挂载 store 模块
  modules: {
	  // 上面导入文件之后，还需要在store.js入口文件的 模块中进行声明或注册，命名空间 - 'my_cart'
	  'm_cart': moduleCart,
	  'm_user': moduleUser
  },
})

// 4. 向外共享 Store 的实例对象
export default store