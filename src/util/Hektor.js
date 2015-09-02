sap.ui.define(function(){
	"use strict";
	return {
		create: function(name, state, sucCallback, errCallback){
	//		alert(name + "  " + state);
			this.ajax("create&name=" + name,
					sucCallback, errCallback);//+"&state="+state,
		},
		rename: function(id, name, sucCallback, errCallback){
			this.ajax("rename&id=" + id + "&name=" + name,
					sucCallback, errCallback);
		},
		activate: function(id, sucCallback, errCallback){
			this.ajax("activate&id=" + id,
					sucCallback, errCallback);
		},
		deactivate: function(id, sucCallback, errCallback){
			this.ajax("deactivate&id=" + id,
					sucCallback, errCallback);
		},
		delete: function(id, sucCallback, errCallback){
			this.ajax("delete&id=" + id,
					sucCallback, errCallback);
		},
		url: "https://esconderse.de/gateway.php",
		ajax: function(data, sucCallback, errCallback){
			$.ajax({
				type: "GET", url: this.url,
				data: data,
				success: sucCallback, error: errCallback
			});
		}
	};
});
