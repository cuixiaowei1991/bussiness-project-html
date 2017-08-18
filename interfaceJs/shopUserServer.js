(function(shopUserServer) {
	//获取用户信息
	shopUserServer.configOption = {
		key: null
	};
	var serverUrl = quanxianShopUrl; //baseDataUrl;
	
	//商助权限
	/*
	 * 功能：获取商助菜单信息列表
	 */
	shopUserServer.GetShopMenuInfoList = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getShopMenuList", jsonParam, callback);
		}
	};
	/*
	 * 功能：新增商助菜单信息
	 */
	shopUserServer.InsertShopMenuInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/insertShopMenu", jsonParam, callback);
		}
	};
	/*
	 * 功能：修改商助菜单信息
	 */
	shopUserServer.UpdateShopMenuInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/updateShopMenu", jsonParam, callback);
		}
	};
	/*
	 * 功能：获取商助菜单信息
	 */
	shopUserServer.GetShopMenuInfoById = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getShopMenuInfo", jsonParam, callback);
		}
	};
	/*
	 * 功能：删除商助菜单信息
	 */
	shopUserServer.DeleteShopMenuInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/deleteShopMenu", jsonParam, callback);
		}
	};
	//商助资源管理
	/*
	 * 功能：获取商助资源管理信息列表
	 */
	shopUserServer.GetShopFuncInfoList = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getShopFuncList", jsonParam, callback);
		}
	};
	/*
	 * 功能：新增商助功能资源信息
	 */
	shopUserServer.InsertShopFuncInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/insertShopFunc", jsonParam, callback);
		}
	};
	/*
	 * 功能：修改商助功能资源信息
	 */
	shopUserServer.UpdateShopFuncInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/updateShopFunc", jsonParam, callback);
		}
	};
	/*
	 * 功能：删除商助功能资源信息
	 */
	shopUserServer.DeleteShopFuncInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/deleteShopFunc", jsonParam, callback);
		}
	};
	/*
	 * 功能：获取商助功能资源信息
	 */
	shopUserServer.GetShopFuncInfoById = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getShopFuncInfo", jsonParam, callback);
		}
	};
	/*
	 * 功能：获取商户所有菜单及功能信息列表（已启用状态）
	 */
	shopUserServer.GetShopMenuFuncInfoList = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getMenuFuncList", jsonParam, callback);
		}
	};
	/*
	 * 功能：新增商户配置信息
	 */
	shopUserServer.InsertMerchantSetInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/InsertMerchantSetInfo", jsonParam, calback);
		}
	};
	/*
	 * 功能：删除商户配置信息
	 */
	shopUserServer.DeleteMerchantSet = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/deleteMerchantSet", jsonParam, calback);
		}
	};	
	
	
	/*
	 * 功能：获取商户配置信息
	 */
	shopUserServer.GetMerchantSetInfoById = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getMerchantSetInfo", jsonParam, calback);
		}
	};
	/*
	 * 功能：获取用户信息列表
	 */
	shopUserServer.GetShopUserInfoList = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getUserList", jsonParam, calback);
		}
	};
	/*
	 * 功能：新增用户信息
	 */
	shopUserServer.InsertShopUserInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/insertUser", jsonParam, calback);
		}
	};
	/*
	 * 功能：新增用户信息
	 */
	shopUserServer.UpdateShopUserInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/updateUser", jsonParam, calback);
		}
	};
	/*
	 * 功能：删除用户信息
	 */
	shopUserServer.DeleteShopUser = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/deleteUser", jsonParam, calback);
		}
	};
	/*
	 * 功能：获取用户信息
	 */
	shopUserServer.GetShopUserInfoById = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getUserInfo", jsonParam, calback);
		}
	};	
	
	window.shopUserServer = shopUserServer;
})(window.shopUserServer || {});