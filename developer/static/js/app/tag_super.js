//define(["jquery","handlebars",'cascMenu_super',"myTool","popupCity","tag_popup","tag_editor"],function($,Handlebars,cascMenu,myTool,popupCity,tag_popup,tag_editor){
	
	var cascMenu = require("cascMenu_super");
	var myTool= require("myTool");
	var popupCity= require("popupCity");
	var tag_popup= require("tag_popup");
	var tag_editor= require("tag_editor");
  var o = {};
    o.menuData={};
    o.tabData=[];
	o.type="addTask";//判断是增加标签还是增加任务.addTag
	var ajaxURL={};
	ajaxURL["addTask"]="./createTagTask"
	ajaxURL["addTag"]="./createTag";
		ajaxURL["tagName"]="./tagNameIsExists";
	var tagNameInfo=$("#tagNameInfo");
	var tagNameIsExists=false;//任务名称是否重复
    o.menuUserTplData=[];
    var selectTabData={};// 当前显示的数据
	var tabIndex=0;
	var selectIndex=0;
	var validationMsg="success";//保存验证状态
	var selectDataOut={};//输出字段的选择数据
    var menuDataArray={};
    var menuTab=$("#menuTab");
	var submitTask=$("#submitTask");
	var taskName=$("#taskName");
	var randnumBox=$("#randnumBox");
    var userMenuTplSelect=$("#userMenuTplSelect");
	var saveEnmuTplBtn=$("#saveEnmuTpl");
	var superTagEditor=$("#superTagEditor");//高级编辑器
	var superTagList=$("#superTagList");//高级编辑器的按钮
	
	var isPosting=0;
    var tabClassName='mis-tab-item-active';
	var activeClass="casc-item-active";
    //var tabTpl_t='{{#each this}}<span class="mis-tab-item02 " i="{{@index}}" c="{{key}}">{{name}}</span>{{/each}}';
	var selectTpl=Handlebars.compile('<option  value="-1">选择自定义模版</option>{{#each this}}<option  value="{{value}}" title="{{desc}}">{{name}}</option>{{/each}}');
    var tabTpl=Handlebars.compile('{{#each this}}<span class="mis-tab-item02 " i="{{@index}}" c="{{key}}">{{name}}</span>{{/each}}');
    var cascMenuLi=$("#cascMenuLi");
    var cascmenuLiOut=$("#cascMenuLiOut");
	//条件筛选的级联
    var cascMenuBoxIn01=$("#cascMenuBoxIn01");
    var cascMenuBoxIn02=$("#cascMenuBoxIn02");
    var cascMenuBoxIn03=$("#cascMenuBoxIn03");
	//输出的级联
	 var cascMenuBoxOut01=$("#cascMenuBoxOut01");
    var cascMenuBoxOut02=$("#cascMenuBoxOut02");
    var cascMenuBoxOut03=$("#cascMenuBoxOut03");
	var searchInConbox=$("#searchInConbox");//显示筛选条件的dom
	var fieldsOutBox=$("#fieldsOutBox");//显示输出字段的dom
	var conTplArray={};//存放选择查询条件的模版
		conTplArray.city=Handlebars.compile('<div class="form-box-item rel" id="{{c}}" c_name="area"><i class="mis-icon-close close-cond"title="删除此条件"for="{{c}}"></i><label class="form-box-label">城市</label><div class="form-item-con"><input class="input-txt02 mis-input"  type="text" {{#if value }}value="{{valueCityName}}"{{/if}} c="area" value="{{value}}"></div></div>');
		conTplArray.enum=Handlebars.compile('<div class="form-box-item rel" id="{{c}}" c_name="enum"><i class="mis-icon-close close-cond"title="删除此条件"for="{{c}}"></i><label class="form-box-label">{{chsname}}</label><div class="form-item-con"><select class="mis-select" >{{#each elist}}<option value="{{key}}"  {{#if value }}   {{#selectEnum key value}}selected{{/selectEnum}}{{/if}}>{{name}}</option>{{/each}}</select></div></div>');
		conTplArray.range=Handlebars.compile('<div class="form-box-item rel" id="{{c}}" c_name="range"><i class="mis-icon-close close-cond"title="删除此条件"for="{{c}}"></i><label class="form-box-label">{{chsname}}</label><div class="form-item-con"><input class="input-txt03 mis-input" type="text" {{#if tplv1}}value="{{tplv1}}"{{/if}}>----<input class="input-txt03 mis-input" type="text"{{#if tplv2}}value="{{tplv2}}"{{/if}}><i class="arrow-right  j_arrow_next"></i><span class="range-box j_arrow_range {{#if value}}{{else}}hide{{/if}}">	<select class="mis-select"><option value="and">并且</option><option value="or" {{#if op}}{{#if tplOr}}selected{{/if}}{{/if}}>或者</option></select><input class="input-txt03 mis-input" type="text"{{#if tplv3}} value="{{tplv3}}"{{/if}}>----<input class="input-txt03 mis-input" type="text"{{#if tplv4}} value="{{tplv4}}"{{/if}}></span></div></div>');
		conTplArray.others=Handlebars.compile('<div class="form-box-item rel" id="{{c}}" c_name="string"><i class="mis-icon-close close-cond"title="删除此条件"for="{{c}}"></i><label class="form-box-label">{{chsname}}</label><div class="form-item-con"><input class="input-txt04 mis-input"id=""type="text"value="{{value}}"></div></div>');
		
		
		conTplEditorObj = {};//高级查询的输出
		conTplEditorObj.city=Handlebars.compile('<span class="form-box-item j_editprBtnField" reg_id="{{c}}" c_name="area"> <label class="form-box-label">城市</label>=<input class="input-txt02 mis-input"  type="text" {{#if value }}value="{{valueCityName}}"{{/if}} c="area" value="{{value}}"> </span> ');//城市暂时不要
		
		conTplEditorObj.enum=Handlebars.compile('<span class="form-box-item rel j_editprBtnField" reg_id="{{c}}" c_name="enum"> <label class="form-box-label">{{chsname}}</label><select class="mis-select" >{{#each elist}}<option value="{{key}}"  {{#if value }}   {{#selectEnum key value}}selected{{/selectEnum}}{{/if}}>{{name}}</option>{{/each}}</select></span>&nbsp ');//select暂时不要
		conTplEditorObj.range=Handlebars.compile('<input   reg_id="{{c}}"  type="button" class="mis-btn mis-btn02 mis-btn-editor j_editprBtnField"  c_name="range" value="{{chsname}}"/>&nbsp ');
		conTplEditorObj.others=Handlebars.compile('<input   reg_id="{{c}}"   type="button"class="mis-btn mis-btn02 mis-btn-editor j_editprBtnField"  c_name="range" value="{{chsname}}"/> &nbsp');
		
		fieldTplEditorObj = {};//高级查询的输出
		fieldTplEditorObj.city=Handlebars.compile('&nbsp(<input   reg_id="{{c}}"  type="button" class="mis-btn mis-btn02 mis-btn-editor j_editprBtnField"  c_name="area" value="{{chsname}}"/>&nbsp )&nbsp'); 
		
		fieldTplEditorObj.enum=Handlebars.compile('&nbsp(<input   reg_id="{{c}}"  type="button" class="mis-btn mis-btn02 mis-btn-editor j_editprBtnField"  c_name="enmu" value="{{chsname}}"/>&nbsp )&nbsp'); 
		fieldTplEditorObj.range=Handlebars.compile('&nbsp(<input   reg_id="{{c}}"  type="button" class="mis-btn mis-btn02 mis-btn-editor j_editprBtnField"  c_name="range" value="{{chsname}}"/>&nbsp )&nbsp');
		fieldTplEditorObj.others=Handlebars.compile('&nbsp(<input   reg_id="{{c}}"   type="button"class="mis-btn mis-btn02 mis-btn-editor j_editprBtnField"  c_name="other" value="{{chsname}}"/> &nbsp)&nbsp');
		
		//这一套东西应该用mvvm的东西来搞。。数据和节点状态绑定。。， 
	var superConBox = {on:false};//输入参数的高级查询对象
		superConBox.Btn=$("#superTagBtn");
		superConBox.superTagList=superTagList;
		superConBox.jQ_editorBox = superTagEditor;
		superConBox.editorBox = superTagEditor[0];
		superConBox.nodeRecordFunc = function (mutation) { //MutationObserver对象
			if (mutation.removedNodes.length) { //获得删除的元素
				var node = mutation.removedNodes;
				for (var i = 0; i < node.length; i++) {
					//删出元素,   取消checkbox状态
					if (node[i] && node[i].nodeName.toLowerCase() === "input") {
						var id = node[i].getAttribute("reg_id");
						if (id&&cascMenuBoxIn03.find("input[c='" + id + "']")[0]) {
							cascMenuBoxIn03.find("input[c='" + id + "']")[0].checked = false;
						}
					}
				}
			}
		}
		superConBox= tag_editor.createEditor(superConBox);
		tag_editor.bindClick2editor(superTagList,superConBox);
		addOff_ON_BtnClick(superConBox);
		
		
	var superFieldsBox = {};//输出字段的高级运算
		superFieldsBox.superOutTagTab=$("#superOutTagTab");
		superFieldsBox.superFieldsOutWrap=$("#superFieldsOutWrap");
		superFieldsBox.fieldsOutWrap=$("#fieldsOutWrap");
		superFieldsBox.superON=false;
		//superFieldsBox.fieldsOutSuperBox=$("#fieldsOutSuperBox");
		superFieldsBox.superTagList=$("#superOutTagList");
		superFieldsBox.fieldsOutBox=fieldsOutBox;
		superFieldsBox.on=false;
		superFieldsBox.className="label-tab-active";
		superFieldsBox.superTagList
		
		superFieldsBox.jQ_editorBox = $("#fieldsOutSuperBox");
		superFieldsBox.editorBox = superFieldsBox.jQ_editorBox[0];
		superFieldsBox.nodeRecordFunc = function (mutation) { //MutationObserver对象
			if (mutation.removedNodes.length) { //获得删除的元素
				var node = mutation.removedNodes;
				for (var i = 0; i < node.length; i++) {
					//删出元素,   取消checkbox状态
					if (node[i] && node[i].nodeName.toLowerCase() === "input") {
						var id = node[i].getAttribute("reg_id");
						if (id&&cascMenuBoxOut03.find("input[c='" + id + "']")[0]) {
							cascMenuBoxOut03.find("input[c='" + id + "']")[0].checked = false;							 
						}
					}
				}
			}
		}
		superFieldsBox= tag_editor.createEditor(superFieldsBox);
		tag_editor.bindClick2editor(superFieldsBox.superTagList,superFieldsBox);
		//输出富文本禁止键盘输入
		superFieldsBox.DOM.addEventListener("keydown",function(e){
			var keyCode = e.keyCode;
			if(keyCode==8||keyCode==46){
				return true;
			}else{
				e.preventDefault();
				return false;
			}
		},false);
		
		superFieldsBox.superOutTagTab.on("click",function(e){
			var ele = e.target;
			var id = ele.getAttribute("for");
			 if(id=="fieldsOutWrap"){
				superFieldsBox.superFieldsOutWrap.addClass("hide");
				superFieldsBox.fieldsOutWrap.removeClass("hide");
				superFieldsBox.superOutTagTab.find("."+superFieldsBox.className).removeClass(superFieldsBox.className);
				$(ele).addClass(superFieldsBox.className);
				superFieldsBox.on=false;
				//某些数据清空和元素
				resetOutData();
			 }else if(id=="superFieldsOutWrap"&&superFieldsBox.on==false){
				//打开高级运算符
				superFieldsBox.superFieldsOutWrap.removeClass("hide");				
				superFieldsBox.fieldsOutWrap.addClass("hide");
				superFieldsBox.superOutTagTab.find("."+superFieldsBox.className).removeClass(superFieldsBox.className);
				$(ele).addClass(superFieldsBox.className);
				superFieldsBox.on=true;
				//某些数据清空
				resetOutData();
			 }
		})
		  
	function addOff_ON_BtnClick(param){
			param.Btn.on("click",function(){
			param.on = param.on?false:true;
			if(param.on){
				param.Btn.removeClass("mis-btn-disabled").text("点击关闭");
				param.superTagList.removeClass("hide");
				param.jQ_editorBox.removeClass("hide");
				
			}else{
				param.Btn.addClass("mis-btn-disabled").text("点击开启");
				param.superTagList.addClass("hide");
				param.jQ_editorBox.addClass("hide");
				param.DOM.body.innerHTML="";
			}
		});
	}	
		
	 Handlebars.registerHelper("selectEnum",function(key,value,options){
          if(v1>v2){
            //满足添加继续执行
            return options.fn(this);
          }
        });	
    o.init=function(param){
		if(o.type==="addTask"){
			saveEnmuTplBtn.on("click",function(){
				//保存模版
				tag_popup.open(getTagInfo());
			});
		}else if(o.type==="addTag"){
			$("#openFileBoxBtn").on("click",function(){
				tag_popup.open({userType:o.tabData});//上传文件
			})
		};
		popupCity.init({type:"checkbox"});
         
        menuTab.html(tabTpl(o.tabData));
        formatDataForTab(o.menuData);
        myTool.toggle({dom:$("#menuBoxBtn"),target:cascMenuLi});
        myTool.toggle({dom:$("#menuBoxBtnOut"),target:cascmenuLiOut});
		//给输入级联菜单绑定事件
		var menuItemDomArray=[cascMenuBoxIn01,cascMenuBoxIn02,cascMenuBoxIn03];
		lastcascMenuBoxIn_callback = function (data, ele) {
			if (ele.tagName.toLowerCase() === "input") {
				
				if (superConBox.on) {
					//高级编辑打开					
					fillEleByData2Editor(superConBox, data,ele);
					 
				} else {					
					conInSearchCheckClick(data,ele);//普通筛选条件
				}
			}
		}
		
		lastCancelCheck_callback=function(data){//取消选择状态的回调
			 
			searchInConbox.find("#"+data.c).remove();
		}
		cascMenuItemIn1st_Click=function(index){
			 
			return selectTabData;
		}
		cascMenuItemOut1st_Click=function(index){
			return selectDataOut;
		}		
		cascMenu.bindClickMenu({menuItemDomArray:menuItemDomArray,menuData:selectTabData,lastMenuCallback:lastcascMenuBoxIn_callback,cascMenuItem1st_Click:cascMenuItemIn1st_Click,lastCancelCheck_callback:lastCancelCheck_callback});		
		//输出条件的级联菜单
		var menuItemOut = [cascMenuBoxOut01, cascMenuBoxOut02, cascMenuBoxOut03];
		cascMenuBoxOut_callback = function (data, ele) {
			if (ele.tagName.toLowerCase() === "input") {
				 
				//区分是否开启高级编辑
				if(superFieldsBox.on){
					//渲染富文本
				fillEleByData2FeldEditor(superFieldsBox, data,ele);
					
				}else{
					//渲染普通文本 
					fillFieldsNOSuperBox(data,ele)
				}				
			}
		}
		cascMenu.bindClickMenu({menuItemDomArray:menuItemOut,menuData:selectDataOut,lastMenuCallback:cascMenuBoxOut_callback,cascMenuItem1st_Click:cascMenuItemOut1st_Click});
		menuTab.find("span:first").trigger("click");//触发点击事件
    }
    function formatDataForTab(data){
        for(var key in data){
            menuDataArray[key]=(cascMenu.init({data:data[key]}));
        }
    }
	function conInSearchCheckClick(data, ele) { //查找条件的点击操作
		var index = ele.getAttribute("c");
			if (ele.checked) {
				data.selectData[index] = data.allMenuData[index];
			} else {
				searchInConbox.find("#"+data.selectData[index].c).remove();
				delete data.selectData[index];

			}
			//渲染对应的条件展示区
			fillConDomByData(searchInConbox, data.selectData);
		}
    function fillConDomByData(dom,data) {
    	//根据选择的条件填充条件选择区域
    	var html = "";
    	if (data && typeof data === "object") {
    		for (var key in data) {
    			var d = data[key];
    			if (d.c&&dom.find("#"+d.c).length==0) {
    				switch (d['scope']) {
    				case 'string':
    					html += conTplArray.others(d);
    					break;
    				case 'range':
    					html += conTplArray.range(d);
    					break;
    				case 'enum':
    					//判断是否是城市
    					if (d.name === "area") {
    						html += conTplArray.city(d);
    					} else {
    						html += conTplArray.enum(d);
    					}
    					break;
    				default:
    					html += conTplArray.others(d);
    					break;
    				}
    			}
    		}
    	}
    	dom.append(html);
    }
    function fillOutBox(dom,data){
        var html="";
        for(var key in data){
            var k = data[key];
			if(k.c){
				html+='<li c="'+ k.c+'">'+ k.chsname+'</li>';
			}
        };
        dom.html(html);
    }
	function fillFieldsNOSuperBox(data,ele){
		var index = ele.getAttribute("c");
				if (ele.checked) {
					data.selectData[index] = data.allMenuData[index];
				} else {
					delete data.selectData[index];
				}
		fillOutBox(fieldsOutBox, data.selectData);
	}
	 
	function fillEleByData2Editor(superObj, data, ele) {
		var index = ele.getAttribute("c");
		var html = "";
		var d = data.allMenuData[index];
		switch (d['scope']) {
		case 'string':
			html = conTplEditorObj.others(d);
			break;
		case 'range':
			html = conTplEditorObj.range(d);
			break;
		case 'enum':
			conInSearchCheckClick(data, ele);
			return;
			break;
		default:
			html = conTplEditorObj.others(d);
			break;
		}
		if (ele.checked) {
			tag_editor.insertHTML(superObj, html);
		} else {
			//删除的异常
			if (data.selectData[index]) {				 
				//删除这个普通条件
				delete data.selectData[index];
				var id = data.allMenuData[index].c;
				searchInConbox.find("#"+id).remove();
			} else {
				//tag_editor.deleteHTML(superObj, ele);
				tag_editor.insertHTML(superObj, html);
			}
		}

	}
	
	function fillEleByData2FeldEditor(superObj, data, ele) {
		var index = ele.getAttribute("c");
		var html = "";
		var d =  data.allMenuData[index];
		/*
			switch (d['scope']) {
			case 'string':
				html =fieldTplEditorObj.others(d);
				break;
			case 'range':
				html = fieldTplEditorObj.range(d);
				break;
			case 'enum':
				html = fieldTplEditorObj.(d);
				return ;
				break;
			default:
				html = fieldTplEditorObj.others(d);
				break;
			}
			*/
			html = fieldTplEditorObj.others(d);
			/*
		if(ele.checked){
			tag_editor.insertHTML(superObj, html);
		}else{
			tag_editor.deleteHTML(superObj, ele);
		}
		*/
		tag_editor.insertHTML(superObj, html);
	}
	
	
	
	function getSearchCon(selectData){
		//从DOM获取用户的查询条件
        var search=[];
        for(var key in selectData){
                var d = selectData[key];
            if(d.c===key){
               var dom= searchInConbox.find("#"+key);
			   var m = {};
			   m.tagname=d.name;
			   m.scope=d.scope;
			   m.valuetype =d.valuetype;
                m.id= d.id;
                m.chsname= d.chsname;
                //获取对应的数据
				 //根据数据类型获取对应的数据
				 switch (d['scope']) {
    				case 'range':
						var r = getRangeValue(dom);
							if(typeof r !=="object"){
								//validationMsg="error";
								return false;
							}
    					 m.value=r;
    					break;
    				case 'enum':
    					//判断是否是城市
    					if (d.name === "area") {
    						 //城市id
							 m.value=popupCity.getCityCodeByNames(dom.find("input").val()).join(",");
							
    					} else {
    						 m.value=dom.find("select").val();
    					}
    					break;
    				default:
    					  m.value=dom.find("input").val();
    					break;
    				}
				search.push(m);	
            }
        }
		//高级查询的条件
		var superSearch={
			"tagname" : "complex",
			"scope" : "complex",
			"valuetype" : "complex",
			"id" : "complex",
			"chsname" : "complex" 
		}
		superSearch.value=tag_editor.getSQL(superConBox.DOM.body.innerHTML);
		search.push(superSearch);
        return search;
	}
	function getRangeValue(dom){
		//获取range的数值
		var v1=dom.find("input:eq(0)").val();
		var v2=dom.find("input:eq(1)").val();
		var v3=dom.find("input:eq(2)").val();
		var v4=dom.find("input:eq(3)").val();
		var op=dom.find("select").val();
		if((v1.length&&!v2.length)||(!v1.length&&v2.length)){
			//alert("请填写正确的范围");
			validationMsg="请填写正确的范围";
			return false;
		}else{
			validationMsg="success";
		}
		if((v3==""&&v4.length)||(v3.length&&v4=="")){
			//alert("请填写正确的范围");
			validationMsg="请填写正确的范围";
			return false;
		}else{
			validationMsg="success";
		}
		var m = {};
			m.v1=[v1,v2];
			if(v3&&v3.length&&v4.length){
				m.v2=[v3,v4];
				m.op=op;
			}
			
		return m;
	}
	function getFieldsOutByData(data){
        var fields=[];
        for(var key in data){
            var k =data[key];
            var m = {};
            m.id= k.id;
			m.tagname=k.name;
			m.chsname=k.chsname;
			m.valuetype =k.valuetype;
			m.scope=k.scope;
			fields.push(m);
        }
		 
		
		return fields;
    }
    // 填充用户自定义模版
    function fillAllBox(param){
      var conditions=param.conditions;
      var fields=param.fields;
        if(conditions){
            //selectData
            selectTabData.selectData=conditions;
          //  cascMenuBoxIn02.find("li."+activeClass).trigger("click");
            cascMenuBoxIn01.html(selectTabData.menuItemTpl(selectTabData.firstMenuData)).find("li:first").trigger("click");
            //赋值条件输出区
            fillConDomByData(searchInConbox,selectTabData.selectData);
        }
        if(fields){
            selectDataOut.selectData=myTool.deepClone(fields,selectDataOut.selectData);
            cascMenuBoxOut01.html(selectDataOut.menuItemTpl(selectDataOut.firstMenuData)).find("li:first").trigger("click");
            fillOutBox(fieldsOutBox,selectDataOut.selectData);
        }
    }
    menuTab.on("click",function(e){
        var elem= $(e.target);
        if(!elem.hasClass(tabClassName)){
            //没有被选中
            var index = elem.attr("c");
            if(index!==undefined&&index!==null){
                //
				selectIndex = index-0;
				tabIndex=elem.attr("i")-0;
                menuTab.find("."+tabClassName).removeClass(tabClassName);
                elem.addClass(tabClassName);
                //渲染menu				
                cascMenuReset(selectIndex);
                //渲染模版选择select
                userMenuTplSelect.html(selectTpl(o.menuUserTplData[index]));
            }
        }
    });
    function cascMenuReset(index){
        selectTabData=myTool.deepClone(menuDataArray[index]);
        selectDataOut=myTool.deepClone(menuDataArray[index]);
        cascMenuBoxIn01.html(selectTabData.menuItemTpl(selectTabData.firstMenuData)).find("li:first").trigger("click");
        cascMenuBoxOut01.html(selectDataOut.menuItemTpl(selectDataOut.firstMenuData)).find("li:first").trigger("click");
        //渲染条件选择区域
        searchInConbox.html("");
        fieldsOutBox.html("");
		//清空高级查询
		superConBox.DOM.body.innerHTML="";
		//清空快速查询输出
		resetOutData();
    }
	searchInConbox.on("click",function(e){
		var ele=e.target;
		if(ele.tagName.toLowerCase()==="i"){
			var j_ele=$(ele);
			if(j_ele.hasClass("j_arrow_next")){
				j_ele.next(".j_arrow_range").removeClass("hide");
				return false;
			}else if(j_ele.attr("for")){//删除按钮
				//删除对应的selectData
				var index=j_ele.attr("for");				
				searchInConbox.find("#"+selectTabData.selectData[index].c).remove();
				delete selectTabData.selectData[index];
				//重新渲染选择条件框				
				//fillConDomByData(searchInConbox,selectTabData.selectData);
				 cascMenuBoxIn02.find("li."+activeClass).trigger("click");
			}
		}else if(ele.tagName.toLowerCase()==="input"){
			//判断城市类型
			var c = ele.getAttribute("c");
			if(c==="area"){
				popupCity.open($(ele));
			}
		}
	});
    userMenuTplSelect.on("change",function(){
        var i = userMenuTplSelect.val();
        cascMenuReset(selectIndex);
        if(i==-1){
            //清空数据
            return;
        }
        getUserTplData(i,function(d){
            var tplData= JSON.parse(d.content);
            //填充menu,填充con，填充out;这里可以考虑用mvvm的一些方法defineProperties...
            var p = {};
            p.conditions=formatUserMenuTplData(selectTabData.allMenuData,tplData.conditions,true);
            p.fields=formatUserMenuTplData(selectDataOut.allMenuData,tplData.fields);
            //p.fields=tplData.fields;
            fillAllBox(p);
        });
    });
    function getUserTplData(id,callback){
        $.get("./getSearchTemplate",{id:id},function(serverData){
                if(serverData&&serverData.errno==0){
                    if(callback&&typeof callback==="function"){
                        callback(serverData.info);
                    }
                }
        },"json");
    }
    function formatUserMenuTplData(allData, userData, isFillInput) {
    	var m = {};
    	for (var i = 0; i < userData.length; i++) {
    		var n = userData[i];
    		var c = n.id + "__" + n.tagname;
    		n.c = c;
    		if (allData[c]) {
    			n = myTool.deepClone(allData[c], n);
    		}
    		if (isFillInput) {
    			if (n.scope === "range") {
    				if (n.op && n.op === "or") {
    					n.OpOr = true;
    				}
    				if (n.value.v1) {
    					n.tplv1 = n.value.v1[0];
    					n.tplv2 = n.value.v1[1];
    				}
    				if (n.value.v2) {
    					n.tplv3 = n.value.v2[0];
    					n.tplv4 = n.value.v2[1];
    				}
    			}
    			if (n.scope === "enum" && n.name === "area") {
    				var cityName = [];
    				if (n.value.indexOf("_") > -1) {
    					var cityCode = n.value.split("_");
    					for (var i = 0; i < cityCode.length; i++) {
    						cityName.push(popupCity.haveCityByCityCode(cityCode[i]).city_name)
    					}
    				} else {
    					cityName.push(popupCity.haveCityByCityCode(n.value).city_name)
    				}
    				n.valueCityName = cityName.join(";");
    			}
    		}
    		m[c] = n;
    	}
    	return m;
    }
    function getTagInfo(){
		var param={};
		 param.usertype= o.tabData[tabIndex].key;
        var conditions=getSearchCon(selectTabData.selectData);
		 param.conditions=conditions;
		if(o.type==="addTask"){
			if(superFieldsBox.on){
				var  fields=tag_editor.getField(superFieldsBox.DOM.body.innerHTML,selectDataOut);
			}else{
			var  fields=getFieldsOutByData(selectDataOut.selectData);
			}
			var randnum=randnumBox.val()||0;
			param.randnum=randnum;
			param.fields=fields;
		}        
        return param;
    }
	function resetOutData(){
			//某些数据清空和元素
			selectDataOut.selectData={};
			cascMenuBoxOut02.find("li:first").trigger("click");				
			superFieldsBox.DOM.body.innerHTML="";
			//快速查询的表格清空
			qtSearch.gridView.html("");
	}
		taskName.on("keyup",function(){
		//检查任务名称是否重复
		$.get(ajaxURL["tagName"],{tagname:this.value},function(serverData){
			if(serverData&&serverData.errno==0){
				tagNameIsExists=false;
				tagNameInfo.html("任务名称可用");
			}else{
				tagNameIsExists=true;
				tagNameInfo.html(serverData.info||"任务名称冲突");
			}
		},"json");
		
	});
    submitTask.on("click",function(){
            //提交数据
		
        var name =taskName.val();
            if(!name.length){
				if(o.type=="addTask"){
					alert("请给任务起个名字!!!");
				}else if(o.type==="addTag"){
					alert("请给标签起个名字!!!");
				}
                return false;
            }
			if(validationMsg!=="success"){
				alert(validationMsg);
				return false;
			}
			if(isPosting==1){
				alert("网络繁忙，稍后再试");
				return false;
			}
        var param=getTagInfo();
            param.name=name;
			isPosting=1;
        $.post(ajaxURL[o.type],{json:JSON.stringify(param)},function(serverData){
				isPosting=0;
                if(serverData&&serverData.errno==0){
                    //alert("创建成功");
					var msg=	o.type==="addTask"?"创建任务成功":"创建标签成功,自定义标签位于分析标签-->自定义标签下";
					alert(msg);
                    location.href="./index";
                }else{
                    alert("创建失败");
                }
        },"json").error(function(){
				isPosting=0;
                alert("创建失败");
            });
    });
	//快速查询相关操作
	var qtSearch = {};
		qtSearch.btn = $("#qtSearchBtn");
		qtSearch.gridView = $("#gridViewQT");
		
	qtSearch.createGridview=function(data){//格式化模版,填充页面
		var head = data.head;
		var tableBodyTpl = [];
		var d = data.list[0];
 
		for(var key in d){			
			tableBodyTpl.push('{{'+key.replace("(","_").replace(")","_")+'}}');
		}
		var list  = data.list;
		var dd = [];
		for(var i = 0; i <list.length;i++){
			var a = {};
			for(var key in d){
				var k  = key.replace("(","_").replace(")","_");
				
				a[k] = list[i][key];
			}
			dd.push(a);
		}
		
		 var gridviewTpl='<table border-space="0"class="mis-gridview-table"><thead><tr>'+myTool.createGridviewHeader(head)+'</tr></thead><tbody>{{#each this}}<tr>'+myTool.createGridviewHeader(tableBodyTpl,'td')+'</tr>{{/each}}</tbody></table>';
		  var template = Handlebars.compile(gridviewTpl); 
		  qtSearch.gridView.html(template(dd));
	}
	qtSearch.getData = function (param){//获取数据
		$.post("./quickTagSearch", param, function (serverData) {
			if (serverData && serverData.errno == 0) {
				//创建表格
				qtSearch.createGridview(serverData.data);
			}
			else {
				 qtSearch.gridView.html("查询失败");
				 
			}
		}, "json").error(function () {
			 qtSearch.gridView.html("查询失败");
		});
	}
	
	 $("#qtSearchBtn").on("click",function(){
		//快速查询
		var param = getTagInfo();
		param.randnum=0;
		qtSearch.getData({json:JSON.stringify(param)});
	 
	 });
    module.exports=o;