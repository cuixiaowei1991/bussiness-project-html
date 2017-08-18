var pageSize = 10;
var isCreatePage = false;
var curragePage = 1;
var data_elements;
var postype;
$(document).ready(function() {
	posSetHelper.setCheckBoxPosSet('.setInfo'); //加载菜单
	$("#SelectShop").click(function() {
		isCreatePage = false;
		GetMerchantList(curragePage);
	});
	//选择商户弹框
	$('.selectShop').click(function() {
		$("#pop2").show();
	});
	//全选
	$("#allCheck").click(function() {
		if ($(this).attr('checked') == 'checked') {
			$(this).prop('checked', false);
			$(this).removeAttr('checked');
			$(".setInfo").find('input[type=checkbox]').removeAttr('checked');
			$(".setInfo").find('input[type=checkbox]').prop('checked', false);

		} else {
			$(this).attr('checked', 'checked');
			$(this).prop('checked', true);
			$(".setInfo").find('input[type=checkbox]').attr('checked', 'checked');
			$(".setInfo").find('input[type=checkbox]').prop('checked', true);
		}
	});

	//选择商户查询
	$("#selectBtn").click(function() {
		isCreatePage = false;
		GetMerchantList(curragePage);
	});
	//提交配置
	$(".sumbitBtn").click(function() {
		var isPass = false;
		$(".posType").find("input[type='checkbox']").each(function() {
			if ($(this).attr('checked') == 'checked') {
				isPass = true;
			}
		});
		if (!isPass) {
			controlsHelper.alert('请选择pos类型');
		} else {
			InsertPosMenuSetInfo();
		}

	});
	//取pos类型
	data_elements = ".posType";
	dataValueHelper.GetDictionaryDataList("posType", '', '', '', GetDictionaryDataListCallback);

});
/*
 * 功能：获取商户信息列表
 * 创建人：liql
 * 创建时间：2016-12-13
 */
function GetMerchantList(curragePage) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};

	var jsonstr = dataHelper.setJson(null, 'mhtName', $("#menName").val());
	jsonstr = dataHelper.setJson(jsonstr, 'mhtIndustryNum', '');
	jsonstr = dataHelper.setJson(jsonstr, 'mhtProvinceId', '');
	jsonstr = dataHelper.setJson(jsonstr, 'mhtCityId', '');
	jsonstr = dataHelper.setJson(jsonstr, 'mhtBeanchCompId', '');
	jsonstr = dataHelper.setJson(jsonstr, 'mhtAgentId', '');
	jsonstr = dataHelper.setJson(jsonstr, 'mhtOpenChannel', '');
	jsonstr = dataHelper.setJson(jsonstr, 'mhtStartCreateTime', '');
	jsonstr = dataHelper.setJson(jsonstr, 'mhtEndCreateTime', '');
	jsonstr = dataHelper.setJson(jsonstr, 'mhtApproveStatus', '');
	jsonstr = dataHelper.setJson(jsonstr, 'curragePage', curragePage);
	jsonstr = dataHelper.setJson(jsonstr, 'pageSize', pageSize);
	jsonParam.jsonStr = jsonstr;
	console.log(jsonstr);
	businessShopServer.GetMerchantList(jsonParam, callback_getMerchantList);
};
/*
 * 功能：获取商户信息列表回调函数
 * 创建人：liql
 * 创建时间：2016-12-13
 */
function callback_getMerchantList(data) {
	console.log(data);
	$("#merchantList").html('');
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('获取商户信息失败:' + data.rspDesc);
	} else {
		var template = $("#merchantListTemplate").html();
		Mustache.parse(template);
		var rendered = Mustache.render(template, data);
		$("#merchantList").append(rendered);

		//选取
		$('.selected').click(function() {
			console.log($(this).attr('name'));
			//			selectShopId = $(this).attr('id');
			$("#merchantId").val($(this).attr('name'));
			$("#merchantId").attr('data-id', $(this).attr('id'));
			$("#pop2").hide();
			GetShoreList($(this).attr('id'));
		});
		$("#countsPage").html(data.total);
		//分页
		if (!isCreatePage) {
			isCreatePage = true;
			$('.pagination').jqPagination({
				link_string: 'page={page_number}',
				max_page: Math.ceil(data.total / pageSize),
				paged: function(page) {
					console.log("第" + page + "页");
					curragePage = page;
					//增加一页调用刷新一次
					GetMerchantList(curragePage);
				}
			});
		}


	};
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
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('查询门店信息失败:' + data.rspDesc);
	} else {
		var storeList = new Array();
		$.each(data.lists, function(index, entry) {
			var value = dataHelper.setJson(null, 'name', entry.storeName);
			value = dataHelper.setJson(value, 'value', entry.storeId);
			storeList.push(jQuery.parseJSON(value));
		});
		controlsHelper.downBoxUlLi('全部门店', storeList, "#storeId", ".storeId");
		$("#storeId").find('li').click(function() {
			postype = '';
			$(".posType").find("input[type='checkbox']").each(function() {
				if ($(this).attr('checked')) {
					postype = $(this).attr('data-value');
				}
			});
			if (postype != '') {
				GetPosMenuSetInfo();
			}

		});
	}

};
/*
 * 功能：新增业务菜单配置
 * 创建人：liql
 * 创建时间：2016-12-15
 */
