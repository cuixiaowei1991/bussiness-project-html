$(document).ready(function() {
	TMSTypeHelper.SetTmsFactoryInfo("#modelFun", "#manuFacturerList", ".modelFun", ".manuFacturerList");

	/*上传*/
	$("#apiclient_key").click(function() {
		controlsHelper.FileUploadControl(fileUploadUrl, "#apiclient_key", "#apiclient_key_pem_view", /\.xl.{1,2}$/, "上传的文件类型不符合要求，请上传xls类型即Excel97～03格式的文件", ".apiclient_key_pem");
	});
	/*添加debug参数*/
	$.validator.setDefaults({
		debug: true
	});
	/*页面加载完毕后先注册参数*/
	fromValidate();
	/*确认提交*/
	$("#sureSubmit").click(function() {
		event.preventDefault();
		var time = new Date().getFullYear() + "-" + (toDub(new Date().getMonth() + 1)) + "-" + (toDub(new Date().getDate())) + " " + (toDub(new Date().getHours())) + ":" + (toDub(new Date().getMinutes()));
		if (fromValidate().form()) {
			InserAllpayTMS(time);
		} else {
			console.log('失败');
		};

	});
	$("#programType li").click(function() {
		$(".programType").attr("data-value", $(this).attr("data-value"));
	})
});

/*新增TMS终端信息*/
function InserAllpayTMS(time) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var myjsonStr = dataHelper.setJson(null, "tmsTerminalname", $(".manuFacturerList").attr("data-value") == undefined ? '' : $(".manuFacturerList").attr("data-value"));
	myjsonStr = dataHelper.setJson(myjsonStr, "tmsEnterterminalname", $(".manuFacturerList").text());
	myjsonStr = dataHelper.setJson(myjsonStr, "tmsModelsname", $(".modelFun").attr("data-value") == undefined ? '' : $(".modelFun").attr("data-value"));
	myjsonStr = dataHelper.setJson(myjsonStr, "tmsFeiltype", $(".programType").attr("data-value") == undefined ? '' : $(".programType").attr("data-value"));

	myjsonStr = dataHelper.setJson(myjsonStr, "tmsVernum", $("#tmsVernum").val());
	myjsonStr = dataHelper.setJson(myjsonStr, "tmsApplicationname", $("#tmsApplicationname").val());
	myjsonStr = dataHelper.setJson(myjsonStr, "tmsFeilname", $("#apiclient_key_pem_view").attr('src')); //测试的时候待改

	myjsonStr = dataHelper.setJson(myjsonStr, "allpayCreatetime", time);
	myjsonStr = dataHelper.setJson(myjsonStr, "tmsState", $("#tmsState").prop("checked") ? "1" : "0");
	myjsonStr = dataHelper.setJson(myjsonStr, "tmsUpdatecontent", $("#tmsUpdatecontent").val());

	jsonParam.jsonStr = myjsonStr;
	console.log(jsonParam);
	businessTmsServer.InserAllpayTMS(jsonParam, callback_InserAllpayTMS)
};
/*新增TMS终端信息回调*/
function callback_InserAllpayTMS(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('新增TMS终端信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert("增加成功", "20%");
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

/*
 * 时间补零
 */
function toDub(m) {
	if (m < 10) {
		return "0" + m;

	} else {
		return m;
	}
};