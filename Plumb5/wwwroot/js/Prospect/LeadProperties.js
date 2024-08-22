var disablesearchbycolumn = ["leadlabel", "userinfouserid", "score"];
var disablepublishercolumn = ["emailid", "phonenumber","leadlabel", "score"];

var LeadPropertyCheckPrefix = "ui_chkPopUpLeadProperty_";
var PropertySettingList;
var checkedCheckboxData = [];
var PropertySetting = []
$(document).ready(function () {
    PropertyUtil.GetPropertySetting();
    PropertyUtil.Getlmsheaderflag();
    if (document.URL.includes("Prospect"))
        $(".setcolumnwrap").removeClass("hideDiv");

});

var headerflag = false;
var PropertyUtil = {
    Getlmsheaderflag: function () {
        $.ajax({
            url: "/Prospect/LeadProperties/GetLMSHeaderFlag",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                headerflag = result;
                $(".bwsnotifsteptog").toggles({
                    on: result,
                    height: 22
                });


            },
            error: ShowAjaxError
        });
    },
    GetPropertySetting: function () {
        ShowPageLoading();
        $.ajax({
            url: "/Prospect/LeadProperties/GetPropertySetting",
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: PropertyUtil.BindPropertySetting,
            error: ShowAjaxError
        });
    },
    BindPropertySetting: function (response) {
        PropertySettingList = null;
        SetNoRecordContent('ui_tableReport', 3, 'ui_tbodyReportData');
        if (response != undefined && response != null && response.length > 0) {
            PropertySettingList = response;
            PropertySetting = response;
            $("#ui_tableReport").removeClass('no-data-records');
            $("#ui_tbodyReportData").html('');
            $.each(response, function () {
                var OrderIconClass = "griddragicn";
                var checkboxId = `cont_${this.PropertyId}`;
                var isChecked = this.IsSearchbyColumn == true;
                var isPublisherField = this.IsPublisherField == true;

                // Push the values to the array
                checkedCheckboxData.push({ id: checkboxId, isChecked: isChecked, isPublisherField: isPublisherField });

                let disabled = disablesearchbycolumn.indexOf(this.PropertyName.toLowerCase()) > -1 ? "System Field" : `<input type="checkbox" class="custom-control-input" id="${checkboxId}" name="showall" ${(isChecked) ? 'checked' : ''}> <label class="custom-control-label" for="${checkboxId}"></label>`;
                let publisherfield = disablepublishercolumn.indexOf(this.PropertyName.toLowerCase()) > -1 ? `<input type="checkbox" class="custom-control-input" id="pub_${checkboxId}" name="showall" ${(isPublisherField) ? 'checked' : 'checked'} disabled> <label class="custom-control-label" for="pub_${checkboxId}"></label>` : `<input type="checkbox" class="custom-control-input" id="pub_${checkboxId}" name="showall" ${(isPublisherField) ? 'checked' : ''} > <label class="custom-control-label" for="pub_${checkboxId}"></label>`;

                let SettingTR = `<tr id="ui_trSetting_${this.PropertyId}" displayorder="${this.DisplayOrder}" value="${this.PropertyId}">
                                <td>
                                    <div class="groupnamewrap">
                                    <div class="nametxticnwrp">
                                      <i class="${OrderIconClass}"></i>
                                      <span class="wordbreak">${this.DisplayName}</span>
                                    </div>
                                    </div>
                                </td>
                                <td>${PropertyUtil.GetFieldName(this.FieldType)}</td>
                                <td>
                                 <div class="df-ac-jcenter">
                                 <div class="custom-control custom-checkbox">
                                     ${disabled} 
                                   
                                 </div>
                                 </div>
                               </td>
<td>
                                 <div class="df-ac-jcenter">
                                 <div class="custom-control custom-checkbox">
                                     ${publisherfield}

                                 </div>
                                 </div>
                               </td>
                           </tr>`;
                $("#ui_tbodyReportData").append(SettingTR);

                // Attach event listener to checkboxes
                $(`#${checkboxId}`).change(function () {
                    let isChecked = $(this).is(":checked");

                    // Count the number of checkboxes that are checked
                    let checkedCount = checkedCheckboxData.filter(item => item.isChecked === true).length;

                    if (isChecked && checkedCount >= 3) {
                        ShowErrorMessage("Only three Columns are allowed to search");
                        $(this).prop("checked", false);
                        return false;
                    } else {
                        // Update IsSearchByColumn on the server
                        let Id = checkboxId.replace("cont_", ""); // Extract propertyId from checkboxId
                        let isSearchByColumn = isChecked; // Use the checkbox's checked state

                        // Find the index of the clicked checkbox in the array
                        let index = checkedCheckboxData.findIndex(item => item.id === checkboxId);

                        if (index !== -1) {
                            checkedCheckboxData[index].isChecked = isChecked;
                        }
                        let ContactFieldProperty = { Id: Id, IsSearchByColumn: isSearchByColumn };
                        $.ajax({
                            url: "/Prospect/LeadProperties/UpdateIsSearchByColumn",
                            data: JSON.stringify({ 'c': ContactFieldProperty, 'AccountId': Plumb5AccountId }),
                            type: 'POST',
                            contentType: "application/json; charset=utf-8",
                            dataType: "json", 
                            success: function (response) {
                                ShowSuccessMessage("Updated successfully");
                            },
                            error: function () {
                                // Handle error if needed
                            }
                        });
                    }
                });

                // Attach event listener for publisher
                $(`#pub_${checkboxId}`).change(function () {
                    let isChecked = $(this).is(":checked");

                    // Update IsSearchByColumn on the server
                    let Id = checkboxId.replace("cont_", ""); // Extract propertyId from checkboxId
                    let isPublisherField = isChecked; // Use the checkbox's checked state

                    // Find the index of the clicked checkbox in the array
                    let index = checkedCheckboxData.findIndex(item => item.id === checkboxId);

                    if (index !== -1) {
                        checkedCheckboxData[index].isPublisherField = isChecked;
                    }
                    let ContactFieldProperty = { Id: Id, IsPublisherField: isPublisherField };

                    $.ajax({
                        url: "/Prospect/LeadProperties/UpdateIsPublisherField",
                        data: JSON.stringify({ 'c': ContactFieldProperty, 'AccountId': Plumb5AccountId }),
                        type: 'POST',
                        contentType: "application/json; charset=utf-8",
                        dataType: "json",
                        success: function (response) {
                            ShowSuccessMessage("Updated successfully");
                        },
                        error: function () {
                            // Handle error if needed
                        }
                    });

                });

            });
        }
        HidePageLoading();
    },
    GetFieldName: function (FieldType) {
        var FieldName = "NA";
        switch (FieldType) {
            case 1:
                FieldName = "Text Box";
                break;
            case 2:
                FieldName = "Multiline";
                break;
            case 3:
                FieldName = "DropDown";
                break;
            case 4:
                FieldName = "Radio Button";
                break;
            case 5:
                FieldName = "Checkbox";
                break;
        }
        return FieldName;
    },
    ShowPropertyPopUp: function () {
        PropertyUtil.GetAllProperty();
    },
    GetAllProperty: function () {
        ShowPageLoading();
        $.ajax({
            url: "/Prospect/LeadProperties/GetAllProperty",
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: PropertyUtil.BindAllProperty,
            error: ShowAjaxError
        });
    },
    BindAllProperty: function (response) {
        if (response != undefined && response != null && response.length > 0) {
            $("#ui_tbodyLeadAllProperty").html('');
            $("#ui_divPropertyPopUp").removeClass("hideDiv");
            $.each(response, function () {
                let PropertyTR = `<tr>
                                    <td class="text-center">
                                      <div class="custom-control custom-checkbox">
                                       <input type="checkbox" class="custom-control-input lmsleadpropSelIndiv" id="${LeadPropertyCheckPrefix + this.Id}" name="LeadAllProperty" iscustomfield="${this.IsCustomField}" propertyname="${this.PropertyName}" />
                                       <label class="custom-control-label" for="${LeadPropertyCheckPrefix + this.Id}"></label>
                                     </div>
                                      </td>
                                      <td class="text-left">${this.DisplayName}</td>
                                   </tr>`;
                $("#ui_tbodyLeadAllProperty").append(PropertyTR);
                if (this.PropertyName == "EmailId" || this.PropertyName == "PhoneNumber") {
                    $("#" + LeadPropertyCheckPrefix + this.Id).attr('disabled', true);
                    $("#" + LeadPropertyCheckPrefix + this.Id).attr('checked', true);
                }
            });

            if (PropertySettingList != undefined && PropertySettingList != null && PropertySettingList.length > 0) {
                for (var i = 0; i < PropertySettingList.length; i++) {
                    $("#" + LeadPropertyCheckPrefix + PropertySettingList[i].PropertyId).attr('checked', true);
                }
            }
        }
        HidePageLoading();
    },
    ClosePropertyPopUp: function () {
        $("#ui_divPropertyPopUp").addClass("hideDiv");
    },
    SavePropertySetting: function () {
        ShowPageLoading();
        var SettingList = [];
        var DeleteIdList = [];

        $("input:checkbox[name=LeadAllProperty]:checked").each(function () {
            var IsFieldMandatory = false;
            //if ($(this).attr("propertyname") == "EmailId" || $(this).attr("propertyname") == "PhoneNumber") {
            //    IsFieldMandatory = true;
            //}
            var ContactFieldEditSetting = { PropertyId: parseInt($(this).attr("id").replace(LeadPropertyCheckPrefix, "")), DisplayOrder: 0, IsMandatory: IsFieldMandatory, IsCustomField: $(this).attr("iscustomfield") == "false" ? false:true };
            SettingList.push(ContactFieldEditSetting);
        });

        $("input:checkbox[name=LeadAllProperty]:not(:checked)").each(function () {
            DeleteIdList.push($(this).attr("id").replace(LeadPropertyCheckPrefix, ""));
        });

        $.ajax({
            url: "/Prospect/LeadProperties/SaveSettingProperty",
            data: JSON.stringify({
                'AccountId': Plumb5AccountId, 'SettingList': SettingList, 'DeleteIdList': DeleteIdList
            }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    ShowSuccessMessage(GlobalErrorList.LeadProperties.SavedSuccessfully);
                    HidePageLoading();
                    PropertyUtil.GetPropertySetting();
                }
            },
            error: ShowAjaxError
        });
    }
}

