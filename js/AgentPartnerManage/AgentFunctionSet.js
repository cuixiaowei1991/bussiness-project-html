var CurrPage = 1;
var PageSize = 20;
var isCreatePage = false;
var totalPage; //总页数
var agentName = "";
var agentId = "";
var agentNameInput = "";
$(document).ready(function() {

	/*2.5.8获取代理商所有菜单及功能信息列表（已启用状态）*/
	getLiList();

	$("#submitBtn").click(function() {
		/*提交的方法*/
		event.preventDefault();
		InsertAgentSetInfo(agentId);

	});
	/*点弹窗的查询*/
	$("#popSeeBtn").click(function() {

		if($("#agentName").val() != "" && $("#agentName").val() != undefined && $("#agentName").val() != null) {
			agentNameInput = $("#agentName").val();

		};
		/*选择的接口：2.5.1	获取代理商信息列表*/
		isCreatePage = false;
		GetAgentList(agentNameInput, CurrPage)
	});

});
/*2.5.8获取代理商所有菜单及功能信息列表（已启用状态）*/
function getLiList() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	agentUserService.getMenuFuncInfoList(jsonParam, callback_getLiList);
	//TODO待雅意弄好了，改正确的
};

function callback_getLiList(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('获取代理商信息失败:' + data.rspDesc);
	} else {
		console.log('xxaa')
		$("#callBackData").html("");
		var template = $("#callBacklist").html();
		Mustache.parse(template);
		//添加到网页
		var rendered = Mustache.render(template, data);
		$("#callBackData").append(rendered);

		$.each(data.lists, function(index, entry) {
			console.log('xxx');
			if($("#SelectAll").prop('checked')) {
				$("#" + entry.funcTopMenuId).prop("checked", true);
				$("#" + entry.funcTopMenuId).parent().next().find('input').prop("checked", true);
			}
			$("#SelectAll").click(function() {
				if($("#SelectAll").prop('checked')) {
					$("#" + entry.funcTopMenuId).prop("checked", true);
					$("#" + entry.funcTopMenuId).parent().next().find('input').prop("checked", true);
				} else {
					$("#" + entry.funcTopMenuId).prop("checked", false);
					$("#" + entry.funcTopMenuId).parent().next().find('input').prop("checked", false);
				}
			})
			$("#" + entry.funcTopMenuId).click(function() {
				if($(this).prop("checked")) {
					$(this).parent().next().find('input').prop("checked", true);
				} else {
					$(this).parent().next().find('input').prop("checked", false);
				}
			});
			$("#" + entry.funcTopMenuId).parent().next().find('input').click(function() {
				if($("#" + entry.funcTopMenuId).parent().next().find('input:checked').length == $("#" + entry.funcTopMenuId).parent().next().find('input').length) {
					$("#" + entry.funcTopMenuId).prop("checked", true);
				} else {
					$("#" + entry.funcTopMenuId).prop("checked", false);
				}
			});
		});

		$("#callBackData").find('ul').each(function() {
			if($(this).find('input[type=checkbox]:checked').length == $(this).find('input[type=checkbox]').length) {
				$(this).parent().prev().find('input[type=checkbox]').prop('checked', true);
			}
		});

		isCreatePage = false;
		GetAgentList(agentNameInput, CurrPage)
	};
};

/*2.5.6新增代理商设置信息*/
function InsertAgentSetInfo(agentId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var myjsonStr = dataHelper.setJson(null, "agentId", agentId);
	myjsonStr = dataHelper.setJson(myjsonStr, "lists", listArray2());
	jsonParam.jsonStr = myjsonStr;
	console.log(jsonParam);
	agentUserService.InsertAgentSetInfo(jsonParam, callback_InsertAgentSetInfo);

};

