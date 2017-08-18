var merchantId; //商户Id
var channelListAdd = new Array();
var channelListUpdate = new Array();
var channelName; //渠道名称
var channelCode; //渠道code
var channelSateList; //渠道状态类别
$(document).ready(function() {
	merchantId = dataHelper.QueryString("merchantId");
	$.validator.setDefaults({
		debug: true
	});
	dataValueHelper.GetDictionaryDataList("payChannel", '', '', '', callback_GetChannelCodeData); //码表

	//立即配置
	$(".btnModify").click(function() {
		console.log($(this).attr('data-code'))
			//		$("#pop2").show();
		if ($(this).attr('data-code') == null || $(this).attr('data-code') == undefined || $(this).attr('data-code') == '') {
			alert('请选择开通业务');
		} else {
			channelCode = $(this).attr('data-code');
			getPopGroupByChannelCode(parseInt($(this).attr('data-code')), $(this).attr('data-name'));
		}

	});

	$("#ResetPassword").click(function() {
		ResetLoginUserPassword(merchantId);
	});

	$(".close").click(function() {
		$("#userPassword").val('');
	});

	//新增业务签约
	$("#NewBusiness").click(function() {
		$(".channelInfo").show();
	});
	//选择事件
	//是否启用
	$(".popGroup").find('section').find('input[type=checkbox]').click(function() {
		if ($(this).attr('checked') == 'checked') {
			$(this).removeAttr('checked');
		} else {
			$(this).attr('checked', 'checked')
		}
	});
	//弹框确定事件
	$(".popGroup").find('section').find('div.modal-footer button.btn.btn-primary').click(function() {
		if ($(this).parent().parent().parent().parent().parent().css('display') == 'block') {
			//显示，获取输入参数，加入channelList
			GetListChannel($(this).parent().parent().parent().parent().parent());
			//验证
			var id;
			$(".popGroup").find('section').each(function() {
				if ($(this).css('display') == 'block') {
					id = $(this).find('form').attr('id');
				}
			});
			if (SelectValidate(id)) {
				//新增业务签约
				InsertBusinessInfo();
			}
		}
	});
	//加载微信类目
	controlsHelper.wechatCategoryUl("#category2", '#category1', ".category2", '.category1');
	//注册验证
	fromValidate0();
	fromValidate1();
	fromValidate2();
	fromValidate3();
	fromValidate4();
	fromValidate5();
	fromValidate6();
	fromValidate7();
	fromValidate8();
});

/*
 * 创建日期：2016-11-22
 * 功能：获取用户信息
 * 创建人：shiyina
 */
function GetMerchantInfoById(merchantId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "merchantId", merchantId); //商户Id
	jsonParam.jsonStr = jsonstr;
	businessShopServer.GetMerchantInfoById(jsonParam, callback_GetMerchantInfoById);
};

function callback_GetMerchantInfoById(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		if (data.rspCode != '003') {
			controlsHelper.alert('查看用户信息失败:' + data.rspDesc);
		}
	} else {
		//渲染数据
		$("#mhtName").html(data.mhtName);
		$("#mhtManagerPhone").html(data.mhtManagerPhone);
		$("#mhtId").html(data.mhtId);
		$("#mhtName").html(data.mhtName);
		$("#mhtShortName").html(data.mhtShortName);
		$("#mhtImgUrl").find('img').attr('src', data.mhtImgUrl);
		$("#mhtAddress").html(data.mhtAddress);
		$("#mhtIndustry").html(data.mhtIndustry);
		$("#mhtAgentName").html(data.mhtAgentName);

		if (data.mhtState == 1) { //0:停用 1：启用
			$("#userIsStart").attr("checked", true);
		} else {
			$("#userIsStart").attr("checked", false);
		}
		merchantId = data.mhtId;
		GetComuserInfoByMerchantId(merchantId);
	}
};
/*
 * 创建日期：2016-11-22
 * 功能：获取商户企业信息
 * 创建人：shiyina
 */
