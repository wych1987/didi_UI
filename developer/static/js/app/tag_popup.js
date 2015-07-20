//define(["jquery","myTool"],function($,myTool){
	var myTool = require("myTool");
    var o = {};
	var DOM=$(document);
    var popupDom=$("#misPopup");
	var popupHTML='<div class="mis-popup-wrap hide"id="misPopup"><div class="mis-popup-stuff"><div class="title-popup-box"><h3 class="mis-popup-title">保存模版</h3><i class="mis-popup-close"title="关闭"id="misTagPopupClose"></i></div><div class="mis-popup-content"><ul class="popup-form-wrap"><li class="form-item "><div class="input-item"><label for="enmuTplName"><em class="star-tip">*</em>模版名称</label><input class="input-txt04 mis-input"id="enmuTplName"type="text"value=""autocomplete="off"placeholder="请输入模版名称(15个字符以内)"maxlength="15"></div></li><li class="form-item "><div class="input-item"><label for="enmuTplNote"><em class="star-tip">*</em>模版描述</label><textarea placeholder="请输入模版描述(100个字符以内)"class="popup-textarea"id="enmuTplNote"maxlength="10"maxlength="100"></textarea></div></li><li class="form-item txt-center"><input class="mis-btn mis-btn02"id="savePopupBtn"value="保 存"type="button"><span class="server-info-box"id="serverInfo"></span></li></ul></div></div></div>';
	if(!popupDom.length){
		DOM.find("body").append(popupHTML);
		popupDom=$("#misPopup");
	}
    
    var enmuTplName=DOM.find("#enmuTplName");
    var enmuTplNote=DOM.find("#enmuTplNote");
    var popupData={};
    var url="./setSearchTemplate";
	o.saveTplByTaskId=undefined;
    var callbackObj={};
    o.open=function(param,callback){
        popupData=param||{};
        enmuTplNote.val(popupData.enmuTplNote||"");
        callbackObj=callback;
        myTool.popupOpen(popupDom);
    }
    o.close=function(callback){
        if(callback&&typeof callback==="function"){
            callback();
        }
        enmuTplName.val("");
        enmuTplNote.val("");
        myTool.popupClose(popupDom);
    }
    function updatePopup(){
         if(enmuTplName.val().length==0){
             alert("请输入模版名称");
             return false;
         }
        if(enmuTplName.val().length>15){
            alert("模版名称超过了15个字符");
            return false;
        }
        if(enmuTplNote.val().length==0){
            alert("请输入模版描述");
            return false;
        }
        if(enmuTplNote.val().length>100){
            alert("模版名称超过了100个字符");
            return false;
        }
		if(o.saveTplByTaskId){
			sendTaskId();
		}else{
			$.post(url,{name:enmuTplName.val(),desc:enmuTplNote.val(),json:JSON.stringify(popupData)},function(serverData){
				if(serverData.errno==0){
					alert("模版保存成功");
					if(callbackObj.close){
						o.close(callbackObj.close);
					}else{
						o.close();
					}
				}else{
					alert(serverData.msg);
				}
			},"json").error(function(){
					alert("修改失败");
				});
		}
    }
	function sendTaskId(){
		$.post("./setSearchTemplateByTask",{name:enmuTplName.val(),desc:enmuTplNote.val(),id:o.saveTplByTaskId},function(serverData){
				if(serverData.errno==0){
					alert("模版保存成功");
					if(callbackObj.close){
						o.close(callbackObj.close);
					}else{
						o.close();
					}
				}else{
					alert(serverData.msg);
				}
			},"json").error(function(){
					alert("修改失败");
				});
		}
    $("#savePopupBtn").on("click",function(){
        updatePopup();
    });
    $("#misTagPopupClose").on("click",function(){
        o.close();
    });
    module.exports=o;