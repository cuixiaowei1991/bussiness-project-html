var curragePage = 1; //当前页
var pageSize = 10; //每页显示记录条数
var isCreatePage = false; //是否创建分页
$(document).ready(function() {
	//获取银行码表信息
	dataValueHelper.GetDictionaryDataList("wftBank", '#wftBank', '.wftBank', '全部银行');
	setTimeout(function() {
		GetOrganizationInfoList();
	}, 200);
	//查询
	$("#selectBtn").click(function() {
		isCreatePage = false;
		GetWftShopInfoList('1');
	});
	//查看支付类型
	$(".payTypeView").click(function() {
		$("#pop2").show();
	});
});

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
	jsonstr = dataHelper.setJson(jsonstr, 'pageSize', '999999');
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

		controlsHelper.downBoxUlLi('全部分公司', companyList, "#branchId", ".branchId");
		//子公司选择事件
		$("#branchId").find('li').click(function() {
			$(".branchId").attr('data-value', $(this).attr('value'));
			$(".branchId").html($(this).find('a').html());
			GetAgentList($(this).attr('value'));
		});
	};

};
/*
 * 功能：获取代理商信息
 * 创建人：liql
 * 创建时间：2017-1-11
 */
function GetAgentList(branchId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "branchId", branchId);
	jsonstr = dataHelper.setJson(jsonstr, "level", "1");
	jsonstr = dataHelper.setJson(jsonstr, "curragePage", "1"); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", "5000"); //每页显示记录数
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	businessAgentServer.GetAgentList(jsonParam, callback_GetAgentList);
};
/*
 * 功能：代理商回调函数
 * 创建人：liql
 * 创建时间：2017-1-11
 */
function callback_GetAgentList(data) {
	console.log(data);
	if(data == undefined || data == null || data.rspCode != "000") {
		controlsHelper.alert("查询代理商列表失败：" + data.rspDesc);
	} else {
		var agentList = new Array();
		if(data.lists.length > 0) {
			$.each(data.lists, function(entryIndex, entry) {
				var viewdata = dataHelper.setJson(null, "name", entry.agentName);
				viewdata = dataHelper.setJson(viewdata, "value", entry.agentId);
				if(entry.menuSuperiorId != 0 && entry.menuSuperiorId != undefined && entry.menuSuperiorId != null) {
					viewdata = dataHelper.setJson(viewdata, "parentValue", entry.menuSuperiorId);
					agentList.push(jQuery.parseJSON(viewdata));
				} else {
					viewdata = dataHelper.setJson(viewdata, "parentValue", '');
					agentList.push(jQuery.parseJSON(viewdata));
				}

			});
		}
		controlsHelper.downBoxUlLi('请选择代理商', agentList, "#parentId", ".parentId");
	};

};
/*
 * 功能：获取威富通信息列表
 * 创建人：liql
 * 创建时间：2017-1-11
 */
