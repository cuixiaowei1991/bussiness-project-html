var curragePageBank = 1; //当前页
var pageSize = 10; //每页显示记录条数
var isBankCreatePage = false; //是否创建分页
var curragePageShop = 1; //当前页
var isShopCreatePage = false; //是否创建分页
var wftId;
var wftShopCode; //威富通商户号
var backAccountId; //威富通返回账户id
$(document).ready(function() {

	wftId = dataHelper.QueryString('wftId');

	//选择商户弹框
	$('.selectShop').click(function() {
		$("#pop2").show();

	});
	//选择联行号弹框
	$('.selectBank').click(function() {
		$("#pop1").show();

	});
	//查询商户
	$('#selectBtn').click(function() {
		isShopCreatePage = false;
		GetMerchantList('1');
	});
	//查询联行
	$('#selectBtnBank').click(function() {
		isBankCreatePage = false;
		GetWftBankCodeList('1');
	});
	fromValidate();
	/*
	 * 功能：修改全部
	 */
	$("#sumbitAll").click(function() {
		//验证
		if(fromValidate().form()) {
			UpdateWftShopInfo();
		}
	});
	//同步账户信息
	$("#pushAccount").click(function() {
		SynWftAccountInfo();
	});
	//保存账户信息
	$("#submitAccount").click(function() {
		//验证
		if(fromValidate().form()) {
			UpdateWftAccountInfo();
		}
	});
	//保存费率信息
	$("#sumbitBill").click(function() {
		//验证
		if(fromValidate().form()) {
			UpdateWftBillInfo();
		}
	});

	//获取银行码表信息
	dataValueHelper.GetDictionaryDataList("wftBank", '', '', '', callback_getBankInfo);
});
/*
 * 功能：权限设置
 * 创建人：liql
 * 创建时间：2017-1-11
 */
function LimitSet(shopCode, accountId) {
	if(shopCode != undefined && shopCode != null && shopCode != '') {
		$(".basicInfo").find('input').attr('disabled', 'disabled');
		$(".basicInfo").find('button').attr('disabled', 'disabled');
		$("#sumbitAll").hide();
		$("#sumbitBill").show();
		$("#pushAccount").show();
	}
	if(accountId != undefined && accountId != null && accountId != '') {
		$("#submitAccount").show();
	} else {
		$(".accountInfo").find('input').attr('disabled', 'disabled');
		$(".accountInfo").find('button').attr('disabled', 'disabled');
	}
};
/*
 * 功能：获取银行码表信息
 * 创建人：liql
 * 创建时间：2017-1-11
 */
function callback_getBankInfo(data) {
	console.log(data);
	$('#wftBank').empty();
	$.each(data.lists, function(index, entry) {
		console.log('xx');
		$('#wftBank').append("<label class='control-label'> <input type='radio' name='typeName'  value='" + entry.data_code + "'  />" + entry.data_name + "&nbsp;&nbsp;&nbsp; </label>");
	});
	$('#wftBank').find('input[type=radio]').eq(0).attr('checked', 'checked');
	$('#wftBank').find('input[type=radio]').eq(0).prop('checked', true);
	//li改变事件
	$('#wftBank').find('input[type=radio]').click(function() {
		$('#wftBank').find('input[type=radio]').removeAttr('checked');
		$('#wftBank').find('input[type=radio]').prop('checked', false);
		$(this).attr('checked', 'checked');
		$(this).prop('checked', true);
	});
	GetWftShopInfo();
}

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
	//	console.log(jsonstr);
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
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('获取商户信息失败:' + data.rspDesc);
	} else {
		var template = $("#merchantListTemplate").html();
		Mustache.parse(template);
		var rendered = Mustache.render(template, data);
		$("#merchantList").append(rendered);

		//选取
		$('.selected').click(function() {
			//			selectShopId = $(this).attr('id');
			$("#merchantId").val($(this).attr('name'));
			$("#merchantId").attr('data-id', $(this).attr('id'));
			$("#pop2").hide();
		});
		//分页
		$("#countsPage").html(data.total);
		if(!isShopCreatePage) {
			isShopCreatePage = true;
			$('#shopPagination').jqPagination({
				link_string: 'page={page_number}',
				max_page: Math.ceil(data.total / pageSize),
				paged: function(page) {
					console.log("第" + page + "页");
					curragePageShop = page;
					//增加一页调用刷新一次
					GetMerchantList(curragePageShop);
				}
			});
		}
	};
};
/*
 * 功能：获取联行信息列表
 * 创建人：liql
 * 创建时间：2016-12-13
 */
