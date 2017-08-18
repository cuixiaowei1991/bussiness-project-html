(function(posSetHelper){
	
	var dataList=[{'code':'1','name':'允许串码验券标志'},
{'code':'2','name':'允许手机号验券标志'},
{'code':'3','name':'允许银行卡验券标志'},
{'code':'4','name':'允许撤销标志'},
{'code':'5','name':'允许退货标志'},
{'code':'6','name':'允许微信支付被扫标志'},
{'code':'7','name':'允许微信支付主扫标志'},
{'code':'8','name':'允许微信退货标志'},
{'code':'9','name':'允许百度主扫支付标志'},
{'code':'10','name':'允许百度退货标志'},
{'code':'11','name':'允许京东被扫标志'},
{'code':'12','name':'允许京东主扫标志'},
{'code':'13','name':'允许京东退货标志'},
{'code':'14','name':'允许支付宝主扫交易标志'},
{'code':'15','name':'允许支付宝退货标志'},
{'code':'16','name':'允许美团兑券标志'},
{'code':'17','name':'允许盘锦通标志'},
{'code':'18','name':'允许点评闪惠主扫'},
{'code':'19','name':'允许点评闪惠被扫'},
{'code':'20','name':'允许点评闪惠退货'},
{'code':'21','name':'允许翼支付主扫'},
{'code':'22','name':'允许翼支付退货'},
{'code':'23','name':'允许点评支付确认'},
{'code':'24','name':'允许点评承兑'},
{'code':'25','name':'允许支付宝被扫'},
{'code':'26','name':'允许百度被扫'},
{'code':'27','name':'允许统一主扫'},
{'code':'28','name':'允许统一被扫'},
{'code':'29','name':'允许统一退货'},
{'code':'30','name':'允许统一查询'},
{'code':'31','name':'允许口碑特价'},
{'code':'32','name':'允许现金记账'},
{'code':'33','name':'允许现金销帐'},
{'code':'34','name':'允许结算'},
{'code':'35','name':'允许翼支付被扫'},
{'code':'36','name':'允许qq钱包主扫'},
{'code':'37','name':'允许qq钱包退货'},
{'code':'38','name':'允许移动和包主扫'},
{'code':'39','name':'允许移动和包退货'},
{'code':'40','name':'卡BIN活动'},
{'code':'41','name':'允许qq钱包被扫'},
{'code':'42','name':'会员消费'},
{'code':'43','name':'会员充值'},
{'code':'44','name':'会员查询'},
{'code':'45','name':'待定'},
{'code':'46','name':'待定'},
{'code':'47','name':'待定'},
{'code':'48','name':'待定'},
{'code':'49','name':'待定'},
{'code':'50','name':'待定'},
{'code':'51','name':'银行卡消费'},
{'code':'52','name':'银行卡撤销'},
{'code':'53','name':'银行卡退货'},
{'code':'54','name':'银行卡余额查询'},
{'code':'55','name':'银行卡预授权'},
{'code':'56','name':'预授权撤销'},
{'code':'57','name':'预授权完成'},
{'code':'58','name':'预授权完成撤销'},
{'code':'59','name':'银行卡积分消费'},
{'code':'60','name':'银行卡积分撤销'},
{'code':'61','name':'银行卡积分退货'},
{'code':'62','name':'银行卡积分查询'},
{'code':'63','name':'彩生活兑券'},
{'code':'64','name':'彩生活退货'},
{'code':'65','name':'会员注册'},
{'code':'66','name':'进销存管理'},
{'code':'67','name':'点餐系统'},
{'code':'68','name':'火车票销售'},
{'code':'69','name':'免费赠送'}];
    
    /*
     * 功能：设置pos终端菜单
     * 参数（）
     */
    posSetHelper.setCheckBoxPosSet=function(elements){
    	$(elements).empty();
    	$.each(dataList, function(index,entry) {
    		var html='<div class="col-xs-3"><label for="all-weixin"><input type="checkbox" code="'+entry.code+'" />'+
    		entry.name+' </label></div>';		
    		$(elements).append(html);
    	});	
    	$(elements).find("input[type='checkbox']").click(function(){
    		if($(this).attr('checked')=='checked')
    		{
    			$(this).removeAttr('checked');
    			$(this).prop('checked', false);
    		}
			else 
			{
			   $(this).attr('checked', 'checked');
			   $(this).prop('checked', true);
			}
			
    	});
    	
    };
	
	window.posSetHelper=posSetHelper;
})(window.posSetHelper || {});
