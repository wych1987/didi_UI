define('popupCustom_v2', function(require, exports, module){
    var o = {}
    var basePopupSelect = require("basePopupSelect");
    var myTool = require("myTool");
//var URL = "/customer_base/get_customer_info";
    var URL = "/api/popup_customer.php";

    function init(param){
        var m = setOption(param);
        m.getCustomData();
        if(m.ele){
            // bindEle(m);
            m.ele.on("click",function(){
                m.openByEle({ele:m.ele});
            })
        }
        return m;
    }
    function setOption(param){
        var p = {};
        for(var key in param){
            p[key]=param[key];
        }
        p.conf = {
            ownEvent :param.ownEvent|| "popupCustom",
            selected : "",
            type : param.type||'radio',
            group : [],
            showGroup : "",
            showList : [],
            groupData : {},
            other:{
                name:"",
                value:"",
                selected:false
            },
            uploadFile:param.uploadFile||false
        };
        p.getIdByName=getIdByName;
        p.getNameById=getNameById;
        p.getCustomData = getCustomData;
        p.openByEle= openByEle;
        return p;
    }
    function getCustomData(param){
        param = param||this;
        $.get(param.url||URL,param.search,function(serverData){
            if(serverData&&serverData.data){
                formatData2popup(serverData.data,param);
                if(param.ele){
                    //eleClick(param);
                    myTool.bindAutoComplate(param.ele,param.autoData,param.ownEvent);
                }
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
                names_map[v.name] = {id: v.id, name: v.name, parent: key,type:v.type};
                ids_map[v.id] = {id: v.id, name: v.name, parent: key,type:v.type};
                autoData.push(v.name);
            });
            groupData[key] = [{item: item}];
        }
        group.sort(function(a,b){
            return b.value- a.value;
        })
        obj.base = {
            id_map: JSON.parse(JSON.stringify(ids_map)),
            name_map: JSON.parse(JSON.stringify(names_map)),
            autoData: JSON.parse(JSON.stringify(autoData)),
            group: JSON.parse(JSON.stringify(group)),
            groupData: JSON.parse(JSON.stringify(groupData))
        }
        obj.conf.group = group;
        obj.conf.groupData = groupData;
        obj.name_map = names_map;
        obj.id_map = ids_map;
        obj.autoData = autoData;
    }

    function openByEle(param) {
        //点击元素打开popup
        var ele = param.ele;
        //var search = param.search;
        var autoComplateEvent = param.autoComplateEvent||"autoComplateEvent";
        myTool.myEvent.init(autoComplateEvent);
        var obj = this;
        obj.ele = ele;
        if(param.conf){
            for(var c in param.conf){
                obj.conf[c]=param.conf[c]
            }
        }
        myTool.myEvent.on(document, obj.conf.ownEvent, function () {
            //console.log(basePopupSelect);
            obj.selected = {
                id: basePopupSelect.selectData.id,
                name: obj.getNameById(basePopupSelect.selectData.id)
            };
            obj.ele.val(obj.selected.name.join(";"));
            // ele.val(obj.selected.name);
        });
        ele.on("keydown", function () {
            basePopupSelect.close();
        });
        var ids = [];
        ids = obj.getIdByName(ele.val());
        var selectName = ele.val().split(";");
        if (ids && obj.name_map[selectName[0]]) {
            obj.conf.showGroup = obj.name_map[selectName[0]].parent;
        }
        myTool.bindAutoComplate(param.ele, obj.autoData,autoComplateEvent);
        basePopupSelect.open(obj.conf, ids, ele);
    }
    /*
     function eleClick(obj,names) {
     var obj = obj||this;
     var ele = obj.ele;
     var ids = [];
     ids = obj.getIdByName(names);
     var selectName=ele.val().split(";");
     if(ids.length&&obj.name_map&&obj.name_map[selectName[0]]){
     obj.conf.showGroup = obj.name_map[selectName[0]].parent;
     }
     basePopupSelect.open(obj.conf,ids,ele);
     }
     function bindEle(obj){
     obj = setOption(obj);
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
     if(obj&&obj.search){
     getCustomData(obj);
     }
     eleClick(obj);
     });
     }
     */
    function getIdByName(names){
        var ele = this.ele;
        var selectName = names||ele.val();
        selectName = selectName.length?selectName.split(";"):[];
        var data = this.name_map;
        var p = [];
        if(data){
            selectName.forEach(function(v){
                if(data[v]){
                    p.push(data[v].id);
                }
            })
        }
        return p;
    }
    function getNameById(ids){
        var data = this.id_map;
        var p = [];
        if( Array.isArray(ids)){
            ids.forEach(function(v){
                if(data[v]){
                    p.push(data[v].name);
                }
            })
        }else{
            if(data[ids]){
                p.push(data[ids].name);
            }
        }
        return p;
    }

    o.init = init;
//o.bindEle = bindEle;
    module.exports = o;
});