function GetWftBankCodeList(curragePage) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};

	var jsonstr = dataHelper.setJson(null, 'bankCode', $("#bankCode").val());
	jsonstr = dataHelper.setJson(jsonstr, 'bankName', $("#bankName").val());
	jsonstr = dataHelper.setJson(jsonstr, 'curragePage', curragePage);
	jsonstr = dataHelper.setJson(jsonstr, 'pageSize', pageSize);
	jsonParam.jsonStr = jsonstr;
	//	console.log(jsonstr);
	wftInfoServer.GetWftBankCodeList(jsonParam, callback_GetWftBankCodeList);
};
/*
 * 功能：获取联行列表回调函数
 * 创建人：liql
 * 创建时间：2016-12-13
 */
function callback_GetWftBankCodeList(data) {
	console.log(data);
	$("#merchantList").html('');
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('获取联行信息失败:' + data.rspDesc);
	} else {
		var template = $("#bankListTemplate").html();
		Mustache.parse(template);
		var rendered = Mustache.render(template, data);
		$("#bankList").append(rendered);

		//选取
		$('.selectedBank').click(function() {
			//			selectShopId = $(this).attr('id');
			$("#lhBankName").val($(this).attr('name'));
			$("#lhBankCode").val($(this).attr('id'));
			$("#pop1").hide();
		});
		//分页
		$("#countsPageBank").html(data.total);
		if(!isBankCreatePage) {
			isBankCreatePage = true;
			$('#bankPagination').jqPagination({
				link_string: 'page={page_number}',
				max_page: Math.ceil(data.total / pageSize),
				paged: function(page) {
					console.log("第" + page + "页");
					curragePageBank = page;
					//增加一页调用刷新一次
					GetWftBankCodeList(curragePageBank);
				}
			});
		}
	};
};
/*
 * 功能：修改威富通信息
 * 创建人：liql
 * 创建时间：2017-1-11
 */
