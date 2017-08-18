(function(wechatHelper) {
	//微信注册菜单项
	wechatHelper.jsApiList = [];
	//微信隐藏菜单项
	wechatHelper.hideMenuList = [];
	//分享参数变量
	wechatHelper.shareAppDataList = {};
	//隐藏菜单参数变量
	wechatHelper.hideMenuDataList = {};
	/*分享参数
	 *参数(debug,主题，说明，分享链接，分享图片链接)
	 */
	wechatHelper.shareAppData = function(debug, title, desc, shareLink, shareImgUrl) {
		return {
			debug: debug,
			title: title,
			desc: desc,
			link: shareLink,
			imgUrl: shareImgUrl,
			success: function() {
				controlsHelper.alert('分享成功');
			},
			cancel: function() {
				// 用户取消分享后执行的回调函数
			}
		};
	};
	/*功能：批量隐藏菜单栏选项
	 * 参数（隐藏list,成功提示语）
	 */
	wechatHelper.hideMenuItemsData = function(menuList, successTips) {
		return {
			menuList: menuList,
			success: function(res) {
				controlsHelper.alert(successTips);
			},
			fail: function(res) {
				controlsHelper.alert(JSON.stringify(res));
			}
		};
	};
	/* 功能：注册微信调用接口列表
	 * 参数（appid,回调函数）
	 */
	wechatHelper.Get_WinXinCfg = function(Appid, callback) { //添加json数据 
		var myjsonStr = {};
		var configUrl = wechatUrl + "/getSignPackage?appid=" + Appid
		if(typeof callback === 'function') {
			jQuery.axjsonp(configUrl, myjsonStr, callback);
		}
	};
	/*
	 * 功能：注册事件
	 * 参数（配置参数，debug）
	 */
	wechatHelper.wxConfig = function(config, debug) {
		config.debug = debug; //调试模式
		config.jsApiList = wechatHelper.jsApiList; //需要使用的菜单
		config.hideMenuList = wechatHelper.hideMenuList; //需要隐藏的菜单

		wx.config(config);
		wx.ready(function() {
			//分享接口调用
			wx.onMenuShareTimeline(wechatHelper.shareAppDataList);
			wx.onMenuShareAppMessage(wechatHelper.shareAppDataList);
			wx.onMenuShareQQ(wechatHelper.shareAppDataList);
			wx.onMenuShareWeibo(wechatHelper.shareAppDataList);
			wx.onMenuShareQZone(wechatHelper.shareAppDataList);
			//隐藏右上角菜单
			if($.inArray("hideOptionMenu", config.jsApiList) >= 0) {
				wx.hideOptionMenu();
			}
			//批量隐藏菜单选项
			if($.inArray("hideMenuItems", config.jsApiList) >= 0) {
				wx.hideOptionMenu(wechatHelper.hideMenuDataList);
			}
			//关闭当前窗口
			wx.closeWindow();
			//隐藏所有非基本菜单项
			if($.inArray("hideAllNonBaseMenuItem", config.jsApiList) >= 0) {
				wx.hideAllNonBaseMenuItem({
					success: function() {
						controlsHelper.alert('已隐藏所有非基本菜单项');
					}
				});
			}

		});
		wx.error(function(res) { //通过error接口处理失败验证
			controlsHelper.alert(res.errMsg);
		});
	};
	/*
	 *功能：获取微信用户信息
	 * 参数（微信服务url,微信商户appid,微信生成code,用户公众号openid,回调函数名称）
	 */
	wechatHelper.GetWechatUserInfo = function(wechatUrl, appid, code, openid, callback) {
		var url = wechatUrl + "/getUserInfo";
		var jsonParam = {
			"jsonStr": ""
		};
		var jsonstr = dataHelper.setJson(null, "app_id", appid);
		jsonstr = dataHelper.setJson(jsonstr, "code", code);
		jsonstr = dataHelper.setJson(jsonstr, "openid", openid);
		jsonParam.jsonStr = jsonstr;
		console.log(jsonstr);

		if(typeof callback === 'function') {
			jQuery.axjsonp(url, jsonParam, callback);
		}
	};
	/*
	 * 功能：微信订单支付
	 * 参数（微信后台服务url,微信appid,订单ID，用户微信公众号openid,订单价格，产品名称,回调函数）
	 */
	wechatHelper.wechatOrdePay = function(wechatUrl, wechatAppid, orderid, wechatOpenid, price, productName, callback) {
		var pay_send_data = {
			"app_id": wechatAppid,
			"total_fee": (parseFloat(price) * 100).toString(),
			"body": productName,
			"out_trade_no": orderid,
			"openid": wechatOpenid
		};
		var apiUrl = wechatUrl + "/weixinForPay?jsonStr=" + JSON.stringify(pay_send_data);
		if(typeof callback === 'function') {
			jQuery.axjsonp(url, jsonParam, callback);
		}
	};

	window.wechatHelper = wechatHelper;
})(window.wechatHelper || {});