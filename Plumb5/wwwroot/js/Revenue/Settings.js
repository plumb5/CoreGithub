var customeventFieldList = [], RevEventName = [], RowsCount = 0, EventExtraFiledsName = [], SelectedRevenue = [];
var customeventname = '';
var totalCustomEvent = 0;
var load = true;
var loaddataindex = 0;
var evenNames = "";


$(document).ready(function () {
    RevenueReportUtil.GetRevEventName();
});

var RevenueReportUtil = {
    GetRevenueData: function () {
        $.ajax({
            url: "/Revenue/RevenueSettings/GetRevenueSettingsData",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {

                if (response.length > 0) {
                    $.each(response, function (k) {
                        $("#ddlCurrency").val(this.CurrencyType);
                        loaddataindex = loaddataindex + 1;
                        var loaddata = {
                            CurrencyType: this.CurrencyType,
                            CustomEventOverViewId: this.CustomEventOverViewId,
                            CustomEventName: this.CustomEventName,
                            CustomEventFiledName: this.CustomEventFiledName
                        };
                        SelectedRevenue = [];
                        SelectedRevenue.push(loaddata);

                        bindData();
                        RevenueReportUtil.BindRevEventName();
                        bindOnchange();
                    });
                } else {
                    bindData();
                    RevenueReportUtil.BindRevEventName();
                    bindOnchange();
                }

            },
            error: ShowAjaxError
        });
    },
    GetRevEventName: function () {
        $.ajax({
            url: "/Revenue/RevenueSettings/GetEventnames",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.length > 0) {
                    if (response != null && response != undefined)
                        $.each(response, function () {
                            evenNames += '<option attr_name="EventData' + this.EventName + '" value="' + this.Id + '">' + this.EventName + '</option>';
                        });
                } else {
                    HidePageLoading();
                }

                RevenueReportUtil.GetRevenueData();
            },
            error: ShowAjaxError
        });
    },
    BindRevEventName: function () {

        $("#ddlRevenue_" + totalCustomEvent).empty();
        $("#ddlRevenue_" + totalCustomEvent).append(`<option value="select">Select</option>`);
        if ((evenNames != undefined && evenNames != null) && evenNames != "") {

            $(".ddlRevenue").append(evenNames);

            if (load) {
                if (SelectedRevenue.length > 0) {
                    RevenueReportUtil.GetRevEventAttribute(loaddataindex, SelectedRevenue[0].CustomEventOverViewId, SelectedRevenue[0].CustomEventFiledName);
                    $("#ddlRevenue_" + loaddataindex).val(SelectedRevenue[0].CustomEventOverViewId);
                } else {
                    $("#ddlAttribute_" + totalCustomEvent).empty();
                    $("#ddlAttribute_" + totalCustomEvent).append('<option value="Select">Select</option>');
                }
            }
            else {
                $("#ddlAttribute_" + totalCustomEvent).empty();
                $("#ddlAttribute_" + totalCustomEvent).append('<option value="Select">Select</option>');
            }

            HidePageLoading();
        }

    },
    GetRevEventAttribute: function (id, EventId, selectedVal) {
        //ShowPageLoading();
        $('#ddlAttribute_' + id).empty();
        $('#ddlAttribute_' + id).append('<option value="Select">Select</option>');
        $.ajax({
            url: "/Revenue/RevenueCustomEventViewDetails/GetEventExtraFieldData",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'customEventOverViewId': EventId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $.each(response, function (k) {
                    var indexposition = k + 1;
                    EventExtraFiledsName.push(this.FieldName);
                    if (this.FieldMappingType.indexOf("number") > -1) {

                        $('#ddlAttribute_' + id).append('<option value="EventData' + indexposition + '">' + this.FieldName + '</option>');

                    }
                });
                if (selectedVal != null) {
                    $("#ddlAttribute_" + id).val(selectedVal);
                }
                //HidePageLoading();
            },
            error: ShowAjaxError
        });


    }

}

