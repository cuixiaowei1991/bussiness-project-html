(function(dataValueHelper) {

	// 例子调用：
	//dataValueHelper.GetDictionaryDataList("activeStatus","#channelCode",".channelCode",'全部');

	//	var serverUrl = baseDataUrl; //yewuPosUrl; 
	var serverUrl = yewuPosUrl;
	/*
	 * 功能：根据主表code获取子 码表列表
	 * 参数（主表code,ul标签，展示btn标签，默认显示文本,回调函数）
	 */
	dataValueHelper.GetDictionaryDataList = function(dictCode, elements, elementsBtn, defaultText, callback) {
		var config = {
			"elements": elements,
			"elementsBtn": elementsBtn,
			"defaultText": defaultText
		};
		var jsonParam = {
			//			"marked": "getDictionaryDataList",
			"code": "10002",
			"version": "1.0",
			"jsonStr": {}
		};
		jsonParam.jsonStr = dataHelper.setJson(null, "Dictionary_code", dictCode);
		if(typeof callback === 'function') {
			jQuery.axjsonpPostMvc(serverUrl + "/getDictionaryDataList", jsonParam, callback);
		} else {
			jQuery.axjsonpPostMvc(serverUrl + "/getDictionaryDataList", jsonParam, callback_GetDictionaryDataList, config);
		}
		//		if(typeof callback === 'function') {
		//			jQuery.axjsonp(serverUrl, jsonParam, callback);
		//		} else {
		//			jQuery.axjsonp(serverUrl, jsonParam, callback_GetDictionaryDataList, config);
		//		}
	};
	/*
	 * 功能：获取码表数据回调函数
	 * 创建人：liql
	 * 创建时间：2016-12-16
	 */
	function callback_GetDictionaryDataList(data, config) {
		console.log(data);
		$(config.elements).empty();
		if(config.defaultText != '') {
			$(config.elementsBtn).html(config.defaultText);
			$(config.elements).append("<li value=''><a>" + config.defaultText + "</a></li>");
		}
		$.each(data.lists, function(index, entry) {
			$(config.elements).append("<li value=" + entry.data_code + "><a>" + entry.data_name + "</a></li>");
		});

		//li改变事件
		$(config.elements).find('li').click(function() {
			$(config.elementsBtn).attr('data-value', $(this).attr('value'));
			$(config.elementsBtn).html($(this).find('a').html());
		});
	};
	//	/*
	//	 * 功能：根据datacode码取对应码表名称
	//	 * 参数（）
	//	 */
	//	dataValueHelper.GetDataNameByDataCode = function(dictCode, dataCode) {
	//		dataValueHelper.GetDictionaryDataList(dictCode, '', '', '', callback);	
	//		function callback(data) {		
	//			console.log(data);
	//		};
	//		
	//	};
	window.dataValueHelper = dataValueHelper;

})(window.dataValueHelper || {});