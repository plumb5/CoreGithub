var CampaignName = null;
var CampaignTempalte = [];

$(document).ready(function () {
    GetUTCDateTimeRange(2);
    ExportFunctionName = "ExportInappManageCampaign";
});


function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    manageCampaignUtil.MaxCount();
}

function CallBackPaging() {
    CurrentRowCount = 0;
    manageCampaignUtil.GetReport();
}

var manageCampaignUtil = {
    MaxCount: function () {

        $.ajax({
            url: "/MobileInApp/ManageCampaign/GetMaxCount",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'Name': CampaignName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                TotalRowCount = 0;
                if (response != undefined && response != null && response.returnVal > 0) {
                    TotalRowCount = response.returnVal;
                }

                if (TotalRowCount > 0) {
                    manageCampaignUtil.GetReport();
                }
                else {
                    SetNoRecordContent('ui_tblReportData', 4, 'ui_tbodyReportData');
                    HidePageLoading();
                }
            },
            error: ShowAjaxError
        });
    },

    GetReport: function () {

        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/MobileInApp/ManageCampaign/GetReportData",
            type: 'Post',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'fromdate': FromDateTime, 'todate': ToDateTime, 'OffSet': OffSet, 'FetchNext': FetchNext, 'Name': CampaignName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                manageCampaignUtil.BindReport(response);
            },
            error: ShowAjaxError
        });
    },
    BindReport: function (response) {

        SetNoRecordContent('ui_tblReportData', 4, 'ui_tbodyReportData');
        if (response != undefined && response != null) {
            CurrentRowCount = response.length;
            PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);

            var reportTableTrs;

            $.each(response, function (index) {
                CampaignTempalte.push(this.Design);

                let Name = this.Name != null ? this.Name.length > 60 ? this.Name.substring(0, 60) + "..." : this.Name : "NA";
                let Status = this.Status != null && this.Status == 1 ? "<span id='Status_" + this.Id + "' class='d-block text-color-success'>Active</span>" : "<span id='Status_" + this.Id + "' class='d-block text-color-error'>In-Active</span>";

                reportTableTrs += "<tr id='ui_div_" + this.Id + "' priorityinfo=" + this.Priority + " value=" + this.Id + ">" +
                    "<td class='text-center'><i data-type='" + this.InAppCampaignType + "' data-index='" + index + "' class='icon ion-ios-eye-outline inappprevtemp bnotiftemplate'></i></td>" +
                    "<td><div class='groupnamewrap'><div class='nametxticnwrp'><i class='griddragicn'></i>" +
                    "<p class='mb-0'><span class='wordbreak' title='" + this.Name + "' >" + Name + "</span>" + Status + "</p></div>" +
                    "<div class='tdcreatedraft'><div class='dropdown'><button type='button' class='verticnwrp' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='icon ion-android-more-vertical mr-0'></i></button>" +
                    "<div class='dropdown-menu dropdown-menu-right'aria-labelledby='filterbycontacts'>" +
                    "<a class='dropdown-item inapptesttemp ContributePermission' href='/MobileInApp/CreateCampaign?Id=" + this.Id + "'>Edit</a>" +
                    "<a id='changeStatus_" + this.Id + "' class='dropdown-item ContributePermission' href='javascript:void(0)' onclick='manageCampaignUtil.ChangeStatus(" + this.Id + ", " + this.Status + ");'>Change Status</a>" +
                    "<a data-toggle='modal'data-target='#deletegroups' data-grouptype='groupDelete'class='dropdown-item FullControlPermission' href='javascript:void(0)' onclick ='AssignDeleteValue(" + this.Id + ")'>Delete</a>" +
                    "</div></div></div></div></td>" +
                    "<td>" + this.InAppCampaignType + "</td>" +
                    "<td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.CreatedDate)) + "</td>" +
                    "</tr>";
            });
            $("#ui_tblReportData").removeClass('no-data-records');
            $("#ui_tbodyReportData").html(reportTableTrs);
            ShowExportDiv(true);
            PreviewClick();
        }
        else {
            ShowExportDiv(false);
            ShowPagingDiv(false);
        }
        HidePageLoading();
        CheckAccessPermission("MobileInApp");
    },
    DeleteCampaign: function (CampaignNameId) {
        ShowPageLoading();
        $.ajax({
            url: "/MobileInApp/ManageCampaign/DeleteCampaign",
            type: 'Post',
            data: JSON.stringify({ "AccountId": Plumb5AccountId, "Id": CampaignNameId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    ShowSuccessMessage(GlobalErrorList.ManageInappCampaign.InappCampaignDeleteSuccess);
                    CallBackFunction();
                } else {
                    HidePageLoading();
                    ShowErrorMessage(GlobalErrorList.ManageInappCampaign.InappCampaignDeleteError);
                }
            },
            error: ShowAjaxError
        });
    },
    ChangeStatus: function (Id, status) {
        ShowPageLoading();
        var campaigndetails = { Id: 0, Status: 0 };
        campaigndetails.Id = Id;

        if (status == 1)
            campaigndetails.Status = 0;
        else
            campaigndetails.Status = 1;

        $.ajax({
            url: "/MobileInApp/ManageCampaign/ToogleStatus",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'inappCampaign': campaigndetails }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    $("#changeStatus_" + Id).removeAttr("onclick");

                    if (campaigndetails.Status == 1) {
                        $("#Status_" + Id).removeClass("text-color-error").addClass("text-color-success").attr("title", "toogle to inactive").html("").html("Active");
                        $("#changeStatus_" + Id).attr('onClick', 'manageCampaignUtil.ChangeStatus(' + Id + ', 1);');
                    }
                    else {
                        $("#Status_" + Id).removeClass("text-color-success").addClass("text-color-error").attr("title", "toogle to active").html("").html("In-Active");
                        $("#changeStatus_" + Id).attr('onClick', 'manageCampaignUtil.ChangeStatus(' + Id + ', 0);');
                    }
                    HidePageLoading();
                    ShowSuccessMessage(GlobalErrorList.ManageInappCampaign.ToggleSuccessStatus);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.ManageInappCampaign.ToggleFailureStatus);
                }
                HidePageLoading();
                campaigndetails.Id = 0;
                campaigndetails.Status = null;
            },
            error: ShowAjaxError
        });
    }
}


