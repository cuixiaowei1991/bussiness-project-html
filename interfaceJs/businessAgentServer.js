(function(businessAgentServer) {
	businessAgentServer.configOption = {
		key: null
	};
	var serverUrl = yewuAgentUrl; //baseDataUrl;

	//代理商合作方管理
	/*
	 * 功能：获取代理商信息列表
	 */
	businessAgentServer.GetAgentList = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getAgentList", jsonParam, calback);
		}
	};
	/*
	 * 功能：根据分公司ID，获取对应的代理商
	 */
	businessAgentServer.GetAgents = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getAgents", jsonParam, calback);
		}
	};
	
	/*
	 * 功能：新增代理商信息
	 */
	businessAgentServer.InsertAgentInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/insertAgent", jsonParam, calback);
		}
	};
	/*
	 * 功能：修改代理商信息
	 */
	businessAgentServer.UpdateAgentInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/updateAgent", jsonParam, calback);
		}
	};
	/*
	 * 功能：删除代理商信息
	 */
	businessAgentServer.DeleteAgentInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/deleteAgentInfo", jsonParam, calback);
		}
	};
	/*
	 * 功能：获取代理商信息
	 */
	businessAgentServer.GetAgentInfoById = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getAgentInfo", jsonParam, calback);
		}
	};

	/*
	 * 功能：导出代理商信息列表
	 */
	businessAgentServer.ExportAgentList = function(jsonParam, calback) {
		var temp = $.param(jsonParam);
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/outDataAgents", jsonParam, calback);
		}
//		window.open(serverUrl + "/outDataAgents?" + temp, "导出Excel文件", "", false);
	};


    //pos合作方管理
	/*
	 * 功能：获取pos合作方信息列表
	 */
	businessAgentServer.GetPosParterList = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getPosParterList", jsonParam, calback);
		}
	};
	/*
	 * 功能：新增pos合作方信息
	 */
	businessAgentServer.InserPosParterInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/insertPosParter", jsonParam, calback);
		}
	};
	/*
	 * 功能：修改pos合作方信息
	 */
	businessAgentServer.UpdatePosParterInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/updatePosParter", jsonParam, calback);
		}
	};
	/*
	 * 功能：获取pos合作方信息
	 */
	businessAgentServer.GetPosParterInfoById = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getPosParterInfo", jsonParam, calback);
		}
	};
	/*
	 * 功能：删除pos合作方信息
	 */
	businessAgentServer.DeletePosParterInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/deletePosParterInfo", jsonParam, calback);
		}
	};
	/*
	 * 功能：导出pospos合作方信息列表
	 */
	businessAgentServer.ExportPosParterList = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/outDataPosParters", jsonParam, calback);
		}
	};	
	window.businessAgentServer = businessAgentServer;
})(window.businessAgentServer || {});