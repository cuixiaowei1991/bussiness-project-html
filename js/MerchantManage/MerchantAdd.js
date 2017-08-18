$(document).ready(function() {
	dataValueHelper.GetDictionaryDataList("industry", "#mhtIndustry", ".mhtIndustry", '请选择行业');
	//获取组织机构信息列表
	getOrganizationInfoList();

	//选择商户查看按钮操作事件
	$("#ViewMerchant").click(function() {
		GetMerchantList();
	});
	//新增商户按按钮操作事件
	fromValidate();
	$("#resourceadd").click(function() {
		if (fromValidate().form()) {
			event.preventDefault();
			InsertMerchantInfo();
		};
	});

});
/*
 * 创建日期：2016-12-09
 * 功能：新增商户信息
 * 创建人：shiyina
 */
function InsertMerchantInfo() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "mhtName", $("#mhtName").val()); //商户名称
	jsonstr = dataHelper.setJson(jsonstr, "branchId", $(".BranchOffice").attr('data-value') == undefined ? '' : $(".BranchOffice").attr('data-value')); //分公司id
	jsonstr = dataHelper.setJson(jsonstr, "branchName", $(".BranchOffice").html()); //分公司名称
	console.log($(".FirstAgent").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, "mhtAgentId", $(".TwoAgents").attr('data-value') == '' ? $(".FirstAgent").attr('data-value') : $(".TwoAgents").attr('data-value')); //代理商id

	jsonstr = dataHelper.setJson(jsonstr, "mhtShortName", $("#mhtShortName").val()); //商户简称
	var isCreateStore;
	if ($("#isCreateStore").is(":checked")) {
		isCreateStore = '1';
	} else {
		isCreateStore = '0';
	}
	jsonstr = dataHelper.setJson(jsonstr, "isCreateStore", isCreateStore); //1是创建，0为不创建
	jsonstr = dataHelper.setJson(jsonstr, "mhtProvinceId", $(".province").attr('data-value') == undefined ? '' : $(".province").attr('data-value')); //省id
	jsonstr = dataHelper.setJson(jsonstr, "mhtCityId", $(".city").attr('data-value') == undefined ? '' : $(".city").attr('data-value')); //市id
	jsonstr = dataHelper.setJson(jsonstr, "mhtCountryId", $(".county").attr('data-value') == undefined ? '' : $(".county").attr('data-value')); //县id
	jsonstr = dataHelper.setJson(jsonstr, "mhtAddress", $("#mhtAddress").val()); //地址
	jsonstr = dataHelper.setJson(jsonstr, "mhtIndustry", $(".mhtIndustry").html()); //行业名称(类目)
	jsonstr = dataHelper.setJson(jsonstr, "mhtIndustryNum", $(".mhtIndustry").attr('data-value') == undefined ? '' : $(".mhtIndustry").attr('data-value')); //行业代码(类目)
	jsonstr = dataHelper.setJson(jsonstr, "mhtManager", $("#mhtManager").val()); //管理员
	jsonstr = dataHelper.setJson(jsonstr, "mhtManagerPhone", $("#mhtManagerPhone").val()); //管理手机号
	var mhtState;
	if ($("#mhtState").is(":checked")) {
		mhtState = '1';
	} else {
		mhtState = '0';
	}
	jsonstr = dataHelper.setJson(jsonstr, "mhtState", mhtState); //是否启用0:停用 1：启用
	jsonParam.jsonStr = jsonstr;
	console.log(jsonstr);
	businessShopServer.InsertMerchantInfo(jsonParam, callback_InsertMerchantInfo);
};

function callback_InsertMerchantInfo(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('新增商户信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert('新增成功');
		AgainRegisterClick("MerchantManage-MerchantList","商户列表");
	}
};


/*
 * 创建日期：2016-12-12
 * 功能：获取组织机构信息列表
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
	console.log(jsonParam);
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
		controlsHelper.downBoxUlLi('请选择分公司', BranchOfficeList, "#BranchOffice", ".BranchOffice");
		
		$("#BranchOffice").find('li').click(function() {
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
	jsonstr = dataHelper.setJson(jsonstr, "branchId", $(".BranchOffice").attr('data-value')); //所属分公司id
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
		console.log(agentList);
		controlsHelper.downBoxLinkageUlLi('请选择代理商', agentList, "#TwoAgents", "#FirstAgent", ".TwoAgents", ".FirstAgent");
	};
};