
$("#fileContact").change(function () {
    ShowPageLoading();
    var fileName = $(this).val();

    $("#csvSelect").html("Selected File: ");
    $(".appndfile").html(fileName.split('\\').pop());


    var uploadFile = $("#fileContact").get(0);
    var uploadedfile = uploadFile.files;
    var fromdata;
    if (typeof window.FormData == "undefined")
        fromdata = [];
    else
        fromdata = new window.FormData();
    for (var i = 0; i < uploadedfile.length; i++) {
        if (typeof window.FormData == "undefined")
            fromdata.push(uploadedfile[i].name, uploadedfile[i]);
        else
            fromdata.append(uploadedfile[i].name, uploadedfile[i]);
    }

    $.ajax({
        url: "/Sms/UploadTemplate/CheckDTLFileFormat",
        type: "POST",
        data: fromdata,
        contentType: false,
        processData: false,
        dataType: "json",
        success: function (response) {
            if (response.Status == true) {
                ShowSuccessMessage(response.Message);
            } else {
                $('#fileContact').val('');
                $(".appndfile").html('');
                ShowErrorMessage(response.Message);
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
});

function SaveFile() {
    var fileid = "fileContact";
    ShowPageLoading();

    if (DLTRequired == true) {
        if ($("#" + fileid).val() != "") {
            var uploadFile = $("#" + fileid).get(0);
            var uploadedfile = uploadFile.files;
            var fromdata;
            if (typeof window.FormData == "undefined")
                fromdata = [];
            else
                fromdata = new window.FormData();
            for (var i = 0; i < uploadedfile.length; i++) {

                if (typeof window.FormData == "undefined")
                    fromdata.push(uploadedfile[i].name, uploadedfile[i]);
                else
                    fromdata.append(uploadedfile[i].name, uploadedfile[i]);
            }


            var choice = {};
            choice.url = "/Sms/UploadTemplate/ImportFile",
                choice.type = "POST";
            choice.data = fromdata;
            choice.contentType = false;
            choice.processData = false;
            choice.async = false;
            choice.success = function (response) {
                if (response.Status == true) {
                    var data = TempId != 0 ? "?TemplateId=" + TempId + "&DltNewFile=true&TemplateName=" + response.TemplateName : "?DltNewFile=true&TemplateName=" + response.TemplateName;
                    window.location.href = '/Sms/UploadTemplate' + data;
                } else {
                    ShowErrorMessage(response.Message);
                }
                HidePageLoading();
            };
            choice.error = function (result) {
                ShowErrorMessage(GlobalErrorList.SmsTemplate.UploadError);
                HidePageLoading();
            };
            $.ajax(choice);

        } else if ($("#" + fileid).val() == "" && TempId != 0) {
            $.ajax({
                url: "/Sms/UploadTemplate/ImportFileForEdit",
                type: 'POST',
                data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'SmsTemplateId': TempId }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response.Status == true) {
                        var data = TempId != 0 ? "?TemplateId=" + TempId + "&DltNewFile=true&TemplateName=" + response.TemplateName : "?DltNewFile=true&TemplateName=" + response.TemplateName;
                        window.location.href = '/Sms/UploadTemplate' + data;
                    }
                },
                error: ShowAjaxError
            });
        } else {
            ShowErrorMessage(GlobalErrorList.SmsTemplate.UploadError);
            HidePageLoading();
        }
    } else {
        if (TempId != 0 && $(".appndfile").html().length > 0) {
            var data = TempId != 0 ? "?TemplateId=" + TempId : "";
            window.location.href = '/Sms/UploadTemplate' + data;

        } else {
            ShowErrorMessage(GlobalErrorList.SmsTemplate.DltCsvFile);
            HidePageLoading();
        }
    }
}