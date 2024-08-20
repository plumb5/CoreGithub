
var fieldsNameList = new Array(), columnNames = new Array(), columnFieldType = new Array(), userList = new Array(), userIdList = new Array();
var allStageDetails = [];
var answerList = [];
var LmsFieldList;
var PhoneNumber, EmailId;
var lmsLeadsId = 0, oldStage = 0;

var CustomFields = [
    { "Name": "Company", "Id": "dv_Company" },
    { "Name": "Designation", "Id": "dv_Designation" },
    { "Name": "URL", "Id": "dv_URL" },
    { "Name": "Location", "Id": "dv_Location" },
    { "Name": "Preferences", "Id": "dv_Preferences" },
    { "Name": "Set Delivery Model", "Id": "dv_SetDeliveryModel" }
];

var lead = {
    Id: 0, UserInfoUserId: 0, LastModifyByUserId: 0, UserGroupId: 0, ContactId: 0, LmsGroupId: 0, Field1: "", Field2: "", Field3: "",
    Field4: "", Field5: "", Field6: "", Field7: "", Field8: "", Field9: "", Field10: "", Field11: "", Field12: "", Field13: "", Field14: "", Field15: "",
    Field16: "", Field17: "", Field18: "", Field19: "", Field20: "", Field21: "", Field22: "", Field23: "", Field24: "", Field25: "", Field26: "",
    Field27: "", Field28: "", Field29: "", Field30: "", Field31: "", Field32: "", Field33: "", Field34: "", Field35: "", Field36: "", Field37: "", Field38: "",
    Field39: "", Field40: "", Field41: "", Field42: "", Field43: "", Field44: "", Field45: "", Field46: "", Field47: "", Field48: "", Field49: "", Field50: "",
    Field51: "", Field52: "", Field53: "", Field54: "", Field55: "", Field56: "", Field57: "", Field58: "", Field59: "", Field60: "", Remarks: "", ReminderDate: "",
    ToReminderPhoneNumber: "", ToReminderEmailId: "", Score: 0, SearchKeyword: "", PageUrl: "", ReferrerUrl: "", IsAdSenseOrAdWord: "", AccountId: "",
};

$(document).ready(function () {
    lmsLeadsId = $.urlParam("LmsLeadId");
    GetUserLoginDetails();
    if (lmsLeadsId == 0)
        lead.LmsGroupId = 2;

    BindStageDetails();
});

function GetUserLoginDetails() {
    $.ajax({
        url: "../../Form/CommonDetailsForForms/GetUserLoginFullDetails",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                PhoneNumber = response.MobilePhone;
                EmailId = response.EmailId;
            }
        },
        error: ShowAjaxError
    });
}

BindStageDetails = function () {
    $.ajax({
        url: "/Prospect/Leads/GetStageScore",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindStage,
        error: function (error) {
            $("#dvLoading").hide();
            window.console.log(error);
        }
    });
};

BindStage = function (response) {
    if (response.AllStages != null && response.AllStages.length > 0) {
        allStageDetails = response.AllStages;
    }

    if (response.StagesList != null && response.StagesList.length > 0) {
        $.each(response.StagesList, function (i) {
            $("#ui_dllStage").append("<option style='background-color:" + $(this)[0].IdentificationColor + "' value='" + $(this)[0].Score + "'>" + $(this)[0].Stage + "</option>")
        });
    }
    BindUsers();
};

BindUsers = function () {

    $.ajax({
        url: "/Prospect/Leads/GetHirarchyUser",
        type: 'POST',
        ascyn: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (users) {
            $.each(users, function (i) {
                userList.push($(this)[0].EmailId);
                userIdList.push($(this)[0].UserInfoUserId);
            });
            if (userList.length > 0) {
                $("#txtSalesPerson").autocomplete({
                    source: userList
                });
            }
            GetLmsFields();
        },
        error: function (error) {
            $("#dvLoading").hide();
            window.console.log(error);
        }
    });
};

