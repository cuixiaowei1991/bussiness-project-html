var zfbKbId; //支付宝口碑id
var imgId; //图片支付宝id
var currentImgElement;
$(document).ready(function() {
	zfbKbId = decodeURI(dataHelper.QueryString("zfbKbId"));
	//获取支付宝口碑信息
	GetZfbShopInfo(zfbKbId);

	fromValidate();
	//提交修改按钮操作事件
	$("#SubmitCreate").click(function() {
		if (fromValidate().form()) {
			UpdateZfbShopInfo(zfbKbId);
		}
	});
});
/*
 * 创建日期：2017-1-11
 * 功能：获取支付宝口碑信息
 * 创建人：shiyina
 */
function GetZfbShopInfo(zfbKbId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "shopeId", zfbKbId); //当前页码
	jsonParam.jsonStr = jsonstr;
	console.log(jsonParam.jsonStr);
	zfbInfoServer.GetZfbShopInfo(jsonParam, callback_GetZfbShopInfo)

};

/*
 * 创建日期：2017-1-11
 * 功能：获取支付宝口碑信息回调函数
 * 创建人：shiyina
 */
function callback_GetZfbShopInfo(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('获取支付宝口碑信息失败:' + data.rspDesc);
	} else {
		storeId = data.storeId;
		$("#storeCode").val(data.storeCode);
		$(".FirstMhtIndustry").attr('data-value', data.zfbIndustry1);
		$(".SecondMhtIndustry").attr('data-value', data.zfbIndustry2);
		$(".ThirdMhtIndustry").attr('data-value', data.zfbIndustry3);
		$(".FirstMhtIndustry").html(data.zfbIndustryName1);
		$(".SecondMhtIndustry").html(data.zfbIndustryName2);
		$(".ThirdMhtIndustry").html(data.zfbIndustryName3);
		//品牌LOGO
		if (data.brandLogoImg != undefined) {
			//图片路径和图片名称
			for (var i = 0; i < data.brandLogoImg.length; i++) {
				$("#BrandLogo").find('img').eq(i).attr('src', data.brandLogoImg[i].imagePath);
				var path = new Array();
				path = data.brandLogoImg[i].imagePath.split('uploads/');
				if (path.length > 1) {
					$("#BrandLogo").find('img').eq(i).attr('data-filepath', path[1]);
				} else {
					$("#BrandLogo").find('img').eq(i).attr('data-filepath', data.brandLogoImg[i].imagePath);
				}
			}
		}
		$("#storeMainName").val(data.storeMainName);
		$("#storeFName").val(data.storeFName);
		$(".province").attr('data-value', data.provinceId);
		$(".city").attr('data-value', data.cityId);
		$(".county").attr('data-value', data.countryId);
		$(".province").html(data.provinceName);
		$(".city").html(data.cityName);
		$(".county").html(data.countryName);
		$("#address").val(data.address);
		$("#latitude").val(data.latitude);
		$("#storePhone").val(data.storePhone);
		$("#businessTime").val(data.businessTime);
		$("#avgPrice").val(data.avgPrice);
		if (data.isWifi == 1) {
			$("#isWifi").prop('checked', true);
		} else if (data.isWifi == 0) {
			$("#isWifi").prop('checked', false);
		};
		if (data.isParking == 1) {
			$("#isParking").prop('checked', true);
		} else if (data.isParking == 0) {
			$("#isParking").prop('checked', false);
		};
		if (data.isNoSmoking == 1) {
			$("#isNoSmoking").prop('checked', true);
		} else if (data.isNoSmoking == 0) {
			$("#isNoSmoking").prop('checked', false);
		};
		if (data.isBox == 1) {
			$("#isBox").prop('checked', true);
		} else if (data.isBox == 0) {
			$("#isBox").prop('checked', false);
		};
		if (data.valueAdded == 1) {
			$("#valueAdded").prop('checked', true);
		} else if (data.valueAdded == 0) {
			$("#valueAdded").prop('checked', false);
		};
		//门店首图
		if (data.storeFirstImg != undefined) {
			//图片路径和图片名称
			for (var i = 0; i < data.storeFirstImg.length; i++) {
				$("#StoreImg").find('img').eq(i).attr('src', data.storeFirstImg[i].imagePath);
				var path = new Array();
				path = data.storeFirstImg[i].imagePath.split('uploads/');
				if (path.length > 1) {
					$("#StoreImg").find('img').eq(i).attr('data-filepath', path[1]);
				} else {
					$("#StoreImg").find('img').eq(i).attr('data-filepath', data.storeFirstImg[i].imagePath);
				}
			}
		}
		//门店审核图（门头照片）
		if (data.storeTouImg != undefined) {
			//图片路径和图片名称
			for (var i = 0; i < data.storeTouImg.length; i++) {
				$("#StoreTouImg").find('img').eq(i).attr('src', data.storeTouImg[i].imagePath);
				var path = new Array();
				path = data.storeTouImg[i].imagePath.split('uploads/');
				if (path.length > 1) {
					$("#StoreTouImg").find('img').eq(i).attr('data-filepath', path[1]);
				} else {
					$("#StoreTouImg").find('img').eq(i).attr('data-filepath', data.storeTouImg[i].imagePath);
				}
			}
		}
		//门店审核图（内景照片）
		if (data.storeFirstImg != undefined) {
			//图片路径和图片名称
			for (var i = 0; i < data.storeFirstImg.length; i++) {
				$("#StoreImg").find('img').eq(i).attr('src', data.storeFirstImg[i].imagePath);
				var path = new Array();
				path = data.storeFirstImg[i].imagePath.split('uploads/');
				if (path.length > 1) {
					$("#StoreImg").find('img').eq(i).attr('data-filepath', path[1]);
				} else {
					$("#StoreImg").find('img').eq(i).attr('data-filepath', data.storeFirstImg[i].imagePath);
				}
			}
		}
		//营业执照图
		if (data.licenceImg != undefined) {
			//图片路径和图片名称
			for (var i = 0; i < data.licenceImg.length; i++) {
				$("#LicenceImg").find('img').eq(i).attr('src', data.licenceImg[i].imagePath);
				var path = new Array();
				path = data.licenceImg[i].imagePath.split('uploads/');
				if (path.length > 1) {
					$("#LicenceImg").find('img').eq(i).attr('data-filepath', path[1]);
				} else {
					$("#LicenceImg").find('img').eq(i).attr('data-filepath', data.licenceImg[i].imagePath);
				}
			}
		};
		$("#licenceCode").val(data.licenceCode);
		$("#licenceName").val(data.licenceName);
		//经营许可证图
		if (data.certificateImg != undefined) {
			//图片路径和图片名称
			for (var i = 0; i < data.certificateImg.length; i++) {
				$("#CertificateImg").find('img').eq(i).attr('src', data.certificateImg[i].imagePath);
				var path = new Array();
				path = data.certificateImg[i].imagePath.split('uploads/');
				if (path.length > 1) {
					$("#CertificateImg").find('img').eq(i).attr('data-filepath', path[1]);
				} else {
					$("#CertificateImg").find('img').eq(i).attr('data-filepath', data.certificateImg[i].imagePath);
				}
			}
		};
		$("#certificateExpires").val(data.certificateExpires);
		//经营许可证图
		if (data.authLetterImg != undefined) {
			//图片路径和图片名称
			for (var i = 0; i < data.authLetterImg.length; i++) {
				$("#AuthLetterImg").find('img').eq(i).attr('src', data.authLetterImg[i].imagePath);
				var path = new Array();
				path = data.authLetterImg[i].imagePath.split('uploads/');
				if (path.length > 1) {
					$("#AuthLetterImg").find('img').eq(i).attr('data-filepath', path[1]);
				} else {
					$("#AuthLetterImg").find('img').eq(i).attr('data-filepath', data.authLetterImg[i].imagePath);
				}
			}
		};
		$("#isYuId").val(data.isYuId);
		$("#notifyPhone").val(data.notifyPhone);
	};
};