function UpdateWftShopInfo() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, 'wftId', wftId);
	jsonstr = dataHelper.setJson(jsonstr, 'shopName', $("#merchantId").val());
	jsonstr = dataHelper.setJson(jsonstr, 'shopId', $("#merchantId").attr('data-id'));
	jsonstr = dataHelper.setJson(jsonstr, 'wftIndustry', $(".industry").attr('data-value') == undefined || $(".industry").attr('data-value') == null ? '' : $(".industry").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, 'wftBank', $("#wftBank").find("input[type='radio'][checked='checked']").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, 'province', $(".province").attr('data-value') == undefined || $(".province").attr('data-value') == null ? '' : $(".province").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, 'city', $(".city").attr('data-value') == undefined || $(".city").attr('data-value') == null ? '' : $(".city").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, 'address', $("#address").val());
	jsonstr = dataHelper.setJson(jsonstr, 'principal', $("#principal").val());
	jsonstr = dataHelper.setJson(jsonstr, 'principalEmail', $("#principalEmail").val());
	jsonstr = dataHelper.setJson(jsonstr, 'bankAccountName', $("#bankAccountName").val());
	jsonstr = dataHelper.setJson(jsonstr, 'bankCardNum', $("#bankCardNum").val());
	jsonstr = dataHelper.setJson(jsonstr, 'bankId', $(".bankId").attr('data-value') == undefined || $(".bankId").attr('data-value') == null ? '' : $(".bankId").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, 'accountType', $("#accountType").find("input[type='radio'][checked='checked']").attr('value'));
	jsonstr = dataHelper.setJson(jsonstr, 'lhBankCode', $("#lhBankCode").val());
	jsonstr = dataHelper.setJson(jsonstr, 'lhBankName', $("#lhBankName").val());
	jsonstr = dataHelper.setJson(jsonstr, 'bankProvince', $(".provinceLh").attr('data-value') == undefined || $(".provinceLh").attr('data-value') == null ? '' : $(".provinceLh").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, 'bankCity', $(".cityLh").attr('data-value') == undefined || $("cityLh").attr('data-value') == null ? '' : $(".cityLh").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, 'idCardType', $(".idCardType").attr('data-value') == undefined || $(".idCardType").attr('data-value') == null ? '' : $(".idCardType").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, 'idCardNo', $("#idCardNo").val());
	jsonstr = dataHelper.setJson(jsonstr, 'idCardAddress', $("#idCardAddress").val());
	jsonstr = dataHelper.setJson(jsonstr, 'idCardPhone', $("#idCardPhone").val());
	jsonstr = dataHelper.setJson(jsonstr, 'wftWXBill', $("#wftWXBill").val());
	jsonstr = dataHelper.setJson(jsonstr, 'wftZFBBill', $("#wftZFBBill").val());
	jsonstr = dataHelper.setJson(jsonstr, 'thirdCode', $("#thirdCode").val());
	jsonstr = dataHelper.setJson(jsonstr, 'isState', $("#isState").attr('checked') == 'checked' ? '1' : '0');
	jsonstr = dataHelper.setJson(jsonstr, 'isImport', '0');
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	wftInfoServer.UpdateWftShopInfo(jsonParam, callback_UpdateWftShopInfo);
};
/*
 * 功能：修改威富通信息回调
 * 创建人：liql
 * 创建时间：2017-1-11
 */
function callback_UpdateWftShopInfo(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('修改威富通信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert('修改成功');
		AgainRegisterClick("SwiftpassManage-SwiftpassMerchantList", "威富通商户列表");
	}
};
/*
 * 功能：获取威富通信息
 * 创建人：liql
 * 创建时间：2017-1-11
 */
function GetWftShopInfo() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, 'wftId', wftId);
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	wftInfoServer.GetWftShopInfo(jsonParam, callback_GetWftShopInfo);
};
/*
 * 功能：获取威富通信息回调
 * 创建人：liql
 * 创建时间：2017-1-11
 */
function callback_GetWftShopInfo(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('获取威富通信息失败:' + data.rspDesc);
	} else {
		$("#merchantId").val(data.shopName);
		$("#merchantId").attr('data-id', data.shopId);
		$(".industry").attr('data-value', data.wftIndustry);
		$(".industry").html(industryFunctionHelper.getNameByIndustry(data.wftIndustry));
		$("#wftBank").find("input[type='radio'][data-value=" + entry.wftBank + "]").attr('checked', 'checked');
		$("#wftBank").find("input[type='radio'][data-value=" + entry.wftBank + "]").prop('checked', true);
		$(".province").attr('data-value', data.province);
		$(".province").html(industryFunctionHelper.getNameByProvince(data.province));
		$(".city").attr('data-value', data.city);
		$(".city").html(industryFunctionHelper.getNameByCity(data.city));
		$("#address").val(data.address);
		$("#principal").val(data.principal);
		$("#principalEmail").val(data.principalEmail);
		$("#bankAccountName").val(data.bankAccountName);
		$("#bankCardNum").val(data.bankCardNum);
		$(".bankId").attr('data-value', data.bankId);
		$(".bankId").html(industryFunctionHelper.getNameByBank(data.bankId));
		$("#accountType").find("input[type='radio'][value=" + data.accountType + "]").attr('checked', 'checked');
		$("#accountType").find("input[type='radio'][value=" + data.accountType + "]").prop('checked', true);
		$("#lhBankCode").val(data.lhBankCode);
		$("#lhBankName").val(data.lhBankName);
		$(".provinceLh").attr('data-value', data.bankProvince);
		$(".provinceLh").html(industryFunctionHelper.getNameByProvince(data.bankProvince));
		$(".cityLh").attr('data-value', data.bankCity);
		$(".cityLh").html(industryFunctionHelper.getNameByCity(data.bankCity));
		$("#idCardNo").val(data.idCardNo);
		$("#idCardAddress").val(data.idCardAddress);
		$("#idCardPhone").val(data.idCardPhone);
		$("#wftWXBill").val(data.wftWXBill);
		$("#wftZFBBill").val(data.wftZFBBill);
		$("#thirdCode").val(data.thirdCode);
		if(data.isState == '1') {
			$("#isState").attr('checked', 'checked');
			$("#isState").prop('checked', true);
		} else {
			$("#isState").removeAttr('checked');
			$("#isState").prop('checked', false);
		}
		wftShopCode = data.wftShopCode;
		backAccountId = data.backAccountId;

		//权限
		LimitSet(data.wftShopCode, data.backAccountId);
	}
};
/*
 * 功能：同步威富通账户信息
 * 创建人：liql
 * 创建时间：2017-1-12
 */
