$(document).ready(function () {
    HidePageLoading();
    GetLmAdvacedSettings();
    GetLmssourcetype();
    GetLmsPublisherSettings();
});

var Id;
var lmsadvancedsettings = { Id: Id, Key: "HANDLEBY", Value: 0 }

var SourceId;
var lmssourcetype = { Id: SourceId, type: 0 }
$("#ui_btnSaveNotification").click(function () {
    // var hierarchyChecked = document.getElementById('ui_radHierarchy').checked;
    //var allChecked = document.getElementById('ui_radAll').checked;
    lmsadvancedsettings.Id = Id;
    lmsadvancedsettings.Value = $('input[name="HandledBy"]:checked').val();

    $.ajax({
        url: "/Prospect/AdvancedSettings/SaveOrUpdate",
        type: 'Post',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'advancedsettings': lmsadvancedsettings }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            GetLmAdvacedSettings();
            ShowSuccessMessage("Data Updated Successfully");
        },
        error: function (error) {
            // Your error handling logic here
            console.error(error);
        }
    });
});

function GetLmAdvacedSettings() {
    $.ajax({
        url: "/Prospect/AdvancedSettings/GetLmAdvacedSettings",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'key': "HANDLEBY" }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var data = response[0];
            if (data !== undefined) {
                $('input[name="HandledBy"][value="' + data.Value + '"]').prop('checked', true);
            }
        },
        error: function (error) {
            HidePageLoading();
            // Your error handling logic here
        }
    });
}

$("#btnSourceType").click(function () {

    $('#btnSourceType').attr('disabled', 'disabled');
    $('#ddlSourceType').attr('disabled', 'disabled');
    var selectedValue = $("#ddlSourceType").val();
    lmssourcetype.type = selectedValue;
    lmssourcetype.Id = SourceId;
    console.log("Selected Value: " + selectedValue);
    $.ajax({
        url: "/Prospect/LeadSource/SaveOrUpdate",
        type: 'Post',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'lmssourcetype': lmssourcetype }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            console.log(response);
            ShowSuccessMessage("Data Updated Successfully");
        },
        error: function (error) {
            // Your error handling logic here
            console.error(error);
        }
    });
});

function GetLmssourcetype() {

    $.ajax({
        url: "/Prospect/LeadSource/GetLmsSorceType",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var data = response[0];


            if (data !== undefined) {
                $('#btnSourceType').attr('disabled', 'disabled');
                $('#ddlSourceType').attr('disabled', 'disabled');
                SourceId = data.Id;
                $('#ddlSourceType').val(data.Type);
            }



        },
        error: function (error) {
            HidePageLoading();
            // Your error handling logic here
        }
    });
}

var userList = "";
var assignPublisherCount = 1;
var assignPublisherArray = [1];
InitializeUsersList();

$("#addPublisher").click(function () {

    if (!ValidationPublisherFields()) {
        return;
    }

    assignPublisherCount++;
    assignPublisherArray.push(assignPublisherCount);
    let addfieldsinput = `<div class="row position-relative lmsrepfildanswrp">
                             <div class="col-sm-2">
                                    <div class="form-group">
                                        <label for="" class="frmlbltxt">Publisher's Name</label>
                                         <select class="form-control select2drpdwnbrd" name=""  id="ui_ddlUserListcon_${assignPublisherCount}" data-placeholder="Add Fields">
                                            <option value="0">Select User</option>${userList}
                                        </select>
                                    </div>
                                </div>
                              <div class="col-sm-2">
                                <div class="form-group">
                                  <label for="" class="frmlbltxt">Value</label>
                                  <input type="text" name="" class="form-control form-control-sm" id="ui_assignsalesvalue_${assignPublisherCount}">
                                </div>
                              </div>
                              <div class="col-sm-2">
                                        <div class="form-group">
                                            <label for="" class="frmlbltxt">Masking Data</label>
                                            <div class="custom-control custom-checkbox">
                                                <input type="checkbox" class="custom-control-input" id="ui_mask_${assignPublisherCount}" name="maskdatamod">
                                                <label class="custom-control-label" for="ui_mask_${assignPublisherCount}"></label>
                                            </div>
                                        </div>
                                    </div>
   
                            <i class="ion ion-ios-close-outline font-18 mr-20 cursor-pointer removesalescusteventrepfild" closeid="Closecondsalesdiv" id=${assignPublisherCount}></i>
                              </div>
 
  
                            </div>`;
    $(".Publisherfields").append(addfieldsinput);

    $(".removesalescusteventrepfild").click(function () {
        let id = parseInt($(this).attr("id"));
        assignsalesSourceCountArray = assignPublisherArray.filter(item => item !== id);
        $(this).parent().remove();
    });

    $('#ui_ddlusergroupListcon_' + assignPublisherCount + ', #ui_ddlUserListcon_' + assignPublisherCount + ', #ui_assignsalescontactfields_' + assignPublisherCount).select2({
        minimumResultsForSearch: '',
        dropdownAutoWidth: false,
        containerCssClass: "border"
    });
});

