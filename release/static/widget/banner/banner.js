define("banner",function(n,e,a){function t(n){var e=[],a={};return n.forEach(function(n,t){var i=n.child.length;n.child.forEach(function(n){i+=n.length,i>f&&void 0===a[t]&&(a[t]=!0,e.push(t)),n.forEach(function(n){n.menu&&(i+=n.menu.length),i>f&&void 0===a[t]&&(e.push(t),a[t]=!0)})})}),e.forEach(function(e){var a=[];n[e].child[0].forEach(function(n){var e=1;n.menu&&n.menu.length&&(e+=n.menu.length),a.push({len:e,item:n})}),a.sort(function(n,e){return e.len-n.len}),n[e].child=i(a)}),n}function i(n){var e=[],a=[],t=0,i=0;return n.forEach(function(n){i>=t?(e.push(n.item),t+=n.len):(a.push(n.item),i+=n.len)}),t>i?[e,a]:[a,e]}function r(){h.bannerData.forEach(function(n){n.isHide=!0});var n=this.getAttribute("data-index");null!==n&&(n-=0,h.bannerData[n]&&(clearTimeout(v),h.bannerData[n].isHide=!1))}function o(n){var n=this.getAttribute("data-index");null!==n&&(n-=0,h.bannerData[n]&&(v=setTimeout(function(){h.bannerData[n].isHide=!0},m)))}function u(){x.find(".j_banner-link-box").each(function(){$(this).bind("mouseenter",r).bind("mouseleave",o)}),$(".j_banner-item-list").each(function(){$(this).on("mouseenter",r).on("mouseleave",o)})}function l(){p.on("mouseenter",function(){x.removeClass("hide-banner-box")}).on("mouseleave",function(){D=setTimeout(function(){x.addClass("hide-banner-box")},m)}),x.on("mouseenter",function(){clearTimeout(D)}).on("mouseleave",function(){D=setTimeout(function(){x.addClass("hide-banner-box")},m)})}function d(){var n=location.pathname;x.find("a[href='"+n+"']").parents("dl").find("dt").addClass("banner-active"),g.find("a[href='"+n+"']").addClass("banner-active")}function c(n){var e=location.pathname,a=[],t="";for(var i in n)if(n[i].url&&n[i].url.indexOf(e)>-1){if(t=n[i].pid,n[t]&&n[t].menu)return a=n[t].menu.slice(0);var r=n[i];a.push({name:r.name,url:r.url})}return a}var s={};const f=9,m=500;s.formatData=function(n){var e={},a={};n.forEach(function(n){0==n.pid?(e[n.id]=n,e[n.id].child=[[]],e[n.id].isHide=!0):(a[n.id]=n,a[n.id].menu=[])});for(var t in a){var i=a[t].pid;e[i]?e[i].child[0].push(a[t]):a[i]&&a[i].menu.push(a[t])}for(var r in e){var o=e[r];""==o.url&&delete o.url,o.child&&o.child.length&&o.child.forEach(function(n){n.forEach(function(n){n.menu&&0===n.menu.length?delete n.menu:delete n.url})})}var u=[];for(var l in e)u.push(e[l]);var d=c(a);return h.isHide=d.length?!0:!1,b.pageData=d,u},Vue.component("banner-component",{template:'<dl>\r\n    <dt class="banner-link-box j_banner-link-box" v-attr="data-index:$index" v-class="banner-active:isActive">{{item.name}}</dt>\r\n    <dd class="icon-arrow-top banner-item-list j_banner-item-list" v-class="hide:item.isHide"\r\n        v-attr="data-index:$index">\r\n        <div class=" banner-item-link-box" v-repeat="child:item.child">\r\n\r\n            <template v-repeat="child">\r\n                <a href="{{url}}" target="_blank" class="banner-item-link" v-if="url">{{name}}</a>\r\n\r\n                <h3 class="banner-item-link banner-item-title" v-if="menu">{{name}}</h3>\r\n                <template v-repeat="it:menu">\r\n                    <a href="{{it.url}}" target="_blank" class="banner-item-link banner-item-link-s">{{it.name}}</a>\r\n                </template>\r\n            </template>\r\n        </div>\r\n    </dd>\r\n</dl>\r\n'});var h=new Vue({el:"#bannerBox",data:{bannerData:[],isHide:!1}}),b=new Vue({el:"#bannerPage",data:{pageData:[]}}),v=0,p=$("#logoBox"),x=$("#bannerBox"),g=$("#bannerPage"),D=0;s.init=function(n){var e=s.formatData(n.data);e=t(e),h.bannerData=e,setTimeout(function(){u(),h.isHide&&l(),d()},1e3)},a.exports=s});