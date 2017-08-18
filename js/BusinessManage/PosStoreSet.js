var companyList = new Array(); //分公司
var pageSize = 10;
var isCreatePage = false;
var curragePage = 1;
var currageMerchPage = 1;
var PageMerchSize = 10;
var isMerchCreatePage = false;
var payChannelList = new Array();
var posType; //pos类型
$(document).ready(function() {
	$.validator.setDefaults({
		debug: true
	});
	$("#BtnSelect").click(function() {
		isMerchCreatePage = false;
		GetMerchantList(currageMerchPage);
	});
	//商户名称搜索查看操作按钮事件 
	$("#ViewMerchant").click(function() {
		isMerchCreatePage = false;
		GetMerchantList(currageMerchPage);
	});
	/*
	 * 功能：是否包含配件点击事件
	 * 创建人：liql
	 * 创建时间：2016-12-13
	 */
	$("#isContainFit").click(function() {
		if($(this).attr('checked') == 'checked') {
			$(this).removeAttr('checked');
			$(".pjGroup").hide();
		} else {
			$(this).attr('checked', 'checked')
			$(".pjGroup").show();
		}
	});
	//查询事件
	$('.select').click(function() {
		isCreatePage = false;
		GetTerminalList(curragePage);
	});
	//导出
	$("#BulkExport").click(function() {
		ExportTerminalList();
	});
	//清空按钮操作事件
	$("#BtneEmpty").click(function() {
		$("#mhtName").val('');
		$("#mhtName").attr('data-value', '')
	});
	//清空按钮操作事件
	$("#BtneEmpty").click(function() {
		$("#mhtName").val('');
		$("#mhtName").attr('data-value', '')
	});
	GetOrganizationInfoList();
});
/*
 * 功能；导出pos终端信息列表
 * 创建人：liql
 * 创建时间；2017-1-4
 */
function ExportTerminalList() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, 'storeId', $(".storeId").attr('data-value') == undefined ? '' : $(".storeId").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, 'termCode', $("#termCode").val());
	jsonstr = dataHelper.setJson(jsonstr, 'merchantId', $(".merchantId").attr('data-value') == undefined ? '' : $(".merchantId").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, 'posType', $(".posType").attr('data-value') == undefined ? '' : $(".posType").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, 'createStartTime', $("#reservation1").val());
	jsonstr = dataHelper.setJson(jsonstr, 'createEndTime', $("#reservation2").val());
	jsonstr = dataHelper.setJson(jsonstr, 'branchId', $(".companyId").attr('data-value') == undefined ? '' : $(".companyId").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, 'posParterId', $(".parterId").attr('data-value') == undefined ? '' : $(".parterId").attr('data-value'));
	if($("#isContainFit").attr('checked') == 'checked') {
		jsonstr = dataHelper.setJson(jsonstr, 'peiJianPosParterId', $(".pjParterId").attr('data-value') == undefined ? '' : $(".pjParterId").attr('data-value'));
	} else {
		jsonstr = dataHelper.setJson(jsonstr, 'peiJianPosParterId', '');
	}
	jsonParam.jsonStr = jsonstr;
	businessPosServer.ExportTerminalList(jsonParam, callback_ExportTerminalList);
};
/*
 * 功能：导出pos终端回调
 * 创建人：liql
 * 创建时间：2017-1-4
 */
function callback_ExportTerminalList(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('导出pos终端信息失败:' + data.rspDesc);
	} else {
		console.log("导出成功");
		location.href = data.contextPath;
	};
};
/*
 * 功能：获取pos终端信息列表
 * 创建人：liql
 * 创建时间：2016-12-13
 */
