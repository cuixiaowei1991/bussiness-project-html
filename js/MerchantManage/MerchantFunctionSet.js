var CurrPage = 1;
var PageSize = 10;
var isCreatePage = false;
var totalPage; //总页数
var merchantId; //商户Id
$(document).ready(function() {
	//获取所有菜单及功能信息列表（已启用状态）
	GetShopMenuFuncInfoList();
	//查看商户名称搜索
	$("#ViewMerchant").click(function() {
		isCreatePage = false;
		GetMerchantList(CurrPage);
	});
	//新增商户设置操作事件
	$("#SubmitSetup").click(function() {
		InsertMerchantSetInfo(merchantId)
	});
});

/*
 * 创建日期：2016-12-13
 * 功能：获取所有菜单及功能信息列表（已启用状态）
 * 创建人：shiyina
 */
function GetShopMenuFuncInfoList() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	shopUserServer.GetShopMenuFuncInfoList(jsonParam, callback_GetShopMenuFuncInfoList)
};

function callback_GetShopMenuFuncInfoList(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('查看所有菜单及功能信息失败:' + data.rspDesc);
	} else {
		$("#callBackData").html("");
		var template = $("#callBacklist").html();
		Mustache.parse(template);
		//添加到网页
		var rendered = Mustache.render(template, data);
		$("#callBackData").append(rendered);

		$.each(data.lists, function(index, entry) {
			if ($("#SelectAll").prop('checked')) {
				$("#" + entry.funcTopMenuId).prop("checked", true);
				$("#" + entry.funcTopMenuId).parent().next().find('input').prop("checked", true);
			}
			$("#SelectAll").click(function() {
				if ($("#SelectAll").prop('checked')) {
					$("#" + entry.funcTopMenuId).prop("checked", true);
					$("#" + entry.funcTopMenuId).parent().next().find('input').prop("checked", true);
				} else {
					$("#" + entry.funcTopMenuId).prop("checked", false);
					$("#" + entry.funcTopMenuId).parent().next().find('input').prop("checked", false);
				}
			})
			$("#" + entry.funcTopMenuId).click(function() {
				if ($(this).prop("checked")) {
					$(this).parent().next().find('input').prop("checked", true);
				} else {
					$(this).parent().next().find('input').prop("checked", false);
				}
			});
			if ($("#" + entry.funcTopMenuId).parent().next().find('input').prop("checked")) {
				$("#" + entry.funcTopMenuId).prop("checked", true);
			}

			$("#" + entry.funcTopMenuId).parent().next().find('input').click(function() {
				if ($("#" + entry.funcTopMenuId).parent().next().find('input:checked').length == $("#" + entry.funcTopMenuId).parent().next().find('input').length) {
					$("#" + entry.funcTopMenuId).prop("checked", true);
				} else {
					$("#" + entry.funcTopMenuId).prop("checked", false);
				}
			});

		});
		isCreatePage = false;
		GetMerchantList(CurrPage);
	};
};
/*
 * 创建日期：2016-12-13
 * 功能：获取商户列表
 * 创建人：shiyina
 */
function GetMerchantList(CurrPage) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", CurrPage); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", PageSize); //每页显示记录数
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
	console.log(jsonParam);
	businessShopServer.GetMerchantList(jsonParam, callback_GetMerchantList)
};

function callback_GetMerchantList(data) {
	console.log(data);
	if (data == undefined) {
		return;
	}
	if (data.rspCode != "000" || data.rspCode == null) {
		console.log(data.rspDesc);
		return;
	}
	$("#TotalNumber").html(data.total);
	$("#mhtName").html(data.mhtName);
	$("#MerchantList").html('');
	var template = $("#MerchantListTemplate").html();
	Mustache.parse(template);

	var rendered = Mustache.render(template, data);
	$("#MerchantList").append(rendered);

	$(".Selection").click(function() {
		$("#mhtName").val($(this).attr('data-mhtName'));
		$("#pop2").hide();
		ShowSlider();
		$("#callBackData").find('input').attr('checked', false);
		$("#SelectAll").attr('checked', false);
		merchantId = $(this).attr('data-mhtId');
		GetMerchantSetInfoById(merchantId);
	});

	//总条数
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
				GetMerchantList(CurrPage);
			}
		});
	}
};

/*获取代理商设置信息*/
function GetMerchantSetInfoById(merchantId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "merchantId", merchantId);
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	shopUserServer.GetMerchantSetInfoById(jsonParam, callback_GetMerchantSetInfoById);


};

function callback_GetMerchantSetInfoById(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('获取商户设置信息失败:' + data.rspDesc);
	} else {
		$.each(data.merchantMenuId, function(index, entry) {
			/*让已有的选中*/
			$("#" + entry).prop("checked", "checked");
			$("#" + entry).click();
		});
		$.each(data.merchantFunId, function(index, entry) {
			/*让已有的选中*/
			$("#" + entry).prop("checked", "checked").click();
			$("#" + entry).click();
		});
	};
};


/*
 * 创建日期：2016-12-13
 * 功能：新增商户设置信息
 * 创建人：shiyina
 */
function InsertMerchantSetInfo(merchantId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var myjsonStr = dataHelper.setJson(null, "merchantId", merchantId); //用户id
	myjsonStr = dataHelper.setJson(myjsonStr, "lists", listArray2());
	jsonParam.jsonStr = myjsonStr;
	console.log(jsonParam);
	shopUserServer.InsertMerchantSetInfo(jsonParam, callback_InsertMerchantSetInfo);
};

function callback_InsertMerchantSetInfo(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('新增商户设置信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert("添加成功", "20%")
	};
};

function listArray1() {
	var addObj = "{}";
	var addArray = new Array();
	//遍历
	$("#callBackData p>input").each(function() {
		if ($(this).is(':checked')) {
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
		if ($(this).is(':checked') && $(this).parent().is(":visible")) {
			addObj2 = dataHelper.setJson(addObj2, 'merchantFunId', $(this).attr("data-funcId"));
			addObj2 = dataHelper.setJson(addObj2, 'merchantMenuId', $(this).attr("data-menuId"));
			addObj2 = dataHelper.setJson(addObj2, 'systemId', $(this).attr("data-systemId"));
			addArray2.push(jQuery.parseJSON(addObj2));
		};
		console.log(addArray2);
	});
	return addArray2;

};