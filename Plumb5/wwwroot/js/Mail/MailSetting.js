var MLVerifyFromEmailId = { Id: 0, FromEmailId: "", ActiveStatus: false, ShowFromEmailIdBasedOnUserLogin: true };
$(document).ready(function () {
    CallBackFunction();
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    MaxCount();
}

function MaxCount() {
    $.ajax({
        url: "/Mail/MailSettings/MaxCount",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            TotalRowCount = response.returnVal;
            $('#TotalGroupCount').text(TotalRowCount);
            if (TotalRowCount > 0) {
                GetReport();
            }
            else {
                SetNoRecordContent('ui_tblReportData', 5, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetReport() {
    FetchNext = GetNumberOfRecordsPerPage();
    $.ajax({
        url: "/Mail/MailSettings/GetFromEmailIdToBind",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId,'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: BindReport,
        error: ShowAjaxError
    });
}

function BindReport(response) {
    SetNoRecordContent('ui_tblReportData', 4, 'ui_tbodyReportData');
    if (response != undefined && response != null && response.length > 0) {
        CurrentRowCount = response.length;
       // PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
        var reportTableTrs, IsEditable;
        $.each(response, function () {
            IsEditable = this.ShowFromEmailIdBasedOnUserLogin == 1 ? "checked='checked'" : "";
            reportTableTrs +=
                "<tr>" +
                "<td>" + this.FromEmailId + "</td>" +
                "<td class='text-center'><i class='icon ion-ios-checkmark-outline'></i></td>" +
                "<td class='text-center'>"+
                  "<div class='df-ac-jcenter'>"+
                    "<div class='custom-control custom-checkbox'>"+
                    "<input type='checkbox' id='ui_chkEditable" + this.Id + "' class='custom-control-input' " + IsEditable + " onclick='ChangeEditableStatus(" + this.Id + ");'  name='showall'>"+
            "<label class='custom-control-label' for='ui_chkEditable" + this.Id + "'></label>"+
                    "</div>"+
                   "</div>"+
                "</td>"+
                "<td class='text-center'><i class='icon ion-android-delete'></i></td>"+
                "</tr>";
        });
        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);

    } else {
        ShowPagingDiv(false);
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
        return;
    }
    if (!regExpEmail.test($("#ui_txtEmail").val())) {
        $("#ui_txtEmail").focus();
        ShowErrorMessage(GlobalErrorList.MailSettings.validemail_error);
        HidePageLoading();
        return false;
    }

    RegisteredDomainName = ActualUrlWithOutHttpWww(domainName);
    EmailId = CleanText($("#ui_txtEmail").val());

    if (EmailId.indexOf("@") > -1)
        UserEmailIdDomainName = EmailId.substring(EmailId.indexOf("@") + 1, EmailId.length);

    if (UserEmailIdDomainName != "plumb5.com") {
        if (UserEmailIdDomainName != RegisteredDomainName) {
            $("#ui_txtEmail").focus();
            ShowErrorMessage(GlobalErrorList.MailSettings.senderregistereddomain_error);
            HidePageLoading();
            return false;
        }
    }

    MLVerifyFromEmailId.FromEmailId = CleanText($("#ui_txtEmail").val());

    MLVerifyFromEmailId.ShowFromEmailIdBasedOnUserLogin = 1;

    $.ajax({
        url: "/Mail/MailSettings/Save",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId,'verifyfromEmailId': MLVerifyFromEmailId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            MaxCount();
        }
    });
});

function ChangeEditableStatus(Id) {
    ShowPageLoading();
    MLVerifyFromEmailId.Id = Id;
    MLVerifyFromEmailId.ShowFromEmailIdBasedOnUserLogin = $("#ui_chkEditable" + Id).is(":checked") ? 1 : 0;
    $.ajax({
        url: "/Mail/MailSettings/ChangeEditableStatus",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'verifyfromEmailId': MLVerifyFromEmailId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.MailSettings.showallstatusupadte_message);
                MaxCount();
            }  
            else 
                ShowErrorMessage(GlobalErrorList.MailSettings.showallstatus_error);
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}

DeleteVerifyEmailId = function (Id) {
    $.ajax({
        url: "/Mail/MailSettings/Delete",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId,'Id': Id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage("Deleted Successfully");
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
};

$(".setttabitem").click(function () {
    ShowPageLoading();
    var checktabcontname = $(this).attr("data-setttype");
    if (checktabcontname === 'spamscoresetts')
        GetSpamVerifySettingsDetails();
    else if (checktabcontname === 'emailverifisetts')
        GetEmailVerifySettingsDetails();
});