function GetTerminalList(curragePage) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, 'storeId', $(".storeId").attr('data-value') == undefined || $(".storeId").attr('data-value') == null ? '' : $(".storeId").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, 'termCode', $("#termCode").val());
	jsonstr = dataHelper.setJson(jsonstr, 'merchantId', $("#mhtName").attr('data-value') == undefined || $("#mhtName").attr('data-value') == null ? '' : $("#mhtName").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, 'posType', $(".posType").attr('data-value') == undefined || $(".posType").attr('data-value') == null ? '' : $(".posType").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, 'createStartTime', $("#reservation1").val());
	jsonstr = dataHelper.setJson(jsonstr, 'createEndTime', $("#reservation2").val());
	jsonstr = dataHelper.setJson(jsonstr, 'branchId', $(".companyId").attr('data-value') == undefined || $(".companyId").attr('data-value') == null ? '' : $(".companyId").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, 'posParterId', $(".parterId").attr('data-value') == undefined || $(".parterId").attr('data-value') == null ? '' : $(".parterId").attr('data-value'));
	if($("#isContainFit").attr('checked') == 'checked') {
		jsonstr = dataHelper.setJson(jsonstr, 'peiJianPosParterId', $(".pjParterId").attr('data-value') == undefined || $(".pjParterId").attr('data-value') == null ? '' : $(".pjParterId").attr('data-value'));
	} else {
		jsonstr = dataHelper.setJson(jsonstr, 'peiJianPosParterId', '');
	}
	jsonstr = dataHelper.setJson(jsonstr, 'curragePage', curragePage);
	jsonstr = dataHelper.setJson(jsonstr, 'pageSize', pageSize);
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	businessPosServer.GetTerminalList(jsonParam, callback_GetTerminalList);
};
/*
 * 功能：获取pos终端信息列表回调函数
 * 创建人：liql
 * 创建时间：2016-12-13
 */
function callback_GetTerminalList(data) {
	console.log(data);
	$("#dictList").html('');
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		alert('查询pos终端列表失败:' + data.rspDesc);
	} else {
		var template = $("#dictListTemplate").html();
		Mustache.parse(template);
		var listsT = new Array();
		$.each(data.lists, function(index, entry) {
			var value = JSON.stringify(entry);
			var payChannel = entry.payChannel != null && entry.payChannel != undefined && entry.payChannel != '' ? entry.payChannel.replace(',', '') : '';
			value = dataHelper.setJson(value, 'payChannel', payChannel);
			value = dataHelper.setJson(value, 'isStart', entry.terminalState == '1' ? '启用' : '禁用');
			value = dataHelper.setJson(value, 'time', entry.posCreateTime != undefined && entry.posCreateTime != null && entry.posCreateTime != '' ? entry.posCreateTime.substr(0, 19) : '');
			$.each(payChannelList, function(index1, entry1) {
				if(entry1.data_code == payChannel) {
					value = dataHelper.setJson(value, 'payChannelName', entry1.data_name);
				}
			});
			$("#posType").find('li').each(function() {
				if($(this).attr('value') == entry.posType) {
					value = dataHelper.setJson(value, 'posTypeName', $(this).find('a').text());
				}
			});
			listsT.push(jQuery.parseJSON(value));
		});
		data.lists = listsT;
		var rendered = Mustache.render(template, data);
		$("#dictList").append(rendered);

		//权限问题
		$("#dictList").find('tr').each(function() {
			if($(this).find('td.postype').attr('data-code') == '1' || $(this).find('td.postype').attr('data-code') == '4') {
				$(this).find('span.super').show();
			}
			if($(this).find('td.postype').attr('data-code') == '2') {
				$(this).find('span.delete').hide();
			}
		});
		AgainRegisterClick();
		//修改
		/*$(".update").click(function() {
			location.href = 'updatePos.html?id=' + $(this).attr('data-id');
		});*/
		//删除
		$(".delete").click(function() {
			if(confirm("您真的确定要删除吗?")) {
				DeletePosInfo($(this).attr('data-id'));
			}
		});
		//关联
		$(".super").click(function() {
			$("#pop5").show();
			posType = $(this).attr('data-postype');
			$("#pop5").find('input').val('');
			$(".payChannel").find("input[type='radio']").show();
			$(".payChannel").find("input[type='radio']").parent().show();
			$(".payChannel").find("input[type='radio'][data-value=" + $(this).attr('data-payChannel') + "]").hide();
			$(".payChannel").find("input[type='radio'][data-value=" + $(this).attr('data-payChannel') + "]").parent().hide();
			$("#passbtn1").attr('data-merchant', $(this).attr('data-merchant'));
			$("#passbtn1").attr('data-store', $(this).attr('data-store'));
			$("#passbtn1").attr('data-id', $(this).attr('data-id'));
			$(".payChannel").find("input[type='radio'][data-value!=" + $(this).attr('data-payChannel') + "]:eq(0)").attr('checked', 'checked');
		});
		//确定
		fromValidate();
		$("#passbtn1").click(function() {
			//验证
			console.log(fromValidate().form());
			if(fromValidate().form()) {
				InsertPosInfo($(this).attr('data-store'), $(this).attr('data-merchant'), $(this).attr('data-id'));
			}
		});
		//确定关联
		$(".total").html(data.total);
		//分页
		if(!isCreatePage) {
			isCreatePage = true;
			$('#PosStorePage').jqPagination({
				link_string: 'page={page_number}',
				max_page: Math.ceil(data.total / pageSize),
				paged: function(page) {
					console.log("第" + page + "页");
					curragePage = page;
					//增加一页调用刷新一次
					GetTerminalList(curragePage);
				}
			});
		}

	}
};
/*
 * 功能：获取公司列表
 * 创建人：liql
 * 创建时间：2016-12-13
 */
