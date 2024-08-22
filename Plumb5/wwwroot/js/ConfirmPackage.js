
var feature, totalValue = 0;

$(function () {
    CheckSession();
});

function CheckSession() {

    $("#dvLoading").show();
    $.ajax({
        url: "../Pricing/CheckIsSuperAdminBeforePurchase",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.d && response.SessionNotExitis) {
                window.location.href = "SignUp.html";
            }
            else {
                BindCartSummary();
                $("#dvLoading").hide();
            }
        },
        error: function (error) {
            window.console.log(error.responseText);
        }
    });
}

BindCartSummary = function () {

    $("#tblCartData").empty();

    $.ajax({
        url: "../Pricing/GetCartSummary",
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            feature = response.d;
            BindSelectedFeature(feature);
        },
        error: function (error) {
            window.console.log(error);
        }
    });
};

BindSelectedFeature = function (feature) {

    totalValue = 0;

    var allcontent = "";
    if (feature != null && feature.length > 0) {
        $.each(feature, function (i) {

            var content = "";

            if ($(this)[0].SelectedYearly == true && i == 0 && !$("#ui_chkYearly").is("checked") && $("#ui_chkYearly").length > 0)
                document.getElementById("ui_chkYearly").checked = true;

            var priceValue = ($("#ui_chkYearly").length > 0 && $("#ui_chkYearly").is(":checked")) || $(this)[0].SelectedYearly ? $(this)[0].YearlyPrice.toFixed(2) : $(this)[0].MonthlyPrice.toFixed(2);

            content = "<tr id='ui_tdFeature_" + $(this)[0].FeatureId + "'><td style='width:100%;' ><table style='width:100%;'><tr><td style='width: 50%; text-align: left;' valign='top'><span class='cartFeaturesText'> " + $(this)[0].FeatureName + "</span><br />" +
                            "<span style='font-size: 12px;'>" + $(this)[0].UnitType + " " + $(this)[0].OpttedRange + "</span></td> " +
                            "<td style='width: 50%;' valign='top' align='right'><span class='cartamnoutnDetails'>" + ($(this)[0].PriceInINRorDollar == true ? "&#x20b9;" : "$") + " " + priceValue + "</span><br /><a class='cartFeaturesText' style='text-decoration: none;font-size: 12px;' href='" + $(this)[0].PurchaseLink + "'>Update</a></td> " +
                      "</tr>" +
                    "<tr>" +
                        "<td colspan='2' align='right' class='removecart'><label style='cursor:pointer;' onclick='RemoveFromCart(" + $(this)[0].FeatureId + ");'>remove from cart</label></td> " +
                    "</tr></table></td></tr>";
            allcontent += content;

            totalValue = totalValue + parseFloat(priceValue);

        });

        $("#tblCartData").empty().html(allcontent);

        BindFinalVATGrandTotal(feature);

    }
    else if (feature.length == 0) {
        BindForEmptyCartDetails();
    }

};


BindForEmptyCartDetails = function () {

    if (document.getElementById("tblCartData").rows.length == 0) {
        var content = "";
        content = "<tr><td style='width:100%;'><table style='width:100%;'><tr><td style='width: 180px; text-align: left;' valign='top'><span class='cartFeaturesText'>Cart is Empty</span><br>" +
                        "</td> " +
                        "<td valign='top' class='cartamnoutnDetails'> </td> " +
                  "</tr></table>" +
               "</td></tr>";
        $("#tblCartData").append(content);
    }
};


BindFinalVATGrandTotal = function (feature) {

    var tdContent = "<tr style='font-size: 17px;font-weight: 700;color: #7c8081;background-color: #f3e650;'><td colspan='2' style='padding:15px;' class='totalAmount'><div style='float:left;vertical-align: top;'>GRAND TOTAL</div><div class='cartamnoutnDetails' style='float:right;vertical-align: top;'><sup>" + (feature[0].PriceInINRorDollar == true ? "&#x20b9;" : "$") + "</sup> " + totalValue.toFixed(2) + "</div></td></tr>";
    $("#tblCartData > tbody:last").append(tdContent);
};


function RemoveFromCart(FeatureId) {
    $("#dvLoading").show();
    $.ajax({
        url: "../Pricing/RemoveFromCart",
        type: 'POST',
        data: JSON.stringify({ "FeatureId": FeatureId }),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.d) {
                $("#ui_tdFeature_" + FeatureId).remove();
                window.location.reload();
            }
            else {
                $("#lblMesg").html("Problem in removing");
            }
            $("#dvLoading").hide();
        },
        error: function (error) {
            window.console.log(error.responseText);
        }
    });
}

$("#ui_btnCheckOut").click(function (event) {

    $("#dvLoading").show();
    $.ajax({
        url: "../Pricing/CheckIsSuperAdminBeforePurchase",
        type: 'POST',
        async: false,
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            if (response.d) {
                if (totalValue <= 0)
                    if (event.preventDefault)
                        event.preventDefault();
                    else
                        event.returnValue = false;
            }
            else {
                if (event.preventDefault)
                    event.preventDefault();
                else
                    event.returnValue = false;

                ShowErrorMessage("You are not the owner of this account, So you cannot purchase.");
            }

            $("#dvLoading").hide();
        },
        error: function (error) {
            window.console.log(error.responseText);
        }
    });
});
