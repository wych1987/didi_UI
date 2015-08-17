<?php
include("../layout/header.php");
?>
<div style="padding: 50px;" id="customerBox">
    <div class="ddui-form-item">
        <label class="ddui-label">客户类型</label>
        <select class="ddui-select" v-model="userType" options="userTypeList" v-on="change:userTypeChange"> </select>
    </div>

    <!--
    <ul class="ddui-tab-list">
        <li data-index="1" class="ddui-tab-active">乘客</li>
        <li>乘客</li>
        <li>乘客</li>
        <li>乘客</li>
    </ul>
    -->
    <div class="ddui-form-item">
    <div class="oper-box">
        <ul class="oper-list" v-on="click:customerInput($event)" id="operList">
            <li class="oper-row" v-repeat="row:operList">
                <div class="customer-box">
                    <input type="text" class="ddui-input-01" placeholder="选择人群" v-model="row.a.name"   data-type="customerInput" data-row="a"  v-attr="data-index:$index">
                    <div class="oper-field">
                        <label class="ddui-select-label01" for="oper_a_{{row.tempName}}">计算字段</label>
                        <select type="text" class="ddui-select-01" v-model="row.a.operfield" id="oper_a_{{row.tempName}}">
                            <option value="1">phone</option>
                            <option value="2">pid</option>
                            <option value="3">cid</option>
                            <option value="4">did</option>
                        </select>
                    </div>
                </div>
                <div class="oper-field">
                    <label class="ddui-select-label01" for="oper_type_{{row.tempName}}">运算</label>
                    <select type="text" class="ddui-select-01" v-model="row.operType" id="oper_type_{{row.tempName}}">
                        <option value="1">求交集</option>
                        <option value="2">求并集</option>
                        <option value="3">求差集(A-B)</option>
                    </select>
                </div>
                <div class="customer-box">
                    <input type="text" class="ddui-input-01" placeholder="选择人群" v-model="row.b.name" data-type="customerInput" data-row="b"  v-attr="data-index:$index">
                    <div class="oper-field">
                        <label class="ddui-select-label01" for="oper_b_{{row.tempName}}">计算字段</label>
                        <select type="text" class="ddui-select-01" v-model="row.b.operfield" id="oper_b_{{row.tempName}}">
                            <option value="1">phone</option>
                            <option value="2">pid</option>
                            <option value="3">cid</option>
                            <option value="4">did</option>
                        </select>
                    </div>
                </div>
                <div class="customer-box">
                    <label>临时客户群名称:</label>
                    <span >{{row.tempName}}</span>
                </div>
                <button class="ddui-btn-delete" v-if="$index" v-on="click:deleteRow($index)">删除</button>
            </li>
        </ul>
    </div>
    </div>
    <div class="ddui-form-item">
        <button class="ddui-btn-big ddui-btn-add" v-on="click:addRow">
            <i class="iconfont ddui-font-jiahao"></i>
            添加新运算
        </button>
    </div>
     <div class="ddui-form-item">
         <label class="ddui-label">随机抽取</label>
          <input type="text" placeholder="随机抽取运算结果占比" class="ddui-input-text" number v-model="random_count"/><span>%</span>
    </div>
    <div class="ddui-form-item">
        <label class="ddui-label">参照组占比</label>
        <input type="text" placeholder="随机抽取中参照组占比" class="ddui-input-text" v-model="refer_precent" number/><span>%</span>
    </div>
<div class="ddui-form-item">
        <label class="ddui-label">客户群名称</label>
        <input type="text" placeholder="运算后客户群名称" class="ddui-input-text" v-model="taskName"/>
    </div>

<div class="ddui-form-item">
    <button class="ddui-btn-big ddui-btn-submit" v-on="click:submitForm">提交运算</button>
    <a class="ddui-btn-big ddui-btn-cancel" href="#">取消</a>