function GetOrganizationInfoList() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, 'organizationName', '');
	jsonstr = dataHelper.setJson(jsonstr, 'organizationState', '1');
	jsonstr = dataHelper.setJson(jsonstr, 'curragePage', '1');
	jsonstr = dataHelper.setJson(jsonstr, 'pageSize', '5000');
	jsonParam.jsonStr = jsonstr;
	console.log(jsonstr);
	systemUserService.GetOrganizationInfoList(jsonParam, callback_GetOrganizationInfoList);
};
/*
 * 功能：获取公司列表回调函数
 * 创建人：lql
 * 创建时间：2016-12-13
 */
function callback_GetOrganizationInfoList(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('查询公司列表失败:' + data.rspDesc);
	} else {
		companyList = new Array();
		$.each(data.lists, function(index, entry) {
			var value = dataHelper.setJson(null, 'name', entry.organizationName);
			value = dataHelper.setJson(value, 'value', entry.organizationId);
			companyList.push(jQuery.parseJSON(value));
		});
		controlsHelper.downBoxUlLi('全部子公司', companyList, "#companyId", ".companyId");
		controlsHelper.downBoxUlLi('全部子公司', companyList, "#companyId1", ".companyId1");

		//子公司选择事件
		$("#companyId").find('li').click(function() {
			$(".companyId").attr('data-value', $(this).attr('value'));
			$(".companyId").html($(this).find('a').html());
			GetPosParterList($(this).attr('value'));
		});

	};
	//获取码表数据
	dataValueHelper.GetDictionaryDataList("posType", '#posType', '.posType', '全部');
	setTimeout(function() {
		dataValueHelper.GetDictionaryDataList("applicationSystem", '', '', '', GetDictionaryDataListCallback);

	}, 200)
};
/*
 * 功能：获取合作方
 * 创建人：liql
 * 创建时间：2016-12-13
 */
function GetPosParterList(branchId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, 'branchId', branchId);
	jsonstr = dataHelper.setJson(jsonstr, 'parterName', '');
	jsonstr = dataHelper.setJson(jsonstr, 'belongParterId', '');
	jsonstr = dataHelper.setJson(jsonstr, 'curragePage', '1');
	jsonstr = dataHelper.setJson(jsonstr, 'pageSize', '999999');
	jsonParam.jsonStr = jsonstr;
	console.log(jsonstr);
	businessAgentServer.GetPosParterList(jsonParam, callback_GetPosParterList);
};
/*
 * 功能：获取合作方信息列表
 * 创建人：liql
 * 创建时间：2016-12-13
 */
function callback_GetPosParterList(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('查询合作方信息失败:' + data.rspDesc);
	} else {
		var parterList = new Array();
		$.each(data.lists, function(index, entry) {
			var value = dataHelper.setJson(null, 'name', entry.parterName);
			value = dataHelper.setJson(value, 'value', entry.parterId);
			parterList.push(jQuery.parseJSON(value));
		});
		controlsHelper.downBoxUlLi('全部合作方', parterList, "#parterId", ".parterId");
		controlsHelper.downBoxUlLi('全部配件合作方', parterList, "#pjParterId", ".pjParterId");
	}

};
/*
 * 功能：获取商户信息列表
 * 创建人：liql
 * 创建时间：2016-12-13
 */
