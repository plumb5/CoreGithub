var FromEmailId = "";
var MLVerifyFromEmailId = { Id: 0, FromEmailId: "", ActiveStatus: false, ShowFromEmailIdBasedOnUserLogin: true };
var senderemailidlist;
$(document).ready(function () {
    GetEmailDetails();
});

function GetEmailDetails() {
    $.ajax({
        url: "/Mail/MailSettings/GetFromEmailIdToBind",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: BindReport,
        error: ShowAjaxError
    });
}
function BindReport(response) {
    senderemailidlist = response;

    SetNoRecordContent('ui_tblReportData', 4, 'ui_tbodyReportData');
    if (response != undefined && response != null && response.length > 0) {
        CurrentRowCount = response.length;
        // PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
        var reportTableTrs, IsEditable, statusclass;
        $.each(response, function () {
            IsEditable = this.ShowFromEmailIdBasedOnUserLogin == true ? "checked='checked'" : "";
            if (this.ActiveStatus == true) {
                FromEmailId = this.FromEmailId;//using for Validate ESP
                statuscontent = "<td class='text-center'><i class='icon ion-ios-checkmark-outline'></i></td>";
            }
            else
                statuscontent = "<td class='text-center'><i class='fa fa-ban' onclick='UpdateandSendMail(" + this.Id + ",\"" + this.FromEmailId + "\");' title='Verify'></i></td>";
            reportTableTrs +=
                "<tr>" +
                "<td>" + this.FromEmailId + "</td>" +
                "" + statuscontent + "" +
                "<td class='text-center'>" +
                "<div class='df-ac-jcenter'>" +
                "<div class='custom-control custom-checkbox'>" +
                "<input type='checkbox' id='ui_chkEditable" + this.Id + "' class='custom-control-input' " + IsEditable + " onclick='ChangeEditableStatus(" + this.Id + ");'  name='showall'>" +
                "<label class='custom-control-label' for='ui_chkEditable" + this.Id + "'></label>" +
                "</div>" +
                "</div>" +
                "</td>" +
                "<td class='text-center'><i class='icon ion-android-delete' data-toggle='modal'' data-target='#deletegroups' onclick='ConfirmedDelete(" + this.Id + ");'></i></td>" +
                "</tr>";
        });
        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);

    }
    HidePageLoading();
}

$("#ui_btnAddEmail").click(function () {
    ShowPageLoading();
    var UserDomainName, RegisteredDomainName, EmailId = "";

    if ($("#ui_txtEmail").val().length == 0) {
        ShowErrorMessage(GlobalErrorList.MailSettings.emial_error);
        $("#ui_txtEmail").focus();
        HidePageLoading();
        return false;
    }
    if (!regExpEmail.test($("#ui_txtEmail").val())) {
        $("#ui_txtEmail").focus();
        ShowErrorMessage(GlobalErrorList.MailSettings.validemail_error);
        HidePageLoading();
        return false;
    }
    if (senderemailidlist != null && senderemailidlist.length > 0) {
        var fromemail = JSLINQ(senderemailidlist).Where(function () {
            return (this.FromEmailId.toLowerCase() == $("#ui_txtEmail").val().toLowerCase());
        });
        if (fromemail != null && fromemail != undefined && fromemail.items[0] != null && fromemail.items[0] != "" && fromemail.items[0] != undefined) {
            ShowErrorMessage(GlobalErrorList.MailSettings.FromEmailId_ExistsError);
            HidePageLoading();
            $('#addemailsett').hide();
            $("#ui_txtEmail").val('');
            return false;
        }
    }

    //RegisteredDomainName = ActualUrlWithOutHttpWww(domainName);
    EmailId = CleanText($("#ui_txtEmail").val());

    //if (EmailId.indexOf("@") > -1)
    //    UserEmailIdDomainName = EmailId.substring(EmailId.indexOf("@") + 1, EmailId.length);

    //if (UserEmailIdDomainName != "plumb5.com") {
    //    if (UserEmailIdDomainName != RegisteredDomainName) {
    //        $("#ui_txtEmail").focus();
    //        ShowErrorMessage(GlobalErrorList.MailSettings.senderregistereddomain_error);
    //        HidePageLoading();
    //        return false;
    //    }
    //}

    MLVerifyFromEmailId.FromEmailId = CleanText($("#ui_txtEmail").val());
    MLVerifyFromEmailId.ShowFromEmailIdBasedOnUserLogin = true;

    $.ajax({
        url: "/Mail/MailSettings/Save",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'verifyfromEmailId': MLVerifyFromEmailId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != undefined && response != null && response.verifyfromEmailId != null && response.verifyfromEmailId.Id > 0) {
                if (response.SentStatus) {
                    ShowSuccessMessage(response.Message);
                } else {
                    ShowErrorMessage(response.Message);
                }
                GetEmailDetails();
            }
            else {
                ShowErrorMessage(response.Message);
                HidePageLoading();
            }
            $('#ui_txtEmail').val('');
        }
    });
});

function ChangeEditableStatus(Id) {
    ShowPageLoading();
    MLVerifyFromEmailId.Id = Id;
    MLVerifyFromEmailId.ShowFromEmailIdBasedOnUserLogin = $("#ui_chkEditable" + Id).is(":checked") ? true : false;
    $.ajax({
        url: "/Mail/MailSettings/ChangeEditableStatus",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'verifyfromEmailId': MLVerifyFromEmailId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.MailSettings.showallstatusupadte_message);
                GetEmailDetails();
            }
            else
                ShowErrorMessage(GlobalErrorList.MailSettings.showallstatus_error);
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}
function ConfirmedDelete(Id) {
    $("#deleteRowConfirm").attr("data-id", Id);
}

$("#deleteRowConfirm").click(function () {
    DeleteEmailId($("#deleteRowConfirm").attr("data-id"));
});
DeleteEmailId = function (Id) {
    ShowPageLoading();
    $.ajax({
        url: "/Mail/MailSettings/Delete",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Id': Id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                GetEmailDetails();
                ShowSuccessMessage(GlobalErrorList.MailSettings.fromemaildeleted_message);
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
};
function UpdateandSendMail(Id, EmailId) {
    ShowPageLoading();
    MLVerifyFromEmailId.Id = Id;
    MLVerifyFromEmailId.ShowFromEmailIdBasedOnUserLogin = true;
    MLVerifyFromEmailId.FromEmailId = EmailId;

    $.ajax({
        url: "/Mail/MailSettings/Save",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'verifyfromEmailId': MLVerifyFromEmailId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != undefined && response != null && response.verifyfromEmailId != null && response.verifyfromEmailId.Id > 0) {
                if (response.SentStatus) {
                    ShowSuccessMessage(GlobalErrorList.MailSettings.statusactivation_message);
                } else {
                    ShowErrorMessage(response.Message);
                }
            }
            else {
                ShowErrorMessage(response.Message);
            }
            HidePageLoading();
        }
    });
}