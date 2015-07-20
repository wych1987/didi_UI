define("marketInfo", function (require, exports, module) {
    var myTool = require("myTool");
    var popupSelect = require("popupSelect");
    var customerPopupData = {};
    var customerInput = {}
    var ajaxURL = {};
    ajaxURL["get_customer_info"] = "/customer_base/get_customer_info";
    ajaxURL["task_result"] = "/customer_base/get_customer_info_by_id";
    var USER_TYPE={
        "1":"乘客",
        "2":"司机"
    }
    var customerInputList = null;
    var o = {};
    var url = "";
    var market_id = "";
    var pageData = {};
    var marketPageVue = {};
    var isLoading = false;
    var testMsgPush=null;
    o.init = function (confData) {
        pageData = confData.data;
        url = confData.url;
        market_id = confData.id;
        var data = formatData(pageData);
        console.log(JSON.stringify(data));
        marketPageVue = new Vue({
            el: '#marketPage',
            data: data,
            methods: {
                pageClick: pageClick,
                savePageData: function () {
                    if (!isLoading) {
                        savePageData();
                    }
                },
                customerClick: function (v, event) {
                    //营销人群的点击
                    var ele = event.target;
                    if (ele.nodeName.toLowerCase() === "input") {
                        var index = ele.getAttribute("data-index");
                        var type = ele.getAttribute("data-type");
                        customerClickByType(v.customer, index, type, ele);
                    }
                },
                user_group_input:function(v,event){
                    var k = event.target.value;
                    if(k.indexOf(";")){
                        var a = k.split(";")[0];
                        get_task_result(customerPopupData[a]);
                    }
                }
            },
            watch: {
                "task_name.value": function (val, oldVal) {
                    // "customer.task_name":function(val, oldVal){
                    var a = val.split(";")[0];
                    get_task_result(customerPopupData[a]);
                }
            }
        });
        customerInputList = $("#customerInputList");
        customerInput = $("#customerInput");
        testMsgPush = $("#test-msgPush");
        popupUserData(customerInput[0]);
		customerInput.on("blur",function(){
			marketPageVue.task_name.value=this.value;
		})
        return marketPageVue;
    }
    function formatData(data) {
        //格式化页面信息供vue模版渲染
        var myData = {};
        for (var key in data) {

            //先验证value
            var d = data[key];
            myData[key] = {value:""};
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
                            myData[key].item.push({value: k, text: d.item[k], checked: checkedObj[k] || false});
                        }
                        break;
                    case "string":
                    case "number":
                        for (var k in d.item) {
                            var m = {value: k, text: d.item[k]};
                            m.checked = m.value === d.value ? true : false;
                            myData[key].item.push(m);
                        }
                        if (!d.value) {
                            myData[key].item[0].checked = true;
                        }
                        myData[key].value = d.value || myData[key].item[0].value;
                        break;
                    default :
                        break;
                }
            } else if (d.value!==undefined) {
                myData[key].value = d.value;
                if(key==="user_type"){
                    myData.user_type_name={
                        value:USER_TYPE[d.user_type]||""
                    }
                }
            }
        }
        myData.msgRule_IsChecked = false;
        myData.appRule_IsChecked = false;
        return myData;
    }

    function pageClick(e) {
        // item.done = !item.done
        var ele = e.target;
        var index = ele.getAttribute("data-index");
        // var checked = ele.checked;
        var key = ele.getAttribute("data-name");
        var type = ele.getAttribute("type");

            switch (type) {
                case "radio":
                    if(key&&index){
                        radioClick(this[key].item, index);
                    }

                    break;
                case "input":
                    break;
                case "checkbox":
                    if(key&&index){
                        checkBoxClick(this[key].item, index, ele);
                    }
                    break;
                case "button":
                    buttonClick(ele);
                    break;
                default :
                    break;
            }
    }

    function radioClick(item, index) {
        item.forEach(function (k) {
            k.checked = false;
        });
        if (index) {
            item[index].checked = true;
        }

    }

    function checkBoxClick(item, index, ele) {
        if (index) {
            item[index].checked = ele.checked;
        }
    }
    function buttonClick(ele){
        var id = ele.id;
        switch (id){
            case "btn-push-msg":
                sendMsg();
                break;
            case "btn-app-push":
                break;
            default :
                break;
        }
    }
