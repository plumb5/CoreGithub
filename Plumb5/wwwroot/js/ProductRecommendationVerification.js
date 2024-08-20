
var RecomendationCondition = { RecomendationTopCount: 0, RecomendationType: "", Priority: '0' };

$(document).ready(function () {
    $("#dvLoading").hide();
});

$("#ui_btnRecommendation").click(function () {

    $("#dvLoading").show();

    if ($("#ui_ddlRecommendationType").val() == "0") {
        ShowErrorMessage("Please select the type.");
        $("#dvLoading").hide();
        return false;
    }

    if ($("#ui_ddlNumberOfProduct").val() == "0") {
        ShowErrorMessage("Please select the number of product.");
        $("#dvLoading").hide();
        return false;
    }

    if ($("#ui_txtEmailId").val().length == 0 && $("#ui_txtPhoneNumber").val().length == 0) {
        ShowErrorMessage("Please enter EmailId or PhoneNumber.");
        $("#dvLoading").hide();
        return false;
    }

    if ($("#ui_txtEmailId").val().length > 0) {
        if (!CheckValidEmail("ui_txtEmailId")) {
            $("#dvLoading").hide();
            return false;
        }
    }

    if ($("#ui_txtPhoneNumber").val().length > 0) {
        if (!CheckPhoneNumbers("ui_txtPhoneNumber")) {
            $("#dvLoading").hide();
            return false;
        }
    }

    RecomendationCondition.RecomendationType = $("#ui_ddlRecommendationType").val();
    RecomendationCondition.RecomendationTopCount = $("#ui_ddlNumberOfProduct").val();

    $.ajax({
        url: "/ProductRecommendationVerification/GetProductRecommendation",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ 'recomendationCondition': RecomendationCondition, 'EmailId': $("#ui_txtEmailId").val(), 'Phonenumber': $("#ui_txtPhoneNumber").val() }),
        success: function (response) {
            if (response.Status) {
                BindProduct(response.Product);
            } else {
                ShowErrorMessage(response.Message);
            }
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
});

$("#ui_btnCancel").click(function () {
    $("#ui_ddlRecommendationType").val("0");
    $("#ui_ddlNumberOfProduct").val("0");
    $("#ui_txtEmailId").val("");
    $("#ui_txtPhoneNumber").val("");
    $("#ui_dvContent").hide();
    $("#ui_dvData").html("");
});

function BindProduct(ProductList) {
    $("#ui_dvData").html("");
    $.each(ProductList, function () {
        var divContent = "";
        divContent += "<div style='float: left; width: 20%; text-align: left;'>" + $(this)[0].Id + "</div>";
        divContent += "<div style='float: left; width: 20%; text-align: left;'>" + $(this)[0].Name + "</div>";
        $('#ui_dvData').append("<div id='ui_div_" + $(this)[0].Id + "' class='itemStyle'>" + divContent + "</div>");
    });
    $("#ui_dvContent").show();
    $("#dvLoading").hide();
}