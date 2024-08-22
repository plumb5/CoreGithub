if (window.location.protocol != "https:" && window.document.URL.toLowerCase().indexOf("local") < 0)
    window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);

var valuesDictionary = [
    { "Name": "WebEngagement", "FeatureName": "Engagement" },
    { "Name": "MobileEngagement", "FeatureName": "Mobile Engagement" },
    { "Name": "EmailEngagement", "FeatureName": "Email Marketing" },
    { "Name": "SmsEngagement", "FeatureName": "SMS Marketing" },
    { "Name": "SiteChatEngagement", "FeatureName": "Live Chat" },
    { "Name": "LeadManagement", "FeatureName": "Lead Management" },
    //{ "Name": "CommunityBuilder", "FeatureName": "Community Builder" },
    { "Name": "MarketingDashboards", "FeatureName": "Marketing Dashboards" },
    { "Name": "SocialMarketing", "FeatureName": "Social Marketing" },
    { "Name": "Analytics", "FeatureName": "Web & Mobile Analytics" }
];

var PriceDetials;
var INROrDollarPrice = false;
var CartList = new Array();
var MonthlyOrYearly = false;
var CartExists = false;
var PriceChange = false;

$(document).ready(function () {
    BindPriceDetails();
});

BindPriceDetails = function () {
    $.ajax({
        url: "../Pricing/GetAllFeatures",
        type: 'GET',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            if (response.featureslist.length > 0) {

                PriceDetials = response.featureslist;
                INROrDollar(response.IsINROrDollar);

                if (response.cartAddList != null && response.cartAddList.length > 0) {
                    CartExists = true;
                }

                for (var i = 0; i < valuesDictionary.length; i++) {
                    var Feature = JSLINQ(PriceDetials).Where(function () {
                        return (this.Name == valuesDictionary[i].FeatureName);
                    });
                    if (Feature.items[0] != undefined) {
                        var priceDetails = Feature.items[0];
                        if (!CartExists) {
                            $("#chk_All").prop("checked", true);
                            $("#chk_" + valuesDictionary[i].Name).prop("checked", true);
                        }
                        else {
                            if (response.cartAddList[i] != undefined) {
                                var sample = JSLINQ(valuesDictionary).Where(function () {
                                    return (this.FeatureName == response.cartAddList[i].FeatureName);
                                });

                                if (sample.items[0] != null && sample.items[0].Name.length > 0)
                                    $("#chk_" + sample.items[0].Name).prop("checked", true);
                            }
                            else {
                                $("#chk_" + valuesDictionary[i].Name).prop("checked", false);
                            }
                        }
                        IntializeSlider(valuesDictionary[i], priceDetails);
                    }
                }
            }
            CalculateGrandTotal();
            if (CartExists) {
                EditBindCart(response.cartAddList);
            }
        },
        error: function (error) {
            window.console.log(error);
        }
    });
};

function IntializeSlider(feature, priceDetails) {
    $('#slider_' + feature.Name).slider({
        range: "min",
        value: priceDetails.MinUnitValue,
        min: priceDetails.MinUnitValue,
        max: priceDetails.MaxUnitValue,
        change: function (event, ui) {
            if (ui.value > 0 && $("#chk_" + feature.Name).is(":checked")) {
                var MonthlyPrice = "";
                $('#dv_Impressions_' + feature.Name).val(ui.value);

                if (INROrDollarPrice)
                    MonthlyPrice = (ui.value * priceDetails.PricePerUnitInINR) / priceDetails.MinUnitValue;
                else
                    MonthlyPrice = (ui.value * priceDetails.PricePerUnit) / priceDetails.MinUnitValue;

                $('#dv_Price_' + feature.Name).html(MonthlyPrice.toFixed(2));

                var yearPrice = (MonthlyPrice * 12) - (0.2 * MonthlyPrice).toFixed(2);
                $('#dv_YearlyPrice_' + feature.Name).html(yearPrice.toFixed(2));
            }
            else {
                $(this).slider("value", 0);
            }
            CalculateGrandTotal();
        }
    });

    if ($("#chk_" + feature.Name).is(":checked")) {
        $('#dv_Impressions_' + feature.Name).val(priceDetails.MinUnitValue);

        var MonthlyPrice = "";

        if (INROrDollarPrice)
            MonthlyPrice = (priceDetails.MinUnitValue * priceDetails.PricePerUnitInINR) / priceDetails.MinUnitValue;
        else
            MonthlyPrice = (priceDetails.MinUnitValue * priceDetails.PricePerUnit) / priceDetails.MinUnitValue;

        $('#dv_Price_' + feature.Name).html(MonthlyPrice.toFixed(2));

        var yearPrice = (MonthlyPrice * 12) - (0.2 * MonthlyPrice).toFixed(2);
        $('#dv_YearlyPrice_' + feature.Name).html(yearPrice.toFixed(2));
    }
}

