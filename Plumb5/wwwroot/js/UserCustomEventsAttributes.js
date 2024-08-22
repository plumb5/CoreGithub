var titletextboxvalue;
var messagetextboxvalue;
var customeventFieldList = [];
var evenextrafieldlist = [];
var geteventname = [];
var ddlContacteventFields = [];
var customFieldList = [];
var templatename = '';
var TaggingLmsCustomFields = [];
var Lmscustomfielddetailstagging = [];
var customeventNameFieldList = [];
var ContactPropertyList = [
    { P5ColumnName: 'Name', FrontEndName: 'Name' },
    { P5ColumnName: 'LastName', FrontEndName: 'LastName' },
    { P5ColumnName: 'EmailId', FrontEndName: 'EmailId' },
    { P5ColumnName: 'PhoneNumber', FrontEndName: 'PhoneNumber' },
    { P5ColumnName: 'Location', FrontEndName: 'Location' },
    { P5ColumnName: 'Gender', FrontEndName: 'Gender' },
    { P5ColumnName: 'MaritalStatus', FrontEndName: 'MaritalStatus' },
    { P5ColumnName: 'Education', FrontEndName: 'Education' },
    { P5ColumnName: 'Occupation', FrontEndName: 'Occupation' },
    { P5ColumnName: 'Interests', FrontEndName: 'Interests' },
    { P5ColumnName: 'CustomerScore', FrontEndName: 'CustomerScore' },
    { P5ColumnName: 'AccountNumber', FrontEndName: 'AccountNumber' },
    { P5ColumnName: 'Signatory_Name', FrontEndName: 'Signatory_Name' },
    { P5ColumnName: 'Signatory_EmailId', FrontEndName: 'Signatory_EmailId' },
    { P5ColumnName: 'Signatory_PhoneNumber', FrontEndName: 'Signatory_PhoneNumber' },
    { P5ColumnName: 'Signatory_BusinessPhoneNumber', FrontEndName: 'Signatory_BusinessPhoneNumber' }


];
$(document).ready(function () {
    //BindUrlEventMappingDetails();

    ////GetContactFielddragdrop();
    //DragDroReportUtil.GetReport();

});

var eventnametitle
$('[id^="eventname"]').on('change', function () {
    eventname = '';
    eventname = this.value;
    var customEventOverViewId = this.options[this.selectedIndex].getAttribute('attr_id');


    $('[id^="eventitems"]').empty();
    $('[id^="eventitems"]').append('<option value="Select">Select Event Items</option>');
    DragDroReportUtil.EventMappingDetails(customEventOverViewId, eventname);
});
$(document).on('change', "#ddlCustomTag1", function () {

    eventname = '';
    eventname = this.value;
    var customEventOverViewId = this.options[this.selectedIndex].getAttribute('attr_id');


    $('[id^="eventitems"]').empty();
    $('[id^="eventitems"]').append('<option value="Select">Select Event Items</option>');
    $("#ddlCustomTag2").empty();
    $("#ddlCustomTag2").append('<option value="Select">Select Event Items</option>');
    DragDroReportUtil.EventMappingDetails(customEventOverViewId, eventname);
});
var eventnametitle
$('#titleeventname').on('change', function () {
    eventnametitle = '';
    eventname = this.value;
    var customEventOverViewId = this.options[this.selectedIndex].getAttribute('attr_ids');
    $("#titleeventitems").empty();
    $("#titleeventitems").append('<option value="Select">Select Event Items</option>');
    DragDroReportUtil.EventMappingDetails(customEventOverViewId, '');
});
$(".dropdwntabs1").click(function () {
    let attrbidval = $(this).attr("data-tabcontid");

    $(".dropdwntabs1").removeClass("active");

    $(this).addClass("active");

    $("#customeve1,#userattr1").addClass("hideDiv");

    $("#" + attrbidval).removeClass("hideDiv");
});
$(".dropdwntabs").click(function () {
    let attrbidval = $(this).attr("data-tabcontid");
    let attrdataclass = $(this).attr("dataclass");

    let attrid = 'userattr';
    if (attrbidval.indexOf('userattr') > -1)
        attrid = 'cstevent';
    $(attrdataclass).removeClass("active");
    //$("#webpushcstattr").removeClass("active");

    ////$("#whatsappcstattr,#whatsappuserattr,#smsuserattr,#smscstattr,#webpushuserattr,#webpushcstattr,#cpformsuserattr,#webpushcstattr,#cpformscstuserattr,#cpformsevntattr,#cpformscsteventattr").removeClass("active");
    $(this).addClass("active");
    //$("#userattr,#customeve,#customeve2,#userattr2,#userattrurl,#customeveurl,#userattrbtnurl,#customevebtnurl,#userattrbtn2url,#customevebtn2url").addClass("hideDiv");

    $("#" + attrid + attrbidval.substring(8)).addClass("hideDiv");
    $("#" + attrbidval).removeClass("hideDiv");
    //if (templatename=='sms')
    //BindDltTagging($("#ui_txtMessageTemplate").val());

});
$('.addCampName').select2({
    minimumResultsForSearch: '',
    dropdownAutoWidth: false
});


