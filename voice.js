(function(){
	var $$=function(id){
		return document.getElementById(id);
	};
	var Task=function(text,lang){
		this.text=text||"";
		this.textArray=Task.split(text);
		this.index=0;
		this.lang=lang;
	};
	Task.charCount=function(c){
		return encodeURIComponent(c).length===9?2:1;
	};
	Task.lastCharIndexOf=function(str,regexp,endIndex){
		endIndex=endIndex||0;
		for(var i=str.length; i>=endIndex; i--){
			if(regexp.test(str.charAt(i)))return i;
		}
		return -1;
	};
	Task.MAX_LEN=100;
	Task.split=function(text){
		var textArray=[];
		var i,l=text.length,count=0,m=0,temp,n=0;
		for(i=0; i<l; i++){
			count+=Task.charCount(text.charAt(i));
			if(i==l-1||count==Task.MAX_LEN||count==Task.MAX_LEN-1&&Task.charCount(text.charAt(i+1))==2){
				temp=text.substring(m,i+1);
				if(i==l-1){
					textArray.push(temp);
				}else{
					n=Task.lastCharIndexOf(temp,/[,.;\s，。；？！?!]/,temp.length/2);
					if(n==-1){
						textArray.push(temp);
						m=i+1;
						count=0;
					}else{
						textArray.push(temp.substring(0,n));
						i-=temp.length-1-n;
						m=i+1;
						count=0;
					}
				}
			}
		}
		return textArray;
	};
	Task.prototype={
		getTextToRead:function(){
			if(this.index==this.textArray.length)return null;
			return this.textArray[this.index++];
		}
	};
	var TaskManager={
			task:null,
			audio:null,
			readText:function(toread,lang){
				if(!toread)return;
				audio.pause();
				TaskManager.task=new Task(toread,lang);
				TaskManager.playNext();
			},
			isEn:function(text){
				text=text.replace(/[ \s]/g,'');
				var zh=text.length-text.replace(/[\u4e00-\u9fa5\s]+/g,'').length;
				var en=text.length-text.replace(/[a-zA-Z]+/g,'').length;
				return en>=zh?true:false;
			},
			getReadUrl:function(text){
				var tl=isEn(text)?'en':'zh-CN';
				var src='http://translate.google.cn/translate_tts?ie=UTF-8&q='+q+'&tl='+tl+'&total=1&idx=0&prev=input';
			},
			playText:function(text,lang){
				var q=encodeURIComponent(text);
				var tl=lang||(TaskManager.isEn(text)?'en':'zh-CN');
				// var src='http://translate.google.cn/translate_tts?ie=UTF-8&q='+q+'&tl='+tl+'&total=1&idx=0&prev=input';
				var src='https://dict.youdao.com/dictvoice?audio='+q+'&type=2';
				audio.src=src;
				audio.play();
			},
			playNext:function(){
				if(!TaskManager.task)return;
				var text=TaskManager.task.getTextToRead();
				if(!text)return;
				
				TaskManager.playText(text,TaskManager.task.lang);
			},
			init:function(){
				var audio=$$('audio');
				TaskManager.audio=audio;
				audio.addEventListener('ended',TaskManager.playNext,false);
			}
	};
	TaskManager.init();


	var Voice={
		trim:function(str) {
			return str.trim ? str.trim() : str.replace(/^\s+/, '').replace(/\s+$/, '');
		},
		read:function(text, lang){
			TaskManager.readText(text,lang);
		},
		setVolume:function(volume){//0.0-1.0
			document.getElementById('audio').volume=volume;
		}
	};
	window.Voice=Voice;

})();