function GetComuserInfoByMerchantId(merchantId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "merchantId", merchantId); //商户Id
	jsonParam.jsonStr = jsonstr;
	businessShopServer.GetComuserInfoByMerchantId(jsonParam, callback_GetComuserInfoByMerchantId);
};

function callback_GetComuserInfoByMerchantId(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		if (data.rspCode != '003') {
			controlsHelper.alert('查看商户企业信息失败:' + data.rspDesc);
		}
	} else {
		//渲染数据
		$("#companyName").html(data.companyName);
		$("#identityName").html(data.identityName);
		$("#businessLicenseNum").html(data.businessLicenseNum);
		$("#openCountBank").html(data.openCountBank);
		$("#openCountName").html(data.openCountName);
		$("#bankNum").html(data.bankNum);
		$("#organizationCode").html(data.organizationCode);
		$("#socialCreditCode").html(data.socialCreditCode);
		$("#organizationCode").html(data.organizationCode);

		if (data.imageList != undefined) {
			//图片路径和图片名称
			for (var i = 0; i < data.imageList.length; i++) {
				$("#imageList img").eq(i).attr('src', data.imageList[i].imgPath);
				var path = new Array();
				path = data.imageList[i].imgPath.split('uploads/');
				if (path.length > 1) {
					$("#imageList img").eq(i).attr('data-imgPath', path[1]);
				} else {
					$("#imageList img").eq(i).attr('data-imgPath', data.imageList[i].imgPath);
				}
				$("#imageList span").eq(i).html('查看原图 - 下载原图');
				$("#imageList img").eq(i).attr('data-imgName', data.imageList[i].imgName);
				$("#imageList span").eq(i).attr('data-imgPath', data.imageList[i].imgPath);
				$("#imageList p").eq(i).html(data.imageList[i].imgName + "：");
			}
		}
		$("#imageList span").click(function() {
			location.href = $(this).attr('data-imgpath');
		});
	}
	//获取已开通渠道
	GetMerchantOpenChannelList(merchantId);
};
/*

/*
 * 创建日期：2016-11-22
 * 功能：获取商户已开通业务信息
 * 创建人：shiyina
 */
function GetMerchantOpenChannelList(merchantId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "merchantId", merchantId); //商户Id
	jsonParam.jsonStr = jsonstr;
	businessShopServer.GetMerchantOpenChannelList(jsonParam, callback_GetMerchantOpenChannelList);
};
/*
 * 功能：获取商户已开通业务信息回调函数
 * 创建人：liql
 * 创建时间：2016-12-30
 */
function callback_GetMerchantOpenChannelList(data) {
	console.log(data);
	if (data == undefined || data == null) {
		alert('无数据返回');
	} else if (data.rspCode != "000") {
		alert(data.rspDesc == undefined ? '无数据返回' : data.rspDesc);
	} else {
		//渲染数据
		$("#businessList").html('');
		var template = $("#businessListTemplate").html();
		Mustache.parse(template);
		var listsT = new Array();
		$.each(data.lists, function(index, entry) {
			var value = JSON.stringify(entry);
			value = dataHelper.setJson(value, 'stateName', entry.businessState == '1' ? '启用' : '禁用');
			value = dataHelper.setJson(value, 'channelStateName', GetStateByCode(entry.businessChannelState));
			listsT.push(jQuery.parseJSON(value));
		});
		data.lists = listsT;
		var rendered = Mustache.render(template, data);
		$("#businessList").append(rendered);

		$("#businessTatal").html(data.total);

		//更改配置弹框
		$(".ChangeConfig").click(function() {
			//配置弹框
			getPopGroupByChannelCode(parseInt($(this).attr('data-businessId')));
			//获取业务签约信息
			GetBusinessInfoByid($(this).attr('data-businessId'));
		});

	}

};
/*
 * 功能：根据code获取名称
 * 创建人：liql
 * 创建时间：2016-12-30
 */
