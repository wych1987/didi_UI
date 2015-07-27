var o = {}
var basePopupSelect = require("basePopupSelect");
var myTool = require("myTool");
var URL = "/api/popup_customer.php";

function init(param){
    var m = setOption(param);
  //  getCustomData(m);
    bindEle(m);
    return m;
}
function setOption(param){
    var p = {};
    for(var key in param){
        p[key]=param[key];
    }
    p.conf = {
        ownEvent :this.ownEvent|| "popupCustom",
        selected : "",
        type : this.type||'radio',
        group : [],
        showGroup : "",
        showList : [],
        groupData : {},
        other:{
            name:"",
            value:"",
            selected:false
        }
    };
    p.getIdByName=getIdByName;
    p.getCustomData = getCustomData;
    return p;
}
function getCustomData(param){
    $.get(param.url||URL,param.search,function(serverData){
        if(serverData&&serverData.data){
             formatData2popup(serverData.data,param);
            eleClick(param);
            myTool.bindAutoComplate(param.ele,param.autoData);
        }
    },"json")
}
function formatData2popup(data, obj) {
    var group = [];
    var groupData = {};
    var names_map = {};
    var ids_map = {};
    var selected_map = {};
    var autoData =[];
    obj.conf.selected = undefined;
    if (obj.selected) {
        obj.selected.id.forEach((function (k) {
            selected_map[k] = true;
        }))
    }
    for (var key in data) {
        group.push({name: key, value: key});
        var item = [];
        data[key].forEach(function (v) {
            var t = selected_map[v.id] || false;
            item.push({value: v.id, name: v.name, selected: t});
            names_map[v.name] = {id: v.id, name: v.name, parent: key};
            ids_map[v.id] = {id: v.id, name: v.name, parent: key};
            autoData.push(v.name);
        });
        groupData[key] = [{item: item}];
    }
    obj.conf.group = group;
    obj.conf.groupData = groupData;
    obj.name_map = names_map;
    obj.id_map = ids_map;
    obj.autoData = autoData;
}
function eleClick(obj) {
    var ele = obj.ele;
    var selectName = ele.val();
    var ids = [];
     selectName = selectName.length?selectName.split(";"):"";
    if(selectName){
         ids = obj.getIdByName(selectName);
        if(ids&&obj.name_map[selectName[0]]){
            obj.conf.showGroup = obj.name_map[selectName[0]].parent;
        }
    }
   // conf_popup.ownEvent=conf.ownEvent?conf.ownEvent:conf_popup.ownEvent;
   // conf_popup.type=conf.type?conf.type:conf_popup.type;
   // basePopupSelect.open(conf_popup,ids,ele);
   // obj.conf.selected = getIdByName(ele.val());
    basePopupSelect.open(obj.conf,ids,ele);
}
function bindEle(obj){
    var ele = obj.ele;
    myTool.myEvent.on(document, obj.conf.ownEvent, function () {
        //console.log(basePopupSelect);
        obj.selected={
            id:basePopupSelect.selectData.id,
            name:basePopupSelect.selectData.name
        };
        ele.val(obj.selected.name);
    });

    ele.on("keydown",function(){
        basePopupSelect.close();
    });
    ele.on("click",function(){
        getCustomData(obj);

    });
}
function getIdByName(names){
    var data = this.name_map;
    var p = [];
    if( Array.isArray(names)){
             names.forEach(function(v){
                 if(data[v]){
                     p.push(data[v].id);
                 }
             })
    }else{
        p.push(data[names].id);
    }
    return p;
}
function getNameByIds(names){
    var data = this.id_map;
    var p = [];
    if( Array.isArray(names)){
             names.forEach(function(v){
                 if(data[v]){
                     p.push(data[v].id);
                 }
             })
    }else{
        p.push(data[names].id);
    }
    return p;
}

o.init = init;
//o.bindEle = bindEle;

module.exports = o;