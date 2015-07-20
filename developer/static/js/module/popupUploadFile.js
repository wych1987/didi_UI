//define(["jquery","myTool"],function($,myTool){
	var myTool = require("myTool")
    var o = {};
	var fileUpload_url="/customer_base/uploadTempCustomer";
	var DOM=$(document);
    var popupDom=$("#misTagPopup");
	var popupHTML='<div class="mis-popup-wrap hide"id="misTagPopup">'
	+	'<div class="mis-popup-stuff"><div class="title-popup-box">'
	+	'<h3 class="mis-popup-title">上传标签文件</h3>'
	+	'<i class="mis-popup-close"title="关闭"id="misTagPopupClose"></i>'
	+	'</div>'
	+	'<div class="mis-popup-content">'
	+'<form action="#"method="post"id="fileForm"target="_blank" enctype="multipart/form-data">'
	+'<ul class="popup-form-wrap">'
	+'<li class="form-item "><div class="input-item"><label for="fileName"><em class="star-tip">*</em>上传文件</label>'
	+'<input type="file"name="users"id="popupFileName"style="margin: 8px 0 0 0;"name="users"/></div></li>'
	+'<li class="form-item  "><progress id="progressBar" value="0" max="100" class="hide"> </progress><span id="percentage"></span>'
	+'</li>'
	+'<li class="form-item txt-center">'
	+'<input class="mis-btn mis-btn02"id="saveTagPopupBtn"value="保 存"type="button"><span class="server-info-box"id="serverInfo"></span>'
	+'</li></ul>'
	+'</form>'
	+'</div>'
	+'</div>'
	+'</div>';
	if(!popupDom.length){
		DOM.find("body").append(popupHTML);
		popupDom=$("#misTagPopup");
	}
    var fileForm=$("#fileForm");
    var popupFileName=DOM.find("#popupFileName");
	var progressBar=DOM.find("#progressBar");
	var percentageDiv =DOM.find("#percentage");
	var saveTagPopupBtn=DOM.find("#saveTagPopupBtn");
    var popupData={};
	var fileLoadStatus=0;//0未开始,1上传ing,2上传完毕
	var XHR={};
	o.saveTplByTaskId=undefined;
    var successFunc={};
    o.open=function(param,callback){
        
		fileUpload_url=param.file_url||fileUpload_url;
        successFunc=param.successFunc;
        myTool.popupOpen(popupDom);
    }
    o.close=function(callback){
        if(callback&&typeof callback==="function"){
            callback();
        }
		
		formReset();
        myTool.popupClose(popupDom);
    }
     
    $("#misTagPopupClose").on("click",function(){
		if(fileLoadStatus==1){
			XHR.abort();
		}		
        o.close();
    });
	popupFileName.on("change",function(){
		this.setAttribute("readonly","readonly");
		XHR=UpladFile();
	});
	saveTagPopupBtn.on("click",function(){
        if(popupFileName.val().length==0){
            alert("请选择文件");
            return false;
        }
		if(!fileLoadStatus==1){
			alert('文件上传ing');
			return false;
		} 
		o.close();
	});
	function UpladFile() {
		progressBar.removeClass("hide");
		var fileObj = popupFileName[0].files[0]; // js 获取文件对象
		// FormData 对象
		var form = new FormData();
		//form.append("author", "hooyes"); // 可以增加表单数据
		form.append("filename", fileObj); // 文件对象
		// XMLHttpRequest 对象
		var xhr = new XMLHttpRequest();
		xhr.open("post", fileUpload_url, true);
		//xhr.set('nctype',"multipart/form-data");
		//xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.setRequestHeader("nctype", "multipart/form-data");
		xhr.onload = function () {
			 if (xhr.status >= 200 && xhr.status < 300) {
				try {
					var serverData = JSON.parse(xhr.responseText);
				} catch (e) {
					console.log(e);
					console.log("JSON.parse错误");
					xhrError();
				}
				xhrSuccess(serverData);
			} else {
				xhrError();
			}
		};
		 
		xhr.upload.addEventListener("progress", progressFunction, false);
		xhr.send(form);
		return xhr;
	}
	function xhrError(errmsg){
		alert(errmsg||'文件上传失败');
		formReset();
	}
	function xhrSuccess(serverData){
		if(serverData.errno==0){
			percentageDiv.html("100%");
			fileLoadStatus=2;
			//o.close();
			if(successFunc&&typeof successFunc==="function"){
				successFunc(serverData.data);
			}
		}else{
			xhrError(serverData.errmsg);
		}
	}
	function progressFunction(evt) {
		console.log(evt);
		if (evt.lengthComputable) {
			progressBar[0].max = evt.total;
			progressBar[0].value = evt.loaded;
			var p=Math.round(evt.loaded / evt.total * 100);
			p = p>=100?99:p;
			percentageDiv.html(p + "%");
		}

	}
	function formReset(){
		popupFileName.removeAttr("readonly");
		progressBar.addClass("hide");
		progressBar[0].max=100;
		progressBar[0].value=0;
		percentageDiv.html("");
		fileForm[0].reset();
		fileLoadStatus=0;
		successFunc={};
	}
        module.exports=o;