(function(agentUserService) {
	//获取用户信息
	agentUserService.configOption = {
		key: null
	};
	var serverUrl = quanxianAgent; //baseDataUrl;

	//代理商权限
	/*
	 * 功能：获取代理商菜单信息列表
	 */
	agentUserService.GetAgentMenuInfoList = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getAgentMenuList", jsonParam, callback);
		}
	};
	/*
	 * 功能：新增代理商菜单信息
	 */
	agentUserService.InsertAgentMenuInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/insertAgentMenu", jsonParam, callback);
		}
	};
	/*
	 * 功能：修改代理商菜单信息
	 */
	agentUserService.UpdateAgentMenuInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/updateAgentMenu", jsonParam, callback);
		}
	};
	/*
	 * 功能：获取代理商菜单信息
	 */
	agentUserService.GetAgentMenuInfoById = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getAgentMenuInfo", jsonParam, callback);
		}
	};
	/*
	 * 功能：删除代理商菜单信息
	 */
	agentUserService.DeleteAgentMenuInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/deleteAgentMenu", jsonParam, callback);
		}
	};
	
	//代理商资源管理
	/*
	 * 功能：获取代理商资源管理信息列表
	 */
	agentUserService.GetAgentFuncInfoList = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getAgentFuncList", jsonParam, callback);
		}
	};
	/*
	 * 功能：新增代理商功能资源信息
	 */
	agentUserService.InsertAgentFuncInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/insertAgentFunc", jsonParam, callback);
		}
	};
	/*
	 * 功能：修改代理商功能资源信息
	 */
	agentUserService.UpdateAgentFuncInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/updateAgentFunc", jsonParam, callback);
		}
	};
	/*
	 * 功能：删除代理商功能资源信息
	 */
	agentUserService.DeleteAgentFuncInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/deleteAgentFunc", jsonParam, callback);
		}
	};
	/*
	 * 功能：获取代理商功能资源信息
	 */
	agentUserService.GetAgentFuncInfoById = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getAgentFuncInfo", jsonParam, callback);
		}
	};
	/*
	 * 功能：获取代理商所有菜单及功能信息列表（已启用状态）
	 */
	agentUserService.getMenuFuncInfoList = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getMenuFuncList", jsonParam, callback);
		}
	};
	/*
	 * 功能：新增代理商配置信息
	 */
	agentUserService.InsertAgentSetInfo = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/insertAgentSetInfo", jsonParam, calback);
		}
	};
	/*
	 * 功能：获取代理商配置信息
	 */
	agentUserService.GetAgentSetInfoById = function(jsonParam, calback) {
		if(typeof calback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getAgentSetInfo", jsonParam, calback);
		}
	};

	window.agentUserService = agentUserService;
})(window.agentUserService || {});