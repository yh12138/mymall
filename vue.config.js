const path = require("path");
function resolve(dir) {
	return path.join(__dirname, dir);
}
module.exports = {
	chainWebpack: (config) => {
		config.resolve.alias
			.set("assets", resolve("./src/assets"))
			.set("common", resolve("./src/common"))
			.set("components", resolve("./src/components"))
			.set("network", resolve("./src/network"))
			.set("views", resolve("./src/views"));
	},
  devServer: {
    // 项目运行时候的端口号
    port: 8081,
    open: true
  }
	// configureWebpack:{
	// 	resolve:{
	// 		alias:{
	// 			'assets':'@/assets',
	// 			'common':'@/common',
	// 			'components':'@/components',
	// 			'network':'@/network',
	// 			'views':'@/views'
	// 		}
	// 	}
	// }
};
