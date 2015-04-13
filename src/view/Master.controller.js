jQuery.sap.require("de.esconderse.view.Formatter");

sap.ui.core.mvc.Controller.extend("de.esconderse.view.Master", {


	onInit : function() {
		this.oUpdateFinishedDeferred = jQuery.Deferred();

		this.getView().byId("mailList").attachEventOnce("updateFinished", function() {
			this.oUpdateFinishedDeferred.resolve();
		}, this);
		
		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(this.onRouteMatched, this);
	},
	onRouteMatched : function(evt) {
		var oList = this.getView().byId("mailList");
		var sName = evt.getParameter("name");
		var oArguments = evt.getParameter("arguments");

		// Wait for the list to be loaded once
		jQuery.when(this.oUpdateFinishedDeferred).then(jQuery.proxy(function() {
			var aItems;

			// On the empty hash select the first item
			if (sName === "main") {
				this.selectDetail();
			}

			// Try to select the item in the list
			if (sName === "product") {

				aItems = oList.getItems();
				for (var i = 0; i < aItems.length; i++) {
					if (aItems[i].getBindingContext().getPath() === "/" + oArguments.product) {
						oList.setSelectedItem(aItems[i], true);
						break;
					}
				}	
			}	

		}, this));
	},
	
	selectDetail : function() {
		if (!sap.ui.Device.system.phone) {
			var oList = this.getView().byId("mailList");
			var aItems = oList.getItems();
			if (aItems.length && !oList.getSelectedItem()) {
				oList.setSelectedItem(aItems[0], true);
				this.showDetail(aItems[0]);
			}
		}
	},
	onSearch : function() {
		// add filter for search
		var filters = [];
		var searchString = this.getView().byId("searchField").getValue();
		if (searchString && searchString.length > 0) {
			filters = [ new sap.ui.model.Filter("Name", sap.ui.model.FilterOperator.Contains, searchString) ];
		}

		// update list binding
		this.getView().byId("mailList").getBinding("items").filter(filters);
	},
	onSelect : function(evt) {
		// Get the list item, either from the listItem parameter or from the event's
		// source itself (will depend on the device-dependent mode).
		this.showDetail(evt.getParameter("listItem") || evt.getSource());
	},
	showDetail : function(oItem) {
		// If we're on a phone, include nav in history; if not, don't.
		var bReplace = jQuery.device.is.phone ? false : true;
		sap.ui.core.UIComponent.getRouterFor(this).navTo("detail", {
			from: "master",
			forward: oItem.getBindingContext().getPath().split("/")[1]
		}, bReplace);
	},
	onMenuUsage: function(evt){
		var src = evt.getSource(), 
			model = new sap.ui.model.json.JSONModel({
			"max": 32,
			"current": 16
		});
    	model.setDefaultBindingMode("OneWay");
	    if(!this._popoverStatistic) {
			this._popoverStatistic = sap.ui.xmlfragment("de.esconderse.view.Usage", this);
		}
	    this._popoverStatistic.setModel(model, "usage");
	    this._popoverStatistic.bindElement("/");
	    this._popoverStatistic.openBy(src);
	},
	onMenuFilter: function(evt){
		var src = evt.getSource();
		if(!this._sheetFilter){
			this._sheetFilter = sap.ui.xmlfragment(
				"de.esconderse.view.Filter",
				this
			);
			this._sheetFilter.placement = "top";
			this.getView().addDependent(this._sheetFilter);
		} 
		this._sheetFilter.setModel(new sap.ui.model.json.JSONModel(
	[{
		"icon": "sap-icon://all",
		"text": "{i18n>masterFilterAllButtonToolTip}",
		"press": "onFilterAll"
	},{
		"icon": "sap-icon://connected",
		"text": "{i18n>masterFilterActiveButtonToolTip}",
		"press": "onFilterActive"
	},{
		"icon": "sap-icon://disconnected",
		"text": "{i18n>masterFilterInactiveButtonToolTip}",
		"press": "onFilterInactive"
	}]));
//		this._sheetFilter.opener = src;
		this._sheetFilter.openBy(src);
	},
	onAddProduct : function() {
		sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
			currentView : this.getView(),
			targetViewName : "de.esconderse.view.AddProduct",
			targetViewType : "XML",
			transition : "slide"
		});
	},
	onHome: function(evt){
		// If we're on a phone, include nav in history; if not, don't.
		var bReplace = jQuery.device.is.phone ? false : true;
		sap.ui.core.UIComponent.getRouterFor(this).navTo("welcome", {
			from: "master",
			forward: null
		}, bReplace);
	},
	onFilterAll: function(evt){ this.setFilter(false); },
	onFilterActive: function(evt){ this.setFilter(true, true); },
	onFilterInactive: function(evt){ this.setFilter(true, false); },
	setFilter: function(doFilter, active){
		var filters = doFilter?[new sap.ui.model.Filter(
			"status", 
			sap.ui.model.FilterOperator.EQ,	
			(active?1:0)
		)]:[];
		this.getView().byId("mailList").getBinding("items").filter(filters);
	},
	
  status :  function (sStatus) {
      if (sStatus === 0) {
        return "Success";
      } else if (sStatus === 1) {
        return "Warning";
      } else {
        return "None";
      }
  }
});