function SynWftAccountInfo() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, 'wftId', wftId);
	jsonstr = dataHelper.setJson(null, 'wftShopCode', wftShopCode);
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	wftInfoServer.SynWftAccountInfo(jsonParam, callback_SynWftAccountInfo);
};
/*
 * 功能：同步威富通账户信息回调
 * 创建人：liql
 * 创建时间：2017-1-12
 */
function callback_SynWftAccountInfo(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('同步威富通账户信息失败:' + data.rspDesc);
	} else {

		$("#bankAccountName").val(data.bankAccountName);
		$("#bankCardNum").val(data.bankCardNum);
		$(".bankId").attr('data-value', data.bankId);
		$(".bankId").html(industryFunctionHelper.getNameByBank(data.bankId));
		$("#accountType").find("input[type='radio'][value=" + data.accountType + "]").attr('checked', 'checked');
		$("#accountType").find("input[type='radio'][value=" + data.accountType + "]").prop('checked', true);
		$("#lhBankCode").val(data.lhBankCode);
		$("#lhBankName").val(data.lhBankName);
		$(".provinceLh").attr('data-value', data.bankProvince);
		$(".provinceLh").html(industryFunctionHelper.getNameByProvince(data.bankProvince));
		$(".cityLh").attr('data-value', data.bankCity);
		$(".cityLh").html(industryFunctionHelper.getNameByCity(data.bankCity));
		$("#idCardNo").val(data.idCardNo);
		$("#idCardAddress").val(data.idCardAddress);
		$("#idCardPhone").val(data.idCardPhone);
		backAccountId = data.backAccountId;
		//权限
		LimitSet(wftShopCode, backAccountId);
	}
};

/*
 * 功能：修改威富通账户信息
 * 创建人：liql
 * 创建时间：2017-1-11
 */
