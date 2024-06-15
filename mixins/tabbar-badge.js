	import { mapGetters } from 'vuex'
	export default {
		computed: {
			...mapGetters('m_cart', ['total'])
		},
		
		// 一进页面就调用方法
		onShow() {
			 this.setBadge()
		},
		
		data() {
			return {
				
			};
		},
		
		methods: {
			setBadge() {
				uni.setTabBarBadge({
					index: 2,
					text: this.total + ''
				})
			}
		}
	}