jQuery.sap.require("de.esconderse.util.Formatter");

sap.ui.core.mvc.Controller.extend("de.esconderse.view.Master", {
	onInit : function() {
		this.oUpdateFinishedDeferred = jQuery.Deferred();
		// ??
		this.getView().byId("mailList").attachEventOnce("updateFinished", function() {
			this.oUpdateFinishedDeferred.resolve();
		}, this);
		
		var router = sap.ui.core.UIComponent.getRouterFor(this);
		router.attachRouteMatched(this.onRouteMatched, this);
	},
	
	/*
	onAddProduct : function() {
		sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
			currentView : this.getView(),
			targetViewName : "de.esconderse.view.AddProduct",
			targetViewType : "XML",
			transition : "slide"
		});
	},
	*/
	// ---------- navigation
	selectFirst : function() {
		if (!sap.ui.Device.system.phone) {
			var list = this.getView().byId("mailList"),
				itemList = list.getItems();
			if (itemList.length && !list.getSelectedItem()) {
				list.setSelectedItem(itemList[0], true);
				this.selectForward(itemList[0]);
			}
		}
	},
	selectForward : function(item) {
		var path = item.getBindingContext().getPath(), 
			index = path.split("/")[1],
			router = sap.ui.core.UIComponent.getRouterFor(this);
			
		// If we're on a phone, include nav in history; if not, don't.
		var bReplace = jQuery.device.is.phone ? false : true;
		router.navTo("forward", {
			from: "master",
			forward: index
		}, bReplace);
	},
	// ---------- list
	onSearch : function (evt, refreshButtonPressed) {    
		if(refreshButtonPressed){
			this.doRefresh(evt);
		}
	    // add filter for search
	    var filters = [];
	    var query = evt.getSource().getValue();
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
	onForward : function(evt, listItem, listItemArray, isSelected) {
		var listItem = evt.getParameter("listItem") || evt.getSource(), 
			isSelected = evt.getParameter("selected");
		// Get the list item, either from the listItem parameter or from the event's
		// source itself (will depend on the device-dependent mode).
		this.selectForward(listItem);
	},
	// ---------- footer
	onHome: function(evt){
		// If we're on a phone, include nav in history; if not, don't.
		var bReplace = jQuery.device.is.phone ? false : true;
		sap.ui.core.UIComponent.getRouterFor(this).navTo("account", {
			from: "master",
			forward: null
		}, bReplace);
	},
	onLogout: function(evt){
		
		window.location = "https://esconderse.de/logout.php";
	},
	onMenuUsage: function(evt){
	    if(!this._usagePopover) {
			this._usagePopover = sap.ui.xmlfragment("de.esconderse.view.fragment.Usage", this);
			this.getView().addDependent(this._usagePopover);
		}
	    this._usagePopover.openBy(evt.getSource());
	},
	onMenuFilter: function(evt){
		if(!this._filterSheet){
			this._filterSheet = sap.ui.xmlfragment("de.esconderse.view.fragment.Filter", this);
			this.getView().addDependent(this._filterSheet);
		}
		this._filterSheet.openBy(evt.getSource());
	},
	onFilterReset: function(evt){ this.setFilter(false); },
	onFilterActive: function(evt){ 
		var src = evt.getSource();
		
		//alert(src.getData("data-status"));
//		evt.getSource().set
		this.setFilter(true, true); },
	onFilterInactive: function(evt){ this.setFilter(true, false); },
	setFilter: function(doFilter, active){
		this.getView().byId("mailList").getBinding("items").filter(doFilter
			?[new sap.ui.model.Filter(
				"status", 
				sap.ui.model.FilterOperator.EQ,	
				(active?1:0)
			)]
			:[]
		);
	},
	onNew: function(evt){
	    if(!this._createDialog) {
			this._createDialog = sap.ui.xmlfragment("de.esconderse.view.fragment.Create", this);
			this.getView().addDependent(this._createDialog);
		}
	    //this.getView().byId("inputRename").setValue();
//	    sap.ui.getCore().byId("inputRename").setValue();
	    this._createDialog.open();
	/*
		// If we're on a phone, include nav in history; if not, don't.
		var bReplace = jQuery.device.is.phone ? false : true;
		
		this._getRouter().navTo("create", {
			from: "master",
			forward: null
		}, bReplace);
	*/	
		/*
		router.myNavToWithoutHash({
			currentView : this.getView(),
			targetViewName : "de.esconderse.view.AddProduct",
			targetViewType : "XML",
			transition : "slide"
		});
		*/
	},
	// ---------- Router
	_getRouter: function(){
		return sap.ui.core.UIComponent.getRouterFor(this);
	},
	onRouteMatched : function(evt) {
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
