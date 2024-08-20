var valuesDictionary = [
    { "Name": "WebEngagement", "FeatureName": "Engagement" },
    { "Name": "MobileEngagement", "FeatureName": "Mobile Engagement" },
    { "Name": "EmailEngagement", "FeatureName": "Email Marketing" },
    { "Name": "SmsEngagement", "FeatureName": "SMS Marketing" },
    { "Name": "SiteChatEngagement", "FeatureName": "Live Chat" },
    { "Name": "LeadManagement", "FeatureName": "Lead Management" },
    { "Name": "CommunityBuilder", "FeatureName": "Community Builder" },
    { "Name": "MarketingDashboards", "FeatureName": "Marketing Dashboards" },
    { "Name": "SocialMarketing", "FeatureName": "Social Marketing" },
    { "Name": "Analytics", "FeatureName": "Web & Mobile Analytics" }
];

var PriceDetials;
var INROrDollarPrice = true;
var CartList = new Array();
var NewCartList = new Array();

$(document).ready(function () {
    BindPriceDetails();
});

BindPriceDetails = function () {
    $.ajax({
        url: "../LmsEditProfile/GetAllFeatures",
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            if (response.length > 0) {
                PriceDetials = response;
            }
        },
        error: function (error) {
            window.console.log(error);
        }
    });
};

function IntializeSlider(feature) {
    $('#slider_price').slider({
        range: "min",
        value: feature.MinUnitValue,
        min: feature.MinUnitValue,
        max: feature.MaxUnitValue,
        change: function (event, ui) {
            if (ui.value > 0) {
                var MonthlyPrice = "";
                $('#dv_Impressions').val(ui.value);

                if (INROrDollarPrice)
                    MonthlyPrice = (ui.value * feature.PricePerUnitInINR) / feature.MinUnitValue;
                else
                    MonthlyPrice = (ui.value * feature.PricePerUnit) / feature.MinUnitValue;

                $('#dv_Price').html(MonthlyPrice.toFixed(2));

                var yearPrice = (MonthlyPrice * 12) - (0.2 * MonthlyPrice).toFixed(2);
                $('#dv_YearlyPrice').html(yearPrice.toFixed(2));
            }
        }
    });

    $('#dv_Impressions').val(feature.MinUnitValue);

    var MonthlyPrice = "";

    if (INROrDollarPrice)
        MonthlyPrice = (feature.MinUnitValue * feature.PricePerUnitInINR) / feature.MinUnitValue;
    else
        MonthlyPrice = (feature.MinUnitValue * feature.PricePerUnit) / feature.MinUnitValue;

    $('#dv_Price').html(MonthlyPrice.toFixed(2));

    var yearPrice = (MonthlyPrice * 12) - (0.2 * MonthlyPrice).toFixed(2);
    $('#dv_YearlyPrice').html(yearPrice.toFixed(2));
}

$("input[type='checkbox']:not('#chk_Yearly')").click(function () {
    if ($("#chk_" + $(this).attr("tag")).is(":checked")) {

        $(".bgShadedDiv").show();
        var tag = $(this).attr("tag");

        var dicValues = JSLINQ(valuesDictionary).Where(function () {
            return (this.Name == tag);
        });

        var Feature = JSLINQ(PriceDetials).Where(function () {
            return (this.Name == dicValues.items[0].FeatureName);
        });

        IntializeSlider(Feature.items[0]);

        $("#lbl_AppType").empty().html(Feature.items[0].Name);
        $("#dv_AddToCart,#dv_No").attr("AppType", tag);
        $("#dvPricePopUp").show();
    }
    else {
        var tag = $(this).attr("tag");
        RemoveApp(tag);
    }
});