$("input[type='checkbox']:not(#ui_chkYearly,#chk_All)").click(function () {
    if ($("#dv_Impressions_" + $(this).attr("tag")).val() == 0 && $("#chk_" + $(this).attr("tag")).is(":checked")) {
        var tag = $(this).attr("tag");

        var dicValues = JSLINQ(valuesDictionary).Where(function () {
            return (this.Name == tag);
        });

        var Feature = JSLINQ(PriceDetials).Where(function () {
            return (this.Name == dicValues.items[0].FeatureName);
        });
        if (Feature.items[0] != undefined) {
            $("#slider_" + tag).slider("value", Feature.items[0].MinUnitValue);
        }
    }
    else {
        $("#dv_Impressions_" + $(this).attr("tag")).val(0);
        $("#dv_Price_" + $(this).attr("tag")).html("0")
    }

    ShowPopUp();
    CalculateGrandTotal();
})

function CalculateGrandTotal() {
    var Monthlyprice = 0; var yearPrice = 0;
    CartList.length = 0;
    for (var i = 0; i < valuesDictionary.length; i++) {
        if ($("#chk_" + valuesDictionary[i].Name).is(':checked')) {
            var data = $("#slider_" + valuesDictionary[i].Name).slider("value");
            var Feature = JSLINQ(PriceDetials).Where(function () {
                return (this.Name == valuesDictionary[i].FeatureName);
            });

            if (Feature.items[0] != undefined) {
                var priceDetails = Feature.items[0];

                if (INROrDollarPrice)
                    Monthlyprice += (data * priceDetails.PricePerUnitInINR) / priceDetails.MinUnitValue;
                else
                    Monthlyprice += (data * priceDetails.PricePerUnit) / priceDetails.MinUnitValue;
            }

            var cartDetails = new Object();

            cartDetails.FeatureName = valuesDictionary[i].FeatureName;
            cartDetails.PurchaseLink = priceDetails.PurchaseLink;
            cartDetails.FeatureId = priceDetails.Id;
            cartDetails.UnitType = priceDetails.FeatureUnitTypeId == 1 ? "Impressions" : priceDetails.FeatureUnitTypeId == 2 ? "Contacts" : "Users";
            cartDetails.OpttedRange = data;

            if (INROrDollarPrice)
                cartDetails.MonthlyPrice = (data * priceDetails.PricePerUnitInINR) / priceDetails.MinUnitValue;
            else
                cartDetails.MonthlyPrice = (data * priceDetails.PricePerUnit) / priceDetails.MinUnitValue;

            cartDetails.YearlyPrice = (cartDetails.MonthlyPrice * 12) - (0.2 * cartDetails.MonthlyPrice).toFixed(2);

            if ($("#ui_chkYearly").is(':checked'))
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
        }

        if (PriceChange) {
            $('#dv_Price_' + valuesDictionary[i].Name).html(cartDetails.MonthlyPrice.toFixed(2));
            $('#dv_YearlyPrice_' + valuesDictionary[i].Name).html(cartDetails.YearlyPrice.toFixed(2));
        }

        if ($("#ui_chkYearly").is(":checked")) {
            yearPrice = (Monthlyprice * 12) - (0.2 * Monthlyprice).toFixed(2);
            var YearlyPrice = parseFloat(yearPrice);
            $("#dv_GrandTotal").empty().html(YearlyPrice.toFixed(2));
        }
        else {
            var MonthlyTotalValue = parseFloat(Monthlyprice);
            $("#dv_GrandTotal").empty().html(MonthlyTotalValue.toFixed(2));
        }
    }
}

