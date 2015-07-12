jQuery.sap.declare("de.esconderse.util.Hektor");

de.esconderse.util.Hektor = {
	create: function(name, state, sucCallback, errCallback){
//		alert(name + "  " + state);
		this._ajax("create&name="+name,
				sucCallback, errCallback);//+"&state="+state, 
	},
	rename: function(id, name, sucCallback, errCallback){
		this._ajax("rename&id="+id+"&name="+name, 
				sucCallback, errCallback);
	},
	activate: function(id, sucCallback, errCallback){
		this._ajax("activate&id="+id, 
				sucCallback, errCallback);
	},
	deactivate: function(id, sucCallback, errCallback){
		this._ajax("deactivate&id="+id, 
				sucCallback, errCallback);
	},
	delete: function(id, sucCallback, errCallback){
		this._ajax("delete&id="+id, 
				sucCallback, errCallback);
	},
	_url: "https://esconderse.de/gateway.php",
	_ajax: function(data, sucCallback, errCallback){
		$.ajax({
			type: "GET", url: this._url,
			data: data,
			success: sucCallback, error: errCallback
		});
	}
};