$("#dv_AddToCart").click(function () {

    $("#dvLoading").show();

    var AppType = $(this).attr("apptype");
    var data = $("#slider_price").slider("value");

    var dicValues = JSLINQ(valuesDictionary).Where(function () {
        return (this.Name == AppType);
    });

    var Feature = JSLINQ(PriceDetials).Where(function () {
        return (this.Name == dicValues.items[0].FeatureName);
    });

    if (dicValues.items[0] != undefined) {
        var priceDetails = Feature.items[0];
    }

    var cartDetails = new Object();

    cartDetails.FeatureName = dicValues.items[0].FeatureName;
    cartDetails.PurchaseLink = priceDetails.PurchaseLink;
    cartDetails.FeatureId = priceDetails.Id;
    cartDetails.UnitType = priceDetails.FeatureUnitTypeId == 1 ? "Impressions" : priceDetails.FeatureUnitTypeId == 2 ? "Contacts" : "Users";
    cartDetails.OpttedRange = data;

    if (INROrDollarPrice)
        cartDetails.MonthlyPrice = ((data * priceDetails.PricePerUnitInINR) / priceDetails.MinUnitValue).toFixed(2);
    else
        cartDetails.MonthlyPrice = ((data * priceDetails.PricePerUnit) / priceDetails.MinUnitValue).toFixed(2);

    cartDetails.YearlyPrice = ((cartDetails.MonthlyPrice * 12) - (0.2 * cartDetails.MonthlyPrice)).toFixed(2);

    if ($("#chk_Yearly").is(':checked'))
        cartDetails.SelectedYearly = true;
    else
        cartDetails.SelectedYearly = false;

    cartDetails.PriceInINRorDollar = INROrDollarPrice;

    if (CartList.length > 0) {
        for (var a = 0; a < CartList.length; a++) {
            if (CartList[a].FeatureId == cartDetails.FeatureId) {
                CartList.splice(a, 1);
                CartList.push(cartDetails);
                break;
            }
            else {
                CartList.push(cartDetails);
                break;
            }
        }
    }
    else {
        CartList.push(cartDetails);
    }

    BindEstimatedPrice();
});

$("#dv_No").click(function () {
    var AppType = $(this).attr("apptype");
    $("#chk_" + AppType).prop("checked", false);
    $("#dv_AddToCart,#dv_No").removeAttr("AppType");
    $(".bgShadedDiv").hide();
    $("#dvPricePopUp").hide();
});

function AddToCart(cartDetails) {
    $.ajax({
        url: "../LmsEditProfile/AddToCart",
        type: 'Post',
        data: JSON.stringify({ 'cartDetails': cartDetails }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.d) {
                BindEstimatedPrice();
            }
        },
        error: ShowAjaxError
    });
}

$("#chk_Yearly").click(function () { BindEstimatedPrice(); });

function BindEstimatedPrice() {
    var EstimatedPrice = 0;
    if (CartList.length > 0) {

        for (var a = 0; a < CartList.length; a++) {
            if ($("#chk_Yearly").is(":checked")) {
                EstimatedPrice += Number(CartList[a].YearlyPrice);
                CartList[a].SelectedYearly = true;
            }
            else {
                EstimatedPrice += Number(CartList[a].MonthlyPrice);
                CartList[a].SelectedYearly = false;
            }
        }

        if (INROrDollarPrice)
            $(".PriceInInrOrDollar").empty().html("&#x20b9;").css('marginLeft', -16);
        else
            $(".PriceInInrOrDollar").empty().html("$").css('marginLeft', -16);

        if ($.trim($("#txt_CustomisedHours").val().length > 0) && $.trim($("#txt_CustomisedHours").val() != null) && $("#txt_CustomisedHours").val() != "") {
            if (INROrDollarPrice)
                EstimatedPrice += Number($("#txt_CustomisedHours").val() * 3000);
            else
                EstimatedPrice += Number($("#txt_CustomisedHours").val() * 20);
        }

        $("#txt_EstimatedPrice").empty().val(EstimatedPrice.toFixed(2));

        if ($("#txt_LowestNegotiablePrice").val().length > 0 && $("#txt_LowestNegotiablePrice").val() != 0) {
            var NegotiatedValue = parseFloat($("#txt_LowestNegotiablePrice").val());
            var LowestPrice = Number(EstimatedPrice * NegotiatedValue) / 100;

            var FinalPrice = Number($("#txt_EstimatedPrice").val() - LowestPrice);
            $("#txt_FinalPrice").empty().val(FinalPrice.toFixed(2));
        }

        $("#dvLoading").hide();
        $(".bgShadedDiv").hide();
        $("#dvPricePopUp").hide();
    }
    else {
        $(".PriceInInrOrDollar").empty().html("").css('marginLeft', 0);
        $("#txt_EstimatedPrice").val(0);
    }
}

