var MainControlerUrl, Areas;

$(document).ready(function () {

    var re = /[^/]*/g;
    Areas = window.location.href.match(re)[5];

    MainControlerUrl = window.location.href.match(re)[7];

    if (MainControlerUrl.indexOf("?") > -1) {
        MainControlerUrl = MainControlerUrl.substring(0, MainControlerUrl.indexOf("?"));
    }
});

function ExportDetails() {
    if ($('#dvExportFilter').is(":visible")) {
        $('#dvExportFilter').hide('slow');
    }
    else {
        $('#dvExportFilter').show('slow');
    }
    $("#ui_txtFromRange").val("");
    $("#ui_txToRange").val("");
    $("#drp_Export").val("1").change();
}

$('#drp_Export').change(function () {
    if ($("#drp_Export").val() == "3") {
        $("#ui_txtFromRange").show();
        $("#ui_txToRange").show();
    }
    else {
        $("#ui_txtFromRange").hide();
        $("#ui_txToRange").hide();
    }
});

$("#btnGo").click(function () {

    $("#dvLoading").show();

    if (rowIndex == 0) {
        ShowErrorMessage("There are no records to export");
        $("#dvLoading").hide();
        return;
    }

    var FileType = $('input[name=ExportFileType]:checked').val();

    if ($("#drp_Export").val() == "1") {
        OffSet = 0;
        FetchNext = rowIndex;
    }
    else if ($("#drp_Export").val() == "2") {
        OffSet = 0;
        if (maxRowCount && maxRowCount > 0)
            FetchNext = maxRowCount;
        else FetchNext = 0;
    }
    else if ($("#drp_Export").val() == "3") {
        if (!Validation()) {
            $("#dvLoading").hide();
            return;
        }

        OffSet = $("#ui_txtFromRange").val();
        FetchNext = $("#ui_txToRange").val();

        //if (OffSet == 1)
        OffSet = OffSet - 1;

        if (FetchNext > OffSet)
            FetchNext = FetchNext - OffSet;
    }

    $.ajax({
        url: "/" + Areas + "/" + MainControlerUrl + "/Export",
        type: 'POST',
        data: JSON.stringify({ 'OffSet': OffSet, 'FetchNext': FetchNext, 'FileType': FileType }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Status) {
                SaveToDisk(response.MainPath, MainControlerUrl + "." + FileType);
            }
            else {
                ShowErrorMessage("Session has Expired.Please Login To Continue!!");
                setTimeout(function () { window.location.href = "/Login"; }, 3000);
            }

            if ($('#dvExportFilter').is(":visible")) {
                $('#dvExportFilter').hide('slow');
            }
            else {
                $('#dvExportFilter').show('slow');
            }
        },
        error: ShowAjaxError
    });
    $("#dvLoading").hide();
});

function SaveToDisk(fileURL, fileName) { // for non-IE

    window.location.assign(fileURL);
    //if (!window.ActiveXObject) {
    //    var save = document.createElement('a');
    //    save.href = fileURL;
    //    save.target = '_blank';
    //    save.download = fileName || 'unknown';

    //    var event = document.createEvent('Event');
    //    event.initEvent('click', true, true);
    //    save.dispatchEvent(event);

    //    if (navigator.product == 'Gecko') {
    //        //(window.URL || window.webkitURL).createObjectURL(save.href)
    //        window.open(fileURL, '_blank');
    //    }
    //    else {
    //        (window.URL || window.webkitURL).revokeObjectURL(save.href);
    //    }
    //}
    //else if (!!window.ActiveXObject && document.execCommand) { // for IE
    //    var _window = window.open(fileURL, '_blank');
    //    _window.document.close();
    //    _window.document.execCommand('SaveAs', true, fileName || fileURL)
    //    _window.close();
    //}
}



function Validation() {
    if ($.trim($("#ui_txtFromRange").val()).length == 0 && $.trim($("#ui_txToRange").val()).length == 0) {
        ShowErrorMessage("Please enter min & max value as both the fields are empty.");
        return false;
    }
    if ($.trim($("#ui_txtFromRange").val()).length == 0) {
        ShowErrorMessage("Please enter minimum value");
        $("#ui_txtFromRange").focus();
        return false;
    }

    if ($.trim($("#ui_txToRange").val()).length == 0) {
        ShowErrorMessage("Please enter maximum value");
        $("#ui_txToRange").focus();
        return false;
    }

    var FirstValue = parseInt($("#ui_txtFromRange").val());
    var SecondValue = parseInt($("#ui_txToRange").val());

    //if (FirstValue == SecondValue) {
    //    ShowErrorMessage("The values cannot be same.Please enter min & max values correctly");
    //    return false;
    //}

    if (FirstValue > maxRowCount || SecondValue > maxRowCount) {
        ShowErrorMessage("Please enter minimum and maximum value within the records bound");
        return false;
    }

    if (FirstValue <= 0) {
        ShowErrorMessage("Please enter minimum value correctly");
        $("#ui_txtFromRange").focus();
        return false;
    }

    if (SecondValue <= 0) {
        ShowErrorMessage("Please enter maximum value correctly");
        $("#ui_txToRange").focus();
        return false;
    }

    if (FirstValue > SecondValue) {
        ShowErrorMessage("Please enter minimum value correctly");
        $("#ui_txtFromRange").focus();
        return false;
    }

    return true;
}