function GetWftShopInfoList(page) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "shopName", $("#shopName").val());
	jsonstr = dataHelper.setJson(jsonstr, "wftIndustry", $(".industry").attr('data-value') == undefined || $(".industry").attr('data-value') == null ? '' : $(".industry").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, "wftBank", $(".wftBank").attr('data-value') == undefined || $(".wftBank").attr('data-value') == null ? '' : $(".wftBank").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, "province", $(".province").attr('data-value') == undefined || $(".province").attr('data-value') == null ? '' : $(".province").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, "city", $(".city").attr('data-value') == undefined || $(".city").attr('data-value') == null ? '' : $(".city").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, "startCreateTime", $('#reservation1').val());
	jsonstr = dataHelper.setJson(jsonstr, "endCreateTime", $('#reservation2').val());
	jsonstr = dataHelper.setJson(jsonstr, "shopCode", $("#shopCode").val());
	jsonstr = dataHelper.setJson(jsonstr, "wftBranch", $(".wftBranch").attr('data-value') == undefined || $(".wftBranch").attr('data-value') == null ? '' : $(".wftBranch").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, "wftAgent", $(".wftAgent").attr('data-value') == undefined || $(".wftAgent").attr('data-value') == null ? '' : $(".wftAgent").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, "sCodeBackStartTime", $('#reservation3').val());
	jsonstr = dataHelper.setJson(jsonstr, "sCodeBackEndTime", $('#reservation4').val());
	jsonstr = dataHelper.setJson(jsonstr, "isState", $(".isState").attr('data-value') == undefined || $(".isState").attr('data-value') == null ? '' : $(".isState").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, "createName", $("#createName").val());
	jsonstr = dataHelper.setJson(jsonstr, "isHaveShopCode", $("#isHaveShopCode").attr('checked') == 'checeked' ? '1' : '0');
	jsonstr = dataHelper.setJson(jsonstr, "isZFTypeEx", $("#isZFTypeEx").attr('checked') == 'checeked' ? '1' : '0');
	jsonstr = dataHelper.setJson(jsonstr, "curragePage", page); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", pageSize); //每页显示记录数
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	wftInfoServer.GetWftShopInfoList(jsonParam, callback_GetWftShopInfoList);
};
/*
 * 功能：根据code获取渠道name
 * 创建人：liqlc
 * 创建时间：2016-12-21
 */
function getDataNameByCode(code) {
	var name;
	$("#wftBank").find('li').each(function() {
		if($(this).attr('value') == code) {
			name = $(this).find('a').html();
		}
	});
	return name;
};
/*
 * 功能：威富通信息回调函数
 * 创建人：liql
 * 创建时间：2017-1-11
 */
function callback_GetWftShopInfoList(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('查询公司列表失败:' + data.rspDesc);
	} else {
		var template = $("#wftInfoListTemplate").html();
		Mustache.parse(template);
		var listsT = new Array();
		$.each(data.lists, function(index, entry) {
			var value = JSON.stringify(entry);
			value = dataHelper.setJson(value, 'isStateName', entry.isState == '1' ? '启用' : '禁用');
			value = dataHelper.setJson(value, 'wftBankTypeName', getDataNameByCode(entry.wftBankType));
			value = dataHelper.setJson(value, 'times', entry.shopCodeBackTime != null && entry.shopCodeBackTime != undefined && entry.shopCodeBackTime != '' ? entry.shopCodeBackTime.substr(0, 19) : '');
			listsT.push(jQuery.parseJSON(value));
		});
		data.lists = listsT;
		var render = Mustache.render(template, data);
		$("#wftInfoList").append(render);

		//注册修改事件
		AgainRegisterClick();

		//推送kafka
		$(".pushkafka").click(function() {
			PushKafkaWftInfo($(this).attr('data-id'));
		});
		//推送支付类型
		$(".pushPayType").click(function() {
			if($(this).attr('data-code') != null && $(this).attr('data-code') != undefined && $(this).attr('data-code') != '') {
				PushWftPayTypeInfo($(this).attr('data-id'), $(this).attr('data-code'));
			} else {
				controlsHelper.alert('威富通商户号不存在，不可推送支付类型');
			}
		});
		//查看支付类型
		$(".payTypeView").click(function() {
			$("#pop2").show();
			GetWftPayTypeList($(this).attr('data-id'));
		});

		$(".isState").click(function() {
			if($(this).text() == '启用') {
				UpdateWftShopStateInfo($(this).attr('data-id'), '1');
			} else {
				UpdateWftShopStateInfo($(this).attr('data-id'), '0');
			}

		});

		//循环验证
		$("#wftInfoList").find('tr span.pushPayType').each(function() {
			if($(this).attr('data-code') == null || $(this).attr('data-code') == undefined && $(this).attr('data-code') == '') {
				$(this).hide();
			}
			//			else 
			//			{
			//				$(this).show();
			//			}
		});

		$("#infoTatal").html(data.total);
		//分页
		if(!isCreatePage) {
			isCreatePage = true;
			$('.pagination').jqPagination({
				current_page: 1,
				link_string: 'page={page_number}',
				max_page: Math.ceil(data.total / pageSize),
				paged: function(page) {
					console.log("第" + page + "页");
					curragePage = page;
					GetWftShopInfoList(curragePage);
				}
			});
		}
	}
};
/*
 * 功能：推送kafaka威富通信息
 * 创建人：liql
 * 创建时间：2017-1-11
 */
