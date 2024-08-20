
$(document).ready(function () {
    $("#dvLoading").hide();
    CheckAccessPermission("User");
});

function ChangeStatus(userid, Isactive) {
    if (Isactive == true) {
        $("#img_" + userid).attr("src", "/images/Active.png");
        $("#img_" + userid).attr("onclick", "ChangeStatus(" + userid + ",false)");
        $("#img_" + userid).attr("title", "toogle to In-active");
    }
    else {
        $("#img_" + userid).attr("src", "/images/blocked.png");
        $("#img_" + userid).attr("onclick", "ChangeStatus(" + userid + ",true)");
        $("#img_" + userid).attr("title", "toogle to make active");
    }
    $.ajax({
        url: "/User/ChangeStatus",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{'Id':" + userid + ",'Isactive':" + Isactive + "}",
        success: function (data) {
        },
        error: function (objxmlRequest) {

        }

    })
}

function HideGroupPopUp() {
    $("#dv_Groups").hide("fast");
}

ConfirmedDelete = function (Id) {
    $("#dvDeletePanel").hide();
    $.ajax({
        url: "/User/DeleteUser",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{'Id':" + Id + "}",
        success: function (data) {
            $("#ui_" + Id).remove();
            ShowErrorMessage("User Deleted Successfully!");
            if ($.trim($("#ui_dvData").html()) == "") {
                $("#ui_dvData").html(" <div class='itemStyle'>No records found</div>");
            }
        },
        error: function (objxmlRequest) {

        }

    })
};


function removegroup(usergroupid, userid) {
    $.ajax({
        url: "/User/RemovefromGroup",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: "{usergroupid:" + usergroupid + ",userid:" + userid + "}",
        success: function (data) {
            $("#grp" + usergroupid).remove();
            ShowErrorMessage("User successfully removed from group!");
            var htmlcontent = $.trim($("#dv_users").html());
            if (htmlcontent == "") {
                $("#dv_users").html("<div class='itemStyle' style='padding:8px;'><div style='float: left; width: 35%; text-align: left; margin-top: -16px;' >No Groups Found</div></div>");
            }
        },
        error: function (objxmlRequest) {

        }

    })
}


function showgroups(Id) {
    $("#dv_users").empty();
    $("#divmsgs").hide();
    $("#dv_Groups").show("fast");
    $.ajax({
        url: "/User/GetUsersGroup",
        type: 'POST',
        data: JSON.stringify({ 'Id': Id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            var data = "";
            if (response.length > 0) {
                $.each(response, function () {
                    data += "<div class='itemStyle' id='grp" + $(this)[0].Id + "' style='padding:8px;'><div style='float: left; width: 25%; margin-top: -16px;  text-align: left;'>" + $(this)[0].Name + "</div>";
                    data += "<div style='float: left; width: 55%; text-align: left; margin-top: -16px;' >" + $(this)[0].UserGroupDescription + " </div>";
                    data += "<div style='float: left; text-align: left; width:20%; margin-top: -16px;' ><img class='FullControlPermission' src='/images/removegrp.png' title='Remove from Group' style='cursor:pointer; ' onclick='removegroup(" + $(this)[0].Id + "," + Id + ")' /></div></div> ";
                });
                $("#dv_users").html(data);
            }
            else {
                $("#dv_users").html("<div class='itemStyle' style='padding:8px;'><div style='float: left; width: 35%; text-align: left; margin-top: -16px;' >No Groups Found</div></div>");
            }
            $("#dvLoading").hide();
        },
        error: function (objxmlRequest) {
        }
    });
    setTimeout(function () { CheckAccessPermission("User"); }, 1000);
}

$("#btnUserBack").click(function () {
    window.history.back();
})
