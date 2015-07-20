 var myTool = require("myTool");
	var o = {};

	o.bindClick2editor = function (targetDom,param) {
		 
		targetDom.on("click", function (e) {
			if(param.on){
			var ele = e.target;
			var type = ele.getAttribute("t");
			if (type) {
				var txt = ' &nbsp<input reg_type="' + type + '" type="button" class="mis-btn mis-btn02 mis-btn-operator j_editprOperator" value="' + type + '" />&nbsp ' ;
				//o.cursorPosition.add(editor, rangeData, txt);
				o.insertHTML(param,txt);
			}
			}
		});
	}
	//当光标位置改变时候执行
	function onselectionchange(event,ifr_win) {
		var e = event || window.event;
		if (!e.keyCode)
			e.keyCode = e.which;
		//方向键移动光标,获取光标位置的dom
		if ((e.keyCode >= 37 && e.keyCode <= 40) || e.type == "click") {
			var range = getRange(ifr_win);
			node = range.node; //获取光标位置元素
			//console.log(range);
			if (node !== null) {
				while (node.nodeType != 1) {
					node = node.parentNode;
				}

			}
		}
		return range;
	}

	function getRange(ifr_win) {
		var range = window.getSelection ? ifr_win.getSelection() : ifr_win.document.selection;
		if (!range) {
			return {
				node : null,
				range : null,
				text : null
			};
		}
		range = range.createRange ? range.createRange() : range.getRangeAt(0);
		var text = window.getSelection ? range : range.text;
		var rangeNode = null;
		if (range.commonAncestorContainer) {
			rangeNode = range.commonAncestorContainer;
		} else {
			if (range.parentElement) {
				rangeNode = range.parentElement();
			}
		}
		return {
			node : rangeNode,
			range : range,
			text : text
		}
	}
	o.createEditor = function (param) {
		var iframe = document.createElement('iframe');
		//
		iframe.frameBorder =0;
		iframe.scrolling ="auto";
		iframe.width ="100%";
		iframe.height = 200;
		param.editorBox.appendChild(iframe);
		var ifr_win = iframe.contentWindow;
		var ifr_doc = ifr_win.document;
		var iframeDocument = iframe.contentDocument;
		var editorContent = ' ';
		ifr_doc.designMode = 'On'; //可编辑
		ifr_doc.contentEditable = true;
		ifr_doc.open();
		ifr_doc.writeln('<html><head> <link rel="stylesheet" href="/static/css/common_0affcdf.css"/><style>body{background:#fff;padding:10px;} .mis-btn-operator,.mis-btn-editor{margin:0 15px 10px; cursor: default; }  .mis-btn-editor{background:#e3e3e3;color:#000;}</style> </head><body>' + editorContent + '</body></html>');
		ifr_doc.close();
		//绑定事件
		ifr_doc.addEventListener("selectionchange", function (e) {
			param.range = onselectionchange(e,ifr_win);
		}, true);
		ifr_doc.addEventListener("click", function (e) {
			param.range = onselectionchange(e,ifr_win);
		}, true);
		ifr_doc.addEventListener("keydown", function (e) {
			param.range = onselectionchange(e,ifr_win);
		}, true);
		param.iframe = iframe;
		param.DOM = iframeDocument;
		 
		deleteNodeEditor(param);
		return param;
	}
	o.insertHTML=function(param, html) {
		var iframe = param.iframe;
		iframe.contentWindow.focus();
		var iframeDocument =param.DOM;
		var selection = iframe.contentWindow.getSelection();
		var range;
		if (selection) {
			range = selection.getRangeAt(0);
		} else {
			range = iframeDocument.createRange();
		}
		var oFragment = range.createContextualFragment(html),
		oLastNode = oFragment.lastChild;
		range.insertNode(oFragment);
		range.setEndAfter(oLastNode);
		range.setStartAfter(oLastNode);
		selection.removeAllRanges(); //清除选择
		selection.addRange(range);
	}
	o.deleteHTML=function(param, ele) {
		 //删除富文本的某个元素
		 var dom = param.DOM;		 
		 var node = dom.querySelector("input[reg_id='"+ele.getAttribute("c")+"']");
		  if(node && node.parentNode && node.tagName !=  'BODY'){
			node.parentNode.removeChild(node);
		}
	}
	
	o.getSQL = function (html) {
		var range = document.createRange();
		var oFragment = range.createContextualFragment(html);		 
		var node = oFragment.querySelectorAll(".j_editprBtnField");
		for (var i = 0; i < node.length; i++) {
			var item = node[i];
			if (item &&item.parentNode && item.tagName != 'BODY') {
				var reg_id = item.getAttribute("reg_id").split("__")[1];
				var textnode = document.createTextNode(reg_id);
			 
				item.parentNode.replaceChild(textnode,item);
			}
		}
		//替换运算符,  .j_editprOperator
		  node = oFragment.querySelectorAll(".j_editprOperator");
		for (var i = 0; i < node.length; i++) {
			var item = node[i];
			if (item && item.parentNode && item.tagName != 'BODY') {
				var reg_type = item.getAttribute("reg_type");
				var textnode = document.createTextNode(reg_type);				 
				item.parentNode.replaceChild(textnode, item);
			}
		}
		
		var s =oFragment.textContent;
		s = s.replace(/(&nbsp|\s)/g," ");
		return s;
	}
	o.getField = function (html, data) {
		var field = [];
		var range = document.createRange();
		var oFragment = range.createContextualFragment(html);
		//oFragment.textContent="";
		var node = oFragment.querySelectorAll(".j_editprBtnField");
		for (var i = 0; i < node.length; i++) {
			var ele = node[i];
			if (ele) {
				var reg_id = ele.getAttribute("reg_id");
				var t = {};
				var d = data.allMenuData[reg_id];
				t.tagname = d.name;
				t.scope = d.scope;
				t.valuetype = d.valuetype;
				t.chsname = d.chsname;

				var prev = ele.previousElementSibling;
				if (prev && prev.tagName.toLowerCase() === "input") {
					var reg_type = prev.getAttribute("reg_type");
					if (reg_type) {
						t.operation = reg_type;
					}
				}
				field.push(t);
			}
		}
		return field;
	}
	function deleteNodeEditor(param) { //param.doc,param.deleteFunc
		var observer;
		try {
		
			observer = new(window.MutationObserver ||
					window.WebKitMutationObserver)(function (mutationRecord,
						observer) {
					mutationRecord.forEach(function (mutation) {						 
							param.nodeRecordFunc(mutation);
					})
				});
				var body = param.iframe.contentDocument.body;
			observer.observe(body, {
				attributes : true,
				childList : true
			});
		} catch (ex) {}

	}
 module.exports=o;
