var Id = 0;

$(document).ready(function () {
    HidePageLoading();
    GetDetails();
});

$('#addGoogleAdAccountBtn').on('click', function () {

    // Show the popup
    $('.popupcontainer').removeClass('hideDiv');
    // Reset input fields
    $('#ui_ConfigurationID').val('');
    $('#ui_accountname').val('');

    // Reset Id variable
    Id = 0;

});
// Close popup when close button is clicked
$('#close-popup').on('click', function () {
    $('.popupcontainer').addClass('hideDiv');
});

// Close popup when cancel button is clicked
$('.clsepopup').on('click', function () {
    $('.popupcontainer').addClass('hideDiv');
});

$(document).on('click', '.editmailsett', function () {
    var rowData = $(this).closest('tr').find('td').map(function () {
        return $(this).text();
    }).get();
    Id = $(this).closest('tr').data('id');
    $('#ui_ConfigurationID').val(rowData[0]);
    $('#ui_accountname').val(rowData[1]);

    $('.popupcontainer').removeClass('hideDiv');

    $('#gadSpan').html("UPDATE GOOGLE ADS ACCOUNT");

});


function GetDetails() {
    $.ajax({
        url: "/GoogleAds/Settings/GetGooglAccountSettingsDetails",
        type: 'POST',
        data: JSON.stringify({ 'AdsId': Plumb5AccountId, 'Id': Id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindDetails(response);
        },
        error: ShowAjaxError

    });

}


function BindDetails(response) {
    SetNoRecordContent('ui_tableReport', 4, 'ui_tbodyReportData');
    if (response !== undefined && response !== null && response.length > 0) {
        var reportTableTrs = ""; // Initialize empty string to store table rows

        $.each(response, function () {
            var act = this.Status == true ? '<span id="span_' + this.Id + '" style="background-color: #05681b;" class="lmslabelhot">Active</span>' : '<span id="span_' + this.Id + '" class="lmslabelhot">Inactive</span>';


            reportTableTrs += "<tr data-id='" + this.Id + "'>" +
                "<td>" + this.GoogleAccountsId + "</td>" +
                "<td>" + this.GoogleAccountName + "</td>" +
                "<td>" + act + "</td>" +
                "<td class='text-center'>" +
                "<div class='addradiusdrop'>" +
                "<div class='dropdown'>" +
                "<button type='button' class='verticnwrp' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>" +
                "<i class='icon ion-android-more-vertical mr-0'></i>" +
                "</button>" +
                "<div class='dropdown-menu dropdown-menu-right' aria-labelledby='filterbycontacts'>" +
                "<a class='dropdown-item editmailsett' href='javascript:void(0)'>Edit</a>" +
                "<a class='dropdown-item' Onclick=installGoogleTagManager(" + this.Id + ",\'" + this.GoogleAccountsId + "\') href='javascript:void(0)'>Validate</a>" +
                "<div class='dropdown-divider'></div>" +
                "<a data-toggle='modal' id='delete' data-target='#deletegroups' class='dropdown-item'  href='javascript:void(0)'>Delete</a>" +
                "</div>" +
                "</div>" +
                "</td>" +
                "</tr>";
        });
        $("#ui_tableReport").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
    }


}



$('#ui_btnSaveDetails').on('click', function () {
    var customerId = $('#ui_ConfigurationID').val();
    var accountName = $('#ui_accountname').val();

    // Check if both fields are empty
    if (customerId === '' || accountName === '') {
        ShowErrorMessage(GlobalErrorList.GoogleAdsSettings.Validation);
        return;
    }

    if (customerId != '') {
        var cust = customerId.replaceAll(/-/g, "");
        if (!/^[0-9]+$/.test(cust)) {
            ShowErrorMessage(GlobalErrorList.GoogleAdsSettings.customerId);
            return;
        }
    }
    savedetails();
});



function savedetails() {
    var customerId = $('#ui_ConfigurationID').val();
    var accountName = $('#ui_accountname').val();



    var data = {
        AdsId: Plumb5AccountId,
        googlAccountsettings: {
            Id: Id,
            GoogleAccountsId: customerId,
            GoogleAccountName: accountName
        }
    };

    // Determine whether to perform insert or update
    if (Id) {

        var row = $('tr[data-id="' + Id + '"]');
        var currentRowCustomerId = row.find('td:eq(0)').text(); // Get the current row's customer ID

        // Check if customerId is being changed to an existing one, excluding the current row
        var existingCustomerId = $('#ui_tbodyReportData').find('td:first-child').not('tr[data-id="' + Id + '"]').filter(function () {
            return $(this).text() === customerId;
        });

        // Check if customerId being changed is the same as the one in the current row
        if (existingCustomerId.length > 0 && customerId !== currentRowCustomerId) {
            ShowErrorMessage(GlobalErrorList.GoogleAdsSettings.Duplicatevalidation);
            return;
        }

        if (customerId !== currentRowCustomerId) {
            data.googlAccountsettings.Status = false;
        }

        $.ajax({
            url: "/GoogleAds/Settings/UpdateDetails",
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                Id = 0;
                GetDetails();
                ShowSuccessMessage(GlobalErrorList.GoogleAdsSettings.Update_Message);
                $('.popupcontainer').addClass('hideDiv');
            },
            error: ShowAjaxError
        });
    } else {
        // Check if customerId already exists in the table
        var existingCustomerId = $('#ui_tbodyReportData').find('td:first-child').filter(function () {
            return $(this).text() === customerId;
        });
        if (existingCustomerId.length > 0) {
            ShowErrorMessage(GlobalErrorList.GoogleAdsSettings.Duplicatevalidation);
            return;
        }
        // Insert operation
        $.ajax({
            url: "/GoogleAds/Settings/InsertDetails",
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                Id = 0;
                GetDetails();
                ShowSuccessMessage(GlobalErrorList.GoogleAdsSettings.Success);
                $('.popupcontainer').addClass('hideDiv');
            },
            error: ShowAjaxError
        });
    }
}



$(document).on('click', '#delete', function () {
    var row = $(this).closest('tr');
    var Id = row.data('id');
    $('#ui_btnDeleteConfirm').data('id', Id);
    $('#ui_divDeleteDialog').modal('show');
});

$('#ui_btnDeleteConfirm').on('click', function () {
    var Id = $(this).data('id'); // Get the Id of the row to delete
    deleteRow(Id);
});

$('#cancelRowConfirm').on('click', function () {
    $('#ui_divDeleteDialog').modal('hide');
});

function deleteRow(Id) {
    $.ajax({
        url: "/GoogleAds/Settings/Delete",
        type: 'POST',
        data: { AdsId: Plumb5AccountId, Id: Id },
        success: function (response) {
            if (response) {
                // If deletion is successful, remove the row from the UI
                $('tr[data-id="' + Id + '"]').remove();
                ShowSuccessMessage(GlobalErrorList.GoogleAdsSettings.DeleteSuccess);
            }
        },
        error: ShowAjaxError
    });
}







