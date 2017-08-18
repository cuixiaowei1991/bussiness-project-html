//服务地址
var wechatUrl = "http://118.144.88.26:80/changeFunction/interfaceForWeiXin"; //正式

var yewuShopUrl = "http://192.168.15.154:8280/shopManage"; //商户url
var yewuAgentUrl = "http://192.168.15.154:8280/agentManage"; //代理商url
var yewuPosUrl = "http://192.168.15.154:8280/businessManage"; //业务posurl
var yewuTmsUrl = "http://192.168.15.154:8280/tmsManage"; //业务TMSurl

var wftUrl="http://192.168.16.57:8980/wft";//威富通url
var zfbUrl="http://192.168.16.57:8980/zfb";//支付宝url



var quanxianAgent = "http://192.168.15.154:8280/quanxianAgent";
var quanxianUrl = "http://192.168.15.154:8280/quanxian"; //测试
var quanxianShopUrl = "http://192.168.15.154:8280/quanxianShop"; //测试
//var quanxianAgent = "http://192.168.15.201:8080/unification-service-provider/quanxianAgent";
var customHost = "http://127.0.0.1:8020/ALLPAY_BusinessProject_HTML/html/";
//var customHost = "http://192.168.15.154:8180/html/";
var fileUploadUrl = "http://118.144.88.25:8181/fileUploadify";//上传图片


var baseDataUrl = "http://124.192.206.82:18180/BaseDataService!callin.action";
$(function() {
	/**
	 * ajax封装
	 * Jsonp格式，用于跨域调用
	 * url 发送请求的地址
	 * data 发送到服务器的数据，数组存储，如：{"date": new Date().getTime(), "state": 1}
	 * successfn 成功回调函数
	 */
	jQuery.axjsonp = function(url, data, successfn, config) {
		data = (data == null || data == "" || typeof(data) == "undefined") ? {
			"date": new Date().getTime()
		} : data;
		$.ajax({

			//提交数据的类型 POST GET
			type: "POST",
			//async:false,  
			//提交的网址
			url: url,
			//提交的数据
			data: data,
			//返回数据的格式
			dataType: "jsonp", //"xml", "html", "script", "json", "jsonp", "text".
			jsonp: "callbackparam", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
			jsonpCallback: "success_jsonpCallback", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
			//在请求之前调用的函数
			beforeSend: function() {
				$("#btn_loading").css('display', '');
			},
			//成功返回之后调用的函数             
			success: function(data) {
				if(config != null && config != undefined && config != '') {
					successfn(data, config);
				} else {
					successfn(data);
				}
			},
			//调用执行后调用的函数
			complete: function(XMLHttpRequest, textStatus) {
				$("#btn_loading").css('display', 'none');
			},
			//调用出错执行的函数
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest.status);
				console.log(textStatus);
				//				console.log(textStatus);
				if(XMLHttpRequest.status != '200') {
					alert("AJAX请求错误：请求状态码：" + XMLHttpRequest.status + " readyState:" + XMLHttpRequest.readyState + "错误：" + textStatus);
				}
			}
		});
	};

	jQuery.axjsonpPost = function(url, data, successfn) {
		data = (data == null || data == "" || typeof(data) == "undefined") ? {
			"date": new Date().getTime()
		} : data;
		$.ajax({
			crossDomain: true,
			//提交数据的类型 POST GET
			type: "POST",
			//async:false,  
			//提交的网址
			url: url,
			//提交的数据
			data: data,
			//返回数据的格式
			dataType: "json", //"xml", "html", "script", "json", "jsonp", "text".
			//jsonp: "callbackparam", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
			//jsonpCallback: "success_jsonpCallback", //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
			//在请求之前调用的函数
			beforeSend: function() {
				$("#btn_loading").css('display', '');
			},
			//成功返回之后调用的函数             
			success: function(data) {

				successfn(data);
			},
			//调用执行后调用的函数
			complete: function(XMLHttpRequest, textStatus) {
				$("#btn_loading").css('display', 'none');
			},
			//调用出错执行的函数
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest.status);
				console.log(textStatus);
				//				console.log(textStatus);
				if(XMLHttpRequest.status != '200') {
					alert("AJAX请求错误：请求状态码：" + XMLHttpRequest.status + " readyState:" + XMLHttpRequest.readyState + "错误：" + textStatus);
				}
			}
		});
	};

	jQuery.axjsonpPostMvc = function(url, data, successfn, config, key) {
		data = (data == null || data == "" || typeof(data) == "undefined") ? {
			"date": new Date().getTime()
		} : data;
		$.ajax({
			type: "POST",
			url: url,
			data: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json',
				'TestKey': key
			},
			async: false,
			//在请求之前调用的函数
			beforeSend: function() {
				$("#btn_loading").css('display', '');
			},
			//成功返回之后调用的函数             
			success: function(data) {
				if(config != null && config != undefined && config != '') {
					successfn(data, config);
				} else {
					successfn(data);
				}
			},
			//调用执行后调用的函数
			complete: function(XMLHttpRequest, textStatus) {
				$("#btn_loading").css('display', 'none');
			},
			//调用出错执行的函数
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				console.log(XMLHttpRequest.status);
				console.log(textStatus);
				//				console.log(textStatus);
				if(XMLHttpRequest.status != '200') {
					alert("AJAX请求错误：请求状态码：" + XMLHttpRequest.status + " readyState:" + XMLHttpRequest.readyState + "错误：" + textStatus);
				}
			}
		});
	};

});