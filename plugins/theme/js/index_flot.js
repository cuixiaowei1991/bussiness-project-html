var fa = new Object();
var indexTab = $("#indexTab");

function cssNum(a) {
	a.btnWidth = 32;
	a.sumLi = 0;
	indexTab.find("li").each(function() {
		a.sumLi += parseInt($(this).css("width"))
	});
	a.widthX = parseInt($("#moreNavBox").css("width"));
	a.sumActiveLi = 0;
	indexTab.find("li").each(function() {
		if($(this).hasClass("active")) {
			return false
		} else {
			a.sumActiveLi += parseInt($(this).css("width"))
		}
	});
	return a
}
openIframe();

function openIframe() {
	$(".sidebar-menu").on("click", "a", function() {
		var a = $(this).attr("data-pageName");
		if(a != undefined) {
			var g = a.replace(/\-/g, "/")
		}
		var f = $(this).text();
		var c = customHost + g + ".html";
		if(a) {
			var b = true;
			$("#iframeBox").find(".tab-pane").each(function() {
				if($(this).attr("id") == a) {
					b = false;
					indexTab.find('a[href="#' + a + '"]').tab("show");
					if(cssNum(fa).sumLi > cssNum(fa).widthX) {
						autoWidthNav.tabMove(-cssNum(fa).sumActiveLi + cssNum(fa).btnWidth)
					}
					return false
				}
			});
			if(b) {
				var e = '<li><a  href="#' + a + '">' + f + ' <i class="fa fa-remove"></i></a></li>';
				var d = '<iframe width="100%" height="100%" frameborder="0" src="' + c + '"   class="tab-pane fade in " id="' + a + '"></iframe>';
				indexTab.append(e);
				$("#iframeBox").append(d);
				indexTab.find('a[href="#' + a + '"]').tab("show");
				if(cssNum(fa).sumLi > (cssNum(fa).widthX * 4 / 5)) {
					autoWidthNav.tabMove(-cssNum(fa).sumLi + cssNum(fa).btnWidth + (cssNum(fa).widthX / 2))
				}
				indexTab.on("click", "a", function(h) {
					h.preventDefault();
					$(this).tab("show")
				});
				indexTab.find("a").on("click", ".fa-remove", function(h) {
					h.preventDefault();
					$(this).parents().remove("li");
					$("iframe").remove($(this).parents("a").attr("href"));
					indexTab.find("a:last").tab("show");
					if(cssNum(fa).sumLi > (cssNum(fa).widthX * 3 / 4)) {
						autoWidthNav.tabMove(-cssNum(fa).sumLi + cssNum(fa).btnWidth + (cssNum(fa).widthX / 2))
					} else {
						autoWidthNav.tabMove(cssNum(fa).btnWidth)
					}
				})
			}
		}
	})
}
/*
 * 功能：设置地址
 * 创建人：liql
 * 创建时间：2017-1-10
 */
function SetUrlLink(a, c, param) {
	if(a != undefined) {
		var d = a.replace(/\-/g, "/")
	}
	$("#iframeBox", top.document).find(".tab-pane").each(function() {
		if(!$(this).hasClass('active')) {
			if($(this).attr("id") == a) {
				$("#indexTab", top.document).find('a[href="#' + a + '"]').parent().remove();
				$(this).remove();
				if(cssNum(fa).sumLi > cssNum(fa).widthX) {
					autoWidthNav.tabMove(-cssNum(fa).sumActiveLi + cssNum(fa).btnWidth)
				}
			}
		}

		return false
	});
	//	var srcR = $("#iframeBox", top.document).find(".tab-pane.fade.active").attr('src');
	//	var idR = $("#iframeBox", top.document).find(".tab-pane.fade.active").attr('id');
	//	var isFind = false;
	//	$("#iframeBox", top.document).find('iframe').each(function() {
	//		if($(this).attr('src') === srcR && $(this).attr('id') === idR) {
	//			isFind = true;
	//			$(this).addClass('active');
	//		}
	//	});
	//	if(!isFind) {
	$("#iframeBox", top.document).find(".tab-pane.active").attr("id", a);
	//	}
	//	$("#iframeBox", top.document).find(".tab-pane.fade.active").attr("id", a);
	//	var param = $(this).attr('data-param');
	param = param == null || param == undefined ? '' : param;
	location.href = customHost + d + ".html" + param;
	var b = '<a  href="#' + a + '">' + c + ' <i class="fa fa-remove"></i></a>';
	$("#indexTab", top.document).find("li.active").html(b);
	if(cssNum(fa).sumLi > cssNum(fa).widthX) {
		autoWidthNav.tabMove(-cssNum(fa).sumActiveLi + cssNum(fa).btnWidth)
	}
};
/*
 * 功能：调转事件
 */
function AgainRegisterClick(a1, c1) {
	$(".jump").on("click", function() {
		//		var a = $(this).attr("data-pageName");
		//		var c = $(this).attr("data-pageNameZh");
		//var param = $(this).attr('data-param');
		SetUrlLink($(this).attr("data-pageName"), $(this).attr("data-pageNameZh"), $(this).attr('data-param'));
	});
	if(a1 != undefined && a1 != null && a1 != '') {
		SetUrlLink(a1, c1);
	}
};

AgainRegisterClick();

btnGroupText();

function btnGroupText() {
	$(".btn-group").find(".dropdown-menu[role=menu]").on("click", "li", function() {
		var a = $(this).text();
		$(this).parent().prevAll("button:first-child").text(a)
	})
}
popControl();

function popControl() {
	$(document).on("click", "button", function() {
		var a = $(this).attr("data-pop");
		if(a != undefined) {
			$("section.pop[data-pop=" + a + "]").show();
			HideSlider();
			if(a == "close") {
				$(this).parents("section.pop").first().hide();
				ShowSlider()
			}
		}
	})
}

function HideSlider() {
	$("html:not(.pop)").css({
		"overflow-y": "hidden"
	})
}

function ShowSlider() {
	$("html:not(.pop)").css({
		"overflow-y": ""
	})
}
var autoWidthNav = {
	tabMove: function(a) {
		indexTab.animate({
			left: a + "px"
		})
	},
	autoMove: function() {
		$(".moreNav").on("click", function() {
			var f = $(this).attr("data-nav");
			var b = parseInt(indexTab.css("left").replace(/px/g, ""));
			var d = cssNum(fa).widthX / 2;
			if((b != cssNum(fa).btnWidth) || (cssNum(fa).sumLi > (cssNum(fa).widthX - cssNum(fa).btnWidth * 2))) {
				switch(f) {
					case "right":
						var a = b - d;
						var c = Math.abs(b) + cssNum(fa).widthX - cssNum(fa).btnWidth;
						if(c < cssNum(fa).sumLi) {
							autoWidthNav.tabMove(a)
						} else {
							noMore()
						}
						break;
					case "left":
						var e = b - (-d);
						if(e < cssNum(fa).btnWidth) {
							autoWidthNav.tabMove(e)
						} else {
							if(b == cssNum(fa).btnWidth) {
								noMore()
							} else {
								autoWidthNav.tabMove(cssNum(fa).btnWidth)
							}
						}
						break;
					default:
						break
				}
			} else {
				noMore()
			}
		})
	}
};
autoWidthNav.autoMove();

function noMore() {
	var a = ["再使点劲！", "我都到家了！", "厉害了我的哥！", "没用的！", "再来，再来！", "你点啥！"];
	$(".noMore").find("p").text(a[Math.floor(Math.random() * a.length)]);
	$(".noMore").fadeIn(300);
	setTimeout(function() {
		$(".noMore").fadeOut(100)
	}, 500)
};