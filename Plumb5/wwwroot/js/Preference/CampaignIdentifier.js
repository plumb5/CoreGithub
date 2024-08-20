$(document).ready(function () {
    BindAccounts();
});

function BindAccounts() {
    $.ajax({
        url: "/Preference/IpRestrictions/GetAccounts",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $.each(response, function () {
                $('#ddlAccount').append('<option value=' + $(this)[0].AccountId + '>' + $(this)[0].AccountName + '</option>');
            });

            //calling common partial js function
            AccountId = $("#ddlAccount").val();
            initLoad(AccountId);
        },
        error: ShowAjaxError
    });
};

$("#ddlAccount").change(function () {
    //calling common partial js function
    AccountId = $(this).val();
    initLoad(AccountId);
});

function initLoad(accountId) {
    ShowPageLoading();
    AccountId = accountId;
    MaxCount();
}