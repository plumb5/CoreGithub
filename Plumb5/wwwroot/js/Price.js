

$("#dvLoading").hide();


$("#ui_lnkAddFeature").click(function () {
    $(".bgShadedDiv").show();
    $("#ui_dvAddFeatures").show("fast");
});

function Delete(contactListId) {

    $("#dialog-confirm").dialog({
        resizable: false,
        height: 170,
        modal: true,
        buttons: {
            "Delete": function () {
                DeletePrice(contactListId);
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });
}

function DeletePrice(FeatureId) {
    $("#dvLoading").show();
    $.ajax({
        url: "DeleteFeature",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ 'FeatureId': FeatureId }),
        success: function (response) {
            if (response) {
                $("#ui_div_" + FeatureId).hide("fast", function () {
                    $(this).remove();
                    if ($("#ui_dvData > .itemStyle").length == 0) {
                        $("#ui_dvData").html("<div class='itemStyle'>No records found</div>");
                    }
                });
            }
            else {
                ShowErrorMessage("Unable to delete");
            }
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
}