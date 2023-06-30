var isEn=function(text){
	text=text.replace(/[ \s]/g,'');
	var zh=text.length-text.replace(/[\u4e00-\u9fa5\s]+/g,'').length;
	var en=text.length-text.replace(/[a-zA-Z]+/g,'').length;
	return en>=zh?true:false;
};
var getZnLanguage=function(){
	var z='zh-CN';
	try{
		var options=JSON.parse(window.localStorage.options);
		if(options.language=='zh-TW'){
			z='zh-TW';
		}
	}catch(e){}
	return z;
};
// var getTranslateUrl=function(text){
// 	var z=getZnLanguage();
// 	if(isEn(text)){
// 		return "http://translate.google.cn/?hl="+z+"#en|"+z+"|"+text;
// 	}
// 	return "http://translate.google.cn/?hl=en#"+z+"|en|"+text;
// };
var getTranslateUrl=function(text){
    var z=getZnLanguage();
    if(isEn(text)){
        return "http://translate.google.com/"+"#en/"+z+"/"+text;
    }
    return "http://translate.google.com/#"+z+"/en/"+text;
};
var genericOnClick=function(info, tab) {
	if(info&&info.selectionText){
		window.open("http://dict.youdao.com/search?q="+info.selectionText);
	}
};
var menue_id = chrome.contextMenus.create({"title": "Youdao-Translate", "contexts":["selection"],
                                    "onclick": genericOnClick});


var gv=localStorage['g-v'];
if(!gv){
	localStorage['g-v']='2';
	window.open('options.html');
}

