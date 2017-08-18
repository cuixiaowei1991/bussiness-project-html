var posId;
var pageSize = 10;
var isCreatePage = false;
var curragePage = 1;
var companyList = new Array();
var storeId; //门店
var parterId; //合作方
var pjParterId; //配件合作方
$(document).ready(function() {
	//获取pos信息
	posId = dataHelper.QueryString("id");
	//是否有配件
	$("#isHas").click(function() {
		if($(this).attr('checked') == 'checked') {
			$(this).removeAttr('checked');
			$(".peijGroup").hide();
		} else {
			$(this).attr('checked', 'checked');
			$(".peijGroup").show();
		}
	});
	fromValidate();
	//选择商户弹框
	$('.selectShop').click(function() {
		isCreatePage = false;
		GetMerchantList(curragePage);
		$("#pop2").show();
	});

	//选择商户查询
	$("#selectBtn").click(function() {
		isCreatePage = false;
		GetMerchantList(curragePage);
	});
	//是否启用
	$("#kai").click(function() {
		if($(this).attr('checked') == 'checked') {
			$(this).removeAttr('checked');
		} else {
			$(this).attr('checked', 'checked')
		}
	});
	//级别选择
	$("#level").find('li').click(function() {
		$("#parterId").find('li').css('display', 'none');
		$("#parterId").find('li[level=' + $(this).attr('data-value') + ']').css('display', 'block');
	});
	//配件级别选择
	$("#level1").find('li').click(function() {
		$("#pjParterId").find('li').css('display', 'none');
		$("#pjParterId").find('li[level=' + $(this).attr('data-value') + ']').css('display', 'block');
	});
	//提交
	$('#sureBtn').click(function() {
		//验证
		if(fromValidate().form()) {
			UpdatePosInfo();
		}
	});

	//获取分公司列表
	GetOrganizationInfoList();

});
/*
 * 功能：新增pos终端信息
 * 创建人：liql
 * 创建时间：2016-12-13
 */
function UpdatePosInfo() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, 'posId', posId);
	jsonstr = dataHelper.setJson(jsonstr, 'storeId', $(".storeId").attr('data-value') == undefined ? '' : $(".storeId").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, 'merchantId', $("#merchantId").attr('data-id'));
	jsonstr = dataHelper.setJson(jsonstr, 'termCode', $("#termCode").val());
	jsonstr = dataHelper.setJson(jsonstr, 'posType', $(".posType").find("input[type='radio'][checked='checked']").attr('data-value'));
	var paychannel = $(".payChannel").find("input[type='radio'][checked='checked']").attr('data-value');
	paychannel = paychannel == '' || paychannel == undefined || paychannel == null ? '' : paychannel + ",";
	jsonstr = dataHelper.setJson(jsonstr, 'payChannel', paychannel);

	jsonstr = dataHelper.setJson(jsonstr, 'payChannel', paychannel);
	jsonstr = dataHelper.setJson(jsonstr, 'branchId', $(".branchId").attr('data-value') == undefined ? '' : $(".branchId").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, 'posParterId', $(".parterId").attr('data-value') == undefined ? '' : $(".parterId").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, 'peiJianPosParterId', $(".pjParterId").attr('data-value') == undefined ? '' : $(".pjParterId").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, 'userType', $("#termCode").attr('data-userType')); //
	jsonstr = dataHelper.setJson(jsonstr, 'shopuserId', $("#termCode").attr('data-userId')); //
	jsonstr = dataHelper.setJson(jsonstr, 'merchaCode', $("#merchaCode").val());
	jsonstr = dataHelper.setJson(jsonstr, 'posStatus', $("#kai").attr('checked') == 'checked' ? '1' : '0');
	jsonParam.jsonStr = jsonstr;
	console.log(jsonstr);
	businessPosServer.UpdatePosInfo(jsonParam, callback_insertPosInfo);
};
/*
 * 功能：新增pos终端信息回调函数
 * 创建人：liql
 * 创建时间：2016-12-13
 */
