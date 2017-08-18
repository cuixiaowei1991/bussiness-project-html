var CurrPage = 1;
var PageSize = 20;
var isCreatePage = false;
var totalPage; //总页数
var merchantId; //商户id
$(document).ready(function() {
	dataValueHelper.GetDictionaryDataList("industry", "#mhtIndustry", ".mhtIndustry", '请选择行业');
	setTimeout(function() {
		dataValueHelper.GetDictionaryDataList("payChannel", "#mhtOpenChannel", ".mhtOpenChannel", '请选择业务');
		setTimeout(function() {
			dataValueHelper.GetDictionaryDataList("shopState", "#mhtApproveStatus", ".mhtApproveStatus", '请选择状态');
			setTimeout(function() {
				getOrganizationInfoList();
				setTimeout(function() {
					GetMerchantList(CurrPage);
				}, 500)
			}, 500)
		}, 500);
	}, 500);

	//查询按钮操作事件
	$("#query").click(function() {
		if (timeHelper.checkEndDate($("#reservation1").val(), $("#reservation2").val())) {
			isCreatePage = false;
			GetMerchantList(CurrPage);
			$("#tipsError").html('');
		} else {
			$("#tipsError").html('截止日期不能小于开始日期');
		}
	});
	//批量导出按钮操作事件
	$("#BulkExport").click(function() {

	});
	//批量导入按钮操作事件
	$("#BatchImport").click(function() {

	});
	//添加商户按钮操作事件
	$("#AddMerchant").click(function() {
		location.href = 'MerchantAdd.html';
	});
	//
	$(".close").click(function() {
		$("#btnReject").val('');
		$("#btnReject").removeClass('error');
		$(".error").hide();
	});
	$("#BulkExport").click(function() {
		MerchantExcelExport(CurrPage);
	})
});
/*
 * 创建日期：2016-11-21
 * 功能：获取用户信息列表
 * 创建人：shiyina
 */
function GetMerchantList(CurrPage) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", CurrPage.toString()); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "mhtName", $("#mhtName").val()); //商户名称
	jsonstr = dataHelper.setJson(jsonstr, "mhtIndustryNum", $(".mhtIndustry").attr('data-value') == undefined ? '' : $(".mhtIndustry").attr('data-value')); //所属行业（代码）
	jsonstr = dataHelper.setJson(jsonstr, "mhtProvinceId", $(".province").attr('data-value') == undefined ? '' : $(".province").attr('data-value')); //省ID
	jsonstr = dataHelper.setJson(jsonstr, "mhtCityId", $(".city").attr('data-value') == undefined ? '' : $(".city").attr('data-value')); //市ID
	jsonstr = dataHelper.setJson(jsonstr, "mhtBeanchCompId", $(".mhtBeanchCompId").attr('data-value') == undefined ? '' : $(".mhtBeanchCompId").attr('data-value')); // 所属分公司Id
	jsonstr = dataHelper.setJson(jsonstr, "mhtAgentId", $(".TwoAgents").attr('data-value') == '' ? $(".FirstAgent").attr('data-value') : $(".TwoAgents").attr('data-value')); //所属代理商Id
	jsonstr = dataHelper.setJson(jsonstr, "mhtOpenChannel", $(".mhtOpenChannel").attr('data-value') == undefined ? '' : $(".mhtOpenChannel").attr('data-value')); //已开通业务（渠道码）
	jsonstr = dataHelper.setJson(jsonstr, "mhtStartCreateTime", $("#reservation1").val()); //录入开始时间
	jsonstr = dataHelper.setJson(jsonstr, "mhtEndCreateTime", $("#reservation2").val()); //录入结束时间
	jsonstr = dataHelper.setJson(jsonstr, "mhtApproveStatus", $(".mhtApproveStatus").attr('data-value') == undefined ? '' : $(".mhtApproveStatus").attr('data-value')); //商户审核状态 0:停用 1：启用2:合同到期  3、4:预注册 5:待审核 6:驳回
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", PageSize.toString()); //每页显示记录数
	jsonParam.jsonStr = jsonstr;
	console.log(jsonstr);
	businessShopServer.GetMerchantList(jsonParam, callback_GetMerchantList);
};

