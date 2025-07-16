(function() {
    let lastX = 0;
    let lastY = 0;
    let lastText = "";

    function getSelectionText() {
        let text = "";
        if (window.getSelection) {
            text = window.getSelection().toString();
        } else if (document.selection && document.selection.type !== "Control") {
            text = document.selection.createRange().text;
        }
        return text.trim();
    }

    function createPopup(content, x, y, moreUrl) {
        let existing = document.getElementById("youdao_translate_popup");
        if (existing) existing.remove();

        const popup = document.createElement("div");
        popup.id = "youdao_translate_popup";
        popup.style.position = "absolute";
        popup.style.left = x + "px";
        popup.style.top = y + "px";
        popup.style.zIndex = 999999;
        popup.style.background = "#ffffe0"; // ✅ 黄色背景
        popup.style.border = "1px solid #ccc";
        popup.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
        popup.style.padding = "10px";
        popup.style.fontSize = "14px";
        popup.style.color = "#333";
        popup.style.maxWidth = "300px";
        popup.style.maxHeight = "400px";
        popup.style.overflowY = "auto";
        popup.style.borderRadius = "4px";
        popup.style.boxSizing = "border-box";

        let btnContainer = `<div style="text-align: right; margin-bottom: 5px;">
            <button id="youdao_voice_btn" style="margin-right: 5px;">🔊</button>
            <button id="youdao_add_btn" style="margin-right: 5px;">Add</button>
            <button id="youdao_close_popup">关闭</button>
        </div>`;

        let html = btnContainer + `<div>${content}</div>`;
        if (moreUrl) {
            html += `<br><a href="${moreUrl}" target="_blank">查看完整释义 »</a>`;
        }
        popup.innerHTML = html;

        document.body.appendChild(popup);

        document.getElementById("youdao_close_popup").addEventListener("click", function() {
            popup.remove();
        });

        document.getElementById("youdao_add_btn").addEventListener("click", function() {
            chrome.runtime.sendMessage({ type: "record", text: lastText }, function(response) {
                if (response && response.status === "success") {
                    document.getElementById("youdao_add_btn").innerText = response.message;
                    document.getElementById("youdao_add_btn").disabled = true;
                } else {
                    document.getElementById("youdao_add_btn").innerText = response.message;
                    setTimeout(() => {
                        document.getElementById("youdao_add_btn").innerText = "Add";
                    }, 2000);
                }
            });
        });

		document.getElementById("youdao_voice_btn").addEventListener("mouseenter", function() {
		    const q = encodeURIComponent(lastText);
		    const src = `https://dict.youdao.com/dictvoice?audio=${q}&type=2`;
		    const audio = new Audio(src);
		    audio.play();
		});
    }

    function requestTranslate(text, x, y) {
        lastX = x;
        lastY = y;
        lastText = text;
        createPopup("查询中...", x, y, `http://dict.youdao.com/search?q=${encodeURIComponent(text)}`);
        chrome.runtime.sendMessage({ type: "fetch_raw", query: text }, function(response) {
            if (response && response.meaningObj && response.meaningObj.meaningText) {
                createPopup(response.meaningObj.meaningText, x, y, response.meaningObj.moreUrl);
            }
        });
    }

    document.addEventListener("dblclick", function(e) {
        const selText = getSelectionText();
        if (!selText) return;
        requestTranslate(selText, e.pageX, e.pageY);
        e.stopPropagation();
    });

    document.addEventListener("click", function(e) {
        const popup = document.getElementById("youdao_translate_popup");
        if (popup && !popup.contains(e.target)) {
            popup.remove();
        }
    });

    chrome.runtime.onMessage.addListener(function(msg) {
        if (msg.type === "update_bubble" && msg.meaningObj && msg.meaningObj.meaningText) {
            createPopup(msg.meaningObj.meaningText, lastX, lastY, msg.meaningObj.moreUrl);
        }
    });
})();