(function() {
    var f = "\" ' ( ) , - . / 0 1 2 : ? a about and are as be but com for from have i in is it like may more my next not of on search that the this to was when with you your".split(" "),
    m = true,
    p = {},
    q = {},
    r = 0,
    s = -1,
    v = -1,
    w = function(a) {
        a = a.replace(/<[^>]*>/g, "");
        return a = a.replace(/[<>]/g, "")
    },
    x = function(a) {
        a = w(a);
        return a = a.substring(0, 600).toLowerCase()// 文字长度限制
    },
    y = function(a) {
        for (var b = 0,
        c = f.length; b < c; b++) if (a == f[b]) return ! 0;
        return ! 1
    },
    z = function(a, b, c) {
    	if("initialize"==a.type){
    		c({instanceId: r++});
    	}
        if("record"==a.type){
            window.Record.record(a.text);
        }else if("voice"==a.type){
    		window.Voice.read(a.text);
    		c();
    	}
    },
    A = function(a, b, c) {
        "options" == a.type && c({
            options: p
        })
    },
    E = function(a, b, c) {
        if ("fetch_raw" != a.type && "fetch_html" != a.type) return false;
         - 1 != s && v != a.instanceId && chrome.tabs.sendMessage(s, {
            type: "hide",
            instanceId: v
        });
        "fetch_raw" == a.type ? (s = b.tab.id, v = a.instanceId) : v = s = -1;
        var d = x(a.query),
        e = function() {
            var b = {
                request: a,
                sanitizedQuery: d,
                dictRes: null,
                enDictRes: null,
                tranRes: null,
                tabLangTranRes: null,
                tabLangTranReqTimedOut: false,
                tabLang: null,
                callback: c,
                incognito: false
            };
            C(b);
        };
        e();
        return true;
    },
    B = function(a, b, c) {},
    D = function(a, b, c) {},
    C = function(a) {
    	var zn=getZnLanguage();
    	var text=a.sanitizedQuery;
    	var isen=isEn(text);
        window.Voice.read(text);
    	window.Translate.translate(text,isen?'en':zn,isen?zn:'en',function(ret){
    		var h={
    	        	moreUrl:getTranslateUrl(text),
    	        	prettyQuery:text,
    	        	meaningText:ret
    	        };
    		var g = {
                    eventKey: a.request.eventKey,
                    sanitizedQuery: a.sanitizedQuery,
                    meaningObj: h,
                    showOptionsTip: false
                };
            a.callback(g);
    	});
},
    H = function(a, b) {
        if (!a || a.sentences[0].orig.toLowerCase() == a.sentences[0].trans.toLowerCase()) return null;
        var c;
        c = a.sentences[0].orig.toLowerCase();
        var d = a.sentences[0].trans.toLowerCase(),
        e = d;
        if (b && a.dict && 0 < a.dict.length) for (var k = 0,
        g = a.dict.length; k < g; k++) for (var n = a.dict[k], l = 0, h = 0, t = n.terms.length; h < t && 2 > l; h++) {
            var u = n.terms[h].toLowerCase();
            0 < u.length && u != c && u != d && (e += ", " + u, l++)
        }
        c = w(e); (d = window["gdx.LANG_TO_NAME"][a.src.toLowerCase()]) || (d = a.src);
        return {
            type: "translation",
            meaningText: c,
            attribution: "Translated from " + d,
            srcLang: a.src
        }
    },
    F = function(a, b) {
        for (var c = b.split("."), d = 0; d < c.length; d++) {
            var e = c[d];
            console.assert(e);
            if ("]" === e.charAt(e.length - 1)) {
                e = e.split("[");
                console.assert(2 === e.length);
                var k = parseInt(e[1].slice(0, -1), 10);
                a = a[e[0]];
                if (!a) return null;
                a = a[k]
            } else a = a[e];
            if (!a) return null
        }
        return a
    },
    K = function(a) {
        return "//" == a.substr(0, 2) ? "https:" + a: a
    },
    G = function(a) {},
    I = function(a, b, c) {
        var d = H(a, !1);
        if (!d) return "";
        b && (d.audio = b);
        a.tranResSummary = d;
        a.moreUrl = c;
        a.hasDict = Boolean(a.dict) && a.dict.length;
        return q.browser_action_tran(a)
    },
    J = function(a, b) {
        if (!a || a.error) return "";
        a.moreUrl = b;
        a.makeAudioUrl = function() {
            var a = this.drEyeAudio;
            return a ? K(a) : ""
        };
        var c = {};
        a.showOnlyOnce = function() {
            return function(a, b) {
                var k = b(a);
                if (c[k]) return "";
                c[k] = !0;
                return k
            }
        };
        return q.browser_action_dict(a)
    },
    L = function(a) {
        var b = {};
        b.language = a.language || "en";
        var c = function(c, d) {
            var g = a[c];
            b[c] = d;
            "true" == g || "false" == g ? b[c] = g: "boolean" == typeof g && (b[c] = String(g))
        },
        d = function(c, d) {
            b[c] = a[c] || d
        };
        c("popupDblclick", "true");
        c("popupSelect", "false");
        c("enableHttps", "true");
        d("popupDblclickKey", "none");
        d("popupSelectKey", "ctrl");
        c("storeHistory", "false");
        c("allowCrossExtensionHistory", "false");
        "pt" == a.language && (b.language = "pt-BR");
        return b
    },
    M = function(a, b, c) {
    	return false;
    },
    N = function(a, b) {
        var c = new XMLHttpRequest;
        c.open("GET", a);
        c.onreadystatechange = function() {
            if (4 == c.readyState) return 200 == c.status ? b(c.responseText) : b(null)
        };
        c.send()
    },
    init = function() {
        var a = window.localStorage.options,
        b = {};
        a && (b = JSON.parse(a));
        p = L(b);
        window.localStorage.options = JSON.stringify(p);
        chrome.runtime.onMessage.addListener(z);
        chrome.runtime.onMessage.addListener(A);
        chrome.runtime.onMessage.addListener(E);
        chrome.runtime.onMessageExternal.addListener(M)
    };
    window["gdx.updateOptions"] = function() {
        p = JSON.parse(window.localStorage.options)
    };
    init();  
})();