function callback_GetMerchantList(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('查看用户信息列表失败:' + data.rspDesc);
	} else {
		$("#MerchantList").html('');
		var template = $("#MerchantListTemplate").html();
		Mustache.parse(template);

		var rendered = Mustache.render(template, data);
		$("#MerchantList").append(rendered);

		$("#infoTatal").html(data.total);

		$('#MerchantList tr').find('td').each(function() {
			if ($(this).attr("data-mhtState") == 0) {
				$(this).html('停用');
			} else if ($(this).attr("data-mhtState") == 1) {
				$(this).html('启用');
			}
		});
		$('#MerchantList tr').find('td').each(function() {
			if ($(this).attr("data-Status") == '待审核') {
				$(this).find('span').eq(3).removeClass('none');
				$(this).find('span').eq(4).removeClass('none');
			}
		});
		//删除按钮操作事件
		$(".btnDelete").click(function() {
			merchantId = $(this).attr('data-mhtId');
			$("#sureDeleteBtn").unbind('click');
			$("#sureDeleteBtn").click(function() {
				//调用删除函数
				DeleteMerchant(merchantId);
			});
		});
		
		AgainRegisterClick();
		//查看按钮操作事件
		/*$(".btnView").click(function() {
			merchantId = $(this).attr('data-mhtId');
			location.href = 'MerchantView.html?merchantId=' + merchantId;
		});*/
		//通过按钮操作事件
		$(".btnAdopt").click(function() {
			merchantId = $(this).attr('data-mhtId');
			//调用通过函数
			UpdateMerchantStatus(merchantId, 2);
		});
		//驳回按钮操作事件
		$(".btnReject").click(function() {
			merchantId = $(this).attr('data-mhtId');
			$("#ReasonRetion").show();
			$("#ResetPassbtn").attr('data-mhtId', merchantId);
			$("#ResetPassbtn").unbind('click');
			//商户驳回按钮操作事件
			fromValidate();
			$("#ResetPassbtn").click(function() {
				if (fromValidate().form()) {
					merchantId = $(this).attr('data-mhtId');
					//调用驳回函数
					UpdateMerchantStatus(merchantId, 3);
				};
			});

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
	}
};
/*
 * 创建日期：2016-12-12
 * 功能：获取组织机构信息列表（分子公司）
 * 创建人：shiyina
 */
function getOrganizationInfoList() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", "1"); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", '50000'); //每页显示记录数
	jsonstr = dataHelper.setJson(jsonstr, "organizationName", ''); //组织机构名称
	jsonstr = dataHelper.setJson(jsonstr, "organizationState", '1'); //是否启用1--启用 2--禁用
	jsonParam.jsonStr = jsonstr;
	//	console.log(jsonParam);
	systemUserService.GetOrganizationInfoList(jsonParam, callback_getOrganizationInfoList)
};

function callback_getOrganizationInfoList(data) {
	console.log(data);
	if (data == undefined || data == null || data.rspCode != "000") {
		console.log(data.rspDesc);
	} else {
		var BranchOfficeList = new Array();
		if (data.lists.length > 0) {
			$.each(data.lists, function(index, entry) {
				var values = dataHelper.setJson(null, "value", entry.organizationId);
				values = dataHelper.setJson(values, "name", entry.organizationName);
				BranchOfficeList.push(jQuery.parseJSON(values));
			});
		}
		//		console.log(BranchOfficeList);
		controlsHelper.downBoxUlLi('请选择分公司', BranchOfficeList, "#mhtBeanchCompId", ".mhtBeanchCompId");
		$("#mhtBeanchCompId").find('li').click(function() {
			GetAgentList();
		});
	}
};

/*
 * 创建日期：2016-11-22
 * 功能：获取代理商信息列表
 * 创建人：shiyina
 */
function GetAgentList() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", "1"); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", '50000'); //每页显示记录数
	jsonstr = dataHelper.setJson(jsonstr, "agentName", ''); //代理商名称
	jsonstr = dataHelper.setJson(jsonstr, "branchId", $(".mhtBeanchCompId").attr('data-value')); //所属分公司id
	jsonstr = dataHelper.setJson(jsonstr, "agentParentId", ''); //所属父级代理商id
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	businessAgentServer.GetAgentList(jsonParam, callback_GetAgentList);
};

