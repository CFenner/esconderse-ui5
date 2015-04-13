jQuery.sap.declare("de.esconderse.Component");
jQuery.sap.require("de.esconderse.Router");

sap.ui.core.UIComponent.extend("de.esconderse.Component", {
	metadata : {
        name : "Esconderse",
        version : "1.0",
        includes : [],
        dependencies : {
            libs : ["sap.m", "sap.ui.layout"],
            components : []
    	},
		rootView : "de.esconderse.view.App",
		config : {
            resourceBundle : "i18n/messageBundle.properties",
            serviceConfig : {
                name : "Northwind",
                serviceUrl : "http://services.odata.org/V2/(S(sapuidemotdg))/OData/OData.svc/"
            }
        },
        routing : {
			config : {
				routerClass : de.esconderse.Router,
				viewType : "XML",
				viewPath : "de.esconderse.view",
				targetAggregation : "detailPages",
				clearTarget : false
			},
			routes : [
				{
					pattern : "",
					name : "main",
					view : "Master",
					targetAggregation : "masterPages",
					targetControl : "idAppControl",
					subroutes : [
						{
							pattern: "",
							name : "welcome",
							view : "Welcome"
						},{
							pattern : "/result/{forward}",
							name : "detail",
							view : "Detail"
						}
					]
				},
				{
					name : "catchallMaster",
					view : "Master",
					targetAggregation : "masterPages",
					targetControl : "idAppControl",
					subroutes : [
						{
							pattern : ":all*:",
							name : "catchallDetail",
							view : "NotFound"
						}
					]
				}
			]
		}
    },
    init : function() {
        sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

        var mConfig = this.getMetadata().getConfig();

        // always use absolute paths relative to our own component
        // (relative paths will fail if running in the Fiori Launchpad)
        var rootPath = jQuery.sap.getModulePath("de.esconderse");

        // set i18n model
        var i18nModel = new sap.ui.model.resource.ResourceModel({
            bundleUrl : [rootPath, mConfig.resourceBundle].join("/")
        });
        this.setModel(i18nModel, "i18n");
        
        // Create and set domain model to the component
        var sServiceUrl = mConfig.serviceConfig.serviceUrl;
        var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl, true);
        this.setModel(oModel);
        
//		var mailModel = new sap.ui.model.json.JSONModel("https://esconderse.de/ajax.php?a=get");
	    var mailModel = new sap.ui.model.json.JSONModel("model/mailList.json");
		this.setModel(mailModel);
		
		var accountModel = new sap.ui.model.json.JSONModel("https://esconderse.de/ajax.php?account");//model/account.json");
		this.setModel(accountModel, "account");
		
		var grantModel = new sap.ui.model.json.JSONModel("model/grant.json");
		this.setModel(grantModel, "grant");
        // set device model
        var deviceModel = new sap.ui.model.json.JSONModel({
            isTouch : sap.ui.Device.support.touch,
            isNoTouch : !sap.ui.Device.support.touch,
            isPhone : sap.ui.Device.system.phone,
            isNoPhone : !sap.ui.Device.system.phone,
            listMode : sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
            listItemType : sap.ui.Device.system.phone ? "Active" : "Inactive"
        });
        deviceModel.setDefaultBindingMode("OneWay");
        this.setModel(deviceModel, "device");
        this.getRouter().initialize();       
    }
});