var storeId; //门店id
var storeCode; //门店编号
var currentImgElement;
$(document).ready(function() {
	storeId = decodeURI(dataHelper.QueryString("storeId"));
	storeCode = decodeURI(dataHelper.QueryString("storeCode"));
	$("#storeCode").val(storeCode);

	fromValidate();

	$("#SubmitCreate").click(function() {
		if (fromValidate().form()) {
			InsertZfbShopInfo(storeId);
		}

	});


});

/*
 * 创建日期：2017-1-11
 * 功能：新增支付宝口碑信息
 * 创建人：shiyina
 */
function InsertZfbShopInfo(storeId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "storeId", storeId); //门店id
	jsonstr = dataHelper.setJson(jsonstr, "storeCode", $("#storeCode").val()); //门店编号
	jsonstr = dataHelper.setJson(jsonstr, "brandName", $("#mhtName").val()); //品牌名称
	jsonstr = dataHelper.setJson(jsonstr, "zfbIndustry1", $(".FirstMhtIndustry").attr('data-value') == undefined ? '' : $(".FirstMhtIndustry").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, "zfbIndustry2", $(".SecondMhtIndustry").attr('data-value') == undefined ? '' : $(".SecondMhtIndustry").attr('data-value'));
	jsonstr = dataHelper.setJson(jsonstr, "zfbIndustry3", $(".ThirdMhtIndustry").attr('data-value') == undefined ? '' : $(".ThirdMhtIndustry").attr('data-value'));

	jsonstr = dataHelper.setJson(jsonstr, "zfbIndustryName1", $(".FirstMhtIndustry").html());
	jsonstr = dataHelper.setJson(jsonstr, "zfbIndustryName2", $(".SecondMhtIndustry").html());
	jsonstr = dataHelper.setJson(jsonstr, "zfbIndustryName3", $(".ThirdMhtIndustry").html());
	//获取品牌LOGO
	var brandLogoImg = new Array();
	$("#BrandLogo img").each(function() {
		if ($(this).attr("data-filepath") != "") {
			var imgJsonStr = dataHelper.setJson(null, "imagePath", $(this).attr('src'));
			imgJsonStr = dataHelper.setJson(imgJsonStr, "imageId", $(this).attr('imageId'));
			brandLogoImg.push(jQuery.parseJSON(imgJsonStr));
		}
	});
	jsonstr = dataHelper.setJson(jsonstr, "brandLogoImg", brandLogoImg); //品牌LOGO
	console.log(brandLogoImg);
	jsonstr = dataHelper.setJson(jsonstr, "storeMainName", $("#storeMainName").val()); //主门店名
	jsonstr = dataHelper.setJson(jsonstr, "storeFName", $("#storeFName").val()); //分门店名

	jsonstr = dataHelper.setJson(jsonstr, "provinceId", $(".province").attr('data-value') == undefined ? '' : $(".province").attr('data-value')); //省id
	jsonstr = dataHelper.setJson(jsonstr, "cityId", $(".city").attr('data-value') == undefined ? '' : $(".city").attr('data-value')); //市id
	jsonstr = dataHelper.setJson(jsonstr, "countryId", $(".county").attr('data-value') == undefined ? '' : $(".county").attr('data-value')); //县id

	jsonstr = dataHelper.setJson(jsonstr, "provinceName", $(".province").html());
	jsonstr = dataHelper.setJson(jsonstr, "cityName", $(".city").html());
	jsonstr = dataHelper.setJson(jsonstr, "countryName", $(".county").html());


	jsonstr = dataHelper.setJson(jsonstr, "address", $("#address").val()); //地址
	jsonstr = dataHelper.setJson(jsonstr, "latitude", $("#latitude").val()); //经纬度
	jsonstr = dataHelper.setJson(jsonstr, "storePhone", $("#storePhone").val()); //门店电话
	jsonstr = dataHelper.setJson(jsonstr, "businessTime", $("#businessTime").val()); //营业时间
	jsonstr = dataHelper.setJson(jsonstr, "avgPrice", $("#avgPrice").val()); //人均消费

	jsonstr = dataHelper.setJson(jsonstr, "isWifi", $("#isWifi").is(":checked") ? 1 : 0); //是否存在WiFi
	jsonstr = dataHelper.setJson(jsonstr, "isParking", $("#isParking").is(":checked") ? 1 : 0); //是否停车场
	jsonstr = dataHelper.setJson(jsonstr, "isNoSmoking", $("#isNoSmoking").is(":checked") ? 1 : 0); //是否有无吸烟区
	jsonstr = dataHelper.setJson(jsonstr, "isBox", $("#isBox").is(":checked") ? 1 : 0); //是否有包间
	jsonstr = dataHelper.setJson(jsonstr, "valueAdded", $("#valueAdded").is(":checked") ? 1 : 0); //其他服务信息

	//获取门店首图
	var storeFirstImg = new Array();
	$("#StoreImg img").each(function() {
		if ($(this).attr("data-filepath") != "") {
			var imgJsonStr = dataHelper.setJson(null, "imagePath", $(this).attr('src'));
			imgJsonStr = dataHelper.setJson(imgJsonStr, "imageId", $(this).attr('imageId'));
			storeFirstImg.push(jQuery.parseJSON(imgJsonStr));
		}
	});
	jsonstr = dataHelper.setJson(jsonstr, "storeFirstImg", storeFirstImg); //门店首图

	//门店审核图（门头照片）
	var storeTouImg = new Array();
	$("#StoreTouImg img").each(function() {
		if ($(this).attr("data-filepath") != "") {
			var imgJsonStr = dataHelper.setJson(null, "imagePath", $(this).attr('src'));
			imgJsonStr = dataHelper.setJson(imgJsonStr, "imageId", $(this).attr('imageId'));
			storeTouImg.push(jQuery.parseJSON(imgJsonStr));
		}
	});
	jsonstr = dataHelper.setJson(jsonstr, "storeTouImg", storeTouImg); //门店审核图（门头照片）

	//门店审核图（内景照片）
	var storeNeiImg = new Array();
	$("#StoreNeiImg img").each(function() {
		if ($(this).attr("data-filepath") != "") {
			var imgJsonStr = dataHelper.setJson(null, "imagePath", $(this).attr('src'));
			imgJsonStr = dataHelper.setJson(imgJsonStr, "imageId", $(this).attr('imageId'));
			storeNeiImg.push(jQuery.parseJSON(imgJsonStr));
		}
	});
	jsonstr = dataHelper.setJson(jsonstr, "storeNeiImg", storeNeiImg); //门店审核图（内景照片）

	//营业执照图
	var licenceImg = new Array();
	$("#LicenceImg img").each(function() {
		if ($(this).attr("data-filepath") != "") {
			var imgJsonStr = dataHelper.setJson(null, "imagePath", $(this).attr('src'));
			imgJsonStr = dataHelper.setJson(imgJsonStr, "imageId", $(this).attr('imageId'));
			licenceImg.push(jQuery.parseJSON(imgJsonStr));
		}
	});
	jsonstr = dataHelper.setJson(jsonstr, "licenceImg", licenceImg); //营业执照图
	jsonstr = dataHelper.setJson(jsonstr, "licenceCode", $("#licenceCode").val()); //营业执照注册号
	jsonstr = dataHelper.setJson(jsonstr, "licenceName", $("#licenceName").val()); //营业执照名称

	//经营许可证图
	var certificateImg = new Array();
	$("#CertificateImg img").each(function() {
		if ($(this).attr("data-filepath") != "") {
			var imgJsonStr = dataHelper.setJson(null, "imagePath", $(this).attr('src'));
			imgJsonStr = dataHelper.setJson(imgJsonStr, "imageId", $(this).attr('imageId'));
			certificateImg.push(jQuery.parseJSON(imgJsonStr));
		}
	});
	jsonstr = dataHelper.setJson(jsonstr, "certificateImg", certificateImg); //经营许可证图
	jsonstr = dataHelper.setJson(jsonstr, "certificateExpires", $("#certificateExpires").val());
	//门店授权函图
	var authLetterImg = new Array();
	$("#AuthLetterImg img").each(function() {
		if ($(this).attr("data-filepath") != "") {
			var imgJsonStr = dataHelper.setJson(null, "imagePath", $(this).attr('src'));
			imgJsonStr = dataHelper.setJson(imgJsonStr, "imageId", $(this).attr('imageId'));
			authLetterImg.push(jQuery.parseJSON(imgJsonStr));
		}
	});

	jsonstr = dataHelper.setJson(jsonstr, "authLetterImg", authLetterImg); //门店授权函图
	jsonstr = dataHelper.setJson(jsonstr, "isYuId", $("#isYuId").val()); //开发返佣id
	jsonstr = dataHelper.setJson(jsonstr, "notifyPhone", $("#notifyPhone").val()); //收款成功短信接收手机号

	jsonParam.jsonStr = jsonstr;
	console.log(jsonstr);
	zfbInfoServer.InsertZfbShopInfo(jsonParam, callback_InsertZfbShopInfo);
};

