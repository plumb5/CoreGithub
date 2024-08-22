var WfGroupids = [];
var Isbelong = true;
var SelGroupId = 0;
var SelGroupName = '';
var Group = { Id: 0, Name: "" };



function BindWorkFlowGroup(GroupIds, belongs, create) {
    if (create != 1) {
        $("#dvcustompopupsegment").removeClass('hideDiv');
        $("#dvWfGroupFooter").hide();
        $(".popupItem").addClass("popup-tbl").removeClass('w-450').addClass("w-650");
        $(".popuptitle h6").html('GROUP');
    } else { $("#dvWfGroupFooter").show(); }



    WfGroupids = GroupIds;
    Isbelong = belongs == 0 ? false : true;

    bindWorkflowGroups();
}

function bindWorkflowGroups() {
    ShowPageLoading();
    GroupTotalInnerRowCount = 0;
    GroupCurrentInnerRowCount = 0;

    GetMaxCountGroups();
}

function CallBackGroupInnerPaging() {
    GroupCurrentInnerRowCount = 0;
    GetGroupInnerReport();
}

function GetMaxCountGroups() {
    Group.Name = $("#ui_txtSearchgroup").val();
    $.ajax({
        url: "/Journey/Groups/GetMaxCount",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'groups': Group }),
        success: function (response) {
            GroupTotalInnerRowCount = response;

            if (GroupTotalInnerRowCount > 0) {
                GetGroupInnerReport();
            }
            else {
                SetNoRecordContent('ui_tblGroupData', 3, 'ui_tbodyGroupInnerReportData');
                HidePageLoading();
            }
        },
        error: ShowAjaxError
    });
}

function GetGroupInnerReport() {
    GroupInnerFetchNext = GetGroupInnerNumberOfRecordsPerPage();

    $.ajax({
        url: "/Journey/Groups/BindGroups",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'groups': Group, 'OffSet': GroupInnerOffSet, 'FetchNext': GroupInnerFetchNext }),
        success: BindGroupInnerReport,
        error: ShowAjaxError
    });


}

function BindGroupInnerReport(response) {
    SetNoRecordContent('ui_tblGroupData', 3, 'ui_tbodyGroupInnerReportData');
    if (response != undefined && response != null) {
        GroupCurrentInnerRowCount = response.length;
        InnerGroupPagingPrevNext(GroupInnerOffSet, GroupCurrentInnerRowCount, GroupTotalInnerRowCount);

        var reportTableTrs = ""; var grpId = 0;
        $.each(response, function () {

            var inputChecked = WfGroupids.indexOf(this.Id) > -1 ? 'checked' : '';

            reportTableTrs += '<tr><td class="text-left">' +
                '<div class="custom-control custom-checkbox">' +
                '<input ' + inputChecked + ' type="checkbox" class="custom-control-input" id="chkGroup_' + this.Id + '"  value="' + this.Id + '" name="group">' +
                '<label class="custom-control-label" for="chkGroup_' + this.Id + '">' + this.Name + '</label>' +
                '</div>' +
                '</td>' +
                '<td class="text-left wrkflwviewdetdrp">' +
                ' <div class="dropdown">' +
                '<a onclick="GetGroupInnerViewReport(' + this.Id + ',\'' + this.Name + '\')" class="cursor-pointer text-color-blue" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
                'View Detail' +
                '</a>' +
                '<div id="dvGroupInnerView_' + this.Id + '" class="dropdown-menu keepopen w-250" aria-labelledby="filterbycontacts">' +
                '</div></div></td>' +
                '<td>' + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(this.CreatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(this.CreatedDate)) + '</td></tr>';
        });

        $("#ui_tbodyGroupInnerReportData").html(reportTableTrs);
        ShowGroupInnerPagingDiv(true);
    }
    else {
        ShowGroupInnerPagingDiv(false);
    }
    HidePageLoading();
}

function GetGroupInnerViewReport(Groupid, GrpName) {
    SelGroupId = Groupid;
    SelGroupName = GrpName;
    $.ajax({
        url: "/Journey/Groups/BindGropsDetails",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'groupids': Groupid.toString(), 'Isbelong': true, 'Offset': 0, 'FetchNext': 10 }),
        success: BindGroupInnerViewReport,
        error: ShowAjaxError
    });


}


