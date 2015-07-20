define('marketInfo_v2', function(require, exports, module){ 
        var myTool = require("myTool");
    var popupSelect = require("popupSelect");
     var customerPopupData = {};
    var o = {};
var URL = {};
URL["get_customer_info"] = "/customer_base/get_customer_info";
URL["task_result"] = "/customer_base/get_customer_info_by_id";
URL["create"]=
URL["test_msg"]="./send_test_shortmsg";
URL["list"]= "./act_list";
URL["create"]= './create_market_activity';
URL["edit"]= './edit_market_activity';
URL["review"]= './review_data';
var okBtnClick = {
	create : function (form_vue) {
		postFormData(form_vue);
	},
	edit : function (form_vue) {
		//先验证数据
		if (vali_form(form_vue)) {
			var data = getVueData(form_vue);
			if (!loading) {
				loading = true;
				data.id = marketPage_id
					$.post(URL[pageType], data, function (serverData) {
						loading = false;
						if (serverData) {
							if (serverData.code == 200) {
								alert(serverData.msg || "保存成功");
								//跳到列表页。。。
								location.href = URL["list"];
							} else {
								alert(serverData.msg);
							}
						}
					}, "json").error(function () {
						loading = false;
						alert("服务器错误，稍后再试");
					});
			}
		}
	},
	review : function (form_vue) {

			// var data = getVueData(form_vue);
		}
};

 var USER_TYPE={
        "1":"乘客",
        "2":"司机"
    }
  var tab_market_type ={
    "短信":"msg",
    "客户端":"push"
  }
  var custormer_input ={};
  var pageType="create";//页面的状态，编辑，新建，审核共用。。
  var loading = false;//ajax提交的状态变量
  const errorArray = {
    base_name:"活动名称不能为空",
    base_type:"活动类型不能为空",
    budget:"您输入的预算有误，请输入正确的数字"
  }
var pageData = {};
function init(conf) {
    pageData=conf.data;
    var data = formatData(conf.data);
    pageType=conf.pageType;
    var market_vue = new Vue({
            el : '#market_info',
            data : data,
            methods : {
                tabClick:function(market_type){
                    var m = market_type.item.text;                   
                    for(var k in  market_vue.tab_market_list){
                        market_vue.tab_market_list[k].active=0;
                    }
                    market_vue.tab_market_list[m].active=1;
                     market_vue.tab_market_state=m;
                },
                market_type_change:function(msg,event){
                    var list = {};
                    var item = market_vue.base.market_type.item;
                    item.forEach(function(c,i){
                        if(c.checked){
                           list[c.text]={active:0,text:c.text};
                         }
                    }) ;
                    //var n = 0;
                    market_vue.tab_market_state=0;
                    for(var  k in list){
                        if(market_vue.tab_market_state==0){
                            list[k].active=1;
                             if(!market_vue.tab_market_state){
                                market_vue.tab_market_state=k;
                             }
                           }
                           market_vue.tab_market_list=list;
                           return ;
                         }
                    },
            okClick:okBtnClick[pageType]
            },
            watch : {
                 "short_msg_info.msg_content.value":function(val){
                    if(val.length){
                        market_vue.error.test_msg_phone="";
                    }else{
                         market_vue.error.test_msg_phone="发送内容不能为空";
                    }
                 },
                 "base.name.value":function(val){
                    if(val.length){
                         market_vue.error.base_name="";
                    }else{
                         market_vue.error.base_name=errorArray["base_name"];
                    }
                 },
                 "base.type.value":function(val){
                    if(val.length){
                         market_vue.error.base_type="";
                    }else{
                         market_vue.error.base_type=errorArray["base_type"];
                    }
                 },
                 "base.budget.value":function(val){
                   if(val.length){
                      var reg = /^[1-9]\d*$|^0$/;
                      if(!reg.test(val)){                       
                           market_vue.error.budget=errorArray["budget"];
                      }else{
                         market_vue.error.budget="";
                      }
                    }else{
                       market_vue.error.budget="";
                    }
                 }

            }
        });
custormer_input = $("#extract_task_info_task_name")
 popupUserData(custormer_input[0],market_vue);
custormer_input.on("blur",function(){
    custmoer_OK(custormer_input[0],market_vue);
})
testBtnClick(market_vue);
    return market_vue;
}
function formatData(info) {
	//格式化页面信息供vue模版渲染
	var result = {};
	for (var by in info) {
		var data = info[by];
		var myData = {};
		for (var key in data) {

			//先验证value
			var d = data[key];
			myData[key] = {
				value : ""
			};
			var checkedObj = {};
			if (d.item) {
				myData[key].item = [];
				var t = Object.prototype.toString.call(d.value).slice(8, -1).toLowerCase();
				myData[key].valueType = t;
				switch (t) {
				case "array":
					d.value.forEach(function (v) {
						checkedObj[v] = true;
					});

					for (var k in d.item) {
						myData[key].item.push({
							value : k,
							text : d.item[k],
							checked : checkedObj[k] || false
						});
					}
					break;
				case "string":
				case "number":
					for (var k in d.item) {
						var m = {
							value : k,
							text : d.item[k]
						};
						m.checked = m.value === d.value ? true : false;
						myData[key].item.push(m);
					}
					if (!d.value) {
						myData[key].item[0].checked = true;
					}
					myData[key].value = d.value || myData[key].item[0].value;
					break;
				default:
					break;
				}
			} else if (d.value !== undefined) {
				myData[key].value = d.value;
				if (key === "user_type") {
					myData.user_type_name = {
						value : USER_TYPE[d.user_type] || ""
					}
				}
			}
		}

		result[by] = myData;
	}
	result.tab_market_state = 0;
	result.tab_market_list = {};
	var list = {};
	//判断base.market_type,编辑审核时候需要显示
	if (info.base.market_type.value.length) {
		result.base.market_type.item.forEach(function (v) {
			if (v.checked) {
				list[v.text] = {
					active : 0,
					text : v.text
				};
			}
		});
		for (var k in list) {
			if (result.tab_market_state == 0) {
				list[k].active = 1;
				if (!result.tab_market_state) {
					result.tab_market_state = k;
				}
			}
			result.tab_market_list = list;
			 
		}
	}

	result.error = { //存放错误信息的对象
		test_msg_phone : "",
		base_name : "",
		base_type : "",
    budget:""
	}
	// result.app_push_type="passenger";

	// myData.msgRule_IsChecked = false;
	//myData.appRule_IsChecked = false;
	return result;
}
function postFormData(form_vue){
    //先验证数据
    if(vali_form(form_vue)){
        var data = getVueData(form_vue);
        if(!loading){
             loading = true;
        $.post(URL[pageType],data,function(serverData){
              loading = false;
             if (serverData) {
                if (serverData.code == 200) {
                    alert(serverData.msg || "保存成功");
                    //跳到列表页。。。
                    location.href = URL["list"];
                } else {
                    alert(serverData.msg);
                }
            }
        },"json").error(function(){
              loading = false;
            alert("服务器错误，稍后再试");
        });
    }
    }
}
function vali_form(form_vue){
    
    //验证name和类型
    if(!form_vue.base.name.value.length){
         form_vue.error.base_name=errorArray["base_name"];
        $("#base_name").focus();
        return false;
   }
    if(!form_vue.base.type.value.length){
        form_vue.error.base_type=errorArray["base_type"];
        $("#base_type").focus();
        return false;
   }
   if(form_vue.error.budget.length){
       // form_vue.error.budget=errorArray["base_type"];
        $("#base_type").focus();//这个预算不是必须验证的。。。
        return false;
   }
   
   return true;
}
function getVueData(form_vue) {
	//获取数据
	var d = {};
	for (var key in pageData) {
		d[key] = {};
		var q = pageData[key];
		for (var n in q) {
			d[key][n] = {};

			var m = form_vue[key][n];
			if (m.valueType === "array") {
				d[key][n] = [];
				m.item.forEach(function (v) {
					if (v.checked === true) {
						d[key][n].push(v.value);
					}
				})
			} else {
				d[key][n] = m.value || "";
			}
		}
	}
    //vue不能同步js修改的input。。。需要自己处理一下j_data_input 为时间输入
        $(".j_data_input").each(function (i) {
            var v1 = this.getAttribute("data-v1");
            var v2 = this.getAttribute("data-v2");
              if(v1&&v2){
                     d[v1][v2]=this.value;               
              }else if(v1){
                    d[v1]=this.value;
              }
        });
	return {data:JSON.stringify(d)};
}
 
function sendMsg(phone,msg_content,form_vue){
    var reg = /^1[345789][0-9]{9}$/;
    var num = phone;
   // var user_type=marketPageVue.user_type.value;

    if(!num||num.length==0){
        form_vue.error.test_msg_phone="手机号码不能为空";
        return false;
    }
    var str=msg_content;
    if(str.length==0){
        form_vue.error.test_msg_phone="发送内容不能为空";
        return false;
    }
    if(reg.test(num)){
        $.post(URL["test_msg"],{moible:num,message:str},function(serverData){
            alert("发送成功，请查看");
        },"json").error(function(){
            alert("服务器错误");
        })
    }else{
        form_vue.error.test_msg_phone="手机号码错误";
    }
}
    function popupUserData(ele,form_vue) {
        $.get(URL["get_customer_info"], {}, function (serverData) {
            var d = formatData2Popup(serverData.data);
            popupSelect.init({data: d, tplName: 'tplRadioboxStr', input: ele,okCallback:function(){
                custmoer_OK(ele,form_vue);
            }});
        }, "json");
    }
    function custmoer_OK(ele,form_vue){
        var k = ele.value;
                    if(k.indexOf(";")){
                        var a = k.split(";")[0];
                     form_vue.extract_task_info.task_name.value=a;
                     get_task_result(customerPopupData[a],form_vue)
            }
    }
        function formatData2Popup(data) {
        var myData = [];
        for (var d in data) {
            data[d].forEach(function (v) {
                v.input_name = "custmoer_input";//checkedbox的name
                customerPopupData[v.name] = {id: v.id, name: v.name, type: v.type};
            });
            myData.push({name: d, item: data[d]});
        }
        return myData;
    }
        function get_task_result(param,form_vue){
        if(param){
            $.get(URL["task_result"],param,function(serverData){
                if(serverData&&serverData.errno==0&&serverData.data){
                    var d = serverData.data;
                    var extract_task_info=form_vue.extract_task_info;
                    extract_task_info.tag_id.value=param.id;
                    extract_task_info.user_type_name.value=USER_TYPE[d.usertype]||"无类型";
                    extract_task_info.user_type.value=d.user_type;
                    extract_task_info.datafile_path.value=d.datafile_path;
                    extract_task_info.rules.value=d.condition;
                    extract_task_info.extract_num.value=d.datafile_rows;
                    extract_task_info.random_num.value=d.sample_rows;
                    extract_task_info.ref_num.value=d.precent_rows;
                    extract_task_info.market_num.value=d.marketing_rows;

                   // form_vue.extract_task_info=extract_task_info;
                }
            },"json")
        }
    }
    function testBtnClick(form_vue){
        //短信的测试
        var test_msg_phone = $("#test_msg_phone");
        var test_msg_btn = $("#test_msg_btn");
        var msg_errorBox = $("msg_errorBox")
       test_msg_btn.bind("click",function(){
         sendMsg(test_msg_phone.val(),form_vue.short_msg_info.msg_content.value,form_vue)
       });
       test_msg_phone.on("focus",function(){
        form_vue.error.test_msg_phone="";
       })
    }
o.init = init;
module.exports = o;
});