var branchId;
var belongParterId;
$(document).ready(function() {
	/*获取组织机构信息列表-分子公司*/
	getOrganizationInfoList();

	$("#submitBtn").click(function() {
		event.preventDefault();
		belongParterId = "";
		var branchId = ""
		if ($("#level1").prop("checked")) {
			branchId = $(".branch").attr("data-value");
			belongParterId = "0";
		} else if ($("#level2").prop("checked")) {
			branchId = $(".agentParentId1").attr("data-value");
			belongParterId = $(".parter").attr("data-value");
		};
		if (fromValidate().form()) {
			InserPosParterInfo(branchId, belongParterId);
		} else {
			console.log("提交失败")
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
		}
	});
	/*添加debug参数*/
	$.validator.setDefaults({
		debug: true
	});
	/*页面加载完毕后先注册参数*/
	fromValidate();


});
/*
 * 创建日期：2016-12-09
 * 功能：新增pos合作方信息
 * 创建人：xbl
 */
function InserPosParterInfo(branchId, belongParterId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "parterName", $("#parterName").val());
	jsonstr = dataHelper.setJson(jsonstr, "parterShortName", $("#parterShortName").val());
	jsonstr = dataHelper.setJson(jsonstr, "connectPerson", $("#connectPerson").val());
	jsonstr = dataHelper.setJson(jsonstr, "connectTel", $("#connectTel").val());
	jsonstr = dataHelper.setJson(jsonstr, "expandPeople", $("#expandPeople").val());
	jsonstr = dataHelper.setJson(jsonstr, "parterLevel", $("#level1").prop("checked") ? "1" : "2");
	jsonstr = dataHelper.setJson(jsonstr, "branchId", $(".branch").attr("data-value")==undefined?'':$(".branch").attr("data-value"));
	jsonstr = dataHelper.setJson(jsonstr, "belongParterId", belongParterId); //$(".parter").attr("data-value")
	jsonstr = dataHelper.setJson(jsonstr, "provinceId", $(".province").attr("data-value")==undefined?'':$(".province").attr("data-value"));
	jsonstr = dataHelper.setJson(jsonstr, "provinceName", $(".province").text());
	jsonstr = dataHelper.setJson(jsonstr, "cityId", $(".city").attr("data-value")==undefined?'':$(".city").attr("data-value"));
	jsonstr = dataHelper.setJson(jsonstr, "cityName", $(".city").text());
	jsonstr = dataHelper.setJson(jsonstr, "countryId", $(".country").attr("data-value")==undefined?'':$(".country").attr("data-value"));
	jsonstr = dataHelper.setJson(jsonstr, "countryName", $(".country").text());
	jsonstr = dataHelper.setJson(jsonstr, "parterAddress", $("#parterAddress").val());
	jsonstr = dataHelper.setJson(jsonstr, "parterState", $("#parterState").prop("checked") ? "1" : "0");

	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	businessAgentServer.InserPosParterInfo(jsonParam, callback_InserPosParterInfo);
};

function callback_InserPosParterInfo(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('新增POS合作方信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert('新增成功');
		AgainRegisterClick("AgentPartnerManage-PartnerList","POS合作方管理");
	}

};

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
		//console.log(BranchOfficeList);
		controlsHelper.downBoxUlLi("请选择分子公司", BranchOfficeList, "#branch", ".branch");

		/*根据分公司Id获取对应的合作商*/
		//改变事件
		$("#branch li").click(function() {
			GetPosParterListD();
		});
	}
};
/*合作方*/
function GetPosParterListD() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};

	var jsonstr = dataHelper.setJson(null, "parterLevel", "1"); //合作方级别
	jsonstr = dataHelper.setJson(jsonstr, "branchId", $('.branch').attr("data-value"));
	jsonstr = dataHelper.setJson(jsonstr, "curragePage", "1"); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", '50000'); //每页显示记录数

	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam);
	businessAgentServer.GetPosParterList(jsonParam, callback_GetPosParterListD);

};

function callback_GetPosParterListD(data) {
	console.log(data);
	if (data == undefined || data == null || data.rspCode != "000") {
		alert(data.rspDesc);
	} else {
		var ParterList = new Array();
		if (data.lists.length > 0) {
			$.each(data.lists, function(entryIndex, entry) {
				var viewdata = dataHelper.setJson(null, "name", entry.parterName);
				viewdata = dataHelper.setJson(viewdata, "value", entry.parterId);
				if (entry.menuSuperiorId != 0 && entry.menuSuperiorId != undefined && entry.menuSuperiorId != null) {
					viewdata = dataHelper.setJson(viewdata, "parentValue", entry.menuSuperiorId);
					ParterList.push(jQuery.parseJSON(viewdata));
				} else {
					viewdata = dataHelper.setJson(viewdata, "parentValue", '');
					ParterList.push(jQuery.parseJSON(viewdata));
				}

			});
		}
		//console.log(agentList);
		controlsHelper.downBoxUlLi("请选择合作方", ParterList, "#parter", ".parter");
	};

};
/*验证方法*/
function fromValidate() {
	return $("#signupForm").validate({
		/* 设置验证规则 */
		rules: {
			parterName: {
				required: true,
				isSpecialChart: true
			},
			/*parterShortName: {
				required: true,
				isSpecialChart: true
			},
			connectPerson: {
				required: true,
				isSpecialChart: true
			},*/
			connectTel: {
				required: true,
				isMobile: true
			},
			expandPeople: {
				required: true,
				isSpecialChart: true
			},
			/*parterAddress: {
				required: true,
				isSpecialChart: true
			},
			province: {
				isRequired: ["省"]
			},
			city: {
				isRequired: ["请选择"]
			},
			country: {
				isRequired: ["请选择"]
			},*/
			branch: {
				isRequired: ["请选择分子公司"]
			},
			parter: {
				isRequired: function() {
					if ($("#level2").prop("checked")) {
						return ["请选择合作方"];
					} else {
						return ["合作方"];
					}
				}
			}
		},

		/* 设置错误信息 */
		messages: {
			parterName: {
				required: "请输入合作方全称",
				isSpecialChart: "您输入的合作方全称包含特殊字符"
			},
			/*parterShortName: {
				required: "请输入合作方简称",
				isSpecialChart: "您输入的合作方简称包含特殊字符"
			},
			connectPerson: {
				required: "请输入合作方联系人",
				isSpecialChart: "您输入的合作方联系人包含特殊字符"
			},*/
			connectTel: {
				required: "请输入联系人手机号",
				isMobile: "请输入一个合法的手机号"
			},
			expandPeople: {
				required: "请输入拓展人",
				isSpecialChart: "您输入的拓展人包含特殊字符"
			},
		/*	parterAddress: {
				required: "请输入详细地址",
				isSpecialChart: "您输入的详细地址包含特殊字符"
			},
			province: {
				isRequired: "请选择省"
			},
			city: {
				isRequired: "请选择市辖区或所在县"
			},
			country: {
				isRequired: "请选择县或所在区"
			},*/
			branch: {
				isRequired: "请选择分子公司"
			},
			parter: {
				isRequired: "请选择合作方"
			}


		},
		/* 设置错误信息提示DOM */
		errorPlacement: function(error, element) {
			console.log(error);
			error.appendTo(element.parent());
		},
	});

};