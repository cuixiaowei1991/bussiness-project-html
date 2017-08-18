var CurrPage = 1;
var PageSize = 20;
var isCreatePage = false;
var currageMerchPage = 1;
var PageMerchSize = 10;
var isMerchCreatePage = false;
var totalPage; //总页数
var storeId; //门店id
var storeName; //门店名称
var merchantId; //所属商户id
var merchantName; //所属商户名称
$(document).ready(function() {
	//获取商户列表
	isMerchCreatePage = false;
	GetMerchantList(currageMerchPage)
		//商户名称搜索查看操作按钮事件 
	$("#ViewMerchant").click(function() {
		isMerchCreatePage = false;
		GetMerchantList(currageMerchPage);
	});

	//查询门店操作按钮事件
	$("#searchBtn").click(function() {
		event.preventDefault();
		isCreatePage = false;
		GetShoreList(CurrPage);
	});

	//添加门店操作按钮
	/*$("#AddStore").click(function() {
		location.href = "StoreAdd.html";
	});*/
	$("#BulkExport").click(function() {
		StoreExcelExport(CurrPage);
	});
	//清空按钮操作事件
	$("#BtneEmpty").click(function() {
		$("#mhtName").val('');
		$("#mhtName").attr('data-mhtid', '')
	});
});
/*
 * 创建日期：2016-12-19
 * 功能：获取门店列表
 * 创建人：shiyina
 */
function GetShoreList(CurrPage) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var myjsonStr = dataHelper.setJson(null, "storeName", $("#storeName").val());
	myjsonStr = dataHelper.setJson(myjsonStr, "merchantId", $("#mhtName").attr("data-mhtId") == undefined ? '' : $("#mhtName").attr("data-mhtId"));
	myjsonStr = dataHelper.setJson(myjsonStr, "provinceId", $(".province").attr("data-value") == undefined ? '' : $(".province").attr("data-value"));
	myjsonStr = dataHelper.setJson(myjsonStr, "cityId", $(".city").attr("data-value") == undefined ? '' : $(".city").attr("data-value"));
	myjsonStr = dataHelper.setJson(myjsonStr, "countryId", $(".country").attr("data-value") == undefined ? '' : $(".country").attr("data-value"));
	var storeStatus = 1;
	if ($("#storeStatus1").prop("checked")) {
		storeStatus = 1;
	} else {
		storeStatus = 0;
	}
	myjsonStr = dataHelper.setJson(myjsonStr, "storeStatus", storeStatus); //0:停用 1：启用
	myjsonStr = dataHelper.setJson(myjsonStr, "curragePage", CurrPage);
	myjsonStr = dataHelper.setJson(myjsonStr, "pageSize", PageSize);
	jsonParam.jsonStr = myjsonStr;
	console.log(jsonParam);
	businessShopServer.GetShoreList(jsonParam, callback_GetShoreList);
};

function callback_GetShoreList(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('获取门店列表信息失败:' + data.rspDesc);
	} else {
		$("#dictList").html("");
		var template = $("#dictListTemplate").html();
		Mustache.parse(template);

		//添加到网页
		var rendered = Mustache.render(template, data);
		$("#dictList").append(rendered);

		$("#dictList tr").find('td').each(function() {
			if ($(this).attr('data-storeStatus') == 1) {
				$(this).html('启用');
			}
			if ($(this).attr('data-storeStatus') == 0) {
				$(this).html('停用');
			}
		});

		//删除按钮操作事件
		$(".btnDelete").click(function() {
			storeId = $(this).attr('data-storeId');
			$("#sureDeleteBtn").unbind('click');
			$("#sureDeleteBtn").click(function() {
				DeleteShoreInfo(storeId);
			});
		});
		AgainRegisterClick();
		//修改按钮操作事件
		/*$(".btnModify").click(function() {
			storeId = $(this).attr('data-storeId');
			location.href = 'StoreEdit.html?storeId=' + storeId;
		});*/

		//查看按钮操作事件
		/*$(".seeBtn").click(function() {
			storeId = $(this).attr('data-storeId');
			location.href = 'StoreView.html?storeId=' + storeId;
		});*/
		//POS配置按钮操作事件
//		$(".posSetBtn").click(function() {
//			storeId = $(this).attr('data-storeId'); //门店id
//			storeName = $(this).attr('data-storeName'); //门店名称
//			merchantId = $(this).attr('data-merchantId'); //所属商户id
//			merchantName = $(this).attr('merchantName'); //所属商户名称
//			location.href = '../../html/BusinessManage/addPos.html?storeId=' + storeId + '&storeName=' + storeName + '&merchantId=' + merchantId + '&merchantName=' + merchantName;
//		});
		//总条数
		$(".total").html(data.total);
		if (!isCreatePage) {
			isCreatePage = true;
			$('#shotePage').jqPagination({
				link_string: 'page={page_number}',
				max_page: Math.ceil(data.total / PageSize),
				paged: function(page) {
					console.log("第" + page + "页");
					CurrPage = page;
					//增加一页调用刷新一次
					GetShoreList(CurrPage);
				}
			});
		}
	};
};