function GetStateByCode(code) {
	var name;
	$.each(channelSateList, function(index, entry) {
		if (entry.data_code == code) {
			name = entry.data_name;
			return name;
		}
	});
	return name;
};

/*
 * 创建日期：2016-12-13
 * 功能：2.1.2重置商户密码
 * 创建人：shiyina
 */
function ResetLoginUserPassword(merchantId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "userId", merchantId); //用户id
	jsonstr = dataHelper.setJson(jsonstr, "userPassword", '111111'); //用户id
	jsonParam.jsonStr = jsonstr;
	console.log(jsonstr);
	businessShopServer.ResetLoginUserPassword(jsonParam, callback_ResetLoginUserPassword);
};

function callback_ResetLoginUserPassword(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('恢复初始密码失败:' + data.rspDesc);
	} else {
		controlsHelper.alert("恢复初始密码成功", "20%");
	}
};

/*
 * 功能：根据渠道code显示配置窗体
 * 创建人：liql
 * 创建时间：2016-12-14
 */
function getPopGroupByChannelCode(code, name) {
	$(".popGroup").find('section').hide();
	$(".popGroup").find('section').each(function() {
		var codeList = eval("[" + $(this).attr('data-value') + "]");
		var isExist = false;
		if (codeList.indexOf(code) >= 0) {
			//存在
			$(this).show();
			$(this).find('h4.modal-title').html(name);
			$(this).find('input[type=text]').val('');
			$(this).find('input[type=password]').val('');
			$(this).find('a.mailbox-attachment-name.files').text('');
			$(this).find('input[type=checkbox]').removeAttr('checked');
			$(this).find('button.channelStateBtn').html('全部');
			$(this).find('button.channelStateBtn').attr('value', '');

			//百度钱包众联（12 privateKey）美团众联(31-appSecret) 和包众联(120 privateKey)
			switch (code) {
				case 12:
				case 120:
					$(this).find('input[name="privateKey"]').attr('data-string', 'privateKey');
					break;
				case 31:
					$(this).find('input[name="privateKey"]').attr('data-string', 'appSecret');
					break;
				default:
					break;
			}

		}
	});
};

/*
 * 功能：获取码表数据回调
 * 创建人：liql
 * 创建时间：2016-12-14
 */
function callback_GetChannelCodeData(data) {
	console.log(data);
	$("#couponchannel").empty();
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('获取码表列表失败:' + data.rspDesc);
	} else {
		var template = $("#couponchannelTemplate").html();
		Mustache.parse(template);
		var render = Mustache.render(template, data);
		$("#couponchannel").append(render);

		//渠道点击事件
		$("#couponchannel").find('div').click(function() {
			$("#couponchannel").find('div').removeClass('btn-primary');
			$(this).addClass('btn-primary');
			$("#channelString").empty();
			if ($(this).attr('data-string') != null && $(this).attr('data-string') != undefined && $(this).attr('data-string') != '') {
				var listT = $(this).attr('data-string').replace('；', ';').split(';');
				var lists = new Array();
				$.each(listT, function(index, entry) {

					entry = entry.split(',');
					console.log(entry);
					if (entry.length > 1) {
						var value = dataHelper.setJson(null, 'code', entry[1]);
						value = dataHelper.setJson(value, 'name', entry[0]);
						lists.push(jQuery.parseJSON(value));
					}
				});
				var codeList = {
					"lists": lists
				};
				$("#channelString").empty();
				var template = $("#channelStringTemplate").html();
				Mustache.parse(template);
				var render = Mustache.render(template, codeList);
				$("#channelString").append(render);

				//选择事件
				var mainName = $(this).text();
				$(".btnModify").attr('data-code', '');
				$(".btnModify").attr('data-name', '');
				channelName = '';
				$("#channelString").find('div').click(function() {
					$("#channelString").find('div').removeClass('btn-primary');
					$(this).addClass('btn-primary');
					channelName = $(this).text();
					//选择code赋值
					$(".btnModify").attr('data-code', $(this).attr('data-code'));
					$(".btnModify").attr('data-name', mainName + "——" + $(this).text());
				});
			}
		});
	}
	//获取码表 渠道状态
	dataValueHelper.GetDictionaryDataList("channelState", '', '', '', callback_GetDataNameChannelState); //码表
};
/*
 * 功能：获取渠道状态
 * 创建人：liql
 * 创建时间：2016-12-30
 */
