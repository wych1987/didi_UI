define('navTree', function(require, exports, module){ var o = {}   ;
var tpl = "    <ul class=\"ddui-navtree-box\">\r\n        <li  v-repeat=\"nav:navtree\" v-class=\"ddui-navtree-active:nav.is_active\" v-on=\"click:treeClick(nav)\">\r\n            <dl>\r\n                <dt class=\"ddui-icon-navtree\"><i class=\"iconfont\" v-class=\"nav.iconClass\"></i></dt>\r\n                <dd class=\"ddui-navtree-title01\">\r\n                    <template v-if=\"nav.url\">\r\n                        <a href=\"{{nav.url}}\" target=\"{{targetType}}\">{{nav.name}}</a>\r\n                    </template>\r\n                    <template v-if=\"!nav.url\">\r\n                        {{nav.name}}\r\n                    </template>\r\n                </dd>\r\n            </dl>\r\n        </li>\r\n    </ul>\r\n    <ul class=\"ddui-navtree-trunk-list\" v-class=\"ddui-navtree-trunk-hide:trunkClose\">\r\n        <li class=\"ddui-navtree-trunk \" v-repeat=\"navTrunk:showTrunk\" >\r\n                <h3 class=\"ddui-navtree-trunk-title\" v-class=\"ddui-nav-active:navTrunk.is_active\" v-on=\"click:trunkClick($event)\">\r\n                    <template v-if=\"navTrunk.url\">\r\n                        <a href=\"{{navTrunk.url}}\" target=\"{{targetType}}\">\r\n                            <i class=\"iconfont ddui-icon-trunk-item \" v-class=\"navTrunk.iconClass\"></i><span>{{navTrunk.name}}</span>\r\n                        </a>\r\n                    </template>\r\n                     <template v-if=\"!navTrunk.url\">\r\n                            <i class=\"iconfont ddui-icon-trunk-item\" v-class=\"navTrunk.iconClass\"></i><span>{{navTrunk.name}}</span>\r\n                    </template>\r\n                </h3>\r\n                <div class=\"ddui-navtree-branch\" v-repeat=\"menu:navTrunk.menu\">\r\n                    <h3 class=\"ddui-navtree-leaf-title\" v-on=\"click:leafClick(menu)\" v-class=\"ddui-nav-active:menu.is_active\">\r\n                        <template       v-if=\"menu.url\">\r\n                            <a href=\"{{menu.url}}\" target=\"{{targetType}}\">\r\n                                <i class=\"iconfont ddui-icon-trunk-item ddui-font-dayuhao\"></i><span>{{menu.name}}</span>\r\n                            </a>\r\n                        </template>\r\n                        <template v-if=\"!menu.url\">\r\n                            <i class=\"iconfont ddui-icon-trunk-item ddui-font-dayuhao\"></i><span>{{menu.name}}</span>\r\n                        </template>\r\n                    </h3>\r\n                    <div class=\"ddui-navtree-leaf-list\" v-if=\"menu.menu.length\" v-class=\"hide:!menu.is_active\">\r\n                        <a href=\"{{leaf.url}}\"  target=\"{{targetType}}\" v-repeat=\"leaf:menu.menu\" v-class=\"ddui-nav-active:leaf.is_active\">{{leaf.name}}</a>\r\n                    </div>\r\n                </div>\r\n        </li>\r\n    </ul>\r\n    <div class=\"ddui-nav-trunk-close\" v-on=\"click:trunkCloseClick\" v-class=\"ddui-nav-close-active:trunkClose,hide:!showTrunk.length\">\r\n        <i class=\"iconfont ddui-font-zuosanjiao\"></i>\r\n    </div>\r\n";
var allTree = {};
var iconClassMap={
    "监控中心":    "ddui-font-iconfontshexiangtou",
    "分析中心":"ddui-font-tongjifenxi",
    "数据中心":"ddui-font-shujuku",
    "营销管理":"ddui-font-yingxiaohuodong",
    "运营周报":"ddui-font-zhoujie",
    "标签系统":"ddui-font-biaoqian",
    "专题分析":"ddui-font-jikediancanicon45",
    "报表中心":"ddui-font-tables",
    "多维分析":"ddui-font-zhexiantu"
}
function formatNavtreeData(data) {
    var active_id =null;
    var URL = location.href.split("?")[0];
    var origin = location.origin;
    var reg = /^http:|^https:|^\/\//;
    var tree = [];
    var first = {};
    var b = {}; //所有的id对应的对象
    data.forEach(function (v) {
        var name = v.name;
        if (iconClassMap[v.name]) {
            v.iconClass = iconClassMap[v.name];
        }else{
            v.iconClass='ddui-font-108fenleifangkuai';
        }
        v.menu = [];
        if(!v.url){
            delete v.url;
        }else if(!reg.test(v.url)){
            v.url = origin + v.url;
        }
        v.is_active=false;
        b[v.id] = v;
        if(v.pid ==0){
            tree.push(v);
        }
    });
    data.sort(function (x, y) {
        return y.pid - x.pid;
    });
    for (var key in b) {
        //循环b追加pid
        var k = b[key];
        if (b[k.pid] !== undefined) {
            if (k.url&&URL === k.url) {
                    k.is_active = true;
                    var pid = k.pid;
                    while(b[pid]){
                        b[pid].is_active=true;
                        active_id = b[pid].id;
                        pid = b[pid].pid;
                    }
                }
            b[k.pid].menu.push(k);
        } else if (k.pid != 0) {
            delete b[key];
        }
    }
    allTree = JSON.parse(JSON.stringify(b));
    var showTrunk=b[active_id]?b[active_id].menu:[];
    return {tree:tree,showTrunk:showTrunk};
}
function createNavTree(navData,targetType){
      //var trunkClose = navData.showTrunk.length ?false:true;
      var trunkClose =true;
    var navtree_vue = new Vue({
        el: '#navtreeBox',
        data: {
          //  activeName:'常用功能',
            targetType:targetType||"_blank",
            trunkClose:trunkClose,
            navtree:[
               /* {name:"常用功能1",iconClass:"ddui-font-108fenleifangkuai"},
                {name:"常用功能3",iconClass:"ddui-font-108fenleifangkuai"},
                {name:"常用功能2",iconClass:"ddui-font-108fenleifangkuai"},
                {name:"常用功能2",iconClass:"ddui-font-108fenleifangkuai"},
                {name:"常用功能",iconClass:"ddui-font-108fenleifangkuai"}
                */
            ],
            showTrunk:[
             /*   {
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
                } */
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
                    },
                    trunkCloseClick:function(){
                        this.$dispatch("trunkCloseClick");
                    },
                    trunkClick:function(event){
                        this.$dispatch("trunkClick",event);
                    }
                }
            }
        },
        created:function(){
            this.$on('treeClick', function (v) {
                this.navtree.forEach(function(w){
                    w.is_active=false;
                });
                v.is_active=true;
                this.showTrunk= v.menu;
                this.trunkClose=false;
            });
            this.$on('leafClick', function (v) {
                v.is_active=!v.is_active;
                // return false;
                // this.activeName= v.name;
            });
             this.$on('trunkCloseClick', function () {
                 this.trunkClose = !this.trunkClose;
            });
              this.$on('trunkClick', function (event) {
                   var ele = event.currentTarget;
                  var t = ele.parentNode;
                  t.classList.toggle("ddui-toggle-trunk");
              });

        }
    });
    navtree_vue.navtree=navData.tree;
    navtree_vue.showTrunk=navData.showTrunk;
}

o.init = function(param){
    var d = formatNavtreeData(param.data);
    createNavTree(d,param.targetType);
}
module.exports=o; 
});