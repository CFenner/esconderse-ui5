jQuery.sap.require("de.esconderse.util.Formatter");

sap.ui.core.mvc.Controller.extend("de.esconderse.view.Forward", {
	register: function(bus){
		bus.subscribe("detail","closeRename", function(that){
			return function(){that._renameDialog.close();};
		}(this));
		bus.subscribe("detail", "enableRename", function(button){
			return function(){button.setBusy(false);};
		}(this.getView().byId("btnRename")));
	},
	onInit : function() {
		var view = this.getView();
		this._getRouter().attachRouteMatched(this.onRouteMatched, this);
		
		this.register(sap.ui.getCore().getEventBus());
	},
	
	// ---------- actions
	
	doRename: function(evt){
		var src = evt.getSource(), 
			input = sap.ui.getCore().byId("inputRename"), 
			id = sap.ui.getCore().byId("textId").getText(),
			val = input.getValue();
		if(val.trim() === ""){
			val = input.getPlaceholder();
		}
//		alert(id  + val);

		$.ajax({
			type: "GET",
			url: "https://esconderse.de/gateway.php",
			data: "rename&id="+id+"&name="+val,
			success: function(data){
				//this._renameDialog.close();
				/*
			    var msg = 'Success: ' + JSON.stringify(data);
    			sap.m.MessageToast.show(msg);*/
    					
				var bus = sap.ui.getCore().getEventBus();
				bus.publish("detail", "closeRename");
				bus.publish("detail", "enableRename");
				bus.publish("master", "refresh");
			},
			error: function(data){/*
			    var msg = 'Error: ' + JSON.stringify(data);
    			sap.m.MessageToast.show(msg);*/
			}
			
			/*
			Error: {"readyState":4,"responseText":
			"Description: \"Test1\"
			{
				\"status\":\"SUC\",\"msg\":\"success\"}","status":200,"statusText":"OK"}
				
				Error: {"readyState":0,"responseText":"","status":0,"statusText":"error"}
			*/
		});
	},
	
	// ---------- navigation
	onNavBack : function() {
		// This is only relevant when running on phone devices
		this._getRouter().myNavBack("main");
	},
	onDetailSelect : function(evt) {
		var src = evt.getSource(), path = src.getPath;
			alert("ondetailselect");
			
		this._getRouter().navTo("forward", {
			forward : path.split("/")[1]
		}, true);
	},
	onRenameDialog: function(evt){
		var src = evt.getSource();
	    if(!this._renameDialog) {
			this._renameDialog = sap.ui.xmlfragment("de.esconderse.view.fragment.Rename", this);
			this.getView().addDependent(this._renameDialog);
		}
	    //this.getView().byId("inputRename").setValue();
	    sap.ui.getCore().byId("inputRename").setValue();
		src.setBusy(true);
	    this._renameDialog.open();
	},
	onRenameDialogClose: function(evt){
		this._renameDialog.close();
	},
	// ---------- router
	_getRouter: function(){
		return sap.ui.core.UIComponent.getRouterFor(this);
	},
	onRouteMatched: function(evt){
		// when detail navigation occurs, update the binding context
		if (evt.getParameter("name") === "forward") {
			this.getView().bindElement("/list/" + evt.getParameter("arguments").forward);
		}
	}
});