//---------------------------------------------------

$("#a_CartSummaryDetails").click(function () {
    $("#ui_dvCartSummaryDetails").show();
    $(".bgShadedDiv").show();
    BindCartSummary();
});

$("#ui_dvCartData").slimScroll({
    height: '250px',
    width: '100%',
    railVisible: true,
    alwaysVisible: false,
    railOpacity: 0.3,
    color: '#73A00D',
    allowPageScroll: true
});

var feature, totalValue = 0;

BindCartSummary = function () {
    $("#tblCartData").empty();
    BindSelectedFeature(CartList);
};

BindSelectedFeature = function (feature) {

    totalValue = 0;

    var allcontent = "";
    if (feature != null && feature.length > 0) {
        $.each(feature, function (i) {

            var content = "";

            var priceValue = ($("#chk_Yearly").length > 0 && $("#chk_Yearly").is(":checked")) ? $(this)[0].YearlyPrice : $(this)[0].MonthlyPrice;

            content = "<tr id='ui_tdFeature_" + $(this)[0].FeatureId + "'><td style='width:100%;' ><table style='width:100%;'><tr><td style='width: 50%; text-align: left;' valign='top'><span class='cartFeaturesTxt'> " + $(this)[0].FeatureName + "</span><br /><br/>" +
                            "<span style='font-size: 12px;'>" + $(this)[0].UnitType + " " + $(this)[0].OpttedRange + "</span></td> " +
                            "<td style='width: 50%;' valign='top' align='right'><span class='cartamnoutNewDetails'>" + ($(this)[0].PriceInINRorDollar == true ? "&#x20b9;" : "$") + " " + priceValue + "</span><br /><br/><a class='cartFeaturesTxt' style='text-decoration: none;font-size: 12px;' href='" + $(this)[0].PurchaseLink + "'>Update</a></td> " +
                      "</tr>" +
                    "<tr>" +
                        "<td colspan='2' align='right' class='remove'><label style='cursor:pointer;' onclick='RemoveFromCart(" + $(this)[0].FeatureId + ");'>remove</label></td> " +
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
        content = "<tr><td style='width:100%;'><table style='width:100%;'><tr><td style='width: 180px; text-align: left;' valign='top'><span class='cartFeaturesTxt'>Cart is Empty</span><br>" +
                        "</td> " +
                        "<td valign='top' class='cartamnoutNewDetails'> </td> " +
                  "</tr></table>" +
               "</td></tr>";
        $("#tblCartData").append(content);
    }
};

BindFinalVATGrandTotal = function (feature) {

    var tdContent = "<tr style='font-size: 17px;font-weight: 700;color: #7c8081;background-color: #f3e650;'><td colspan='2' style='padding:15px;' class='totalAmount'><div style='float:left;vertical-align: top;'>GRAND TOTAL</div><div class='cartamnoutNewDetails' style='float:right;vertical-align: top;'><sup>" + (feature[0].PriceInINRorDollar == true ? "&#x20b9;" : "$") + "</sup> " + totalValue.toFixed(2) + "</div></td></tr>";
    $("#tblCartData > tbody:last").append(tdContent);
};

function RemoveApp(AppName) {
    var dicValues = JSLINQ(valuesDictionary).Where(function () {
        return (this.Name == AppName);
    });

    for (var a = 0; a < CartList.length; a++) {
        if (CartList[a].FeatureName == dicValues.items[0].FeatureName) {
            CartList.splice(a, 1);
            BindEstimatedPrice();
            break;
        }
    }
}

function RemoveFromCart(FeatureId) {
    for (var a = 0; a < CartList.length; a++) {
        if (CartList[a].FeatureId == FeatureId) {
            var dicValues = JSLINQ(valuesDictionary).Where(function () {
                return (this.FeatureName == CartList[a].FeatureName);
            });

            $("#chk_" + dicValues.items[0].Name).prop("checked", false);
            CartList.splice(a, 1);
            $("#ui_tdFeature_" + FeatureId).remove();
            BindCartSummary();
            BindEstimatedPrice();
            break;
        }
    }
}

function INROrDollar(INROrDollar) {
    INROrDollarPrice = INROrDollar;
    if (INROrDollarPrice) {
        $("#ddl_INROrDollar").val(0);
        $(".INROrDollarCurrency,.PriceInInrOrDollar").empty().html("&#x20b9;").css('marginLeft', -16);
    }
    else {
        $("#ddl_INROrDollar").val(1);
        $(".INROrDollarCurrency,.PriceInInrOrDollar").empty().html("$").css('marginLeft', -16);
    }
}

$("#ddl_INROrDollar").change(function () {

    if ($("#ddl_INROrDollar").val() == "0")
        INROrDollar(true);
    else
        INROrDollar(false);

    if ($("input[name='ProductType']").is(":checked") && CartList != null && CartList.length > 0) {

        var MonthlyPrice = 0;
        var YearlyPrice = 0;
        NewCartList.length = 0;
        for (var a = 0; a < CartList.length; a++) {
            var EachFeature = CartList[a];

            var dicValues = JSLINQ(valuesDictionary).Where(function () {
                return (this.FeatureName == EachFeature.FeatureName);
            });

            var Feature = JSLINQ(PriceDetials).Where(function () {
                return (this.Name == dicValues.items[0].FeatureName);
            });

            if (dicValues.items[0] != undefined) {
                var priceDetails = Feature.items[0];
            }

            var cartDetails = new Object();

            cartDetails.FeatureName = dicValues.items[0].FeatureName;
            cartDetails.PurchaseLink = priceDetails.PurchaseLink;
            cartDetails.FeatureId = priceDetails.Id;
            cartDetails.UnitType = priceDetails.FeatureUnitTypeId == 1 ? "Impressions" : priceDetails.FeatureUnitTypeId == 2 ? "Contacts" : "Users";
            cartDetails.OpttedRange = EachFeature.OpttedRange;

            if (INROrDollarPrice)
                cartDetails.MonthlyPrice = Number(((EachFeature.OpttedRange * priceDetails.PricePerUnitInINR) / priceDetails.MinUnitValue).toFixed(2));
            else
                cartDetails.MonthlyPrice = Number(((EachFeature.OpttedRange * priceDetails.PricePerUnit) / priceDetails.MinUnitValue).toFixed(2));

            cartDetails.YearlyPrice = Number((cartDetails.MonthlyPrice * 12) - (0.2 * cartDetails.MonthlyPrice)).toFixed(2);

            MonthlyPrice = MonthlyPrice + parseFloat(cartDetails.MonthlyPrice);
            YearlyPrice = YearlyPrice + parseFloat(cartDetails.YearlyPrice);

            if ($("#chk_Yearly").is(':checked'))
                cartDetails.SelectedYearly = true;
            else
                cartDetails.SelectedYearly = false;

            cartDetails.PriceInINRorDollar = INROrDollarPrice;

            NewCartList.push(cartDetails);
        }

        CartList = $.extend(true, [], NewCartList);

        var CustomisedPrice = 0;

        if ($.trim($("#txt_CustomisedHours").val().length != 0) && $.trim($("#txt_CustomisedHours").val() != null) && $("#txt_CustomisedHours").val() != "") {
            if (INROrDollarPrice)
                CustomisedPrice = Number($("#txt_CustomisedHours").val() * 3000);
            else
                CustomisedPrice = Number($("#txt_CustomisedHours").val() * 20);
        }

        if ($("#chk_Yearly").is(":checked"))
            $("#txt_EstimatedPrice").empty().val(Number(YearlyPrice + CustomisedPrice).toFixed(2));
        else
            $("#txt_EstimatedPrice").empty().val(Number(MonthlyPrice + CustomisedPrice).toFixed(2));

        if ($("#txt_LowestNegotiablePrice").val().length > 0 && $("#txt_LowestNegotiablePrice").val() != 0) {
            var NegotiatedValue = parseFloat($("#txt_LowestNegotiablePrice").val());
            var LowestPrice = Number($("#txt_EstimatedPrice").val() * NegotiatedValue) / 100;

            var FinalPrice = Number($("#txt_EstimatedPrice").val() - LowestPrice);
            $("#txt_FinalPrice").empty().val(FinalPrice.toFixed(2));
        }
    }
});

$("#btnSendEmailQuote").click(function () {

    $("#dvLoading").show();

    var EstimatedCustomisedHours = 0;
    var EstimatedPrice = 0;
    var NegotiablePrice = 0;
    var FinalPrice = 0;

    if ($("#ui_txtContactEmailId").val().length == 0) {
        ShowErrorMessage("Please enter the Email Address");
        $("#dvLoading").hide();
        return;
    }

    if ($("#ui_txtContactEmailId").val().length > 0 && !regExpEmail.test($("#ui_txtContactEmailId").val())) {
        ShowErrorMessage("Please enter valid email Id");
        $("#dvLoading").hide();
        return false;
    }

    if ($("#txt_CustomisedHours").val().length > 0 && $.trim($("#txt_CustomisedHours").val() != ""))
        EstimatedCustomisedHours = $("#txt_CustomisedHours").val();

    if ($("#txt_EstimatedPrice").val().length > 0 && $.trim($("#txt_EstimatedPrice").val() != ""))
        EstimatedPrice = $("#txt_EstimatedPrice").val();

    if ($("#txt_LowestNegotiablePrice").val().length > 0 && $.trim($("#txt_LowestNegotiablePrice").val() != ""))
        NegotiablePrice = $("#txt_LowestNegotiablePrice").val();

    if ($("#txt_FinalPrice").val().length > 0 && $.trim($("#txt_FinalPrice").val() != ""))
        FinalPrice = $("#txt_FinalPrice").val();

    if ($("input[name='ProductType']").is(":checked") && CartList != null && CartList.length > 0) {
        $.ajax({
            url: "../LmsEditProfile/SendEmailQuoteToUser",
            type: 'POST',
            data: JSON.stringify({ 'EmailId': $("#ui_txtContactEmailId").val(), 'cartList': CartList, 'NegotiablePrice': NegotiablePrice, 'FinalPrice': FinalPrice, 'EstimatedPrice': EstimatedPrice, 'CustomisationHours': EstimatedCustomisedHours }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response)
                    ShowErrorMessage("Estimated Price Quotation Mail sent successfully");
                else
                    ShowErrorMessage("Some Problem in Sending");

                $(".bgShadedDiv").hide("fast");
                $("#dvLoading").hide();
            },
            error: ShowAjaxError
        });
    }
    else {
        ShowErrorMessage("Please select atleast one Product Type.");
    }
});

$("#txt_CustomisedHours").change(function () {
    if ($("input[name='ProductType']").is(":checked") && CartList != null && CartList.length > 0)
        BindEstimatedPrice();
});

$("#dv_Impressions").change(function () {
    $("#dvLoading").show();

    if ($("#dv_Impressions").val() != 0)
        $("#slider_price").slider("value", $("#dv_Impressions").val());
    else
        $("#slider_price").slider("value", 0);

    $("#dvLoading").hide();
});

$("#txt_LowestNegotiablePrice").change(function () {
    if ($("input[name='ProductType']").is(":checked") && CartList != null && CartList.length > 0 && $("#txt_LowestNegotiablePrice").val() != 0 && $("#txt_LowestNegotiablePrice").val().length > 0)
        BindEstimatedPrice();
});






