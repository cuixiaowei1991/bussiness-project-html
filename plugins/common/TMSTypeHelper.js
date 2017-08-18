(function(TMSTypeHelper){
	var dataList=[{"name":"新大陆","code":"NEWLAND"},{"name":"海信","code":"HISENSE"},
	{"name":"百富","code":"PAX"},{"name":"联迪","code":"LANDI"},{"name":"华智融","code":"NEWPOS"},
	{"name":"新国都","code":"NEWXINGUODU"}];
	var dataChildList=[{"parentId":"NEWLAND","name":"SP60"},  
{"parentId":"NEWLAND","name":"SP50"},  
{"parentId":"NEWLAND","name":"SP80"},  
{"parentId":"NEWLAND","name":"ME31S"},   
{"parentId":"HISENSE","name":"M21"},  
{"parentId":"HISENSE","name":"HZ-M21"}, 
{"parentId":"PAX","name":"S90"},  
{"parentId":"PAX","name":"S900"},  
{"parentId":"PAX","name":"D210"},  
{"parentId":"PAX","name":"S58"},  
{"parentId":"PAX","name":"S60"},  
{"parentId":"PAX","name":"S78"},  
{"parentId":"PAX","name":"S80"},  
{"parentId":"PAX","name":"S500"},  
{"parentId":"PAX","name":"S800"},  
{"parentId":"LANDI","name":"E350"},  
{"parentId":"LANDI","name":"E550"},  
{"parentId":"LANDI","name":"E570"},  
{"parentId":"LANDI","name":"E850"},  
{"parentId":"LANDI","name":"E330"},  
{"parentId":"LANDI","name":"E510"},  
{"parentId":"LANDI","name":"E520"},  
{"parentId":"LANDI","name":"E530"},  
{"parentId":"LANDI","name":"E810"},  
{"parentId":"LANDI","name":"E820"},  
{"parentId":"LANDI","name":"E830"},  
{"parentId":"NEWPOS","name":"NEW7210"}, 
{"parentId":"NEWPOS","name":"NEW8110"}, 
{"parentId":"NEWPOS","name":"NEW8210"}, 
{"parentId":"NEWPOS","name":"NEW7110"}, 
{"parentId":"NEWPOS","name":"NEW6210"}, 
{"parentId":"XINGUODU","name":"K370"},  
{"parentId":"XINGUODU","name":"G870"},  
{"parentId":"XINGUODU","name":"G3"},  
{"parentId":"XINGUODU","name":"K320"},  
{"parentId":"XINGUODU","name":"K350"},  
{"parentId":"XINGUODU","name":"G810"}];

/*
 * 功能：设置厂商机型
 * 参数（机型dom,厂商dom,机型显示btn,厂商显示btn,机型默认显示文本，厂商默认显示文本）
 */
   TMSTypeHelper.SetTmsFactoryInfo=function(elementsC,elementsP,elementsCBtn,elementsPBtn){
   	  	$(elementsC).empty();
		$(elementsP).empty();		
		$(elementsP).append("<li value=''><a>全部厂商</a></li>");
		$(elementsPBtn).html("全部厂商");
		$(elementsC).append("<li value='' parentValue=''><a>全部机型</a></li>");
		$(elementsCBtn).html("全部机型");

		//下拉框绑定
		$.each(dataList, function(index, entry) {
			$(elementsP).append("<li value=" + entry.code + "><a>" + entry.name + "</a></li>");
		});
		//父级选择事件
		$(elementsP).find('li').click(function() {
			$(elementsPBtn).attr('data-value', $(this).attr('value'));
			$(elementsC).empty();
			$(elementsC).append("<li value='' parentValue=''><a>全部机型</a></li>");
		    $(elementsCBtn).html("全部机型");
		    $(elementsCBtn).attr('data-value','');
			var values = $(this).attr('value');
			$.each(dataChildList, function(index, entry) {
				if(values == entry.parentId) {
					$(elementsC).append("<li value=" + entry.name + " parentValue=" + entry.parentId + "><a>" + entry.name + "</a></li>");
				}
			});
			//子级选择事件
			$(elementsC).find('li').click(function() {
				$(elementsCBtn).attr('data-value', $(this).attr('value'));
			});
		});
   };
	
	window.TMSTypeHelper=TMSTypeHelper;
})(window.TMSTypeHelper || {});
