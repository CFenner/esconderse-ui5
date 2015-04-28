jQuery.sap.declare("de.esconderse.Component");
jQuery.sap.require("de.esconderse.Router");

sap.ui.core.UIComponent.extend("de.esconderse.Component", {
	useMockData: false,
	metadata : 'json',
    init : function() {
        sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
        var mConfig = this.getMetadata().getConfig();
        // always use absolute paths relative to our own component
        // (relative paths will fail if running in the Fiori Launchpad)
        var rootPath = jQuery.sap.getModulePath("de.esconderse");
        // Create and set domain model to the component
//        this.setModel(new sap.ui.model.odata.ODataModel(mConfig.serviceConfig.serviceUrl, true));
        
        // set i18n model
        this.setModel(
        	new sap.ui.model.resource.ResourceModel({
            	bundleUrl : [rootPath, mConfig.resourceBundle].join("/")
        	}), "i18n")
        .setModel(
        	new sap.ui.model.json.JSONModel({
            	isTouch : sap.ui.Device.support.touch,
            	isNoTouch : !sap.ui.Device.support.touch,
            	isPhone : sap.ui.Device.system.phone,
            	isNoPhone : !sap.ui.Device.system.phone,
        		listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
        		listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
        	})//.setDefaultBindingMode("OneWay")
        	, "device")
        .setModel(
			new sap.ui.model.json.JSONModel(
				this.useMockData
				?"model/account.json"
				:"https://esconderse.de/account"
			)//.setDefaultBindingMode("OneWay")
			, "account")
		.setModel(
			new sap.ui.model.json.JSONModel(
				this.useMockData
				?"model/mailListNew.json"
				:"https://esconderse.de/ajax.php?list"
			)//.setDefaultBindingMode("OneWay")
		)
		.getRouter()
		.initialize();       
    }
});