function GetLmsFields() {

    $.ajax({
        url: "/Prospect/Fields/GetFieldDetails",
        type: 'POST',
        ascyn: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (fieldsList) {
            if (fieldsList.length > 0) {
                LmsFieldList = fieldsList;
            }
            if (lmsLeadsId > 0) {
                GetLeadData(lmsLeadsId);
            }
            else {
                $("#txtReminderTo").val(EmailId);

                var reminderCustomDate = new Date();
                reminderCustomDate = reminderCustomDate.getFullYear() + "-" + (reminderCustomDate.getMonth() + 1) + "-" + reminderCustomDate.getDate();
                $("#txtReminderDate").val(reminderCustomDate);
                $("#dvLoading").hide();
            }
        },
        error: ShowAjaxError
    });
}

ReminderType = function (action) {

    if (action == 0) {
        if (lmsLeadsId > 0) {
            if (ReminderPhoneNumber != null && ReminderPhoneNumber.length > 0)
                $("#txtReminderTo").val(ReminderPhoneNumber);
            else
                $("#txtReminderTo").val(PhoneNumber);
        }
        else {
            $("#txtReminderTo").addClass("numbervalues");
            $("#lblReminderType").html("Contact number").css("padding-right", "20px");
            $("#txtReminderTo").attr("placeholder", "Enter contact number");
            $("#txtReminderTo").val(PhoneNumber);
        }
    }
    else if (action == 1) {
        if (lmsLeadsId > 0) {
            if (ReminderEmailId != null && ReminderEmailId.length > 0)
                $("#txtReminderTo").val(ReminderEmailId);
            else
                $("#txtReminderTo").val(EmailId);
        }
        else {
            $("#txtReminderTo").removeClass("numbervalues");
            $("#lblReminderType").html("Email id").css("padding-right", "66px");
            $("#txtReminderTo").attr("placeholder", "Enter mail Id");
            $("#txtReminderTo").val(EmailId);
        }
    }
};

function calendersReminder() {
    document.getElementById("txtReminderDate").focus();
}

