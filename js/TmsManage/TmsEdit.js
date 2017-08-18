var tmsId = "";
var imageUrl = "";
$(document).ready(function() {

	/*添加debug参数*/
	$.validator.setDefaults({
		debug: true
	});
	/*页面加载完毕后先注册参数*/
	fromValidate();

	tmsId = dataHelper.QueryString("tmsId");

	GetAllpayTMS(tmsId);

	/*确认提交*/
	$("#tmsIdSubmit").click(function() {
		event.preventDefault();
		var tmsId = $(this).attr("data-tmsId");
		if (fromValidate().form()) {
			if ($(".apiclient_key_pem").html() != "") {
				UpdateAllpayTMS(tmsId);
			} else {
				$(".errorInfo").show();
			};
		} else {
			console.log('提交失败');
		};

	});

	/*上传*/
	/*$("#picUp").click(function() {

		picUp();
	});*/
	/*上传*/
	$("#apiclient_key").click(function() {
		controlsHelper.FileUploadControl(fileUploadUrl, "#apiclient_key", "#apiclient_key_pem_view", /\.xl.{1,2}$/, "上传的文件类型不符合要求，请上传xls类型即Excel97～03格式的文件", ".apiclient_key_pem");
	});
	$("#tmsFeiltype li").click(function() {
		$(".tmsFeiltype").attr("data-value", $(this).attr("data-value"));
	})

});
/*获取TMS终端信息*/
function GetAllpayTMS(tmsId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var myjsonStr = dataHelper.setJson(null, "tmsId", tmsId);
	jsonParam.jsonStr = myjsonStr;
	console.log(jsonParam);
	businessTmsServer.GetAllpayTMS(jsonParam, callback_GetAllpayTMS);
};
/*获取TMS终端信息回调*/
function callback_GetAllpayTMS(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('获取TMS终端信息失败:' + data.rspDesc);
	} else {
		if (data.tmsId != null && data.tmsId != undefined && data.tmsId != "") {
			$("#tmsIdSubmit").attr("data-tmsId", data.tmsId);
		};
		if (data.tmsTerminalname != null && data.tmsTerminalname != undefined && data.tmsTerminalname != "") {
			$(".manuFacturerList").attr("data-value", data.tmsTerminalname);
		};

		if (data.tmsEnterterminalname != null && data.tmsEnterterminalname != undefined && data.tmsEnterterminalname != "") {
			$(".manuFacturerList").html(data.tmsEnterterminalname);

		};

		if (data.tmsModelsname != null && data.tmsModelsname != undefined && data.tmsModelsname != "") {
			$(".modelFun").text(data.tmsModelsname);
		};

		if (data.tmsApplicationname != null && data.tmsApplicationname != undefined && data.tmsApplicationname != "") {
			$("#tmsApplicationname").val(data.tmsApplicationname);
		};

		if (data.tmsVernum != null && data.tmsVernum != undefined && data.tmsVernum != "") {
			$("#tmsVernum").val(data.tmsVernum);
		};
		//TODO文件名称待改
		if (data.tmsFeilname != null && data.tmsFeilname != undefined) {
			$("#apiclient_key_pem_view").attr('src', data.tmsFeilname);
			$(".apiclient_key_pem").html(data.tmsFeilname.split('uploads')[1]);
			$(".progress-bar-striped").css('width', '100%');
		};

		/*0:停用 1：启用*/
		if (data.tmsState != null && data.tmsState != undefined) {
			if (data.tmsState == "1") {
				$("#tmsState").attr("checked", "checked")
			}
		};
		$(".tmsFeiltype").attr('data-value', data.tmsFeiltype);
		if (data.tmsFeiltype == '0') {
			$(".tmsFeiltype").html('主控');
		} else if (data.tmsFeiltype == '1') {
			$(".tmsFeiltype").html('应用');
		} else if (data.tmsFeiltype == '2') {
			$(".tmsFeiltype").html('参数');
		}
		if (data.tmsUpdatecontent != null && data.tmsUpdatecontent != undefined && data.tmsUpdatecontent != "") {
			$("#tmsUpdatecontent").text(data.tmsUpdatecontent);
		};
	};
};
/*修改TMS终端信息*/
function UpdateAllpayTMS(tmsId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};

	var myjsonStr = dataHelper.setJson(null, "tmsTerminalname", $(".manuFacturerList").attr("data-value") == undefined ? '' : $(".manuFacturerList").attr("data-value"));
	myjsonStr = dataHelper.setJson(myjsonStr, "tmsId", tmsId);

	myjsonStr = dataHelper.setJson(myjsonStr, "tmsEnterterminalname", $(".manuFacturerList").text());
	myjsonStr = dataHelper.setJson(myjsonStr, "tmsModelsname", $(".modelFun").text());
	myjsonStr = dataHelper.setJson(myjsonStr, "tmsFeiltype", $(".tmsFeiltype").attr("data-value") == undefined ? '' : $(".tmsFeiltype").attr("data-value"));

	myjsonStr = dataHelper.setJson(myjsonStr, "tmsVernum", $("#tmsVernum").val());
	myjsonStr = dataHelper.setJson(myjsonStr, "tmsApplicationname", $("#tmsApplicationname").val());
	myjsonStr = dataHelper.setJson(myjsonStr, "tmsFeilname", $("#apiclient_key_pem_view").attr('src')); //测试的时候待改

	myjsonStr = dataHelper.setJson(myjsonStr, "tmsState", $("#tmsState").prop("checked") ? "1" : "0");
	myjsonStr = dataHelper.setJson(myjsonStr, "tmsUpdatecontent", $("#tmsUpdatecontent").val());

	jsonParam.jsonStr = myjsonStr;
	console.log(jsonParam);
	businessTmsServer.UpdateAllpayTMS(jsonParam, callback_UpdateAllpayTMS)
};
/*修改TMS终端信息回调*/
function callback_UpdateAllpayTMS(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('修改TMS终端信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert("修改成功", "20%")
		AgainRegisterClick("TmsManage-TmsList","TMS信息列表");
	};
};
/*验证方法*/
function fromValidate() {
	return $("#signupForm").validate({

		/* 设置验证规则 */
		rules: {
			manuFacturerList: {
				isRequired: ["全部厂商"]
			},
			tmsModelsname: {
				isRequired: ["全部机型"]
			},
			programType: {
				isRequired: ["请选择程序类型"]
			},
			tmsVernum: {
				required: true,
				isSpecialChart: true
			},
			tmsApplicationname: {
				required: true,
				isSpecialChart: true
			},
			apiclient_key_pem: {
				required: true,
			},
			tmsUpdatecontent: {
				required: true,
				isSpecialChart: true
			}
		},

		/* 设置错误信息 */
		messages: {
			manuFacturerList: {
				isRequired: "请选择厂商"
			},
			tmsModelsname: {
				isRequired: "请选择机型"
			},
			programType: {
				isRequired: "请选择程序类型"
			},
			tmsVernum: {
				required: "请填写版本号",
				isSpecialChart: "您输入的版本号包含特殊字符"
			},
			tmsApplicationname: {
				required: "请填写应用名称",
				isSpecialChart: "您输入的应用名称包含特殊字符"
			},
			apiclient_key_pem: {
				required: "请上传文件"
			},
			tmsUpdatecontent: {
				required: "请填写更新内容",
				isSpecialChart: "您输入的更新内容包含特殊字符"
			}
		},
		/* 设置错误信息提示DOM */
		errorPlacement: function(error, element) {
			console.log(error);
			error.appendTo(element.parent());
		},
	});
};
