
navigator.id.watch({
	loggedInUser: 'null',
	onlogin: function (assertion) {
		$.ajax({
			type: 'POST',
			url: 'https://esconderse.de/verify',
			data: {assertion: assertion},  
			success: function(data){
				sap.ui.getCore().getEventBus().publish("master","loadList");
				sap.ui.getCore().getEventBus().publish("master","loadAccount");
			},
			error: function(jqXHR, textStatus, errorThrown ){
				sap.m.MessageToast("Sie wurden abgemeldet!");
				//TODO: call logout.php !!!!!!!!!
				window.location = "https://esconderse.de/logout.php";
			}, 
			dataType: 'json'
		});
	},
	onlogout: function () {
		sap.m.MessageToast("Sie wurden abgemeldet!");
		//TODO: call logout.php !!!!!!!!!
		window.location = "https://esconderse.de/logout.php";
	}
});

sap.ui.getCore().attachInit(function() {
	new sap.m.Shell({
		app: new sap.ui.core.ComponentContainer({
			height : "100%",
			name : "de.esconderse"
		})
	}).placeAt("content");
});