function callback_insertPosInfo(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('修改pos终端信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert('修改成功');
		AgainRegisterClick("BusinessManage-PosStoreSet","POS终端号列表");
	}
};
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
			$("#merchantId").attr('data-id', $(this).attr('data-id'));
			$("#pop2").hide();
			GetShoreList($(this).attr('data-id'));
		});
		//分页
		$("#countsPage").html(data.total);
		if(!isCreatePage) {
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
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('查询门店信息失败:' + data.rspDesc);
	} else {
		var storeList = new Array();
		$.each(data.lists, function(index, entry) {
			var value = dataHelper.setJson(null, 'name', entry.storeName);
			value = dataHelper.setJson(value, 'value', entry.storeId);
			storeList.push(jQuery.parseJSON(value));
			//门店信息
			if(entry.storeId == storeId) {
				$(".storeId").text(entry.storeName);
			}
		});
		controlsHelper.downBoxUlLi('全部门店', storeList, "#storeId", ".storeId");
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
			$(".level").attr('data-value', '1');
			$(".level").html('一级合作方');
			$(".level1").attr('data-value', '1');
			$(".level1").html('一级合作方');
			GetPosParterList($(this).attr('value'));
		});

	};

	//软pos
	GetAllpayShopuserList($("#merchantId").attr('data-id'));

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
			value = dataHelper.setJson(value, 'level', entry.parterLevel);
			parterList.push(jQuery.parseJSON(value));

			//合作方
			if(entry.parterId == parterId) {
				$(".parterId").text(entry.parterName);
			}
			//配件合作方
			if(entry.parterId == pjParterId) {
				$(".pjParterId").text(entry.parterName);
			}

		});
		SetDownBoxUlLi('全部合作方', parterList, "#parterId", ".parterId");
		SetDownBoxUlLi('全部配件合作方', parterList, "#pjParterId", ".pjParterId");
	}
};
/*
 * 功能：下拉框（单个） 针对ul li标签
 * 参数（默认文本，数据list,ul标签，展示btn标签）
 */
function SetDownBoxUlLi(defaultText, dataList, elements, elementsBtn) {
	$(elements).empty();
	if(defaultText != '') {
		$(elementsBtn).html(defaultText);
		$(elements).append("<li value=''><a>" + defaultText + "</a></li>");
	}
	$.each(dataList, function(index, entry) {
		$(elements).append("<li value=" + entry.value + " level=" + entry.level + " ><a>" + entry.name + "</a></li>");
	});
	$(elements).find('li[level=2]').css('display', 'none');

	//li改变事件
	$(elements).find('li').click(function() {
		$(elementsBtn).attr('data-value', $(this).attr('value'));
		$(elementsBtn).html($(this).find('a').html());
	});
};
/*
 * 功能：获取pos终端信息
 * 创建人：liql
 * 创建时间：2016-12-14
 */
function GetPosInfoById() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	jsonParam.jsonStr = dataHelper.setJson(null, 'posId', posId);
	console.log(jsonParam);
	businessPosServer.GetPosInfoById(jsonParam, callback_getPosInfo);
};
/*
 * 功能：获取pos终端信列表
 * 创建人：liql
 * 创建时间：2016-12-14
 */
function callback_getPosInfo(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('查询pos终端信息失败:' + data.rspDesc);
	} else {
		//		jsonstr = dataHelper.setJson(jsonstr, 'userType', '111'); //待定
		//pos类型
		$(".posType").find("input").removeAttr('checked');
		$(".posType").find("input").prop('checked', false);
		$(".posType").find("input[data-value=" + data.posType + "]").attr('checked', 'checked');
		$(".posType").find("input[data-value=" + data.posType + "]").prop('checked', true);
		$(".posType").find("input[data-value=" + data.posType + "]").click();
		//渠道
		$(".payChannel").find("input").removeAttr('checked');
		$(".payChannel").find("input").prop('checked', false);
		var paychannel = data.payChannel != null && data.payChannel != undefined && data.payChannel != '' ? data.payChannel.replace(',', '') : '';
		console.log(paychannel);
		if(paychannel != '') {
			$(".payChannel").find("input[data-value=" + paychannel + "]").attr('checked', 'checked');
			$(".payChannel").find("input[data-value=" + paychannel + "]").prop('checked', true);
		}

		if(data.posType != 3 && data.posType != 2) {
			if(data.branchId != '' && data.branchId != null && data.branchId != undefined) {
				$(".branchId").attr('data-value', data.branchId); //分公司
				$(".branchId").html($("#branchId").find('li[value=' + data.branchId + '] a').text());
				//		
				GetPosParterList(data.branchId); //获取合作方
			}
			if(data.posParterId != '' && data.posParterId != null && data.posParterId != undefined) {
				$(".parterId").attr('data-value', data.posParterId); //合作方	
				$(".parterId").html($("#parterId").find('li[value=' + data.posParterId + '] a').text());
			}
			if(data.peiJianPosParterId != '' && data.peiJianPosParterId != null && data.peiJianPosParterId != undefined) {
				$(".pjParterId").attr('data-value', data.peiJianPosParterId); //配件合作方		
				$(".pjParterId").html($("#pjParterId").find('li[value=' + data.peiJianPosParterId + '] a').text());
			}
		}

		$("#merchantId").attr('data-id', data.merchantId); //商户id
		$("#merchantId").val(data.merchantName); //商户id
		//获取门店信息
		GetShoreList(data.merchantId);

		$(".storeId").attr('data-value', data.storeId); //门店id
		$(".storeId").html($("#storeId").find('li[value=' + data.storeId + '] a').text());

		$("#termCode").val(data.termCode); //终端号
		$("#termCode").attr('data-userType', data.userType);
		$("#merchaCode").val(data.merchaCode); //商户号
		//是否开启
		if(data.posStatus == '1') {
			$("#kai").attr('checked', 'checked');
		} else {
			$("#kai").removeAttr('checked');
		}

	};
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
		$(data_elements).empty();
		$.each(data.lists, function(index, entry) {
			$(data_elements).append("<label><input type='radio' name='types' data-value=" + entry.data_code + " />" + entry.data_name + "   </label>");
		});
		$(".posType").find("input[type='radio']").eq(0).attr('checked', 'checked');
		$(".posType").find("input[type='radio']").eq(0).prop('checked', true);

		//选择pos类型
		$(".posType").find("input[type='radio']").click(function() {
			$(".posType").find("input[type='radio']").removeAttr('checked');
			$(this).prop('checked', false);

			$(this).attr('checked', 'checked');
			$(this).prop('checked', true);

			$(".payChannel").find("input[type='radio']").eq(0).attr('checked', 'checked');
			$(".payChannel").find("input[type='radio']").eq(0).prop('checked', true);

			$(".hideGroup").show();
			$(".rposHide").show();
			$(".rPos").hide();
			$("#termCode").attr('readOnly', false);
			if($(this).attr('data-value') == '3') { //虚拟pos
				$(".hideGroup").hide();
				$(".payChannel").find("input[type='radio']").removeAttr('checked');
				$(".payChannel").find("input[type='radio']").prop('checked', false);
			} else if($(this).attr('data-value') == '2') { //软pos
				$(".rPos").show();
				$(".rposHide").hide();
				$(".hideGroup").hide();
				$("#termCode").attr('readOnly', true);
				$(".payChannel").find("input[type='radio']").removeAttr('checked');
				$(".payChannel").find("input[type='radio']").prop('checked', false);
			}

		});

	}
	data_elements = ".payChannel";
	dataValueHelper.GetDictionaryDataList("applicationSystem", '', '', '', GetDictionaryDataPayChannelCallback);
};
/*
 * 功能：获取商助用户信息列表
 * 创建人：liql
 * 创建时间：2016-12-13
 */
