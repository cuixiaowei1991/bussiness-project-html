var curragePage = 1; //当前页
var pageSize = 20; //每页显示记录条数
var isCreatePage = false;
var totalPage; //总页数
$(document).ready(function() {
	TMSTypeHelper.SetTmsFactoryInfo("#modelFun", "#manuFacturerList", ".modelFun", ".manuFacturerList");

	GetAllpayTMSList(curragePage);
	/*查询事件*/
	$("#searchBtn").click(function() {
		event.preventDefault();
		isCreatePage = false;
		GetAllpayTMSList(curragePage);
	});
});

/*获取TMS终端信息列表*/
function GetAllpayTMSList(curragePage) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var myjsonStr = dataHelper.setJson(null, "tmsTerminalname", $(".manuFacturerList").attr("data-value") == undefined ? '' : $(".manuFacturerList").attr("data-value"));
	myjsonStr = dataHelper.setJson(myjsonStr, "tmsModelsname", $(".modelFun").attr("data-value") == undefined ? '' : $(".modelFun").attr("data-value"));
	myjsonStr = dataHelper.setJson(myjsonStr, "tmsVernum", $("#tmsVernum").val());
	myjsonStr = dataHelper.setJson(myjsonStr, "tmsApplicationname", $("#tmsApplicationname").val());
	myjsonStr = dataHelper.setJson(myjsonStr, "curragePage", curragePage);
	myjsonStr = dataHelper.setJson(myjsonStr, "pageSize", pageSize);
	jsonParam.jsonStr = myjsonStr;
	console.log(jsonParam);
	businessTmsServer.GetAllpayTMSList(jsonParam, callback_GetAllpayTMSList);
};

/*获取TMS终端信息列表回调*/
function callback_GetAllpayTMSList(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('获取TMS终端信息失败:' + data.rspDesc);
	} else {
		/*0:停用 1：启用*/
		var testa = new Array();
		$.each(data.lists, function(entryIndex, entry) {
			//JSON.stringify用于从一个对象解析出字符串
			var viewdata = JSON.stringify(entry);
			//支付结果
			if (entry.tmsState == '0') {
				viewdata = dataHelper.setJson(viewdata, "tmsStateName", '停用');
			} else if (entry.tmsState == '1') {
				viewdata = dataHelper.setJson(viewdata, "tmsStateName", '启用');
			};
			//jQuery.parseJSON()接受一个JSON字符串，返回解析后的对象。
			entry = jQuery.parseJSON(viewdata);
			testa.push(entry);
		});

		//清空原数据数组
		data.lists.splice(0, data.lists.length);
		data.lists = testa;

		$("#dictList").html("");
		var template = $("#dictListTemplate").html();
		Mustache.parse(template);

		//添加到网页
		var rendered = Mustache.render(template, data);
		$("#dictList").append(rendered);

		$("#dictList tr").find('td').each(function() {
			$(this).find('a').attr('href', $(this).attr('data-tmsfeil'))
		});

		//总条数
		$(".total").html(data.total);
		if (!isCreatePage) {
			isCreatePage = true;
			$('.pagination').jqPagination({
				link_string: 'page={page_number}',
				max_page: Math.ceil(data.total / pageSize),
				paged: function(page) {
					console.log("第" + page + "页");
					CurrPage = page;
					//增加一页调用刷新一次
					GetAllpayTMSList(curragePage);
				}
			});
		}
		AgainRegisterClick();
		/*修改*/
		/*$(".updateBtn").click(function() {
			var tmsId = $(this).attr("data-tmsId");
			location.href = "TmsEdit.html?tmsId=" + tmsId;
		});*/
		/*删除*/
		$(".deleteBtn").click(function() {
			var tmsId = $(this).attr("data-tmsId");
			/*是否确认删除*/
			$("#sureDeleteBtn").unbind('click');
			$("#sureDeleteBtn").click(function() {
				$("#popdelete").hide();
				DeleteAllpayTMS(tmsId);
			});
		});
	};
};

/*删除TMS终端信息*/
function DeleteAllpayTMS(tmsId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "tmsId", tmsId);
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam.jsonStr);
	businessTmsServer.DeleteAllpayTMS(jsonParam, callback_DeleteAllpayTMS);
};

/*删除TMS终端信息回调*/
function callback_DeleteAllpayTMS(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('删除TMS终端信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert("删除成功", "20%")
		setTimeout(function() {
			isCreatePage = false;
			GetAllpayTMSList(curragePage);
		}, 500);
	};
};