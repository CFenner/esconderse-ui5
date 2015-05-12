jQuery.sap.require("de.esconderse.util.Hektor");

sap.ui.core.mvc.Controller.extend("de.esconderse.view.fragment.DialogRename", {
/*	onInit: function(evt){},	*/
	// ---------- actions
	onRename: function(evt){
		var src = evt.getSource(), 
			core = sap.ui.getCore(),
			input = this.getView().byId("inputRename"), 
//			input = sap.ui.getCore().byId("inputRename"), 
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
	onCancel: function(evt){
		var core = sap.ui.getCore();
		core.byId("dialogRename").close();
		
		var bus = core.getEventBus();
		bus.publish("detail", "closeRename");
		bus.publish("master", "enableRename");
	}
});
