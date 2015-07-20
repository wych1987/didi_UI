//var fis = module.exports = require('fis');
// 开起 autuload, 好处是，依赖自动加载。
//npm install fis-postpackager-require-async -g 
fis.config.merge({
	statics : '/static',
	modules : {
		//parser : {
		//	less : 'less',
		//	tmpl : 'utc'
		//},
		postprocessor : {
			js : "jswrapper, require-async",
			html : "require-async"
		},
		postpackager : ['autoload', 'simple'],
		lint : {
			js : 'jshint'
		}
	},
	settings : {
		postprocessor : {
			jswrapper : {
				type : 'amd'
			}
		},
		lint : {
			jshint : {
				camelcase : true,
				curly : true,
				eqeqeq : true,
				forin : true,
				immed : true,
				latedef : true,
				newcap : true,
				noarg : true,
				noempty : true,
				node : true
			}
		}
	}
});

	fis.config.set('pack', {
		'/static/css/didi_UI.css' : ['**/dd_base.css',/widget\/.*\.css/i]
	});
	

//fis的组件化，自动加载同名文件 js css html
fis.config.set('roadmap.path', [
		{
			reg : /widget\/([^\/]+)\/\1\.(js)$/i,
			isMod : true,
			id : '$1',
			useHash : true
		}, {
			reg : /widget\/(.*)\.(js)$/i,
			isMod : true,
			id : '$1',
			useHash : true
		},
		{
			reg : /libs/i,
			useCompile : false,
			useHash : false,
			 isMod : false
		},
		{
			reg : /static\/css\/([^.]+)\.css$/i,
			release : '/static\/css\/$1\.css'
		},

		// 标记 isMod 为 true, 这样，在 modules 里面的满足 commonjs 规范的 js 会自动包装成 amd js, 以至于能在浏览器中运行。
		//
		{
			reg : /^\/static\/js\/([^\/]+)\/([^.]+)\.js$/i,
			isMod : true,
			id : "$2",
			release : '/static\/js\/$1/\$2\.js'
		}
	]);
	//fis release -m -p -d D:\xampp\htdocs\fisOutput