function callback_GetDataNameChannelState(data) {
	channelSateList = data.lists;
	$('.channelState').empty();
	$('.channelStateBtn').html('全部');
	$('.channelState').append("<li value=''><a>全部</a></li>");
	$.each(data.lists, function(index, entry) {
		$('.channelState').append("<li value=" + entry.data_code + "><a>" + entry.data_name + "</a></li>");
	});

	//li改变事件
	$('.channelState').find('li').click(function() {
		$('.channelStateBtn').attr('data-value', $(this).attr('value'));
		$('.channelStateBtn').html($(this).find('a').html());
	});
	//获取用户信息
	GetMerchantInfoById(merchantId);
};
/*
 * 功能：从dom对象获取list
 * 创建人：liql
 * 创建时间：2016-12-14
 */
function GetListChannel(elements) {
	channelListAdd = new Array();
	//遍历所有input 非checkbox
	elements.find("input[type!='checkbox']").each(function() {
		if ($(this).attr('data-string') != '' && $(this).attr('data-string') != null && $(this).attr('data-string') != undefined) {
			var listValue;
			listValue = dataHelper.setJson(null, 'parameterName', $(this).attr('data-string'));
			listValue = dataHelper.setJson(listValue, 'parameterValue', $(this).val());
			listValue = dataHelper.setJson(listValue, 'paramType', 'string');
			channelListAdd.push(jQuery.parseJSON(listValue));
		}
	});

	//遍历所有button
	elements.find('button').each(function() {
		if ($(this).attr('data-string') != '' && $(this).attr('data-string') != null && $(this).attr('data-string') != undefined) {
			var listValue;
			listValue = dataHelper.setJson(null, 'parameterName', $(this).attr('data-string'));
			listValue = dataHelper.setJson(listValue, 'parameterValue', $(this).attr('data-value'));
			listValue = dataHelper.setJson(listValue, 'paramType', 'string');
			channelListAdd.push(jQuery.parseJSON(listValue));
		}
	});

	//遍历所有input checkbox
	elements.find("input[type='checkbox']").each(function() {
		if ($(this).attr('data-string') != '' && $(this).attr('data-string') != null && $(this).attr('data-string') != undefined) {
			var listValue;
			listValue = dataHelper.setJson(null, 'parameterName', $(this).attr('data-string'));
			listValue = dataHelper.setJson(listValue, 'parameterValue', $(this).prop('checked') ? '1' : '0');
			listValue = dataHelper.setJson(listValue, 'paramType', 'string');
			channelListAdd.push(jQuery.parseJSON(listValue));
		}
	});
	console.log(channelListAdd);

};
/*
 * 功能：新增业务签约
 * 创建人：liql
 * 创建时间：2016-12-14
 */
function InsertBusinessInfo() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, 'merchantId', merchantId);
	jsonstr = dataHelper.setJson(jsonstr, 'channelCode', channelCode);
	jsonstr = dataHelper.setJson(jsonstr, 'channelName', channelName);
	jsonstr = dataHelper.setJson(jsonstr, 'channelSetList', channelListAdd);
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	businessPosServer.InsertBusinessInfo(jsonParam, callback_insertBusinessInfo);
};
/*
 * 功能：新增业务签约回调
 * 创建人：Liql
 * 创建时间：2016-12-15
 */
