jQuery.sap.require("de.esconderse.util.Formatter");

sap.ui.core.mvc.Controller.extend("de.esconderse.view.Account", {
	onInit: function(/*evt*/){},
	// ---------- navigation
	onNavBack : function() {
		// This is only relevant when running on phone devices
		sap.ui.core.UIComponent.getRouterFor(this).myNavBack("main");
	}
});