function sendMsg(){
    var reg = /^1[345789][0-9]{9}$/;
    var num = testMsgPush.val();
    var user_type=marketPageVue.user_type.value;

    if(!num||num.length==0){
        alert("手机号码不能为空");
        return false;
    }
    var str=marketPageVue.msg_content.value;
    if(str.length==0){
        alert("发送内容不能为空");
        return false;
    }
    if(reg.test(num)){
        $.post("./send_test_shortmsg",{moible:num,message:str,user_type:user_type,act_id:market_id},function(serverData){
            alert("发送成功，请查看");
        },"json").error(function(){
            alert("服务器错误");
        })
    }else{
        alert("手机号码错误")
    }
}
    function savePageData() {
        var data = formatData2save();
        var p = {};
        p.url = url;
        p.data = {};
        if (market_id) {
            p.data.id = market_id;
        }
        p.data.market_data = JSON.stringify(data);
        p.type = "post";
        p.success = function (serverData) {
            isLoading = false;
            if (serverData) {
                if (serverData.code == 200) {
                    alert(serverData.msg || "保存成功");
                    //跳到列表页。。。
                    location.href = "./act_list";
                } else {
                    alert(serverData.msg);
                }
            }
        }
        p.error = function () {
            isLoading = false;
            alert("服务器错误");
        }
        myTool.ajax(p);
        isLoading = true;
    }

    function formatData2save() {
        var d = {};
        for (var key in pageData) {
            d[key] = {};
            var m = marketPageVue[key];
            if (m.valueType === "array") {
                d[key] = [];
                m.item.forEach(function (v) {
                    if (v.checked === true) {
                        d[key].push(v.value);
                    }
                })
            } else {
                d[key] = m.value || "";
            }
        }
        //需要特殊处理日期。。
       $(".j_input_date").each(function(i){
            var k = this.getAttribute("data-key");
           if(d.hasOwnProperty(k)){
               d[k]=this.value;
           }
        });

        return d;
    }

    function customerClickByType(v, index, type, ele) {
        switch (type) {
            case "delete":
                v.item.$remove(index - 0);
                break;
            case "add":
                v.item.push({id: "", name: ""});
                // ele.trigger("click");
                break;
            case "input":
                // var ele = customerInputList.find('.j_customer_input:last');
                // popupUserData(ele, v.item[index]);
                //  popupUserData(ele, v.item[index]);
                break;
        }
    }

    function popupUserData(ele) {
        $.get(ajaxURL["get_customer_info"], {}, function (serverData) {
            var d = formatData2Popup(serverData.data);
            popupSelect.init({data: d, tplName: 'tplRadioboxStr', input: ele,okCallback:function(){
                marketPageVue.task_name.value=ele.value;
            }});
        }, "json");
    }

    function formatData2Popup(data) {
        var myData = [];
        for (var d in data) {
            data[d].forEach(function (v) {
                v.input_name = "custmoer_input";
                customerPopupData[v.name] = {id: v.id, name: v.name, type: v.type};
            });
            myData.push({name: d, item: data[d]});
        }
        return myData;
    }
    function get_task_result(param){
        if(param){
            $.get(ajaxURL["task_result"],param,function(serverData){
                if(serverData&&serverData.errno==0&&serverData.data){
                    var d = serverData.data;
                    marketPageVue.tag_id.value=param.id;
                    marketPageVue.user_type_name.value=USER_TYPE[d.usertype]||"无类型";
                    marketPageVue.user_type.value=d.user_type;
                    marketPageVue.datafile_path.value=d.datafile_path;
                    marketPageVue.rules.value=d.condition;
                    marketPageVue.extract_num.value=d.datafile_rows;
                    marketPageVue.random_num.value=d.sample_rows;
                    marketPageVue.ref_num.value=d.precent_rows;
                    marketPageVue.market_num.value=d.marketing_rows;
                }
            },"json")
        }
    }
    module.exports = o;
});