function callback_InsertZfbShopInfo(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('新增支付宝口碑信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert("新增支付宝口碑信息成功", "20%");
		AgainRegisterClick("AliManage-KouBeiStoreContact", "支付宝口碑-门店关联配置");
	}
};

/*
 * 创建日期：2017-1-11
 * 功能：上传支付宝图片信息
 * 创建人：shiyina
 */
function UploadZfbImgInfo(imagePath,elementImg) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	currentImgElement=elementImg;
	var myjsonStr = dataHelper.setJson(null, "imagePath", imagePath);
	myjsonStr = dataHelper.setJson(myjsonStr, "shopId", shopId);
	myjsonStr = dataHelper.setJson(myjsonStr, "storeId", storeId);
	myjsonStr = dataHelper.setJson(myjsonStr, "shopToken", shopToken);
	jsonParam.jsonStr = myjsonStr;
	console.log(jsonParam);
	zfbInfoServer.UploadZfbImgInfo(jsonParam, callback_UploadZfbImgInfo);
};
/*
 * 创建日期：2017-1-11
 * 功能：上传支付宝图片信息回调函数
 * 创建人：shiyina
 */
function callback_UploadZfbImgInfo(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('上传支付宝图片信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert("上传支付宝图片信息成功", "20%");
		currentImgElement.attr('imageId',data.imgId);
	};
};