function callback_insertBusinessInfo(data) {
	console.log(data);
	if (data == undefined || data == null || data.rspCode != "000") {
		alert(data.rspDesc);
	} else {
		controlsHelper.alert("配置成功");
		$(".popGroup").find('section').hide();
		GetMerchantOpenChannelList(merchantId);
	}
};
/*
 * 功能：获取业务签约信息
 * 创建人：liql
 * 创建时间：2016-12-15
 */
function GetBusinessInfoByid(code) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, 'merchantId', merchantId);
	jsonstr = dataHelper.setJson(jsonstr, 'channelCode', code);
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	businessPosServer.GetBusinessInfoByid(jsonParam, callback_getBusinessInfo);
};
/*
 * 功能：获取业务签约信息回调
 * 创建人：liql
 * 创建时间：2016-12-15
 */
function callback_getBusinessInfo(data) {
	console.log(data);
	if (data == undefined || data == null || data.rspCode != "000") {
		alert(data.rspDesc);
	} else {
		channelCode = data.channelCode;
		channelName = data.channelName;
		//赋值
		SetFormInfoByData(data.channelCode, data.channelSetList);
	}
};
/*
 * 功能：根据数据给标签赋值
 * 创建人：liql
 * 创建时间：2016-12-15
 */
function SetFormInfoByData(code, dataList) {
	$(".popGroup").find('section').each(function() {
		if ($(this).css('display') == 'block') {
			//遍历所有input 非checkbox
			var elements = $(this);
			$.each(dataList, function(index, entry) {
				elements.find("input[type!='checkbox']").each(function() {
					if ($(this).attr('data-string') == entry.parameterName) {
						$(this).val(entry.parameterValue);
					}
				});

				//遍历所有button
				elements.find('button').each(function() {
					if ($(this).attr('data-string') == entry.parameterName) {
						$(this).attr('data-value', entry.parameterValue);
						//加载data码表数据-----
						if ($(this).hasClass('channelStateBtn')) {
							$(elements).find('ul.channelState').find('li[value=' + entry.parameterValue + ']').click();
						} else {
							$(this).text($(elements).find('ul:not(.channelStateBtn)').find('li[value=' + entry.parameterValue + ']').find('a').html());
						}
					}
				});

				//遍历所有input checkbox
				elements.find("input[type='checkbox']").each(function() {
					if ($(this).attr('data-string') == entry.parameterName) {
						if (entry.parameterValue == '1') {
							$(this).attr('checked', 'checked');
							$(this).prop('checked', true);
						} else {
							$(this).removeAttr('checked');
							$(this).prop('checked', false);
						}
					}
				});
			});

		}
	});
};
/*
 * 功能；根据名称注册验证
 * 创建人：liql
 * 创建时间：2016-12-21
 */
function SelectValidate(name) {
	console.log(name);
	var isPass = false;
	switch (name) {
		case 'signupForm0':
			isPass = fromValidate0().form();
			break;
		case 'signupForm1':
			isPass = fromValidate1().form();
			break;
		case 'signupForm2':
			isPass = fromValidate2().form();
			break;
		case 'signupForm3':
			isPass = fromValidate3().form();
			break;
		case 'signupForm4':
			isPass = fromValidate4().form();
			break;
		case 'signupForm5':
			isPass = fromValidate5().form();
			break;
		case 'signupForm6':
			isPass = fromValidate6().form();
			break;
		case 'signupForm7':
			isPass = fromValidate7().form();
			break;
		case 'signupForm8':
			isPass = fromValidate8().form();
			break;
		default:
			break;
	}
	return isPass;
};
/*
 * 功能:验证(微信联鑫付11，微信众联享付112,微信商银信114,微信创新支付115,微信触联116,手Q联鑫付(18),手Q众联(181),联通沃支付(191))
 * 创建人：liql
 * 创建时间：2016-12-21
 */