function callback_GetAgentList(data) {
	console.log(data);
	if (data == undefined || data == null || data.rspCode != "000") {
		alert(data.rspDesc);
	} else {
		var agentList = new Array();
		if (data.lists.length > 0) {
			$.each(data.lists, function(entryIndex, entry) {
				var viewdata = dataHelper.setJson(null, "name", entry.agentName);
				viewdata = dataHelper.setJson(viewdata, "value", entry.agentId);
				if (entry.agentParentId != 0 && entry.agentParentId != undefined && entry.agentParentId != null) {
					viewdata = dataHelper.setJson(viewdata, "parentValue", entry.agentParentId);
					agentList.push(jQuery.parseJSON(viewdata));
				} else {
					viewdata = dataHelper.setJson(viewdata, "parentValue", '');
					agentList.push(jQuery.parseJSON(viewdata));
				}

			});
		}
		controlsHelper.downBoxLinkageUlLi('请选择代理商', agentList, "#TwoAgents", "#FirstAgent", ".TwoAgents", ".FirstAgent");
	};
};
/*
 * 创建日期：2016-12-20
 * 功能：删除用户信息
 * 创建人：shiyina
 */
function DeleteMerchant(merchantId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "merchantId", merchantId); //用户id
	jsonParam.jsonStr = jsonstr;
	console.log(jsonstr);
	businessShopServer.DeleteMerchant(jsonParam, callback_DeleteMerchant);
};

function callback_DeleteMerchant(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('删除用户信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert("删除成功", "20%");
		GetMerchantList(CurrPage);
	}
};
/*
 * 创建日期：2016-11-22
 * 功能：修改商户状态
 * 创建人：shiyina
 */
function UpdateMerchantStatus(merchantId, status) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "merchantId", merchantId); //商户Id
	jsonstr = dataHelper.setJson(jsonstr, "status", status); //状态
	jsonstr = dataHelper.setJson(jsonstr, "remark", $("#btnReject").val()); //状态
	jsonParam.jsonStr = jsonstr;
	console.log(jsonstr);
	businessShopServer.UpdateMerchantStatus(jsonParam, callback_UpdateMerchantStatus);
};

function callback_UpdateMerchantStatus(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('修改商户状态失败:' + data.rspDesc);
	} else {
		$("#ReasonRetion").hide();
		controlsHelper.alert("修改商户状态成功", "20%");
		GetMerchantList(CurrPage);
	}
};
/*导出*/
function MerchantExcelExport(CurrPage) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", CurrPage.toString()); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "mhtName", $("#mhtName").val()); //商户名称
	jsonstr = dataHelper.setJson(jsonstr, "mhtIndustryNum", $(".mhtIndustry").attr('data-value') == undefined ? '' : $(".mhtIndustry").attr('data-value')); //所属行业（代码）
	jsonstr = dataHelper.setJson(jsonstr, "mhtProvinceId", $(".province").attr('data-value') == undefined ? '' : $(".province").attr('data-value')); //省ID
	jsonstr = dataHelper.setJson(jsonstr, "mhtCityId", $(".city").attr('data-value') == undefined ? '' : $(".city").attr('data-value')); //市ID
	jsonstr = dataHelper.setJson(jsonstr, "mhtBeanchCompId", $(".mhtBeanchCompId").attr('data-value') == undefined ? '' : $(".mhtBeanchCompId").attr('data-value')); // 所属分公司Id
	jsonstr = dataHelper.setJson(jsonstr, "mhtAgentId", $(".TwoAgents").attr('data-value') == '' ? $(".FirstAgent").attr('data-value') : $(".TwoAgents").attr('data-value')); //所属代理商Id
	jsonstr = dataHelper.setJson(jsonstr, "mhtOpenChannel", $(".mhtOpenChannel").attr('data-value') == undefined ? '' : $(".mhtOpenChannel").attr('data-value')); //已开通业务（渠道码）
	jsonstr = dataHelper.setJson(jsonstr, "mhtStartCreateTime", $("#reservation1").val()); //录入开始时间
	jsonstr = dataHelper.setJson(jsonstr, "mhtEndCreateTime", $("#reservation2").val()); //录入结束时间
	jsonstr = dataHelper.setJson(jsonstr, "mhtApproveStatus", $(".mhtApproveStatus").attr('data-value') == undefined ? '' : $(".mhtApproveStatus").attr('data-value')); //商户审核状态 0:停用 1：启用2:合同到期  3、4:预注册 5:待审核 6:驳回
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", PageSize.toString()); //每页显示记录数
	jsonParam.jsonStr = jsonstr;
	//	console.log(jsonstr);
	businessShopServer.ExportGetMerchantList(jsonParam, callback_MerchantExcelExport);
};
/*导出回调*/
function callback_MerchantExcelExport(data) {
	console.log(data);
	if (data == undefined || data == null || data.rspCode != "000") {
		alert(data.rspDesc);
	} else {
		console.log(data.contextPath);
		location.href = data.contextPath;
	};
};