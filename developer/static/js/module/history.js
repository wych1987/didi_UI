/** 
 *记录用户打开的页面url 
 */
//define("history",  function(require, exports, module){	
	var urlList = [];
	var bannerBox = document.getElementById("bannerBox");
	var addedUrl={}; 
	var bannerUrl=getUrlByBanner();
	function init(){
		var t =  localStorage.getItem("history");
		if(t){
			urlList = JSON.parse(t);
		}else{
			 urlList=bannerUrl.urlList;
		};
		signUrl();
		localStorage.setItem("history",JSON.stringify(urlList));
	}
	function getUrlByBanner(){
		var aList = bannerBox.querySelectorAll("a[href]");
		var t = [];
		var urlName={};
		for(var i = 0; i <aList.length;i++){
			t.push({url:aList[i].href,name:aList[i].textContent});
			urlName[aList[i].href]=aList[i].textContent;
		}
		t = t.slice(0,4);
		return {name:urlName,urlList:t};
	}
	function signUrl(){
		urlList.forEach(function(v){
			addedUrl[v.url] = v.name;
		});
		var len= location.href;
		if(len.indexOf("site/")==-1){
			if(addedUrl[len]===undefined){
				urlList.unshift({url:len,name:bannerUrl.name[len]||"BI管理系统"});
				urlList.pop();
			}
		}
	}
	init();
//});