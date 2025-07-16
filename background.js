// ----------------------------
// Language map
const LANG_TO_NAME = {
  ar: "Arabic", ca: "Catalan", cs: "Czech", da: "Danish", de: "German",
  el: "Greek", en: "English", es: "Spanish", fi: "Finnish", fr: "French",
  hi: "Hindi", hr: "Croatian", id: "Indonesian", it: "Italian", iw: "Hebrew",
  ja: "Japanese", ko: "Korean", nl: "Dutch", no: "Norwegian", pl: "Polish",
  pt: "Portuguese", ro: "Romanian", ru: "Russian", sr: "Serbian", sk: "Slovak",
  sv: "Swedish", th: "Thai", tl: "Tagalog", tr: "Turkish", uk: "Ukrainian",
  vi: "Vietnamese", "zh-cn": "Chinese", "zh-tw": "Chinese", zh: "Chinese"
};

function isEn(text) {
  text = text.replace(/\s/g, '');
  const zh = text.length - text.replace(/[\u4e00-\u9fa5]+/g, '').length;
  const en = text.length - text.replace(/[a-zA-Z]+/g, '').length;
  return en >= zh;
}

function getZnLanguage() {
  let z = 'zh-CN';
  try {
    const options = JSON.parse(localStorage.options);
    if (options.language === 'zh-TW') {
      z = 'zh-TW';
    }
  } catch (e) {}
  return z;
}

function translateText(q, sl, tl, callback) {
  const url = `http://dict.youdao.com/search?q=${encodeURIComponent(q)}`;
  fetch(url)
    .then(resp => resp.text())
    .then(data => {
      const match = data.match(/<div class="trans-container">([\s\S]*?)<\/div>/);
      if (match) callback(match[0]);
      else callback(null);
    })
    .catch(() => callback(null));
}

function recordWord(q, sendResponse) {
  const url = `http://dict.youdao.com/wordbook/ajax?action=addword&q=${encodeURIComponent(q)}&date=${encodeURIComponent(new Date().toString())}`;
  fetch(url)
    .then(resp => resp.json())
    .then(data => {
      if (data.message === "adddone") {
        sendResponse({ status: "success", message: "添加成功 ✅" });
      } else if (data.message === "editdone") {
        sendResponse({ status: "success", message: "已存在，已更新 ✅" });
      } else if (data.message === "nouser") {
        sendResponse({ status: "error", message: "未登录有道词典 ❌" });
      } else {
        sendResponse({ status: "error", message: "添加失败 ❌" });
      }
    })
    .catch(() => sendResponse({ status: "error", message: "网络错误 ❌" }));
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "youdao-translate",
      title: "Youdao-Translate",
      contexts: ["selection"]
    });
  });
});

chrome.runtime.onStartup.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: "youdao-translate",
      title: "Youdao-Translate",
      contexts: ["selection"]
    });
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "youdao-translate" && info.selectionText) {
    chrome.tabs.create({ url: "http://dict.youdao.com/search?q=" + info.selectionText });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "fetch_raw") {
    const text = message.query;
    const sanitizedQuery = text.trim();
    const meaningObj = {
      prettyQuery: sanitizedQuery,
      meaningText: "查询中...",
      moreUrl: `http://dict.youdao.com/search?q=${encodeURIComponent(sanitizedQuery)}`
    };
    sendResponse({ meaningObj: meaningObj });

    const from = isEn(text) ? 'en' : getZnLanguage();
    const to = isEn(text) ? getZnLanguage() : 'en';
    translateText(text, from, to, (resultHtml) => {
      if (resultHtml) {
        meaningObj.meaningText = resultHtml;
      } else {
        meaningObj.meaningText = "未找到翻译结果。";
      }
      if (sender.tab && sender.tab.id) {
        chrome.tabs.sendMessage(sender.tab.id, {
          type: "update_bubble",
          meaningObj: meaningObj
        });
      }
    });

    return true;
  }

  if (message.type === "record") {
    recordWord(message.text, sendResponse);
    return true;
  }

  if (message.type === "updateOptions") {
    console.log("Options updated from options page");
  }
});
