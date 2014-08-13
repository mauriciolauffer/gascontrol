jQuery.sap.declare("sap.ui.mlauffer.util.Formatter");
jQuery.sap.require("sap.ui.core.format.DateFormat");

sap.ui.mlauffer.util.Formatter = {

	date : function(value) {
		if (value) {
			var oDateFormat = sap.ui.core.format.DateFormat
					.getDateTimeInstance({
						pattern : "yyyy/MM/dd"
					});
			return oDateFormat.format(new Date(value));
		} else {
			return value;
		}
	},

	numberStatus : function(value) {
		return (value < 0) ? "Error" : "Success";
	},

	quantity : function(value) {
		try {
			return (value) ? parseFloat(value).toFixed(0) : value;
		} catch (err) {
			return "Not-A-Number";
		}
	}
};