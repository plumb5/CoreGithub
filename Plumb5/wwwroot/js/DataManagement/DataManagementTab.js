$(document).ready(function () {
    //Reports Tab
   if (window.location.href.toString().toLowerCase().indexOf("reports/dashboard") > 0) {
        $("#Tab0").css('display', 'block');
        $("#lnkdashboard").css('background-image', 'url(' + cdnpath + 'DataManagement/dtbbg.png)');
    }

    if (window.location.href.toString().toLowerCase().indexOf("alldashboard") > 0) {
        $("#Tab0").css('display', 'block');
        $("#lnkAllDashboard").css('background-image', 'url(' + cdnpath + 'DataManagement/dtbbg.png)');
    }
    if (window.location.href.toString().toLowerCase().indexOf("createnew") > 0) {
        $("#Tab0").css('display', 'block');
        $("#lnkcreatedash").css('background-image', 'url(' + cdnpath + 'DataManagement/dtbbg.png)');
    }
    if (window.location.href.toString().toLowerCase().indexOf("reports/managedashboard") > 0) {
        $("#Tab0").css('display', 'block'); 
    }
    if (window.location.href.toString().toLowerCase().indexOf("myreports") > 0) {
        $("#Tab0").css('display', 'block');
        $("#lnkmyreports").css('background-image', 'url(' + cdnpath + 'DataManagement/dtbbg.png)');
    }

    //Data Import Tab
    if (window.location.href.toString().toLowerCase().indexOf("importfile") > 0) {
        $("#Tab1").css('display', 'block');
        $("#lnkimport").css('background-image', 'url(' + cdnpath + 'DataManagement/dtbbg.png)');
    }
    if (window.location.href.toString().toLowerCase().indexOf("myfiles") > 0) {
        $("#Tab1").css('display', 'block');
        $("#lnkmyfiles").css('background-image', 'url(' + cdnpath + 'DataManagement/dtbbg.png)');
    }
    $("#firstpane p.menu_head").click(function () {
        $(this).css({}).next("div.menu_body").slideToggle(300).siblings("div.menu_body").slideUp("slow");
       // $(this).css({ backgroundImage: "url(" + cdnpath + "down.png)" }).next("div.menu_body").slideToggle(300).siblings("div.menu_body").slideUp("slow");
    });
    //Tagging Tab
    if (window.location.href.toString().toLowerCase().indexOf("tagginglist") > 0) {
        $("#Tab2").css('display', 'block');
        $("#lnktagginglist").css('background-image', 'url(' + cdnpath + 'DataManagement/dtbbg.png)');
    }
    if (window.location.href.toString().toLowerCase().indexOf("createtagtable?") > 0) {
        $("#Tab2").css('display', 'block');
        $("#lnktagginglist").css('background-image', 'url(' + cdnpath + 'DataManagement/dtbbg.png)');
    }
    else if (window.location.href.toString().toLowerCase().indexOf("createtagtable") > 0) {
        $("#Tab2").css('display', 'block');
        $("#lnkmanagetag").css('background-image', 'url(' + cdnpath + 'DataManagement/dtbbg.png)');
    }
    //Scoring Tab
    if (window.location.href.toString().toLowerCase().indexOf("scoring/createsimplescore?") > 0) {
        $("#Tab3").css('display', 'block');
        $("#lnksimplescoring").css('background-image', 'url(' + cdnpath + 'DataManagement/dtbbg.png)');
    }
    else if (window.location.href.toString().toLowerCase().indexOf("scoring/createsimplescore") > 0) {
        $("#Tab3").css('display', 'block');
        $("#lnkcreatesimplescore").css('background-image', 'url(' + cdnpath + 'DataManagement/dtbbg.png)');
    }
    if (window.location.href.toString().toLowerCase().indexOf("scoring/simple") > 0) {
        $("#Tab3").css('display', 'block');
        $("#lnksimplescoring").css('background-image', 'url(' + cdnpath + 'DataManagement/dtbbg.png)');
    }
    if (window.location.href.toString().toLowerCase().indexOf("scoring/nested") > 0) {
        $("#Tab3").css('display', 'block');
        $("#lnknestedscoring").css('background-image', 'url(' + cdnpath + 'DataManagement/dtbbg.png)');
    }
    if (window.location.href.toString().toLowerCase().indexOf("scoring/createnestedscore?") > 0) {
        $("#Tab3").css('display', 'block');
        $("#lnknestedscoring").css('background-image', 'url(' + cdnpath + 'DataManagement/dtbbg.png)');
    }
    else if (window.location.href.toString().toLowerCase().indexOf("scoring/createnestedscore") > 0) {
        $("#Tab3").css('display', 'block');
        $("#lnkcreatenestedscore").css('background-image', 'url(' + cdnpath + 'DataManagement/dtbbg.png)');
    }
    //Groups Tab
    if (window.location.href.toString().toLowerCase().indexOf("creategroup?") > 0) {
        $("#Tab4").css('display', 'block');
        $("#lnkmanagegrps").css('background-image', 'url(' + cdnpath + 'DataManagement/dtbbg.png)');
    }
    else if (window.location.href.toString().toLowerCase().indexOf("creategroup") > 0) {
        $("#Tab4").css('display', 'block');
        $("#lnkcreategrp").css('background-image', 'url(' + cdnpath + 'DataManagement/dtbbg.png)');
    }
    else if (window.location.href.toString().toLowerCase().indexOf("Group/AutoGroup") > 0) {
        $("#Tab4").css('display', 'block');
        $("#lnkcreategrpcustomer").css('background-image', 'url(' + cdnpath + 'DataManagement/dtbbg.png)');
    }
    else if (window.location.href.toString().toLowerCase().indexOf("Group/CustomerSegmentSchedule") > 0) {
        $("#Tab4").css('display', 'block');
        $("#lnkcreategrpschedule").css('background-image', 'url(' + cdnpath + 'DataManagement/dtbbg.png)');
    }
    if (window.location.href.toString().toLowerCase().indexOf("managegroup") > 0) {
        $("#Tab4").css('display', 'block');
        $("#lnkmanagegrps").css('background-image', 'url(' + cdnpath + 'DataManagement/dtbbg.png)');
    }

});

