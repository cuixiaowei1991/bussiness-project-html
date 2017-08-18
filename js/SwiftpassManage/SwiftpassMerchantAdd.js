var curragePageBank = 1; //当前页
var pageSize = 10; //每页显示记录条数
var isBankCreatePage = false; //是否创建分页
var curragePageShop = 1; //当前页
var isShopCreatePage = false; //是否创建分页
$(document).ready(function() {
	//获取银行码表信息
	dataValueHelper.GetDictionaryDataList("wftBank", '', '', '', callback_getBankInfo);
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
	 * 功能：新增
	 */
	$("#submit").click(function() {
		//验证
		if(fromValidate().form()) {
			InsertWftShopInfo();
		}
	});

});
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
 * 功能：新增威富通信息
 * 创建人：liql
 * 创建时间：2017-1-11
 */
function InsertWftShopInfo() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, 'shopName', $("#merchantId").val());
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
	wftInfoServer.InsertWftShopInfo(jsonParam, callback_InsertWftShopInfo);
};
/*
 * 功能：新增威富通信息回调
 * 创建人：liql
 * 创建时间：2017-1-11
 */
function callback_InsertWftShopInfo(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('新增威富通信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert('新增成功');
		AgainRegisterClick("SwiftpassManage-SwiftpassMerchantList", "威富通商户列表");
	}
};

function fromValidate() {
	return $("#signupForm").validate({
		/* 设置验证规则 */
		rules: {
			merchantId: {
				required: true
			},
			industry: {
				isRequired: ["全部行业"]
			},
			province: {
				isRequired: ["省"]
			},
			city: {
				isRequired: ["市"]
			},
			principal: {
				required: true
			},
			principalEmail: {
				required: true,
				email:true
			},
			bankAccountName: {
				required: true
			},
			bankCardNum: {
				required: true,
				isInteger: true
			},
			bankId: {
				isRequired: ["全部银行"]
			},
			lhBankCode: {
				required: true,
				isInteger: true
			},
			lhBankName: {
				required: true
			},
			provinceLh: {
				isRequired: ["省"]
			},
			cityLh: {
				isRequired: ["市"]
			},
			idCardType:{
				isRequired: ["证件类型"]
			},
			idCardNo: {
				required: true,
				isInteger: true
			},
			idCardPhone: {
				required: true,
				isMobile: true
			},
			wftWXBill: {
				required: true,
				isGOrEqZeroDecimal: true
			},
			wftZFBBill: {
				required: true,
				isGOrEqZeroDecimal: true
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
				email:"邮箱格式不正确"
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
			idCardType:{
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