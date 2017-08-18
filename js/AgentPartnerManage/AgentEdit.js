var agentId = "";
var brName = "请选择分子公司";
var leveName = "请选择代理商";
$(document).ready(function() {
	agentId = dataHelper.QueryString("agentId");
	/*判断*/
	$("#classFirst").click(function() {
		if ($("#level1").prop("checked")) {
			$("#oneShow").show();
			$("#twoShow").hide();
		}
	});

	$("#classSecond").click(function() {
		if ($("#level2").prop("checked")) {
			$("#twoShow").show();
			$("#oneShow").show();
		};
	});
	if ($("#level1").prop("checked")) {
		$("#oneShow").show();
		$("#twoShow").hide();
	};
	if ($("#level2").prop("checked")) {
		$("#twoShow").show();
		$("#oneShow").show();
	};

	/*提交事件*/
	$("#submitBtn").click(function() {
		event.preventDefault();
		var agentParentId = "";
		var branchId = ""
		if ($("#level1").prop("checked")) {
			branchId = $(".agentParentId1").attr("data-value");
			agentParentId = "0";
		} else if ($("#level2").prop("checked")) {
			branchId = $(".agentParentId1").attr("data-value");
			agentParentId = $(".agentParentId2").attr("data-value");
		};
		var agentId = $(this).attr("data-id");
		if (fromValidate().form()) {
			UpdateAgentInfo(agentId, branchId, agentParentId);
		} else {
			console.log("提交失败")
		};
	});

	/*添加debug参数*/
	$.validator.setDefaults({
		debug: true
	});
	/*页面加载完毕后先注册参数*/
	fromValidate();
	/*获取组织机构信息列表-分子公司*/
	getOrganizationInfoList(brName);

});
/*分子公司*/
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
		alert(data.rspDesc);
	} else {
		var BranchOfficeList = new Array();
		if (data.lists.length > 0) {
			$.each(data.lists, function(index, entry) {
				var values = dataHelper.setJson(null, "value", entry.organizationId);
				values = dataHelper.setJson(values, "name", entry.organizationName);
				BranchOfficeList.push(jQuery.parseJSON(values));
			});
		}
		controlsHelper.downBoxUlLi(brName, BranchOfficeList, "#agentParentId1", ".agentParentId1");
		//改变事件
		$("#agentParentId1 li").click(function() {
			var branchId = $(this).attr("value");
			GetAgentList(branchId);
		});
	}
	/*打开页面就加载数据*/
	GetAgentInfoById(agentId);
};

function GetAgentList(branchId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "branchId", branchId);
	jsonstr = dataHelper.setJson(jsonstr, "level", "1");
	jsonstr = dataHelper.setJson(jsonstr, "curragePage", "1"); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", "5000"); //每页显示记录数

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
				if (entry.menuSuperiorId != 0 && entry.menuSuperiorId != undefined && entry.menuSuperiorId != null) {
					viewdata = dataHelper.setJson(viewdata, "parentValue", entry.menuSuperiorId);
					agentList.push(jQuery.parseJSON(viewdata));
				} else {
					viewdata = dataHelper.setJson(viewdata, "parentValue", '');
					agentList.push(jQuery.parseJSON(viewdata));
				}
			});
		}
		controlsHelper.downBoxUlLi(leveName, agentList, "#agentParentId2", ".agentParentId2");
	};
};

/*获取代理商信息*/
function GetAgentInfoById(agentId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "agentId", agentId);
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	businessAgentServer.GetAgentInfoById(jsonParam, callback_GetAgentInfoById);
};