function GetContactFielddragdrop(templatetype) {
    $.ajax({
        url: "/WebPush/CreateTemplate/GetAllFieldDetails",
        type: 'Post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),

        success: function (response) {
            if (templatetype == 'Email')
                EditorUtil.BindContactFields(response);
            if (templatetype == 'Emailnew')
                EditorEmailUtil.BindContactFields(response);
            if (templatetype == 'Whatsapp') {
                CreateWhatsAppTemplateUtil.BindContactFields(response);
                BindContactFielddragdrop(response);
            }

            else {
               
                BindContactFielddragdrop(response);
            }
              
        },

    });
};
BindContactFielddragdrop = function (fieldList) {
    $("#draganddropuncustomtitle").empty();
    $("#draganddropuncustomtitle").append('<option value="Select">Select</option>');
    if (fieldList.length > 0) {
        $.each(fieldList, function (i) {

            ContactPropertyList.push({
                'P5ColumnName': this.FieldName, 'FrontEndName': this.FieldName
            });
            customFieldList.push($(this)[0].FieldName);
        });


        for (var i = 0; i < ContactPropertyList.length; i++) {
            $('[id^="draganddrop"]').append("<option value='" + ContactPropertyList[i].P5ColumnName + "'>" + ContactPropertyList[i].FrontEndName + "</option>");

        }
        if (window.location.href.includes("Template")) { 
            $('[id^="draganddrop"]').append("<option value='UserInfo^firstname'>UserInfoName</option>");
            $('[id^="draganddrop"]').append("<option value='UserInfo^lastname'>UserInfoLastName</option>");
            $('[id^="draganddrop"]').append("<option value='UserInfo^emailid'>UserInfoEmailId</option>");
            $('[id^="draganddrop"]').append("<option value='UserInfo^mobilephone'>UserInfoPhoneNumber</option>");
        }
        for (var i = 0; i < TaggingLmsCustomFields.length; i++) {
            
            $('[id^="draganddrop"]').append("<option value='" + TaggingLmsCustomFields[i].FieldDisplayName + "'>" + TaggingLmsCustomFields[i].FieldDisplayName + "</option>");

        }

    }
    else {
        for (var i = 0; i < ContactPropertyList.length; i++) {
            $('[id^="draganddrop"]').append("<option value='" + ContactPropertyList[i].P5ColumnName + "'>" + ContactPropertyList[i].FrontEndName + "</option>");

        }
        $('[id^="draganddrop"]').append("<option value='UserInfo^firstname'>UserInfoName</option>");
        $('[id^="draganddrop"]').append("<option value='UserInfo^lastname'>UserInfoLastName</option>");
        $('[id^="draganddrop"]').append("<option value='UserInfo^emailid'>UserInfoEmailId</option>");
        $('[id^="draganddrop"]').append("<option value='UserInfo^mobilephone'>UserInfoPhoneNumber</option>");
        for (var i = 0; i < TaggingLmsCustomFields.length; i++) { 
            $('[id^="draganddrop"]').append("<option value='" + TaggingLmsCustomFields[i].FieldDisplayName + "'>" + TaggingLmsCustomFields[i].FieldDisplayName + "</option>");

        }
    }

};
var DragDroReportUtil = {
    GetReport: function () {
        CustomEventName = CleanText($.trim($('#txt_SearchBy').val()));
        FetchNext = GetNumberOfRecordsPerPage();
        $.ajax({
            url: "/CustomEvents/CustomEventsOverview/UserAttrGetReportData",
            type: 'Post',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'OffSet': OffSet, 'FetchNext': 0, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'CustomEventName': CustomEventName }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: DragDroReportUtil.BindReport,
            error: ShowAjaxError
        });
    },

    BindReport: function (response) {
        $("#eventnameconditionalsubject").empty();
        $("#eventnameconditionalsubject").append('<option value="Select">Select Event Name</option>');
        if (response != undefined && response != null && response.length > 0) {
            $.each(response, function () {
                customeventNameFieldList = response;
                $('[id^="eventname"]').append('<option attr_id="' + $(this)[0].Id + '" value="' + $(this)[0].EventName + '">' + $(this)[0].EventName + '</option>');
                ddlContacteventFields += '<option attr_id="' + $(this)[0].Id + '" value="' + $(this)[0].EventName + '">' + $(this)[0].EventName + '</option>';
            });

        }

        HidePageLoading();

    },
    EventMappingDetails: function (customEventOverViewId, eventname) {
        //$(".popupcontainer").removeClass("hideDiv");
        //$(".popuptitlwrp h6").text("Event Extra Fields Properties");
        //$('[id^="eventitems"]').empty();
        $.ajax({
            url: "/CustomEvents/CustomEventsOverview/UserAttrGetEventExtraFieldData",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'customEventOverViewId': customEventOverViewId, 'fromDateTime': FromDateTime, 'toDateTime': ToDateTime, 'contactid': 0, 'EventName': '' }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var _customeventFieldList = [];
                _customeventFieldList.push(eventname)
                $.each(response, function () {
                    $('[id^="eventitems"]').append('<option value="' + this.FieldName + '">' + this.FieldName + '</option>');
                    $("#ddlCustomTag2").append('<option value="' + this.FieldName + '">' + this.FieldName + '</option>');
                    _customeventFieldList.push(this.FieldName)
                });
                customeventFieldList.push(_customeventFieldList)
            },
            error: ShowAjaxError
        });
    },

    Getdistincteventname: function (Title, MessageContent, templatetype) {
        ShowPageLoading();
        geteventname = [];
        let regex = /\{{.*?}\}/gi;
        let matches = Title.match(regex);
        if (matches != null) {
            matches.forEach(function (m) {
                let splitedeventdata = m.replace("{{*", "").replace("}}").split('~');
                let finaleventname = splitedeventdata[0].replace("[", "").replace("]", "");

                geteventname.push(finaleventname);
            });
        }
        let Msgmatches = MessageContent.match(regex);
        if (Msgmatches != null) {
            Msgmatches.forEach(function (m) {
                let splitemsgdeventdata = m.replace("{{*", "").replace("}}").split('~');
                let finalmsgeventname = splitemsgdeventdata[0].replace("[", "").replace("]", "");
                geteventname.push(finalmsgeventname);
            });
        }
        if (geteventname.length > 0)
            DragDroReportUtil.BindEventMappingDetails(geteventname, Title, MessageContent, templatetype)
        else {
            var MessageBody = ReplaceCustomFields(Title);
            $("#ui_txtTitleTemplate").val(MessageBody);
            var str = PreviewSupport($("#ui_txtTitleTemplate").val());
            $(".notiftitle").html(str);
            $(".bnottitle").html(str.length);


            var MessageBody = ReplaceCustomFields(MessageContent);
            $("#ui_txtMessageTemplate").val(MessageBody);
            var str = PreviewSupport($("#ui_txtMessageTemplate").val());
            $(".notifdescript").html(str);
            $(".bwnotmess").html(str.length);
            HidePageLoading();
        };

    },
    Getdistincturleventname: function (MessageContent) {

        ShowPageLoading();
        geteventname = [];
        let regex = /\{{.*?}\}/gi;
        for (let i = 0; i < MessageContent.length; i++) {
            let matches = MessageContent[i].UrlContent.match(regex);
            if (matches != null) {
                matches.forEach(function (m) {
                    let splitedeventdata = m.replace("{{*", "").replace("}}").split('~');
                    let finaleventname = splitedeventdata[0].replace("[", "").replace("]", "");

                    geteventname.push(finaleventname);
                });
            }
        }

        //if (geteventname.length > 0)
        //  /*  DragDroReportUtil.BindUrlEventMappingDetails(geteventname);*/


    },
    BindEventMappingDetails: function (geteventname, Title, MessageContent, templatetype) {
        //customeventFieldList = [];
        ShowPageLoading();
        async: false,
            $(".popupcontainer").removeClass("hideDiv");
        $(".popuptitlwrp h6").text("Event Extra Fields Properties");



        $.ajax({
            url: "/CustomEvents/CustomEventsOverview/GetEventExtraFieldDataForDragDrop",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'customEventOverViewId': 0, 'fromDateTime': null, 'toDateTime': null, 'contactid': 0, 'EventNames': geteventname }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var a = JSLINQ(response).Distinct(function (item) { return item.EventName }).items

                for (var i = 0; i < a.length; i++) {
                    var b = JSLINQ(response).Where(function () { return (this.EventName == a[i]); });
                    var eachcolumn = []
                    eachcolumn.push(b.items[0].EventName);
                    for (var j = 0; j < b.items.length; j++) {
                        eachcolumn.push(b.items[j].FieldName)
                    }
                    customeventFieldList.push(eachcolumn);
                    if (templatetype == 'Sms') {
                        var MessageBody = ReplaceCustomFields(MessageContent);
                        $("#ui_txtMessageTemplate").val(MessageBody);

                        calculatelength($("#ui_txtMessageTemplate").val(), "N");
                        //var str = PreviewSupport($("#ui_txtMessageTemplate").val());
                        //$(".notifdescript").html(str);
                        //$(".bwnotmess").html(str.length);
                        HidePageLoading();
                    }
                    if (templatetype == 'Whatsapp') {
                        var MessageBody = ReplaceCustomFields(MessageContent);
                        ddldata = MessageBody;


                        HidePageLoading();
                    }
                    else {
                        var MessageBody = ReplaceCustomFields(Title);
                        $("#ui_txtTitleTemplate").val(MessageBody);
                        var str = PreviewSupport($("#ui_txtTitleTemplate").val());
                        $(".notiftitle").html(str);
                        $(".bnottitle").html(str.length);

                        var MessageBody = ReplaceCustomFields(MessageContent);
                        $("#ui_txtMessageTemplate").val(MessageBody);
                        var str = PreviewSupport($("#ui_txtMessageTemplate").val());
                        $(".notifdescript").html(str);
                        $(".bwnotmess").html(str.length);
                        HidePageLoading();
                    }
                }


            },
            error: ShowAjaxError
        });
    },
    BindUrlEventMappingDetails: function (TemplateType) {
        //customeventFieldList = [];
        ShowPageLoading();
        async: true,
            //    $(".popupcontainer").removeClass("hideDiv");
            //$(".popuptitlwrp h6").text("Event Extra Fields Properties");



            $.ajax({
                url: "/CustomEvents/CustomEventsOverview/GetAllEventExtraFieldDataForDragDrop",
                type: 'POST',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'customEventOverViewId': 0, 'fromDateTime': null, 'toDateTime': null, 'contactid': 0 }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    var a = JSLINQ(response).Distinct(function (item) { return item.EventName }).items

                    for (var i = 0; i < a.length; i++) {
                        var b = JSLINQ(response).Where(function () { return (this.EventName == a[i]); });
                        var eachcolumn = []
                        eachcolumn.push(b.items[0].EventName);
                        if (TemplateType == 'Email') {
                            for (var j = 0; j < b.items.length; j++) {
                                eachcolumn.push(b.items[j].FieldName)

                                var CustomEventTag = { name: '', value: '' };
                                CustomEventTag.name = b.items[0].EventName + "_" + b.items[j].FieldName;

                                CustomEventTag.value = "{{*[" + b.items[0].EventName + "]~[" + b.items[j].FieldName + "]~[TOP3.DESC]~[fallbackdata]*}}";
                                ContactMergeTagList.push(CustomEventTag);

                            }
                        }
                        else {
                            for (var j = 0; j < b.items.length; j++) {
                                eachcolumn.push(b.items[j].FieldName)

                            }
                        }

                        customeventFieldList.push(eachcolumn);

                        HidePageLoading();
                    }


                },
                error: ShowAjaxError
            });
    },
    Getlmscustomfields: function () {
        Lmscustomfielddetailstagging = [];
        $("#drplmsFields_0").empty();
        $.ajax({
            url: "/Prospect/Leads/GetLMSCustomFields",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {

                if (response != undefined || response != null) {
                    $.each(response, function (i) {
                        Lmscustomfielddetailstagging.push($(this)[0].FieldDisplayName);
                    
                    });
                  
                    TaggingLmsCustomFields = response;
                    
                }
                 
            },
            error: ShowAjaxError
        });
    },
};


