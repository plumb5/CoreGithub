
var maxRowCount = 0, rowIndex = 0, viewMoreDisable = false;

var chatDetails = { Id: 0, Name: "", ChatStatus: null };

$(document).ready(function () {
    ExportFunctionName = "ChatDetailsExport";
    CallBackFunction();
});

function CallBackFunction() {
    ShowPageLoading();
    TotalRowCount = 0;
    CurrentRowCount = 0;
    GetMaxCount();
}

function CallBackPaging() {
    CurrentRowCount = 0;
    CreateTable();
}



function GetMaxCount() {

    chatDetails.Name = $("#ui_txtSearchBy").val();

    $.ajax({
        url: "/Chat/AllChat/GetMaxCount",
        type: 'POST',
        data: JSON.stringify({ 'chatDetails': chatDetails }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            TotalRowCount = result;
            if (TotalRowCount > 0) {
                CreateTable();
            }
            else {
                SetNoRecordContent('ui_tblReportData', 3, 'ui_tbodyReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}


function CreateTable() {

    FetchNext = GetNumberOfRecordsPerPage();

    $.ajax({
        url: "/Chat/AllChat/Get",
        type: 'Post',
        data: JSON.stringify({ 'chatDetails': chatDetails, 'OffSet': OffSet, 'FetchNext': FetchNext }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: onSuccess,
        error: ShowAjaxError
    });
}

function onSuccess(responseData) {
    SetNoRecordContent('ui_tblReportData', 3, 'ui_tbodyReportData');

    if (responseData != undefined && responseData != null && responseData.length > 0) {

        CurrentRowCount = responseData.length;
        PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
        var reportTableTrs, chatname;
        $.each(responseData, function (i) {
            chatname = $(this)[0].Name;
            if (chatname.length > 25) {
                chatname = chatname.substring(0, 25) + "..";
            }

            var statusOfChat = $(this)[0].ChatStatus;
            //var statusOfChat = $(this)[0].ChatStatus ? 1 : 0, statusContent = "";

            if ($(this)[0].ChatStatus)
                statusContent = "<td id='Status_" + $(this)[0].Id + "' class='text-color-success'>Active</td>";
            else
                statusContent = "<td id='Status_" + $(this)[0].Id + "' class='text-color-error'>In-Active</td>";

            var chatName = $(this)[0].Name;

            reportTableTrs +=

                "<tr id='ui_div_" + $(this)[0].Id + "' priorityinfo=" + $(this)[0].ChatPriority + " value=" + $(this)[0].Id + ">" +
                "<td>" +
                "<div class='groupnamewrap'>" +
                "<div class='nametxticnwrp' id='chatid" + this.Id + "' title='" + $(this)[0].Name + "'>" +
                "<i class='griddragicn'></i> <span class='wordbreak'>" + chatname + "</span></div>" +
                "<div class='tdcreatedraft'><div class='dropdown'>" +
                "<button type='button' class='verticnwrp' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'><i class='icon ion-android-more-vertical mr-0'></i></button><div class='dropdown-menu dropdown-menu-right'aria-labelledby='filterbycontacts'>" +
                "<a class='dropdown-item ContributePermission' href='javascript:void(0)' onclick='GoChatRoom(" + $(this)[0].Id + ");'>Sign-in</a>" +
                "<a class='dropdown-item DesignPermission' href='/Chat/NewChat?ChatId=" + $(this)[0].Id + "'>Edit</a>" +
                "<a class='dropdown-item' href='/Chat/Responses?ChatId=" + $(this)[0].Id + "&Status=" + statusOfChat + "&ChatName=" + chatName + "'> View Responses </a>" +
                "<a id='changeStatus_" + $(this)[0].Id + "' class='dropdown-item embfrmlist DesignPermission' onclick='ChangeStatus(" + $(this)[0].Id + ", " + statusOfChat + ");' href='javascript:void(0)'>Change Status</a>" +
                "<a class='dropdown-item wehookresp' href='javascript:void(0);' onclick='formChatWebhookResponseUtil.GetMaxCount(" + this.Id + ",\"" + this.Name + "\");'>Webhook Response</a>" +

                //"<a class='dropdown-item prevchatshow'href='javascript:void(0)' onclick='ChangePreview(" + $(this)[0].Id + ");' >Preview</a>" +
                "<div class='dropdown-divider'></div>" +
                "<a id='dv_deleteChat' data-toggle='modal'data-target='#deletechat' data-chatid=" + $(this)[0].Id + " data-grouptype='groupDelete' class='dropdown-item FullControlPermission' href='javascript:void(0)'>Delete</a>" +
                "</div></div></div></div></td>" +
                "" + statusContent + "" +
                "<td>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj($(this)[0].ChatCreatedDate)) + "</td>" +
                "</tr>";

        });
        $("#ui_tblReportData").removeClass('no-data-records');
        $("#ui_tbodyReportData").html(reportTableTrs);
        ShowExportDiv(true);
    } else {
        $('.searchCampWrap').hide();
        ShowExportDiv(false);
        ShowPagingDiv(false);
    }
    HidePageLoading();
    CheckAccessPermission("Chat");
}


$("#SearchByIdentifierName").click(function () {
    ShowPageLoading();
    if ($.trim($("#ui_txtSearchBy").val()).length == 0) {
        ShowErrorMessage(GlobalErrorList.AllChat.FormIdentiferSearch_error);
        $("#ui_txtSearchBy").focus();
        setTimeout(function () { HidePageLoading(); }, 500);
        return false;
    }
    else {
        GetMaxCount();
    }
});

$("#ui_txtSearchBy").keypress(function (e) {
    if ((e.which && e.which === 13) || (e.keyCode && e.keyCode === 13)) {
        if (CleanText($.trim($("#ui_txtSearchBy").val())).length == 0) {
            ShowErrorMessage(GlobalErrorList.AllChat.SearchErrorValue);
            HidePageLoading();
            return false;
        }
        ShowPageLoading();
        GetMaxCount();
    }
});

$("#ui_txtSearchBy").keyup(function (e) {
    if (e.which && e.which === 8 || e.keyCode && e.keyCode === 46)
        if ($("#ui_txtSearchBy").val().length === 0) {
            ShowPageLoading();
            GetMaxCount();
        }
});

function GoChatRoom(chatId) {
    if ($("#Status_" + chatId).hasClass("text-color-error")) {
        ShowErrorMessage(GlobalErrorList.AllChat.ChatInactiveStatus);
        return false;
    }
    else {
        ShowPageLoading();
        window.location.href = '/Chat/ChatRoom?ChatId=' + chatId;
    }
}

function CloseAll() {
    $("#lblScriptDetails").html(""); $(".scriptLeads").hide();
}

function ChangeStatus(chatId, status) {
    ShowPageLoading();
    var ChatStatus = true;

    if (status == false)
        ChatStatus = true;
    else
        ChatStatus = false;


    $.ajax({
        url: "/Chat/AllChat/ToogleStatus",
        type: 'POST',
        data: JSON.stringify({ 'chatId': chatId, 'ChatStatus': ChatStatus }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
        
                if (result == true) {
                    $("#Status_" + chatId).removeClass("text-color-error").addClass("text-color-success").attr("title", "toogle to inactive").html("").html("Active");
                    $("#changeStatus_" + chatId).attr('onClick', 'ChangeStatus(' + chatId + ', true);');
                }
                else {
                    $("#Status_" + chatId).removeClass("text-color-success").addClass("text-color-error").attr("title", "toogle to active").html("").html("In-Active");
                    $("#changeStatus_" + chatId).attr('onClick', 'ChangeStatus(' + chatId + ', false);');
                }
                ShowSuccessMessage(GlobalErrorList.AllChat.ToggleSuccessStatus);
           
            HidePageLoading();
        },

    });
}



var chatId = 0;
$(document).on('click', "#dv_deleteChat", function () {
    chatId = parseInt($(this).attr("data-chatid"));
});

$("#deleteRowConfirm").click(function () {
    ShowPageLoading();
    $.ajax({
        url: "/Chat/AllChat/Delete",
        type: 'POST',
        data: JSON.stringify({ 'chatId': chatId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                --CurrentRowCount;
                --TotalRowCount;
                $("#ui_div_" + chatId).hide("slow");
                PagingPrevNext(OffSet, CurrentRowCount, TotalRowCount);
                ShowSuccessMessage(GlobalErrorList.AllChat.DeleteSuccessStatus);
                if (CurrentRowCount <= 0 && TotalRowCount <= 0) {
                    SetNoRecordContent('ui_tblReportData', 3, 'ui_tbodyReportData');
                }
            }
            else {
                ShowErrorMessage(GlobalErrorList.AllChat.DeleteFailureStatus);
            }
            HidePageLoading();
        },
        error: ShowAjaxError
    });
});


//CallTrackerStatus = function () {
//    AllCallTrackerStatus('ChatStatus', adsId);
//};

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

        var chatids = [];
        var ChatIdValues = [];
        var ChatPriorities = [];
        var ChatDetailsList = new Array();

        $("#ui_tbodyReportData tr").each(function () {
            chatids.push(this.id);
        });

        for (var i = 0; i < chatids.length; i++) {
            if ($("#" + chatids[i]).attr('value') != undefined && $("#" + chatids[i]).attr('value') != null && $("#" + chatids[i]).attr('value') != "") {
                ChatIdValues.push($("#" + chatids[i]).attr('value'));
            }

            if ($("#" + chatids[i]).attr('priorityinfo') != undefined && $("#" + chatids[i]).attr('priorityinfo') != null && $("#" + chatids[i]).attr('priorityinfo') != "") {
                ChatPriorities.push($("#" + chatids[i]).attr('priorityinfo'));
            }
        }

        //This i am doing to re-arrange the Chat priorities in  ascending order
        ChatPriorities = ChatPriorities.sort(function (a, b) {
            return parseInt(a) - parseInt(b);
        });


        for (var i = 0; i < ChatIdValues.length; i++) {
            var chatdetails = { Id: 0, ChatPriority: 0 };

            chatdetails.Id = ChatIdValues[i];
            chatdetails.ChatPriority = ChatPriorities[i];

            window.console.log("ChatId-" + chatdetails.Id + "," + "ChatIdPriority-" + chatdetails.ChatPriority);
            ChatDetailsList.push(chatdetails);
        }

        $.ajax({
            url: "/Chat/AllChat/ChangePriority",
            type: 'POST',
            data: JSON.stringify({ 'chatdetails': ChatDetailsList }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response) {
                    ShowSuccessMessage(GlobalErrorList.AllChat.PrioritySuccessStatus);
                }
                else {
                    ShowErrorMessage(GlobalErrorList.AllChat.PriorityFailureStatus);
                }
            },
            error: ShowAjaxError
        });
    }
});

//Chat Preview
function ChangePreview() {
    $("#effectsTabCont").removeClass("hideDiv");
}

$("#ui_closechatpreview").click(function () {

    $("#effectsTabCont").addClass("hideDiv");
});

$("#mobilepreview").click(function () {
    $("#mobilepreview").addClass("active");
    $("#chat-mobilepreview").removeClass("hideDiv");
    $("#chat-desktoppreview").addClass("hideDiv");
    $("#desktoppreview").removeClass("active");
});

$("#desktoppreview").click(function () {
    $("#mobilepreview").removeClass("active");
    $("#chat-mobilepreview").addClass("hideDiv");
    $("#chat-desktoppreview").removeClass("hideDiv");
    $("#desktoppreview").addClass("active");
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

