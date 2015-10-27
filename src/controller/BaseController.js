sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History"
], function (Component, Controller, History) {
	"use strict";
	return Controller.extend("de.esconderse.controller.BaseController", {
		getRouter : function () {
			return Component.getRouterFor(this);
		},
		onNavBack: function (sRoute, mData) {
			var oHistory, sPreviousHash;
			oHistory = History.getInstance();
			sPreviousHash = oHistory.getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo(sRoute, mData, true /*no history*/);
			}
		}
	});
});