function fromValidate0() {
	return $("#signupForm0").validate({
		/* 设置验证规则 */
		rules: {
			state: {
				isRequired: ["全部"]
			},
			shopMachId: {
				required: true,
				isInteger: true
			}
		},
		/**/
		/* 设置错误信息 */
		messages: {
			state: {
				isRequired: "请选择渠道状态"
			},
			shopMachId: {
				required: "请输入微信子商户id",
				isInteger: "请输入数字"
			}
		},
		/* 设置错误信息提示DOM */
		errorPlacement: function(error, element) {
			error.appendTo(element.parent());
		},
	});
};
/*
 * 功能:验证 微信公众号(113)
 * 创建人：liql
 * 创建时间：2016-12-21
 */
function fromValidate1() {
	return $("#signupForm1").validate({
		/* 设置验证规则 */
		rules: {
			appID: {
				required: true,
				isEnglishInt: true
			},
			privateKey: {
				required: true,
				isEnglishInt: true
			},
			mchID: {
				required: true,
				isEnglishInt: true
			},
			certPassword: {
				required: true,
				isEnglishInt: true
			},
			category1: {
				isRequired: ["请选择主类目"]
			},
			category2: {
				isRequired: ["请选择子类目"]
			},
			state: {
				isRequired: ["全部"]
			},
			apiclient_cert_p12: {
				required: true
			},
			apiclient_cert_pem: {
				required: true
			},
			apiclient_key_pem: {
				required: true
			},
			rootca_pem: {
				required: true
			}
		},
		/**/
		/* 设置错误信息 */
		messages: {
			appID: {
				required: "请输入appId",
				isEnglishInt: "请输入数字或者英文"
			},
			privateKey: {
				required: "请输入privateKey",
				isEnglishInt: "请输入数字或者英文"
			},
			mchID: {
				required: "请输入mchID",
				isEnglishInt: "请输入数字或者英文"
			},
			certPassword: {
				required: "请输入certPassword",
				isEnglishInt: "请输入数字或者英文"
			},
			category1: {
				isRequired: "请选择主类目"
			},
			category2: {
				isRequired: "请选择子类目"
			},
			state: {
				isRequired: "请选择渠道状态"
			},
			apiclient_cert_p12: {
				required: "请选择证书文件"
			},
			apiclient_cert_pem: {
				required: "请选择证书文件"
			},
			apiclient_key_pem: {
				required: "请选择证书文件"
			},
			rootca_pem: {
				required: "请选择证书文件"
			}
		},
		/* 设置错误信息提示DOM */
		errorPlacement: function(error, element) {
			error.appendTo(element.parent());
		},
	});
};
/*
 * 功能:验证 支付宝威富通（一清）(17),支付宝威富通（二清）(192)
 * 创建人：liql
 * 创建时间：2016-12-21
 */
function fromValidate2() {
	return $("#signupForm2").validate({
		/* 设置验证规则 */
		rules: {
			state: {
				isRequired: ["全部"]
			}
		},
		/**/
		/* 设置错误信息 */
		messages: {
			state: {
				isRequired: "请选择渠道状态"
			}
		},
		/* 设置错误信息提示DOM */
		errorPlacement: function(error, element) {
			error.appendTo(element.parent());
		},
	});
};
/*
 * 功能:验证 支付宝联鑫付(14),支付宝触联(145),支付宝触联(餐饮)(146)
 * 创建人：liql
 * 创建时间：2016-12-21
 */
