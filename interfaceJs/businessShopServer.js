(function(businessShopServer) {
	businessShopServer.configOption = {
		key: null
	};
	var serverUrl = yewuShopUrl; //baseDataUrl;

	/*
	 * 功能：获取商户信息
	 */
	businessShopServer.GetMerchantList = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getMerchantList", jsonParam, calback);
		}
	};
	/*
	 * 功能：新增商户信息
	 */
	businessShopServer.InsertMerchantInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/insertMerchant", jsonParam, calback);
		}
	};
	/*
	 * 功能：修改商户信息
	 */
	businessShopServer.UpdateMerchantUserInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/updateMerchant", jsonParam, calback);
		}
	};
	/*
	 * 功能：获取商户信息
	 */
	businessShopServer.GetMerchantInfoById = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getMerchantInfo", jsonParam, calback);
		}
	};
	/*
	 * 功能：删除商户信息
	 */
	businessShopServer.DeleteMerchant = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/deleteMerchant", jsonParam, calback);
		}
	};
	/*
	 * 功能：修改商户状态信息
	 */
	businessShopServer.UpdateMerchantStatus = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/updateMerchantStatus", jsonParam, calback);
		}
	};

	//商户配置信息
	/*
	 * 功能：获取商户已开通业务信息
	 */
	businessShopServer.GetMerchantOpenChannelList = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getOpenChannelInfo", jsonParam, calback);
		}
	};
	/*
	 * 功能：获取商户企业信息
	 */
	businessShopServer.GetComuserInfoByMerchantId = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getComuserInfo", jsonParam, calback);
		}
	};

	//门店管理
	/*
	 * 功能：获取门店列表
	 */
	businessShopServer.GetShoreList = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getShoreList", jsonParam, calback);
		}
	};
	/*
	 * 功能：获取门店信息
	 */
	businessShopServer.GetShoreInfoById = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getShoreInfo", jsonParam, calback);
		}
	};
	/*
	 * 功能：新增门店信息
	 */
	businessShopServer.InsertShoreInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/insertShoreInfo", jsonParam, calback);
		}
	};
	/*
	 * 功能：修改门店信息
	 */
	businessShopServer.UpdateShoreInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/updateShoreInfo", jsonParam, calback);
		}
	};
	/*
	 * 功能：删除门店信息
	 */
	businessShopServer.DeleteShoreInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/deleteShoreInfo", jsonParam, calback);
		}
	};
	/*
	 * 功能：门店、商户及pos终端信息批量导入
	 */
	businessShopServer.importMerchantInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/importMerchantInfo", jsonParam, calback);
		}
	};
	/*
	 * 功能：导出商户信息列表
	 */
	businessShopServer.ExportGetMerchantList = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/merchantExcelExport", jsonParam, calback);
		}
	};
	/*
	 * 功能：导出门店信息列表
	 */
	businessShopServer.ExportGetShoreList = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/storeExcelExport", jsonParam, calback);
		}
	};
	/*
	 * 功能：修改商户信息列表
	 */
	businessShopServer.UpdateShopUserInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/updateShopInfo", jsonParam, calback);
		}
	};
	/*
	 * 功能：新增商户企业信息
	 */
	businessShopServer.InsertCompanyInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/insertCompanyInfo", jsonParam, calback);
		}
	};	
	/*
	 * 功能：新增商户pos小票设置信息
	 */
	businessShopServer.InsertShopPosSetInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/insertShopPosSetInfo", jsonParam, calback);
		}
	};	
	/*
	 * 功能：获取商户pos小票设置信息
	 */
	businessShopServer.GetShopPosSetInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getShopPosSetInfo", jsonParam, calback);
		}
	};		
	window.businessShopServer = businessShopServer;
})(window.businessShopServer || {});