//show and hide left menu..........

$(document).ready(function () {
    $("#dvExpend").click(function (event) {
        if ($('#dvMainMenu').css('display') == 'block') {
            $("#dvExpend").css('left', '0px');
            $('#dvMainMenu').hide('slow');
        }
        else {

            $('#dvMainMenu').show('slow');
            $('#dvContact').hide('slow');

            $('#dvExpend').animate({ left: '190px' }, { duration: 600 });
        }
    });

});

var moveMenu = function () {
    var windowPosition = $(window).scrollTop();
    var dvExpend = $("#dvExpend");
    if (windowPosition > 128) {
        dvExpend.css({ marginTop: "0px" });
    }
};
document.onscroll = function () {
    $("#dvExpend").css({ 'height': $("#dvControlPanel").height() + 0 + 'px' });

    //error message
    if ($(window).scrollTop() == 0) {
        $(".MsgStyle").css({ 'position': '' })
        $(".MsgStyle").css({ 'top': '57px' })
    }
    else {
        $(".MsgStyle").css({ 'position': 'fixed' })
        $(".MsgStyle").css({ 'top': '0px' })
    }
};
//...................


//custom filter for each page ......

getCustomFilter = function () {

    var filter = "<b>List of cafe :</b>" +
           "<div style='height:10px;'>&nbsp;</div>" +
            "<span style='margin-top:15px;text-transform:uppercase'>cafemyshop</span> <img title='Online' src='" + cdnpath + "Community/Online.ico' /> <img alt='' title='Default Report' src='" + cdnpath + "Community/favorite.gif' style='height: 12px;'/>" +
            "<br/>" +
            "Manage | Delete | Online" +
            "<br/>" +
            "<div style='height:10px;'>&nbsp;</div>" +
            "<span style='margin-top:15px;text-transform:uppercase'>cafemyshop</span><img title='Online' src='" + cdnpath + "Community/Offline.ico' />" +
            "<br/>" +
            "Manage | Delete | Online" +
            "<div style='height:15px;'>&nbsp;</div>" +
            "Create New";
    return filter;
};

