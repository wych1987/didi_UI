//define(["jquery","handlebars","myTool","cityComplate"],function($,Handlebars,myTool,cityComplate){
//define(function(require) {	
  var myTool=require("myTool");
  var cityAPI_URL = "/common/get_city";
  var cityComplate=require("cityComplate");
  var o = {};
    var popupCityBox=$("#misPopupCity");
	var popupCityBoxHTML='<!--popupcity--><div class="mis-popup-city hide"id="misPopupCity"><div id="cityBoxList"class="popup-city-list"></div><div class="popup-btn-box"><input class="mis-btn mis-btn02"id="popupOkBtn"value="确定"type="button"><input class="mis-btn mis-btn02 mis-btn-cancel"id="popupCancelBtn"value="取消"type="button"></div></div><!--popupcity--end-->';
		if(!popupCityBox.length){
		$("body").append(popupCityBoxHTML);
		popupCityBox=$("#misPopupCity");
	}
    
    var cityBoxList=$("#cityBoxList");
    var targetDom=$("#cityInput")||$("#city")||{};//弹层对应的输入框
	var cityData=[];
    var cityNameArray={};//{"北京大区":[xxx],"上海大区":[xxx]}
    var cityCodeArray={};
    var isPopupShow=false;
    var timeNum=0;
    var tplType="radio";
    var allCityName={};//{北京:1,上海:2}
    var allCityNameArray=[];//["北京","上海"]
    var cityTpl_checkbox='{{#each this}}{{#if is_all}}<div class="city-box"><div class="city-title j_city_title"><label><input name="cityCode"type="checkbox"class="mis-checkbox j_cityItem"c="j_city_title"cityName="{{city_name}}"value="{{city_id}}"/><span>全国</span></label></div></div>{{else}}<div class="city-box j_cityBox"><div class="city-title "><label c="arrow"><input name="cityCode"type="checkbox"class="mis-checkbox j_city_title"c="j_city_title"cityName="{{name}}"value="{{region_all_city}}"/><span c="arrow">{{name}}</span></label>{{#if city.length}}<i class="icon-arrow02 right"c="arrow"></i>{{/if}}</div>{{#if city.length}}<div class="city-list hide j_cityList">{{#each city}}<div class="city-item"><label><input name="cityCode"type="checkbox"class="mis-checkbox j_cityItem"c="j_cityItem"cityName="{{city_name}}"value="{{city_id}}"/><span>{{city_name}}</span></label></div>{{/each}}</div>{{/if}}</div>{{/if}}{{/each}}';
    var cityTpl_radio='{{#each this}}{{#if is_all}}<div class="city-box"><div class="city-title j_city_title"><label ><input name="cityCode"type="radio"class="mis-checkbox j_cityItem"c="j_city_title"cityName="{{city_name}}"value="{{city_id}}"/><span>全国</span></label></div></div>{{else}}<div class="city-box j_cityBox"><div class="city-title "><label  c="arrow"><span  c="arrow">{{name}}</span></label>{{#if city.length}}<i class="icon-arrow02 right"c="arrow"></i>{{/if}}</div>{{#if city.length}}<div class="city-list hide j_cityList">{{#each city}}<div class="city-item"><label><input name="cityCode"type="radio"class="mis-checkbox j_cityItem"c="j_cityItem"cityName="{{city_name}}"value="{{city_id}}"/><span>{{city_name}}</span></label></div>{{/each}}</div>{{/if}}</div>{{/if}}{{/each}}';
    var cityTplArray=[];
	var nameSign=";"
    o.okCallback={};
    o.cityBoxList=cityBoxList;
    /*
     {{#each this}}
     {{#if is_all}}
     <div class="city-box">
     <div class="city-title j_city_title"><label><input name="cityCode" type="checkbox" class="mis-checkbox j_cityItem" c="j_city_title" cityName="{{city_name}}" value="{{city_id}}"/><span>全国</span></label></div>
     </div>
     {{else}}
     <div class="city-box j_cityBox">
     <div class="city-title "><label><input name="cityCode" type="checkbox" class="mis-checkbox j_city_title" c="j_city_title" cityName="{{name}}" value="{{region_all_city}}"/><span>{{name}}</span></label>{{#if city.length}}<i class="icon-arrow02 right" c="arrow"></i>{{/if}}</div>
     {{#if city.length}}
     <div class="city-list hide j_cityList">
     {{#each city}}
     <div class="city-item"><label><input name="cityCode" type="checkbox" class="mis-checkbox j_cityItem"  c="j_cityItem" cityName="{{city_name}}" value="{{city_id}}"/><span>{{city_name}}</span></label></div>
     {{/each}}
     </div>
     {{/if}}
     </div>
     {{/if}}
     {{/each}}
         */
  //  o.cityCode=[];
    Object.defineProperties(o, {
        cityCode: {
            get: function () {
                //this.newaccpropvalue=o.getCityCodeByNames(targetDom.val());
                var cityCode=o.getCityCodeByNames(targetDom.val());
				if(!cityCode.length){
					cityCode[0]=0;
				}
				this.newaccpropvalue=cityCode;
                return this.newaccpropvalue;
            },
            enumerable: true,
            configurable: true
        }});
    //param.type,param.callback;
    o.init=function(param){
        var callback={};
        switch(typeof param){
            case "string":
                tplType=param||"radio";
                break;
            case "object":
                tplType=param.type||"radio";
                callback=param.callback;
                break;
			default:
				tplType="radio";
				break;
        }
        cityTplArray["checkbox"]=Handlebars.compile(cityTpl_checkbox);
        cityTplArray["radio"]=Handlebars.compile(cityTpl_radio);
        getCityData(callback);

    }
	function getCityData(callback) {
		$.get(cityAPI_URL, {}, function (serverData) {
			if (serverData.errno == 0 && serverData.data) {
				cityData = formateCityData(serverData.data);
				cityBoxList.html(cityTplArray[tplType](cityData));
                if(callback&&typeof callback==="function"){
                    callback();
                }
                cityComplate.init({cityData:allCityNameArray});
			}
		}, "json")
	}
    function formateCityData(data){
        //转换city的数据格式
        allCityArray=[];
        allCityNameArray=[];
        cityNameArray={};
        cityCodeArray={};
        var a = [];
        for(var i = 0; i <data.length;i++){
            var d = data[i];

            if(d.name=="全国"){
                var dCity= d.city[0];
                var t = {"city_id": dCity.city_id,"city_name":dCity.city_name,is_all:"true"};
                a.push(t);
            }else{
                a.push(d);
            }
            //缓存城市信息到对应的数据格式里
            cityNameArray[d.name]=d;
            cityCodeArray[d.city[0].city_id]=d;
            //获取name对应的id
            allCityName[d.name]= d.id;
            for(var ii = 0; ii < d.city.length;ii++){
                var dd = d.city[ii];
                allCityName[dd.city_name]=dd.city_id;
                allCityNameArray.push(dd.city_name);
				cityCodeArray[dd.city_id]=dd;
            }
        }
        return a;
    }
    o.open=function(param){
   // o.open=function(jDom,filterName){
		if(arguments.length>1){
			var jDom=arguments[0];
			var filterName=arguments[1];
		}else if(param.cityInput){
			var jDom=param.cityInput;
			var filterName=param.filterName;
		}else {
			var jDom=arguments[0];
		}
	 	 targetDom=jDom;
        //弹层打开
        if(!isPopupShow){
        popupCityBox.find("input[type=checkbox]:checked").removeAttr("checked");         
            var code = o.getCityCodeByNames(jDom.val());
           o.fillInputCity(code);        
            if(filterName){//隐藏某个城市
                o.filterCity(filterName);
            }else{
                popupCityBox.find("input.hide").removeClass("hide");
            }
         
        var offset=jDom.offset();
        var left=offset.left;
        var top=offset.top+40;
        popupCityBox.css({left:left,top:top}).removeClass("hide");
        isPopupShow=true;
        }
        if(jDom.data('isAutoComplate')===undefined){
            //绑定auto事件
            cityComplate.bind(jDom);
            jDom.bind("keydown",function(){
                //关闭popup
                o.close();
            })
        }
    }
    //过滤某些城市信息cityName ,["北京市"],"北京市"
    o.filterCity=function(cityName){
        if(typeof cityName==="string"){
            popupCityBox.find("input[cityname='"+cityName+"']").parents("label").remove();
        }else if(Array.isArray(cityName)){
            for(var i = 0; i <cityName.length;i++){
                var filterName=cityName[i];
                    popupCityBox.find("input[cityname='"+filterName+"']").parents("label").remove();
            }
        }
    }
    o.close=function(){
        popupCityBox.addClass("hide");
        cityBoxList.find("input").each(function(){
            if(this.type=="checkbox"||this.type==="radio"){
                this.checked=false;
            }
        })
        isPopupShow=false;
    }
    o.getCityCodeByNames=function(names,sign){
		var codeArray=[];
		if(names){
        var cityNameArray=names.split(sign||nameSign);        
        for(var i = 0; i <cityNameArray.length;i++){
            var c = cityNameArray[i];
            if(allCityName[c]!==undefined&&allCityName[c]!==null&&allCityName[c]!==""){
                codeArray.push(allCityName[c]);
            }
        }
	}
        return codeArray;
    }
	//根据传入的城市id设置城市的是否选中
	o.fillInputCity = function (cityId) {
		if (typeof cityId === "string") {
			var elem = cityBoxList.find('input[value="' + cityId + '"]')[0];
			if (elem) {
				elem.checked = true;
			}
			return true;
		} else if (Array.isArray(cityId)) {
			for (var i = 0; i < cityId.length; i++) {
				var v = cityId[i];
				var elem = cityBoxList.find('input[value="' + v + '"]')[0];
				if (elem) {
					elem.checked = true;
				}
			}
			return true;
		}
		return false;
	}
    //重置弹窗信息
	o.resetPopupCity=function(){
		if(cityData&&cityData.length){
			 cityBoxList.html(cityTplArray[tplType](cityData));
		}else{
			getCityData();
		}
	}
    o.haveCityByName=function(cityName){
        return cityNameArray[cityName];
    }
    o.haveCityByCityCode=function(cityCode){
        return cityCodeArray[cityCode];
    }
	o.getAreaData=function(){//获取大区列表
		var d = [];
		for(var a in cityNameArray){
		 d.push({name:a,area_id:cityNameArray[a].id});
		}
		return d;
	}
    popupCityBox.bind("click",function(e){
            var ele= e.target;
            var c = ele.getAttribute("c");
            switch(c){
                case "j_city_title"://大区的点击
                    var eleParent=$(ele).parents(".j_cityBox");
                    var cityItem=eleParent.find(".j_cityItem");
                    if(tplType==='checkbox'){
                    if(ele.checked){
                        cityItem.each(function(i){
                           this.checked=true;
                        })
                    }else{
                        cityItem.each(function(i){
                            this.checked=false;
                        })
                    }
                   }
                    break;
                case "j_cityItem"://小元素点击
                    if(!ele.checked){
                        var eleParent=$(ele).parents(".j_cityBox");
                        var j_cityTitle=eleParent.find(".j_city_title");
                        j_cityTitle.removeAttr("checked");
                    }
                    break;
                case "arrow":
                        //向下箭头的点击
                    var eleParent=$(ele).parents(".j_cityBox");
                    var j_cityList=eleParent.find(".j_cityList");
                    if(j_cityList.hasClass("hide")){
                        j_cityList.removeClass("hide");
                    }else{
                        j_cityList.addClass("hide");
                    }
                    break;
                default :
                    break;
            }
    }).bind("mouseenter",function(){
            clearTimeout(timeNum);
        }).bind("mouseleave",function(){
            timeNum=setTimeout(function(){
                o.close();
            },1000);
        });
    $("#popupOkBtn").bind("click",function(e){
       //确定按钮
        var cityItem=popupCityBox.find(".j_cityItem:checked");
       // o.cityCode=[];
        var cityName=[];
        cityItem.each(function(){
           // o.cityCode.push(this.value);
            cityName.push(this.getAttribute("cityName"));
        })
        targetDom.val(cityName.join(nameSign));
        o.close();
        e.stopPropagation();
        if(o.okCallback&&typeof o.okCallback==="function"){
            o.okCallback(o.cityCode);
        }
        return false;
    });
    $("#popupCancelBtn").bind("click",function(e){
        o.close();
        e.stopPropagation();
        return false;
    });
	module.exports=o;
    // return o;
// });