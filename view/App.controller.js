sap.ui.controller("sap.ui.mlauffer.view.App", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf view.App
	 */
	//onInit : function() {
	//
	//},
	/**
	 * Similar to onAfterRendering, but this hook is invoked before the
	 * controller's View is re-rendered (NOT before the first rendering!
	 * onInit() is used for that one!).
	 * 
	 * @memberOf view.App
	 */
	// onBeforeRendering: function() {
	//
	// },
	/**
	 * Called when the View has been rendered (so its HTML is part of the
	 * document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * 
	 * @memberOf view.App
	 */
	// onAfterRendering: function() {
	//
	// },
	/**
	 * Called when the Controller is destroyed. Use this one to free resources
	 * and finalize activities.
	 * 
	 * @memberOf view.App
	 */
	onExit : function() {
		alert("leaving app... bye!");
	},
	/**
	 * Navigates to another page
	 * 
	 * @param {string}
	 *            pageId The id of the next page
	 * @param {sap.ui.model.Context}
	 *            context The data context to be applied to the next page
	 *            (optional)
	 */
	to : function(pageId, context) {
		this.getView().app.to(pageId);

		// set data context on the page
		if (context) {
			var oPage = this.getView().app.getPage(pageId);
			oPage.setBindingContext(context);
		}
	},

	/**
	 * Navigates back to a previous page
	 * 
	 * @param {string}
	 *            pageId The id of the next page
	 */
	back : function(pageId) {
		// this.getView().app.backToPage(pageId);
		this.getView().app.back();
	},
	
	__oWebStorage : jQuery.sap.storage(jQuery.sap.storage.Type.local),

	__storageData : function(sId, sData) {
		// Storage
		try {
			this.__oWebStorage.put(sId, sData);
		} catch (e) {
			var sError = "Error: " + e.message;
			sap.m.MessageToast.show(sError);
			jQuery.sap.log.error(sError);
		}
	}

});