function GetAllpayShopuserList(merchantId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};

	var jsonstr = dataHelper.setJson(null, 'shopuserIscashier', '1');
	jsonstr = dataHelper.setJson(jsonstr, 'merchantId', merchantId);
	jsonParam.jsonStr = jsonstr;
	console.log(jsonstr);
	businessPosServer.GetAllpayShopuserList(jsonParam, callback_GetAllpayShopuserList);
};
/*
 * 功能：获取商助用户信息列表回调
 * 创建人：liql
 * 创建时间：2016-12-13
 */
function callback_GetAllpayShopuserList(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('查询商助用户信息失败:' + data.rspDesc);
	} else {
		$("#assignUser").empty();
		$(".assignUser").html('请选择人员');
		$("#assignUser").append("<li value=''><a>请选择人员</a></li>");
		$.each(data.lists, function(index, entry) {
			$("#assignUser").append("<li value=" + entry.shopuserId + " phone=" + entry.shopuserPhone + " userId=" + data.shopuserId + " userType=" + data.shopuserRole + " ><a>" + entry.shopuserName + "</a></li>");
		});

		//li改变事件
		$("#assignUser").find('li').click(function() {
			$(".assignUser").attr('data-value', $(this).attr('value'));
			$(".assignUser").attr('data-userType', $(this).attr('userType'));
			$(".assignUser").attr('data-phone', $(this).attr('phone'));
			$(".assignUser").html($(this).find('a').html());
			if($(this).attr('phone').length >= 11) {
				$("#termCode").val($(this).attr('phone').substring(3));
				$("#termCode").attr('data-userType', $(this).attr('userType'));
				$("#termCode").attr('data-userId', $(this).attr('userId'));
			}

		});
	}

	//获取码表数据
	data_elements = ".posType";
	dataValueHelper.GetDictionaryDataList("posType", '', '', '', GetDictionaryDataListCallback);

};
/*
 * 功能：码表回调函数
 * 创建人：liql
 * 创建时间：2016-12-19
 */
function GetDictionaryDataPayChannelCallback(data) {
	console.log(data);
	if(data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('查询码表信息失败:' + data.rspDesc);
	} else {
		$(".payChannel").empty();
		$.each(data.lists, function(index, entry) {
			$(".payChannel").append("<label><input type='radio' name='types1' data-value=" + entry.data_code + " />" + entry.data_name + "   </label>");
		});
		$(".payChannel").find("input[type='radio']").eq(0).attr('checked', 'checked');
		$(".payChannel").find("input[type='radio']").eq(0).prop('checked', true);
		//选择系统
		$(".payChannel").find("input[type='radio']").click(function() {
			$(".payChannel").find("input[type='radio']").removeAttr('checked');
			$(".payChannel").find("input[type='radio']").prop('checked', false);
			$(this).attr('checked', 'checked');
			$(this).prop('checked', true);
		});
	}
	//获取pos终端信息
	GetPosInfoById();
};