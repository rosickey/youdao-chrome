var $=function(id){
	return document.getElementById(id);
};
var langSelect=$('language_selector');
var dictSwitch=$('popup_dblclick_checkbox');
var saveButton=$('save_button');

var init=function(){
	if(localStorage['lang']=='zh-TW'){
		langSelect.value='zh-TW';
	}else{
		langSelect.value='zh-CN';
	}
	if(localStorage['dict']!='0'){
		dictSwitch.checked=true;
	}else{
		dictSwitch.checked=false;
	}
};
init();

saveButton.addEventListener('click',function(){
	localStorage['lang']=langSelect.value;
	localStorage['dict']=dictSwitch.checked?'1':'0';
	window.close();
}, false);





