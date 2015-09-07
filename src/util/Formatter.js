//sap.ui.define([
jQuery.sap.declare("de.esconderse.util.Formatter");
jQuery.sap.require("de/esconderse/resources/thirdParty/moment-with-locales");
//], function(){
//	"use strict";
	/*globals moment*/
//	return 
	function getUsage(max, current){
		var usage = 0.0;
		if(max > 0){
			usage = current / (max / 100);
			usage = usage < 0 ? 0.0 : usage;
			usage = usage > 100 ? 100.0 : usage;
		}
		return usage;
	}

	de.esconderse.util.Formatter = {
		uppercaseFirstChar: function(sStr) {
			return sStr.charAt(0).toUpperCase() + sStr.slice(1);
		},
		discontinuedStatusState: function(sDate) {
			return sDate ? "Error" : "None";
		},
		discontinuedStatusValue: function(sDate) {
			return sDate ? "Discontinued" : "";
		},
		currencyValue: function (value) {
			return parseFloat(value).toFixed(2);
		},
		// ---------- Status
		statusIcon: function(status){
			return status === 1 ? "sap-icon://connected" : "sap-icon://disconnected";
		},
		statusText: function(status, active, inactive){
			return status === 1 ? active : inactive;
		},
		statusState: function(status){
			return status === 1 ? "Success" : "Error";
		},
		statusSetClass: function(status){
			this.getParent().addStyleClass("esc-" + (status === 1 ? "active" : "inactive"));
		},
		// ---------- Usage
		usageText: function(max, current){
			return max && current ? current + " von " + max : "";
		},
		usagePercent: function(max, current){
			return getUsage(max, current);
		},
		usageState: function(max, current){
			var usage = getUsage(max, current);
			return usage > 90 ? "Error" : usage > 60 ? "Warning" : "Success";
		},
		// ---------- Date
		datePretty: function(date/*, secondsSingle, secondsMulti*/){
			return moment(date, "YYYY-MM-DD hh:mm:ss", "de").fromNow();
		}
	};
//});
