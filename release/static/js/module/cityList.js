define("cityList",function(t,e,n){function i(t){t.url=t.url||"/common/get_city",a(t.url,t.filterName),w=t.ele,w.val(h.city_name),okCallback=t.okCallback,E.ownEvent=t.ownEvent||E.ownEvent,p.myEvent.on(document,h.ownEvent,function(){w.val(h.city_name)}),m(t.ele,{ownEvent:t.ownEvent,okCallback:t.okCallback,type:t.type||"radio"})}function a(t,e){$.get(t,function(t){c(t.data,e)},"json")}function o(t,e){w.val(t.name.join(";")),"function"==typeof e&&e(t.id.join(";"))}function c(t,e){var n={};e&&e.forEach(function(t){n[t]=!0}),t.forEach(function(t){if(!n[t.name])if("全国"==t.name)E.all=t.city,h.city_id=t.id,h.city_name=t.name,s[t.name]={city_id:t.id},f[t.id]={city_id:t.name},E.other.name="全国",E.other.value=t.id,E.other.selected=!1,v.push(t.name);else if(E.group.push({name:t.name,city_id:t.id}),E.groupData[t.name]=[],E.showGroup||(E.showGroup=t.name),t.city&&t.city.length){r(t.city);var e="",i={};t.city.forEach(function(a){if(!n[a.city_name]){v.push(a.city_name),h.city_id||(h.city_id=a.city_id,h.city_name=a.city_name);var o=a.whole_put_together.charAt(0);o!=e?(i.title&&E.groupData[t.name].push(i),e=o,i={title:e.toUpperCase(),item:[{name:a.city_name,value:a.city_id,selected:!1}]}):i.item.push({name:a.city_name,value:a.city_id,selected:!1}),s[a.city_name]=a,s[a.city_name].parent=t.name,f[a.city_id]=a,f[a.city_id].parent=t.name}})}}),d.first_data=h,p.myEvent.trigger(document,h.ownEvent)}function r(t){t.sort(function(t,e){var n=t.whole_put_together.charCodeAt(0),i=e.whole_put_together.charCodeAt(0);return n-i})}function y(t){var e=[];return Array.isArray(t)?t.forEach(function(t){f[t]&&e.push(f[t].city_name)}):f[t]&&e.push(f[t].city_name),e}function u(t){var e=[];return Array.isArray(t)?t.forEach(function(t){s[t]&&e.push(s[t].city_id)}):s[t]&&e.push(s[t].city_id),e}function l(t,e){w=t;var n=t.val();if(n=n.length?n.split(";"):""){var i=u(n);E.showGroup=s[n[0]].parent}E.ownEvent=e.ownEvent?e.ownEvent:E.ownEvent,E.type=e.type?e.type:E.type,_.open(E,i,t)}function m(t,e){p.myEvent.on(document,e.ownEvent,function(){d.selected={city_id:_.selectData.id,city_name:_.selectData.name},o(_.selectData,e.okCallback)}),p.bindAutoComplate(t,v),t.on("keydown",function(){_.close()}),t.on("click",function(){l(t,e)})}var d={},_=t("basePopupSelect"),p=t("myTool"),s={},f={},v=[],h={ownEvent:"cityData_ready",city_id:"",city_name:""},E={ownEvent:"cityList_ok",selected:"",type:"radio",group:[],showGroup:"",showList:[],groupData:{},other:{name:"",value:"",selected:!1}};p.myEvent.init(h.ownEvent);var w={};d.init=i,d.bindEle=m,d.getCityCodeByNames=u,d.getCityNameById=y,d.first_data=h,d.selected={},n.exports=d});