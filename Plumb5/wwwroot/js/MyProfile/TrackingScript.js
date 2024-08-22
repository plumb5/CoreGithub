$(document).ready(function () {
    GetAccountInfo();
});

$(".sendemailbtn").click(function () {
    $("#ui_ScriptPopUp,#ui_GoogleTagPopup").addClass("hideDiv");
    $("#ui_ScriptPopUp").removeClass("hideDiv");
    $('#ui_txt_mailRecipients').val('');
});

$("#close-popup, .clsepopup").click(function () {
    $(this).parents(".popupcontainer").addClass("hideDiv");
});

function GetAccountInfo() {
    $.ajax({
        url: "/MyProfile/TrackingScript/GetAccountInfo",
        type: 'Post',
        data: JSON.stringify({ 'UserId': Plumb5UserId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response !== undefined && response !== null && response.myAccount.accounts.length > 0) {
                var reportTableTrs = "", selectedAccountName= "";
                $.each(response.myAccount.accounts, function () {
                    reportTableTrs += "<option account='" + this.AccountName + "' value='" + this.Script + "'>" + this.DomainName + "</option>";
                    if (this.AccountId == Plumb5AccountId)
                        selectedAccountName = this.Script;
                });
                $('#ui_drpdwn_DomainName').append(reportTableTrs);
                $('#ui_drpdwn_DomainName').val(selectedAccountName);
            }
            BindScript();
        },
        error: ShowAjaxError
    });
}

function BindScript() {
    var script = CleanText($('#ui_drpdwn_DomainName').val());
    var accountName = $('#ui_drpdwn_DomainName option:selected').attr('account');
    $('#ui_span_ScriptDetails').html(script);
    $('#ui_span_mailScriptDetails').html(script);
    $('#ui_span_mailAccountName').html("<strong>" + accountName + "</strong>");
    HidePageLoading();
}

$('#ui_drpdwn_DomainName').change(function () {
    ShowPageLoading();
    BindScript();
});

$('#ui_btn_CopyScript').click(function () {
    var range = document.createRange();
    range.selectNode(document.getElementById('ui_code_AccountScriptDetails'));
    window.getSelection().addRange(range);
    document.execCommand("copy");
});

$('#ui_btn_SendMail').click(function () {
    if (CleanText($('#ui_txt_mailRecipients').val()).length === 0) {
        ShowErrorMessage(GlobalErrorList.TrackingScript.SendMail_RecipientsMailId_Error);
        $('#ui_txt_mailRecipients').focus();
        return false;
    }
    if (!regExpEmail.test(CleanText($("#ui_txt_mailRecipients").val()))) {
        ShowErrorMessage(GlobalErrorList.TrackingScript.SendMail_Recipients_Error);
        $("#ui_txt_mailRecipients").focus();
        return false;
    }

    ShowPageLoading();
    var emailId = CleanText($('#ui_txt_mailRecipients').val());
    var subject = CleanText($('#ui_txt_mailSubject').val());
    var MailBody = $('.mailbodywrp').html();
    $.ajax({
        url: "/MyProfile/TrackingScript/SendTrackingScript",
        type: 'Post',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'emailId': emailId, 'subject': subject, 'MailBody': MailBody }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response)
                ShowSuccessMessage(GlobalErrorList.TrackingScript.SendMail_Success);
            else
                ShowErrorMessage(GlobalErrorList.TrackingScript.SendMail_Error);
            $("#close-popup").click();
            HidePageLoading();
        },
        error: ShowAjaxError
    });
});