function fromValidate3() {
	return $("#signupForm3").validate({
		/* 设置验证规则 */
		rules: {
			appID: {
				isInteger: true
			},
			shopPub_key: {
				required: true,
				isEnglishInt: true
			},
			shopPri_key: {
				required: true,
				isEnglishInt: true
			},
			lxfPID: {
				required: true,
				isInteger: true
			},
			state: {
				isRequired: ["全部"]
			}
		},
		/**/
		/* 设置错误信息 */
		messages: {
			appID: {
				required: "请输入appId",
				isInteger: "请输入数字"
			},
			shopPub_key: {
				required: "请输入shopPub_key",
				isEnglishInt: "请输入英文或者数字"
			},
			shopPri_key: {
				required: "请输入shopPri_key",
				isEnglishInt: "请输入英文或者数字"
			},
			lxfPID: {
				required: "lxfPID",
				isInteger: "请输入数字"
			},
			state: {
				isRequired: "请选择渠道状态"
			}
		},
		/* 设置错误信息提示DOM */
		errorPlacement: function(error, element) {
			error.appendTo(element.parent());
		},
	});
};
/*
 * 功能:验证 支付宝众联享付(142)
 * 创建人：liql
 * 创建时间：2016-12-21
 */
function fromValidate4() {
	return $("#signupForm4").validate({
		/* 设置验证规则 */
		rules: {
			public_key: {
				required: true,
				isEnglishInt: true
			},
			mchID: {
				required: true,
				isInteger: true
			},
			myPID: {
				required: true,
				isInteger: true
			},
			shopPID: {
				required: true,
				isEnglishInt: true
			},
			shopPub_key: {
				required: true,
				isEnglishInt: true
			},
			shopPri_key: {
				required: true,
				isEnglishInt: true
			},
			state: {
				isRequired: ["全部"]
			}
		},
		/**/
		/* 设置错误信息 */
		messages: {
			public_key: {
				required: "请输入public_key",
				isEnglishInt: "请输入英文或者数字"
			},
			mchID: {
				required: "请输入mchID",
				isInteger: "请输入数字"
			},
			myPID: {
				required: "请输入myPID",
				isInteger: "请输入数字"
			},
			shopPID: {
				required: "请输入shopPID",
				isEnglishInt: "请输入英文或者数字"
			},
			shopPub_key: {
				required: "请输入shopPub_key",
				isEnglishInt: "请输入英文或者数字"
			},
			shopPri_key: {
				required: "请输入shopPri_key",
				isEnglishInt: "请输入英文或者数字"
			},
			state: {
				isRequired: "请选择渠道状态"
			}
		},
		/* 设置错误信息提示DOM */
		errorPlacement: function(error, element) {
			error.appendTo(element.parent());
		},
	});
};
/*
 * 功能:验证 百度钱包众联(12),美团众联(31),和包众联(120)百度钱包  美团  移动和包
 * 创建人：liql
 * 创建时间：2016-12-21
 */
function fromValidate5() {
	return $("#signupForm5").validate({
		/* 设置验证规则 */
		rules: {
			privateKey: {
				required: true,
				isEnglishInt: true
			},
			mchID: {
				required: true,
				isInteger: true
			},
			state: {
				isRequired: ["全部"]
			}
		},
		/**/
		/* 设置错误信息 */
		messages: {
			privateKey: {
				required: "请输入privateKey",
				isEnglishInt: "请输入英文或者数字"
			},
			mchID: {
				required: "请输入mchID",
				isInteger: "请输入数字"
			},
			state: {
				isRequired: "请选择渠道状态"
			}
		},
		/* 设置错误信息提示DOM */
		errorPlacement: function(error, element) {
			error.appendTo(element.parent());
		},
	});
};
/*
 * 功能:验证 京东钱包众联(13) 京东钱包联鑫付(131)
 * 创建人：liql
 * 创建时间：2016-12-21
 */