function InitializeUsersList() {
    userList = "";
    $.ajax({
        url: "/ManageContact/ApiImportSettings/GetUser",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        dataFilter: function (data) { return data; },
        success: function (response) {
            assignsalespersonuserlist = response;
            if (response != undefined && response != null) {

                $.each(response, function (count) {
                    count = count + 1;
                    if ($(this)[0].ActiveStatus) {
                        userList += "<option value='" + $(this)[0].UserInfoUserId + "'>" + $(this)[0].FirstName + "</option>";
                    }
                });
                $("#ui_ddlUserListcon_1").append(userList);
            }

        },
        error: ShowAjaxError
    });
}


//publisher saving and validation part

$("#ui_btnSavePublisherSettings").click(function () {

    if (!ValidationPublisherFields()) {
        return false;
    }

    if (!ValidationDuplicateValues()) {
        return false;
    }

    var trList = $('[id^=ui_ddlUserListcon_]');
    var publisherarray = new Array();
    for (var j = 0; j < trList.length; j++) {
        var Id = trList[j].id.slice(-1);
        var publisherConditions = { userinfoid: 0, field: "", value: "", IsMasking: false };
        publisherConditions.userinfoid = parseInt($("#ui_ddlUserListcon_" + Id).val());
        publisherConditions.field = "Publisher";
        publisherConditions.value = $("#ui_assignsalesvalue_" + Id).val();

        if ($("#ui_mask_" + Id).is(":checked")) {
            publisherConditions.IsMasking = true;
        } else {
            publisherConditions.IsMasking = false;
        }
        publisherarray.push(publisherConditions);
    }

    lmsadvancedsettings.Key = "PUBLISHER"
    lmsadvancedsettings.Value = JSON.stringify(publisherarray);

    $.ajax({
        url: "/Prospect/AdvancedSettings/SaveOrUpdate",
        type: 'Post',
        data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'advancedsettings': lmsadvancedsettings }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            //GetLmAdvacedSettings();
            ShowSuccessMessage("Data Updated Successfully");
        },
        error: function (error) {
            console.error(error);
        }
    });

});

function ValidationPublisherFields() {
    var trList = $('[id^=ui_ddlUserListcon_]');

    for (var j = 0; j < trList.length; j++) {
        var Id = trList[j].id.slice(-1);

        if ($("#ui_ddlUserListcon_" + Id).get(0).selectedIndex == 0) {
            ShowErrorMessage(GlobalErrorList.MyReports.FieldValue_ErrorMessage);
            return false;
        }

        if ($("#ui_assignsalesvalue_" + Id).val() == "") {
            ShowErrorMessage(GlobalErrorList.MyReports.FieldAnswer_ErrorMessage);
            return false;
        }
    }
    return true;
}

function ValidationDuplicateValues() {
    var trList = $('[id^=ui_ddlUserListcon_]');

    var drpuseroption = new Array();
    var drpfield = new Array();
    var drpvalue = new Array();

    for (var j = 0; j < trList.length; j++) {
        var Id = trList[j].id.slice(-1);

        if ($.inArray($("#ui_ddlUserListcon_" + Id + " option:selected").val(), drpuseroption) > -1 && $.inArray($("#ui_assignsalescontactfields_" + Id).val(), drpfield) > -1 && $.inArray($("#ui_assignsalesvalue_" + Id).val(), drpvalue) > -1) {
            $("#ui_ddlUserListcon_" + Id).focus();
            ShowErrorMessage(GlobalErrorList.WorkFLow.duplicatedatafields_ErrorMessage);
            return false;
        }
        else {
            drpuseroption.push($("#ui_ddlUserListcon_" + Id + " option:selected").val());
            drpfield.push($("#ui_assignsalescontactfields_" + Id + " option:selected").val());
            drpvalue.push($("#ui_assignsalesvalue_" + Id).val());
        }
    }
    return true;
}

function GetLmsPublisherSettings() {
    $.ajax({
        url: "/Prospect/AdvancedSettings/GetLmAdvacedSettings",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'key': "PUBLISHER" }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindPublishers(response);
        },
        error: function (error) {
            HidePageLoading();
        }
    });
}

function BindPublishers(response) {
    if (response != null && response != "" && response != undefined && response[0].Value != "" && response[0].Value != null) {
        var arrraydata = JSON.parse(response[0].Value);

        for (let i = 0; i < arrraydata.length; i++) {
            if (i != 0) {
                $("#addPublisher").click();
            }

            $(`#ui_ddlUserListcon_${i + 1}`).val(arrraydata[i].userinfoid).trigger('change');
            $(`#ui_assignsalescontactfields_${i + 1}`).val(arrraydata[i].field).trigger('change');
            $(`#ui_assignsalesvalue_${i + 1}`).val(arrraydata[i].value);
            if (arrraydata[i].IsMasking)
                $(`#ui_mask_${i + 1}`).prop("checked", true);
            else
                $(`#ui_mask_${i + 1}`).prop("checked", false);
        }
    }
}


