var pageSize = 10;
var curragePage = 1;
var isCreatePage = false;
var channelListAdd = new Array();
var channelListUpdate = new Array();
var merchantId;
var channelCode;
var channelName;
$(document).ready(function() {
	$.validator.setDefaults({
		debug: true
	});
	//查询
	$("#selectBtn").click(function() {
		if (timeHelper.checkEndDate($("#reservation1").val(), $("#reservation2").val())) {
			isCreatePage = false;
			GetBusinessList('1');
			$("#tipsError").html('');
		} else {
			$("#tipsError").html('截止日期不能小于开始日期');
		}
	});

	//导出
	$("#BulkExport").click(function() {
		ExportBugsinessList();
	});
	//弹框确定事件
	$(".popGroup").find('section').find('div.modal-footer button.btn.btn-primary').click(function() {
		if ($(this).parent().parent().parent().parent().parent().css('display') == 'block') {
			//显示，获取输入参数，加入channelList
			GetListChannel($(this).parent().parent().parent().parent().parent());
			//新增业务签约
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
	//获取码表 渠道状态
	dataValueHelper.GetDictionaryDataList("channelState", '.channelState', '.channelStateBtn', '全部'); //码表
	setTimeout(function() {
		dataValueHelper.GetDictionaryDataList("payChannel", '#channelCode', '.channelCode', '全部'); //码表
		setTimeout(function() {
			dataValueHelper.GetDictionaryDataList("channelState", '#status', '.status', '全部'); //码表
			setTimeout(function() {
				isCreatePage = false;
				GetBusinessList('1');
			}, 500);
		}, 200);
	}, 200);

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
 * 功能：导出业务签约信息列表
 * 创建人：liql
 * 创建时间：2017-1-4
 */
function ExportBugsinessList() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, 'merchantName', $("#merchantName").val());
	jsonstr = dataHelper.setJson(jsonstr, 'business', '');
	jsonstr = dataHelper.setJson(jsonstr, 'merchantShortName', '');
	jsonstr = dataHelper.setJson(jsonstr, 'startTime', $("#reservation1").val());
	jsonstr = dataHelper.setJson(jsonstr, 'endTime', $("#reservation2").val());

	var code = $(".channelCode").attr('data-value');
	code = code == null || code == undefined || code == '' ? '' : "'" + code.replace(/\,/gi, "','") + "'";
	jsonstr = dataHelper.setJson(jsonstr, 'channelCode', code);
	jsonstr = dataHelper.setJson(jsonstr, 'status', $(".status").attr('data-value') == undefined ? '' : $(".status").attr('data-value'));
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	businessPosServer.ExportBugsinessList(jsonParam, callback_ExportBugsinessList);
};
/*
 * 功能：导出业务签约信息列表
 * 创建人：liql
 * 创建时间：2017-1-4
 */
function callback_ExportBugsinessList(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('导出业务签约信息列表失败:' + data.rspDesc);
	} else {
		console.log("导出成功");
		location.href = data.contextPath;
	};
};
/*
 * 功能：获取业务签约信息列表
 * 创建人：liql
 * 创建时间：2016-12-14
 */
function GetBusinessList(page) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, 'merchantName', $("#merchantName").val());
	jsonstr = dataHelper.setJson(jsonstr, 'business', '');
	jsonstr = dataHelper.setJson(jsonstr, 'merchantShortName', '');
	jsonstr = dataHelper.setJson(jsonstr, 'startTime', $("#reservation1").val());
	jsonstr = dataHelper.setJson(jsonstr, 'endTime', $("#reservation2").val());

	var code = $(".channelCode").attr('data-value');
	code = code == null || code == undefined || code == '' ? '' : "'" + code.replace(/\,/gi, "','") + "'";
	jsonstr = dataHelper.setJson(jsonstr, 'channelCode', code);
	jsonstr = dataHelper.setJson(jsonstr, 'status', $(".status").attr('data-value') == undefined ? '' : $(".status").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, 'curragePage', page);
	jsonstr = dataHelper.setJson(jsonstr, 'pageSize', pageSize);
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	businessPosServer.GetBusinessList(jsonParam, callback_getBusinessList);
};
/*
 * 功能：获取业务签约信息列表回调
 * 创建人：liql
 * 创建时间：2016-12-14
 */
