jQuery.sap.require("de.esconderse.util.Formatter");
jQuery.sap.require("de.esconderse.util.Hektor");

sap.ui.core.mvc.Controller.extend("de.esconderse.view.Forward", {
	registerListener: function(bus){
		bus.subscribe("detail", "closeRename", function(that){
			return function(){that._renameDialog.close();};
		}(this));
		bus.subscribe("detail", "enableRename", function(button){
			return function(){button.setBusy(false);};
		}(this.getView().byId("btnRename")));
		bus.subscribe("detail", "enableActivate", function(button){
			return function(){button.setBusy(false);};
		}(this.getView().byId("btnActivate")));
		bus.subscribe("detail", "enableDeactivate", function(button){
			return function(){button.setBusy(false);};
		}(this.getView().byId("btnDeactivate")));
		bus.subscribe("detail", "enableDelete", function(button){
			return function(){button.setBusy(false);};
		}(this.getView().byId("btnDelete")));
		return this;
	},
	onInit : function() {
		this.registerListener(sap.ui.getCore().getEventBus())
			._getRouter().attachRouteMatched(this.onRouteMatched, this);
	},
	// ---------- actions
	doActivate: function(evt){
		//TODO: get forwardID from model!!!
		var src = evt.getSource();
		sap.m.MessageToast("called doActivate");
		de.esconderse.util.Hektor.activate(id,
			function(data){
			    var msg = 'Success: ' + JSON.stringify(data);
    			sap.m.MessageToast.show(msg);
    			
				var bus = sap.ui.getCore().getEventBus();
				bus.publish("detail", "enableActivate");
				bus.publish("master", "loadList");
			},
			function(data){}
		);
	},
	doDeactivate: function(evt){
		//TODO: get forwardID from model!!!
		var src = evt.getSource();
		sap.m.MessageToast("called doDeactivate");
		de.esconderse.util.Hektor.deactivate(id,
			function(data){
			    var msg = 'Success: ' + JSON.stringify(data);
    			sap.m.MessageToast.show(msg);
    			
				var bus = sap.ui.getCore().getEventBus();
				bus.publish("detail", "enableDeactivate");
				bus.publish("master", "loadList");
			},
			function(data){}
		);
	},
	doDelete: function(evt){
		//TODO: get forwardID from model!!!
		var src = evt.getSource();
	
		sap.m.MessageToast("called doDelete");
		de.esconderse.util.Hektor.delete(id,
			function(data){
			    var msg = 'Success: ' + JSON.stringify(data);
    			sap.m.MessageToast.show(msg);
    			
				var bus = sap.ui.getCore().getEventBus();
				//TODO: move to first item, automatic via List?
				bus.publish("detail", "enableDelete");
				bus.publish("master", "loadList");
			},
			function(data){}
		);
	},
	doRename: function(evt){
		//TODO: get forwardID from model!!!
		var src = evt.getSource(), 
			input = sap.ui.getCore().byId("inputRename"), 
			id = sap.ui.getCore().byId("textId").getText(),
			value = input.getValue();
		if(value.trim() === ""){
			value = input.getPlaceholder();
		}
		de.esconderse.util.Hektor.rename(id, value,
			function(data){
			    var msg = 'Success: ' + JSON.stringify(data);
    			sap.m.MessageToast.show(msg);
				var bus = sap.ui.getCore().getEventBus();
				bus.publish("detail", "closeRename");
				bus.publish("detail", "enableRename");
				bus.publish("master", "loadList");
			},
			function(data){}
		);
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
			forward: path.split("/")[1]
		}, true);
	},
	onDialogRenameOpen: function(evt){
		evt.getSource().setBusy(true);
	    if(!this._renameDialog) {
			this._renameDialog = sap.ui.xmlfragment("de.esconderse.view.fragment.DialogRename", this);
			this.getView().addDependent(this._renameDialog);
		}
//		this.byId("renameDialog").byId("inputRename").setValue();
	    this._renameDialog.open();
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
