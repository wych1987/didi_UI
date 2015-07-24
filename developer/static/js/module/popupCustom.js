var o = {}
var basePopupSelect = require("basePopupSelect");
var myTool = require("myTool");
var URL = "/api/popup_customer.php";
var base_conf = {
    ownEvent : "popupCustom",
    selected : "",
    type : 'radio',
    group : [],
    showGroup : "",
    showList : [],
    groupData : {},
    other:{
        name:"",
        value:"",
        selected:false
    }
}
function init(param){
    getCustomData(param)
}
function getCustomData(param){
    $.get(param.url||URL,param.search,function(serverData){
        if(serverData&&serverData.data){
             formatData2popup(serverData.data);
            bindEle(param.ele,base_conf);
        }
    },"json")
}
function formatData2popup(data){
    var group =[];
    var groupData={};
    for(var key in data){
        group.push({name:key,id:key});
        var item = [];
        data[key].forEach(function(v){
            item.push({id: v.id,name: v.name,selected:false});
        })
        groupData[key]=[{item:item}];
    }
    base_conf.group=group;
    base_conf.groupData=groupData;
}
function eleClick(ele,conf) {
    var selectName = ele.val();
    selectName = selectName.length?selectName.split(";"):"";
    if(selectName){
       // var ids = getCityCodeByNames(selectName);
        //conf_popup.showGroup = cityName_Map[selectName[0]].parent;
    }
   // conf_popup.ownEvent=conf.ownEvent?conf.ownEvent:conf_popup.ownEvent;
   // conf_popup.type=conf.type?conf.type:conf_popup.type;
   // basePopupSelect.open(conf_popup,ids,ele);
    basePopupSelect.open(conf,undefined,ele);
}
function bindEle(ele,conf){//绑定其他元素的城市,以及某些配置
    myTool.myEvent.on(document, conf.ownEvent, function () {
        //console.log(basePopupSelect);
        o.selected={
            id:basePopupSelect.selectData.id,
            name:basePopupSelect.selectData.name
        };
    });
   // myTool.bindAutoComplate(ele,autoData);
    ele.on("keydown",function(){
        basePopupSelect.close();
    });
    ele.on("click",function(){
        eleClick(ele,conf);
    });
}

o.init = init;
o.bindEle = bindEle;

o.selected={};
module.exports = o;