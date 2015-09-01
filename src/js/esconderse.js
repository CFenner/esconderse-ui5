navigator.id.watch({
	loggedInUser: "null",
	onlogin: function (assertion) {
	"use strict";
		$.ajax({
			type: "POST",
			url: "https://esconderse.de/verify",
			data: {assertion: assertion},
			success: function(/*data*/){
				sap.ui.getCore().getEventBus().publish("master", "loadList");
				sap.ui.getCore().getEventBus().publish("master", "loadAccount");
			},
			error: function(/*jqXHR, textStatus, errorThrown*/){
				sap.m.MessageToast.show("Sie wurden abgemeldet!");
				//TODO: call logout.php !!!!!!!!!
				//window.location = "https://esconderse.de/logout.php";
			},
			dataType: "json"
		});
	},
	onlogout: function () {
	"use strict";
		sap.m.MessageToast.show("Sie wurden abgemeldet!");
		//TODO: call logout.php !!!!!!!!!
		//window.location = "https://esconderse.de/logout.php";
	}
});

sap.ui.getCore().attachInit(function() {
	"use strict";
	new sap.m.Shell({
		app: new sap.ui.core.ComponentContainer({
			height: "100%",
			name: "de.esconderse"
		})
	}).placeAt("content");
});
