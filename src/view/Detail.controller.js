sap.ui.core.mvc.Controller.extend("de.esconderse.view.Detail", {

	onInit : function() {
		var oView = this.getView();

		sap.ui.core.UIComponent.getRouterFor(this).attachRouteMatched(function(oEvent) {
			// when detail navigation occurs, update the binding context
			if (oEvent.getParameter("name") === "detail") {

				var sProductPath = "/result/" + oEvent.getParameter("arguments").forward;

				oView.bindElement(sProductPath);
/*
				// Check that the product specified actually was found
				oView.getElementBinding().attachEventOnce("dataReceived", jQuery.proxy(function() {
					var oData = oView.getModel().getData(sProductPath);
					if (!oData) {
						sap.ui.core.UIComponent.getRouterFor(this).myNavToWithoutHash({
							currentView : oView,
							targetViewName : "de.esconderse.view.NotFound",
							targetViewType : "XML"
						});
					}
				}, this));
*/
/*
				// Make sure the master is here
				var oIconTabBar = oView.byId("idIconTabBar");
				oIconTabBar.getItems().forEach(function(oItem) {
					oItem.bindElement(de.esconderse.util.Formatter.uppercaseFirstChar(oItem.getKey()));
				});

				// Which tab?
				var sTabKey = oEvent.getParameter("arguments").tab || "supplier";
				if (oIconTabBar.getSelectedKey() !== sTabKey) {
					oIconTabBar.setSelectedKey(sTabKey);
				}
				*/
			}
		}, this);

	},
	onNavBack : function() {
		// This is only relevant when running on phone devices
		sap.ui.core.UIComponent.getRouterFor(this).myNavBack("main");
	},

	onDetailSelect : function(oEvent) {
			alert("ondetailselect");
		sap.ui.core.UIComponent.getRouterFor(this).navTo("detail",{
			forward : oEvent.getSource().getBindingContext().getPath().split("/")[1]
		}, true);

	}

});