GetLeadData = function (LmsLeadId) {
    $("#btnSave").val("Update");
    $.ajax({
        url: "/Prospect/Leads/GetLeadsData",
        type: 'POST',
        data: JSON.stringify({ 'LmsLeadId': LmsLeadId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (leadDetails) {

            lead = leadDetails;

            $("#ui_txtContactName").val(lead.Name);
            $("#ui_txtContactEmailId").val(lead.EmailId);
            $("#ui_txtPhoneNumber").val(lead.PhoneNumber);

            for (var i = 0; i < CustomFields.length; i++) {

                var FieldValue = JSLINQ(LmsFieldList).Where(function () {
                    return (this.FieldName == CustomFields[i].Name);
                });

                var dicValues = JSLINQ(CustomFields).Where(function () {
                    return (this.Name == CustomFields[i].Name);
                });

                var index = LmsFieldList.findIndex(x => x.FieldName == CustomFields[i].Name);

                if (lead["Field" + (index + 1)] != null && lead["Field" + (index + 1)].length > 0) {

                    if (FieldValue.items[0].FieldType == 1 || FieldValue.items[0].FieldType == 2 || FieldValue.items[0].FieldType == 6) {
                        $("#" + dicValues.items[0].Id).val(lead["Field" + (index + 1)]);
                    }
                    else if (FieldValue.items[0].FieldType == 3) {
                        $("#" + dicValues.items[0].Id).val(lead["Field" + (index + 1)]);
                    }
                    else if (FieldValue.items[0].FieldType == 4) {
                        $("input:radio[name='" + dicValues.items[0].Id + "'][value='" + lead["Field" + (i + 1)] + "']").prop("checked", true);
                    }
                    else if (FieldValue.items[0].FieldType == 5) {
                        var checkedData = lead["Field" + (i + 1)].split("|");
                        for (var a = 0; a < checkedData.length; a++)
                            $("input:checkbox[name='" + dicValues.items[0].Id + "'][value='" + $.trim(checkedData[a]) + "']").prop("checked", true);
                    }
                }
            }

            if ($('select[id="ui_dllStage"]').find('option[value=' + lead.Score + ']').length <= 0) {
                var sample = JSLINQ(allStageDetails).Where(function () {
                    return (this.Score == lead.Score);
                });

                $("#ui_dllStage").append("<option style='background-color:" + sample.items[0].IdentificationColor + "' value='" + sample.items[0].Score + "'>" + sample.items[0].Stage + "</option>")
            }

            $("#ui_dllStage").val(lead.Score);
            oldStage = lead.Score;

            if (lead.ReminderDate != null) {
                var remDate = GetJavaScriptDateObj(lead.ReminderDate);
                var customDate = remDate.getFullYear() + "-" + (remDate.getMonth() + 1) + "-" + remDate.getDate().toString();
                $("#txtReminderDate").val(customDate);
                $("#ui_dllRemTime").val(remDate.getHours());
            }
            if (lead.ToReminderEmailId != null && lead.ToReminderEmailId.length > 0) {
                $("#radMail").attr("checked", true);
                $("#lblReminderType").html("Email id").css("padding-right", "66px");
                ReminderEmailId = lead.ToReminderEmailId;
                $("#txtReminderTo").val(lead.ToReminderEmailId);
            }
            else if (lead.ToReminderPhoneNumber != null && lead.ToReminderPhoneNumber.length > 0) {
                $("#radSms").attr("checked", true);
                $("#lblReminderType").html("Contact number").css("padding-right", "20px");
                ReminderPhoneNumber = lead.ToReminderPhoneNumber;
                $("#txtReminderTo").val(lead.ToReminderPhoneNumber);
            }
            else {
                $("#radMail").attr("checked", true);
                $("#lblReminderType").html("Email id").css("padding-right", "66px");
                $("#txtReminderTo").val(EmailId);
            }

            if (lead.Remarks != null)
                $("#txtRemarks").val(lead.Remarks);
            if (userIdList.length > 0) {
                var index = userIdList.indexOf(lead.UserInfoUserId);
                if (index > -1) {
                    $("#txtSalesPerson").val(userList[index]);
                }
            }
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
};

$("#btnSave").click(function () {
    $("#dvLoading").show();

    if (!ValidateLead()) {
        $("#dvLoading").hide();
        return;
    }

    var Name = CleanText($("#ui_txtContactName").val());
    var EmailId = CleanText($("#ui_txtContactEmailId").val());
    var PhoneNumber = CleanText($("#ui_txtPhoneNumber").val());

    lead.Id = lmsLeadsId;

    lead.Score = $("#ui_dllStage").get(0).selectedIndex > 0 ? $("#ui_dllStage").val() : oldStage;

    if ($("#txtReminderTo").val() != null && $("#txtReminderTo").val().length > 0) {
        lead.ReminderDate = $("#txtReminderDate").val() + " " + $("#ui_dllRemTime").val() + ":00:00";
        if ($("#radSms").is(":checked")) {
            lead.ToReminderEmailId = "";
            lead.ToReminderPhoneNumber = CleanText($("#txtReminderTo").val());
        }
        else if ($("#radMail").is(":checked")) {
            lead.ToReminderPhoneNumber = "";
            lead.ToReminderEmailId = CleanText($("#txtReminderTo").val());
        }
    }

    for (var i = 0; i < CustomFields.length; i++) {

        var FieldValue = JSLINQ(LmsFieldList).Where(function () {
            return (this.FieldName == CustomFields[i].Name);
        });

        var dicValues = JSLINQ(CustomFields).Where(function () {
            return (this.Name == CustomFields[i].Name);
        });

        var index = LmsFieldList.findIndex(x => x.FieldName == CustomFields[i].Name);

        if (FieldValue.items[0].FieldType == 1 || FieldValue.items[0].FieldType == 2 || FieldValue.items[0].FieldType == 6) {
            lead["Field" + (index + 1)] = $("#" + dicValues.items[0].Id).val();
        }
        else if (FieldValue.items[0].FieldType == 3) {
            if ($("#" + dicValues.items[0].Id).get(0).selectedIndex > 0) {
                lead["Field" + (index + 1)] = $("#" + dicValues.items[0].Id).val();
            }
        }
        else if (FieldValue.items[0].FieldType == 4) {
            if ($("input:radio[name='" + dicValues.items[0].Id + "']:checked").val()) {
                lead["Field" + (index + 1)] = $("input:radio[name='" + dicValues.items[0].Id + "']:checked").val();
            }
        }
        else if (FieldValue.items[0].FieldType == 5) {
            if ($("input:checkbox[name='" + dicValues.items[0].Id + "']:checked").val()) {
                var allCheckedValues = "";
                $("input:checkbox[name='" + dicValues.items[0].Id + "']:checked").map(function (i) {
                    if (i == 0)
                        allCheckedValues = $(this).val();
                    else
                        allCheckedValues += " | " + $(this).val();
                });
                lead["Field" + (index + 1)] = allCheckedValues;
            }
        }
        answerList.push(lead["Field" + (index + 1)]);
    }
    var UserInfoUserId = 0;
    if (regExpEmail.test($("#txtSalesPerson").val())) {
        var index = userList.indexOf($("#txtSalesPerson").val());
        if (index > -1)
            UserInfoUserId = lead.UserInfoUserId = userIdList[index];
    }

    $.ajax({
        url: "/Prospect/Leads/AddOrUpdateLead",
        type: 'POST',
        data: JSON.stringify({ 'lead': lead, 'Name': Name, 'EmailId': EmailId, 'PhoneNumber': PhoneNumber, 'UserInfoUserId': UserInfoUserId, 'AlternateEmailId': "", 'AlternatePhoneNumber': "", 'answerList': answerList }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status) {
                if (lmsLeadsId > 0 || response.UpdatedStatus) {
                    ShowErrorMessage("Lead updated successfully");
                }
                else {
                    ShowErrorMessage("Lead added successfully");
                    $("#btnClear").click();
                }
            }
            else if (response.Id == -1) {
                ShowErrorMessage("Contact already exists.");

                if (!response.IsSuperAdmin)
                    $("#ui_btnSendMail").show();
            }
            else if (response.Id == -2) {
                ShowErrorMessage("Invalid contact details");
            }
            else if (response.d == -10) {
                SessionExpire();
            }
            else if (!response.Status && response.Id < 0) {
                ShowErrorMessage("This lead is already Existing in the system and assigned to somebody else. Please contact your Admin for details");
            }
            else {
                ShowErrorMessage("With this email id already lead exists and updated too. New Updation is not possible until old data is accepted by current user");
            }

            setTimeout(function () { $("#btnClear").click(); }, 3000);
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
});

$("#btnClear").click(function () {
    $("input[type='text']").val("");
    $("textarea").val("");
    $("select").get(0).selectedIndex = 0;
    $("input:checkbox").prop('checked', false);
    $("input:radio").prop('checked', false);
    $("#txtSalesPerson").prop("disabled", false);
});

ValidateLead = function () {

    if ($("#ui_txtContactName").val().length == 0) {
        ShowErrorMessage("Please enter Name");
        $("#ui_txtContactName").focus();
        return false;
    }

    if ($("#ui_txtContactEmailId").val().length == 0 && $("#ui_txtPhoneNumber").val().length == 0) {
        ShowErrorMessage("Either Email Address or Phone Number is mandatory field.");
        return false;
    }

    if ($("#ui_txtContactEmailId").val().length > 0 && !regExpEmail.test($("#ui_txtContactEmailId").val())) {
        ShowErrorMessage("Please enter valid email Id");
        $("#ui_txtContactEmailId").focus();
        return false;
    }

    if ($("#ui_txtPhoneNumber").val().length > 0 && !ValidateMobilNo($("#ui_txtPhoneNumber").val())) {
        ShowErrorMessage("Please enter valid phone number");
        $("#ui_txtPhoneNumber").focus();
        return false;
    }

    if ($("#txtReminderDate").val() != null && $("#txtReminderDate").val().length > 0) {
        var selectedDate = $("#txtReminderDate").val().split("-");
        var FinalDate = new Date(selectedDate[0], parseInt(selectedDate[1]) - 1, selectedDate[2], $("#ui_dllRemTime").val());

        if (FinalDate <= new Date()) {
            ShowErrorMessage("Please set the reminder date and time greater than the present hour.");
            return false;
        }
    }

    if ($("#txtReminderTo").val() != null && $("#txtReminderTo").val().length > 0) {
        if ($("#radMail").is(":checked") && $("#txtReminderTo").val().length > 0 && !regExpEmail.test($("#txtReminderTo").val())) {
            ShowErrorMessage("Please enter valid Reminder email Id");
            $("#txtReminderTo").focus();
            return false;
        }

        if ($("#radSms").is(":checked") && $("#txtReminderTo").val().length > 0 && !ValidateMobilNo($("#txtReminderTo").val())) {
            ShowErrorMessage("Please enter the valid Reminder phone number");
            $("#txtReminderTo").focus();
            return false;
        }
    }

    return true;
};