EditBindCart = function (cartAddList) {

    if (cartAddList[0].SelectedYearly)
        $("#ui_chkYearly").prop("checked", true);

    INROrDollar(cartAddList[0].PriceInINRorDollar);

    for (var i = 0; i < cartAddList.length; i++) {
        var sample = JSLINQ(valuesDictionary).Where(function () {
            return (this.FeatureName == cartAddList[i].FeatureName);
        });

        if (sample.items[0] != null && sample.items[0].Name.length > 0) {
            $("#chk_" + sample.items[0].Name).prop("checked", true);
            $("#slider_" + sample.items[0].Name).slider("value", cartAddList[i].OpttedRange);
        }
    }
};

$("#ui_chkYearly").click(function () {
    CalculateGrandTotal()
});

$("#btnCheckOut").click(function () {

    $("#dvLoading").show();

    if ($("input:checkbox:checked:not(#ui_chkYearly,#chk_All)").length > 0) {
        $.ajax({
            url: "../Pricing/CheckIsSuperAdminBeforePurchase",
            type: 'POST',
            async: false,
            contentType: "application/json; charset=utf-8",
            success: function (response) {
                if (response.d) {
                    AddToCart(CartList);
                }
                else {
                    $("#ui_lblerror").html("You are not the owner of this account, So you cannot purchase.");
                    $("#dvLoading").hide();
                }
            },
            error: function (error) {
                window.console.log(error.responseText);
            }
        });
    }
    else {
        $("#dvLoading").hide();
        $("#ui_lblerror").html("You have not selected any apps");
    }
});

function AddToCart(cartDetails) {
    $.ajax({
        url: "../Pricing/AddToCart",
        type: 'Post',
        data: JSON.stringify({ 'cartDetails': cartDetails }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.d) {

                if (response.IsSessionExitis) {
                    window.location.href = "/Pricing/Payment";
                }
                else {
                    window.location.href = "SignUp.html";
                }
            }
        },
        error: function (error) {
            $("#ui_lblerror").html("Something went wrong, Please try again after some time or contact support@plumb5.com");
        }
    });
}

$("input[type='text']").change(function () {
    var tag = $(this).attr("tag");

    if ($("#chk_" + tag).is(':checked')) {
        if ($("#dv_Impressions_" + tag).val() != 0) {
            $("#chk_" + tag).prop("checked", true);
            $("#slider_" + tag).slider("value", $("#dv_Impressions_" + tag).val());
        }
        else {
            $("#chk_" + tag).prop("checked", false);
            $("#slider_" + tag).slider("value", 0);
            $("#dv_Impressions_" + $(this).attr("tag")).val(0);
            $("#dv_Price_" + $(this).attr("tag")).html("0")
        }
    }
});

$(".numbervalues").keypress(function (event) {
    var charCode = window.event ? window.event.keyCode : event.which; //firefox    

    if (charCode >= 48 && charCode <= 57) return true;
    return false;
});

$("#chk_All").click(function () {
    if ($(this).is(':checked')) {
        for (var i = 0; i < valuesDictionary.length; i++) {
            if (!$("#chk_" + valuesDictionary[i].Name).is(":checked"))
                $("#chk_" + valuesDictionary[i].Name).click();
        }
    }
    else {
        for (var i = 0; i < valuesDictionary.length; i++) {
            if ($("#chk_" + valuesDictionary[i].Name).is(":checked"))
                $("#chk_" + valuesDictionary[i].Name).click();
        }
        ShowPopUp();
    }
});

function ShowPopUp(IsHide) {
    if (($("#chk_EmailEngagement").is(':checked') || $("#chk_SmsEngagement").is(':checked')) && IsHide == undefined)
        $(".holder").show();
    else
        $(".holder").hide();
}

function INROrDollar(INROrDollar) {
    INROrDollarPrice = INROrDollar;
    if (INROrDollarPrice) {
        $("#ddl_INROrDollar").val(0);
        $(".INROrDollarCurrency").empty().html("&#x20b9;");
    }
    else {
        $("#ddl_INROrDollar").val(1);
        $(".INROrDollarCurrency").empty().html("$");
    }
}

$("#ddl_INROrDollar").change(function () {
    if ($(this).val() == "0")
        INROrDollar(true);
    else
        INROrDollar(false);

    PriceChange = true;
    CalculateGrandTotal();
});