function GetMerchantList(currageMerchPage) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", currageMerchPage); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", PageMerchSize); //每页显示记录数
	jsonstr = dataHelper.setJson(jsonstr, "mhtName", $("#menName").val()); //商户名称
	jsonstr = dataHelper.setJson(jsonstr, "mhtIndustryNum", '');
	jsonstr = dataHelper.setJson(jsonstr, "mhtProvinceId", '');
	jsonstr = dataHelper.setJson(jsonstr, "mhtCityId", '');
	jsonstr = dataHelper.setJson(jsonstr, "mhtBeanchCompId", '');
	jsonstr = dataHelper.setJson(jsonstr, "mhtAgentId", '');
	jsonstr = dataHelper.setJson(jsonstr, "mhtOpenChannel", '');
	jsonstr = dataHelper.setJson(jsonstr, "mhtStartCreateTime", '');
	jsonstr = dataHelper.setJson(jsonstr, "mhtEndCreateTime", '');
	jsonstr = dataHelper.setJson(jsonstr, "mhtApproveStatus", '');
	jsonstr = dataHelper.setJson(jsonstr, "", '');
	jsonParam.jsonStr = jsonstr;
	/*console.log(jsonstr);*/
	businessShopServer.GetMerchantList(jsonParam, callback_getMerchantList);
};
/*
 * 功能：获取商户列表回调
 * 创建人：Liql
 * 创建时间：2016-12-13
 */
function callback_getMerchantList(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('查询商户信息失败:' + data.rspDesc);
	} else {
		$("#MerchantList").html('');
		var template = $("#MerchantListTemplate").html();
		Mustache.parse(template);

		var rendered = Mustache.render(template, data);
		$("#MerchantList").append(rendered);

		$("#TotalNumber").html(data.total);
		/*
		 * 功能：商户选择事件
		 */
		$(".Selection").click(function() {
			$("#mhtName").attr('data-value', $(this).attr('data-mhtId'));
			$("#mhtName").val($(this).attr('data-mhtName'));
			$("#pop2").hide();
			ShowSlider();
			GetShoreList($(this).attr('data-mhtId'));
		});

		//总条数
		$(".TotalNumber").html(data.total);
		if(!isMerchCreatePage) {
			isMerchCreatePage = true;
			$('#businessPage').jqPagination({
				link_string: 'page={page_number}',
				max_page: Math.ceil(data.total / PageMerchSize),
				paged: function(page) {
					console.log("第" + page + "页");
					currageMerchPage = page;
					//增加一页调用刷新一次
					GetMerchantList(currageMerchPage);
				}
			});
		}

	}

};
/*
 * 功能：码表回调函数
 * 创建人：liql
 * 创建时间：2016-12-19
 */
function GetDictionaryDataListCallback(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('查询码表信息失败:' + data.rspDesc);
	} else {
		payChannelList = data.lists;
		$(".payChannel").empty();
		$.each(data.lists, function(index, entry) {
			$(".payChannel").append("<label><input type='radio' name='types' data-value=" + entry.data_code + " />" + entry.data_name + "   </label>");
		});
		$(".payChannel").find("input[type='radio']:eq(0)").attr('checked', 'checked');
		//选择系统
		$(".payChannel").find("input[type='radio']").click(function() {
			$(".payChannel").find("input[type='radio']").removeAttr('checked');
			$(this).prop('checked', false);

			$(this).attr('checked', 'checked');
			$(this).prop('checked', true);
		});
	}
	isCreatePage = false;
	GetTerminalList(curragePage);
};
/*
 * 功能：获取门店列表
 * 创建人：liql
 * 创建时间：2016-12-13
 */
