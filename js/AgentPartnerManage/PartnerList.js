var CurrPage = 1;
var PageSize = 20;
var isCreatePage = false;
var totalPage; //总页数
$(document).ready(function() {

	/*获取组织机构信息列表-分子公司*/
	getOrganizationInfoList();

	//查询
	$("#searchBtn").click(function() {
		event.preventDefault();
		isCreatePage = false;
		GetPosParterList(CurrPage);
	});
	/*导出*/
	$("#ExportPosParterList").click(function() {
		ExportPosParterList();
	});
});

function GetPosParterList(CurrPage) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", CurrPage); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", PageSize); //每页显示记录数
	jsonstr = dataHelper.setJson(jsonstr, "parterName", $("#parterName").val());
	jsonstr = dataHelper.setJson(jsonstr, "branchId", $(".BranchOffice").attr("data-value") == undefined ? '' : $(".BranchOffice").attr("data-value"));
	jsonstr = dataHelper.setJson(jsonstr, "belongParterId", $(".allParterName").attr("data-value") == undefined ? '' : $(".allParterName").attr("data-value"));

	jsonParam.jsonStr = jsonstr;
	businessAgentServer.GetPosParterList(jsonParam, callback_GetPosParterList);
};

function callback_GetPosParterList(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('获取合作方信息失败:' + data.rspDesc);
	} else {
		$("#dictList").html("");
		var template = $("#dictListTemplate").html();
		Mustache.parse(template);

		var listsT = new Array();
		$.each(data.lists, function(index, entry) {
			var value = JSON.stringify(entry);
			value = dataHelper.setJson(value, 'times', entry.createTime.substr(0, 19));
			listsT.push(jQuery.parseJSON(value));
		});
		data.lists = listsT;

		//添加到网页
		var rendered = Mustache.render(template, data);
		$("#dictList").append(rendered);


		$('#dictList tr').find('td').each(function() {
			if ($(this).attr("data-parterState") == '0') {
				$(this).text('停用');
			} else if ($(this).attr("data-parterState") == '1') {
				$(this).text('启用');
			};
		});
		$('#dictList tr').find('td').each(function() {
			if ($(this).attr("data-parterState") == '0') {
				$(this).text('停用');
			} else if ($(this).attr("data-parterState") == '1') {
				$(this).text('启用');
			};
		});

		$('#dictList tr').find('td').each(function() {
			if ($(this).attr("data-parterLevel") == '1') {
				$(this).text('一级');
			} else if ($(this).attr("data-parterLevel") == '2') {
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
					GetPosParterList(CurrPage);
				}
			});
		}

		/*查看*/
		/*	$(".btnModify").click(function(){
				
				location.href = "PartnerView.html?id="+$(this).attr("data-parterId");
			});*/
		//注册修改事件
		AgainRegisterClick();
		/*修改*/
		/*$(".btnUpdate").click(function() {
			location.href = "PartnerEdit.html?id=" + $(this).attr("data-parterId");
		});*/
		/*删除*/
		$(".btnDelete").click(function() {
			var parterId = $(this).attr("data-parterId")
				/*是否确认删除*/
			$("#sureDeleteBtn").unbind('click');
			$("#sureDeleteBtn").click(function() {
				$("#popdelete").hide();
				DeletePosParterInfo(parterId);
			});

		});
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

function callback_getOrganizationInfoList(data) {
	console.log(data);
	if (data == undefined || data == null || data.rspCode != "000") {
		alert(data.rspDesc);
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
		controlsHelper.downBoxUlLi('全部分子公司', BranchOfficeList, "#BranchOffice", ".BranchOffice");

		/*合作商*/
		GetPosParterListD();
	}
};

function GetPosParterListD() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};

	var jsonstr = dataHelper.setJson(null, "parterLevel", "1"); //合作方级别
	jsonstr = dataHelper.setJson(jsonstr, "curragePage", "1"); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", '50000'); //每页显示记录数

	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	businessAgentServer.GetPosParterList(jsonParam, callback_GetPosParterListD);

};

function callback_GetPosParterListD(data) {
	console.log(data);
	if (data == undefined || data == null || data.rspCode != "000") {
		alert(data.rspDesc);
	} else {
		var ParterList = new Array();
		if (data.lists.length > 0) {
			$.each(data.lists, function(entryIndex, entry) {
				var viewdata = dataHelper.setJson(null, "name", entry.parterName);
				viewdata = dataHelper.setJson(viewdata, "value", entry.parterId);
				if (entry.menuSuperiorId != 0 && entry.menuSuperiorId != undefined && entry.menuSuperiorId != null) {
					viewdata = dataHelper.setJson(viewdata, "parentValue", entry.menuSuperiorId);
					ParterList.push(jQuery.parseJSON(viewdata));
				} else {
					viewdata = dataHelper.setJson(viewdata, "parentValue", '');
					ParterList.push(jQuery.parseJSON(viewdata));
				}

			});
		}
		//console.log(agentList);
		controlsHelper.downBoxUlLi('全部合作方', ParterList, "#allParterName", ".allParterName");
	};
	/*打开页面就加载数据*/
	isCreatePage = false;
	GetPosParterList(CurrPage);
};
/*删除*/
function DeletePosParterInfo(id) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "parterId", id);
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	businessAgentServer.DeletePosParterInfo(jsonParam, callback_DeletePosParterInfo);
};

function callback_DeletePosParterInfo(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('删除pos合作方信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert("删除成功", "20%")
		setTimeout(function() {
			isCreatePage = false;
			GetPosParterList(CurrPage);
		}, 500);
	};
};
/*导出*/
function ExportPosParterList() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "parterName", $("#parterName").val());
	jsonstr = dataHelper.setJson(jsonstr, "branchId", $(".BranchOffice").attr("data-value") == undefined ? '' : $(".BranchOffice").attr("data-value"));
	jsonstr = dataHelper.setJson(jsonstr, "belongParterId", $(".allParterName").attr("data-value") == undefined ? '' : $(".allParterName").attr("data-value"));

	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	businessAgentServer.ExportPosParterList(jsonParam, callback_ExportPosParterList);
};

function callback_ExportPosParterList(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('导出pos合作方信息失败:' + data.rspDesc);
	} else {
		console.log("导出成功");
		location.href = data.contextPath;
	};
};