function callback_getBusinessList(data) {
	console.log(data);
	$("#dictList").html('');
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('获取pos终端列表失败:' + data.rspDesc);
	} else {
		var template = $("#dictListTemplate").html();
		Mustache.parse(template);
		var listsT = new Array();
		$.each(data.lists, function(index, entry) {
			var value = JSON.stringify(entry);
			value = dataHelper.setJson(value, 'isStart', entry.businessState == '1' ? '启用' : '禁用');
			value = dataHelper.setJson(value, 'channelStateName', getDataNameByCode(entry.businessChannelState));
			value = dataHelper.setJson(value, 'times', entry.businessCreateTime != null && entry.businessCreateTime != undefined && entry.businessCreateTime != '' ? entry.businessCreateTime.substr(0, 19) : '');
			listsT.push(jQuery.parseJSON(value));
		});
		data.lists = listsT;
		var render = Mustache.render(template, data);
		$("#dictList").append(render);

		//业务配置修改
		$(".businessSet").click(function() {
			merchantId = $(this).attr('data-merchantid');
			channelCode = $(this).attr('data-code');
			channelName = $(this).attr('data-name');
			//配置弹框
			getPopGroupByChannelCode(parseInt(channelCode), channelName);
			//获取业务签约信息
			GetBusinessInfoByid($(this).attr('data-code'), $(this).attr('data-merchantid'));
		});
		//删除
		$(".delete").click(function() {
			if (confirm("您真的确定要删除吗?")) {
				DeleteBusinessInfo($(this).attr('data-code'), $(this).attr('data-merchantid'));
			}
		});
		$(".total").html(data.total);

		//分页
		if (!isCreatePage) {
			isCreatePage = true;
			$('.pagination').jqPagination({
				current_page:1,
				link_string: 'page={page_number}',
				max_page: Math.ceil(data.total / pageSize),
				paged: function(page) {
					console.log("第" + page + "页");
					curragePage = page;
					GetBusinessList(curragePage);
				}
			});
		}

	}
};
/*
 * 功能：根据code获取渠道name
 * 创建人：liqlc
 * 创建时间：2016-12-21
 */
function getDataNameByCode(code) {
		var name;
		$("#status").find('li').each(function() {
			if ($(this).attr('value') == code) {
				name = $(this).find('a').html();
			}
		});
		return name;
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
		console.log(codeList);
		console.log(code);
		var isExist = false;
		if (codeList.indexOf(code) >= 0) {
			console.log('xx');
			//存在
			$(this).show();
			console.log(name);
			$(this).find('h4.modal-title').html(name);
			$(this).find('input[type=text]').val('');
			$(this).find('input[type=checkbox]').removeAttr('checked');
			$(this).find('input[type=password]').val('');
			$(this).find('a.mailbox-attachment-name.files').text('');
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
		GetBusinessList('1');
	}
};
/*
 * 功能：获取业务签约信息
 * 创建人：liql
 * 创建时间：2016-12-15
 */
function GetBusinessInfoByid(code, merchantId) {
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
		channelName = data.channelName;
		channelCode = data.channelCode;
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
 * 功能：删除业务签约信息
 * 创建人：liql
 * 创建时间：2016-12-16
 */
function DeleteBusinessInfo(code, merchantId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, 'merchantId', merchantId);
	jsonstr = dataHelper.setJson(jsonstr, 'channelCode', code);
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	businessPosServer.DeletePosInfo(jsonParam, callback_DeleteBusinessInfo);
};
/*
 * 功能：删除业务签约回调
 * 创建人：liql
 * 创建时间：2016-12-16
 */
function callback_DeleteBusinessInfo(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('删除业务签约信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert('删除成功');
		isCreatePage = false;
		GetTerminalList('1');
	};
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