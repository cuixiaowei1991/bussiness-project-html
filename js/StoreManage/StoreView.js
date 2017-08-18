var pageSize = 20;
var isCreatePage = false;
var curragePage = 1;
var shoreId; //门店id
var posId; //终端id
var payChannelList = new Array();
$(document).ready(function() {
	shoreId = dataHelper.QueryString("storeId");
	//获取门店信息
	GetShoreInfoById(shoreId);
	//添加POS终端按钮操作事件
	$("#addPos").click(function() {
		location.href = "../../html/BusinessManage/addPos.html";
	});

	$.validator.setDefaults({
		debug: true
	});
	fromValidate();
});
/*
 * 创建日期：2016-12-16
 * 功能：获取门店信息
 * 创建人：shiyina
 */
function GetShoreInfoById(shoreId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "storeId", shoreId); //所属商户id
	jsonParam.jsonStr = jsonstr;
	businessShopServer.GetShoreInfoById(jsonParam, callback_GetShoreInfoById);
};

function callback_GetShoreInfoById(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		if (data.rspCode != '003') {
			controlsHelper.alert('查询门店信息失败:' + data.rspDesc);
		}
	} else {
		$("#Title").html(data.storeName);
		$("#shopIdNum").html(data.shopIdNum);
		$("#storeName").html(data.storeName);
		$("#merchantName").html(data.merchantName);
		$("#storeAddress").html(data.storeAddress);
		$("#locationTude").html(data.locationTude);
		$("#businessHours").html(data.businessStartHours + "-" + data.businessEndHours);

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

		$("#servicePhone").html(data.servicePhone);
		$("#storeCreateName").html(data.storeCreateName);
		$("#storeCreateTime").html(data.storeCreateTime);
		$("#storeUpdateTime").html(data.storeUpdateTime);
		$("#storeUpdateName").html(data.storeUpdateName);

		if (data.storeStatus == 0) {
			$("#storeStatus").html('停用');
		}
		if (data.storeStatus == 1) {
			$("#storeStatus").html('启用');
		}
		//获取码表数据
		dataValueHelper.GetDictionaryDataList("applicationSystem", '', '', '', GetDictionaryDataListCallback);
		setTimeout(function() {
			GetTerminalList(1);
		}, 200)
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
		payChannelList = data.lists;
		console.log(payChannelList);
		console.log(data.lists);
		$(".payChannel").empty();
		$.each(data.lists, function(index, entry) {
			$(".payChannel").append("<label><input type='radio' name='types' data-value=" + entry.data_code + " />" + entry.data_name + "   </label>");
		});
		$(".payChannel").find("input[type='radio']:eq(0)").attr('checked', 'checked');
		//选择系统
		$(".payChannel").find("input[type='radio']").click(function() {
			$(".payChannel").find("input[type='radio']").removeAttr('checked');
			$(this).prop('checked', false);

			$(this).attr('checked', 'checked');
			$(this).prop('checked', true);
		});
	}
};
/*
 * 功能：获取pos终端信息列表
 * 创建人：liql
 * 创建时间：2016-12-13
 */
function GetTerminalList(page) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, 'curragePage', page);
	jsonstr = dataHelper.setJson(jsonstr, 'storeId', shoreId);
	jsonstr = dataHelper.setJson(jsonstr, 'termCode', '');
	jsonstr = dataHelper.setJson(jsonstr, 'merchantId', '');
	jsonstr = dataHelper.setJson(jsonstr, 'posType', '');
	jsonstr = dataHelper.setJson(jsonstr, 'createStartTime', '');
	jsonstr = dataHelper.setJson(jsonstr, 'createEndTime', '');
	jsonstr = dataHelper.setJson(jsonstr, 'companyId', '');
	jsonstr = dataHelper.setJson(jsonstr, 'parterId', '');
	jsonstr = dataHelper.setJson(jsonstr, 'peiJianPosParterId', '');
	jsonstr = dataHelper.setJson(jsonstr, 'pageSize', pageSize);
	jsonParam.jsonStr = jsonstr;
	console.log(jsonstr);
	businessPosServer.GetTerminalList(jsonParam, callback_GetTerminalList);
};
/*
 * 功能：获取pos终端信息列表回调函数
 * 创建人：liql
 * 创建时间：2016-12-13
 */
