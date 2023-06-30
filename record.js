(function() {
	var Record = {
		record : function(q) {
			var parameters = Date().toString();
			var url = "http://dict.youdao.com/wordbook/ajax?action=addword&q="
					+ encodeURIComponent(q)
					+ "&date="
					+ encodeURIComponent(parameters);
		
		var a = new XMLHttpRequest;
		a.open("GET", url, true);
		a.onreadystatechange = function() {
			if (4 == a.readyState && 200 == a.status){
				data=a.responseText;
				data=JSON.parse(data);
				if (data.message == "adddone")
				{
					alert('adddone');
				}
				if (data.message == "editdone")
				{
					alert('editdone');
				}
				if (data.message == "nouser")
				{
					alert('wordbookstatus_nouser');
				}
			} else if(a.status != 200) {
				alert('error');
			}
	
		};

		a.send();
		}
	};
	window.Record = Record;
})();