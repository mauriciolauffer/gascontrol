jQuery.sap.declare("sap.ui.mlauffer.Component");
jQuery.sap.require("jquery.sap.storage");
jQuery.sap.require("sap.m.MessageBox");
jQuery.sap.require("sap.m.MessageToast");

sap.ui.core.UIComponent.extend("sap.ui.mlauffer.Component", {
	
	metadata : {
		includes : [],  // css, javascript files that should be used in the component
        dependencies : { // external dependencies
            libs : ["sap.m"], // the libraries that you component will be using
            components : [], // the components that your component will use
        },
        config : {
        	"resourceBundle" : "./i18n/messageBundle.properties",
        	"titleResource" : "ShellTitle",
        	//"favIcon" : "img/favicon.ico",
        	"homeScreenIconPhone" : "./img/gascontrolui5_57p.png",
        	"homeScreenIconPhone@2" : "./img/gascontrolui5_114p.png",
        	"homeScreenIconTablet" : "./img/gascontrolui5_72p.png",
        	"homeScreenIconTablet@2" : "./img/gascontrolui5_144p.png",
        }
	},

	createContent : function() {
		var oView = new sap.ui.view({
			id : "app",
			viewName : "sap.ui.mlauffer.view.App",
			type : sap.ui.core.mvc.ViewType.JS,
			viewData : { component : this }
		});

		var sURL = "./model/mock.json";
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
		
		// Local Storage
		oUser = jQuery.sap.storage(jQuery.sap.storage.Type.local).get("ui5gc-user");
		
		// Check Storage
		if (oUser) {
			var oData = {};
			oData.UserCollection = oUser;
			oModel.setData(oData);
			console.log(1);
			console.log(oData);
		} else {
			console.log(2);
			oModel.loadData(sURL);
			oModel.attachRequestCompleted(function() {
				console.log("attachRequestCompleted");
				// Local Storage
				try {
					jQuery.sap.storage(jQuery.sap.storage.Type.local).put("ui5gc-user", oModel.getData().UserCollection);
				} catch (e) {
					var sError = "Error: " + e.message;
					sap.m.MessageToast.show(sError);
					jQuery.sap.log.error(sError);
				}
			});
		}
		
		oView.setModel(oModel);
		sap.ui.getCore().setModel(oModel);
		
		// set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl : "./i18n/messageBundle.properties"
		});
		oView.setModel(i18nModel, "i18n");
		
		return oView;
	}
});