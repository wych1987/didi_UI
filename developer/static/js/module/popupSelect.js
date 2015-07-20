//define(["jquery","handlebars","myTool","myAutoComplate"],function($,Handlebars,myTool,autoComplate){
//define("popupSelect",  function(require, exports, module){
 var myTool=require("myTool");
  var autoComplate=require("myAutoComplate");	
  var o = {};
	var popupQueue=[];
	var document = window.document;
	var body = document.getElementsByTagName("body")[0];
   
	//popup的模版
	//var popupBoxHTML='
	//有父子结构的popup
	 var tplCheckboxStr='{{#each this}}<div class="city-box j_itemList">'+
	 '<div class="city-title ">'+
	 '<label data_type="arrow" title="{{title}}">'+
	 '<input type="checkbox" class="mis-checkbox j_popupAuto"   data_type="checkbox_title" value="{{id}}" data_name="{{name}}"/><span>{{name}}</span>'+
	 '</label>'+
	 '{{#if item.length}}<i class="icon-arrow02 right" data_type="arrow"></i>{{/if}}'+
	 '</div>'+
	 '{{#if item.length}}'+
	 '<div class="city-list  auto-itemBox j_itemBox">'+
	 '{{#each item}}'+
	 '<div class="city-item">'+
	 '<label title="{{title}}"><input  type="checkbox" class="mis-checkbox j_itemEle"  data_type="item"  value="{{id}}" data_name="{{name}}"/><span>{{name}}</span></label>'+
	 '</div>'+
	 '{{/each}}'+
	 '</div>'+
	 '{{/if}}'+
	 '</div>'+
	 //'{{/if}}'+
	 '{{/each}}';
	// var tplCheckbox = Handlebars.compile(tplCheckboxStr);
	 
	 
	 //只有一层结构的popup,平铺所有元素
	  var oneItemTpl='<div class="city-box j_itemList">'+
	 '<div class="city-list  j_itemBox">'+
	 '{{#each this}}'+
	 '<div class="city-item">'+
	 '<label title="{{title}}"><input  type="checkbox" class="mis-checkbox j_itemEle"  data_type="item"  value="{{id}}" data_name="{{name}}"/><span>{{name}}</span></label>'+
	 '</div>'+
	 '{{/each}}'+
	 '</div>'+
	 '</div>';
	// var tplOneEleTpl=Handlebars.compile(tplOneEleStr);
	//有父子结构的popup radio
	 var tplRadioboxStr='{{#each this}}<div class="city-box j_itemList">'+
	 '<div class="city-title ">'+
	 '<label data_type="arrow" title="{{title}}">'+
	 '{{name}}'+
	 '</label>'+
	 '{{#if item.length}}<i class="icon-arrow02 right" data_type="arrow"></i>{{/if}}'+
	 '</div>'+
	 '{{#if item.length}}'+
	 '<div class="city-list  auto-itemBox j_itemBox">'+
	 '{{#each item}}'+
	 '<div class="city-item">'+
	 '<label title="{{title}}"><input  type="radio" class="mis-checkbox j_itemEle"  data_type="item"  value="{{id}}" data_name="{{name}}" name="{{input_name}}"/><span>{{name}}</span></label>'+
	 '</div>'+
	 '{{/each}}'+
	 '</div>'+
	 '{{/if}}'+
	 '</div>'+
	 //'{{/if}}'+
	 '{{/each}}';
	 //初始化对象
	 var tplArray={
		 oneItemTpl:oneItemTpl,
		 tplCheckboxStr:tplCheckboxStr,
		 tplRadioboxStr:tplRadioboxStr
	 }
	function init(param) {
		/*
		param 参数格式如下
		var p = {};
		p.data = serverData.data;
		p.input=//ele对象
		p.keys = {
		"id" : "channel_id",
		"name" : "channel_name",
		"parentId" : inputDom.getAttribute("data-dim_id"),
		"childKey" : "dim_id",
		"tplKey":"oneItemTpl"//这个参数来控制用哪个tpl
		};
		p.oneEleTpl://0||1
		 */
		var popupAuto = {};
		param.keys=param.keys||{ };
		popupAuto.keys = param.keys;  
		popupAuto.keys.id = param.keys.id||"id";  
		popupAuto.keys.name = param.keys.name||"name";  
		
		popupAuto.okCallback = param.okCallback;
		popupAuto.input = $(param.input);
		popupAuto.inputDom = param.input;
		popupAuto.tplFunc = formatTpl(param.keys,param.tplName);
		popupBindFunc(popupAuto); //popupAuto对象绑定一些方法
		popupAuto.div = createEleByData(param.data, popupAuto);
		switch(param.tplName){
			case "tplRadioboxStr":
			var queryStr="input[type='radio']";
			break;
			default:
			var queryStr="input[type='checkbox']";
			break;
		}
		popupAuto.selectDom = Array.prototype.slice.apply(popupAuto.div.querySelectorAll(queryStr));
		
		//格式化数据
		popupAuto.data = {};
		popupAuto.data = formatData(param.data, param.keys);
		//console.log(popupAuto.data.names)
		bindInputEvent(popupAuto);
		autoComplate.bind(popupAuto.input, popupAuto.data.autoData)
		popupQueue.push(popupAuto); //缓存所有生成的对象
		return popupAuto; //返回对象
	}
	function formatTpl(keys,tplName){
		var keys = keys||{};
		var id=keys.id? "{{"+keys.id+"}}" :"";
		var name=keys.name? "{{"+keys.name+"}}" :"";
		var title=keys.title? "{{"+keys.title+"}}" :"";
		var tpl =tplArray[tplName||PopupTplName||"tplCheckboxStr"];
		if(id){
			tpl = tpl.replace(/{{id}}/g,id);
		}
		  if(name){
			tpl = tpl.replace(/{{name}}/g,name);
		}
		  if(title){
			tpl = tpl.replace(/{{title}}/g,title);
		}
		  return Handlebars.compile(tpl);
	}
	function createEleByData(data,param) {
		//根据数据渲染模版
		var tplFunc = param.tplFunc;
		var html = tplFunc(data);
		var div = document.createElement("div");
		div.className = "mis-popup-city hide";
		div.innerHTML = '<div  class="popup-city-list">' + html + '</div><div class="popup-btn-box"><input class="mis-btn mis-btn02" data_type="okBtn" value="确定"type="button"><input class="mis-btn mis-btn02 mis-btn-cancel" data_type="cancelBtn"value="取消"type="button"></div>';
		body.appendChild(div);
		bindEvent(div,param);
		if(data.length===1){
			div.querySelector(".j_itemList").classList.add("auto-itemBox-toggle");
		}
		return div;
	}
	//给弹层绑定点击事件
	function bindEvent(ele,param) {
		var j_ele=$(ele);
		ele.addEventListener("click",function(e){
			clickEvent(e,param)
		}, false);
		mouseEvent(j_ele);
	};
	function clickEvent(e,param){
			var target = e.target;
			var type = target.getAttribute("data_type");
			var parentEle=$(target).parents(".j_itemList");
			switch (type) {
			case "item"://元素点击
				if(!target.checked){
					//查找父级如果父级被选中，则取消选中状态
					var pCheckbox=parentEle.find("[data_type='checkbox_title']")[0];
					if(pCheckbox){
						pCheckbox.checked=false;
					}
				}
				break;
			case "arrow"://箭头点击
				//展示或者隐藏item元素
				parentEle.toggleClass("auto-itemBox-toggle");
				
				break;
			case "checkbox_title"://父标题点击
					parentEle.toggleClass("auto-itemBox-toggle");
				if(target.checked){
					//子元素全部选中
					parentEle.find(".j_itemEle").each(function(){
						this.checked=true;
					});
				}else{
					//子元素全部取消
					parentEle.find(".j_itemEle").each(function(){
						this.checked=false;
					});
				}				
				break;
			case "okBtn"://okBtn 点击
				//关闭popup
				fillInputBySelect(param);
				if(param.okCallback&&typeof param.okCallback==="function"){
					param.okCallback(param.input);
				}
				//this.classList.add("hide");
				param.close();
				break;
			case "cancelBtn"://取消按钮点击
				//this.classList.add("hide");
				param.close();
				break;
			case "close"://关闭按钮点击，//暂时没有
				break;
			
			default:
				break;
			}
		}
		function mouseEvent(j_ele) {
			//鼠标leave，enter事件
			var timeNum=0;
			var t = 1000;
		 
			j_ele.bind("mouseleave", function () {
				timeNum=setTimeout(function(){					 
					j_ele.find("[data_type='cancelBtn']").trigger("click");
				},t);
			}).bind("mouseenter",function(){
				clearTimeout(timeNum);
			});
		}
		function formatData(data, keys) {
		 
			var key_id = keys.id||"id" ;
			var key_name = keys.name  
			//检测是否传送了keys.parent;keys.child
			var childKey=keys.childKey||"id";
			var parentId=keys.parentId||"id";
			//var title=keys.title||"title";
			var names = {};
			var autoData=[];
			for (var i = 0; i < data.length; i++) {
				if (typeof data[i] === "object") {
					if (data[i][key_name]) {
						var p_id=data[i][key_id];
						names[data[i][key_name]] = {v:data[i][key_id],t:"p",parentId:parentId};//parent
						autoData.push(data[i][key_name]);
						
					}
					if (data[i].item) {
						 data[i].item.forEach(function(v,n,a){
							 names[v[key_name]] = {
							 	v : v[key_id],
							 	t : "c",
							 	p_id : p_id,
							 	childKey : data[i][childKey]
							 }; //child
							 autoData.push(v[key_name]);
						 });
					}
				}
			}
			return {names:names,autoData:autoData};
		}
		function popupBindFunc(param){
			param.open=function(){
				//关闭其他对象
				closeAllPopup();
				//渲染选择条件
			 
				var selectText = param.inputDom.value;
				var s ={};
				if(selectText){
					selectText = selectText.replace(/；/g,";");
					selectText=selectText.split(";");					
					selectText.forEach(function(v){
						s[v]=1;
					});					
				}
				fillSelectByInput(param,s);
				var offset = param.input.offset();
				var top = offset.top+param.input.outerHeight()+5;
				var cssText = "left:"+offset.left+"px;top:"+top+"px;"
				param.div.style.cssText=cssText;
				param.div.classList.remove("hide");				
			}
			param.close=function(){				
				param.div.classList.add("hide");
			};
			param.getValue = function () {
				var value = {};
				value.all = [];
				value.parentValue = [];
				value.childValue = {};
				value.rela = {}; //json关联关系的结构
				var selectText = param.inputDom.value;
				 
				if (selectText) {
					selectText = selectText.split(";");
					selectText.forEach(function (v) {
						var v_s = param.data.names[v];
						if (v_s) {
							value.all.push(v_s.v);
							if (v_s.t === "p") {
								value.parentValue.push(v_s.v);
								if(param.keys&&param.keys.parentId!==undefined){
									value.parentId=param.keys.parentId;
								}
							} else if (v_s.t === "c") {
								value.childValue[v_s.childKey]=value.childValue[v_s.childKey]||[];
								value.childValue[v_s.childKey].push(v_s.v);
								var p_id = v_s.p_id;
								value.rela[p_id] = value.rela[p_id] ? value.rela[p_id] : [];
								value.rela[p_id].push(v_s.v);
							}
						}
					})
				}
				return value;
			}
		}
		function bindInputEvent(param){
			param.input.bind("click",function(e){
				//点击则打开popup
				
				param.open();
			});
			param.input.bind("keydown",function(e){
				//关闭popup，以便打开autoComplate
				param.close();
				
			});
			
		}
		function fillSelectByInput(param,data){
			param.selectDom.forEach(function(v){
				var name = v.getAttribute("data_name");
				if(data[name]){
					v.checked=true;
				}else{
					v.checked=false;
				}				
			})
		}
		function fillInputBySelect(param){
			var a ="";
			param.selectDom.forEach(function(v){
				var name = v.getAttribute("data_name");
				if(v.checked==true){
					 a+=name+";";
				} 			
			});
			param.input.val(a)
			return a;
		}
		function closeAllPopup(){
			popupQueue.forEach(function(v){
				if(v.close&&typeof v.close==="function"){
					v.close();
				}
			})
		}
		
		//对外接口
	o.init = init;
	o.closeAll=closeAllPopup;
	module.exports=o;
    // return o;
 //});