sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/core/UIComponent",
		"sap/m/MessageToast",
		"de/esconderse/util/Formatter",
		"de/esconderse/util/Hektor"], function(Controller, Component, Toast, Formatter, Hektor){
	"use strict";
	Controller.extend("de.esconderse.controller.Forward", {
		registerListener: function(bus){
			bus.subscribe("detail", "enableRename", function(button){
				return function(){button.setBusy(false); };
			}((this.getView()).byId("btnRename")));
			bus.subscribe("detail", "enableActivate", function(button){
				return function(){button.setBusy(false); };
			}((this.getView()).byId("btnActivate")));
			bus.subscribe("detail", "enableDeactivate", function(button){
				return function(){button.setBusy(false); };
			}((this.getView()).byId("btnDeactivate")));
			bus.subscribe("detail", "enableDelete", function(button){
				return function(){button.setBusy(false); };
			}((this.getView()).byId("btnDelete")));
			return this;
		},
		onInit: function() {
			this.registerListener(sap.ui.getCore().getEventBus())
				._getRouter().attachRouteMatched(this.onRouteMatched, this);
		},
		// ---------- actions
		_getForwardId: function(view){
			var data = view.getModel().getData();
			var path = view.getBindingContext().getPath();
			var index = path.split("/")[2];
			var id = data.list[index].id;
			return id;
		},
		doSelect: function(evt){
			var src = evt.getSource();
			Toast.show("" + src);
		},
		doActivate: function(evt){
			var src = evt.getSource(),
				id = this._getForwardId(this.getView());

			src.setBusy(true);
			de.esconderse.util.Hektor.activate(id,
				function(data){
					var msg = "Success: " + JSON.stringify(data);
					Toast.show(msg);

					var bus = sap.ui.getCore().getEventBus();
					bus.publish("detail", "enableActivate");
					bus.publish("master", "loadList");
				},
				function(/*data*/){}
			);
		},
		doDeactivate: function(evt){
			var src = evt.getSource(),
				id = this._getForwardId(this.getView());

			src.setBusy(true);
			de.esconderse.util.Hektor.deactivate(id,
				function(data){
					var msg = "Success: " + JSON.stringify(data);
					Toast.show(msg);

					var bus = sap.ui.getCore().getEventBus();
					bus.publish("detail", "enableDeactivate");
					bus.publish("master", "loadList");
				},
				function(data){}
			);
		},
		// ---------- navigation
		onNavBack: function() {
			// This is only relevant when running on phone devices
			this._getRouter().myNavBack("main");
		},
		onDetailSelect: function(evt) {
			var src = evt.getSource(), path = src.getPath;
				alert("ondetailselect");

			this._getRouter().navTo("forward", {
				forward: path.split("/")[1]
			}, true);
		},
		onRenameDialog: function (evt) {
			evt.getSource().setBusy(true);
			var that = this;
			var dialog = new sap.m.Dialog({
				title: "{i18n>dialogRename.title}",
				type: "Message",
				content: [
					new sap.m.Label({
						text: "{i18n>dialogRename.labelDescription}",
						labelFor: "inputRename"
					}),
					new sap.m.Input({
						id: "inputRename",
						name: "description",
						placeholder: "{description}"
					})
				],
				beginButton: new sap.m.Button({
					text: "{i18n>dialogRename.btnCancel}",
					press: function () {
						dialog.close();
					}
				}),
				endButton: new sap.m.Button({
					text: "{i18n>dialogRename.btnRename}",
					press: function (/*evt*/) {
						var name = sap.ui.getCore().byId("inputRename").getValue(),
							id = that._getForwardId(that.getView());

						if(name.trim() === ""){
							name = input.getPlaceholder();
						}
						de.esconderse.util.Hektor.rename(id, name,
							function(data){
								var msg = "Success: " + JSON.stringify(data);
								Toast.show(msg);

								var bus = sap.ui.getCore().getEventBus();
								//bus.publish("detail", "closeRename");
								//bus.publish("detail", "enableRename");
								bus.publish("master", "loadList");
							},
							function(/*data*/){}
						);
						dialog.close();
					}
				}),
				beforeClose: function(){
					sap.ui.getCore().getEventBus().publish("detail", "enableRename");
				},
				afterClose: function() {
					dialog.destroy();
				}
			});
			this.getView().addDependent(dialog);
			dialog.open();
		},
		onDeleteDialog: function (evt) {
			var src = evt.getSource(),
				that = this,
				dialog = new sap.m.Dialog({
				title: "{i18n>dialogDelete.title}",
				type: "Message",
				content: [
					new sap.m.Text({
						text: "{i18n>dialogDelete.textConfirm}"
					})
				],
				beginButton: new sap.m.Button({
					text: "{i18n>dialogDelete.btnCancel}",
					press: function () {
						dialog.close();
					}
				}),
				endButton: new sap.m.Button({
					text: "{i18n>dialogDelete.btnDelete}",
					press: function(/*evt*/){
						//TODO: implement confirmation dialog!!
						var id = that._getForwardId(that.getView());

						de.esconderse.util.Hektor.delete(id,
							function(data){
								var msg = "Success: " + JSON.stringify(data);
								Toast.show(msg);

								var bus = sap.ui.getCore().getEventBus();
								//TODO: move to first item, automatic via List?
								bus.publish("detail", "enableDelete");
								bus.publish("master", "loadList");
							},
							function(/*data*/){}
						);
						dialog.close();
					}
				}),
				beforeClose: function(){
					sap.ui.getCore().getEventBus().publish("detail", "enableDelete");
				},
				afterClose: function() {
					dialog.destroy();
				}
			});
			src.setBusy(true);
			this.getView().addDependent(dialog);
			dialog.open();
		},
		// ---------- router
		_getRouter: function(){
			return Component.getRouterFor(this);
		},
		onRouteMatched: function(evt){
			// when detail navigation occurs, update the binding context
			if (evt.getParameter("name") === "forward") {
				this.getView().bindElement("/list/" + evt.getParameter("arguments").forward);
			}
		}
	});
});
