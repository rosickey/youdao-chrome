(function() {

    // ✅ 新增：初始化 localStorage.options，防止第一次 parse 出错
    if (!window.localStorage.options) {
        let a = {};
        a.language = "zh-CN";
        a.popupDblclick = "true";
        a.popupSelect = "false";
        a.popupDblclickKey = "none";
        a.popupSelectKey = "ctrl";
        a.enableHttps = "true";
        window.localStorage.options = JSON.stringify(a);
    }

    var saveoptions = function(isinit) {
        var a = {};
        a.language = f.options[f.selectedIndex].value;
        a.popupDblclick = g.checked ? "true" : "false";
        a.popupSelect = k.checked ? "true" : "false";
        a.popupDblclickKey = i.options[i.selectedIndex].value;
        a.popupSelectKey = m.options[m.selectedIndex].value;
        a.enableHttps = "true";
        window.localStorage.options = JSON.stringify(a);

        if (!isinit) {
            var c = document.getElementById("save_status");
            c.style.setProperty("-webkit-transition", "opacity 0s ease-in");
            c.style.opacity = 1;
            window.setTimeout(function() {
                c.style.setProperty("-webkit-transition", "opacity 0.5s ease-in");
                c.style.opacity = 0;
            }, 1E3);
        }

        n(b);
        chrome.runtime.sendMessage({ type: "updateOptions" });
    };

    var b = !1,
        d, e, f, g, h, i, k, l, m,
        r = function() {
            n(b);

            var a = {};
            try {
                a = JSON.parse(window.localStorage.options);
            } catch (e) {
                a.language = "zh-CN";
                a.popupDblclick = "true";
                a.popupSelect = "false";
                a.popupDblclickKey = "none";
                a.popupSelectKey = "ctrl";
                a.enableHttps = "true";
                window.localStorage.options = JSON.stringify(a);
            }

            o(f, a.language);
            g.checked = "true" == a.popupDblclick;
            p();
            k.checked = "true" == a.popupSelect;
            q();
            o(i, a.popupDblclickKey);
            o(m, a.popupSelectKey);
        },
        o = function(a, c) {
            for (var j = 0, w = a.options.length; j < w; j++)
                if (a.options[j].value == c) {
                    a.options[j].selected = !0;
                    break;
                }
        },
        n = function(a) {
            d.disabled = !a;
            e.disabled = !a;
        },
        s = function() {
            n(!0);
        },
        p = function() {
            var a = g.checked;
            i.disabled = !a;
            h.className = a ? "" : "text_disabled";
        },
        q = function() {
            var a = k.checked;
            m.disabled = !a;
            l.className = a ? "" : "text_disabled";
        };

    d = document.getElementById("save_button");
    e = document.getElementById("reset_button");
    f = document.getElementById("language_selector");
    g = document.getElementById("popup_dblclick_checkbox");
    h = document.getElementById("popup_dblclick_text");
    i = document.getElementById("popup_dblclick_key");
    k = document.getElementById("popup_select_checkbox");
    l = document.getElementById("popup_select_text");
    m = document.getElementById("popup_select_key");

    d.addEventListener("click", function() {
        saveoptions();
    }, b);
    e.addEventListener("click", r, b);
    g.addEventListener("change", function() {
        p();
    }, b);
    k.addEventListener("change", function() {
        q();
    }, b);

    for (var t = document.getElementsByTagName("input"), u = 0, v; v = t[u]; u++) v.addEventListener("change", s, b);
    for (var x = document.getElementsByTagName("select"), u = 0, y; y = x[u]; u++) y.addEventListener("change", s, b);

    -1 != window.navigator.platform.toLowerCase().indexOf("mac") && 
    (document.getElementById("popup_dblclick_key_ctrl").innerHTML = "Command", 
    document.getElementById("popup_select_key_ctrl").innerHTML = "Command");

    r();
    saveoptions(true);

    var closebutton = document.getElementById('close_button');
    closebutton.addEventListener('click', function() { window.close(); }, false);
})();