function fromValidate6() {
	return $("#signupForm6").validate({
		/* 设置验证规则 */
		rules: {
			appID: {
				isEnglishInt: true
			},
			mchID: {
				required: true,
				isInteger: true
			},
			securtykeyZ: {
				isEnglishInt: true
			},
			appIDB: {
				isEnglishInt: true
			},
			securtykeyB: {
				isEnglishInt: true
			},
			h5AppID: {
				isEnglishInt: true
			},
			h5Securtykey: {
				isEnglishInt: true
			},
			h5PublicKey: {
				isEnglishInt: true
			},
			h5PrivateKey: {
				isEnglishInt: true
			},
			state: {
				isRequired: ["全部"]
			}
		},
		/**/
		/* 设置错误信息 */
		messages: {
			appID: {
				isEnglishInt: "请输入英文或者数字"
			},
			mchID: {
				required: "请输入mchID",
				isInteger: "请输入数字"
			},
			securtykeyZ: {
				isEnglishInt: "请输入英文或者数字"
			},
			appIDB: {
				isEnglishInt: "请输入英文或者数字"
			},
			securtykeyB: {
				isEnglishInt: "请输入英文或者数字"
			},
			h5AppID: {
				isEnglishInt: "请输入英文或者数字"
			},
			h5Securtykey: {
				isEnglishInt: "请输入英文或者数字"
			},
			h5PublicKey: {
				isEnglishInt: "请输入英文或者数字"
			},
			h5PrivateKey: {
				isEnglishInt: "请输入英文或者数字"
			},
			state: {
				isRequired: "请选择渠道状态"
			}
		},
		/* 设置错误信息提示DOM */
		errorPlacement: function(error, element) {
			error.appendTo(element.parent());
		},
	});
};
/*
 * 功能:验证 大众闪惠众联(15)
 * 创建人：liql
 * 创建时间：2016-12-21
 */
function fromValidate7() {
	return $("#signupForm7").validate({
		/* 设置验证规则 */
		rules: {
			privateKey: {
				required: true,
				isEnglishInt: true
			},
			appid: {
				required: true,
				isEnglishInt: true
			},
			state: {
				isRequired: ["全部"]
			}
		},
		/**/
		/* 设置错误信息 */
		messages: {
			privateKey: {
				required: "请输入privateKey",
				isEnglishInt: "请输入英文或者数字"
			},
			appid: {
				required: "请输入appid",
				isEnglishInt: "请输入英文或者数字"
			},
			state: {
				isRequired: "请选择渠道状态"
			}
		},
		/* 设置错误信息提示DOM */
		errorPlacement: function(error, element) {
			error.appendTo(element.parent());
		},
	});
};
/*
 * 功能:验证 翼支付成都(16)
 * 创建人：liql
 * 创建时间：2016-12-21
 */
function fromValidate8() {
	return $("#signupForm8").validate({
		/* 设置验证规则 */
		rules: {
			securekey: {
				required: true,
				isEnglishInt: true
			},
			mchID: {
				required: true,
				isInteger: true
			},
			interfacePassword: {
				required: true,
				isInteger: true
			},
			accountNo: {
				isEnglishInt: true
			},
			cashierChannelNo: {
				isEnglishInt: true
			},
			securekeyB: {
				isEnglishInt: true
			},
			state: {
				isRequired: ["全部"]
			}
		},
		/**/
		/* 设置错误信息 */
		messages: {
			securekey: {
				required: "请输入securekey",
				isEnglishInt: "请输入英文或者数字"
			},
			mchID: {
				required: "请输入mchID",
				isEnglishInt: "请输入数字"
			},
			interfacePassword: {
				required: "请输入interfacePassword",
				isEnglishInt: "请输入数字"
			},
			accountNo: {
				isEnglishInt: "请输入英文或者数字"
			},
			cashierChannelNo: {
				isEnglishInt: "请输入英文或者数字"
			},
			securekeyB: {
				isEnglishInt: "请输入英文或者数字"
			},
			state: {
				isRequired: "请选择渠道状态"
			}
		},
		/* 设置错误信息提示DOM */
		errorPlacement: function(error, element) {
			error.appendTo(element.parent());
		},
	});
};