//define(["jquery"], function ($) {
//define("myTool",  function(require, exports, module){	
	//一些简单的js的效果和功能
	var o = {};
	var DOM = document;
	o.ajaxURL = "/mis/commonsearch/";
	o.LXdropdown = function (jdom, targetDom) {
		var timeNum = 0;
		jdom.bind("mouseenter", function () {
			targetDom.removeClass("hide");
		}).bind("mouseleave", function () {
			timeNum = setTimeout(function () {
					targetDom.addClass("hide")
				}, 1000);
		});
		targetDom.bind("mouseenter", function () {
			targetDom.removeClass("hide");
			clearTimeout(timeNum);
		}).bind("mouseleave", function () {
			timeNum = setTimeout(function () {
					targetDom.addClass("hide")
				}, 1000);
		});
	}
	o.getURLSearch = function (key) {
		var search = location.search.length > 1 ? location.search.slice(1) : "";
		var a = search.split("&");
		var q = {};
		for (var i = 0; i < a.length; i++) {
			var p = a[i].split("=");
			q[p[0]] = decodeURIComponent(p[1]) || undefined;
		}
		return q[key] || undefined;
	}
	o.slideNavTree = function (slideBtn, targetDom, slideClass, targetClass) {
		var isHide = 0;
		slideBtn.bind("click", function (e) {
			if (isHide) {
				//展开
				slideBtn.removeClass(slideClass).attr("title", "收起");
				targetDom.removeClass(targetClass);
				slideBtn.data("isHide", "0");
			} else {
				slideBtn.addClass(slideClass).attr("title", "展开");
				targetDom.addClass(targetClass);
				slideBtn.data("isHide", "1");
			}
			isHide = isHide == 0 ? 1 : 0;
			e.stopPropagation();
			return false;
		});
	}
	o.getUrlHash = function () {
		var hash = location.hash;
		if (hash) {
			hash = hash.slice(1);
		}
		return decodeURIComponent(hash);
	}
	//获取日期 {Y:0,M:0,D:0}
	o.getDate = function (param) {
		//暂时实现了按天获取的方法
		var now = new Date();
		var t = now.getTime();
		var D_time = 24 * 60 * 60 * 1000;
		if (param.D) {
			t = t + D_time * param.D;
		}
		now.setTime(t);
		var Y = now.getFullYear();
		var M = now.getMonth() - 0 + 1;
		var D = now.getDate();
		return Y + "-" + M + "-" + D;
	}
	//@param
	//targetDom,targetClass,sliderDom,sliderClass
	o.sliderDown = function (param) {
		var tar = param.targetDom;
		var slider = param.sliderDom;
		tar.bind("click", function () {
			if (tar.data["isSlider"] && tar.data["isSlider"] == 1) {
				//
				tar.data["isSlider"] = 0;
				slider.removeClass(param.sliderClass);
				tar.removeClass(param.targetClass);
			} else {
				tar.data["isSlider"] = 1;
				slider.addClass(param.sliderClass);
				tar.addClass(param.targetClass);
			}
		});
	}
	o.createGridviewHeader = function (data, tag) {
		var html = "";
		var tag = tag || "th";
		for (var i = 0; i < data.length; i++) {
			var d = data[i];
			var className = d.className ? d.className : "th-title01";
			var h = d.txt ? d.txt : d;
			var attrTxt = "";
			if (d.attr) {
				var attr = d.attr;
				for (var n = 0; n < attr.length; n++) {
					var a = attr[n];
					attrTxt += a.k + '=' + a.v + ' ';
				}
			}
			html += '<' + tag + ' class="' + className + '"' + attrTxt + '>' + h + '</' + tag + '>';
		}
		return html;
	}
	//弹窗的相关方法
	o.popupOpen = function (jdom, callback) {

		if (callback && typeof callback === "function") {
			callback();
		}
		jdom.removeClass("hide");
	}
	o.popupClose = function (jdom, callback) {

		if (callback && typeof callback === "function") {
			callback();
		}
		jdom.addClass("hide");
	}
	o.popup = function (param) {
		var popupDom = param.dom;
		//param={init,close,save,cancel,dom};
		if (param.close && typeof param.close === "object") {
			var closeObj = param.close;
			closeObj.dom.on("click", function () {
				o.popupClose(popupDom, closeObj.callback);
			});
		}
		if (param.save && typeof param.save === "object") {
			var saveObj = param.save;
			saveObj.dom.on("click", function () {
				if (saveObj.callback && typeof saveObj.callback == "function") {
					saveObj.callback();
				}
			})
		}
		if (param.cancel && typeof param.cancel === "object") {
			var cancelObj = param.cancel;
			cancelObj.dom.on("click", function () {
				o.popupClose(popupDom, cancelObj.callback);
			});
		}
	}
	//param ={dom,domArray,callback}
	//["unactiveGridViewBox","activeGridViewBox","regGridViewBox"]
	//callback.unactiveGridViewBox=function(){}
	o.myTab = function (param) {
		var activeClass = param.tabClass || "mis-tab-active";
		var tabTargetDom = {};
		for (var i = 0; i < param.domArray.length; i++) {
			tabTargetDom[param.domArray[i]] = $("#" + param.domArray[i]);
		}
		param.dom.on("click", function (event) {
			var target = event.target;
			var id = target.getAttribute("for");
			if (id) {
				param.dom.find("." + activeClass).removeClass(activeClass);
				$(target).addClass(activeClass);
				var id = target.getAttribute("for");
				for (var k in tabTargetDom) {
					if (tabTargetDom[k][0]) {
						tabTargetDom[k].addClass("hide");
					}
				}
				tabTargetDom[id].removeClass("hide");
				if (param.callback && param.callback[id] && typeof param.callback[id] === "function") {
					param.callback[id]();
				}

			}
		});
	}
	//修改密码的相关操作
	updatePwd();
	function updatePwd() {
		//
		var popupPwd = $("#misPopupPwd");
		var updatePwdBtn = $("#updatePwd");
		var pwd1 = $("#passowrd1");
		var pwd2 = $("#passowrd2");
		updatePwdBtn.on("click", function () {
			o.popupOpen(popupPwd);
		});
		popupInit();
		function popupInit() {
			var isSending = 0;
			var p = {};
			p.dom = popupPwd;
			p.close = {};
			p.close.dom = $("#misPwdPopupClose");
			p.close.callback = function () {
				pwd1.val("");
				pwd2.val("");
			}
			p.save = {};
			p.save.dom = $("#pwdSaveBtn");
			p.save.callback = function () {
				//
				if (pwd1.val().length < 8) {
					alert("密码长度不能小于8位");
					return false;
				}
				if (pwd1.val() !== pwd2.val()) {
					alert("两次密码不一致");
					return false;
				}
				if (isSending === 0) {
					isSending = 1;
					$.post("/mis/usermanage/change_password", {
						pwd : pwd1.val()
					}, function (serverData) {
						isSending = 0;
						if (serverData && serverData.errno == 0) {
							alert("修改密码成功");
							o.popupClose(popupPwd);
							location.replace("/mis/usermanage/exit_system");
						} else {
							alert(serverData.errmsg || "修改密码失败");
						}
					}, "json").error(function () {
						isSending = 0;
						alert("修改密码失败");
					});
				}
			}
			o.popup(p);
		}
	}
	//点击一个元素显示or隐藏另外某个元素,param={dom,target}
	o.toggle = function (param) {
		var p = {};
		p.self = {
			dom : param.dom,
			className : ""
		};
		p.target = {
			dom : param.target,
			className : "hide"
		};
		o.toggleTargetDom(p);
	}
	//点击一个元素，给另外一个元素增加或者删除某个样式
	//param={self,target}
	o.toggleTargetDom = function (param) {
		var self = param.self;
		self.dom.on("click", function () {
			var target = param.target;
			target.dom = target.dom || $("#" + this.getAttribute("for"));
			if (!self.dom.attr("isToggle") || self.dom.attr("isToggle") === '0') {
				target.dom.addClass(target.className);
				self.dom.addClass(self.className);
				self.dom.attr("isToggle", 1);

			} else {
				self.dom.attr("isToggle", 0);
				target.dom.removeClass(target.className);
				self.dom.removeClass(self.className);
			}
		});
	}
	//深度复制的方法
	o.deepClone = function (parent, child) {
		var i,
		toStr = Object.prototype.toString,
		astr = "[object Array]";
		child = child || {};
		for (i in parent) {
			if (parent.hasOwnProperty(i)) {
				if (typeof parent[i] === "object") {
					child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
					o.deepClone(parent[i], child[i]);
				} else {
					child[i] = parent[i];
				}
			}
		}
		return child;
	}
	//给数字加千分位符号,
	o.formatNumberThou = function (num) {
		var n = num.toString();
		//判断是否是小数
		if (n.indexOf(".")) {
			n = n.split(".");
		} else {
			n = [n];
		}
		n[0] = n[0].replace(/(\d+?)(?=(?:(\d{3}))+$)/g, function (a) {
				return a + ',';
			});
		return n.join(".");
	}
	//增加百分号,length为保留小数点后面几位
	o.addPercent = function (num, length) {
		var n = (num - 0) * 100;
		if (length) {
			// n=n.toFixed(length);
			//不能用toFixed，会出现四舍五入，直接正则替换
			n = n.toString();
			var reg = new RegExp('([0-9]+\.[0-9]{1,' + length + '})');
			var r = n.match(reg);
			if (r && r[1]) {
				n = n.match(reg)[1];
			} else {
				//console.log(n);某些整数
				n = n + ".00";
			}
		}
		return n + "%";
	}
	o.ajax = function (param) {
		//param={url,data,success,type,error}
		var xhr = new XMLHttpRequest();
		xhr.addEventListener("load", function (e) {
			if (xhr.status >= 200 && xhr.status < 300) {
				try {
					var serverData = JSON.parse(xhr.responseText);
				} catch (e) {
					console.log(e);
					console.log("JSON.parse错误");
					error();
				}
				if (param.success && typeof param.success === "function") {
					param.success(serverData);
				}
			} else {
				error();
			}
		}, false);
		xhr.addEventListener("error", function (e) {
			error();
		}, false);

		function error(str) {
			console.log(xhr);
			console.log("服务器错误");
			if (param.error && typeof param.error === "function") {
				param.error(str);
			}
		}
		var url = param.url;
		
		//格式化参数
		var s = "";
		if (param.data) {
			for (var name in param.data) {
				if (param.data.hasOwnProperty(name)) {
					s += encodeURIComponent(name) + "=" + encodeURIComponent(param.data[name])+"&";
				}
			}
		}
		var type = param.type || "GET";
		type = type.toUpperCase();

		if (type === "GET") {
			url += url.indexOf("?") === -1 ? "?" : "&";
			xhr.open("GET", url + s, true);
			xhr.send();
		} else if (type == "POST") {
			xhr.open("POST", url, true);
			xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhr.send(s);
		}
		return xhr;
	}
	o.quById=function(idStr){
		return DOM.getElementById(idStr)||undefined;
	}
	o.quParents=function(ele,cssQuery){
		var p = {};
		var css
		do{
			p = ele.parentNode;
		}while(!p.contains(cssQuery)&&p.nodeName.toLowerCase()!=="body");
		return p;
	}
	//实现首列固定
	o.fixFirstCol=function (tableBox){
		if(tableBox[0]){
	    tableBox=tableBox[0];		   //若tableBox为jQuery获取的引用,转换为原生
		}
		var tables=tableBox.getElementsByTagName("table"); 		 
		var currentTable=tables[0];
		var tableNode=currentTable.cloneNode(false);  //浅复制表格节点，首列新表格
		var theadNode=currentTable.firstElementChild.cloneNode(false);    //浅复制表头节点，首列新表头
		var trs=currentTable.getElementsByTagName("TR");
		var html="";
		var trHeight=[];    //保存原来表格的行高
		for(var i=0;i<trs.length;i++){
			
			trHeight.push(trs[i].clientHeight);
			if(i==0){				
				theadNode.innerHTML='<tr>'+trs[i].firstElementChild.outerHTML+'</tr>';
			}else{
			    html+='<tr>'+trs[i].firstElementChild.outerHTML+'</tr>';
			}		
		}
		tableNode.innerHTML=html;    //创建首列表格的body
		tableNode.insertBefore(theadNode,tableNode.firstElementChild);    //插入首列的表头
		var firstColBox=document.createElement("div");    //创建首列表格的容器
		firstColBox.classList.add("colBoxLeft");
		firstColBox.appendChild(tableNode);	
		var container=document.createElement("div");    //创建包含首列容器与其余列外面的大容器
		container.appendChild(firstColBox);
		tableBox.parentNode.replaceChild(container,tableBox);
		container.appendChild(tableBox);
		tableBox.addEventListener("scroll",function(e){
			firstColBox.scrollTop=e.target.scrollTop;
		},false);    //竖直滚动条统一控制左右两栏                                
		container.classList.add("reflow-trans");
		firstColBox.style.height=$(tableBox).height()+"px";    //设置首列表格容器与原表格容器等高
		var trsfirstCol=firstColBox.getElementsByTagName("TR");    //首列每行与原表格对齐
		for (var i=0;i<trsfirstCol.length;i++) {
		    trsfirstCol[i].style.height=trHeight[i]+"px";
		}
		return tableNode;
	}
	o.loadingPopup=function(j_ele){
		var offset = j_ele.offset();
		var height=j_ele.height();
		var width=j_ele.width();
		var loadingPopupDom = $("#loadingPopup");
		if(!loadingPopupDom.length){
			$("body").append('<div id="loadingPopup" class="loading-popup hide"><div class="loading-icon-box"><i class="icon iconfont loading-icon">&#xe600;</i></div></div>');
			loadingPopupDom = $("#loadingPopup");
		}
		loadingPopupDom.css({top:offset.top,left:offset.left,height:height,width:width}).removeClass("hide");
	}
	o.loadingPopupClose=function(){
		$("#loadingPopup").addClass("hide");
	}
	module.exports=o;
	// return o;
 //});
