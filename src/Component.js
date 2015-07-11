jQuery.sap.declare("de.esconderse.Component");
jQuery.sap.require("de.esconderse.Router");

sap.ui.core.UIComponent.extend("de.esconderse.Component", {
    useMockData: false,
    metadata: "json",
    registerListener: function(bus){
        bus.subscribe("master", "loadList", function(that){
             return function(){ that.doLoadList(); };
         }(this));
         bus.subscribe("master", "loadAccount", function(that){
             return function(){ that.doLoadAccount(); };
         }(this));
        return this;
    },
    init: function() {
        sap.ui.core.UIComponent.prototype.init.apply(this, arguments);
        var mConfig = this.getMetadata().getConfig(), mailModel, resourceModel, deviceModel, accountModel;
        // always use absolute paths relative to our own component
        // (relative paths will fail if running in the Fiori Launchpad)
        var rootPath = jQuery.sap.getModulePath("de.esconderse");

        resourceModel = new sap.ui.model.resource.ResourceModel({
            bundleUrl: [rootPath, mConfig.resourceBundle].join("/")
        });
        deviceModel = new sap.ui.model.json.JSONModel({
            isTouch: sap.ui.Device.support.touch,
            isNoTouch: !sap.ui.Device.support.touch,
            isPhone: sap.ui.Device.system.phone,
            isNoPhone: !sap.ui.Device.system.phone,
            listMode: sap.ui.Device.system.phone ? "None" : "SingleSelectMaster",
            listItemType: sap.ui.Device.system.phone ? "Active" : "Inactive"
        });
        deviceModel.setDefaultBindingMode("OneWay");
        mailModel = new sap.ui.model.json.JSONModel();
        mailModel.setDefaultBindingMode("OneWay");
        mailModel.attachRequestCompleted({}, function(){
            sap.ui.getCore().getEventBus().publish("master", "enableRefresh");
        });
        accountModel = new sap.ui.model.json.JSONModel();
        // set i18n model
        this.setModel(mailModel)
            .setModel(deviceModel, "device")
            .setModel(accountModel, "account")
            .setModel(resourceModel, "i18n")
            .getRouter().initialize();

        this.registerListener(sap.ui.getCore().getEventBus());
        this.doLoadList()
            .doLoadAccount();
    },
    onRefreshFinish: function(){
        this.getView();
    },
    doLoadList: function(){
        var model = this.getModel();
        model.loadData(
            this.useMockData ? "model/mailListNew.json" : "https://esconderse.de/gateway.php?list"
        );
        return this;
    },
    doLoadAccount: function(){
        var model = this.getModel("account");
        model.loadData(
            this.useMockData ? "model/account.json" : "https://esconderse.de/account"
        );
        return this;
    }
});