/*提交创建验证*/
function fromValidate() {
	return $("#SignupForm").validate({
		/* 设置验证规则 */
		rules: {
			mhtName: {
				required: true,
				isName: true
			},
			FirstMhtIndustry: {
				isRequired: ["全部"]
			},
			SecondMhtIndustry: {
				isRequired: ["全部"]
			},
			ThirdMhtIndustry: {
				isRequired: ["全部"]
			},
			storeMainName: {
				required: true,
				isName: true
			},
			storeFName:{
				isName: true
			},
			storePhone:{
				isPhone: true
			},
			avgPrice:{
				isFive: true
			},
			latitude: {
				required: true
			},
			licenceCode: {
				required: true,
				isLicenseNum:true
			},
			licenceName: {
				required: true,
				isName:true
			},
			notifyPhone:{
				isMobile:true
			},
			storeFirstImgName:{
				required: true
			},
			storeTouImgName:{
				required: true
			},
			storeNeiImgName:{
				required: true
			},
			storeNeiImg2Name:{
				required: true
			}
		},
		/**/
		/* 设置错误信息 */
		messages: {
			mhtName: {
				required: "请选择品牌名称",
				isName: "请正确填写门品牌名称、不能有特殊符号、不能有空格"
			},
			FirstMhtIndustry: {
				isRequired: "请选择类目"
			},
			SecondMhtIndustry: {
				isRequired: "请选择类目"
			},
			ThirdMhtIndustry: {
				isRequired: "请选择类目"
			},
			storeMainName: {
				required: "请输入主门店名",
				isName: "请正确填写主门店名、不能有特殊符号、不能有空格"
			},
			storeFName:{
				isName: "请正确填写分店名称、不能有特殊符号、不能有空格"
			},
			storePhone:{
				isPhone: "请正确填写门店电话"
			},
			latitude: {
				required: "请输入经纬度"
			},
			avgPrice:{
				isFive: "最少1元，最大不超过99999元"
			},
			licenceCode: {
				required: "请输入营业执照注册号",
				isLicenseNum:"请正确填写营业执照注册号(营业执照注册号为15位)"
			},
			licenceName: {
				required: "请输入营业执照名称 ",
				isName: "请正确填写营业执照名称"
			},
			notifyPhone:{
				isMobile:"请正确填写收款成功短信接收手机号"
			},
			storeFirstImgName:{
				required: "请上传门店首图"
			},
			storeTouImgName:{
				required: "请上传门店审核图（门头照片）"
			},
			storeNeiImgName:{
				required: "请上传门店审核图（内景照片）"
			},
			storeNeiImg2Name:{
				required: "请上传门店审核图（内景照片）"
			}
		},
		/* 设置错误信息提示DOM */
		errorPlacement: function(error, element) {
			error.appendTo(element.parent());
		},
	});
};