var pathname1 = window.location.pathname;
function ShowErrorMessage(errMessage) {
    if (pathname1.indexOf("Group") > 0) {

        $(".MsgStyle").remove();
        var messageDiv = document.createElement("div");
        messageDiv.className = "MsgStyle";
        messageDiv.style.display = "none";
        messageDiv.style.top = "57px";
        messageDiv.innerHTML = errMessage + '<span class="MsgStyleClose" onclick="RemoveShowErrorMessage();">X</span>';
        document.body.appendChild(messageDiv);
        ScrollShowErrorMessage();

        $(".MsgStyle").fadeIn(500).delay(5000).fadeOut(1000, function () {
            RemoveShowErrorMessage();
        });


    } else {
        divmsg.innerHTML = errMessage + '<span style="float:right;cursor:pointer;padding-right: 38%;" onclick=javascript:$("#divmsg").hide()>X</span>';

        messageDiv = $(".MsgStyle");
        //messageDiv.fadeIn(500);
        messageDiv.fadeIn(500).delay(5000).fadeOut(1000, function () {
        });

    }
}
RemoveShowErrorMessage = function () {
    $(".MsgStyle").remove();
};

ScrollShowErrorMessage = function () {
    if ($(".MsgStyle").length > 0) {
        if ($(window).scrollTop() == 0) {
            $(".MsgStyle").css({ 'position': 'fixed' })
            $(".MsgStyle").css({ 'top': '57px' })
        }
        else {
            $(".MsgStyle").css({ 'position': 'fixed' })
            $(".MsgStyle").css({ 'top': '0px' })
        }
    }
}



//function ShowErrorMessage(errMessage) {

//    //divmsg.innerHTML = errMessage + '<span style="float:right;cursor:pointer;padding-right: 8px;" onclick=javascript:$("#divmsg").hide()>X</span>';
//    divmsg.innerHTML = errMessage + '<span style="float:right;cursor:pointer;padding-right: 38%;" onclick=javascript:$("#divmsg").hide()>X</span>';

//    messageDiv = $(".MsgStyle");
//    //messageDiv.fadeIn(500);
//    messageDiv.fadeIn(500).delay(5000).fadeOut(1000, function () {
//    });
//}



//Print and export..................

getPrintExport = function (getPageName, recordsperPage) {
    var record = "";
    if (recordsperPage != null && recordsperPage == 1) {///Records per page

        record = "<div class='chk' style='float: left; margin-left: 0px;margin-top: 0px;'>Records per Page</span><select class='chk' id='drp_RecordsPerPage' onchange='fn_ChangeRecordsPerPage()'>" +
            "<option value='20' selected='selected'>20</option>" +
            "<option value='30'>30</option>" +
            "<option value='40'>40</option>" +
            "<option value='50'>50</option>" +
            "<option value='100'>100</option>" +
             "<option value='All'>All</option>" +
        "</select></div>";
    }

    var PrintExport = record;
    return PrintExport;
};

function DeleteConfirmation(key, FileName) {
  
    $("#dvDeletePanel").remove();
    var deletemsg = '<div class="bgShadedDiv" style="display: block; "></div><div class="dvdeletepopup" style="position:fixed;"><div class="plumb-frm" style="max-width: 45%;"><div style="float: left;" class="title">Delete Confirmation</div>' +
        '<div style="padding-top: 35px;">These items will be permanently deleted and cannot be recovered. Are you sure?<br /><br />' +
         '<input id="ui_create" type="button" class="button" value="Delete" onclick="ConfirmedDelete(' + key + ')" /><span>&nbsp;</span>' +
         '<input id="ui_cancel" type="button" class="button" value="cancel" onclick="ConfirmedCancel()" /></div></div></div>';

    var messageDiv = document.createElement("div");
    messageDiv.id = "dvDeletePanel";
    messageDiv.innerHTML = deletemsg;
    document.body.appendChild(messageDiv);
}
function DeleteConfirmationImportExceldelete(key, FileName) {

    $("#dvDeletePanel").remove();
    var deletemsg = '<div class="bgShadedDiv" style="display: block; "></div><div class="dvdeletepopup" style="position:fixed;"><div class="plumb-frm" style="max-width: 45%;"><div style="float: left;" class="title">Delete Confirmation</div>' +
        '<div style="padding-top: 35px;">Deletion of this imported file will result in the deletion of tagged files,scoring files,segments,customer segments,groups,schedules and dashboards dependent on this imported file. Click on "OK" button to delete or "Cancel" button to terminate this deletion.<br /><br />' +
         '<input id="ui_create" type="button" class="button" value="Delete" onclick="ConfirmedDelete(' + key + ')" /><span>&nbsp;</span>' +
         '<input id="ui_cancel" type="button" class="button" value="cancel" onclick="ConfirmedCancel()" /></div></div></div>';

    var messageDiv = document.createElement("div");
    messageDiv.id = "dvDeletePanel";
    messageDiv.innerHTML = deletemsg;
    document.body.appendChild(messageDiv);
}

