$(function() {
	var currentRow = 0;
	var importAssociateCurrent = 1; //关联pos批量导入
	var importrPosCurrent = 1; //软pos批量导入
	var importrShopCurrent = 1; //门店pos批量导入
	var importrAppendCurrent = 1; //追加pos批量导入

	var AgainimportAssociateCurrent = 1; //重新提交关联pos批量导入
	var AgainimportrPosCurrent = 1; //重新提交软pos批量导入
	var AgainimportrShopCurrent = 1; //重新提交门店pos批量导入
	var AgainimportrAppendCurrent = 1; //重新提交追加pos批量导入	

	var activeSheetCSVImport;
	var X = XLSX;
	var rABS, use_worker = true;
	var XW = {
		/* worker message */
		msg: 'xlsx',
		/* worker scripts */
		rABS: '../../plugins/xlsximport/xlsxworker2.js',
		norABS: '../../plugins/xlsximport/xlsxworker1.js',
		noxfer: '../../plugins/xlsximport/xlsxworker.js'
	};
	rABS = typeof FileReader !== "undefined" && typeof FileReader.prototype !== "undefined" && typeof FileReader.prototype.readAsBinaryString !== "undefined";
	use_worker = typeof Worker !== 'undefined';
	var wtf_mode = false;
	//导出json
	function ExportJSON() { // 获得Spread 对象
		var spread = $("#wijspread1").wijspread("spread");
		var sheetName = spread.getActiveSheet()._name;
		var funcs = "spread.toJSON().sheets." + sheetName + ".data.dataTable";
		var dataLists = eval(funcs);
		var jsonStr = JSON.stringify(dataLists);
		return dataLists;
	};

	//导出CSV字符串
	function ExportCSVFile() {
		// 获得Spread 对象
		var spread = $("#wijspread1").wijspread("spread");
		// 获得当前激活的标签页
		var activeSheet = spread.getActiveSheet();
		var csvString = spread.getActiveSheet().getCsv(
			0, // 开始行
			0, // 开始列
			activeSheet.getRowCount(), // 行数
			activeSheet.getColumnCount(), // 列数
			"\n", // 行分割字符
			"," // 列分割字符
		);
		var exportContent = "\uFEFF";
		var blob = new Blob([exportContent + csvString], {
			type: "text/plain;charset=utf-8"
		});
		saveAs(blob, "模板文件.csv");
	};

	//人员(账号)及软POS批量导入CSV字符串
	function ImportNumCSV(textCvs, typeImport) {
		//		activeSheetCSVImport.deleteRows();

		// 获得Spread 对象
		var spread = $("#wijspread1").wijspread("spread");;
		var csvString = textCvs.replace("\"", ""); //$("#jsonCode").html();
		spread.getActiveSheet().setCsv(
			0, // 开始行
			0, // 开始列
			csvString, // CSV字符串
			"\n", // 行分割字符
			",", // 列分割字符
			$.wijmo.wijspread.TextFileOpenFlags.UnFormatted // 导入选项
		);

		// 获得当前激活的标签页
		activeSheetCSVImport = spread.getActiveSheet();
		// 当前标签页自动进行行、列适应大小
		for(var i = 0; i < activeSheetCSVImport.getColumnCount(); i++) {
			activeSheetCSVImport.autoFitColumn(i);
		}
		// 设置导入后页面行高
		for(var i = 0; i < activeSheetCSVImport.getRowCount(); i++) {
			activeSheetCSVImport.setRowHeight(i, 25); //设置行高
		}

		//添加一列
		if(typeImport == 'rPos') {
			activeSheetCSVImport.addColumns(0, 3);
		} else {
			activeSheetCSVImport.addColumns(0, 2);
		}

		// 获得第0行0列单元格
		var cell = activeSheetCSVImport.getCell(0, 0);
		// 对这个单元格进行赋值
		cell.value("导入结果");
		var cell1 = activeSheetCSVImport.getCell(0, 1);
		activeSheetCSVImport.setColumnWidth(1, 50 * 5);
		cell1.value("导入备注");

		switch(typeImport) {
			case "rPos": //软POS批量导入
				var cell2 = activeSheetCSVImport.getCell(0, 2);
				activeSheetCSVImport.setColumnWidth(2, 50 * 3);
				cell2.value("商户号");
				ImportrPosData(1);
				break;
			case 'associate': //关联POS批量导入
				ImportAssociateData(1);
				break;
			case 'shop': //商户、门店及POS终端批量导入
				ImportShopData(1);
				break;
			case 'append': //追加pos批量导入
				ImportrAppendData(1);
				break;
		}
	};
	/*
	 * 功能：关联POS批量导入数据处理
	 * 创建人：liql
	 */

	function ImportAssociateData(i) {
		var jsonParam = {
			"code": "10002",
			"version": "1.0",
			"jsonStr": {}
		};
		importAssociateCurrent = i;
		if(i < activeSheetCSVImport.getRowCount()) {
			var values = dataHelper.setJson(null, "superMerchantCode", activeSheetCSVImport.getCell(i, 2).value()); //关联pos商户号
			values = dataHelper.setJson(values, "superTermCode", activeSheetCSVImport.getCell(i, 3).value()); //关联终端号
			values = dataHelper.setJson(values, "merchantCode", activeSheetCSVImport.getCell(i, 4).value()); //商户号
			values = dataHelper.setJson(values, "termCode", activeSheetCSVImport.getCell(i, 5).value()); //终端号
			values = dataHelper.setJson(values, "posType", activeSheetCSVImport.getCell(i, 6).value()); //终端类型
			values = dataHelper.setJson(values, "payChannel", activeSheetCSVImport.getCell(i, 7).value()); //应用系统
			jsonParam.jsonStr = values;
			console.log(jsonParam);
			businessPosServer.ImportSuperPosInfo(jsonParam, callback_ImportAssociateData);
		}
	};
	/*
	 * 功能:关联POS批量导入回调函数
	 * 创建人：liql
	 */
	function callback_ImportAssociateData(data) {
		console.log(data);
		var cell = activeSheetCSVImport.getCell(importAssociateCurrent, 0);
		var cell1 = activeSheetCSVImport.getCell(importAssociateCurrent, 1);
		// 对这个单元格进行赋值		
		if(data.rspCode == '000') {
			cell.value('成功');
			cell.backColor("#D9FFD9");
			activeSheetCSVImport.getCell(importAssociateCurrent, 4).value(data.merchantCode);
			activeSheetCSVImport.getCell(importAssociateCurrent, 5).value(data.termCode);
		} else {
			cell.value('失败');
			cell1.value(data.rspDesc);
			cell.backColor("red");
		}
		//继续执行导入数据
		if(importAssociateCurrent < activeSheetCSVImport.getRowCount()) {
			setTimeout(function() {
				importAssociateCurrent++;
				ImportAssociateData(importAssociateCurrent);
			}, 100)

		}
	};

	//软pos批量导入CSV字符串 
	function ImportrPosData(i) {
		var jsonParam = {
			"code": "10002",
			"version": "1.0",
			"jsonStr": {}
		};
		importrPosCurrent = i;
		if(i < activeSheetCSVImport.getRowCount()) {
			var values = dataHelper.setJson(null, "userType", activeSheetCSVImport.getCell(i, 3).value()); //商户类型
			values = dataHelper.setJson(values, "branchName", activeSheetCSVImport.getCell(i, 4).value()); //分公司名称
			values = dataHelper.setJson(values, "agentName", activeSheetCSVImport.getCell(i, 5).value()); //代理商名称
			values = dataHelper.setJson(values, "merchantName", activeSheetCSVImport.getCell(i, 6).value()); //商户名称
			values = dataHelper.setJson(values, "storeName", activeSheetCSVImport.getCell(i, 7).value()); //门店名称
			values = dataHelper.setJson(values, "userName", activeSheetCSVImport.getCell(i, 8).value()); //管理员名称
			values = dataHelper.setJson(values, "userPhone", activeSheetCSVImport.getCell(i, 9).value()); //管理员手机号
			values = dataHelper.setJson(values, "userEmail", activeSheetCSVImport.getCell(i, 10).value()); //联系邮箱
			values = dataHelper.setJson(values, "isSupportPos", activeSheetCSVImport.getCell(i, 11).value()); //是否支持软pos
			jsonParam.jsonStr = values;
			console.log(jsonParam);
			businessPosServer.ImportPosInfo(jsonParam, callback_ImportrPosData);
		}
	};
	/*
	 * 功能:软pos批量导入回调函数
	 * 创建人：liql
	 */
	function callback_ImportrPosData(data) {
		console.log(data);
		var cell = activeSheetCSVImport.getCell(importrPosCurrent, 0);
		var cell1 = activeSheetCSVImport.getCell(importrPosCurrent, 1);
		var cell2 = activeSheetCSVImport.getCell(importrPosCurrent, 2);
		// 对这个单元格进行赋值		
		if(data.rspCode == '000') {
			cell.value('成功');
			cell2.value(data.merchantCode);
			cell.backColor("#D9FFD9");
		} else {
			cell.value('失败');
			cell1.value(data.rspDesc);
			cell.backColor("red");
		}
		//继续执行导入数据
		if(importrPosCurrent < activeSheetCSVImport.getRowCount()) {
			setTimeout(function() {
				importrPosCurrent++;
				ImportrPosData(importrPosCurrent);
			}, 100);
		}
	};

	//商户、门店及POS终端批量导入 shopImportFile
	function ImportShopData(i) {
		var jsonParam = {
			"code": "10002",
			"version": "1.0",
			"jsonStr": {}
		};
		importrShopCurrent = i;
		if(i < activeSheetCSVImport.getRowCount()) {
			var values = dataHelper.setJson(null, "mhtName", activeSheetCSVImport.getCell(i, 2).value()); //商户名称
			values = dataHelper.setJson(values, "mhtShortName", activeSheetCSVImport.getCell(i, 3).value()); //商户简称
			values = dataHelper.setJson(values, "branchName", activeSheetCSVImport.getCell(i, 4).value()); //分公司名称
			values = dataHelper.setJson(values, "agentNum", activeSheetCSVImport.getCell(i, 5).value()); //代理商编号
			values = dataHelper.setJson(values, "mhtIndustry", activeSheetCSVImport.getCell(i, 6).value()); //所属行业

			values = dataHelper.setJson(values, "mhtProvinceName", activeSheetCSVImport.getCell(i, 7).value()); //省份
			values = dataHelper.setJson(values, "mhtProvinceId", regionHelper.getCodeByName(activeSheetCSVImport.getCell(i, 7).value(), 1)); //省份

			values = dataHelper.setJson(values, "mhtCityName", activeSheetCSVImport.getCell(i, 8).value()); //市
			values = dataHelper.setJson(values, "mhtCityId", regionHelper.getCodeByName(activeSheetCSVImport.getCell(i, 8).value(), 2, activeSheetCSVImport.getCell(i, 7).value())); //市

			values = dataHelper.setJson(values, "mhtCountryName", activeSheetCSVImport.getCell(i, 9).value()); //县
			values = dataHelper.setJson(values, "mhtCountryId", regionHelper.getCodeByName(activeSheetCSVImport.getCell(i, 9).value(), 3)); //县

			values = dataHelper.setJson(values, "mhtAddress", activeSheetCSVImport.getCell(i, 10).value()); //地址
			values = dataHelper.setJson(values, "mhtManager", activeSheetCSVImport.getCell(i, 11).value()); //联系人
			values = dataHelper.setJson(values, "mhtManagerPhone", activeSheetCSVImport.getCell(i, 12).value()); //联系人电话
			values = dataHelper.setJson(values, "storeName", activeSheetCSVImport.getCell(i, 13).value()); //门店名称
			values = dataHelper.setJson(values, "storeShortName", activeSheetCSVImport.getCell(i, 14).value()); //门店简称
			values = dataHelper.setJson(values, "storeAddress", activeSheetCSVImport.getCell(i, 15).value()); //门店地址
			values = dataHelper.setJson(values, "posType", activeSheetCSVImport.getCell(i, 16).value()); //pos类型
			values = dataHelper.setJson(values, "merchaCode", activeSheetCSVImport.getCell(i, 17).value()); //商户号
			values = dataHelper.setJson(values, "termCode", activeSheetCSVImport.getCell(i, 18).value()); //终端编号
			values = dataHelper.setJson(values, "posParterName", activeSheetCSVImport.getCell(i, 19).value()); //Pos终端所属合作方
			values = dataHelper.setJson(values, "peiJianPosParterName", activeSheetCSVImport.getCell(i, 20).value()); //pos配件所属pos合作方
			jsonParam.jsonStr = values;
			console.log(jsonParam);
			//			var data={"rspCode":"000","rspDesc":"成功","merchantCode":"123456","termCode":"123122222"};
			//			callback_ImportShopData(data);
			businessShopServer.importMerchantInfo(jsonParam, callback_ImportShopData);
		}
	};
	/*
	 * 功能:商户、门店及POS终端批量导入回调函数
	 * 创建人：liql
	 */
	function callback_ImportShopData(data) {
		console.log(data);
		var cell = activeSheetCSVImport.getCell(importrShopCurrent, 0);
		var cell1 = activeSheetCSVImport.getCell(importrShopCurrent, 1);
		// 对这个单元格进行赋值		
		if(data.rspCode == '000') {
			cell.value('成功');
			cell.backColor("#D9FFD9");
			//			activeSheetCSVImport.getCell(importrShopCurrent, 18).value(data.merchantCode);
			activeSheetCSVImport.getCell(importrShopCurrent, 17).value(data.merchaCode);
			activeSheetCSVImport.getCell(importrShopCurrent, 18).value(data.termCode);
		} else {
			cell.value('失败');
			cell1.value(data.rspDesc);
			cell.backColor("red");
		}
		//继续执行导入数据
		if(importrShopCurrent < activeSheetCSVImport.getRowCount()) {
			setTimeout(function() {
				importrShopCurrent++;
				ImportShopData(importrShopCurrent);
			}, 100)

		}
	};

	//软pos批量导入CSV字符串 
	function ImportrAppendData(i) {
		var jsonParam = {
			"code": "10002",
			"version": "1.0",
			"jsonStr": {}
		};
		importrAppendCurrent = i;
		if(i < activeSheetCSVImport.getRowCount()) {
			var values = dataHelper.setJson(null, "merchantName", activeSheetCSVImport.getCell(i, 2).value()); //商户名称
			values = dataHelper.setJson(values, "storeName", activeSheetCSVImport.getCell(i, 3).value()); //门店名称
			values = dataHelper.setJson(values, "merchantCode", activeSheetCSVImport.getCell(i, 4).value()); //商户号
			values = dataHelper.setJson(values, "termCode", activeSheetCSVImport.getCell(i, 5).value()); //终端号
			values = dataHelper.setJson(values, "branchName", activeSheetCSVImport.getCell(i, 6).value()); //分公司名称
			values = dataHelper.setJson(values, "posParterName", activeSheetCSVImport.getCell(i, 7).value()); //Pos终端所属合作方
			values = dataHelper.setJson(values, "peiJianPosParterName", activeSheetCSVImport.getCell(i, 8).value()); //pos配件所属pos合作方
			values = dataHelper.setJson(values, "posType", activeSheetCSVImport.getCell(i, 9).value()); //pos类型
			values = dataHelper.setJson(values, "payChannel", activeSheetCSVImport.getCell(i, 10).value()); //应用系统
			jsonParam.jsonStr = values;
			console.log(jsonParam);
			businessPosServer.ImportAppendPosInfo(jsonParam, callback_ImportrAppendData);
		}
	};
	/*
	 * 功能:追加pos批量导入回调函数
	 * 创建人：liql
	 */
	function callback_ImportrAppendData(data) {
		console.log(data);
		var cell = activeSheetCSVImport.getCell(importrAppendCurrent, 0);
		var cell1 = activeSheetCSVImport.getCell(importrAppendCurrent, 1);
		// 对这个单元格进行赋值		
		if(data.rspCode == '000') {
			cell.value('成功');
			cell1.value('');
			cell.backColor("#D9FFD9");
		} else {
			cell.value('失败');
			cell1.value(data.rspDesc);
			cell.backColor("red");
		}
		//继续执行导入数据
		if(importrAppendCurrent < activeSheetCSVImport.getRowCount()) {
			setTimeout(function() {
				importrAppendCurrent++;
				ImportrAppendData(importrAppendCurrent);
			}, 100);
		}
	};

	//获取JSON对象名字数组
	function getJsonObjNames(data) {
		var objNames = [];
		//Object
		for(var name in data) {
			objNames.push(name);
		}
		return objNames;
	};

	function fixdata(data) {
		var o = "",
			l = 0,
			w = 10240;
		for(; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)));
		o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)));
		return o;
	};

	function ab2str(data) {
		var o = "",
			l = 0,
			w = 10240;
		for(; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w, l * w + w)));
		o += String.fromCharCode.apply(null, new Uint16Array(data.slice(l * w)));
		return o;
	};

	function s2ab(s) {
		var b = new ArrayBuffer(s.length * 2),
			v = new Uint16Array(b);
		for(var i = 0; i != s.length; ++i) v[i] = s.charCodeAt(i);
		return [v, b];
	};

	function xw_noxfer(data, cb) {
		var worker = new Worker(XW.noxfer);
		worker.onmessage = function(e) {
			switch(e.data.t) {
				case 'ready':
					break;
				case 'e':
					console.error(e.data.d);
					break;
				case XW.msg:
					cb(JSON.parse(e.data.d));
					break;
			}
		};
		var arr = rABS ? data : btoa(fixdata(data));
		worker.postMessage({
			d: arr,
			b: rABS
		});
	};

	function xw_xfer(data, cb) {
		var worker = new Worker(rABS ? XW.rABS : XW.norABS);
		worker.onmessage = function(e) {
			switch(e.data.t) {
				case 'ready':
					break;
				case 'e':
					console.error(e.data.d);
					break;
				default:
					xx = ab2str(e.data).replace(/\n/g, "\\n").replace(/\r/g, "\\r");
					console.log("done");
					cb(JSON.parse(xx));
					break;
			}
		};
		if(rABS) {
			var val = s2ab(data);
			worker.postMessage(val[1], [val[1]]);
		} else {
			worker.postMessage(data, [data]);
		}
	};

	function xw(data, cb) {
		if(use_worker) xw_xfer(data, cb);
		else xw_noxfer(data, cb);
	};
	//输出csv格式数据
	function to_csv(workbook) {
		var result = [];

		//workbook.SheetNames.forEach(function(sheetName) {
		var csv = X.utils.sheet_to_csv(workbook.Sheets[workbook.SheetNames[0]]);
		if(csv.length > 0) {
			//			result.push("SHEET: " + sheetName); //不显示sheet名称
			//			result.push("");
			result.push(csv);
		}
		//});
		return result.join("\n");
	};
	//清空单元格
	function clearSheetContent() {
		if(activeSheetCSVImport != undefined && activeSheetCSVImport != null) {
			var countRow = activeSheetCSVImport.getRowCount();
			var countColumn = activeSheetCSVImport.getColumnCount();
			console.log(countColumn);
			activeSheetCSVImport.deleteRows(0, (countRow - 1));
			activeSheetCSVImport.deleteColumns(0, (countColumn - 1));
		}

	};

	//输出结果到页面 软POS批量
	function process_wb_rPos(wb) {
		var output = "";
		output = to_csv(wb);
		clearSheetContent();
		$("#againSubmit").attr('data-type', 'rPos');
		ImportNumCSV(output, 'rPos');
	};
	//输出结果到页面 关联POS批量导入
	function process_wb_associate(wb) {
		var output = "";
		output = to_csv(wb);
		clearSheetContent();
		$("#againSubmit").attr('data-type', 'associate');
		ImportNumCSV(output, 'associate');
	};
	//输出结果到页面 追加POS批量导入
	function process_wb_append(wb) {
		var output = "";
		output = to_csv(wb);
		clearSheetContent();
		$("#againSubmit").attr('data-type', 'append');
		ImportNumCSV(output, 'append');
	};
	//输出结果到页面 商户、门店批量导入
	function process_wb_shop(wb) {
		var output = "";
		output = to_csv(wb);
		clearSheetContent();
		$("#againSubmit").attr('data-type', 'shop');
		ImportNumCSV(output, 'shop');
	};

	//软POS批量导入
	function handlerPosImportFile(e) {
		var files = e.target.files;
		var f = files[0]; {
			var reader = new FileReader();
			var name = f.name;
			$(".rPosImportFile").text(name);
			reader.onload = function(e) {
				if(typeof console !== 'undefined') console.log("onload", new Date(), rABS, use_worker);
				var data = e.target.result;
				if(use_worker) {
					xw(data, process_wb_rPos);
				} else {
					var wb;
					if(rABS) {
						wb = X.read(data, {
							type: 'binary'
						});
					} else {
						var arr = fixdata(data);
						wb = X.read(btoa(arr), {
							type: 'base64'
						});
					}
					process_wb_rPos(wb);
				}
			};
			if(rABS) reader.readAsBinaryString(f);
			else reader.readAsArrayBuffer(f);
		}
	};
	//软POS批量
	var xlf = document.getElementById('rPosImportFile');
	if(xlf.addEventListener) xlf.addEventListener('change', handlerPosImportFile, false);

	//关联POS批量导入
	function handleAssociateImportFile(e) {

		var files = e.target.files;
		var f = files[0]; {
			var reader = new FileReader();
			var name = f.name;
			$(".associateImportFile").text(name);
			reader.onload = function(e) {
				if(typeof console !== 'undefined') console.log("onload", new Date(), rABS, use_worker);
				var data = e.target.result;
				if(use_worker) {
					xw(data, process_wb_associate);
				} else {
					var wb;
					if(rABS) {
						wb = X.read(data, {
							type: 'binary'
						});
					} else {
						var arr = fixdata(data);
						wb = X.read(btoa(arr), {
							type: 'base64'
						});
					}
					process_wb_associate(wb);
				}
			};
			if(rABS) reader.readAsBinaryString(f);
			else reader.readAsArrayBuffer(f);
		}
	};
	//关联POS批量导入
	var assxlf = document.getElementById('associateImportFile');
	if(assxlf.addEventListener) assxlf.addEventListener('change', handleAssociateImportFile, false);

	//追加POS批量导入
	function handlePosImportFile(e) {
		var files = e.target.files;
		var f = files[0]; {
			var reader = new FileReader();
			var name = f.name;
			$(".posImportFile").text(name);
			reader.onload = function(e) {
				if(typeof console !== 'undefined') console.log("onload", new Date(), rABS, use_worker);
				var data = e.target.result;
				if(use_worker) {
					xw(data, process_wb_append);
				} else {
					var wb;
					if(rABS) {
						wb = X.read(data, {
							type: 'binary'
						});
					} else {
						var arr = fixdata(data);
						wb = X.read(btoa(arr), {
							type: 'base64'
						});
					}
					process_wb_append(wb);
				}
			};
			if(rABS) reader.readAsBinaryString(f);
			else reader.readAsArrayBuffer(f);
		}
	};
	//关联POS批量导入
	var appxlf = document.getElementById('posImportFile');
	if(appxlf.addEventListener) appxlf.addEventListener('change', handlePosImportFile, false);

	//商户、门店批量导入
	function handleShopImportFile(e) {
		var files = e.target.files;
		var f = files[0]; {
			var reader = new FileReader();
			var name = f.name;
			$(".shopImportFile").text(name);
			reader.onload = function(e) {
				if(typeof console !== 'undefined') console.log("onload", new Date(), rABS, use_worker);
				var data = e.target.result;
				if(use_worker) {
					xw(data, process_wb_shop);
				} else {
					var wb;
					if(rABS) {
						wb = X.read(data, {
							type: 'binary'
						});
					} else {
						var arr = fixdata(data);
						wb = X.read(btoa(arr), {
							type: 'base64'
						});
					}
					process_wb_shop(wb);
				}
			};
			if(rABS) reader.readAsBinaryString(f);
			else reader.readAsArrayBuffer(f);
		}
	};
	//商户、门店批量导入
	var shopxlf = document.getElementById('shopImportFile');
	if(shopxlf.addEventListener) shopxlf.addEventListener('change', handleShopImportFile, false);

	//导出csv数据
	$("#exportCsv").click(function() {
		//		ExportJSON();
		ExportCSVFile();
	});

	/*
	 * 功能：关联POS批量导入数据处理
	 * 创建人：liql
	 */

	function AgainImportAssociateData(i) {
		var jsonParam = {
			"code": "10002",
			"version": "1.0",
			"jsonStr": {}
		};
		AgainimportAssociateCurrent = i;
		if(i < activeSheetCSVImport.getRowCount()) {
			if(activeSheetCSVImport.getCell(i, 0).value() == '失败') {
				var values = dataHelper.setJson(null, "superMerchantCode", activeSheetCSVImport.getCell(i, 2).value()); //关联pos商户号
				values = dataHelper.setJson(values, "superTermCode", activeSheetCSVImport.getCell(i, 3).value()); //关联终端号
				values = dataHelper.setJson(values, "merchantCode", activeSheetCSVImport.getCell(i, 4).value()); //商户号
				values = dataHelper.setJson(values, "termCode", activeSheetCSVImport.getCell(i, 5).value()); //终端号
				values = dataHelper.setJson(values, "posType", activeSheetCSVImport.getCell(i, 6).value()); //终端类型
				values = dataHelper.setJson(values, "payChannel", activeSheetCSVImport.getCell(i, 7).value()); //应用系统
				jsonParam.jsonStr = values;
				console.log(jsonParam);
				businessPosServer.ImportSuperPosInfo(jsonParam, callback_AgainImportAssociateData);
			} else {
				//继续执行导入数据
				if(AgainimportAssociateCurrent < activeSheetCSVImport.getRowCount()) {
					AgainimportAssociateCurrent++;
					AgainImportAssociateData(AgainimportAssociateCurrent);
				}
			}

		}
	};
	/*
	 * 功能:关联POS批量导入回调函数
	 * 创建人：liql
	 */
	function callback_AgainImportAssociateData(data) {
		console.log(data);
		var cell = activeSheetCSVImport.getCell(AgainimportAssociateCurrent, 0);
		var cell1 = activeSheetCSVImport.getCell(AgainimportAssociateCurrent, 1);
		// 对这个单元格进行赋值		
		if(data.rspCode == '000') {
			cell.value('成功');
			cell1.value('');
			cell.backColor("#D9FFD9");
			activeSheetCSVImport.getCell(AgainimportAssociateCurrent, 4).value(data.merchantCode);
			activeSheetCSVImport.getCell(AgainimportAssociateCurrent, 5).value(data.termCode);
		} else {
			cell.value('失败');
			cell1.value(data.rspDesc);
			cell.backColor("red");
		}
		//继续执行导入数据
		if(AgainimportAssociateCurrent < activeSheetCSVImport.getRowCount()) {
			setTimeout(function() {
				AgainimportAssociateCurrent++;
				AgainImportAssociateData(AgainimportAssociateCurrent);
			}, 100)

		}
	};

	//软pos批量导入CSV字符串 
	function AgainImportrPosData(i) {
		var jsonParam = {
			"code": "10002",
			"version": "1.0",
			"jsonStr": {}
		};
		AgainimportrPosCurrent = i;
		if(i < activeSheetCSVImport.getRowCount()) {
			if(activeSheetCSVImport.getCell(i, 0).value() == '失败') {
				var values = dataHelper.setJson(null, "userType", activeSheetCSVImport.getCell(i, 3).value()); //商户类型
				values = dataHelper.setJson(values, "branchName", activeSheetCSVImport.getCell(i, 4).value()); //分公司名称
				values = dataHelper.setJson(values, "agentName", activeSheetCSVImport.getCell(i, 5).value()); //代理商名称
				values = dataHelper.setJson(values, "merchantName", activeSheetCSVImport.getCell(i, 6).value()); //商户名称
				values = dataHelper.setJson(values, "storeName", activeSheetCSVImport.getCell(i, 7).value()); //门店名称
				values = dataHelper.setJson(values, "userName", activeSheetCSVImport.getCell(i, 8).value()); //管理员名称
				values = dataHelper.setJson(values, "userPhone", activeSheetCSVImport.getCell(i, 9).value()); //管理员手机号
				values = dataHelper.setJson(values, "userEmail", activeSheetCSVImport.getCell(i, 10).value()); //联系邮箱
				values = dataHelper.setJson(values, "isSupportPos", activeSheetCSVImport.getCell(i, 11).value()); //是否支持软pos
				jsonParam.jsonStr = values;
				console.log(jsonParam);
				businessPosServer.ImportPosInfo(jsonParam, callback_AgainImportrPosData);
			} else {
				//继续执行导入数据
				if(AgainimportrPosCurrent < activeSheetCSVImport.getRowCount()) {
					AgainimportrPosCurrent++;
					AgainImportrPosData(AgainimportrPosCurrent);
				}
			}
		}
	};
	/*
	 * 功能:软pos批量导入回调函数
	 * 创建人：liql
	 */
	function callback_AgainImportrPosData(data) {
		console.log(data);
		var cell = activeSheetCSVImport.getCell(AgainimportrPosCurrent, 0);
		var cell1 = activeSheetCSVImport.getCell(AgainimportrPosCurrent, 1);
		var cell3 = activeSheetCSVImport.getCell(AgainimportrPosCurrent, 2);
		// 对这个单元格进行赋值		
		if(data.rspCode == '000') {
			cell.value('成功');
			cell1.value('');
			cell3.value(data.merchantCode);
			cell.backColor("#D9FFD9");
		} else {
			cell.value('失败');
			cell1.value(data.rspDesc);
			cell.backColor("red");
		}
		//继续执行导入数据
		if(AgainimportrPosCurrent < activeSheetCSVImport.getRowCount()) {
			setTimeout(function() {
				AgainimportrPosCurrent++;
				AgainImportrPosData(AgainimportrPosCurrent);
			}, 100);
		}
	};

	//商户、门店及POS终端批量导入 shopImportFile
	function AgainImportShopData(i) {
		var jsonParam = {
			"code": "10002",
			"version": "1.0",
			"jsonStr": {}
		};
		AgainimportrShopCurrent = i;
		console.log(activeSheetCSVImport.getRowCount());
		console.log(activeSheetCSVImport.getCell(i, 0).value());
		if(i < activeSheetCSVImport.getRowCount()) {
			if(activeSheetCSVImport.getCell(i, 0).value() == '失败') {
				var values = dataHelper.setJson(null, "mhtName", activeSheetCSVImport.getCell(i, 2).value()); //商户名称
				values = dataHelper.setJson(values, "mhtShortName", activeSheetCSVImport.getCell(i, 3).value()); //商户简称
				values = dataHelper.setJson(values, "branchName", activeSheetCSVImport.getCell(i, 4).value()); //分公司名称
				values = dataHelper.setJson(values, "agentNum", activeSheetCSVImport.getCell(i, 5).value()); //代理商编号
				values = dataHelper.setJson(values, "mhtIndustry", activeSheetCSVImport.getCell(i, 6).value()); //所属行业

				values = dataHelper.setJson(values, "mhtProvinceName", activeSheetCSVImport.getCell(i, 7).value()); //省份
				values = dataHelper.setJson(values, "mhtProvinceId", regionHelper.getCodeByName(activeSheetCSVImport.getCell(i, 7).value(), 1)); //省份

				values = dataHelper.setJson(values, "mhtCityName", activeSheetCSVImport.getCell(i, 8).value()); //市
				values = dataHelper.setJson(values, "mhtCityId", regionHelper.getCodeByName(activeSheetCSVImport.getCell(i, 8).value(), 2, activeSheetCSVImport.getCell(i, 7).value())); //市

				values = dataHelper.setJson(values, "mhtCountryName", activeSheetCSVImport.getCell(i, 9).value()); //县
				values = dataHelper.setJson(values, "mhtCountryId", regionHelper.getCodeByName(activeSheetCSVImport.getCell(i, 9).value(), 3)); //县

				values = dataHelper.setJson(values, "mhtAddress", activeSheetCSVImport.getCell(i, 10).value()); //地址
				values = dataHelper.setJson(values, "mhtManager", activeSheetCSVImport.getCell(i, 11).value()); //联系人
				values = dataHelper.setJson(values, "mhtManagerPhone", activeSheetCSVImport.getCell(i, 12).value()); //联系人电话
				values = dataHelper.setJson(values, "storeName", activeSheetCSVImport.getCell(i, 13).value()); //门店名称
				values = dataHelper.setJson(values, "storeShortName", activeSheetCSVImport.getCell(i, 14).value()); //门店简称
				values = dataHelper.setJson(values, "storeAddress", activeSheetCSVImport.getCell(i, 15).value()); //门店地址
				values = dataHelper.setJson(values, "posType", activeSheetCSVImport.getCell(i, 16).value()); //pos类型
				values = dataHelper.setJson(values, "merchaCode", activeSheetCSVImport.getCell(i, 17).value()); //商户号
				values = dataHelper.setJson(values, "termCode", activeSheetCSVImport.getCell(i, 18).value()); //终端编号
				values = dataHelper.setJson(values, "posParterName", activeSheetCSVImport.getCell(i, 19).value()); //Pos终端所属合作方
				values = dataHelper.setJson(values, "peiJianPosParterName", activeSheetCSVImport.getCell(i, 20).value()); //pos配件所属pos合作方
				jsonParam.jsonStr = values;
				console.log(jsonParam);
				businessShopServer.importMerchantInfo(jsonParam, callback_AgainImportShopData);
			} else {
				if(AgainimportrShopCurrent < activeSheetCSVImport.getRowCount()) {
					AgainimportrShopCurrent++;
					AgainImportShopData(AgainimportrShopCurrent);
				}
			}
		}
	};
	/*
	 * 功能:商户、门店及POS终端批量导入回调函数
	 * 创建人：liql
	 */
	function callback_AgainImportShopData(data) {
		console.log(data);
		var cell = activeSheetCSVImport.getCell(AgainimportrShopCurrent, 0);
		var cell1 = activeSheetCSVImport.getCell(AgainimportrShopCurrent, 1);
		// 对这个单元格进行赋值		
		if(data.rspCode == '000') {
			cell.value('成功');
			cell1.value('');
			cell.backColor("#D9FFD9");
			//			activeSheetCSVImport.getCell(importrShopCurrent, 18).value(data.merchantCode);
			activeSheetCSVImport.getCell(AgainimportrShopCurrent, 17).value(data.merchantCode);
		} else {
			cell.value('失败');
			cell1.value(data.rspDesc);
			cell.backColor("red");
		}
		console.log(activeSheetCSVImport.getRowCount());
		//继续执行导入数据
		if(AgainimportrShopCurrent < activeSheetCSVImport.getRowCount()) {
			setTimeout(function() {
				AgainimportrShopCurrent++;
				AgainImportShopData(AgainimportrShopCurrent);
			}, 100)

		}
	};

	//软pos批量导入CSV字符串 
	function AgainImportrAppendData(i) {
		var jsonParam = {
			"code": "10002",
			"version": "1.0",
			"jsonStr": {}
		};
		AgainimportrAppendCurrent = i;
		if(i < activeSheetCSVImport.getRowCount()) {
			if(activeSheetCSVImport.getCell(i, 0).value() == '失败') {
				var values = dataHelper.setJson(null, "merchantName", activeSheetCSVImport.getCell(i, 2).value()); //商户名称
				values = dataHelper.setJson(values, "storeName", activeSheetCSVImport.getCell(i, 3).value()); //门店名称
				values = dataHelper.setJson(values, "merchantCode", activeSheetCSVImport.getCell(i, 4).value()); //商户号
				values = dataHelper.setJson(values, "termCode", activeSheetCSVImport.getCell(i, 5).value()); //终端号
				values = dataHelper.setJson(values, "branchName", activeSheetCSVImport.getCell(i, 6).value()); //分公司名称
				values = dataHelper.setJson(values, "posParterName", activeSheetCSVImport.getCell(i, 7).value()); //Pos终端所属合作方
				values = dataHelper.setJson(values, "peiJianPosParterName", activeSheetCSVImport.getCell(i, 8).value()); //pos配件所属pos合作方
				values = dataHelper.setJson(values, "posType", activeSheetCSVImport.getCell(i, 9).value()); //pos类型
				values = dataHelper.setJson(values, "payChannel", activeSheetCSVImport.getCell(i, 10).value()); //应用系统
				jsonParam.jsonStr = values;
				console.log(jsonParam);
				businessPosServer.ImportAppendPosInfo(jsonParam, callback_AgainImportrAppendData);
			} else {
				//继续执行导入数据
				if(AgainimportrAppendCurrent < activeSheetCSVImport.getRowCount()) {
					AgainimportrAppendCurrent++;
					AgainImportrAppendData(AgainimportrAppendCurrent);
				}
			}
		}
	};
	/*
	 * 功能:追加pos批量导入回调函数
	 * 创建人：liql
	 */
	function callback_AgainImportrAppendData(data) {
		console.log(data);
		var cell = activeSheetCSVImport.getCell(AgainimportrAppendCurrent, 0);
		var cell1 = activeSheetCSVImport.getCell(AgainimportrAppendCurrent, 1);
		// 对这个单元格进行赋值		
		if(data.rspCode == '000') {
			cell.value('成功');
			cell1.value('');
			cell.backColor("#D9FFD9");
		} else {
			cell.value('失败');
			cell1.value(data.rspDesc);
			cell.backColor("red");
		}
		//继续执行导入数据
		if(AgainimportrAppendCurrent < activeSheetCSVImport.getRowCount()) {
			setTimeout(function() {
				AgainimportrAppendCurrent++;
				AgainImportrAppendData(AgainimportrAppendCurrent);
			}, 100);
		}
	};

	//重新提交失败数据
	$("#againSubmit").click(function() {
		var type = $(this).attr('data-type');
		switch(type) {
			case "rPos": //软POS批量导入
				AgainImportrPosData(1);
				break;
			case 'associate': //关联POS批量导入
				AgainImportAssociateData(1);
				break;
			case 'shop': //商户、门店及POS终端批量导入
				console.log(activeSheetCSVImport.getRowCount());
				AgainImportShopData(1);
				break;
			case 'append': //追加pos批量导入
				AgainImportrAppendData(1);
				break;
		}
	});
});