function ReplaceCustomFields(MessageBody) {
    for (var i = 0; i < customFieldList.length; i++) {
        if (MessageBody.toLowerCase().indexOf(("<!--CustomField" + (i + 1) + "-->").toLowerCase()) > -1) {
            var regExp = new RegExp("<!--CustomField" + (i + 1) + "-->", "ig");  // regex pattern string
            MessageBody = MessageBody.replace(regExp, "[{*" + customFieldList[i] + "*}]");
        }
        if (MessageBody.toLowerCase().indexOf(("[{*CustomField" + (i + 1) + "~").toLowerCase()) > -1) {
            var regExp = "[{*CustomField" + (i + 1) + "~";  // regex pattern string
            MessageBody = MessageBody.replace(regExp, "[{*" + customFieldList[i] + "~");
        }
        if (MessageBody.toLowerCase().indexOf(("[{*CustomField" + (i + 1) + "*}]").toLowerCase()) > -1) {
            var regExp = new RegExp("\\[\\{\\*CustomField" + (i + 1) + "\\*\\}\\]", "ig");  // regex pattern string
            MessageBody = MessageBody.replace(regExp, "[{*" + customFieldList[i] + "*}]");
        }
        if (MessageBody.toLowerCase().indexOf(("[{*CustomField" + (i + 1) + "&").toLowerCase()) > -1) {
            var regExp = new RegExp("\\[\\{\\*CustomField" + (i + 1) + "&", "ig");  // regex pattern string
            MessageBody = MessageBody.replace(regExp, "[{*" + customFieldList[i] + "&");
        }
        if (MessageBody.toLowerCase().indexOf(("&CustomField" + (i + 1) + "~").toLowerCase()) > -1) {
            var regExp = new RegExp("\\&\\CustomField" + (i + 1) + "~", "ig");  // regex pattern string
            MessageBody = MessageBody.replace(regExp, "&" + customFieldList[i] + "~");
        }
        if (MessageBody.toLowerCase().indexOf(("&CustomField" + (i + 1) + "*}]").toLowerCase()) > -1) {
            var regExp = new RegExp("&CustomField" + (i + 1) + "\\*\\}\\]", "ig");  // regex pattern string
            MessageBody = MessageBody.replace(regExp, "&" + customFieldList[i] + "*}]");
        }
        if (MessageBody.toLowerCase().indexOf(("{{[CustomField" + (i + 1) + "*}]").toLowerCase()) > -1) {
            var regExp = new RegExp("\\{\\{\\[CustomField" + (i + 1) + "\\]\\}\\}", "ig");  // regex pattern string
            MessageBody = MessageBody.replace(regExp, "[{*" + customFieldList[i] + "*}]");
        }
    }
    for (var i = 0; i < Lmscustomfielddetailstagging.length; i++) {
        if (MessageBody.toLowerCase().indexOf(("<!--LmsCustomField" + (i + 1) + "-->").toLowerCase()) > -1) {
            var regExp = new RegExp("<!--LmsCustomField" + (i + 1) + "-->", "ig");  // regex pattern string
            MessageBody = MessageBody.replace(regExp, "[{*" + Lmscustomfielddetailstagging[i+3] + "*}]");
        }
        if (MessageBody.toLowerCase().indexOf(("[{*LmsCustomField" + (i + 1) + "~").toLowerCase()) > -1) {
            var regExp = "[{*LmsCustomField" + (i + 1) + "~";  // regex pattern string
            MessageBody = MessageBody.replace(regExp, "[{*" + Lmscustomfielddetailstagging[i + 3] + "~");
        }
        if (MessageBody.toLowerCase().indexOf(("[{*LmsCustomField" + (i + 1) + "*}]").toLowerCase()) > -1) {
            var regExp = new RegExp("\\[\\{\\*LmsCustomField" + (i + 1) + "\\*\\}\\]", "ig");  // regex pattern string
            MessageBody = MessageBody.replace(regExp, "[{*" + Lmscustomfielddetailstagging[i + 3] + "*}]");
        }
        if (MessageBody.toLowerCase().indexOf(("[{*LmsCustomField" + (i + 1) + "&").toLowerCase()) > -1) {
            var regExp = new RegExp("\\[\\{\\*LmsCustomField" + (i + 1) + "&", "ig");  // regex pattern string
            MessageBody = MessageBody.replace(regExp, "[{*" + Lmscustomfielddetailstagging[i + 3] + "&");
        }
        if (MessageBody.toLowerCase().indexOf(("&LmsCustomField" + (i + 1) + "*}]").toLowerCase()) > -1) {
            var regExp = new RegExp("&LmsCustomField" + (i + 1) + "\\*\\}\\]", "ig");  // regex pattern string
            MessageBody = MessageBody.replace(regExp, "&" + Lmscustomfielddetailstagging[i + 3] + "*}]");
        }

        if (MessageBody.toLowerCase().indexOf(("{{[LmsCustomField" + (i + 1) + "*}]").toLowerCase()) > -1) {
            var regExp = new RegExp("\\{\\{\\[LmsCustomField" + (i + 1) + "\\]\\}\\}", "ig");  // regex pattern string
            MessageBody = MessageBody.replace(regExp, "[{*" + Lmscustomfielddetailstagging[i + 3] + "*}]");
        }
    }
    var MessageBodysplit = MessageBody.split('{{*');
    for (var i = 0; i < customeventFieldList.length; i++) {
        for (var j = 1; j < customeventFieldList[i].length; j++) {
            if (MessageBodysplit.length == 1) {
                if (MessageBodysplit[0].toLowerCase().indexOf("[" + customeventFieldList[i][0].toLowerCase() + "]~[") > -1 || MessageBodysplit[0].toLowerCase().indexOf("&" + customeventFieldList[i][0].toLowerCase() + "]~[") > -1) {
                    if (MessageBodysplit[0].toLowerCase().indexOf(("]~[EventData" + (j) + "]~[").toLowerCase()) > -1) {
                        var regExp = new RegExp("\\]\\~\\[EventData" + (j) + "\\]\\~\\[", "ig");  // regex pattern string
                        MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "]~[" + customeventFieldList[i][j] + "]~[");
                    }
                    if (MessageBodysplit[0].toLowerCase().indexOf(("]~[EventData" + (j) + "&").toLowerCase()) > -1) {
                        var regExp = new RegExp("\\]\\~\\[EventData" + (j) + "&", "ig");  // regex pattern string
                        MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "]~[" + customeventFieldList[i][j] + "&");
                    }
                    if (MessageBodysplit[0].toLowerCase().indexOf(("&EventData" + (j) + "]~[").toLowerCase()) > -1) {
                        var regExp = new RegExp("&EventData" + (j) + "\\]\\~\\[", "ig");  // regex pattern string
                        MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "&" + customeventFieldList[i][j] + "]~[");
                    }
                    if (MessageBodysplit[0].toLowerCase().indexOf(("&EventData" + (j) + "~").toLowerCase()) > -1) {
                        var regExp = new RegExp("&EventData" + (j) + "~", "ig");  // regex pattern string
                        MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "&" + customeventFieldList[i][j] + "~");
                    }
                    if (MessageBodysplit[0].toLowerCase().indexOf(("]~[EventData" + (j) + "(").toLowerCase()) > -1) {
                        var regExp = "]~[EventData" + (j) + "(";  // regex pattern string
                        MessageBodysplit[0] = MessageBodysplit[m].replace(regExp, "]~[" + customeventFieldList[i][j] + "(");
                    }
                    if (MessageBodysplit[0].toLowerCase().indexOf(("]~[EventData" + (j) + "~").toLowerCase()) > -1) {
                        var regExp = new RegExp("\\]\\~\\[EventData" + (j) + "~", "ig");  // regex pattern string
                        MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "]~[" + customeventFieldList[i][j] + "~");
                    }
                }
            }
            else {
                for (var m = 0; m < MessageBodysplit.length; m++) {
                    if (MessageBodysplit[m].toLowerCase().indexOf("[" + customeventFieldList[i][0].toLowerCase() + "]~[") > -1 || MessageBodysplit[0].toLowerCase().indexOf("&" + customeventFieldList[i][0].toLowerCase() + "]~[") > -1)  {
                        if (MessageBodysplit[m].toLowerCase().indexOf(("]~[EventData" + (j) + "]~[").toLowerCase()) > -1) {
                            var regExp = new RegExp("\\]\\~\\[EventData" + (j) + "\\]\\~\\[", "ig");  // regex pattern string
                            MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "]~[" + customeventFieldList[i][j] + "]~[");
                        }
                        if (MessageBodysplit[m].toLowerCase().indexOf(("]~[EventData" + (j) + "&").toLowerCase()) > -1) {
                            var regExp = new RegExp("\\]\\~\\[EventData" + (j) + "&", "ig");  // regex pattern string
                            MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "]~[" + customeventFieldList[i][j] + "&");
                        }
                        if (MessageBodysplit[m].toLowerCase().indexOf(("&EventData" + (j) + "]~[").toLowerCase()) > -1) {
                            var regExp = new RegExp("&EventData" + (j) + "\\]\\~\\[", "ig");  // regex pattern string
                            MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "&" + customeventFieldList[i][j] + "]~[");
                        }
                        if (MessageBodysplit[m].toLowerCase().indexOf(("]~[EventData" + (j) + "(").toLowerCase()) > -1) {
                            var regExp = "]~[EventData" + (j) + "(";  // regex pattern string
                            MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "]~[" + customeventFieldList[i][j] + "(");
                        }
                        if (MessageBodysplit[m].toLowerCase().indexOf(("&EventData" + (j) + "~").toLowerCase()) > -1) {
                            var regExp = new RegExp("&EventData" + (j) + "~", "ig");  // regex pattern string
                            MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "&" + customeventFieldList[i][j] + "~");
                        }
                        if (MessageBodysplit[m].toLowerCase().indexOf(("]~[EventData" + (j) + "~").toLowerCase()) > -1) {
                            var regExp = new RegExp("\\]\\~\\[EventData" + (j) + "~", "ig");  // regex pattern string
                            MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "]~[" + customeventFieldList[i][j] + "~");
                        }
                    }
                }
            }

        }
    }
    if (MessageBodysplit.length > 1)
        MessageBody = MessageBodysplit.join("{{*");

    return MessageBody;

}