$(document).ready(function () {

    $("#txt_SearchBy").keydown(function (event) {
        if (event.keyCode == 13) {

            if (CleanText($.trim($("#txt_SearchBy").val())).length == 0) {
                ShowErrorMessage(GlobalErrorList.ManageInappCampaign.CampaignIdentifierError);
                return false;
            }

            var e_i = $("#txt_SearchBy").val();
            CampaignName = e_i.length > 0 ? e_i : null;
            CallBackFunction();

            event.preventDefault();
            return false;
        }
    });

});


$(".serchicon").click(function () {
    if (CleanText($.trim($("#txt_SearchBy").val())).length == 0) {
        ShowErrorMessage(GlobalErrorList.ManageInappCampaign.CampaignIdentifierError);
        return false;
    }
    CampaignName = CleanText($.trim($("#txt_SearchBy").val()));
    CallBackFunction();
});

$("#txt_SearchBy").keyup(function () {
    const key = event.key;
    if (key === "Backspace") {
        if (CleanText($.trim($("#txt_SearchBy").val())).length == 0) {
            CampaignName = CleanText($.trim($("#txt_SearchBy").val()));
            CallBackFunction();
        }
        return false;
    }
});

//Search text
$(".contsearchfocus")
    .on("focus", function () {
        $(this).parent().addClass("w-300");
    })
    .on("blur", function () {
        if ($(".contsearchfocus").val().length < 15)
            $(this).parent().removeClass("w-300");
    });

$('.sorted_table').sortable({
    handle: '.griddragicn',
    containerSelector: 'table',
    itemPath: '> tbody',
    itemSelector: 'tr',
    placeholder: '<tr class="placeholder"/>',
    onDrop: function ($item, container, _super) {


        _super($item, container);

        var newIndex = $item.index();
        var col1 = $item.find("td:eq(0)").text();

        var campaignids = [];
        var CampaignIdValues = [];
        var CampaignPriorities = [];
        var CampaignList = new Array();

        $("#ui_tbodyReportData tr").each(function () {
            campaignids.push(this.id);
        });

        for (var i = 0; i < campaignids.length; i++) {
            if ($("#" + campaignids[i]).attr('value') != undefined && $("#" + campaignids[i]).attr('value') != null && $("#" + campaignids[i]).attr('value') != "") {
                CampaignIdValues.push($("#" + campaignids[i]).attr('value'));
            }

            if ($("#" + campaignids[i]).attr('priorityinfo') != undefined && $("#" + campaignids[i]).attr('priorityinfo') != null && $("#" + campaignids[i]).attr('priorityinfo') != "") {
                CampaignPriorities.push($("#" + campaignids[i]).attr('priorityinfo'));
            }
        }

        //This i am doing to re-arrange the  priorities in  ascending order
        CampaignPriorities = CampaignPriorities.sort(function (a, b) {
            return parseInt(a) - parseInt(b);
        });

        for (var i = 0; i < CampaignIdValues.length; i++) {
            var campaignetails = { Id: 0, Priority: 0 };

            campaignetails.Id = CampaignIdValues[i];
            campaignetails.Priority = CampaignPriorities[i];

            window.console.log("Id-" + campaignetails.Id + "," + "Priority-" + campaignetails.Priority);
            CampaignList.push(campaignetails);
        }

        $.ajax({
            url: "/MobileInApp/ManageCampaign/ChangePriority",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'campaigndetails': CampaignList }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response)
                    ShowSuccessMessage(GlobalErrorList.ManageInappCampaign.PrioritySuccessStatus);
                else
                    ShowErrorMessage(GlobalErrorList.ManageInappCampaign.PriorityFailureStatus);
            },
            error: ShowAjaxError
        });
    }
});

