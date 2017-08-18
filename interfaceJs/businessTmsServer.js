(function(businessTmsServer) {
	businessTmsServer.configOption = {
		key: null
	};
	var serverUrl = yewuTmsUrl; //baseDataUrl;

	/*
	 * 功能：获取TMS信息
	 */
	businessTmsServer.GetAllpayTMSList = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getAllpayTMSList", jsonParam, calback);
		}
	};
	/*
	 * 功能：新增TMS信息
	 */
	businessTmsServer.InserAllpayTMS = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/insertAllpayTMS", jsonParam, calback);
		}
	};
	/*
	 * 功能：修改TMS信息
	 */
	businessTmsServer.UpdateAllpayTMS = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/updateAllpayTMS", jsonParam, calback);
		}
	};
	/*
	 * 功能：获取TMS信息
	 */
	businessTmsServer.GetAllpayTMS = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getAllpayTMS", jsonParam, calback);
		}
	};	
	/*
	 * 功能：删除TMS信息
	 */
	businessTmsServer.DeleteAllpayTMS = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/deleteAllpayTMS", jsonParam, calback);
		}
	};		
	window.businessTmsServer = businessTmsServer;
})(window.businessTmsServer || {});