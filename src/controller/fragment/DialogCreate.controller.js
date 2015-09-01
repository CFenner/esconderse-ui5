sap.ui.define(["sap.ui.core.mvc.Controller", "de.esconderse.util.Hektor"], function(Controller, Hector){
	"use strict";
	return Controller.extend("de.esconderse.controller.fragment.DialogCreate", {
	/*	onInit: function(evt){

		},
	*/	// ---------- actions
		onCreate: function(/*evt*/){
			var description = this.getView().byId("createDescription").getValue(),
				state = this.getView().byId("createState").getState();
			Hektor.create(description, state,
				function(){
					core.getEventBus().publish({}, "master", "enableCreate");
				},
				function(){});
		},
		onCancel: function(/*evt*/){
			var core = sap.ui.getCore();
			core.byId("dialogCreate").close();
			core.getEventBus().publish({}, "master", "enableCreate");
	/*	},
		// ---------- navigation
		onNavBack : function() {
			// This is only relevant when running on phone devices
			this._getRouter().myNavBack("main");
		},
		// ---------- private
		_getRouter: function(){
			return sap.ui.core.UIComponent.getRouterFor(this);
	*/
		}
	});
});
