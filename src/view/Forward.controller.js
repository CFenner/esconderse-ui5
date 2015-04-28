jQuery.sap.require("de.esconderse.util.Formatter");

sap.ui.core.mvc.Controller.extend("de.esconderse.view.Forward", {
	onInit : function() {
		var view = this.getView();
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.attachRouteMatched(this.onRouteMatched, this);
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
		
		alert(id  + val);

		$.ajax({
			url: "https://esconderse.de/ajax.php",
			data: "?rename&id="+id+"&name="+val,
			success: function(){
				alert("success");
			},
			error: function(){
				alert("error");
			}
		});
	},
	
	// ---------- navigation
	onNavBack : function() {
		// This is only relevant when running on phone devices
		sap.ui.core.UIComponent.getRouterFor(this).myNavBack("main");
	},
	onDetailSelect : function(evt) {
		var src = evt.getSource(), path = src.getPath;
			alert("ondetailselect");
			
		router.navTo("forward", {
//		sap.ui.core.UIComponent.getRouterFor(this).navTo("forward", {
			forward : path.split("/")[1]
		}, true);
	},
	onRenameDialog: function(evt){
	    if(!this._renameDialog) {
			this._renameDialog = sap.ui.xmlfragment("de.esconderse.view.fragment.Rename", this);
			this.getView().addDependent(this._renameDialog);
		}
	    //this.getView().byId("inputRename").setValue();
	    sap.ui.getCore().byId("inputRename").setValue();
	    this._renameDialog.open();
	},
	onRenameDialogClose: function(evt){
		this._renameDialog.close();
	},
	// ---------- router
	onRouteMatched: function(evt){
		// when detail navigation occurs, update the binding context
		if (evt.getParameter("name") === "forward") {
			this.getView().bindElement("/" + evt.getParameter("arguments").forward);
		}
	}
});