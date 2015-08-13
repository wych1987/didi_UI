var o = {}   ;
var tpl = __inline("./navTree.tpl.html");
/*
var navTreeComponent = Vue.extend({
    props: ['navtree','showTrunk',"targetType"],
    template:tpl
})
Vue.component('navtree', navTreeComponent);
           */
var navtree_vue = new Vue({
    el: '#navtreeBox',
    data: {
        activeName:'常用功能',
        targetType:"_blank",
        trunkClose:false,
        navtree:[
            {name:"常用功能1",iconClass:"ddui-font-108fenleifangkuai"},
            {name:"常用功能3",iconClass:"ddui-font-108fenleifangkuai"},
            {name:"常用功能2",iconClass:"ddui-font-108fenleifangkuai"},
            {name:"常用功能2",iconClass:"ddui-font-108fenleifangkuai"},
            {name:"常用功能",iconClass:"ddui-font-108fenleifangkuai"}
        ],
        showTrunk:[
            {
            name:"监控系统",
            className :"ddui-font-tongjifenxi",
            menu:[
                {name:"出租车",url:"123",is_active:false},
                {name:"出租车",url:"123",is_active:false},
                {name:"出租车",url:"123",is_active:false},
                {name:"出租车",url:"123",is_active:false}
            ]
        } , {
            name:"监控系统",
            className :"ddui-font-tongjifenxi",
            url:"111"
        } ,
              {
            name:"监控系统",
            className :"ddui-font-tongjifenxi",
            menu:[
                {name:"出租车",url:"123",is_active:false},
                {name:"出租车",url:"123",is_active:false},
                {name:"出租车",url:"123",is_active:false},
                {name:"出租车",url:"123",is_active:false}
            ]
        } ,
              {
            name:"监控系统",
            className :"ddui-font-tongjifenxi",
            menu:[
                {name:"出租车",url:"123",is_active:false},
                {name:"出租车",url:"123",is_active:false},
                {name:"出租车",url:"123",is_active:false},
                {name:"出租车123",is_active:false,menu:[
                    {name:"出租车",url:"123",is_active:false},
                    {name:"出租车",url:"123",is_active:false},
                    {name:"出租车",url:"123",is_active:false}
                ]
                }
            ]
        }
          ]
    },
    components:{
       "navtreeComponent":{
           inherit: true,
           replace:true,
           template:tpl,
           methods:{
               treeClick:function(v){
                   this.$dispatch("treeClick",v);
               },
               leafClick:function(v){
                   this.$dispatch("leafClick",v);
               }
           }
        }
    },
    created:function(){
        this.$on('treeClick', function (v) {
            console.log(v)
            this.activeName= v.name;
        });
        this.$on('leafClick', function (v) {
            v.is_active=!v.is_active;
            console.log(v);

           // return false;
           // this.activeName= v.name;
        });
    },
    methods:{
        trunkCloseClick:function(){
            this.trunkClose = !this.trunkClose;
        }
    }
});
module.exports=o;