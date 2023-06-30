(function() {
	var ajax = function(url, callback) {
		var a = new XMLHttpRequest;
		a.open("GET", url, true);
		a.onreadystatechange = function() {
			if (4 == a.readyState)
				if (200 == a.status)
					try {
						return callback(a.responseText);
					} catch (e) {
						return callback(null);
					}
				else
					return callback(null);
		};
		a.send();
	};
	var Translate = {
		translate : function(q, sl, tl, callback) {
			// var url = "http://translate.google.cn/translate_a/t?client=t&sl="
			// 		+ sl
			// 		+ "&tl="
			// 		+ tl
			// 		+ "&hl=en&sc=2&ie=UTF-8&oe=UTF-8&oc=1&otf=2&ssel=0&tsel=0&q="
			// 		+ encodeURIComponent(q);
			// var url = "http://translate.google.com/#"
			// 		+ sl + "/"+ tl + "/"
			// 		+ encodeURIComponent(q);

			var url = "http://dict.youdao.com/search?q=" + encodeURIComponent(q);
			
			ajax(url, function(data) {
				
				// alert(data.match(/<div class="trans-container">([\s\S]*?)<\/div>/)[0]);
				return callback(data.match(/<div class="trans-container">([\s\S]*?)<\/div>/)[0], null);
				if(!data)return callback(null);
				try{
					data=eval(data);
					alert(12);
					
					if (data && data[0] && data[0][0]) {
						return callback(data[0][0][0], data[0][0][1]);
					}
				}catch(e){
					return callback(null);
				}
			});
		}
	};
	window.Translate = Translate;
})();