function bindData() {
    totalCustomEvent = totalCustomEvent + 1;
    let addeventmapitem = `<div class="currencyitemwrp" id="` + totalCustomEvent + `">
  <div class="form-group mr-3 dsk-50-mob-100">
    <label class="frmlbltxt" for="">Revenue Event Name</label>
    <select id="ddlRevenue_`+ totalCustomEvent + `" class="form-control revmappaddtocart ddlRevenue">
        <option value="select">Select</option>
    </select>
  </div>
  <div class="form-group dsk-50-mob-100">
    <label class="frmlbltxt" for="">Revenue Attribute (Amount)</label>
    <select id="ddlAttribute_`+ totalCustomEvent + `" class="form-control  revmappaddtocart ddlAttribute">
    <option value="select">Select</option>
  </select>
  </div>
  <i class="icon ion-ios-close-outline closerevenuemapp"></i>
</div>`;
    $(".currencyitems").append(addeventmapitem);

    $(".revmappaddtocart").select2({
        minimumResultsForSearch: "",
        dropdownAutoWidth: false,
    });

    CloseEventItem();
}

$("#addeventfrm").click(function () {
    load = false;
    bindData();
    RevenueReportUtil.BindRevEventName();
    bindOnchange();
    $("#dvSettings").scrollTop($("#dvSettings")[0].scrollHeight);
    $("#ddlAttribute_" + totalCustomEvent).empty();
    $("#ddlAttribute_" + totalCustomEvent).append('<option value="Select">Select</option>');
});

function CloseEventItem() {
    $(".closerevenuemapp").click(function () {
        $(this).parent().remove();
    });
}


$("#btnSave").click(function () {
    if ($("#ddlCurrency :selected").val() == 'select') {
        ShowErrorMessage(GlobalErrorList.Revenue.Currency);
        return false;
    }

    var errorEvent = false, errorField = false, errorduplicate = false;
    var arrayRevenue = [];
    var checkduplicatearrayRevenue = [];
    $(".currencyitemwrp").each(function (k) {
        var loop = this.id;
        if ($("#ddlRevenue_" + loop + " :selected").text() == 'Select') {
            ShowErrorMessage(GlobalErrorList.Revenue.Event);
            errorEvent = true;
        }
        else if ($("#ddlAttribute_" + loop + " :selected").val() == 'Select') {
            ShowErrorMessage(GlobalErrorList.Revenue.Attribute);
            errorField = true;
        }

        if (!checkduplicatearrayRevenue.includes($("#ddlRevenue_" + loop + " :selected").val() + '_' + $("#ddlAttribute_" + loop + " :selected").val()))
            checkduplicatearrayRevenue.push($("#ddlRevenue_" + loop + " :selected").val() + '_' + $("#ddlAttribute_" + loop + " :selected").val())
        else {
            ShowErrorMessage(GlobalErrorList.Revenue.Duplicatemapping);
            $("#ddlAttribute_" + loop).focus();
            errorduplicate = true;
        }
        arrayRevenue.push({
            CurrencyType: $("#ddlCurrency :selected").val(),
            CustomEventOverViewId: $("#ddlRevenue_" + loop + " :selected").val(),
            CustomEventName: $("#ddlRevenue_" + loop + " :selected").text(),
            CustomEventFiledName: $("#ddlAttribute_" + loop + " :selected").val()
        });

    });
    //alert(JSON.stringify(arrayRevenue));
    if (errorEvent == false && errorField == false && errorduplicate == false) {
        $.ajax({
            url: "/Revenue/RevenueSettings/SaveRevenue",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'RevenueSettings': JSON.stringify(arrayRevenue) }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                ShowSuccessMessage(GlobalErrorList.Revenue.Success);
            },
            error: ShowAjaxError
        });
    }
});

function bindOnchange() {
    $('.ddlRevenue').on('change', function () {

        var id = parseInt(this.id.replace("ddlRevenue_", ""));
        var customEventOverViewId = this.value;

        RevenueReportUtil.GetRevEventAttribute(id, customEventOverViewId, null);
    });
}

var EventExtraFiledsName;
function RevenueEventMappingDetails() {
    EventExtraFiledsName = [];

    $.ajax({
        url: "/Revenue/RevenueCustomEventViewDetails/GetEventExtraFieldData",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'customEventOverViewId': customeventoverviewid }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (response) {
            EventExtraFiledsName = response;

        },

        error: ShowAjaxError
    });
}