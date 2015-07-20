/**
 * Created by wangyunchen on 2015/5/28.
 * 业务监控的业务逻辑代码
 */

var monitorItem = require("monitorItem");
var myTools = require("myTool");
var popupCity = require("popupCity");
var fullScreenPopup = require("fullScreenPopup");
var  dateSearch01=$("#dateSearch01")
var cityInput = $("#cityInput");
   popupCity.okCallback = function () {
   dateSearch01.trigger("click");
}
popupCity.init({
    type : "radio"
})
cityInput.on("click", function () {
    popupCity.open({
        cityInput : cityInput
    });
});

var dateInput = $("#dateInput");
 function getDateByTime(time,day){
     var dayTime=1000*60*60*24;
    var t = time+day*dayTime;
    var d = new Date();
    d.setTime(t);
    var y = d.getFullYear();
    var m = d.getMonth()+1;
    var day = d.getDate();
    m=m>9?m:"0"+m;
    day = day>9?day:"0"+day;
    return y+"-"+m+"-"+day;
}
function initDate() {
    /*获取三个日期*/
    var t = dateInput.val();
    if (t) {
        t = t.replace(/-/g, "/");
        var time = new Date(t).getTime();
    }else{
        var time = new Date().getTime();
    }        
        var date1 = getDateByTime(time, 0);
        var date2 = getDateByTime(time, -1);
        var date3 = getDateByTime(time, -7);
         dateInput.val(date1);
        return {
            date1 : date1,
            date2 : date2,
            date3 : date3
        };
}

   
   var TODAY=getDateByTime(new Date(),0); 
    var URL = "";//后端数据接口
    var down_url=""//下载数据接口
/*搜索的查询条件对象*/
var filterObj ={};


var o = {};
var timerCount = 0;
var isTimeInterval=true;//属否刷新数据
var timeInterval=40*1000;
var config = {};
o.moniterItemArray = [];
var monitorBoxDom = document.getElementById("monitorBox");
var monitorBoxVue ={};//全部子监控项的dom
var filterBoxVue={};
o.filterBoxVue=filterBoxVue;

