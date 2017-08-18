(function(businessPosServer) {
	businessPosServer.configOption = {
		key: null
	};
	var serverUrl = yewuPosUrl; //baseDataUrl;

	//pos终端管理
	/*
	 * 功能：获取pos终端信息列表
	 */
	businessPosServer.GetTerminalList = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getTerminalList", jsonParam, calback);
		}
	};
	/*
	 * 功能：新增pos终端信息
	 */
	businessPosServer.InsertPosInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/insertPosInfo", jsonParam, calback);
		}
	};
	/*
	 * 功能：修改pos终端信息
	 */
	businessPosServer.UpdatePosInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/updatePosInfo", jsonParam, calback);
		}
	};
	/*
	 * 功能：获取pos终端信息
	 */
	businessPosServer.GetPosInfoById = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getPosInfo", jsonParam, calback);
		}
	};
	/*
	 * 功能：删除pos终端信息
	 */
	businessPosServer.DeletePosInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/deletePosInfo", jsonParam, calback);
		}
	};
	/*
	 * 功能：获取商助用户信息列表
	 */
	businessPosServer.GetAllpayShopuserList = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getAllpayShopuserList", jsonParam, calback);
		}
	};
	//业务签约
	/*
	 * 功能：新增业务签约信息
	 */
	businessPosServer.InsertBusinessInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/insertBusinessInfo", jsonParam, calback);
		}
	};
	/*
	 * 功能：获取业务签约信息
	 */
	businessPosServer.GetBusinessInfoByid = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getBusinessInfo", jsonParam, calback);
		}
	};
	/*
	 * 功能：删除业务签约信息
	 */
	businessPosServer.DeleteBusinessInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/deleteBusinessInfo", jsonParam, calback);
		}
	};
	/*
	 * 功能：获取业务列表信息
	 */
	businessPosServer.GetBusinessList = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getBusinessList", jsonParam, calback);
		}
	};
	/*
	 * 功能：新增终端菜单配置信息
	 */
	businessPosServer.InsertPosMenuSetInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/InsertPosMenuSetInfo", jsonParam, calback);
		}
	};
	/*
	 * 功能：获取终端菜单配置信息
	 */
	businessPosServer.GetPosMenuSetInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getPosMenuSetInfo", jsonParam, calback);
		}
	};	
	/*
	 * 功能：导出pos终端信息列表
	 */
	businessPosServer.ExportTerminalList = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/exportTerminalList", jsonParam, calback);
		}
	};
	/*
	 * 功能：导出业务签约信息列表
	 */
	businessPosServer.ExportBugsinessList = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/exportBugsinessList", jsonParam, calback);
		}
	};
	/*
	 * 功能：获取商助用户信息列表
	 */
	businessPosServer.GetAllpayShopuserList = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getAllpayShopuserList", jsonParam, calback);
		}
	};
	/*
	 * 功能：关联pos批量导入信息
	 */
	businessPosServer.ImportSuperPosInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/importSuperPosInfo", jsonParam, calback);
		}
	};
	/*
	 * 功能：软pos批量导入信息
	 */
	businessPosServer.ImportPosInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/importPosInfo", jsonParam, calback);
		}
	};
	/*
	 * 功能：Pos创建追加批量导入信息
	 */
	businessPosServer.ImportAppendPosInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/importAppendPosInfo", jsonParam, calback);
		}
	};
	window.businessPosServer = businessPosServer;
})(window.businessPosServer || {});