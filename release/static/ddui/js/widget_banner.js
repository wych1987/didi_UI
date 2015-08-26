define('banner', function(require, exports, module){ // 先注册组件
var o = {};
const  bannerItemLength = 9;
const  timeInter=500;
var isBannerBoxHide = false;
o.formatData = function (data) {
    //格式化banner的数据,根据pid来组织数据结构
    /*  [{
     "id": "5",
     "name": "编辑用户",
     "url": "/site/user_edit",
     "status": "0",
     "pid": "2"
     }]
     */
    var first = {};
    var b = {};//所有的id对应的对象
    data.forEach(function (v) {
        if (v.pid == 0) {
            first[v.id] = v;
            first[v.id].child = [[]];
            first[v.id].isHide = true;
        } else {
            b[v.id] = v;
            b[v.id].menu = [];
        }
    });
    for (var key in b) {
        var p = b[key].pid;
        if (first[p]) {
            first[p].child[0].push(b[key]);
        } else if (b[p]) {
            b[p].menu.push(b[key]);
        }
    }

    //过滤某些属性。。
    for (var k in first) {
        var f = first[k];
        if (f.url == "") {
            delete f.url;
        }
        if (f.child && f.child.length) {
            f.child.forEach(function (arr) {
                arr.forEach(function(v){
                    if (v.menu && v.menu.length === 0) {
                        delete v.menu;
                    } else {
                        delete v.url;
                    }
                })
            });
        }
    }
    var a = [];
    for(var d in first){
        a.push(first[d]);
    }
    var pageData =setBannerPageData(b);
    if(pageData.length){
        bannerItemBox.isHide=true;
    }else{
        bannerItemBox.isHide=false;
    }
    bannerPageVue.pageData=pageData;
    return a;
}

Vue.component('banner-component', {
    template: "<dl>\r\n    <dt class=\"banner-link-box j_banner-link-box\" v-attr=\"data-index:$index\" v-class=\"banner-active:isActive\">{{item.name}}</dt>\r\n    <dd class=\"icon-arrow-top banner-item-list j_banner-item-list\" v-class=\"hide:item.isHide\"\r\n        v-attr=\"data-index:$index\">\r\n        <div class=\" banner-item-link-box\" v-repeat=\"child:item.child\">\r\n\r\n            <template v-repeat=\"child\">\r\n                <a href=\"{{url}}\" target=\"_blank\" class=\"banner-item-link\" v-if=\"url\">{{name}}</a>\r\n\r\n                <h3 class=\"banner-item-link banner-item-title\" v-if=\"menu\">{{name}}</h3>\r\n                <template v-repeat=\"it:menu\">\r\n                    <a href=\"{{it.url}}\" target=\"_blank\" class=\"banner-item-link banner-item-link-s\">{{it.name}}</a>\r\n                </template>\r\n            </template>\r\n        </div>\r\n    </dd>\r\n</dl>\r\n"
});
var bannerItemBox = new Vue({
    el: "#bannerBox",
    data: {
        	bannerData : [  ],
             isHide:false
    }
});
var bannerPageVue=new Vue({
    el:"#bannerPage",
    data:{
        pageData:[]
       
    }
});
var bannerTimer = 0;
function setDate2MoreBannerItem(data) {
	//判断菜单长度，子列表过长则切换为多列显示
	 var splitIndex=[];
	 var isSplit={};
	data.forEach(function (v, index) {
		var length = v.child.length;
		v.child.forEach(function (it, k) {
			length+=it.length;
			if (length > bannerItemLength) {
					if(isSplit[index]===undefined){
						isSplit[index]=true;
						splitIndex.push(index);
					}
				}
			it.forEach(function (key) {
				if(key.menu){
					length += key.menu.length;
				}				
				if (length > bannerItemLength) {
					if(isSplit[index]===undefined){
						splitIndex.push(index);
						isSplit[index]=true;
					}					
				}
			});
		})
	});
	 splitIndex.forEach(function(key){
		
		 var t = [];
		 data[key].child[0].forEach(function(v,index){
			 var len = 1;
			 if(v.menu&&v.menu.length){
				len+=v.menu.length;
			 };
			 t.push({len:len,item:v});
		 });
		 //按照len倒序
		 t.sort(function(a,b){
			 return b.len-a.len;
		 });
		   data[key].child=alloBannerItem(t);
	 })
	 return data;
}
//把item分配到两个数组使他们节点基本相同
function alloBannerItem(arr){
	 var a = [];
	var b = [];
	var a_len = 0;
	var b_len = 0;
	arr.forEach(function(v){
		if(a_len<=b_len){
			a.push(v.item);
			a_len+=v.len;
		}else{
			b.push(v.item);
			b_len+=v.len;
		}
	});
	if(a_len>b_len){
		return [a,b];
	}else{
		return [b,a];
	}
		
}
function showBanner(ele) {
    bannerItemBox.bannerData.forEach(function (v) {
        v.isHide = true;
    });
    var index = this.getAttribute("data-index");
    if (index !== null) {
        index = index - 0;
        if (bannerItemBox.bannerData[index]) {
            clearTimeout(bannerTimer);
            bannerItemBox.bannerData[index].isHide = false;
        }
    }
}
function hideBanner(index) {
    var index = this.getAttribute("data-index");
    if (index !== null) {
        index = index - 0;
        if (bannerItemBox.bannerData[index]) {
            bannerTimer = setTimeout(function () {
                bannerItemBox.bannerData[index].isHide = true;
            }, timeInter);
        }
    }
}
    var logoBox=$("#logoBox");
    var bannerBox = $("#bannerBox");
    var bannerPage = $("#bannerPage");
    var logoBox_time = 0;
function bindMouseEvent() {
    bannerBox.find(".j_banner-link-box").each(function () {
        $(this).bind("mouseenter", showBanner).bind("mouseleave", hideBanner);
    });
    $(".j_banner-item-list").each(function () {
        $(this).on("mouseenter", showBanner).on("mouseleave", hideBanner);
    });

}
    function logoMouseEvent(){
        logoBox.on("mouseenter",function(){
            bannerBox.removeClass("hide-banner-box");
        }).on("mouseleave",function(){
            logoBox_time=setTimeout(function(){
                bannerBox.addClass("hide-banner-box");
            },timeInter);
        });
        bannerBox.on("mouseenter",function(){
            clearTimeout(logoBox_time)
        }).on("mouseleave",function(){
            logoBox_time=setTimeout(function(){
                bannerBox.addClass("hide-banner-box");
            },timeInter);
        })
    }
/*
* banner的初始化方法，param参数为param.data：banner的数据
*
* */
o.init=function(param){
    var d = o.formatData(param.data);
	d = setDate2MoreBannerItem(d);
    bannerItemBox.bannerData=d;
    //渲染节点居然不是顺序执行的。。。延时执行绑定事件,vue有个对应的api
    setTimeout(function(){
		bindMouseEvent();
        if(bannerItemBox.isHide){
            logoMouseEvent();
        }
		setBannerClass();
	},1000);
}
function setBannerClass(){
    var pathname =location.pathname;
    bannerBox.find("a[href='"+pathname+"']").parents("dl").find("dt").addClass("banner-active");
    bannerPage.find("a[href='"+pathname+"']").addClass('banner-active');

}
    function setBannerPageData(allUrlData){
        var pathname = location.pathname;
        var d = [];
        var pid = "";
        for(var key in allUrlData){
            if(allUrlData[key].url&&allUrlData[key].url.indexOf(pathname)>-1){
                pid = allUrlData[key].pid;
                if(allUrlData[pid]&&allUrlData[pid].menu){
                    d = allUrlData[pid].menu.slice(0);
                    return d;
                }else{
                    var k = allUrlData[key]
                    d.push({name: k.name,url: k.url});
                }
            }
        }
        return d;
    }
module.exports=o;
});