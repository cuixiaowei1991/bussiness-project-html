$(document).ready(function() {
	var parterId = dataHelper.QueryString("id");
	console.log("parterId:::" + parterId);
	GetPosParterInfoById(parterId);
});

function GetPosParterInfoById(parterId) {
	var jsonParam = {
		"code": "10002",
		"version": "1.0",
		"jsonStr": {}
	};
	var jsonstr = dataHelper.setJson(null, "parterId", parterId); 
	
	jsonParam.jsonStr = jsonstr;
	businessAgentServer.GetPosParterInfoById(jsonParam, callback_GetPosParterInfoById);
};

function callback_GetPosParterInfoById(data) {
	console.log("获取的回调")
	console.log(data);
	if (data == undefined || data.rspCode == null || data.rspCode != "000") {
		alert(data.rspDesc);
	} else {
		
		
	};
};