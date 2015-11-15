sap.ui.define([
	"sap/ui/Device"
], function(Device){
	"use strict";
	return {
		isTouch: Device.support.touch,
		isNoTouch: !Device.support.touch,
		isPhone: Device.system.phone,
		isNoPhone: !Device.system.phone,
		listMode: Device.system.phone ? "None" : "SingleSelectMaster",
		listItemType: Device.system.phone ? "Active" : "Inactive"
	};
});
