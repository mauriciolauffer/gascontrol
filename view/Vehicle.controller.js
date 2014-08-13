sap.ui.controller("sap.ui.mlauffer.view.Vehicle", {

	/**
	 * Called when a controller is instantiated and its View controls (if
	 * available) are already created. Can be used to modify the View before it
	 * is displayed, to bind event handlers and do other one-time
	 * initialization.
	 * 
	 * @memberOf view.Vehicle
	 */
	//onInit: function() {
//
	//},
	/**
	 * Similar to onAfterRendering, but this hook is invoked before the
	 * controller's View is re-rendered (NOT before the first rendering!
	 * onInit() is used for that one!).
	 * 
	 * @memberOf view.Vehicle
	 */
	// onBeforeRendering: function() {
	//
	// },
	/**
	 * Called when the View has been rendered (so its HTML is part of the
	 * document). Post-rendering manipulations of the HTML could be done here.
	 * This hook is the same one that SAPUI5 controls get after being rendered.
	 * 
	 * @memberOf view.Vehicle
	 */
	// onAfterRendering: function() {
	//
	// },
	/**
	 * Called when the Controller is destroyed. Use this one to free resources
	 * and finalize activities.
	 * 
	 * @memberOf view.Vehicle
	 */
	// onExit: function() {
	//
	// }
	handleItemPress : function(evt) {
		var oContext = evt.getSource().getBindingContext();
		this.nav.to("Log", oContext);
	},

	handleAdd : function() {
		if (!this.__oFormDialog) {
			this.__oFormDialog = sap.ui.xmlfragment("VehicleForm", "sap.ui.mlauffer.view.VehicleFormx", this);
			this.getView().addDependent(this.__oFormDialog);
		}
		this.__oFormDialog.unbindElement();
		this.__oFormDialog.open();
	},
	
	handleEdit : function(evt) {
		var oContext = evt.getSource().getBindingContext();
		if (!this.__oFormDialog) {
			this.__oFormDialog = sap.ui.xmlfragment("VehicleForm", "sap.ui.mlauffer.view.VehicleFormx", this);
			this.getView().addDependent(this.__oFormDialog);
		}
		this.__oFormDialog.setBindingContext(oContext, null);
		this.__oFormDialog.bindElement(oContext.getPath());
		this.__oFormDialog.open();
	},
	
	handleSave : function(evt) {
		var oModel = sap.ui.getCore().getModel();
		var oElements = {
				description: sap.ui.core.Fragment.byId("VehicleForm", "description")
		};
		//Validate form submit
		if (this.__validateForm(oElements) === false) {
			return;
		}
		var oContext = evt.getSource().getBindingContext();
		try {
			if (oContext) {
				oModel.setProperty("description", oElements.description.getValue(), oContext);
			} else {
				var oEntry = {
						idvehicle: $.now(),
						description: oElements.description.getValue(),
						km: 0,
						average: 0,
						GasLogCollection: []
				};
				oModel.getData().UserCollection.VehicleCollection.push( oEntry );
			}
		} catch (e) {
			var sError = "Error: " + e.message;
			sap.m.MessageToast.show(sError);
			jQuery.sap.log.error(sError);
			this.__closeDialog();
			return;
		}

		// notify user
		var bundle = this.getView().getModel("i18n").getResourceBundle();
		sap.m.MessageToast.show(bundle.getText("MsgSuccessSave"));
		
		oModel.refresh(true);
		this.__closeDialog();
	},
	
	handleCancel : function() {
		this.__closeDialog();
	},
	
	__closeDialog : function() {
		this.__oFormDialog.unbindElement();
		this.__oFormDialog.close();
	},
	
	__validateForm : function(oElements) {
		var bundle = this.getView().getModel("i18n").getResourceBundle();
		var bValid = true;
		//Required
		if (!this.__validRequired(oElements.description)) bValid = false;
		if (!bValid) {
			sap.m.MessageToast.show(bundle.getText("ErrorRequired"));
			return false;
		}
		
		return true;
	},
	
	__validRequired : function(oElement) {
		if (oElement.getValue() == "") {
			oElement.setValueState("Error");
			return false;
		} else {
			oElement.setValueState("None");
			return true;
		}
	},
	
	__validNumber : function(oElement, bError) {
		if (oElement.getValue() != "") {
			if (!$.isNumeric(oElement.getValue())) {
				oElement.setValueState("Error");
				return false;
			} else {
				oElement.setValueState("None");
				return true;
			}
		}
	}

});