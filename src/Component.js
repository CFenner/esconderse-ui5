sap.ui.define([
	"sap/ui/core/UIComponent",
	"de/esconderse/model/Device",
	"de/esconderse/model/Account",
	"de/esconderse/Router"
], function(Component, DeviceData, AccountData){
	"use strict";
	Component.extend("de.esconderse.Component", {
		metadata: {
			manifest: "json"
		},
		registerListener: function(bus){
			bus.subscribe("master", "loadList", (function(that){
				return function(){ that.doLoadList(); };
			}(this)));
			bus.subscribe("master", "loadAccount", (function(that){
				return function(){ that.doLoadAccount(); };
			}(this)));
			return this;
		},
		init: function() {
			Component.prototype.init.apply(this, arguments);
			var mailModel, deviceModel;

			deviceModel = this.getModel("device");
			deviceModel.setDefaultBindingMode("OneWay");
			deviceModel.setData(DeviceData);

			this.getModel("account").setData(AccountData);
			mailModel = this.getModel();
			mailModel.setDefaultBindingMode("OneWay");
			mailModel.attachRequestCompleted({}, function(){
				sap.ui.getCore().getEventBus().publish("master", "enableRefresh");
			});
			this.getRouter().initialize();
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
				this.getMetadata().getConfig().useMockData ? "model/mailListNew.json" : "https://esconderse.de/gateway.php?list"
			);
			return this;
		},
		doLoadAccount: function(){
			var model = this.getModel("account");
			model.loadData(
				this.getMetadata().getConfig().useMockData ? "model/account.json" : "https://esconderse.de/account"
			);
			return this;
		}
	});
});
