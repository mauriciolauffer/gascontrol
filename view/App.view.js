sap.ui.jsview("sap.ui.mlauffer.view.App", {

	/**
	 * Specifies the Controller belonging to this View. In the case that it is
	 * not implemented, or that "null" is returned, this View does not have a
	 * Controller.
	 * 
	 * @memberOf view.App
	 */
	getControllerName : function() {
		return "sap.ui.mlauffer.view.App";
	},

	/**
	 * Is initially called once after the Controller has been instantiated. It
	 * is the place where the UI is constructed. Since the Controller is given
	 * to this method, its event handlers can be attached right away.
	 * 
	 * @memberOf view.App
	 */
	createContent : function(oController) {
		// to avoid scroll bars on desktop the root view must be set to block
		this.setDisplayBlock(true);
		//this.app = new sap.m.App("GasControl");
		this.app = new sap.m.SplitApp("GasControl");

		// Create pages
		var oPage = new sap.ui.xmlview("Vehicle", "sap.ui.mlauffer.view.Vehicle");
		oPage.getController().nav = this.getController();
		//this.app.addPage(oPage);
		this.app.addMasterPage(oPage);
		
		oPage = new sap.ui.xmlview("Log", "sap.ui.mlauffer.view.Log");
		oPage.getController().nav = this.getController();
		//this.app.addPage(oPage);
		this.app.addDetailPage(oPage);
		// oPage = new sap.ui.xmlview("test", "sap.ui.mlauffer.view.test");
		// oPage.getController().nav = this.getController();
		// this.app.addPage(oPage);
		// load the empty page
		var oPage = sap.ui.xmlview("Empty", "sap.ui.mlauffer.view.Empty");
		this.app.addDetailPage(oPage);

		//this.app.setInitialPage("Vehicle");
		this.app.setInitialMaster("Vehicle");
		this.app.setInitialDetail("Empty");

		// wrap app with shell
		return new sap.m.Shell({
			title : "{i18n>ShellTitle}",
			showLogout : false,
			app : this.app
			/*homeIcon : { 'phone':'phone-icon_57x57.png', 
				'phone@2':'phone-retina_114x114.png', 
				'tablet':'tablet-icon_72x72.png', 
				'tablet@2':'tablet-retina_144x144.png', 
				'precomposed':true
				// 'favicon':'favicon.ico'
			}*/
		});
	}

});