jQuery.sap.require("sap.ui.mlauffer.util.Formatter");

sap.ui.controller("sap.ui.mlauffer.view.Log", {

/**
* Called when a controller is instantiated and its View controls (if available) are already created.
* Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
* @memberOf view.Vehicle
*/
//	onInit: function() {
//
//	},

/**
* Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
* (NOT before the first rendering! onInit() is used for that one!).
* @memberOf view.Vehicle
*/
//	onBeforeRendering: function() {
//
//	},

/**
* Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
* This hook is the same one that SAPUI5 controls get after being rendered.
* @memberOf view.Vehicle
*/
	/*onAfterRendering: function(evt) {
		 var context = evt.getSource().getBindingContext();
		 var context = this.getView().getModel();
		 console.dir(context);
		 console.dir(evt);
	},*/

/**
* Called when the Controller is destroyed. Use this one to free resources and finalize activities.
* @memberOf view.Vehicle
*/
//	onExit: function() {
//
//	}

	handleNavButtonPress : function (evt) {
		this.nav.back();
	},
	
	handleItemPress : function(evt) {
		var oContext = evt.getSource().getBindingContext();
		if (!this.__oFormDialog) {
			this.__oFormDialog = sap.ui.xmlfragment("LogForm", "sap.ui.mlauffer.view.LogForm", this);
			this.getView().addDependent(this.__oFormDialog);
		}
		sap.ui.core.Fragment.byId("LogForm", "delete").setVisible(true);
		this.__oFormDialog.setBindingContext(oContext, null);
		this.__oFormDialog.bindElement(oContext.getPath());
		this.__oFormDialog.open();
	},
	
	handleAdd : function() {
		if (!this.__oFormDialog) {
			this.__oFormDialog = sap.ui.xmlfragment("LogForm", "sap.ui.mlauffer.view.LogForm", this);
			this.getView().addDependent(this.__oFormDialog);
		}
		sap.ui.core.Fragment.byId("LogForm", "delete").setVisible(true);
		this.__oFormDialog.unbindElement();
		this.__oFormDialog.open();
	},
	
	handleSave : function(evt) {
		var oModel = sap.ui.getCore().getModel();
		var oElements = {
				idlog: sap.ui.core.Fragment.byId("LogForm", "idlog"),
				date: sap.ui.core.Fragment.byId("LogForm", "date"),
				km: sap.ui.core.Fragment.byId("LogForm", "km"),
				quantity: sap.ui.core.Fragment.byId("LogForm", "quantity"),
				amount: sap.ui.core.Fragment.byId("LogForm", "amount")
		};
		
		//Validate form submit
		if (this.__validateForm(oElements) === false) {
			return;
		}
		
		var nAverage = oElements.km.getValue() / oElements.quantity.getValue();
		var oContext = evt.getSource().getBindingContext();
		try {
			if (oElements.idlog.getValue() != "") {
				oModel.setProperty("date", oElements.date.getValue(), oContext);
				oModel.setProperty("km", sap.ui.mlauffer.util.Formatter.decimals(oElements.km.getValue()), oContext);
				oModel.setProperty("quantity", sap.ui.mlauffer.util.Formatter.decimals(oElements.quantity.getValue()), oContext);
				oModel.setProperty("amount", sap.ui.mlauffer.util.Formatter.decimals(oElements.amount.getValue()), oContext);
				oModel.setProperty("average", sap.ui.mlauffer.util.Formatter.decimals(nAverage), oContext);
			} else {
				var oEntry = {
						idlog: $.now(),
						date: oElements.date.getValue(),
						km: sap.ui.mlauffer.util.Formatter.decimals(oElements.km.getValue()),
						quantity: sap.ui.mlauffer.util.Formatter.decimals(oElements.quantity.getValue()),
						amount: sap.ui.mlauffer.util.Formatter.decimals(oElements.amount.getValue()),
						average: sap.ui.mlauffer.util.Formatter.decimals(nAverage)
				};
				var sPath = oContext.getPath();
				var sVechicle = sPath.slice( sPath.length - 1 );
				oModel.getData().UserCollection.VehicleCollection[ sVechicle ].GasLogCollection.push( oEntry );
			}
			// Local Storage
			jQuery.sap.storage(jQuery.sap.storage.Type.local).put("ui5gc-user", oModel.getData().UserCollection);
			
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
	
	handleDelete : function(evt) {
		var context = evt.getSource().getBindingContext();
		var that = this;
		var bundle = this.getView().getModel("i18n").getResourceBundle();
		
		// show confirmation dialog
		sap.m.MessageBox.confirm(bundle.getText("DialogMsgDelete"), function(oAction) {
			if (sap.m.MessageBox.Action.OK === oAction) {
				var oModel = that.getView().getModel();
				var sPath = context.getPath();
				
				try {
					//Delete
					oModel.getData().UserCollection.VehicleCollection[sPath.slice(34).substring(0,1)].GasLogCollection.splice(sPath.slice(sPath.lastIndexOf("/") + 1), 1);
				} catch (e) {
					var sError = "Error: " + e.message;
					sap.m.MessageToast.show(sError);
					return;
				}
				
				// notify user
				sap.m.MessageToast.show(bundle.getText("MsgSuccessDelete"));
				// Local Storage
				jQuery.sap.storage(jQuery.sap.storage.Type.local).put("ui5gc-user", oModel.getData().UserCollection);
				oModel.refresh(true);
			}
		}, bundle.getText("DialogTitleDelete"));
		this.__closeDialog();
	},
	
	handleCancel : function() {
		this.__closeDialog();
	},
	
	handleEditVehicle : function(evt) {
		var oVehView = sap.ui.getCore().byId("Vehicle");
		var oVehController = oVehView.getController();
		oVehController.handleEdit(evt);
	},
	
	__closeDialog : function() {
		this.__oFormDialog.unbindElement();
		this.__oFormDialog.close();
	},
	
	__validateForm : function(oElements) {
		var bundle = this.getView().getModel("i18n").getResourceBundle();
		var bValid = true;
		//Number
		if (!this.__validRequired(oElements.km)) bValid = false;
		if (!this.__validRequired(oElements.quantity)) bValid = false;
		if (!this.__validRequired(oElements.amount)) bValid = false;
		if (!bValid) {
			sap.m.MessageToast.show(bundle.getText("ErrorNumber"));
			return false;
		}
		//Required
		if (!this.__validRequired(oElements.date)) bValid = false;
		if (!this.__validRequired(oElements.km)) bValid = false;
		if (!this.__validRequired(oElements.quantity)) bValid = false;
		if (!this.__validRequired(oElements.amount)) bValid = false;
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