function UpdateWftAccountInfo() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, 'wftId', wftId);
	jsonstr = dataHelper.setJson(jsonstr, 'backAccountId', backAccountId);
	jsonstr = dataHelper.setJson(jsonstr, 'bankAccountName', $("#bankAccountName").val());
	jsonstr = dataHelper.setJson(jsonstr, 'bankCardNum', $("#bankCardNum").val());
	jsonstr = dataHelper.setJson(jsonstr, 'bankId', $(".bankId").attr('data-value') == undefined || $(".bankId").attr('data-value') == null ? '' : $(".bankId").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, 'accountType', $("#accountType").find("input[type='radio'][checked='checked']").attr('value'));
	jsonstr = dataHelper.setJson(jsonstr, 'lhBankCode', $("#lhBankCode").val());
	jsonstr = dataHelper.setJson(jsonstr, 'lhBankName', $("#lhBankName").val());
	jsonstr = dataHelper.setJson(jsonstr, 'bankProvince', $(".provinceLh").attr('data-value') == undefined || $(".provinceLh").attr('data-value') == null ? '' : $(".provinceLh").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, 'bankCity', $(".cityLh").attr('data-value') == undefined || $("cityLh").attr('data-value') == null ? '' : $(".cityLh").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, 'idCardType', $(".idCardType").attr('data-value') == undefined || $(".idCardType").attr('data-value') == null ? '' : $(".idCardType").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, 'idCardNo', $("#idCardNo").val());
	jsonstr = dataHelper.setJson(jsonstr, 'idCardAddress', $("#idCardAddress").val());
	jsonstr = dataHelper.setJson(jsonstr, 'idCardPhone', $("#idCardPhone").val());
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	wftInfoServer.UpdateWftAccountInfo(jsonParam, callback_UpdateWftAccountInfo);
};
/*
 * 功能：修改威富通信息账户回调
 * 创建人：liql
 * 创建时间：2017-1-11
 */
function callback_UpdateWftAccountInfo(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('修改威富通账户信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert('修改成功');
		AgainRegisterClick("SwiftpassManage-SwiftpassMerchantList", "威富通商户列表");
	}
};

/*
 * 功能：修改威富通费率信息
 * 创建人：liql
 * 创建时间：2017-1-11
 */
function UpdateWftBillInfo() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, 'wftId', wftId);
	jsonstr = dataHelper.setJson(jsonstr, 'wftWXBill', $("#wftWXBill").val());
	jsonstr = dataHelper.setJson(jsonstr, 'wftZFBBill', $("#wftZFBBill").val());
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	wftInfoServer.UpdateWftBillInfo(jsonParam, callback_UpdateWftBillInfo);
};
/*
 * 功能：修改威富通费率信息回调
 * 创建人：liql
 * 创建时间：2017-1-11
 */
function callback_UpdateWftBillInfo(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('修改威富通费率信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert('修改成功');
		AgainRegisterClick("SwiftpassManage-SwiftpassMerchantList", "威富通商户列表");
	}
};