/*
 * 创建日期：2016-12-13
 * 功能：获取商户列表
 * 创建人：shiyina
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
	console.log(jsonParam);
	businessShopServer.GetMerchantList(jsonParam, callback_GetMerchantList)
};

function callback_GetMerchantList(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('查询商户列表信息失败:' + data.rspDesc);
	} else {
		$("#MerchantList").html('');
		var template = $("#MerchantListTemplate").html();
		Mustache.parse(template);

		var rendered = Mustache.render(template, data);
		$("#MerchantList").append(rendered);

		$("#TotalNumber").html(data.total);

		$(".Selection").click(function() {
			$("#mhtName").val($(this).attr('data-mhtName'));
			$("#pop2").hide();
			ShowSlider();
			$("#mhtName").attr('data-mhtId', $(this).attr('data-mhtId'))
			merchantId = $(this).attr('data-mhtId');
		});
		//总条数
		$(".TotalNumber").html(data.total);
		if (!isMerchCreatePage) {
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
		isCreatePage = false;
		GetShoreList(1);
	}
};

/*
 * 创建日期：2016-11-21
 * 功能：删除用户信息
 * 创建人：shiyina
 */
function DeleteShoreInfo(storeId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "storeId", storeId); //用户id
	jsonParam.jsonStr = jsonstr;
	console.log(jsonstr);
	businessShopServer.DeleteShoreInfo(jsonParam, callback_DeleteShoreInfo);
};

function callback_DeleteShoreInfo(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('删除用户信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert("删除成功", "20%");
		isCreatePage = false;
		GetShoreList(CurrPage);
	}
};
/*导出*/

function StoreExcelExport(CurrPage) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var myjsonStr = dataHelper.setJson(null, "storeName", $("#storeName").val());
	myjsonStr = dataHelper.setJson(myjsonStr, "merchantId", $("#mhtName").attr("data-mhtId") == undefined ? '' : $("#mhtName").attr("data-mhtId"));
	myjsonStr = dataHelper.setJson(myjsonStr, "provinceId", $(".province").attr("data-value") == undefined ? '' : $(".province").attr("data-value"));
	myjsonStr = dataHelper.setJson(myjsonStr, "cityId", $(".city").attr("data-value") == undefined ? '' : $(".city").attr("data-value"));
	myjsonStr = dataHelper.setJson(myjsonStr, "countryId", $(".country").attr("data-value") == undefined ? '' : $(".country").attr("data-value"));
	var storeStatus = 1;
	if ($("#storeStatus1").prop("checked")) {
		storeStatus = 1;
	} else {
		storeStatus = 0;
	}
	myjsonStr = dataHelper.setJson(myjsonStr, "storeStatus", storeStatus); //0:停用 1：启用
	myjsonStr = dataHelper.setJson(myjsonStr, "curragePage", CurrPage);
	myjsonStr = dataHelper.setJson(myjsonStr, "pageSize", PageSize);
	jsonParam.jsonStr = myjsonStr;
	console.log(jsonParam);
	businessShopServer.ExportGetShoreList(jsonParam, callback_StoreExcelExport);
};

/*导出回调*/
function callback_StoreExcelExport(data) {
	console.log(data);
	if (data == undefined || data == null || data.rspCode != "000") {
		alert(data.rspDesc);
	} else {
		console.log(data.contextPath);
		location.href = data.contextPath;
	};
};