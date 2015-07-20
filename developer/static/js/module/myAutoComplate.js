define('myAutoComplate', function(require, exports, module){  
	
	  //自执行函数，加载基本的css
	(function(){
		 var css="/static/libs/jqueryUI/jquery-ui.min.css";
		var head = $("head");
		head.append('<link rel="stylesheet" href="'+css+'">');
        head.append('<script type="text/javascript" charset="utf-8" src="/static/libs/jqueryUI/autoComplate.min.js"></script>');
	})();
    var o = {};
    function split( val ) {
        return val.split( /;\s*/ );
    }
    function extractLast( term ) {
        return split( term ).pop();
    }
    
    o.bind=function(dom,data){
		var data = data||[];
        bindAutoComplate(dom,data);
    }
    function bindAutoComplate(dom,data){
        dom.bind( "keydown", function( event ) {
            if ( event.keyCode === $.ui.keyCode.TAB &&
                $( this ).autocomplete( "instance" ).menu.active ) {
                event.preventDefault();
            }
        }).autocomplete({
                minLength: 0,
                source: function( request, response ) {
                    // delegate back to autocomplete, but extract the last term
                    response( $.ui.autocomplete.filter(
                        data, extractLast( request.term ) ) );
                },
                focus: function() {
                    // prevent value inserted on focus
                    return false;
                },
                select: function( event, ui ) {
                    var terms = split( this.value );
                    // remove the current input
                    terms.pop();
                    // add the selected item
                    terms.push( ui.item.value );
                    // add placeholder to get the comma-and-space at the end
                    terms.push( "" );
                    this.value = terms.join( ";" );
					$(this).trigger("blur");
                    return false;
                }
            });
    }
	module.exports=o;
    // return o;
 })