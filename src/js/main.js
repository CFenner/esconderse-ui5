		    navigator.id.watch({
    		    loggedInUser: 'null',
        		onlogin: function (assertion) {
        			$.ajax({
        				type: 'POST',
						url: 'https://esconderse.de/verify',
						data: {assertion: assertion},  
						success: function(data){
							sap.ui.getCore().getEventBus().publish("master","refresh");
							sap.ui.getCore().getEventBus().publish("master","loadAccount");
//							window.location.reload();
						},
						error: function(jqXHR, textStatus, errorThrown ){
							alert("error" + textStatus + errorThrown); 
						}, 
						dataType: 'json'
					});
		        },
		        onlogout: function () {
		        	sap.m.MessageToast("Sie wurden abgemeldet!");
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