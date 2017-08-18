var CurrPage = 1;
var PageSize = 10;
var isCreatePage = false;
var totalPage; //总页数
var merchantId; //所属商户id
var address = "";
var shopIdNum = ""; //网点9位编号
var shopNum = ""; //15位编码

$(document).ready(function() {
	//添加商户保存按钮
	fromValidate();
	$("#SubmitCreate").click(function() {
		shopIdNum = dataHelper.fRandomNumber('9', 'int');
		shopNum = dataHelper.fRandomNumber('15', 'int');
		/*InsertShoreInfo(merchantId);*/
		if (fromValidate().form()) {
			shopIdNum = dataHelper.fRandomNumber('9', 'int');
			shopNum = dataHelper.fRandomNumber('15', 'int');
			InsertShoreInfo(merchantId);
		}
	});
	$("#BtnSelect").click(function() {
		isCreatePage = false;
		GetMerchantList(1);
	});

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
 * 创建日期：2016-12-14
 * 功能：新增门店信息
 * 创建人：shiyina
 */
function InsertShoreInfo(merchantId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "merchantId", merchantId); //所属商户id
	jsonstr = dataHelper.setJson(jsonstr, "shopIdNum", shopIdNum); //网点9位编号
	jsonstr = dataHelper.setJson(jsonstr, "shopNum", shopNum); //15位编码
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
	businessShopServer.InsertShoreInfo(jsonParam, callback_InsertShoreInfo);
};

function callback_InsertShoreInfo(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('添加商户信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert("添加商户信息成功", "20%");
		AgainRegisterClick("StoreManage-StoreList","门店列表");
	}
};

function fromValidate() {
	return $("#SignupForm").validate({
		/* 设置验证规则 */
		rules: {
			mhtName: {
				required: true
			},
			storeName: {
				required: true,
				isName: true
			},
			posShopName: {
				required: true,
				isName: true
			},
			servicePhone: {
				isPhone: true
			}
		},
		/**/
		/* 设置错误信息 */
		messages: {
			mhtName: {
				required: "请选择商户/品牌"
			},
			storeName: {
				required: "请输入门店名称",
				isName: "请正确填写门店名称、不能有特殊符号、不能有空格"
			},
			posShopName: {
				required: "请输入POS显示门店名称",
				isName: "请正确填写POS显示门店名称、不能有特殊符号、不能有空格"
			},
			servicePhone: {
				isPhone: "请输入一个有效的联系电话"
			}
		},
		/* 设置错误信息提示DOM */
		errorPlacement: function(error, element) {
			error.appendTo(element.parent());
		},
	});
};