function PushKafkaWftInfo(wftId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	jsonParam.jsonStr = dataHelper.setJson(null, "wftId", wftId);
	console.log(jsonParam);
	wftInfoServer.PushKafkaWftInfo(jsonParam, callback_PushKafkaWftInfo);
};
/*
 * 功能：推送回调
 * 创建人：liql
 * 创建时间：2017-1-11
 */
function callback_PushKafkaWftInfo(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('推送kafaka威富通信息:' + data.rspDesc);
	} else {
		controlsHelper.alert('推送kafka成功');
	};
};
/*
 * 功能：推送威富通支付类型信息
 * 创建人：liql
 * 创建时间：2017-1-11
 */
function PushWftPayTypeInfo(wftId, wftShopCode) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "wftId", wftId);
	jsonstr = dataHelper.setJson(jsonstr, "wftShopCode", wftShopCode);
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	wftInfoServer.PushWftPayTypeInfo(jsonParam, callback_PushWftPayTypeInfo);
};
/*
 * 功能：推送支付类型回调
 * 创建人：liql
 * 创建时间：2017-1-11
 */
function callback_PushWftPayTypeInfo(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('推送威富通支付类型信息:' + data.rspDesc);
	} else {
		controlsHelper.alert('推送威富通支付类型信息成功');
	};
};

/*
 * 功能：获取威富通支付类型信息列表
 * 创建人：liql
 * 创建时间：2017-1-11
 */
function GetWftPayTypeList(wftId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	jsonParam.jsonStr = dataHelper.setJson(null, "wftId", wftId);
	console.log(jsonParam);
	wftInfoServer.GetWftPayTypeList(jsonParam, callback_GetWftPayTypeList);
};
/*
 * 功能：威富通信息支付类型回调函数
 * 创建人：liql
 * 创建时间：2017-1-11
 */
function callback_GetWftPayTypeList(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('查询支付类型列表失败:' + data.rspDesc);
	} else {
		var template = $("#payTypeInfoListTemplate").html();
		Mustache.parse(template);
		var listsT = new Array();
		$.each(data.lists, function(index, entry) {
			var value = JSON.stringify(entry);
			value = dataHelper.setJson(value, 'payTypeName', entry.payType == '1' ? '微信' : entry.payType == '0' ? '支付宝' : '');
			value = dataHelper.setJson(value, 'times', entry.backTime != null && entry.backTime != undefined && entry.backTime != '' ? entry.backTime.substr(0, 19) : '');
			listsT.push(jQuery.parseJSON(value));
		});
		data.lists = listsT;
		var render = Mustache.render(template, data);
		$("#payTypeInfoList").append(render);
	}
};

/*
 * 功能：威富通信息停用
 * 创建人：liql
 * 创建时间：2017-1-11
 */
function UpdateWftShopStateInfo(wftId, isState) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "wftId", wftId);
	jsonstr = dataHelper.setJson(jsonstr, "isState", isState);
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	wftInfoServer.UpdateWftShopStateInfo(jsonParam, callback_UpdateWftShopStateInfo);
};
/*
 * 功能：威富通信息停用回调
 * 创建人：liql
 * 创建时间：2017-1-11
 */
function callback_UpdateWftShopStateInfo(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('停用威富通支付类型信息:' + data.rspDesc);
	} else {
		controlsHelper.alert('停用威富通支付类型信息成功');
		isCreatePage = false;
		GetWftShopInfoList('1');

	};
};