function GetShoreList(merchantId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};

	var jsonstr = dataHelper.setJson(null, 'storeName', '');
	jsonstr = dataHelper.setJson(jsonstr, 'merchantId', merchantId);
	jsonstr = dataHelper.setJson(jsonstr, 'provinceId', '');
	jsonstr = dataHelper.setJson(jsonstr, 'cityId', '');
	jsonstr = dataHelper.setJson(jsonstr, 'countryId', '');
	jsonstr = dataHelper.setJson(jsonstr, 'storeStatus', '1');
	jsonstr = dataHelper.setJson(jsonstr, 'curragePage', '1');
	jsonstr = dataHelper.setJson(jsonstr, 'pageSize', '99999');
	jsonParam.jsonStr = jsonstr;
	console.log(jsonstr);
	businessShopServer.GetShoreList(jsonParam, callback_getShoreList);
};
/*
 * 功能：获取门店回调列表
 * 创建人：liql
 * 创建时间：2016-12-13
 */
function callback_getShoreList(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('查询门店信息失败:' + data.rspDesc);
	} else {
		var storeList = new Array();
		$.each(data.lists, function(index, entry) {
			var value = dataHelper.setJson(null, 'name', entry.storeName);
			value = dataHelper.setJson(value, 'value', entry.storeId);
			storeList.push(jQuery.parseJSON(value));
		});
		controlsHelper.downBoxUlLi('全部门店', storeList, "#storeId", ".storeId");
	}
};
/*
 * 功能：删除pos终端信息
 * 创建人：liql
 * 创建时间：2016-12-16
 */
function DeletePosInfo(posId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	jsonParam.jsonStr = dataHelper.setJson(null, 'posId', posId);
	console.log(jsonParam);
	businessPosServer.DeletePosInfo(jsonParam, callback_DeletePosInfo);
};
/*
 * 功能：删除pos终端回调
 * 创建人：liql
 * 创建时间：2016-12-16
 */
function callback_DeletePosInfo(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('删除pos信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert('删除成功');
		isCreatePage = false;
		GetTerminalList(curragePage);
	};
};
/*
 * 功能：新增pos终端信息
 * 创建人：liql
 * 创建时间：2016-12-13
 */
function InsertPosInfo(storeId, merchantId, posId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, 'storeId', storeId);
	jsonstr = dataHelper.setJson(jsonstr, 'merchantId', merchantId);
	jsonstr = dataHelper.setJson(jsonstr, 'termCode', $("#termCode1").val());
	jsonstr = dataHelper.setJson(jsonstr, 'posType', posType);
	jsonstr = dataHelper.setJson(jsonstr, 'payChannel', $(".payChannel").find("input[type='radio'][checked='checked']").attr('data-value') + ",");
	jsonstr = dataHelper.setJson(jsonstr, 'branchId', '');
	jsonstr = dataHelper.setJson(jsonstr, 'posParterId', '');
	jsonstr = dataHelper.setJson(jsonstr, 'peiJianPosParterId', '');
	jsonstr = dataHelper.setJson(jsonstr, 'userType', ''); //待定
	jsonstr = dataHelper.setJson(jsonstr, 'merchaCode', $("#merchaCode").val());
	jsonstr = dataHelper.setJson(jsonstr, 'posStatus', $("#kai").attr('checked') == 'checked' ? '1' : '0');
	jsonstr = dataHelper.setJson(jsonstr, 'codeCount', '1');
	jsonstr = dataHelper.setJson(jsonstr, 'superTermCode', posId);
	jsonParam.jsonStr = jsonstr;
	console.log(jsonstr);
	businessPosServer.InsertPosInfo(jsonParam, callback_insertPosInfo);
};
/*
 * 功能：新增pos终端信息回调函数
 * 创建人：liql
 * 创建时间：2016-12-13
 */
function callback_insertPosInfo(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('新增pos终端信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert('关联成功');
		$("#pop5").hide();
		isCreatePage = false;
		GetTerminalList(curragePage);
	}
};

function fromValidate() {
	return $("#signupForm").validate({
		/* 设置验证规则 */
		rules: {
			merchaCode: {
				required: true,
				isFifteen: true
			},
			termCode: {
				required: true,
				isEight: true
			}
		},
		/**/
		/* 设置错误信息 */
		messages: {
			merchaCode: {
				required: "请输入商户号",
				isFifteen: "商户号只能为15位数字"
			},
			termCode: {
				required: "请输入终端号",
				isEight: "终端只能为8位数字"
			}
		},
		/* 设置错误信息提示DOM */
		errorPlacement: function(error, element) {
			error.appendTo(element.parent());
		},
	});
};