$(document).ready(function() {

	function fromValidate() {
		return $("#signupForm").validate({
			/**/
			/* 设置验证规则 */
			rules: {
				organizationName: {
					required: true,
					stringCheck: true
				},
				organizationAddress: {
					required: true,
					stringCheck: true
				},
				organizationUserName: {
					required: true,
					stringCheck: true
				},
				organizationUserPhone: {
					required: true,
					isMobile: true
				},
				organizationCode: {
					required: true,
					number: true
				}
			},
			/**/
			/* 设置错误信息 */
			messages: {
				organizationName: {
					required: "请填写组织机构名称",
					stringCheck: "组织机构名称只能包括中文、英文字母、数字和下划线"
				},
				organizationAddress: {
					required: "请输入地址",
					stringCheck: "组织机构地址只能包括中文、英文字母、数字和下划线"
				},
				organizationUserName: {
					required: "请输入负责人姓名",
					stringCheck: "姓名只能包括中文、英文字母、数字和下划线"
				},
				organizationUserPhone: {
					required: "请输入负责人手机号",
					isMobile: "请输入一个有效的负责人手机号"
				},
				organizationCode: {
					required: "请输入组织机构编码",
					number: "组织机构编码只能为十位数字"
				}
			},
			/* 设置错误信息提示DOM */
			errorPlacement: function(error, element) {
				console.log(error);
				error.appendTo(element.parent());
			},
		}).form();

	};

	//新增
	$("#sureCreatBtn").click(function() {
		
		event.preventDefault();
		if(fromValidate()) {
			console.log('xxx');
			insertOrganizationInfo();
		} else {
			console.log('失败');
		};	

	});
});

function insertOrganizationInfo() {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};

	var myjsonStr = dataHelper.setJson(null, "organizationName", $("#organizationName").val());

	myjsonStr = dataHelper.setJson(myjsonStr, "organizationType", $("#organizationType input[type=radio]:checked").val());
	myjsonStr = dataHelper.setJson(myjsonStr, "organizationAddress", $("#organizationAddress").val());
	myjsonStr = dataHelper.setJson(myjsonStr, "organizationUserName", $("#organizationUserName").val());
	myjsonStr = dataHelper.setJson(myjsonStr, "organizationUserPhone", $("#organizationUserPhone").val());
	myjsonStr = dataHelper.setJson(myjsonStr, "organizationCode", $("#organizationCode").val());

	myjsonStr = dataHelper.setJson(myjsonStr, "organizationState", $("#organizationState:checked").prop("checked") ? "1" : "2");

	jsonParam.jsonStr = myjsonStr;

	console.log(jsonParam);
	systemUserService.InsertOrganizationInfo(jsonParam, callback_insertOrganizationInfo);
};

function callback_insertOrganizationInfo(data) {

	console.log("提交的回调数据");
	console.log(data);
	if(data == undefined || data == null) {

		alert('无数据返回');

	} else if(data.rspCode != "000") {

		alert(data.rspDesc == undefined ? '无数据返回' : data.rspDesc);

	} else {
		//		alert("新增成功");
		controlsHelper.alert("新增成功", "20%")
		setTimeout(function() {

			location.href = "OrganizationList.html"
		}, 500);

	};
};