sap.ui.define([
		"de/esconderse/controller/BaseController",
		"sap/ui/core/UIComponent",
		"sap/m/MessageToast",
		"sap/m/Dialog",
		"sap/m/Input",
		"sap/m/Label",
		"sap/m/Button",
		"sap/ui/Device",
		"de/esconderse/util/Formatter",
		"de/esconderse/util/Hektor"
], function(Controller, Component, Toast, Dialog, Input, Label, Button, Device, Formatter, Hektor){
	"use strict";
	return Controller.extend("de.esconderse.controller.Master", {
		registerListener: function(bus){
			bus.subscribe("master", "enableRefresh", function(control){
				return function(){
					control.setBusy(false);
					control.hide();
				};
			}((this.getView()).byId("pullToRefresh")));
			bus.subscribe("master", "enableCreate", function(control){
				return function(){
					control.setBusy(false);
				};
			}((this.getView()).byId("btnCreate")));
			return this;
		},
		onInit: function() {
			/* eslint-disable new-cap */
			this.oUpdateFinishedDeferred = jQuery.Deferred();
			/* eslint-enable new-cap */
			// ??
			this.getView().byId("mailList").attachEventOnce("updateFinished", function() {
				this.oUpdateFinishedDeferred.resolve();
			}, this);

			this.registerListener(sap.ui.getCore().getEventBus())
				.getRouter().attachRouteMatched(this.onRouteMatched, this);
		},
		// ---------- navigation
		selectFirst: function() {
			if (!Device.system.phone) {
				var list = this.getView().byId("mailList"),
					itemList = list.getItems();
				if (itemList.length && !list.getSelectedItem()) {
					list.setSelectedItem(itemList[0], true);
					this.selectForward(itemList[0]);
				}
			}
		},
		selectForward: function(item) {
			var path = item.getBindingContext().getPath(),
				index = path.split("/")[2];

			// If we"re on a phone, include nav in history; if not, don"t.
			var bReplace = jQuery.device.is.phone ? false : true;
			this.getRouter().navTo("forward", {
				from: "master",
				forward: index
			}, bReplace);
		},
		// ---------- list
		onSearch: function (evt, refreshButtonPressed) {
			if(refreshButtonPressed){
				this.onRefresh(evt);
			}
			// add filter for search
			var filters = [];
			var query = evt.getSource().getValue().trim();
			if (query && query.length > 0) {
				filters.push(
					new sap.ui.model.Filter(
						"description",
						sap.ui.model.FilterOperator.Contains,
						query
					)
				);
			}
			// update list binding
			var list = this.getView().byId("mailList");
			var binding = list.getBinding("items");
			binding.filter(filters, "Application");
		},
		onRefresh: function(/*evt*/){
			var bus = sap.ui.getCore().getEventBus();
			bus.publish("master", "loadList");
		},
		onForward: function(evt, listItem/*, listItemArray, isSelected*/) {
			listItem = evt.getParameter("listItem") || evt.getSource();
			//isSelected = evt.getParameter("selected");
			// Get the list item, either from the listItem parameter or from the event"s
			// source itself (will depend on the device-dependent mode).
			this.selectForward(listItem);
		},
		// ---------- footer
		onHome: function(/*evt*/){
			// If we"re on a phone, include nav in history; if not, don"t.
			var bReplace = jQuery.device.is.phone ? false : true;
			this.getRouter().navTo("account", {
				from: "master",
				forward: null
			}, bReplace);
		},
		onLogout: function(/*evt*/){
			/*globals window*/
			window.location = "https://esconderse.de/logout.php";
		},/*
		onMenuUsage: function(evt){
			if(!this.usagePopover) {
				this.usagePopover = sap.ui.xmlfragment("de.esconderse.view.fragment.PopoverUsage", this);
				this.getView().addDependent(this.usagePopover);
			}
			this.usagePopover.openBy(evt.getSource());
		},*/
		onMenuFilter: function(evt){
			if(!this.filterSheet){
				this.filterSheet = sap.ui.xmlfragment("de.esconderse.view.fragment.ActionFilter", this);
				this.getView().addDependent(this.filterSheet);
			}
			this.filterSheet.openBy(evt.getSource());
		},
		onFilterReset: function(/*evt*/){ this.setFilter(false); },
		onFilterActive: function(/*evt*/){
	//		var src = evt.getSource();
			//alert(src.getData("data-status"));
	//		evt.getSource().set
			this.setFilter(true, true);
		},
		onFilterInactive: function(/*evt*/){ this.setFilter(true, false); },
		setFilter: function(doFilter, active){
			var filter = doFilter
				? [new sap.ui.model.Filter(
					"status",
					sap.ui.model.FilterOperator.EQ,
					(active ? 1 : 0)
				)]
				: [];
			this.getView().byId("mailList").getBinding("items").filter(filter);
		},
		onDialogCreateOpen: function(evt){
			evt.getSource().setBusy(true);
			if(!this.createDialog) {
				this.createDialog = sap.ui.xmlfragment("de.esconderse.view.fragment.DialogCreate", this);
				this.getView().addDependent(this.createDialog);
			}
			this.byId("inputCreate").setValue();
			this.createDialog.open();
		},
		onCreateDialog: function (evt) {
			var src = evt.getSource(),
/*				that = this,*/
				dialog = new Dialog({
				title: "{i18n>dialogCreate.title}",
				type: "Message",
				content: [
					new Label({
						text: "{i18n>dialogCreate.labelDescription}",
						labelFor: "inputCreate"
					}),
					new Input({
						id: "inputCreate",
						name: "description",
						placeholder: "{description}"
					})
				],
				beginButton: new Button({
					text: "{i18n>dialogCreate.btnCancel}",
					press: function () {
						dialog.close();
					}
				}),
				endButton: new Button({
					text: "{i18n>dialogCreate.btnCreate}",
					press: function (/*evt*/) {
						var /*src = evt.getSource(),*/
	//						id = that.getForwardId(that.getView()),
							name = sap.ui.getCore().byId("inputCreate").getValue();

						Hektor.create(name, 0,
							function(data){
								var msg = "Success: " + JSON.stringify(data);
								Toast.show(msg);

								var bus = sap.ui.getCore().getEventBus();
								bus.publish("master", "loadList");
							},
							function(/*data*/){}
						);
						dialog.close();
					}
				}),
				beforeClose: function(){
					sap.ui.getCore().getEventBus().publish("master", "enableCreate");
				},
				afterClose: function() {
					dialog.destroy();
				}
			});
			src.setBusy(true);
			this.getView().addDependent(dialog);
			dialog.open();
		},
		// ---------- Router
		onRouteMatched: function(evt) {
			var list = this.getView().byId("mailList");
			var name = evt.getParameter("name");
			var args = evt.getParameter("arguments");

			// Wait for the list to be loaded once
			jQuery.when(this.oUpdateFinishedDeferred).then(jQuery.proxy(function() {
				var itemList;
				// On the empty hash select the first item
				if (name === "main") {
					this.selectFirst();
				}
				// Try to select the item in the list
				if (name === "forward") {
					itemList = list.getItems();
					for (var i = 0; i < itemList.length; i++) {
						var path = itemList[i].getBindingContext().getPath();
						if (path === "/" + args.forward) {
							list.setSelectedItem(itemList[i], true);
							break;
						}
					}
				}
			}, this));
		}
	});
});