function callback_GetTerminalList(data) {
	console.log(data);
	$("#dictList").html('');
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		alert('查询pos终端列表失败:' + data.rspDesc);
	} else {
		$(".total").html(data.total);
		var template = $("#dictListTemplate").html();
		Mustache.parse(template);
		var listsT = new Array();
		$.each(data.lists, function(index, entry) {
			var value = JSON.stringify(entry);
			var payChannel = entry.payChannel != null && entry.payChannel != undefined && entry.payChannel != '' ? entry.payChannel.replace(',', '') : '';
			value = dataHelper.setJson(value, 'payChannel', payChannel);
			value = dataHelper.setJson(value, 'isStart', entry.terminalState == '1' ? '启用' : '禁用');
			value = dataHelper.setJson(value, 'time', entry.posCreateTime != null && entry.posCreateTime != undefined && entry.posCreateTime != '' ? entry.posCreateTime.substr(0, 19) : '');
			$.each(payChannelList, function(index1, entry1) {
				if (entry1.data_code == payChannel) {
					value = dataHelper.setJson(value, 'payChannelName', entry1.data_name);
				}
			});
			listsT.push(jQuery.parseJSON(value));
		});
		data.lists = listsT;
		var rendered = Mustache.render(template, data);
		$("#dictList").append(rendered);
		
		$("#dictList tr").find('td').each(function() {
			if ($(this).attr('data-code') == 1) {
				$(this).html('传统pos');
			} else if ($(this).attr('data-code') == 2) {
				$(this).html('软pos');
			} else if ($(this).attr('data-code') == 3) {
				$(this).html('虚拟pos');
			} else if ($(this).attr('data-code') == 4) {
				$(this).html('PCpos');
			}
		});
		//权限问题
		$("#dictList").find('tr').each(function() {
			if ($(this).find('td.postype').attr('data-code') == '1' || $(this).find('td.postype').attr('data-code') == '4') {
				$(this).find('span.super').show();
			}
		});

		//修改
		$(".update").click(function() {
			location.href = '../../html/BusinessManage/updatePos.html?id=' + $(this).attr('data-id');
		});
		//删除
		$(".delete").click(function() {
			posId = $(this).attr('data-id');
			$("#sureDeleteBtn").unbind('click');
			$("#sureDeleteBtn").click(function() {
				DeletePosInfo(posId);
			});
		});
		//关联
		$(".super").click(function() {
			$("#pop5").show();
			posType = $(this).attr('data-postype');
			$(".payChannel").find("input[type='radio']").show();
			$(".payChannel").find("input[type='radio']").parent().show();
			$(".payChannel").find("input[type='radio'][data-value=" + $(this).attr('data-payChannel') + "]").hide();
			$(".payChannel").find("input[type='radio'][data-value=" + $(this).attr('data-payChannel') + "]").parent().hide();
			$("#passbtn1").attr('data-merchant', $(this).attr('data-merchant'));
			$("#passbtn1").attr('data-store', $(this).attr('data-store'));
			$("#passbtn1").attr('data-id', $(this).attr('data-id'));
			$(".payChannel").find("input[type='radio'][data-value!=" + $(this).attr('data-payChannel') + "]:eq(0)").attr('checked', 'checked');
		});
		//确定
		$("#passbtn1").click(function() {
			//验证
			if (fromValidate().form()) {
				InsertPosInfo($(this).attr('data-store'), $(this).attr('data-merchant'), $(this).attr('data-id'));
			}

		}); //确定关联

		//分页
		if (!isCreatePage) {
			isCreatePage = true;
			$('.pagination').jqPagination({
				link_string: 'page={page_number}',
				max_page: Math.ceil(data.total / pageSize),
				paged: function(page) {
					curragePage = page;
					console.log(curragePage);
					GetTerminalList(page);
				}
			});
		}
	}
};

/*
 * 功能：删除pos终端信息
 * 创建人：liql
 * 创建时间：2016-12-16
 */
function DeletePosInfo(posId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	jsonParam.jsonStr = dataHelper.setJson(null, 'posId', posId);
	console.log(jsonParam);
	businessPosServer.DeletePosInfo(jsonParam, callback_DeletePosInfo);
};
/*
 * 功能：删除pos终端回调
 * 创建人：liql
 * 创建时间：2016-12-16
 */
function callback_DeletePosInfo(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('删除pos信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert('删除成功');
		isCreatePage = false;
		GetTerminalList('1');
	};
};
/*
 * 功能：新增pos终端信息
 * 创建人：liql
 * 创建时间：2016-12-13
 */
function InsertPosInfo(storeId, merchantId, posId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, 'storeId', storeId);
	jsonstr = dataHelper.setJson(jsonstr, 'merchantId', merchantId);
	jsonstr = dataHelper.setJson(jsonstr, 'termCode', $("#termCode1").val());
	jsonstr = dataHelper.setJson(jsonstr, 'posType', posType);
	jsonstr = dataHelper.setJson(jsonstr, 'payChannel', $(".payChannel").find("input[type='radio'][checked='checked']").attr('data-value') + ",");
	jsonstr = dataHelper.setJson(jsonstr, 'branchId', '');
	jsonstr = dataHelper.setJson(jsonstr, 'posParterId', '');
	jsonstr = dataHelper.setJson(jsonstr, 'peiJianPosParterId', '');
	jsonstr = dataHelper.setJson(jsonstr, 'userType', ''); //待定
	jsonstr = dataHelper.setJson(jsonstr, 'merchaCode', $("#merchaCode").val());
	jsonstr = dataHelper.setJson(jsonstr, 'posStatus', $("#kai").attr('checked') == 'checked' ? '1' : '0');
	jsonstr = dataHelper.setJson(jsonstr, 'codeCount', '1');
	jsonstr = dataHelper.setJson(jsonstr, 'superTermCode', posId);
	jsonParam.jsonStr = jsonstr;
	console.log(jsonstr);
	businessPosServer.InsertPosInfo(jsonParam, callback_insertPosInfo);
};
/*
 * 功能：新增pos终端信息回调函数
 * 创建人：liql
 * 创建时间：2016-12-13
 */
function callback_insertPosInfo(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('新增pos终端信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert('关联成功');
		$("#pop5").hide();
	}
};

function fromValidate() {
	return $("#signupForm").validate({
		/* 设置验证规则 */
		rules: {
			merchaCode: {
				required: true,
				isInteger: true
			},
			termCode: {
				required: true,
				isInteger: true
			}
		},
		/**/
		/* 设置错误信息 */
		messages: {
			merchaCode: {
				required: "请输入商户号",
				isInteger: "商户号只能输入数字"
			},
			termCode: {
				required: "请输入终端号",
				isInteger: "终端只能输入数字"
			}
		},
		/* 设置错误信息提示DOM */
		errorPlacement: function(error, element) {
			error.appendTo(element.parent());
		},
	});
};