var zfbNum; //支付宝口碑流水号
var shopId; //商户id
var shopToken; //商户idToken（支付宝）
var CurrPage = 1;
var PageSize = 10;
var isCreatePage = false;
var totalPage; //总页数

$(document).ready(function() {
	//获取组织机构信息列表-分子公司
	getOrganizationInfoList();

	//查询事件
	$("#query").click(function() {
		//获取支付宝口碑信息List
		isCreatePage = false;
		GetZfbShopInfoList(CurrPage);
	});
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

/*分子公司回调*/
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
		//console.log(BranchOfficeList);
		controlsHelper.downBoxUlLi('请选择分子公司', BranchOfficeList, "#brach", ".brach");
		setTimeout(function() {
			dataValueHelper.GetDictionaryDataList("koubeiCheckState", '#storeState', '.storeState', '全部'); //码表
			setTimeout(function() {
				//获取支付宝口碑信息List
				isCreatePage = false;
				GetZfbShopInfoList(CurrPage);
			}, 100);
		}, 100);
	}
};
/*
 * 创建日期：2017-1-11
 * 功能：获取支付宝口碑信息List
 * 创建人：shiyina
 */
function GetZfbShopInfoList(CurrPage) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "curragePage", CurrPage); //当前页码
	jsonstr = dataHelper.setJson(jsonstr, "pageSize", PageSize); //每页显示记录数
	jsonstr = dataHelper.setJson(jsonstr, "shopName", $("#shopName").val()); //商户名称
	jsonstr = dataHelper.setJson(jsonstr, "brach", $(".brach").attr("data-value")); //分公司
	jsonstr = dataHelper.setJson(jsonstr, "storeState", $(".storeState").attr("data-value"));
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam.jsonStr);
	zfbInfoServer.GetZfbShopInfoList(jsonParam, callback_GetZfbShopInfoList)

};

/*获取支付宝口碑信息列表回调*/
function callback_GetZfbShopInfoList(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('获取支付宝口碑信息失败:' + data.rspDesc);
	} else {
		$("#KouBeiStoreList").html("");
		var template = $("#KouBeiStoreListTemplate").html();
		Mustache.parse(template);
		var rendered = Mustache.render(template, data);
		$("#dictList").append(rendered);

		$('#KouBeiStoreList tr').find('td').each(function() {
			if ($(this).attr("data-storeState") == '0') {
				$(this).text('未申请');
			} else if ($(this).attr("data-storeState") == '1') {
				$(this).text('审核中');
			} else if ($(this).attr("data-storeState") == '2') {
				$(this).text('已通过');
			} else if ($(this).attr("data-storeState") == '3') {
				$(this).text('被驳回');
			} else if ($(this).attr("data-storeState") == '4') {
				$(this).text('待审核');
			};
		});

		$('#KouBeiStoreList tr').find('span').each(function() {
			if ($(this).attr("data-zfbKbId")) {
				$(this).show();
			} else {
				$(this).hide();
			}
		});
		$(".BtnRefresh").click(function() {
			zfbNum = $(this).attr('data-zfbNum');
			shopId = $(this).attr('data-shopId');
			shopToken = $(this).attr('data-wechantToken');
			RefreshZfbSate(zfbNum);
		});


		if (!isCreatePage) {
			isCreatePage = true;
			$('.pagination').jqPagination({
				link_string: 'page={page_number}',
				max_page: Math.ceil(data.total / PageSize),
				paged: function(page) {
					console.log("第" + page + "页");
					CurrPage = page;
					//增加一页调用刷新一次
					GetZfbShopInfoList(CurrPage);
				}
			});
		}

		AgainRegisterClick();
	};
};


/*
 * 创建日期：2017-1-12
 * 功能：刷新支付宝状态
 * 创建人：shiyina
 */
function RefreshZfbSate(zfbNum) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var myjsonStr = dataHelper.setJson(null, "zfbNum", zfbNum);
	myjsonStr = dataHelper.setJson(myjsonStr, "shopId", shopId);
	myjsonStr = dataHelper.setJson(myjsonStr, "Token", Token);
	jsonParam.jsonStr = myjsonStr;
	console.log(jsonParam);
	zfbInfoServer.RefreshZfbSate(jsonParam, callback_RefreshZfbSate);
};
/*
 * 创建日期：2017-1-12
 * 功能：刷新支付宝状态回调函数
 * 创建人：shiyina
 */
function callback_RefreshZfbSate(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('刷新支付宝状态信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert("刷新支付宝状态信息成功", "20%");
		isCreatePage = false;
		GetZfbShopInfoList(CurrPage);
	};
};