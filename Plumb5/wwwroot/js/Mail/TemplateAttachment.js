
var AttachmentTemplateId = 0;
var AttachmentList = [];
var TotalAttachmentSize = 0;
var ValidAttachmentTypes = ["jpg", "gif", "png", "bmp", "html", "htm", "pdf", "xls", "xlsx", "doc", "docx", "ppt", "pptx", "txt"];
var AttachmentNameList = [];

$(document).ready(function () {
    ShowPageLoading();
    AttachmentTemplateId = $.urlParam("TemplateId");
    if (AttachmentTemplateId > 0) {
        AttachmentUtil.GetAttachment();
    }
});

var AttachmentUtil = {
    GetAttachment: function () {
        $("#ui_divAttachmentDetails").html('');
        $.ajax({
            url: "/Mail/TemplateAttachment/GetTemplateAttachment",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'MailTemplateId': AttachmentTemplateId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: AttachmentUtil.BindAttachment,
            error: ShowAjaxError
        });
    },
    BindAttachment: function (response) {
        if (response != undefined && response != null && response.length > 0) {
            for (var i = 0; i < response.length; i++) {
                let EachData = `<div class="attachItem" id="ui_divAttachment_${response[i].Id}">
                                <div class="attchfilename">${response[i].AttachmentFileName}</div>
                                <div class="deldownld d-flex">
                                <i class="icon ion-android-arrow-down" onclick="AttachmentUtil.DownLoadAttachment(${response[i].Id},'${response[i].AttachmentFileName}');"></i>
                                <i class="icon ion-android-delete mr-0" onclick="AttachmentUtil.ShowDeletePopUp(${response[i].Id},'${response[i].AttachmentFileName}');"></i>
                                </div>
                                </div>`;
                $("#ui_divAttachmentDetails").append(EachData);
                TotalAttachmentSize += response[i].FileSize;
                AttachmentList.push(response[i]);
                AttachmentNameList.push(response[i].AttachmentFileName.toLowerCase());
            }
        }
        HidePageLoading();
    },
    DownLoadAttachment: function (AttachmentId, AttachmentName) {
        ShowPageLoading();
        $.ajax({
            url: "/Mail/TemplateAttachment/DownLoadAttachment",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'MailTemplateId': AttachmentTemplateId, 'AttachmentName': AttachmentName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.Status) {
                    window.location.assign(response.MainPath);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    ShowDeletePopUp: function (AttachmentId, AttachmentName) {
        $("#ui_btnConfirmDeleteAttach").attr("AttachmentId", AttachmentId);
        $("#ui_btnConfirmDeleteAttach").attr("AttachmentName", AttachmentName);
        $("#ui_divAttachmentDeletePopUp").addClass("show");
    },
    HideDeletePopUp: function () {
        $("#ui_btnConfirmDeleteAttach").removeAttr("AttachmentId");
        $("#ui_btnConfirmDeleteAttach").removeAttr("AttachmentName");
        $("#ui_divAttachmentDeletePopUp").removeClass("show");
    },
    DeleteAttachment: function (AttachmentId, AttachmentName) {
        ShowPageLoading();
        $.ajax({
            url: "/Mail/TemplateAttachment/DeleteTemplate",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'MailTemplateId': AttachmentTemplateId, 'AttachmentId': AttachmentId, 'AttachmentName': AttachmentName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    var fileIndex = AttachmentNameList.indexOf(AttachmentName.toLowerCase());
                    if (fileIndex > -1) {
                        TotalAttachmentSize = TotalAttachmentSize - AttachmentList[fileIndex].FileSize;
                        AttachmentList.splice(fileIndex, 1);
                        AttachmentNameList.splice(fileIndex, 1);
                        $("#ui_divAttachment_" + AttachmentId).remove();
                        ShowSuccessMessage(GlobalErrorList.MailTemplate.DeleteAttachment);
                        AttachmentUtil.HideDeletePopUp();
                    }
                }
                ShowErrorMessage(GlobalErrorList.MailTemplate.ErrorInDeleteAttachment);
                HidePageLoading();
            },
            error: ShowAjaxError
        });

    },
    ValidateUploads: function (uploadedFiles) {
        var TotalUploadSize = 0;
        for (var i = 0; i < uploadedFiles.files.length; i++) {
            var fileName = uploadedFiles.files[i].name.toLowerCase();
            var fileExtension = GetFileExtension(uploadedFiles.files[i].name)[0];

            if (ValidAttachmentTypes.indexOf(fileExtension.toLowerCase()) < 0) {
                ShowErrorMessage(GlobalErrorList.MailTemplate.InvalidAttachmentFile);
                $("#ui_fileUploadAttachment").val("");
                return false;
            }

            if (AttachmentNameList.indexOf(fileName) > -1) {
                ShowErrorMessage(fileName + GlobalErrorList.MailTemplate.DuplicateAttachmentName);
                $("#ui_fileUploadAttachment").val("");
                return false;
            }

            TotalUploadSize += uploadedFiles.files[i].size;
        }

        if ((((TotalAttachmentSize + TotalUploadSize) / 1024) / 1024) > 15) {
            ShowErrorMessage(GlobalErrorList.MailTemplate.MoreAttachmentSize);
            $("#ui_fileUploadAttachment").val("");
            return false;
        }

        return true;
    },
    SaveAttachments: function (uploadedFiles) {
        var fromdata = typeof window.FormData == "undefined" ? [] : new window.FormData();
        for (var i = 0; i < uploadedFiles.files.length; i++) {
            if (typeof window.FormData == "undefined") {
                fromdata.push(uploadedFiles.files[i].name, uploadedFiles.files[i]);
            } else {
                fromdata.append(uploadedFiles.files[i].name, uploadedFiles.files[i]);
            }
        }

        $.ajax({
            url: "/Mail/TemplateAttachment/SaveAttachment?accountId=" + Plumb5AccountId + "&MailTemplateId=" + AttachmentTemplateId,
            type: 'POST',
            data: fromdata,
            contentType: false,
            processData: false,
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response.Status != null && response.Status && response.AttachmentList != null && response.AttachmentList.length > 0) {
                    AttachmentUtil.BindAttachment(response.AttachmentList);
                    ShowSuccessMessage(GlobalErrorList.MailTemplate.AttachmentSaved);
                } else {
                    ShowErrorMessage(response.Message);
                }
                $("#ui_fileUploadAttachment").val("");
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    }
}

$("#ui_fileUploadAttachment").change(function () {
    ShowPageLoading();

    var uploadedFiles = $(this).get(0);

    if (!AttachmentUtil.ValidateUploads(uploadedFiles)) {
        HidePageLoading();
        return true;
    }

    AttachmentUtil.SaveAttachments(uploadedFiles);
});

$("#ui_btnIconCloseDeleteAttach").click(function () {
    AttachmentUtil.HideDeletePopUp();
});

$("#ui_btnCloseDeleteAttach").click(function () {
    AttachmentUtil.HideDeletePopUp();
});

$("#ui_btnConfirmDeleteAttach").click(function () {
    ShowPageLoading();
    var AttachmentId = $("#ui_btnConfirmDeleteAttach").attr("AttachmentId");
    var AttachmentName = $("#ui_btnConfirmDeleteAttach").attr("AttachmentName");
    AttachmentUtil.DeleteAttachment(AttachmentId, AttachmentName);
});