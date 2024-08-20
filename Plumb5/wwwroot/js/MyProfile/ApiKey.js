function ClearApiKeyFields() {
    $('#ui_txt_ApiKey').val('');
    $('#ui_div_AllAccounts').empty();
}

function GetApiKey() {
    ClearApiKeyFields();
    $.ajax({
        url: "/MyProfile/ApiKey/GetApiKey",
        type: 'Post',
        data: JSON.stringify({ 'UserId': Plumb5UserId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response != null && response != "0") {
                var api = response.Table1[0].ApiKey;
                $("#ui_txt_ApiKey").val(api);
                $('#ui_btn_ResetApiKey').text('Reset');
                $('#dvGenerate').addClass('hideDiv');
                $('#dvReset').removeClass('hideDiv');
            }
            else {
                $('#dvGenerate').removeClass('hideDiv');
                $('#dvReset').addClass('hideDiv');
                $('#ui_btn_ResetApiKey').text('Generate API Key');
            }
            GetAccountDetails();
        },
        error: ShowAjaxError
    });
}

function GetAccountDetails() {
    $.ajax({
        url: "/MyProfile/ApiKey/Developers",
        type: 'Post',
        data: JSON.stringify({ 'UserId': Plumb5UserId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindAccountDetails,
        error: ShowAjaxError
    });
}

function BindAccountDetails(response) {
    if (response !== undefined && response !== null && response.myAccount !== null) {
        var reportTableTrs = "";
        $.each(response.myAccount.accounts, function () {
            reportTableTrs += "<div class='accuntItemnamme'>" + this.AccountName + "<span class='p-1'>[<b>P5AccountId: " + this.AccountId + "</b>]</span></div>";
        });
        $("#ui_div_AllAccounts").append(reportTableTrs);
    }
    HidePageLoading();
}

$('#ui_btn_ResetApiKey').click(function () {
        $('#ResetApikey').modal();
}); 
$('#ui_btn_GenerateApiKey').click(function () {
        CreateOrUpdateApiKey('Create');
});
$("#ResetApikeyConfirm").click(function () {
    CreateOrUpdateApiKey('Reset');
});
function CreateOrUpdateApiKey(Status) {
    ShowPageLoading();
    $("#ui_txt_ApiKey").val('');
    $.ajax({
        url: "/MyProfile/ApiKey/UpdateApiKey",
        type: 'Post',
        data: JSON.stringify({ 'UserId': Plumb5UserId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response !== null && response !== undefined) {
                $("#ui_txt_ApiKey").val(response);
                $('#ui_btn_ResetApiKey').text('Reset');
                $('#dvGenerate').addClass('hideDiv');
                $('#dvReset').removeClass('hideDiv');
                if (Status=='Create')
                    ShowSuccessMessage(GlobalErrorList.ApiKey.Generate_Success);
                else
                    ShowSuccessMessage(GlobalErrorList.ApiKey.Reset_Success);
            }
            else
                ShowErrorMessage(GlobalErrorList.ApiKey.Reset_Error);
            HidePageLoading();
        },
        error: ShowAjaxError
    });
}