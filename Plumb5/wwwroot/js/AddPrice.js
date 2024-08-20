

$("#dvLoading").hide();


$("#ui_btnSubmitPrice").click(function () {

    if (!Validation())
        return false;
    return true;
});

function Validation() {
    if ($.trim($("#ui_txtFeature").val()).length == 0) {
        ShowErrorMessage("Please enter the feature name");
        $("#ui_txtFeature").focus();
        return false;
    }
    if ($("#ui_ddlUnitType").get(0).selectedIndex == 0) {
        ShowErrorMessage("Please select the unit type");
        $("#ui_ddlUnitType").focus();
        return false;
    }

    if ($.trim($("#ui_txtMinUnitValue").val()).length == 0) {
        ShowErrorMessage("Please enter Min Units value");
        $("#ui_txtUnitType").focus();
        return false;
    }

    if ($.trim($("#ui_txtMaxUnitValue").val()).length == 0) {
        ShowErrorMessage("Please enter Max Units value");
        $("#ui_txtMaxUnitValue").focus();
        return false;
    }
  
    if ($.trim($("#ui_txtPriceValue").val()).length == 0) {
        ShowErrorMessage("Please enter the price value");
        $("#ui_txtPriceValue").focus();
        return false;
    }
   
    if ($.trim($("#ui_txtPurchaseLink").val()).length == 0) {
        ShowErrorMessage("Please enter purchase url");
        $("#ui_txtPurchaseLink").focus();
        return false;
    }

    if ($.trim($("#ui_txtApplicationPath").val()).length == 0) {
        ShowErrorMessage("Please enter application path");
        $("#ui_txtApplicationPath").focus();
        return false;
    }
    return true;
}
