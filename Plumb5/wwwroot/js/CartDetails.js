
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
                            "<td style='width: 50%;' valign='top' align='right'><span class='cartamnoutnDetails'>$ " + priceValue + "</span><br /><a class='cartFeaturesText' style='text-decoration: none;font-size: 12px;' href='" + $(this)[0].PurchaseLink + "'>Update</a></td> " +
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


BindFinalVATGrandTotal = function () {

    var tdContent = "<tr><td colspan='2' class='totalAmount'><div style='float:left;vertical-align: top;'>GRAND TOTAL</div><div class='cartamnoutnDetails' style='float:right;vertical-align: top;'><sup>$</sup> " + totalValue.toFixed(2) + "</div></td></tr>";
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
                BindCartSummary();
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



//------------------------------------------------------------- Billing Section --------------------------------------------- //

function autotab(event, destination) {
    var charCode;
    if (window.event)
        charCode = window.event.keyCode; //IE
    else
        charCode = event.which; //firefox    


    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;

    if ($("#" + event.target.id).val().length == 3) {
        $("#" + destination).focus();
    }
    return true;
}

if ($("#btnSaveCardDetails").length > 0) {
    $("#btnSaveCardDetails").click(function () {
        $("#dvLoading").show();
        if (!CardValidation()) {
            $("#dvLoading").hide();
            return;
        }

        var transaction = { CardNumber: "", NameOnCard: "", ExpirationDate: "", CardCVV: "" };

        transaction.CardNumber = $("#txtCardNumber1").val().toString() + $("#txtCardNumber2").val().toString() + $("#txtCardNumber3").val().toString() + $("#txtCardNumber4").val().toString();
        transaction.NameOnCard = $("#txtCardName").val();
        transaction.ExpirationDate = $("#ddlMonth").val() + "-" + $("#ddlYear").val();
        transaction.CardCVV = $("#txtCardCVV").val();


        $.ajax({
            url: "../Pricing/Billing",
            type: 'POST',
            data: JSON.stringify({ "transaction": transaction }),
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (response.ErrorMessage.length == 0) {
                    window.location.href = "ThankYou.html";
                }
                else {
                    $("#lblCardDetails").html(response.ErrorMessage);
                }
                $("#dvLoading").hide();
            },
            error: function (error) {
                window.console.log(error.responseText);
            }
        });
    });
}

function CardValidation() {

    if ($("#txtCardNumber1").val().length == 0) {
        $("#txtCardNumber1").focus();
        $("#lblCardDetails").html("Please enter Card Number.");
        return false;
    }

    if ($("#txtCardNumber1").val().length < 4) {
        $("#txtCardNumber1").focus();
        $("#lblCardDetails").html("Please enter full Card Number.");
        return false;
    }
    if ($("#txtCardNumber2").val().length < 4) {
        $("#txtCardNumber2").focus();
        $("#lblCardDetails").html("Please enter full Card Number.");
        return false;
    }
    if ($("#txtCardNumber3").val().length < 4) {
        $("#txtCardNumber3").focus();
        $("#lblCardDetails").html("Please enter full Card Number.");
        return false;
    }
    if ($("#txtCardNumber4").val().length < 2) {
        $("#txtCardNumber4").focus();
        $("#lblCardDetails").html("Please enter full Card Number.");
        return false;
    }

    if ($("#txtCardName").val().length == 0) {
        $("#txtCardName").focus();
        $("#lblCardDetails").html("Please enter Card Name.");
        return false;
    }

    //Date validation
    var currentDate = new Date();

    var day = currentDate.getMonth() + 1;
    var year = currentDate.getFullYear();

    var selectDay = parseInt($("#ddlMonth").val());
    var selectYear = parseInt($("#ddlYear option:selected").text());

    if (selectYear < year) {
        $("#lblCardDetails").html("Your card is already expired year.");
        return false;
    }
    if (selectDay < day && selectYear == year) {
        $("#lblCardDetails").html("Your card is already expired.");
        return false;
    }

    if ($("#txtCardCVV").val().length == 0) {
        $("#lblCardDetails").html("Please enter CVV.");
        return false;
    }

    if ($("#txtCardCVV").val().length <= 2) {
        $("#lblCardDetails").html("Please enter correct CVV.");
        return false;
    }

    $("#lblCardDetails").html("");
    return true;
}
