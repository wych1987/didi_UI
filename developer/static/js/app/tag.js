//define(["jquery","handlebars",'cascMenu',"myTool","popupCity","tag_popup"],function($,Handlebars,cascMenu,myTool,popupCity,tag_popup){
   	var cascMenu = require("cascMenu");
	var myTool= require("myTool");
	var popupCity= require("popupCity");
	var tag_popup= require("tag_popup");
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
		lastcascMenuBoxIn_callback=function(data){
			 //渲染输入条件的dom				
			 fillConDomByData(searchInConbox,data);
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
		var menuItemOut=[cascMenuBoxOut01,cascMenuBoxOut02,cascMenuBoxOut03];
		 cascMenuBoxOut_callback=function(data){			   
			 //渲染输出字段的节点
             fillOutBox(fieldsOutBox,data);
            
		}
		cascMenu.bindClickMenu({menuItemDomArray:menuItemOut,menuData:selectDataOut,lastMenuCallback:cascMenuBoxOut_callback,cascMenuItem1st_Click:cascMenuItemOut1st_Click});
		menuTab.find("span:first").trigger("click");//触发点击事件
    }
    function formatDataForTab(data){
        for(var key in data){
            menuDataArray[key]=(cascMenu.init({data:data[key]}));
        }
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
	taskName.on("keyup",function(){
		//检查任务名称是否重复
		$.get(ajaxURL["tagName"],{tagname:this.value},function(serverData){
			if(serverData&&serverData.errno==0){
				tagNameIsExists=false;
				tagNameInfo.html("");
			}else{
				tagNameIsExists=true;
				tagNameInfo.html(serverData.info||"任务名称冲突");
			}
		},"json");
		
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
			var  fields=getFieldsOutByData(selectDataOut.selectData);
			var randnum=randnumBox.val()||0;
			param.randnum=randnum;
			param.fields=fields;
		}        
        return param;
    }
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
	
   module.exports=o;