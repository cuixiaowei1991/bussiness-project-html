(function(systemUserService) {
	//获取用户信息
	systemUserService.configOption = {
		key: null
	};
	var serverUrl = quanxianUrl; //baseDataUrl;
	/*
	 * 功能：获取用户信息列表
	 */
	systemUserService.GetAllpayUserInfoList = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getUserList", jsonParam, callback);
		}
	};
	/*
	 * 功能：新增用户信息
	 */
	systemUserService.InsertAllpayUserInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/insertUser", jsonParam, callback);
		}
	};
	/*
	 * 功能：修改用户信息
	 */
	systemUserService.UpdateAllpayUserInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/updateUser", jsonParam, callback);
		}
	};
	/*
	 * 功能：重置用户密码
	 */
	systemUserService.ResetAllpayUserPassword = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/reseUserPassword", jsonParam, callback);
		}
	};
	/*
	 * 功能：删除用户信息
	 */
	systemUserService.DeleteAllpayUser = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/deleteUser", jsonParam, callback);
		}
	};
	/*
	 * 功能：获取用户信息
	 */
	systemUserService.GetAllpayUserInfoById = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getUserInfo", jsonParam, callback);
		}
	};

	//角色管理
	/*
	 * 功能：获取角色信息列表
	 */
	systemUserService.GetAllpayRoleInfoList = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getRoleList", jsonParam, callback);
		}
	};
	/*
	 * 功能：新建角色信息
	 */
	systemUserService.InsertRoleInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/insertRole", jsonParam, callback);
		}
	};
	/*
	 * 功能：修改角色信息
	 */
	systemUserService.UpdateRoleInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/updateRole", jsonParam, callback);
		}
	};
	/*
	 * 功能：删除角色信息
	 */
	systemUserService.DeleteRoleInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/deleteRole", jsonParam, callback);
		}
	};
	/*
	 * 功能：获取角色信息
	 */
	systemUserService.GetAllpayRoleInfoById = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getRoleInfo", jsonParam, callback);
		}
	};

	//资源管理
	/*
	 * 功能：获取资源管理信息列表
	 */
	systemUserService.GetAllpayFuncInfoList = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getFuncList", jsonParam, callback);
		}
	};
	/*
	 * 功能：新增功能资源信息
	 */
	systemUserService.InsertFuncInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/insertFunc", jsonParam, callback);
		}
	};
	/*
	 * 功能：修改功能资源信息
	 */
	systemUserService.UpdateFuncInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/updateFunc", jsonParam, callback);
		}
	};
	/*
	 * 功能：删除功能资源信息
	 */
	systemUserService.DeleteFuncInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/deleteFunc", jsonParam, callback);
		}
	};
	/*
	 * 功能：获取功能资源信息
	 */
	systemUserService.GetAllpayFuncInfoById = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getFuncInfo", jsonParam, callback);
		}
	};
	/*
	 * 功能：获取所有菜单及功能信息列表（已启用状态）
	 */
	systemUserService.GetMenuFuncInfoList = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getMenuFuncList", jsonParam, callback);
		}
	};

	//组织机构管理
	/*
	 * 功能：获取组织机构信息列表
	 */
	systemUserService.GetOrganizationInfoList = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/geOrganizationList", jsonParam, callback);
		}
	};
	/*
	 * 功能：新增组织机构信息
	 */
	systemUserService.InsertOrganizationInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/insertOrganization", jsonParam, callback);
		}
	};

	/*
	 * 功能：修改组织机构信息
	 */
	systemUserService.UpdateOrganizationInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/updateOrganization", jsonParam, callback);
		}
	};
	/*
	 * 功能：删除组织机构信息
	 */
	systemUserService.DeleteOrganizationInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/deleteOrganization", jsonParam, callback);
		}
	};
	/*
	 * 功能：获取组织机构信息
	 */
	systemUserService.GetOrganizationInfoById = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getOrganizationInfo", jsonParam, callback);
		}
	};

	//系统管理
	/*
	 * 功能：获取系统信息列表
	 */
	systemUserService.GetSystemInfoList = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getSystemList", jsonParam, callback);
		}
	};
	/*
	 * 功能：新增系统信息
	 */
	systemUserService.InsertSystemInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/insertSystem", jsonParam, callback);
		}
	};
	/*
	 * 功能：修改系统信息
	 */
	systemUserService.UpdateSystemInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/updateSystem", jsonParam, callback);
		}
	};
	/*
	 * 功能：删除系统信息
	 */
	systemUserService.DeleteSystemInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/deleteSystem", jsonParam, callback);
		}
	};
	/*
	 * 功能：获取系统信息
	 */
	systemUserService.GetSystemInfoById = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getSystemInfo", jsonParam, callback);
		}
	};
	/*
	 * 功能：获取菜单信息列表
	 */
	systemUserService.GetMenuInfoList = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getMenuList", jsonParam, callback);
		}
	};
	/*
	 * 功能：新增菜单信息
	 */
	systemUserService.InsertMenuInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/insertMenu", jsonParam, callback);
		}
	};
	/*
	 * 功能：修改菜单信息
	 */
	systemUserService.UpdateMenuInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/updateMenu", jsonParam, callback);
		}
	};
	/*
	 * 功能：获取菜单信息
	 */
	systemUserService.GetMenuInfoById = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getMenuInfo", jsonParam, callback);
		}
	};
	/*
	 * 功能：删除菜单信息
	 */
	systemUserService.DeleteMenuInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/deleteMenu", jsonParam, callback);
		}
	};

	//用户登录
	systemUserService.UserLoginInfo = function(jsonParam, callback) {
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/userLogin", jsonParam, callback);
		}
	};

	window.systemUserService = systemUserService;
})(window.systemUserService || {});