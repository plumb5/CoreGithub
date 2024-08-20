
$(document).ready(function () {
    $("#dvLoading").hide();
    BindGroupsList();
});

BindGroupsList = function () {
    $.ajax({
        url: "/SMS/Groups/GetGroupList",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            $.each(response, function () {
                optlist = document.createElement('option');
                optlist.value = $(this)[0].Id;
                optlist.text = $(this)[0].Name;
                document.getElementById("ddlGroup").options.add(optlist);
            });
        },
        error: ShowAjaxError
    });
};

$("#ui_btnImport").click(function () {

    if (!ValidateImport()) {
        return;
    }
    $("#dvLoading").show();
    var groupId = $("#ddlGroup").val();

    var uploadfiles = $("#txtImport").get(0);
    var uploadedfiles = uploadfiles.files;
    var fromdata = typeof window.FormData == "undefined" ? [] : new window.FormData();
    for (var i = 0; i < uploadedfiles.length; i++)
        if (typeof window.FormData == "undefined") fromdata.push(uploadedfiles[i].name, uploadedfiles[i]);
        else fromdata.append(uploadedfiles[i].name, uploadedfiles[i]);

    $.ajax({
        url: "/Custom/LmsEditProfile/ImportContacts?GroupId=" + groupId + "",
        type: 'POST',
        data: fromdata,
        contentType: false,
        processData: false,
        dataType: "json",
        success: ResponseDetails,
        error: ShowAjaxError
    });
});


function ResponseDetails(response) {
    if (response.Status) {
        ShowErrorMessage("Total Contacts - " + response.contactImportStatus.TotalContactToImport + ".Contacts Imported - " + response.contactImportStatus.NumberOfContactsImported + ".Contacts Not Imported - " + response.contactImportStatus.NumberOfContactsNotImported + ".Invalid Contacts - " + response.contactImportStatus.InvalidContacts + ".Erroneous records that are not imported are listed in the auto downloaded file.");

        if (response.contactImportStatus.ExistingContactsFileName != null && response.contactImportStatus.ExistingContactsFileName.length > 0)
            setTimeout(function () { SaveToDisk(response.contactImportStatus.ExistingContactsFileName, "AlreadyExistingContacts"); }, 2000);
        if (response.contactImportStatus.InvalidContactsFileName != null && response.contactImportStatus.InvalidContactsFileName.length > 0)
            setTimeout(function () { SaveToDisk(response.contactImportStatus.InvalidContactsFileName, "InvalidContacts"); }, 2000);
    }
    else if (!response.Status) {
        ShowErrorMessage("Problem in importing the contacts.");
    }
    $("#dvLoading").hide();
}


function ValidateImport() {

    if ($("#ddlGroup").get(0).selectedIndex == 0) {
        ShowErrorMessage("Please select group to import contacts");
        return false;
    }

    var uploadfiles = $("#txtImport").get(0);
    var uploadedfiles = uploadfiles.files;

    if (uploadfiles.files.length > 0) {

        var fileExtension = GetFileExtension(uploadedfiles[0].name)[0].toLowerCase();
        var checkFor = ["xls", "xlsx", "csv"], isVaildFile = false;
        for (var i = 0; i < checkFor.length; i++) {
            if (fileExtension.toLowerCase() == checkFor[i]) {
                isVaildFile = true;
                break;
            }
        }
        if (!isVaildFile) {
            ShowErrorMessage("Invalid files selected");
            return false;
        }
    }
    else {
        ShowErrorMessage("Please select the file to import the contact");
        return false;
    }
    return true;
}

function GetFileExtension(fileName) {
    return (/[.]/.exec(fileName)) ? /[^.]+$/.exec(fileName) : undefined;
};

function SaveToDisk(fileURL, fileName) {
    window.location.assign(fileURL);
}