</div>
</div>
<script type="text/javascript" src="/static/libs/jqueryUI/autoComplate.min.js"></script>
<!--SCRIPT_PLACEHOLDER-->
<!--RESOURCEMAP_PLACEHOLDER-->
<script>


    function createRow(){
        var p = {a:{name:"",operfield:"1",type:""},b:{name:"",operfield:"1",type:""},operType:"1", tempName:""};
        p.tempName="LS_"+randomStr();
        return p;
    }
 function randomStr(){
     var str = "ASDFGHJKLMNBVCXZQWERTYUIOPqwertyuiopasdfghjkzxcvbnm";
     var num = Math.random().toString().slice(-4);
     var t = "";
     for(var i = 0; i <6;i++){
         var n = ~~(Math.random()*100)%str.length;
         t+=str.charAt(n);
     }
     return t+"__"+num;
 }
 var popup_customer = require("popupCustom");
 var customer_conf = {
     //ele:$(".J_customerInput"),
     ownEvent:"custom_ok",
     type:"radio",
     uploadFile:function(){
         console.log("upload");
     }
 }
 function init(){
     var custorm_vue = new Vue({
         el: '#customerBox',
         data: {
             userTypeList  : [{text:"乘客",value:"1"},{text:"司机",value:"2"}],
             userType:1,
             taskName:"",
             refer_precent:"",
             random_count:"",
             operList:[  ]
         },
         methods:{
             addRow:function(){
                 this.operList.push(createRow());
             },
             deleteRow:function(index){
                 console.log(index);
                 this.operList.splice(index,1);
             },
             customerInput:function(event){
                 var ele  =$(event.target);
                 var t = ele.attr("data-type");
                 if(t ==="customerInput"){
                     custmon.ele = ele;
                     //添加临时客户群
                     index = ele.attr("data-index");
                      getTempCustomer(custorm_vue.operList,index);
                     custmon.openByEle({ele:ele});
                    ele.on("popup_uploadFile",function(){
                        console.log("filepopup") ;
                        //上传控件打开
                    })
                 }
             },
             userTypeChange:function(){
                 custorm_vue.operList=[];
                 custorm_vue.operList.push(createRow());
                    var type = this.userType;
                 custmon.search={type:type};
                 custmon.getCustomData() ;
             } ,
             submitForm:function(){
                 getAjaxParam();
             }
         }
     });
     custorm_vue.operList.push(createRow());
     return custorm_vue;
 }
 var custmon= popup_customer.init(customer_conf);
   var custorm_vue =  init();

    function getAjaxParam() {
        var d = {};
        d.usertype = custorm_vue.userType;
        d.name = custorm_vue.taskName;
        d.refer_precent = custorm_vue.refer_precent;
        d.random_count =custorm_vue.random_count;
        var detail = [];
        var operListDOM=$("#operList").find("li");
        operListDOM.each(function(){
                var input =  this.querySelectorAll("input[data-type='customerInput']");
               for(var i = 0; i <input.length;i++){
                   var index = input[i].getAttribute("data-index");
                   var row = input[i].getAttribute("data-row");
                   custorm_vue.operList[index-0][row].name=input[i].value;
               }
        }) ;
        custorm_vue.operList.forEach(function(v){
            var a = v.a;
            var left_operands_id = "";
            var left_operands_type = "";

            if (a&& a.name) {
               var a_type = a.type ? a.type : custmon.name_map[a.name].type;
                switch (a_type) {
                    case "file":
                        left_operands_id = a.name;
                        break;
                  //  case "tempName":
                  //      left_operands_id = v.tempName;
                    //    break;
                  //  case "tag":
                   //     left_operands_id = popupAllData[a].id;
                   //     break;
                    default:
                        left_operands_id=custmon.name_map[a.name].id;
                        break;
                }
                left_operands_type = a_type;
                left_operator_field= a.operfield;
            }
            var b = v.b;
            var right_operands_id = "";
            var right_operands_type = "";
             if (b&& b.name) {
               var b_type = b.type ? b.type : custmon.name_map[b.name].type;
                switch (b_type) {
                    case "file":
                        right_operands_id = b.name;
                        break;
                  //  case "tempName":
                  //      left_operands_id = v.tempName;
                    //    break;
                  //  case "tag":
                   //     left_operands_id = popupAllData[a].id;
                   //     break;
                    default:
                        right_operands_id=custmon.name_map[b.name].id;
                        break;
                }
                 right_operands_type = b_type;
                 right_operator_field= b.operfield
            }
              detail.push({
                  name : v.tempName,
                  left_operands_id : left_operands_id,
                  left_operands_name : a.name,
                  left_operands_type :left_operands_type,
                  left_operator_field:left_operator_field,
                  right_operands_id : right_operands_id,
                  right_operands_name : b.name,
                  right_operands_type : right_operands_type,
                  right_operator_field:right_operator_field,
                  operators : v.operType

              });
        });
        d.detail = JSON.stringify(detail);
        console.log(d);
        return d;
    }
   function getTempCustomer(operList,index){
    /*   if(!custmon.base){
           custmon.base = {id_map:JSON.parse(JSON.stringify(custmon.id_map)),
               name_map:JSON.parse(JSON.stringify(custmon.name_map)),
               autoData:JSON.parse(JSON.stringify(custmon.autoData)),
               group: JSON.parse(JSON.stringify(custmon.conf.group)),
               groupData: JSON.parse(JSON.stringify(custmon.conf.groupData))
           }
       }
       */
       var base = JSON.parse(JSON.stringify(custmon.base));
       custmon.id_map=base.id_map;
       custmon.name_map=base.name_map;
       custmon.autoData=base.autoData;
       custmon.conf.group=base.group;
       custmon.conf.groupData=base.groupData;
        var tempArray = [];
       operList.forEach(function(v,i){
           var temp = v.tempName;
         ///  custmon.id_map[temp]=temp;
           custmon.id_map[temp]= {
               id: temp ,
               name: temp ,
               parent: "临时客户群" ,
               type: "temp"
       }
           custmon.name_map[temp]= {
               id: temp,
               name: temp ,
               parent: "临时客户群",
               type: "temp"
   }
           custmon.autoData.push(temp);
                 if(i!=index){
                     tempArray.push({value:temp,name:temp,selected:false});
                 }
       });
       if(tempArray.length){
           custmon.conf.group.unshift({name:"临时客户群",id:"ls"});
           custmon.conf.groupData["临时客户群"]=[{item:tempArray}];
       }
       //custmon.conf.group.unshift({name:"上传文件",id:"uploadFile"});
   }
</script>