function callback_GetAgentInfoById(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('获取代理商信息失败:' + data.rspDesc);
	} else {
		if (data.agentId != undefined && data.agentId != null) {
			$("#submitBtn").attr("data-id", data.agentId);
		};
		if (data.agentName != undefined && data.agentName != null) {

			$("#agentName").val(data.agentName);
		};
		if (data.agentShortName != undefined && data.agentShortName != null) {

			$("#agentShortName").val(data.agentShortName);
		};
		if (data.legalPersonName != undefined && data.legalPersonName != null) {

			$("#legalPersonName").val(data.legalPersonName);
		};
		if (data.lagalPersonPhone != undefined && data.lagalPersonPhone != null) {

			$("#lagalPersonPhone").val(data.lagalPersonPhone);
		};
		if (data.shopPeopleName != undefined && data.shopPeopleName != null) {
			$("#shopPeopleName").val(data.shopPeopleName);
		};
		if (data.level != undefined && data.level != null) {
			if (data.level == "1") {
				$("#level1").attr("checked", "checked");
			} else if (data.level == "2") {
				$("#level2").attr("checked", "checked");
				$("#twoShow").show();
				$("#oneShow").show();
			};
		};
		if (data.branchId != undefined && data.branchId != null && data.branchName != undefined && data.branchName != null && data.branchName != '') {
			$(".agentParentId1").attr("data-value", data.branchId);
			$(".agentParentId1").text(data.branchName);
			brName = data.branchName;
		} else {
			$(".agentParentId1").text('请选择分子公司');
		};
		if (data.location != undefined && data.location != null && data.locationName != undefined && data.locationName != null && data.locationName != '') {
			$(".agentParentId2").attr("data-value", data.location);
			$(".agentParentId2").text(data.locationName);
			leveName = data.locationName;
		} else {
			$(".agentParentId2").text('请选择代理商');
		};
		if (data.provinceId != undefined && data.provinceId != null&& data.provinceName != '--') {
			$(".province").attr("data-value", data.provinceId);
		};
		if (data.provinceName != undefined && data.provinceName != null && data.provinceName != '--') {
			$(".province").text(data.provinceName)
		}else{
			$(".province").text('省');
		};
		if (data.cityId != undefined && data.cityId != null) {
			$(".city").attr("data-value", data.cityId);
		};
		if (data.cityName != undefined && data.cityName != null && data.cityName != '--') {
			$(".city").text(data.cityName);
		} else {
			$(".city").text('市');
		};
		if (data.countryId != undefined && data.countryId != null) {
			$(".county").attr("data-value", data.countryId);
		};
		if (data.countryName != undefined && data.countryName != null && data.countryName != '--') {
			$(".county").text(data.countryName);
		} else {
			$(".county").text('县');
		};
		if (data.agentAddress != undefined && data.agentAddress != null) {
			$("#agentAddress").val(data.agentAddress);
		};
		if (data.agentState != undefined && data.agentState != null) {
			if (data.agentState == "1") {
				$("#agentState").attr("checked", "checked");
			} else if (data.agentState == "0") {
				$("#agentState").attr("checked", false);
			}
		};
		if (data.agentType != undefined && data.agentType != null) {
			if (data.agentType == "1") {
				$("#person2").attr("checked", "checked");
			} else if (data.agentType == "0") {
				$("#person1").attr("checked", "checked");
			}
		};
		if (data.allpayid != undefined && data.allpayid != null) {
			$("#allpayid").val(data.allpayid);
		};
		if (data.allpayKey != undefined && data.allpayKey != null) {
			$("#allpayKey").val(data.allpayKey);
		};

	};
};
/*修改*/
function UpdateAgentInfo(agentId, branchId, agentParentId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "agentId", agentId); //代理商名称
	jsonstr = dataHelper.setJson(jsonstr, "agentName", $("#agentName").val()); //代理商名称
	jsonstr = dataHelper.setJson(jsonstr, "agentShortName", $("#agentShortName").val()); //代理商简称
	jsonstr = dataHelper.setJson(jsonstr, "legalPersonName", $("#legalPersonName").val()); //代理人名称
	jsonstr = dataHelper.setJson(jsonstr, "lagalPersonPhone", $("#lagalPersonPhone").val()); //代理人手机号
	jsonstr = dataHelper.setJson(jsonstr, "shopPeopleName", $("#shopPeopleName").val()); //拓展人
	jsonstr = dataHelper.setJson(jsonstr, "level", $("#level1").prop("checked") ? "1" : "2"); //级别-----还没跟后台人员约定
	jsonstr = dataHelper.setJson(jsonstr, "branchId", branchId); //所属分公司id
	jsonstr = dataHelper.setJson(jsonstr, "agentParentId", agentParentId); //上级代理id
	jsonstr = dataHelper.setJson(jsonstr, "provinceId", $(".province").attr("data-value") == undefined ? '' : $(".province").attr("data-value")); //省ID
	jsonstr = dataHelper.setJson(jsonstr, "provinceName", $(".province").text()); //省名称
	jsonstr = dataHelper.setJson(jsonstr, "cityId", $(".city").attr("data-value") == undefined ? '' : $(".city").attr("data-value"));
	jsonstr = dataHelper.setJson(jsonstr, "cityName", $(".city").text());
	jsonstr = dataHelper.setJson(jsonstr, "countryId", $(".county").attr("data-value") == undefined ? '' : $(".county").attr("data-value"));
	jsonstr = dataHelper.setJson(jsonstr, "countryName", $(".county").text());
	jsonstr = dataHelper.setJson(jsonstr, "agentAddress", $("#agentAddress").val()); //地址
	jsonstr = dataHelper.setJson(jsonstr, "agentState", $("#agentState").prop("checked") ? "1" : "0"); //是否启用 0: 停用 1： 启用 是
	jsonstr = dataHelper.setJson(jsonstr, "isCreatePosParter", $("#isCreatePosParter").prop("checked") ? "1" : "0"); //是否创建pos合作方 0： 否 1： 是 
	jsonstr = dataHelper.setJson(jsonstr, "agentType", $("#person1").prop("checked") ? "0" : "1"); //代理商类型
	jsonstr = dataHelper.setJson(jsonstr, "allpayid", $("#allpayid").val()); //Allpay分配给代理商接入ID
	jsonstr = dataHelper.setJson(jsonstr, "allpayKey", $("#allpayKey").val()); //Allpay分配给代理商接入key1
	jsonstr = dataHelper.setJson(jsonstr, "agentState", $("#agentState").prop("checked") ? "1" : "0"); //级别-----还没跟后台人员约定
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	businessAgentServer.UpdateAgentInfo(jsonParam, callback_UpdateAgentInfo)
};