function InsertPosMenuSetInfo() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	//配置类型
	var posType = '';
	$(".posType").find("input[type='checkbox']").each(function() {
		if ($(this).attr('checked')) {
			posType += $(this).attr('data-value') + ",";
		}
	});
	posType = posType != '' ? posType.substr(0, posType.length - 1) : posType;
	var jsonstr = dataHelper.setJson(null, 'posType', posType);
	$(".setInfo").find('input[type=radio]').each(function() {
		console.log($(this));
	});
	//获取选中值
	var config = '';
	$(".setInfo").find('input[type=checkbox]').each(function() {
		if ($(this).attr('checked') == 'checked') {
			config += "1";
		} else {
			config += "0";
		}
	});
	jsonstr = dataHelper.setJson(jsonstr, 'limitConfiguration', config);
	jsonstr = dataHelper.setJson(jsonstr, 'merchantId', $("#merchantId").attr('data-id'));
	jsonstr = dataHelper.setJson(jsonstr, 'storeId', $(".storeId").attr('data-value') == undefined || $(".storeId").attr('data-value') == null ? '' : $(".storeId").attr('data-value'));
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	businessPosServer.InsertPosMenuSetInfo(jsonParam, callback_InsertPosMenuSetInfo);
};
/*
 * 功能：新增业务菜单配置回调
 * 创建人：liql
 * 创建时间：2016-12-15
 */
function callback_InsertPosMenuSetInfo(data) {
	console.log(data);
	if (data == undefined || data == null || data.rspCode != "000") {
		alert(data.rspDesc);
	} else {
		controlsHelper.alert("新增终端配置成功", "20%");
		$("#pop2").hide();
	}
};
/*
 * 功能：获取终端菜单配置
 * 创建人：liql
 * 创建时间：2017-1-7
 */
function GetPosMenuSetInfo() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	//配置类型
	var jsonstr = dataHelper.setJson(null, 'posType', postype);
	jsonstr = dataHelper.setJson(jsonstr, 'merchantId', $("#merchantId").attr('data-id'));
	jsonstr = dataHelper.setJson(jsonstr, 'storeId', $(".storeId").attr('data-value') == undefined || $(".storeId").attr('data-value') == null ? '' : $(".storeId").attr('data-value'));
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	businessPosServer.GetPosMenuSetInfo(jsonParam, callback_GetPosMenuSetInfo);
};
/*
 * 功能：获取终端菜单配置信息列表
 * 创建人：liql
 * 创建时间：2017-1-7
 */
function callback_GetPosMenuSetInfo(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		if (data.rspCode != '002') {
			controlsHelper.alert('查询终端菜单配置信息列表失败:' + data.rspDesc);
		}
		$(".setInfo").find("input[type='checkbox']").removeAttr('checked');
		$(".setInfo").find("input[type='checkbox']").prop('checked', false);
	} else {
		var config = data.limitConfiguration;
		for (var i = 0; i < config.length; i++) {
			var str = config.substr(i, 1);
			if (str == '1') {
				$(".setInfo").find('input[type=checkbox]').eq(i).attr('checked', 'checked');
				$(".setInfo").find('input[type=checkbox]').eq(i).prop('checked', true);
			} else {
				$(".setInfo").find('input[type=checkbox]').eq(i).removeAttr('checked');
				$(".setInfo").find('input[type=checkbox]').eq(i).prop('checked', false);
			}
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
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('查询码表信息失败:' + data.rspDesc);
	} else {
		$(data_elements).empty();
		$.each(data.lists, function(index, entry) {
			$(data_elements).append("<label><input type='checkbox' data-value=" + entry.data_code + " />" + entry.data_name + "   </label>");
		});
		//选择pos类型
		$(".posType").find("input[type='checkbox']").click(function() {
			if ($(this).attr('checked') == 'checked') {
				$(this).removeAttr('checked');
				$(this).prop('checked', false);
//				$(".setInfo").find("input[type='checkbox']").removeAttr('checked');
//				$(".setInfo").find("input[type='checkbox']").prop('checked', false);
			} else {
				$(this).attr('checked', 'checked');
				$(this).prop('checked', true);
				postype = $(this).attr('data-value');
				if ($("#merchantId").attr('data-id') != undefined && $("#merchantId").attr('data-id') != null &&
					$("#merchantId").attr('data-id') != '' && $(".storeId").attr('data-value') != null && $(".storeId").attr('data-value') != undefined &&
					$(".storeId").attr('data-value') != '') {
					GetPosMenuSetInfo();
				}

			}
		});

	}
};