function fromValidate() {
	return $("#signupForm").validate({
		/* 设置验证规则 */
		rules: {
			merchantId: {
				required: function() {
					if($(".basicInfo").is(":visible")) {
						return true;
					} else {
						return false;
					}
				}
			},
			industry: {
				isRequired: function() {
					if($(".basicInfo").is(":visible")) {
						return ["全部行业"];
					} else {
						return ["行业"];
					}
				}
			},
			province: {
				isRequired: function() {
					if($(".basicInfo").is(":visible")) {
						return ["省"];
					} else {
						return ["行业"];
					}
				}
			},
			city: {
				isRequired: function() {
					if($(".basicInfo").is(":visible")) {
						return ["市"];
					} else {
						return ["行业"];
					}
				}
			},
			principal: {
				required: function() {
					if($(".basicInfo").is(":visible")) {
						return true;
					} else {
						return false;
					}
				}
			},
			principalEmail: {
				required: function() {
					if($(".basicInfo").is(":visible")) {
						return true;
					} else {
						return false;
					}
				},
				email: function() {
					if($(".basicInfo").is(":visible")) {
						return true;
					} else {
						return false;
					}
				}
			},
			bankAccountName: {
				required: function() {
					if($(".accountInfo").is(":visible")) {
						return true;
					} else {
						return false;
					}
				}
			},
			bankCardNum: {
				required: function() {
					if($(".accountInfo").is(":visible")) {
						return true;
					} else {
						return false;
					}
				},
				isInteger: function() {
					if($(".accountInfo").is(":visible")) {
						return true;
					} else {
						return false;
					}
				}
			},
			bankId: {
				isRequired: function() {
					if($(".accountInfo").is(":visible")) {
						return ["全部银行"];
					} else {
						return ["银行"];
					}
				}
			},
			lhBankCode: {
				required: function() {
					if($(".accountInfo").is(":visible")) {
						return true;
					} else {
						return false;
					}
				},
				isInteger: function() {
					if($(".accountInfo").is(":visible")) {
						return true;
					} else {
						return false;
					}
				}
			},
			lhBankName: {
				required: function() {
					if($(".accountInfo").is(":visible")) {
						return true;
					} else {
						return false;
					}
				}
			},
			provinceLh: {
				isRequired: function() {
					if($(".accountInfo").is(":visible")) {
						return ["省"];
					} else {
						return ["行业"];
					}
				}
			},
			cityLh: {
				isRequired: function() {
					if($(".accountInfo").is(":visible")) {
						return ["市"];
					} else {
						return ["行业"];
					}
				}
			},
			idCardType: {
				isRequired: function() {
					if($(".accountInfo").is(":visible")) {
						return ["证件类型"];
					} else {
						return ["行业"];
					}
				}
			},
			idCardNo: {
				required: function() {
					if($(".accountInfo").is(":visible")) {
						return true;
					} else {
						return false;
					}
				},
				isInteger: function() {
					if($(".accountInfo").is(":visible")) {
						return true;
					} else {
						return false;
					}
				}
			},
			idCardPhone: {
				required: function() {
					if($(".accountInfo").is(":visible")) {
						return true;
					} else {
						return false;
					}
				},
				isMobile: function() {
					if($(".accountInfo").is(":visible")) {
						return true;
					} else {
						return false;
					}
				}
			},
			wftWXBill: {
				required: function() {
					if($(".billInfo").is(":visible")) {
						return true;
					} else {
						return false;
					}
				},
				isGOrEqZeroDecimal: function() {
					if($(".billInfo").is(":visible")) {
						return true;
					} else {
						return false;
					}
				}
			},
			wftZFBBill: {
				required: function() {
					if($(".billInfo").is(":visible")) {
						return true;
					} else {
						return false;
					}
				},
				isGOrEqZeroDecimal: function() {
					if($(".billInfo").is(":visible")) {
						return true;
					} else {
						return false;
					}
				}
			}

		},
		/**/
		/* 设置错误信息 */
		messages: {
			merchantId: {
				required: "请选择商户信息"
			},
			industry: {
				isRequired: "请选择威富通行业"
			},
			province: {
				isRequired: "请选择省份"
			},
			city: {
				isRequired: "请选择城市"
			},
			principal: {
				required: "请输入收款人姓名"
			},
			principalEmail: {
				required: "请输入收款人邮箱",
				email: "邮箱格式不正确"
			},
			bankAccountName: {
				required: "请输入结算户名"
			},
			bankCardNum: {
				required: "请输入银行卡号",
				isInteger: "请输入数字"
			},
			bankId: {
				isRequired: "请选择开户银行"
			},
			lhBankCode: {
				required: "请选择联行号",
				isInteger: "只能为数字"
			},
			lhBankName: {
				required: "请输入支行名"
			},
			provinceLh: {
				isRequired: "请选择联行省份"
			},
			cityLh: {
				isRequired: "请选择联行城市"
			},
			idCardType: {
				isRequired: "请选择证件类型"
			},
			idCardNo: {
				required: "请输入持卡人证件号",
				isInteger: "请输入数字"
			},
			idCardPhone: {
				required: "请输入手机号码",
				isMobile: "手机号码格式不正确"
			},
			wftWXBill: {
				required: "请输入支付宝结算费率",
				isGOrEqZeroDecimal: "格式不正确，最多保留2位小数"
			},
			wftZFBBill: {
				required: "请输入微信结算费率",
				isGOrEqZeroDecimal: "格式不正确，最多保留2位小数"
			}
		},
		/* 设置错误信息提示DOM */
		errorPlacement: function(error, element) {
			error.appendTo(element.parent());
		},
	});
};