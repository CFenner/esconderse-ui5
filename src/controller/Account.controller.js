sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/UIComponent",
		"de/esconderse/util/Formatter"
], function(Controller, Component/*, Formatter*/){
	"use strict";
	Controller.extend("de.esconderse.controller.Account", {
		onInit: function(/*evt*/){},
		// ---------- navigation
		onNavBack: function() {
			// This is only relevant when running on phone devices
			Component.getRouterFor(this).myNavBack("main");
		}
	});
});
