var CurrPage = 1;
var PageSize = 20;
var isCreatePage = false;
var totalPage; //总页数

$(document).ready(function() {

	setTimeout(function() {
		//获取组织机构信息列表-分子公司
		getOrganizationInfoList();
		setTimeout(function() {
			//获取代理商信息列表
			isCreatePage = false;
			GetAgentListSearch(CurrPage);
		}, 500);
	}, 500);

	//查询事件
	$("#searchBtn").click(function() {
		event.preventDefault();
		//获取代理商信息列表
		isCreatePage = false;
		GetAgentListSearch(CurrPage);
	});

	//导出
	$("#agentOutData").click(function() {
		agentOutData();
	});

});

/*获取代理商信息列表*/
function GetAgentListSearch(CurrPage) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", CurrPage); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", PageSize); //每页显示记录数
	jsonstr = dataHelper.setJson(jsonstr, "agentName", $("#agentName").val());
	jsonstr = dataHelper.setJson(jsonstr, "agentNum", $("#agentNum").val());
	jsonstr = dataHelper.setJson(jsonstr, "branchId", $(".BranchOffice").attr("data-value"));
	jsonstr = dataHelper.setJson(jsonstr, "agentParentId", $(".allAgent").attr("data-value"));
	jsonstr = dataHelper.setJson(jsonstr, "agentType", $("#agentType input:checked").val());
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam.jsonStr);
	businessAgentServer.GetAgentList(jsonParam, callback_GetAgentListSearch);

};

/*获取代理商信息列表回调*/
function callback_GetAgentListSearch(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('获取代理商信息失败:' + data.rspDesc);
	} else {
		$("#dictList").html("");
		var template = $("#dictListTemplate").html();
		Mustache.parse(template);
		var listsT = new Array();
		$.each(data.lists, function(index, entry) {
			var value = JSON.stringify(entry);
			value = dataHelper.setJson(value, 'times', entry.createTime != null && entry.createTime != undefined && entry.createTime != '' ? entry.createTime.substr(0, 19) : '');
			listsT.push(jQuery.parseJSON(value));
		});
		data.lists = listsT;
		var rendered = Mustache.render(template, data);
		$("#dictList").append(rendered);
	};


	$('#dictList tr').find('td').each(function() {
		if ($(this).attr("data-agentState") == '0') {
			$(this).text('停用');
		} else if ($(this).attr("data-agentState") == '1') {
			$(this).text('启用');
		};
	});
	$('#dictList tr').find('td').each(function() {
		if ($(this).attr("data-agentLevel") == '1') {
			$(this).text('一级');
		} else if ($(this).attr("data-agentLevel") == '2') {
			$(this).text('二级');
		};
	});
	$(".total").html(data.total);
	if (!isCreatePage) {
		isCreatePage = true;
		$('.pagination').jqPagination({
			link_string: 'page={page_number}',
			max_page: Math.ceil(data.total / PageSize),
			paged: function(page) {
				console.log("第" + page + "页");
				CurrPage = page;
				//增加一页调用刷新一次
				GetAgentListSearch(CurrPage);
			}
		});
	}
	//注册修改事件
	AgainRegisterClick();
	/*修改*/

//	$(".updateBtn").click(function() {
//		event.preventDefault();
//		var agentId = $(this).attr("data-agentId");
//		location.href = "AgentEdit.html?agentId=" + agentId;
//	});
	/*删除*/
	$(".deleteBtn").click(function() {
		var agentId = $(this).attr("data-agentId");
		/*是否确认删除*/
		$("#sureDeleteBtn").unbind('click');
		$("#sureDeleteBtn").click(function() {
			$("#popdelete").hide();
			DeleteAgentInfo(agentId);
		});
	});
};

/*删除代理商信息*/
function DeleteAgentInfo(agentId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "agentId", agentId);
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam.jsonStr);
	businessAgentServer.DeleteAgentInfo(jsonParam, callback_DeleteAgentInfo);
};

