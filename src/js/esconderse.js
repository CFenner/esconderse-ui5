sap.ui.require([
	"sap/m/MessageToast",
	"sap/m/Shell",
	"sap/ui/core/ComponentContainer"
], function(Toast, Shell, Container){
	"use strict";
	navigator.id.watch({
		loggedInUser: "null",
		onlogin: function (assertion) {
			$.ajax({
				type: "POST",
				url: "https://esconderse.de/verify",
				data: {assertion: assertion},
				success: function(/*data*/){
					sap.ui.getCore().getEventBus().publish("master", "loadList");
					sap.ui.getCore().getEventBus().publish("master", "loadAccount");
				},
				error: function(/*jqXHR, textStatus, errorThrown*/){
					Toast.show("Sie wurden abgemeldet!");
					//TODO: call logout.php !!!!!!!!!
					//window.location = "https://esconderse.de/logout.php";
				},
				dataType: "json"
			});
		},
		onlogout: function () {
			Toast.show("Sie wurden abgemeldet!");
			//TODO: call logout.php !!!!!!!!!
			//window.location = "https://esconderse.de/logout.php";
		}
	});

	sap.ui.getCore().attachInit(function() {
		new Shell({
			app: new Container({
				height: "100%",
				name: "de.esconderse"
			})
		}).placeAt("content");
	});
});