var CampaignNameId = 0;
function AssignDeleteValue(Id) {
    CampaignNameId = Id;
};

$("#deleteRowConfirm").click(function () {
    manageCampaignUtil.DeleteCampaign(CampaignNameId);
});

function BindPreView(type, getFinalJson) {
    var screenType = type;
    var obj = JSON.parse(getFinalJson);
    var container = obj.Display;
    var finalField = obj.Fields;

    //main container.........................
    if (container != "") {
        var mainStyle = "";
        if (container.BgColor != "")
            mainStyle += "background-color:" + container.BgColor + ";";
        if (container.Border != "")
            mainStyle += "border:" + container.BorderWidth + "px solid " + container.Border + ";";
        if (container.BorderRadius != "")
            mainStyle += "border-radius:" + container.BorderRadius + "px;";
        if (container.BgImage != "")
            mainStyle += "background-image:url(" + container.BgImage + ");";
        if (container.Padding != "") {
            var getPadding = container.Padding.split(/,/);
            var setPadding = getPadding[1] + "px " + getPadding[2] + "px " + getPadding[3] + "px " + getPadding[0] + "px";
            mainStyle += "padding:" + setPadding + ";";
        }
        $(".inAppmaincontainer").attr("style", mainStyle);

    }

    //field.................................
    let addbantxtbtncont = '<div class="inAppbantxtimgwrp">';
    if (finalField.length > 0) {        
        for (var fieldNo = 0; fieldNo < finalField.length; fieldNo++) {

            var fieldStyle = "";
            if (finalField[fieldNo].Color != "")
                fieldStyle += "color:" + finalField[fieldNo].Color + ";";
            if (finalField[fieldNo].Size != "")
                fieldStyle += "font-size:" + finalField[fieldNo].Size + "px;";
            if (finalField[fieldNo].Style != "")
                fieldStyle += "font-weight:" + finalField[fieldNo].Style + ";";
            if (finalField[fieldNo].Orientation != "")
                fieldStyle += "text-align:" + finalField[fieldNo].Orientation + ";";
            if (finalField[fieldNo].Border != "")
                fieldStyle += "border:" + finalField[fieldNo].BorderWidth + "px solid " + finalField[fieldNo].Border + ";";
            if (finalField[fieldNo].BorderRadius != "")
                fieldStyle += "border-radius:" + finalField[fieldNo].BorderRadius + "px;";
            if (finalField[fieldNo].Padding != "") {
                var getPadding = finalField[fieldNo].Padding.split(/,/);
                var setPadding = getPadding[1] + "px " + getPadding[2] + "px " + getPadding[3] + "px " + getPadding[0] + "px";
                fieldStyle += "padding:" + setPadding + ";";
            }
            if (finalField[fieldNo].Margin != "") {
                var getMargin = finalField[fieldNo].Margin.split(/,/);
                var setMargin = getMargin[0] + "px " + getMargin[0] + "px " + getMargin[0] + "px " + getMargin[0] + "px";
                fieldStyle += "margin:" + setMargin + ";";
            }
            if (finalField[fieldNo].BgColor != "")
                fieldStyle += "background-color:" + finalField[fieldNo].BgColor + ";";

            var Type = finalField[fieldNo].Type;

            if (Type == "Img") {

                var imgurl = finalField[fieldNo].ImageUrl != "" ? "background-image: url(" + finalField[fieldNo].ImageUrl + ")" : "";
                if (screenType == "Full Screen Banner") {
                    addbantxtbtncont += `<div id="inappcustfield` + fieldNo + `" class="inappparatext inAppfullbgwrp">
            <div style= "` + imgurl + `" data-inputtype="Img" class ="inAppfullscreen"><a href="javascript:void(0)" target="_blank"></a>
            </div>
            </div>`;
                }
                else {
                    addbantxtbtncont += `<div id="inappcustfield` + fieldNo + `" class="inappparatext">
            <div style= "` + imgurl + `" data-inputtype="Img"
            class="inAppbanwrp custbgban"></div>
            </div>`;
                }
            }
            else if (Type == "Tv") {
                addbantxtbtncont += `<div id="inappcustfield` + fieldNo + `" class="inappparatext">
            <p data-inputtype="Tv"
            class ="inAppbantitle" style= "` + fieldStyle + `" > ` + finalField[fieldNo].Text + `
            </p>
            </div>`;
            }
            else if (Type == "Btn") {
                addbantxtbtncont += `<div id="inappcustfield` + fieldNo + `" class="inappaddbtnswrp">
            <a style= "` + fieldStyle + `" data-inputtype="Btn"
            id="inappbtnName1" href="javascript:void(0)"
            class="btn btn-danger btn-block"
            target="_blank">
           `+ finalField[fieldNo].Text + `
            </a>
            </div>`;
            }

            else if (Type == "Et") {
                addbantxtbtncont += `<div id="inappcustfield` + fieldNo + `" class="inappparatext">
            <input style= "` + fieldStyle + `" data-inputtype="Et" type="text" placeholder= "` + finalField[fieldNo].Text + `" name="" class ="form-control form-control-sm inappfrmtxtbx" id="">
            </div>`;
            }
            else if (Type == "Sp") {
                var intext = finalField[fieldNo].Text.split(/,/); var option = "";
                for (i = 0; i < intext.length; i++) {
                    option += "<option value=" + intext[i] + ">" + intext[i] + "</option>";
                }

                addbantxtbtncont += `<div id="inappcustfield` + fieldNo + `" class="inappparatext">
            <select  data-inputtype="Sp" style= "` + fieldStyle + `" class ="form-control form-control-sm inappfrmtxtbx" id=""> ` + option + ` </select>
            </div>`;
            }
            else if (Type == "Rg") {
                var intext = finalField[fieldNo].Text.split(/,/); var option = "";
                for (i = 0; i < intext.length; i++) {
                    option += `<div data-inputtype="Rg" class="custom-control custom-radio"><input type="radio" value="" id="" name="` + intext[i] + `" class="custom-control-input">
                    <label style= "` + fieldStyle + `" class ="custom-control-label" for= "` + intext[i] + `" > ` + intext[i] + ` </label></div>`;
                }
                addbantxtbtncont += `<div id="inappcustfield` + fieldNo + `" class="inappparatext">
            `+ option + `
            </div>`;
            }
            else if (Type == "Cb") {
                addbantxtbtncont += `<div id="inappcustfield` + fieldNo + `" class="inappparatext custom-control custom-checkbox">
            <input data-inputtype="Cb" type="checkbox" value= "`+ finalField[fieldNo].Text + `" class ="custom-control-input" name= "` + finalField[fieldNo].Text + `" id="">
            <label style= "` + fieldStyle + `"  data-inputtype="Cb"class ="custom-control-label" for= "` + finalField[fieldNo].Text + `" > ` + finalField[fieldNo].Text + ` </label>
            </div>`;
            }
            else if (Type == "Rat") {
                var img = '';
                for (i = 0; i < parseInt(finalField[fieldNo].Text) ; i++) {
                    img += '<span class="fa fa-star-o"></span>';
                }

                addbantxtbtncont += `<div id="inappcustfield` + fieldNo + `" class="inappparatext">
            <div style= "` + fieldStyle + `" data-inputtype="Rb" class ="inappstarratitemwrp">
            `+ img + `
            </div>
            </div>`;
            }

            if (screenType == "Full Screen Banner & Button") {

            }
        }

    }

    addbantxtbtncont += '<div';
    return addbantxtbtncont;

}

function PreviewClick() {
    $('.bnotiftemplate').click(function () {
        $(".bnotiftemplate").not(this).popover("hide");
    });

    $('.bnotiftemplate').popover({
        html: true,
        trigger: "hover",
        placement: "left",
        content: function () {

            var type = $(this).attr("data-type");
            var indexPos = parseInt($(this).attr("data-index"));
            if (CampaignTempalte[indexPos] != undefined && CampaignTempalte[indexPos] != "") {
                var getJson = BindPreView(type, CampaignTempalte[indexPos]);
                $(".inAppmaincontainer").html(getJson);
            }
            setInterval(function () { $(".popover-header").hide(); }, 100);
            return $(".bnotiftempwrp").html();
        }
    });
}