jQuery.sap.declare("sap.ui.mlauffer.Component");
jQuery.sap.require("jquery.sap.storage");

sap.ui.core.UIComponent.extend("sap.ui.mlauffer.Component", {

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
		
		/*// Local Storage
		var oStorage = oView.getController().__oWebStorage;
		oUser = oStorage.get("user");
		oAccount = oStorage.get("account");
		oCategory = oStorage.get("category");
		oTransaction = oStorage.get("transaction");
		oDeletedItem = oStorage.get("deletedItem");

		// Check Storage
		if (oUser && oAccount && oCategory && oTransaction) {
			var oData = {};
			oData.UserCollection = oUser;
			oData.UserCollection.AccountCollection = oAccount;
			oData.UserCollection.CategoryCollection = oCategory;
			oData.UserCollection.TransactionCollection = oTransaction;
			oModel.setData(oData);
		} else {
			oModel.loadData(sURL);
			oModel.attachRequestCompleted(function() {
				console.log("attachRequestCompleted");
				var oData = $.parseJSON( oModel.getJSON() );
				oView.getController().__storageData("account", oData.UserCollection.AccountCollection);
				oView.getController().__storageData("category", oData.UserCollection.CategoryCollection);
				oView.getController().__storageData("transaction", oData.UserCollection.TransactionCollection);
				delete oData.UserCollection.AccountCollection;
				delete oData.UserCollection.CategoryCollection;
				delete oData.UserCollection.TransactionCollection;
				oView.getController().__storageData("user", oData.UserCollection);
			});
		}*/
		oModel.loadData(sURL);
		
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