function AppendCustomField(MessageBody) {
    for (var i = 0; i < customFieldList.length; i++) {
        if (MessageBody.toLowerCase().indexOf("<!--" + customFieldList[i].toLowerCase() + "-->") > -1) {
            var regExp = new RegExp("<!--" + customFieldList[i] + "-->", "ig");  // regex pattern string
            MessageBody = MessageBody.replace(regExp, "[{*CustomField" + (i + 1) + "*}]");
        }

        if (MessageBody.toLowerCase().indexOf("[{*" + customFieldList[i].toLowerCase() + "*}]") > -1) {
            var regExp = new RegExp("\\[\\{\\*" + customFieldList[i] + "\\*\\}\\]", "ig");  // regex pattern string
            MessageBody = MessageBody.replace(regExp, "[{*CustomField" + (i + 1) + "*}]");
        }
        if (MessageBody.toLowerCase().indexOf("[{*" + customFieldList[i].toLowerCase() + "&") > -1 ) {
            var regExp = new RegExp("\\[\\{\\*" + customFieldList[i] + "&", "ig");  // regex pattern string
            MessageBody = MessageBody.replace(regExp, "[{*CustomField" + (i + 1) + "&");
        }
        if (MessageBody.toLowerCase().indexOf("&" + customFieldList[i].toLowerCase() + "*}]") > -1 ) {
            var regExp = new RegExp("&" + customFieldList[i] + "\\*\\}\\]", "ig");  // regex pattern string
            MessageBody = MessageBody.replace(regExp, "&CustomField" + (i + 1) + "*}]");
        }
        if (MessageBody.toLowerCase().indexOf("[{*" + customFieldList[i].toLowerCase() + "~") > -1) {
            var regExp = "[{*" + customFieldList[i] + "~";  // regex pattern string
            MessageBody = MessageBody.replace(regExp, "[{*CustomField" + (i + 1) + "~");
        }
        if (MessageBody.toLowerCase().indexOf("&" + customFieldList[i].toLowerCase() + "~") > -1) {
            var regExp = "&" + customFieldList[i] + "~";  // regex pattern string
            MessageBody = MessageBody.replace(regExp, "&CustomField" + (i + 1) + "~");
        }
    }
    for (var i = 0; i < Lmscustomfielddetailstagging.length; i++) {
        if (MessageBody.toLowerCase().indexOf("<!--" + Lmscustomfielddetailstagging[i].toLowerCase() + "-->") > -1) {
            var regExp = new RegExp("<!--" + Lmscustomfielddetailstagging[i] + "-->", "ig");  // regex pattern string
            if (Lmscustomfielddetailstagging[i].toLowerCase() != 'primarypublisher' && Lmscustomfielddetailstagging[i].toLowerCase() != 'publisher' && Lmscustomfielddetailstagging[i].toLowerCase() != 'allpublisher')
                MessageBody = MessageBody.replace(regExp, "[{*LmsCustomField" + (Lmscustomfielddetailstagging[i].match(/\d+/)[0]) + "*}]");
        }

        if (MessageBody.toLowerCase().indexOf("[{*" + Lmscustomfielddetailstagging[i].toLowerCase() + "*}]") > -1) {
            var regExp = new RegExp("\\[\\{\\*" + Lmscustomfielddetailstagging[i] + "\\*\\}\\]", "ig");  // regex pattern string
            if (Lmscustomfielddetailstagging[i].toLowerCase() != 'primarypublisher' && Lmscustomfielddetailstagging[i].toLowerCase() != 'publisher' && Lmscustomfielddetailstagging[i].toLowerCase() != 'allpublisher')
                MessageBody = MessageBody.replace(regExp, "[{*LmsCustomField" + (Lmscustomfielddetailstagging[i].match(/\d+/)[0]) + "*}]");
        }
        if (MessageBody.toLowerCase().indexOf("[{*" + Lmscustomfielddetailstagging[i].toLowerCase() + "~") > -1) {
            var regExp = "[{*" + Lmscustomfielddetailstagging[i] + "~";  // regex pattern string
            if (Lmscustomfielddetailstagging[i].toLowerCase() != 'primarypublisher' && Lmscustomfielddetailstagging[i].toLowerCase() != 'publisher' && Lmscustomfielddetailstagging[i].toLowerCase() != 'allpublisher')
                MessageBody = MessageBody.replace(regExp, "[{*LmsCustomField" + (Lmscustomfielddetailstagging[i].match(/\d+/)[0]) + "~");
        }

    }
    var MessageBodysplit = MessageBody.split('{{*');
    for (var i = 0; i < customeventFieldList.length; i++) {
        for (var j = 1; j < customeventFieldList[i].length; j++) {
            if (MessageBodysplit.length == 1) {
                if (MessageBodysplit[0].toLowerCase().indexOf("[" + customeventFieldList[i][0].toLowerCase() + "]~[") > -1 || MessageBodysplit[0].toLowerCase().indexOf("&" + customeventFieldList[i][0].toLowerCase() + "]~[") > -1 ) {
                    if (MessageBodysplit[0].toLowerCase().indexOf("]~[" + customeventFieldList[i][j].toLowerCase() + "]~[") > -1) {

                        var regExp = new RegExp("\\]\\~\\[" + customeventFieldList[i][j] + "\\]\\~\\[", "ig");  // regex pattern string
                        MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "]~[EventData" + (j) + "]~[");
                    }
                    if (MessageBodysplit[0].toLowerCase().indexOf("]~[" + customeventFieldList[i][j].toLowerCase() + "&") > -1) {

                        var regExp = new RegExp("\\]\\~\\[" + customeventFieldList[i][j] + "&", "ig");  // regex pattern string
                        MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "]~[EventData" + (j) + "&");
                    }
                    if (MessageBodysplit[0].toLowerCase().indexOf("&" + customeventFieldList[i][j].toLowerCase() + "]~[") > -1) {

                        var regExp = new RegExp("&" + customeventFieldList[i][j] + "\\]\\~\\[", "ig");  // regex pattern string
                        MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "&EventData" + (j) + "]~[");
                    }
                    if (MessageBodysplit[0].toLowerCase().indexOf("&" + customeventFieldList[i][j].toLowerCase() + "~") > -1) {

                        var regExp = new RegExp("&" + customeventFieldList[i][j] + "~", "ig");  // regex pattern string
                        MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "&EventData" + (j) + "~");
                    }
                    if (MessageBodysplit[0].toLowerCase().indexOf("]~[" + customeventFieldList[i][j].toLowerCase() + "(") > -1) {
                        var regExp = "]~[" + customeventFieldList[i][j] + "(";  // regex pattern string
                        MessageBodysplit[0] = MessageBodysplit[m].replace(regExp, "]~[EventData" + (j) + "(");
                    }
                    if (MessageBodysplit[0].toLowerCase().indexOf("]~[" + customeventFieldList[i][j].toLowerCase() + "~") > -1) {

                        var regExp = new RegExp("\\]\\~\\[" + customeventFieldList[i][j] + "~", "ig");  // regex pattern string
                        MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "]~[EventData" + (j) + "~");
                    }

                }
            }
            else {
                for (var m = 0; m < MessageBodysplit.length; m++) {
                    if (MessageBodysplit[m].toLowerCase().indexOf("[" + customeventFieldList[i][0].toLowerCase() + "]~[") > -1 || MessageBodysplit[m].toLowerCase().indexOf("&" + customeventFieldList[i][0].toLowerCase() + "]~[") > -1 ) {
                        if (MessageBodysplit[m].toLowerCase().indexOf("]~[" + customeventFieldList[i][j].toLowerCase() + "]~[") > -1) {
                            var regExp = new RegExp("\\]\\~\\[" + customeventFieldList[i][j] + "\\]\\~\\[", "ig");  // regex pattern string
                            MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "]~[EventData" + (j) + "]~[");
                        }
                        if (MessageBodysplit[m].toLowerCase().indexOf("]~[" + customeventFieldList[i][j].toLowerCase() + "&") > -1) {
                            var regExp = new RegExp("\\]\\~\\[" + customeventFieldList[i][j] + "&", "ig");  // regex pattern string
                            MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "]~[EventData" + (j) + "&");
                        }
                        if (MessageBodysplit[m].toLowerCase().indexOf("&" + customeventFieldList[i][j].toLowerCase() + "]~[") > -1) {
                            var regExp = new RegExp("&" + customeventFieldList[i][j] + "\\]\\~\\[", "ig");  // regex pattern string
                            MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "&EventData" + (j) + "]~[");
                        }
                        if (MessageBodysplit[m].toLowerCase().indexOf("&" + customeventFieldList[i][j].toLowerCase() + "~") > -1) {

                            var regExp = new RegExp("&" + customeventFieldList[i][j] + "~", "ig");  // regex pattern string
                            MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "&EventData" + (j) + "~");
                        }
                        if (MessageBodysplit[m].toLowerCase().indexOf("]~[" + customeventFieldList[i][j].toLowerCase() + "(") > -1) {
                            var regExp = "]~[" + customeventFieldList[i][j] + "(";  // regex pattern string
                            MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "]~[EventData" + (j) + "(");
                        }
                        if (MessageBodysplit[m].toLowerCase().indexOf("]~[" + customeventFieldList[i][j].toLowerCase() + "~") > -1) {

                            var regExp = new RegExp("\\]\\~\\[" + customeventFieldList[i][j] + "~", "ig");  // regex pattern string
                            MessageBodysplit[m] = MessageBodysplit[m].replace(regExp, "]~[EventData" + (j) + "~");
                        }
                    }
                }
            }
        }
    }
    if (MessageBodysplit.length > 1)
        MessageBody = MessageBodysplit.join("{{*");

    return MessageBody;
}

$(document).on('change', '#eventnameconditionalsubject', function () {
    eventname = '';
    eventname = this.value;
    var customEventOverViewId = this.options[this.selectedIndex].getAttribute('attr_id');


    $('[id^="eventitems"]').empty();
    $('[id^="eventitems"]').append('<option value="Select">Select Event Items</option>');
    DragDroReportUtil.EventMappingDetails(customEventOverViewId, eventname);
});