/*删除代理商信息回调*/
function callback_DeleteAgentInfo(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('删除代理商信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert("删除成功", "20%")
		setTimeout(function() {
			isCreatePage = false;
			GetAgentListSearch(CurrPage);
		}, 500);
	};
};

/*分子公司*/
function getOrganizationInfoList() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", "1"); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", '50000'); //每页显示记录数
	jsonstr = dataHelper.setJson(jsonstr, "organizationName", ''); //组织机构名称
	jsonstr = dataHelper.setJson(jsonstr, "organizationState", '1'); //是否启用1--启用 2--禁用
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	systemUserService.GetOrganizationInfoList(jsonParam, callback_getOrganizationInfoList)
};

/*分子公司回调*/
function callback_getOrganizationInfoList(data) {
	console.log(data);
	if (data == undefined || data == null || data.rspCode != "000") {
		console.log(data.rspDesc);
	} else {
		var BranchOfficeList = new Array();
		if (data.lists.length > 0) {
			$.each(data.lists, function(index, entry) {
				var values = dataHelper.setJson(null, "value", entry.organizationId);
				values = dataHelper.setJson(values, "name", entry.organizationName);
				BranchOfficeList.push(jQuery.parseJSON(values));
			});
		}
		//console.log(BranchOfficeList);
		controlsHelper.downBoxUlLi('请选择分子公司', BranchOfficeList, "#BranchOffice", ".BranchOffice");
		//改变事件
		$("#BranchOffice li").click(function() {
			GetAgentList();
		});
	}
};

/*获取代理商*/
function GetAgentList() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};

	var jsonstr = dataHelper.setJson(null, "branchId", $(".BranchOffice").attr('data-value') == undefined ? '' : $(".BranchOffice").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, "level", "1");
	jsonstr = dataHelper.setJson(jsonstr, "curragePage", "1"); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", "5000"); //每页显示记录数

	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	businessAgentServer.GetAgentList(jsonParam, callback_GetAgentList);
};

/*获取代理商回调*/
function callback_GetAgentList(data) {
	console.log(data);
	if (data == undefined || data == null || data.rspCode != "000") {
		alert(data.rspDesc);
	} else {
		var agentList = new Array();
		if (data.lists.length > 0) {
			$.each(data.lists, function(entryIndex, entry) {
				var viewdata = dataHelper.setJson(null, "name", entry.agentName);
				viewdata = dataHelper.setJson(viewdata, "value", entry.agentId);
				if (entry.menuSuperiorId != 0 && entry.menuSuperiorId != undefined && entry.menuSuperiorId != null) {
					viewdata = dataHelper.setJson(viewdata, "parentValue", entry.menuSuperiorId);
					agentList.push(jQuery.parseJSON(viewdata));
				} else {
					viewdata = dataHelper.setJson(viewdata, "parentValue", '');
					agentList.push(jQuery.parseJSON(viewdata));
				}

			});
		}
		//		console.log(agentList);
		controlsHelper.downBoxUlLi('请选择代理商', agentList, "#allAgent", ".allAgent");

	};
};

/*导出*/
function agentOutData() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "agentName", $("#agentName").val());
	jsonstr = dataHelper.setJson(jsonstr, "branchId", $(".BranchOffice").attr("data-value") == undefined ? '' : $(".BranchOffice").attr("data-value")); //每页显示记录数
	jsonstr = dataHelper.setJson(jsonstr, "agentParentId", $(".allAgent").attr("data-value") == undefined ? '' : $(".allAgent").attr("data-value")); //代理商级别
	jsonstr = dataHelper.setJson(jsonstr, "agentNum", $("#agentNum").val());
	jsonstr = dataHelper.setJson(jsonstr, "agentType", $("#agentType input:checked").val());
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	businessAgentServer.ExportAgentList(jsonParam, callback_agentOutData);

};

/*导出回调*/
function callback_agentOutData(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('导出代理商信息失败:' + data.rspDesc);
	} else {
		console.log(data.contextPath);
		location.href = data.contextPath;
	};
};