function BindGroupInnerViewReport(response) {
    if (response != undefined && response != null) {
        var responseData = JSON.parse(response);

        var reportTableTrs = "";
        if (responseData.length > 0) {
            var MailCount = 0, SMSCount = 0, AppPushCount = 0, WePushCount = 0;
            var SMSOptOut = 0, SMSOptIn = 0;
            var MailOptOut = 0, MailOptIn = 0;
            var AppPushOptOut = 0, AppPushOptIn = 0;
            var WebPushOptOut = 0, WebPushOptIn = 0;

            $.each(responseData, function () {

                if (this.ReportType == "Mail") {
                    MailOptOut = this.OptOut;
                    MailOptIn = this.OptIn;
                    MailCount = this.Total;
                }
                if (this.ReportType == "SMS") {
                    SMSOptOut = this.OptOut;
                    SMSOptIn = this.OptIn;
                    SMSCount = this.Total;
                }
                if (this.ReportType == "AppPush") {
                    AppPushOptOut = this.OptOut;
                    AppPushOptIn = this.OptIn;
                    AppPushCount = this.TotalVisitor;
                }
                if (this.ReportType == "WebPush") {
                    WebPushOptOut = this.OptOut;
                    WebPushOptIn = this.OptIn;
                    WePushCount = this.TotalVisitor;
                }

                reportTableTrs = '<div class="wrkflwsubdet">' +
                    '<p>Total Mail</p>' +
                    '<p><a href="/ManageContact/Contact?GroupId=' + SelGroupId + '&GroupName=' + SelGroupName + '">' + MailCount + ' [Optout-' + MailOptOut + ']</a></p>' +
                    '</div>' +
                    '<div class="wrkflwsubdet">' +
                    '<p>Total SMS</p>' +
                    '<p><a href="/ManageContact/Contact?GroupId=' + SelGroupId + '&GroupName=' + SelGroupName + '">' + SMSCount + ' [Optout-' + SMSOptOut + ']</a></p>' +
                    '</div>' +
                    '<div class="wrkflwsubdet">' +
                    '<p>Total Web Push</p>' +
                    '<p><a href="/ManageContact/PushSubscribers?GroupId=' + SelGroupId + '&GroupName=' + SelGroupName + '">' + WePushCount + ' [Optout-' + WebPushOptOut + ']</a></p>' +
                    '</div>' +
                    '<div class="wrkflwsubdet">' +
                    '<p>Total App Push</p>' +
                    '<p><a href="/ManageContact/PushSubscribers?GroupId=' + SelGroupId + '&GroupName=' + SelGroupName + '">' + AppPushCount + ' [Optout-' + AppPushOptOut + ']</a></p>' +
                    '</div>';

            });
        } else {
            reportTableTrs = '<div class="wrkflwsubdet"><p>No Contacts or subscribers</p></div>';
        }
        $("#dvGroupInnerView_" + SelGroupId).html(reportTableTrs);
    }
    else {
    }
    HidePageLoading();
}

document.getElementById("ui_txtSearchgroup").addEventListener("keyup", function (event) {
    if (event.keyCode === 13) {
        event.preventDefault();
        bindWorkflowGroups();
    }
    else {
        var groupname = CleanText($('#ui_txtSearchgroup').val());
        if (groupname === '') {
            bindWorkflowGroups();
        }
    }
});

$("#btngroupdetails").click(function () {
    getFinalGroupList();
    var SelectedSegmentIds = GroupIds;
    if (SelectedSegmentIds == "") {
        ShowErrorMessage(GlobalErrorList.WorkFLow.SelectGroup);
    }
    else {
        AudienceConfig = {};
        $.ajax({
            url: "/Journey/CreateWorkflow/GetgroupsCount",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'GrpIds': SelectedSegmentIds.toString() }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                SegmentName = "group";
                AudienceConfig.IsBelongToGroup = true;

                SetNodeConfigArray(ClickedNodeId.toString(), SelectedSegmentIds.toString(), SegmentName);
                if (WorkflowId > 0) {
                    AudienceConfig.SegmentId = SelectedSegmentIds.toString();
                    AudienceConfig.WorkFlowId = WorkflowId;
                    AudienceConfig.SegmentName = SegmentName.toString();
                    AudienceConfig.Segment = ClickedNodeId.toString();
                    AudienceConfig.IsGroupOrIndividual = false;
                    $.ajax({
                        url: "/Journey/CreateWorkflow/UpdateAudience",
                        type: 'post',
                        dataType: 'json',
                        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'AudienceConfig': AudienceConfig }),
                        contentType: "application/json; charset=utf-8",
                        success: function (ReturnAudienceConfigId) {
                            //if (ReturnAudienceConfigId == 0) {
                            //    ShowErrorMessage("Audience has been updated");
                            //}
                        },
                    });
                }
            },
            error: ShowAjaxError
        });

        $(this).parents(".popupcontainer").addClass("hideDiv");
    }
});

function getFinalGroupList() {
    GroupIds = [];
    $("input[name=group]:checkbox:checked").map(function () {
        GroupIds.push($(this).val());
    });
}