function DeleteConfirmationtagging(key, FileName) {
    $("#dvDeletePanel").remove();
    var deletemsg = '<div class="bgShadedDiv" style="display: block; "></div><div class="dvdeletepopup" style="position:fixed;"><div class="plumb-frm" style="max-width: 45%;"><div style="float: left;" class="title">Delete Confirmation</div>' +
        '<div style="padding-top: 35px;">Deletion of this tagged file will result in the deletion of  scoring files,segments,customer segments,groups,schedules and dashboards dependent on this tagged file. Click on "OK" button to delete or "Cancel" button to terminate this deletion.<br /><br />' +
         '<input id="ui_create" type="button" class="button" value="ok" onclick="ConfirmedDelete(' + key + ')" /><span>&nbsp;</span>' +
         '<input id="ui_cancel" type="button" class="button" value="cancel" onclick="ConfirmedCancel()" /></div></div></div>';

    var messageDiv = document.createElement("div");
    messageDiv.id = "dvDeletePanel";
    messageDiv.innerHTML = deletemsg;
    document.body.appendChild(messageDiv);
}

function DeleteConfirmationimport(key, FileName) {
    $("#dvDeletePanel").remove();
    var deletemsg = '<div class="bgShadedDiv" style="display: block; "></div><div class="dvdeletepopup" style="position:fixed;"><div class="plumb-frm" style="max-width: 45%;"><div style="float: left;" class="title">Delete Confirmation</div>' +
        '<div style="padding-top: 35px;">Deletion of this datasource will result in the deletion of imported files,tagged files,scoring files,segments,customer segments,groups,schedules and dashboards dependent on this datasource. Click on "OK" button to delete or "Cancel" button to terminate this deletion.<br /><br />' +
         '<input id="ui_create" type="button" class="button" value="ok" onclick="ConfirmedDelete(' + key + ')" /><span>&nbsp;</span>' +
         '<input id="ui_cancel" type="button" class="button" value="cancel" onclick="ConfirmedCancel()" /></div></div></div>';

    var messageDiv = document.createElement("div");
    messageDiv.id = "dvDeletePanel";
    messageDiv.innerHTML = deletemsg;
    document.body.appendChild(messageDiv);
}
function DeleteConfirmationScoringsimple(key, FileName) {
    $("#dvDeletePanel").remove();
    var deletemsg = '<div class="bgShadedDiv" style="display: block; "></div><div class="dvdeletepopup" style="position:fixed;"><div class="plumb-frm" style="max-width: 45%;"><div style="float: left;" class="title">Delete Confirmation</div>' +
        '<div style="padding-top: 35px;">Deletion of this simple scoring file will result in the deletion of nested scoring files,segments,customer segments,groups,schedules and dashboards dependent on this simple scoring file. Click on "OK" button to delete or "Cancel" button to terminate this deletion. <br /><br />' +
         '<input id="ui_create" type="button" class="button" value="ok" onclick="ConfirmedDelete(' + key + ')" /><span>&nbsp;</span>' +
         '<input id="ui_cancel" type="button" class="button" value="cancel" onclick="ConfirmedCancel()" /></div></div></div>';

    var messageDiv = document.createElement("div");
    messageDiv.id = "dvDeletePanel";
    messageDiv.innerHTML = deletemsg;
    document.body.appendChild(messageDiv);
}
function DeleteConfirmationScoringnested(key, FileName) {
    $("#dvDeletePanel").remove();
    var deletemsg = '<div class="bgShadedDiv" style="display: block; "></div><div class="dvdeletepopup" style="position:fixed;"><div class="plumb-frm" style="max-width: 45%;"><div style="float: left;" class="title">Delete Confirmation</div>' +
        '<div style="padding-top: 35px;">Deletion of this nested scoring file will result in the deletion of  segments,customer segments,groups,schedules and dashboards dependent on this nested scoring file. Click on "OK" button to delete or "Cancel" button to terminate this deletion.  <br /><br />' +
         '<input id="ui_create" type="button" class="button" value="ok" onclick="ConfirmedDelete(' + key + ')" /><span>&nbsp;</span>' +
         '<input id="ui_cancel" type="button" class="button" value="cancel" onclick="ConfirmedCancel()" /></div></div></div>';

    var messageDiv = document.createElement("div");
    messageDiv.id = "dvDeletePanel";
    messageDiv.innerHTML = deletemsg;
    document.body.appendChild(messageDiv);
}
function DeleteConfirmationGroups(key, FileName) {
    $("#dvDeletePanel").remove();
    var deletemsg = '<div class="bgShadedDiv" style="display: block; "></div><div class="dvdeletepopup" style="position:fixed;"><div class="plumb-frm" style="max-width: 45%;"><div style="float: left;" class="title">Delete Confirmation</div>' +
        '<div style="padding-top: 35px;">Deletion of this segment will result in the deletion of  dashboards dependent on this segment. Click on "OK" button to delete or "Cancel" button to terminate this deletion.   <br /><br />' +
         '<input id="ui_create" type="button" class="button" value="ok" onclick="ConfirmedDelete(' + key + ')" /><span>&nbsp;</span>' +
         '<input id="ui_cancel" type="button" class="button" value="cancel" onclick="ConfirmedCancel()" /></div></div></div>';

    var messageDiv = document.createElement("div");
    messageDiv.id = "dvDeletePanel";
    messageDiv.innerHTML = deletemsg;
    document.body.appendChild(messageDiv);
}
function DeleteConfirmationGroupscustomer(key, FileName) {
    $("#dvDeletePanel").remove();
    var deletemsg = '<div class="bgShadedDiv" style="display: block; "></div><div class="dvdeletepopup" style="position:fixed;"><div class="plumb-frm" style="max-width: 45%;"><div style="float: left;" class="title">Delete Confirmation</div>' +
        '<div style="padding-top: 35px;">Deletion of this customer segment will result in the deletion of the group and schedule pertaining to this segment. Click on "OK" button to delete or "Cancel" button to terminate this deletion.<br /><br />' +
         '<input id="ui_create" type="button" class="button" value="ok" onclick="ConfirmedDelete(' + key + ')" /><span>&nbsp;</span>' +
         '<input id="ui_cancel" type="button" class="button" value="cancel" onclick="ConfirmedCancel()" /></div></div></div>';

    var messageDiv = document.createElement("div");
    messageDiv.id = "dvDeletePanel";
    messageDiv.innerHTML = deletemsg;
    document.body.appendChild(messageDiv);
}
function DeleteConfirmationAllDashboard(key, FileName) {
    $("#dvDeletePanel").remove();
    var deletemsg = '<div class="bgShadedDiv" style="display: block; "></div><div class="dvdeletepopup" style="position:fixed;"><div class="plumb-frm" style="max-width: 45%;"><div style="float: left;" class="title">Delete Confirmation</div>' +
        '<div style="padding-top: 35px;">Click on "OK" button to delete or "Cancel" button to terminate this deletion.  <br /><br />' +
         '<input id="ui_create" type="button" class="button" value="ok" onclick="ConfirmedDelete(' + key + ')" /><span>&nbsp;</span>' +
         '<input id="ui_cancel" type="button" class="button" value="cancel" onclick="ConfirmedCancel()" /></div></div></div>';

    var messageDiv = document.createElement("div");
    messageDiv.id = "dvDeletePanel";
    messageDiv.innerHTML = deletemsg;
    document.body.appendChild(messageDiv);
}
function ConfirmedCancel() {
    $("#dvDeletePanel").hide();
}

//Get urlParam...............
$.urlParam = function (name) {
    //  alert(name);
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (!results) {
        return 0;
    }
    return results[1] || 0;
}

//Get urlParam...............
function urlParam(name) {
    //  alert(name);
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (!results) {
        return 0;
    }
    return results[1] || 0;
}

//show lead count on lead Tab..........
GetNewLeadCount();
function GetNewLeadCount() {
    var LeadUnSeen;
    $.ajax({
        url: "/Form/CommonDetailsForForms/LeadUnSeenMaxCount",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (result) {
            $("#spLeadNotification").html(result);
        }

    });
}

//Hide Div if escape key pressed.....
$(document).keyup(function (e) {
    if (e.keyCode == 27) {
        $(".bgShadedDiv").hide();
        $(".dvdeletepopup").hide();
        $(".CustomPopUp").hide("slow");
    }
});