function callback_InsertAgentSetInfo(data) {
	console.log(data);

	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('新增代理商设置信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert("提交成功", "20%")
	};
};
/*选择的接口：2.5.1	获取代理商信息列表*/
function GetAgentList(agentNameInput, CurrPage) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", CurrPage); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", PageSize); //每页显示记录数
	jsonstr = dataHelper.setJson(jsonstr, "level", '1'); //代理商级别
	jsonstr = dataHelper.setJson(jsonstr, "agentName", agentNameInput);
	jsonstr = dataHelper.setJson(jsonstr, "branchId", '');
	jsonstr = dataHelper.setJson(jsonstr, "agentParentId", '');

	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	businessAgentServer.GetAgentList(jsonParam, callback_GetAgentList);
	//待巧莲问清楚
};

function callback_GetAgentList(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('获取代理商信息失败:' + data.rspDesc);
	} else {
		$("#agentList").html("");
		var template = $("#agentCallBack").html();
		Mustache.parse(template);
		//添加到网页
		var rendered = Mustache.render(template, data);
		$("#agentList").append(rendered);
		/*级别判断*/
		$('#agentList tr').find('td').each(function() {
			if($(this).attr("data-agentLevel") == '1') {
				$(this).text('一级');
			} else if($(this).attr("data-agentLevel") == '2') {
				$(this).text('二级');
			};
		});
	};
	/*选取小按钮*/
	$(".selectAgentBtn").click(function() {
		agentName = $(this).parent().parent().find("td").eq(0).text();
		agentId = $(this).parent().parent().find("td").eq(0).attr("data-agentId");
		$("#agentInput").val(agentName);
		$("#pop2").hide();
		ShowSlider();
		$("#callBackData").find('input').attr('checked', false);
		$("#SelectAll").attr('checked', false);
		$("#agentInput").attr("data-agentId", agentId);
		/*根据选中的agentId，获取这个agentId的数据
		 *获取代理商设置信息 */
		GetAgentSetInfoById(agentId);
	});
	$(".total").html(data.total);
	if(!isCreatePage) {
		isCreatePage = true;
		$('.pagination').jqPagination({
			link_string: 'page={page_number}',
			max_page: Math.ceil(data.total / PageSize),
			paged: function(page) {
				console.log("第" + page + "页");
				CurrPage = page;
				//增加一页调用刷新一次
				GetAgentList(agentNameInput, CurrPage)
			}
		});
	}

};
/*获取代理商设置信息*/
function GetAgentSetInfoById(agentId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "agentId", agentId);
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	agentUserService.GetAgentSetInfoById(jsonParam, callback_GetAgentSetInfoById);

};

function callback_GetAgentSetInfoById(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('获取代理商设置信息失败:' + data.rspDesc);
	} else {
		$.each(data.lists, function(index, entry) {
			/*让已有的选中*/
			$("#" + entry.agentFunId).prop("checked", "checked");

			$("#" + entry.agentMenuId).prop("checked", "checked");
			$("#" + entry.systemId).prop("checked", "checked");
		});
		$("#callBackData").find('ul').each(function() {
			if($(this).find('input[type=checkbox]:checked').length == $(this).find('input[type=checkbox]').length) {
				$(this).parent().prev().find('input[type=checkbox]').prop('checked', true);
			}
		});
	};
};

function listArray1() {
	var addObj = "{}";
	var addArray = new Array();
	//遍历
	$("#callBackData p>input").each(function() {
		if($(this).is(':checked')) {
			addObj = dataHelper.setJson(addObj, 'funcTopMenuId', $(this).attr("data-funcTopMenuId"));
			addArray.push(jQuery.parseJSON(addObj));
		};
		console.log(addArray);
	});
	return addArray;
};

function listArray2() {
	var addObj2 = "{}";
	var addArray2 = new Array();
	//遍历
	$("#callBackData li>input").each(function() {
		if($(this).is(':checked') && $(this).parent().is(":visible")) {
			addObj2 = dataHelper.setJson(addObj2, 'agentMenuId', $(this).attr("data-funcId"));
			addObj2 = dataHelper.setJson(addObj2, 'agentFunId', $(this).attr("data-menuId"));
			addObj2 = dataHelper.setJson(addObj2, 'systemId', $(this).attr("data-systemId"));
			addArray2.push(jQuery.parseJSON(addObj2));
		};
		console.log(addArray2);
	});
	return addArray2;

};