function formatFilter(){
    filterBoxVue.filterData.forEach(function(v){
        filterObj[v.key] = v.selected;
    });
}
/*
param为页面配置项,有url，搜索条件，日期和城市选择则为默认配置不在条件配置里
*/
o.init = function(param){
    URL = param.url;
    down_url = param.down_url;
    filterObj =initDate();
    o.moniterItemArray=[];
    config.filterMonitorItem = param.monitor_config;
    createFilterDom(param.filterData);
    //创建每个子监控项dom
    var mon  = filterBoxVue.filterData[0].selected;

    createMonitorItem(mon);
    startTimeInterval();

};
function createMonitorItem(monName){
    var list = myTools.deepClone(config.filterMonitorItem[monName],[]);
    var item = formatMonitorItemData(list);
    if(monitorBoxVue&&monitorBoxVue.$destroy){
        monitorBoxVue.$delete("item");
        monitorBoxVue.$add("item",item);
    }else{
        monitorBoxVue=new Vue({
            el: '#monitorBox',
            data: {
                item:item
            },
        created:function(){
            this.$on("fullScreenClick",function(v,ele){
                    var type =ele.getAttribute("data-type");
                    if(type==="full"){
                         var type_id = ele.getAttribute("data-id");
                         var index = ele.getAttribute("data-index");
                         console.log(o.moniterItemArray[index]);
                         var p = {};
                         p.search = filterObj;
                         p.search.id=v.id;
                            var chartOption = o.moniterItemArray[index].echart.getOption();
                         p.option = {
                            xAxis:chartOption.xAxis,
                            series:chartOption.series,
                         }

                         p.url = URL;
                         p.title=filterObj.monitor_id;
                         fullScreenPopup.open(p);
                    }
            });
             this.$on("downClick",function(v,ele){
                filterObj.id = v.id;
                var s = "search="+encodeURIComponent(JSON.stringify(filterObj));
                ele.href=down_url.indexOf('?')>-1?down_url+"&"+s:down_url+"?"+s;
                return true;
            });

        }
        });
        
    }
    var elem =monitorBoxDom.getElementsByClassName("j_highchartsBox");
    //获取数据更新初始化图表
    config.filterMonitorItem[monName].forEach(function(v,index){
        getMonitorData(v.id,function(data){
            //绘图
            var p = {};
            p.chartDom=elem[index];
            p.data=data.data;
            p.date = [filterObj.date1,filterObj.date2,filterObj.date3];
            o.moniterItemArray.push(monitorItem.init(p));
            //同步数据
            // monitorBoxVue.item.set(index,data.info);
            upDataInfo(monitorBoxVue.item[index],data.info);
        });
    });
}
function upDataInfo(item,info){
    for(var k in info){
        item[k]=info[k];
    }
}
function createFilterDom(data) {
    data.forEach(function(v){
        if(v.item&& v.item.length){
            v.selected= v.item[0].value;
        }
    });
	filterBoxVue = new Vue({
			el : '#filterBox',
			data : {
				filterData : data,
                date1:filterObj.date1,
                date2:filterObj.date2,
                date3:filterObj.date3,
                date1_checked:true,
                date2_checked:true,
                date3_checked:true,
                update_time:"",
                statrButtonTxt:"暂停刷新"
			},
            methods:{
                filterChange:function(key,event ){
                    if(key==="monitor_id"){//如果key是监控项则重绘所有的chart
                        console.log("重置chart");
                        o.moniterItemArray.forEach(function(v){
                            if(v.dispose){
                                v.dispose();
                            }
                        });
                        o.moniterItemArray.length=0;
                        createMonitorItem(filterBoxVue.filterData[0].selected);
                    }else{//否则则只是updateSeries
                        console.log("update");
                        upDateChartData();
                    }
                },
                "stateBtnClick":function(){
                    if(isTimeInterval){
                        stopTimeInterval();
                        this.statrButtonTxt="继续刷新";
                    }else{
                        startTimeInterval(1);
                         this.statrButtonTxt="暂停刷新";
                    }
                }
            },
            watch:{
                "date1_checked":function (val, oldVal) {
                    var self = this;                   
                    o.moniterItemArray.forEach(function(v){
                        var opt =v.echart.getOption();
                            opt.legend.selected[filterObj.date1]=val;
                           // Legend.selected
                           v.echart.clear();
                        v.echart.setOption(opt);
                    });                  
                },
                "date2_checked":function (val, oldVal) {
                    var self = this;                   
                    o.moniterItemArray.forEach(function(v){
                        var opt =v.echart.getOption();
                            opt.legend.selected[filterObj.date2]=val;
                           // Legend.selected
                           v.echart.clear();
                        v.echart.setOption(opt);
                    });                  
                },
                "date3_checked":function (val, oldVal) {
                    var self = this;                   
                    o.moniterItemArray.forEach(function(v){
                        var opt =v.echart.getOption();
                            opt.legend.selected[filterObj.date3]=val;
                           // Legend.selected
                           v.echart.clear();
                        v.echart.setOption(opt);
                    });                  
                },
                "date1":function(val){
                    //如果date1不等于今天则停止定时器刷新数据
                    if(val !=TODAY){
                        stopTimeInterval()
                    }else{
                        startTimeInterval();
                    }
                }
            }
		});
}
function formatMonitorItemData(dataArray){
    dataArray.forEach(function(v){
        v.curr="";
        v.time="";
        v.max="";
        v.min="";
        v.sum="";
        v.avg="";
        v.down_url=down_url;
    });
    return dataArray;
}
function getMonitorData(p,callback){
    formatFilter();
    filterObj["id"]=p;
    if(cityInput.length&&cityInput.val()){
        filterObj.cityId=popupCity.getCityCodeByNames(cityInput.val())[0];
    }
    $.get(URL,{search:JSON.stringify(filterObj)},function(serverData){
            if(serverData&&serverData.data){
                var data = serverData.data;
                 var info = {};
				 var showData=data.date[filterObj.date1];
                for(var k in showData){
                    if(k !=="seq"){
                        info[k]=showData[k]||0;
                    }
                }
                filterBoxVue.update_time=showData.time;
                callback({data:data,info:info});
            }
    },"json");
}
function startTimeInterval(t){
    isTimeInterval=true;
     clearTimeout(timerCount);
    timerCount=setTimeout(function(){
        upDateChartData();
    },t||timeInterval);
}
function stopTimeInterval(){
    isTimeInterval=false;
     clearTimeout(timerCount);
}
function upDateChartData(){
   var mon =  filterBoxVue.filterData[0].selected;
    config.filterMonitorItem[mon].forEach(function(v,index){
        getMonitorData(v.id,function(data){
            //绘图
            var p = {};
            p.data=data.data;
            p.date = [filterObj.date1,filterObj.date2,filterObj.date3];
            o.moniterItemArray[index].updataCharData(p);
            //同步数据
            // monitorBoxVue.item.set(index,data.info);
            upDataInfo(monitorBoxVue.item[index],data.info);
        });
    });
    if(isTimeInterval){
       startTimeInterval();
    }
}
dateSearch01.on("click",function(){
    clearTimeout(timerCount);
    var t = initDate();
    filterObj.date1 =t.date1;
    filterObj.date2 =t.date2;
    filterObj.date3 =t.date3;
    filterBoxVue.date1 = t.date1;
    filterBoxVue.date2 = t.date2;
    filterBoxVue.date3 = t.date3;
    upDateChartData();
});
/*
    优化相关，绑定visibilitychange事件，判断document.visibilityState属性，来打开或者关闭定时器
*/
function documentHiddenEvent(){
    var hidden, visibilityChange;
if (typeof document.hidden !== "undefined") { // Opera 12.10 and Firefox 18 and later support
    hidden = "hidden";
    visibilityChange = "visibilitychange";
} else if (typeof document.mozHidden !== "undefined") {
    hidden = "mozHidden";
    visibilityChange = "mozvisibilitychange";
} else if (typeof document.msHidden !== "undefined") {
    hidden = "msHidden";
    visibilityChange = "msvisibilitychange";
} else if (typeof document.webkitHidden !== "undefined") {
    hidden = "webkitHidden";
    visibilityChange = "webkitvisibilitychange";
}

function handleVisibilityChange() {
    if(isTimeInterval){
      if (document[hidden]) {
        //暂停刷新数据
            clearTimeout(timerCount);
      } else {
        //继续刷新数据
         upDateChartData();
      }
    }
}
document.addEventListener(visibilityChange, handleVisibilityChange, false);

}
documentHiddenEvent();
o.startTimeInterval=startTimeInterval;
module.exports=o;