/*
 * 创建日期：2017-1-11
 * 功能：修改支付宝口碑信息
 * 创建人：shiyina
 */
function UpdateZfbShopInfo(zfbKbId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "shopeId", zfbKbId); //支付宝口碑id
	jsonstr = dataHelper.setJson(jsonstr, "storeId", storeId); //门店id
	jsonstr = dataHelper.setJson(jsonstr, "storeCode", storeCode); //门店编号
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
	zfbInfoServer.UpdateZfbShopInfo(jsonParam, callback_UpdateZfbShopInfo);
};

function callback_UpdateZfbShopInfo(data) {
	console.log(data);
	if (data.rspCode == null || data.rspCode == undefined || data.rspCode != '000') {
		controlsHelper.alert('修改支付宝口碑信息失败:' + data.rspDesc);
	} else {
		controlsHelper.alert("修改支付宝口碑信息成功", "20%");
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
			storeFName: {
				isName: true
			},
			storePhone: {
				isPhone: true
			},
			avgPrice: {
				isFive: true
			},
			latitude: {
				required: true
			},
			licenceCode: {
				required: true,
				isLicenseNum: true
			},
			licenceName: {
				required: true,
				isName: true
			},
			notifyPhone: {
				isMobile: true
			},
			storeFirstImgName: {
				required: true
			},
			storeTouImgName: {
				required: true
			},
			storeNeiImgName: {
				required: true
			},
			storeNeiImg2Name: {
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
			storeFName: {
				isName: "请正确填写分店名称、不能有特殊符号、不能有空格"
			},
			storePhone: {
				isPhone: "请正确填写门店电话"
			},
			latitude: {
				required: "请输入经纬度"
			},
			avgPrice: {
				isFive: "最少1元，最大不超过99999元"
			},
			licenceCode: {
				required: "请输入营业执照注册号",
				isLicenseNum: "请正确填写营业执照注册号(营业执照注册号为15位)"
			},
			licenceName: {
				required: "请输入营业执照名称 ",
				isName: "请正确填写营业执照名称"
			},
			notifyPhone: {
				isMobile: "请正确填写收款成功短信接收手机号"
			},
			storeFirstImgName: {
				required: "请上传门店首图"
			},
			storeTouImgName: {
				required: "请上传门店审核图（门头照片）"
			},
			storeNeiImgName: {
				required: "请上传门店审核图（内景照片）"
			},
			storeNeiImg2Name: {
				required: "请上传门店审核图（内景照片）"
			}
		},
		/* 设置错误信息提示DOM */
		errorPlacement: function(error, element) {
			error.appendTo(element.parent());
		},
	});
};