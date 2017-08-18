$(document).ready(function() {
	//获取角色下拉框数据
	GetAllpayRoleInfoList();

	$(function() {
		fromValidate();
		$("#Determine").click(function() {
			if (fromValidate().form()) {
				event.preventDefault();
				InsertAllpayUserInfo();
			};
		});
	});

});
/*
 * 创建日期：2016-11-21
 * 功能：新增用户信息
 * 创建人：shiyina
 */
function InsertAllpayUserInfo() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "userNickName", $("#userNickName").val()); //账号(昵称)
	jsonstr = dataHelper.setJson(jsonstr, "userName", $("#userName").val()); //姓名(用户名称)
	jsonstr = dataHelper.setJson(jsonstr, "userPhone", $("#userPhone").val()); //手机号
	jsonstr = dataHelper.setJson(jsonstr, "userRoleId", $(".userRoleId").attr('data-value')); //角色ID
	jsonstr = dataHelper.setJson(jsonstr, "userOrganizationId", $(".userOrganizationId").attr('data-value')); //组织机构ID
	var userStart;
	if ($("#userIsStart").is(":checked")) {
		userStart = '1';
	} else {
		userStart = '2';
	}
	jsonstr = dataHelper.setJson(jsonstr, "userIsStart", userStart); //是否启用1--启用 2--禁用
	jsonstr = dataHelper.setJson(jsonstr, "userPassword", '111111'); //用户密码
	jsonParam.jsonStr = jsonstr;
	systemUserService.InsertAllpayUserInfo(jsonParam, callback_InsertAllpayUserInfo);
};

function callback_InsertAllpayUserInfo(data) {
	console.log(data);
	if (data == undefined || data.rspCode == null || data.rspCode != "000") {
		alert(data.rspDesc);
	} else {
		controlsHelper.alert("添加用户信息成功", "20%");
		location.href = "UserList.html";
	}
};
/*
 * 创建日期：2016-11-21
 * 功能：获取角色信息列表
 * 创建人：shiyina
 */
function GetAllpayRoleInfoList() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", "1"); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", '50000'); //每页显示记录数
	jsonstr = dataHelper.setJson(jsonstr, "roleName", ''); //角色名称
	jsonstr = dataHelper.setJson(jsonstr, "roleIsStart", '1'); //是否启用1--启用 2--禁用
	jsonParam.jsonStr = jsonstr;
	systemUserService.GetAllpayRoleInfoList(jsonParam, callback_GetAllpayRoleInfoList);
};

function callback_GetAllpayRoleInfoList(data) {
	console.log(data);
	if (data == undefined || data == null || data.rspCode != "000") {
		console.log(data.rspDesc);
	} else {
		var roleNameList = new Array();
		if (data.lists.length > 0) {
			$.each(data.lists, function(index, entry) {
				var values = dataHelper.setJson(null, "value", entry.roleId);
				values = dataHelper.setJson(values, "name", entry.roleName);
				roleNameList.push(jQuery.parseJSON(values));
			});
		}
		controlsHelper.downBoxUlLi('不限角色', roleNameList, "#userRoleId", ".userRoleId");
		$("#userRoleId").find('li').each(function() {
			if ($(this).val() == userRoleId) {
				$('.userRoleId').html($(this).find('a').html());
			}
		});
		GetOrganizationInfoList();
	}
};
/*
 * 创建日期：2016-11-21
 * 功能：获取组织机构信息列表
 * 创建人：shiyina
 */
function GetOrganizationInfoList() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", "1"); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", '50000'); //每页显示记录数
	jsonstr = dataHelper.setJson(jsonstr, "organizationName", ''); //资源功能名称
	jsonParam.jsonStr = jsonstr;
	systemUserService.GetOrganizationInfoList(jsonParam, callback_GetOrganizationInfoList);
};

function callback_GetOrganizationInfoList(data) {
	console.log(data);
	if (data == undefined || data == null || data.rspCode != "000") {
		alert(data.rspDesc);
	} else {
		var rorganizationNameList = new Array();
		if (data.lists.length > 0) {
			$.each(data.lists, function(index, entry) {
				var values = dataHelper.setJson(null, "value", entry.organizationId);
				values = dataHelper.setJson(values, "name", entry.organizationName);
				rorganizationNameList.push(jQuery.parseJSON(values));
			});
		}
		console.log(rorganizationNameList);
		controlsHelper.downBoxUlLi('不限组织机构', rorganizationNameList, "#userOrganizationId", ".userOrganizationId");
	}
};