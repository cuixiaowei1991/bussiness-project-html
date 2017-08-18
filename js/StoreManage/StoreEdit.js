var CurrPage = 1;
var PageSize = 10;
var isCreatePage = false;
var totalPage; //总页数
var merchantId; //所属商户id
var storeId; //门店id
var address = "";
$(document).ready(function() {
	storeId = dataHelper.QueryString("storeId");
	setTimeout(function() {
		//获取门店信息
		GetShoreInfoById(storeId);
		setTimeout(function() {
			codeAddress();
		}, 1000);
	}, 1000);

	//获取商户列表
	$("#BtnSelect").click(function() {
		isCreatePage = false;
		GetMerchantList(1);
	});
	//地图标示操作按钮事件

	$("#codeAddress").click(function() {
		if (address) {
			address = '';
		} else {
			if ($("#province").parent().children(":first").html() != "省"); {
				address = address + $("#province").parent().children(":first").html() + ",";
			}
			if ($("#city").parent().children(":first").html() != "市"); {
				address = address + $("#city").parent().children(":first").html() + ",";
			}
			if ($("#county").parent().children(":first").html() != "县"); {
				address = address + $("#county").parent().children(":first").html() + ",";
			}
			address = address + $("#storeAddress").val();
			console.log(address);
			if (address != undefined && address != "") {
				geocoder.getLocation(address);
			}
		}
	});

	//选择商户查看按钮操作事件
	$("#ViewMerchant").click(function() {
		isCreatePage = false;
		GetMerchantList('1');
	});
	//提交修改
	fromValidate();
	$("#SubmitCreate").click(function() {
		if (fromValidate().form()) {
			event.preventDefault();
			UpdateShoreInfo(storeId, merchantId);
		};
	});

});

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
			$("#storeName").val($(this).attr('data-mhtShortName'));
			$("#storeShortName").val($(this).attr('data-mhtShortName'));
			$("#posShopName").val($(this).attr('data-mhtShortName'));
			$("#pop2").hide();
			ShowSlider();
			merchantId = $(this).attr('data-mhtId');
		});
		//总条数
		$("#TotalNumber").html(data.total);
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
	}
};

/*
 * 创建日期：2016-12-16
 * 功能：获取门店信息
 * 创建人：shiyina
 */
function GetShoreInfoById(storeId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "storeId", storeId); //所属商户id

	jsonParam.jsonStr = jsonstr;
	console.log(jsonstr);
	businessShopServer.GetShoreInfoById(jsonParam, callback_GetShoreInfoById);
};

function callback_GetShoreInfoById(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('查询门店信息失败:' + data.rspDesc);
	} else {
		$("#mhtName").val(data.merchantName);
		$("#storeName").val(data.storeName);
		$("#storeShortName").val(data.storeShortName);
		$("#posShopName").val(data.posShopName);
		$("#servicePhone").val(data.servicePhone);

		$(".province").attr('data-value', data.provinceId);
		$("#province").find('li').each(function() {
			if ($(this).attr('value') == data.provinceId) {
				$("#province").find("li[value=" + $(this).attr('value') + "]").click();
				$('.province').html($(this).find('a').html());
			}
		});
		$(".city").attr('data-value', data.cityId);
		$("#city").find('li').each(function() {
			if ($(this).attr('value') == data.cityId) {
				$("#city").find("li[value=" + $(this).attr('value') + "]").click();
				$('.city').html($(this).find('a').html());
			}
		});

		$(".county").attr('data-value', data.countryId);
		$("#county").find('li').each(function() {
			if ($(this).attr('value') == data.countryId) {
				$("#county").find("li[value=" + $(this).attr('value') + "]").click();
				$('.county').html($(this).find('a').html());
			}
		});

		$("#storeAddress").val(data.storeAddress.split(',')[3]);

		$("#lat").html(data.locationTude.split(',')[0]);
		$("#lng").html(data.locationTude.split(',')[1]);

		if (data.storeStatus == 1) {
			$("#storeStatus").attr("checked", true);
		} else {
			$("#storeStatus").attr("checked", false);
		}
	}
};



/*
 * 创建日期：2016-12-14
 * 功能：修改门店信息
 * 创建人：shiyina
 */
function UpdateShoreInfo(storeId, merchantId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "storeId", storeId); //门店id
	jsonstr = dataHelper.setJson(jsonstr, "merchantId", merchantId); //商户id
	jsonstr = dataHelper.setJson(jsonstr, "storeName", $("#storeName").val());
	jsonstr = dataHelper.setJson(jsonstr, "storeShortName", $("#storeShortName").val());
	jsonstr = dataHelper.setJson(jsonstr, "posShopName", $("#posShopName").val());
	jsonstr = dataHelper.setJson(jsonstr, "servicePhone", $("#servicePhone").val());
	jsonstr = dataHelper.setJson(jsonstr, "provinceId", $(".province").attr('data-value') == undefined ? '' : $(".province").attr('data-value')); //省id
	jsonstr = dataHelper.setJson(jsonstr, "cityId", $(".city").attr('data-value') == undefined ? '' : $(".city").attr('data-value')); //市id
	jsonstr = dataHelper.setJson(jsonstr, "countryId", $(".county").attr('data-value') == undefined ? '' : $(".county").attr('data-value')); //县id

	jsonstr = dataHelper.setJson(jsonstr, "provinceName", $(".province").html());
	jsonstr = dataHelper.setJson(jsonstr, "cityName", $(".city").html());
	jsonstr = dataHelper.setJson(jsonstr, "countryName", $(".county").html());

	console.log(address);
	jsonstr = dataHelper.setJson(jsonstr, "storeAddress", address);
	console.log($("#lat").html() + "," + $("#lng").html());
	jsonstr = dataHelper.setJson(jsonstr, "locationTude", $("#lat").html() + "," + $("#lng").html()); //网点经纬度

	var storeStatus;
	if ($("#storeStatus").is(":checked")) {
		storeStatus = '1';
	} else {
		storeStatus = '0';
	}
	jsonstr = dataHelper.setJson(jsonstr, "storeStatus", storeStatus); //是否启用0:停用 1：启用
	jsonParam.jsonStr = jsonstr;
	console.log(jsonstr);
	businessShopServer.UpdateShoreInfo(jsonParam, callback_UpdateShoreInfo);
};

function callback_UpdateShoreInfo(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('修改商户信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert("修改商户信息成功", "20%");
		AgainRegisterClick("StoreManage-StoreList","门店列表");
	}
};