$("#ui_iShowPropertyPopUp").click(function () {
    ShowPageLoading();
    PropertyUtil.ShowPropertyPopUp();
});


$("#ui_btnSaveProperty").click(function () {
    ShowPageLoading();
    PropertyUtil.SavePropertySetting();
});

$("#ui_btnClosePropertyPopUp, #ui_iClosePropertyPopUp").click(function () {
    PropertyUtil.ClosePropertyPopUp();
});

$('.sorted_table').sortable({
    handle: '.griddragicn',
    containerSelector: 'table',
    itemPath: '> tbody',
    itemSelector: 'tr',
    placeholder: '<tr class="placeholder"/>',
    onDrop: function ($item, container, _super) {
        ShowPageLoading();
        _super($item, container);

        var SettingPropertyId = [];
        var SettingDisplayOrder = [];
        var SettingList = [];

        $("#ui_tbodyReportData tr").each(function () {
            SettingPropertyId.push($(this).attr('value'));
            SettingDisplayOrder.push($(this).attr('displayorder'));
        });

        SettingDisplayOrder = SettingDisplayOrder.sort(function (a, b) {
            return parseInt(a) - parseInt(b);
        });

        for (var i = 0; i < SettingPropertyId.length; i++) {
            var ContactFieldEditSetting = { PropertyId: SettingPropertyId[i], DisplayOrder: SettingDisplayOrder[i] };
            SettingList.push(ContactFieldEditSetting);
        }

        $.ajax({
            url: "/Prospect/LeadProperties/UpdateDisplayOrder",
            data: JSON.stringify({
                'AccountId': Plumb5AccountId, 'SettingList': SettingList
            }),
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    ShowSuccessMessage(GlobalErrorList.LeadProperties.OrderUpdatedSuccessfully);
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });

    }
});


$(".bwsnotifsteptog").click(function () {

    if (headerflag == true)
        headerflag = false;
    else
        headerflag = true;
    $.ajax({
        url: "/Prospect/LeadProperties/SaveupdateLmsheaderflag",
        data: JSON.stringify({
            'AccountId': Plumb5AccountId, 'headerflag': headerflag
        }),
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        error: ShowAjaxError
    });
});

