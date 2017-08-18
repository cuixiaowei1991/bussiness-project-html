(function(wftInfoServer) {
	//获取用户信息
	wftInfoServer.configOption = {
		key: null
	};
	var serverUrl = wftUrl;

	/*
	 * 功能：获取威富通商户信息列表
	 */
	wftInfoServer.GetWftShopInfoList = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getWftShopInfoList", jsonParam, callback);
		}
	};
	/*
	 * 功能：新增威富通商户信息
	 */
	wftInfoServer.InsertWftShopInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/insertWftShopInfo", jsonParam, callback);
		}
	};
	/*
	 * 功能：修改威富通商户信息
	 */
	wftInfoServer.UpdateWftShopInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/updateWftShopInfo", jsonParam, callback);
		}
	};
	/*
	 * 功能：获取威富通商户信息
	 */
	wftInfoServer.GetWftShopInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getWftShopInfo", jsonParam, callback);
		}
	};
	/*
	 * 功能：获取威富通联行号信息列表
	 */
	wftInfoServer.GetWftBankCodeList = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getWftBankCodeList", jsonParam, callback);
		}
	};
	/*
	 * 功能：推送威富通支付类型信息
	 */
	wftInfoServer.PushWftPayTypeInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/pushWftPayTypeInfo", jsonParam, callback);
		}
	};
	/*
	 * 功能：获取威富通支付类型列表
	 */
	wftInfoServer.GetWftPayTypeList = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getWftPayTypeList", jsonParam, callback);
		}
	};
	/*
	 * 功能：同步威富通账户信息
	 */
	wftInfoServer.SynWftAccountInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/synWftAccountInfo", jsonParam, callback);
		}
	};
	/*
	 * 功能：修改威富通账户信息
	 */
	wftInfoServer.UpdateWftAccountInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/updateWftAccountInfo", jsonParam, callback);
		}
	};
	/*
	 * 功能：修改威富通费率信息
	 */
	wftInfoServer.UpdateWftBillInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/updateWftBillInfo", jsonParam, callback);
		}
	};
	/*
	 * 功能：推送kafka威富通信息
	 */
	wftInfoServer.PushKafkaWftInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/pushKafkaWftInfo", jsonParam, callback);
		}
	};
	/*
	 * 功能：修改威富通状态信息
	 */
	wftInfoServer.UpdateWftShopStateInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/updateWftShopStateInfo", jsonParam, callback);
		}
	};

	window.wftInfoServer = wftInfoServer;
})(window.wftInfoServer || {});