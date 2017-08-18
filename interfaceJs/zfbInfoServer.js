(function(zfbInfoServer) {

	zfbInfoServer.configOption = {
		key: null
	};
	var serverUrl = zfbUrl;
	
	/*
	 * 功能：获取支付宝口碑信息列表
	 */
	zfbInfoServer.GetZfbShopInfoList = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getZfbShopInfoList", jsonParam, callback);
		}
	};	
	/*
	 * 功能：新增支付宝口碑信息
	 */
	zfbInfoServer.InsertZfbShopInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/insertZfbShopInfo", jsonParam, callback);
		}
	};	
	/*
	 * 功能：获取支付宝口碑信息
	 */
	zfbInfoServer.GetZfbShopInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getZfbShopInfo", jsonParam, callback);
		}
	};	
	/*
	 * 功能：修改支付宝口碑信息
	 */
	zfbInfoServer.UpdateZfbShopInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/updateZfbShopInfo", jsonParam, callback);
		}
	};	
	/*
	 * 功能：上传支付宝口碑图片信息
	 */
	zfbInfoServer.UploadZfbImgInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/uploadZfbImgInfo", jsonParam, callback);
		}
	};		
	window.zfbInfoServer = zfbInfoServer;
})(window.zfbInfoServer || {});