function callback_UpdateAgentInfo(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('修改代理商信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert("修改成功", "20%")
		AgainRegisterClick("AgentPartnerManage-AgentList","代理商管理");
	};
};

/*验证方法*/
function fromValidate() {
	return $("#signupForm").validate({
		/* 设置验证规则 */
		rules: {
			agentName: {
				required: true,
				isSpecialChart: true
			},
			/*agentShortName: {
				required: true,
				isSpecialChart: true
			},
			legalPersonName: {
				required: true,
				isSpecialChart: true
			},*/
			lagalPersonPhone: {
				required: true,
				isMobile: true
			},
			shopPeopleName: {
				required: true,
				isSpecialChart: true
			},
			/*agentAddress: {
				required: true,
				isSpecialChart: true
			},*/
			allpayid: {
				required: true,
				isSpecialChart: true
			},
			allpayKey: {
				required: true,
				isSpecialChart: true
			},
			/*province: {
				isRequired: ["省"]
			},
			city: {
				isRequired: ["请选择"]
			},
			county: {
				isRequired: ["请选择"]
			},*/
			agentParentId1: {
				isRequired: ["请选择分子公司"]
			},
			agentParentId2: {
				isRequired: function() {
					if ($("#level2").prop("checked")) {
						return ["请选择代理商"];
					} else {
						return ["代理商"];
					}
				}
			}
		},

		/* 设置错误信息 */
		messages: {
			agentName: {
				required: "请输入代理商全称",
				isSpecialChart: "您输入的代理商全称包含特殊字符"
			},
			/*agentShortName: {
				required: "请输入代理商简称",
				isSpecialChart: "您输入的代理商简称包含特殊字符"
			},
			legalPersonName: {
				required: "请输入代理商联系人",
				isSpecialChart: "您输入的代理商联系人包含特殊字符"
			},*/
			lagalPersonPhone: {
				required: "请输入联系人手机号",
				isMobile: "请输入一个合法的手机号"
			},
			shopPeopleName: {
				required: "请输入拓展人",
				isSpecialChart: "您输入的拓展人包含特殊字符"
			},
			/*agentAddress: {
				required: "请输入详细地址",
				isSpecialChart: "您输入的详细地址包含特殊字符"
			},*/
			allpayid: {
				required: "请输入代理商接入ID",
				isSpecialChart: "您输入的代理商接入ID包含特殊字符"
			},
			allpayKey: {
				required: "请输入代理商接入Key",
				isSpecialChart: "您输入的代理商接入Key包含特殊字符"
			},
			/*province: {
				isRequired: "请选择省"
			},
			city: {
				isRequired: "请选择市辖区或所在县"
			},
			county: {
				isRequired: "请选择县或所在区"
			},*/
			agentParentId1: {
				isRequired: "请选择分子公司"
			},
			agentParentId2: {
				isRequired: "请选择代理商"
			}
		},
		/* 设置错误信息提示DOM */
		errorPlacement: function(error, element) {
			console.log(error);
			error.appendTo(element.parent());
		},
	});

};