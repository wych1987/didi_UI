//define(["jquery","handlebars","myTool",'popupSelect'],function($,Handlebars,myTool,popupSelect){
//define(function(require){
	var myTool = require("myTool");
	var popupSelect = require("popupSelect");
	var o = {}
	var URL = "/mis/cube/get_page_info";
	var LI_HEIGHT = 50; //行高
	var filterArray = [];
   var filterStr = '<ul class="cube-list filter-list  j_cube_list">{{liItem}}<li class="bi-btn-box"><input class="button01 j_filterSubmit" type="button"  data-filter_type="submit" value="确 认"></li></ul><span class="cube-list-arrow cube-list-arrow-top j_cube_list_icon">精简模式<i class="icon iconfont j_cube_list_icon" >&#xe604;</i> </span><span class="cube-list-arrow cube-list-arrow-bottom j_cube_list_icon">详细模式<i class="icon iconfont j_cube_list_icon" >&#xe606;</i> </span></div> ';
	 
		var checkboxStr='<li class="cube-group rel"><h4 class="cube-title">{{name}}</h4><div class="cube-box ">{{#each item}}<span class="cube-item"><label class="cube-item-label"><input type="checkbox"data-filter_id="{{id}}"  data-filter_name="{{name}}"data-checkboxName="{{checkboxName}}"data-filter_type="checkbox"  class="j_filter_item"/>{{name}}</label></span>{{/each}} <span class="icon-font-arrow icon-font-top j_font_arrow">收起<i data-filter_id="{{id}}"  class="icon iconfont j_font_arrow" >&#xe604;</i> </span><span class="icon-font-arrow icon-font-bottom      j_font_arrow">展开<i data-filter_id="{{id}}"  class="icon iconfont j_font_arrow" >&#xe606;</i></span> </div></li>';
		var selectStr='<li class="cube-group rel"><h4 class="cube-title">{{name}}</h4><div class="cube-box "> <span class="cube-item"><label class="cube-item-label">{{name}}<select class="mis-select mis-select-filter j_filter_item" data-filter_id={{id}} data-filter_type="select" >{{#each item}}<option value="{{id}}">{{name}}</option>{{/each}}</select></label></span> <span class="icon-font-arrow icon-font-top j_font_arrow">收起<i data-filter_id="{{id}}"  class="icon iconfont j_font_arrow" >&#xe604;</i> </span><span class="icon-font-arrow icon-font-bottom      j_font_arrow">展开<i data-filter_id="{{id}}"  class="icon iconfont j_font_arrow" >&#xe606;</i></span> </div></li>';
		var select2Str='<li class="cube-group rel"><h4 class="cube-title">{{name}}</h4><div class="cube-box "> <span class="cube-item"><label class="cube-item-label">{{name}}<select class="mis-select mis-select-filter j_filter_item" data-filter_id={{id}} data-filter_type="select2" data-filter_c={{toId}}>{{#each item}}<option value="{{id}}">{{name}}</option>{{/each}}</select></label></span> <span class="cube-item"><label class="cube-item-label">{{toName}}<select class="mis-select mis-select-filter j_filter_item" data-filter_id={{toId}} data-p_select={{id}} data-filter_type="select">{{#each childItem}}<option value="{{id}}">{{name}}</option>{{/each}}</select></label></span><span class="icon-font-arrow icon-font-top j_font_arrow">收起<i data-filter_id="{{id}}"  class="icon iconfont j_font_arrow" >&#xe604;</i> </span><span class="icon-font-arrow icon-font-bottom      j_font_arrow">展开<i data-filter_id="{{id}}"  class="icon iconfont j_font_arrow" >&#xe606;</i></span> </div></li>';
		var popupSelectStr = '<li class="cube-group rel">'+
		'<h4 class="cube-title">{{name}}</h4><div class="cube-box "> <span class="cube-item"><label class="cube-item-label">{{name}}'+
		'<input type="text" data-filter_id={{id}} data-filter_type="popup" class="input-popup mis-input ui-autocomplete-input cube-input  j_popupSelect"/></label></span><span class="icon-font-arrow icon-font-top j_font_arrow">收起<i data-filter_id="{{id}}"  class="icon iconfont j_font_arrow" >&#xe604;</i> </span><span class="icon-font-arrow icon-font-bottom      j_font_arrow">展开<i data-filter_id="{{id}}"  class="icon iconfont j_font_arrow" >&#xe606;</i></span> </div></li>';
	var filterTpl={};
		filterTpl.checkbox=Handlebars.compile(checkboxStr);
		filterTpl.select=Handlebars.compile(selectStr);
		filterTpl.select2=Handlebars.compile(select2Str);
		filterTpl.popupSelect=Handlebars.compile(popupSelectStr);
		
		
	o.init=function(param){
		  createFilterContent(param);
		  filterArray.push(param);
		 return param;
	}
	o.getFilterData = function (param) {
		var p = {};
		var list = param.filterList;
		for (var i = 0; i < list.length; i++) {
			var d = list[i];
			var type = d.getAttribute("data-filter_type");
			switch (type) {
			case "checkbox":
				p = getCheckBoxData(d, p);
				break;
			case "select":
				p = getSelectEleData(d, p);
				break;
			case "select2":
				p = getSelectEleData(d, p);
				break;
			default:
				break;
			}
		}
		//popupSelect的数据
		param.popupSelect.elements.forEach(function (v, i, target) {
			var value = v.getValue();
			var v_id = v.inputDom.getAttribute("data-filter_id");
			if (value.all.length) {
				p[v_id] = p[v_id] || [];
				p[v_id] = p[v_id].concat(value.all);
			}
		});
		return p;
	}
	//是否显示展开收起按钮,需要ele节点填充完毕而且不隐藏的时候调用
	o.toggleOneLine=function(ele){//ele为li的父级元素
		addIconArrowClass(ele);
	}
	function createFilterContent(param){
		var select2={};
		var popupSelectObj={};
			popupSelectObj.data={};
			popupSelectObj.elements=[];
			
		var data = param.data;
		var domBox=param.box;
			var div = document.createElement("div");
			div.className="cube-list-toggle rel";
			div.setAttribute("data-filter_index",filterArray.length);
			var html =filterStr.replace("{{liItem}}",filterItemTpl(data,select2,popupSelectObj));
			div.innerHTML=html;
			domBox.appendChild(div);
			param.div=div;
			var list = div.getElementsByClassName("j_filter_item");
			//data[d].cityInput=div.querySelector(".j_cityInput");//城市输入框 
			param.select2=select2;
			param.filterList=list;
			//获取popupSelect的input
			 bindPopupEle(div,popupSelectObj);
			 param.popupSelect=popupSelectObj;
			param.submitBtn=div.querySelector(".j_filterSubmit");
			bindClick(param);
	}
	function filterItemTpl(data,select2,popupSelectObj){
		var html = "";
		data.forEach(function(v,i){
			if(v.type&&filterTpl[v.type]){
				switch(v.type){
					case "select2":
					formatSelect2Data(v,select2);
					break;
					case "checkbox":					
					formatCheckBoxData(v,popupSelectObj);
					break;
					default:
					break;
				}
				/*
				if(v.type=="select2"){
					//级联菜单
					formatSelect2Data(v,select2);
				}else if(v.type=="checkbox"){
					//复选框
					formatCheckBoxData(v);
				}
				*/
				html+=filterTpl[v.type](v);
			}
		});
		return html;
	}
	function formatSelect2Data(data,select2){
		select2[data.id]={};
		
		data.item.forEach(function(v,i){
			select2[data.id][v.id]=v.item;
		});
		 data.childItem=data.item[0].item;
	}
	function formatCheckBoxData(data, popupSelectObj) {
		var name = data.id;

		data.item.forEach(function (v, i, a) {
			a[i].checkboxName = name;
		});
		//判断length，>10则切换成popupSelect控件
		if (data.item && data.item.length > 10) {
			data.type = "popupSelect";
			popupSelectObj.data[name] = myTool.deepClone(data.item,[]);
		}
	}
	function bindPopupEle(div, popupSelectObj) {
		var ele = div.getElementsByClassName("j_popupSelect");
		if (ele) {
			for (var i = 0; i < ele.length; i++) {
				var key = ele[i].getAttribute("data-filter_id");
				var p = {}
				p.input = ele[i];
				//p.keys={parentId:key};
				p.data = formatData2popupData(popupSelectObj.data[key]);
				p.tplName="oneItemTpl";
				popupSelectObj.elements.push(popupSelect.init(p));
			}
		}
	}
	function formatData2popupData(data){
		//格式化数据转换成popupData需要的格式,主要是提取出全部，到父节点
		//var p = {};
		//p.item=[];
		var item=[];
			if(data&&data.length){
				data.forEach(function(v){
					/*if(v.name==="全部"){
						p.name="全部";
						p.id=v.id;
					}else{
						p.item.push(v);
					}
					*/
					item.push(v);
				})
			}
			return item;
	}
	function addIconArrowClass(div){
		//判断li的高度确定是否显示arrow 
		var li = div.querySelectorAll("li");
		for(var i = 0; i <li.length;i++){
			if(li[i].offsetHeight>LI_HEIGHT&&li[i].querySelector(".j_filter_item")){
				li[i].setAttribute("data-height",li[i].offsetHeight)
				li[i].classList.add("cube-li-hide");			
			}
		}
	}
	function bindClick(param){
		var divBox=param.div;
		var ulBox=divBox.querySelector(".j_cube_list");//存放维度的ul 
		ulBox.addEventListener("click", function (e) {
			var ele = e.target;
			var nodeName = ele.nodeName.toLowerCase();
			if (nodeName === "input") {
				var type = ele.getAttribute("data-filter_type");
				switch (type) {
				case "text":
					 //输入框
					break;
				case "checkbox":
					//单选框的点击
					checkedEvent(ele);
					break;
				case "select":
					//复选框点击
					//checkedEvent(ele);
					break;
				case "select2":
					//级联复选框点击
					//select2Event(param,ele);
					break;
					
				case "submit":
					//确认按钮
					//收起选择框
					//divBox.classList.remove("cube-list-toggle");
					var p = o.getFilterData(param);
					if(param.submitCallback&&typeof param.submitCallback==="function"){
						param.submitCallback(p);
					}
					break;
				default:
					break;
				}
			} else if (ele.classList.contains("j_font_arrow")) {
				//li展开收起 
				var p = ele.parentNode;
				while (p.nodeName.toLowerCase() !== "li"&&p.nodeName.toLowerCase() !== "body") {
					p = p.parentNode;
				}
				p.classList.toggle("cube-li-show");				
				var h = p.getAttribute("data-height");
				p.classList.contains("cube-li-show")?p.style.height=h+"px":p.style.cssText="";
				 
			}
		}, false);
		divBox.addEventListener("click", function (e) {
			var ele = e.target;
			var nodeName = ele.nodeName.toLowerCase();
			if(ele.classList.contains("j_cube_list_icon")){
				//ul的精简和详细模式点击
				this.classList.toggle("cube-list-toggle");
			}
		},false);
	ulBox.addEventListener("change", function (e) {
		var ele = e.target;
		 var t = ele.getAttribute("data-filter_type");
		 if(t=="select2"){
			select2Event(param,ele);
		 }
	}, true)
	}
	function checkedEvent(ele) {
		var checkedClass='input-checked';
		if(ele.checked) {
			//添加class
			 ele.parentNode.classList.add(checkedClass);
		}else {
			//移除class
			 ele.parentNode.classList.remove(checkedClass);
		}
	}
	 function select2Event(param,ele){
		 var id = ele.value;
		 var k = ele.getAttribute("data-filter_id");
		 var d = param.select2[k][id];
		  var toSelect=param.div.querySelector("select[data-p_select='"+k+"']");
		  if(toSelect){
			toSelect.innerHTML=createOption(d);
		  }
	 }
	 function createOption(data){
		var h = "";
		data.forEach(function(v,i){
			h+='<option value="'+v.id+'">'+v.name+'</option>';
		});
		return h;
	 }
	
	function getCheckBoxData(ele,p){
		if(ele.checked){
			var name = ele.getAttribute("data-checkboxname");
			var id = ele.getAttribute("data-filter_id");
			p[name]=p[name]||[];
			p[name].push(id);
		}
		return p;
	}
	function getSelectEleData(ele,p){
		var name = ele.getAttribute("data-filter_id");
		var v = ele.value;
		p[name]=v;
		return p;
	}
	module.exports=o;
    // return o;
// });