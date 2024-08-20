function AddActionBtn() {
    if (document.getElementById('dv_AddAction0').style.display == "none") {
        $("#dv_AddAction0").show();
        $("input[name^=Icon0][value='1']").attr("checked", true);
    }
    else if (document.getElementById('dv_AddAction01').style.display == "none") {
        $("#dv_AddAction01").show();
        $("input[name^=Icon01][value='1']").attr("checked", true);
    }
    else if (document.getElementById('dv_AddAction02').style.display == "none") {
        $("#dv_AddAction02").show();
        $("input[name^=Icon02][value='1']").attr("checked", true);
    }
    if (document.getElementById('dv_AddAction0').style.display != "none" && document.getElementById('dv_AddAction01').style.display != "none" &&
        document.getElementById('dv_AddAction02').style.display != "none") {
        $("#btnAction").hide();
    }
    else {
        $("#btnAction").show();
    }
}
function ChangeAction(i) {
    var k = $("#" + i.id).val();
    var k2 = i.id.replace("ui_ddlAction0", "");
    $("#dv_1" + k2).hide();
    $("#dv_2" + k2).hide();
    $("#dv_3" + k2).hide();
    $("#dv_4" + k2).hide();
    $("#dv_5" + k2).hide();
    $("#dv_6" + k2).hide();
    $("#dv_7" + k2).hide();
    $("#dv_8" + k2).hide();
    $("#dv_9" + k2).hide();
    switch (parseInt(k)) {
        case 1:
            $("#dv_1" + k2).show();
            break;
        case 2:
            $("#dv_2" + k2).show();
            break;
        case 3:
            $("#dv_3" + k2).show();
            break;
        case 4:
            $("#dv_4" + k2).show();
            break;
        case 5:
            $("#dv_5" + k2).show();
            break;
        case 6:
            $("#dv_6" + k2).show();
            break;
        case 7:
            $("#dv_7" + k2).show();
            break;
        case 8:
            $("#dv_8" + k2).show();
            break;
        case 9:
            $("#dv_9" + k2).show();
            break;
        default:
            $("#dv_1" + k2).hide();
            $("#dv_2" + k2).hide();
            $("#dv_3" + k2).hide();
            $("#dv_4" + k2).hide();
            $("#dv_5" + k2).hide();
            $("#dv_6" + k2).hide();
            $("#dv_7" + k2).hide();
            $("#dv_8" + k2).hide();
            $("#dv_9" + k2).hide();
            break;
    }
}
var d = "", g = "", d2 = "", g2 = "", d3 = "", g3 = "";
//function AddActionBtn() {
//    if (document.getElementById('dv_AddAction0').style.display == "none")
//        $("#dv_AddAction0").show();
//    else {
//        var quantity2 = $(".mm_Action").length;
//        if (quantity2 > 2) {
//            $("#btnAction").hide();
//        } else {
//            if (f == "")
//                f = quantity2;
//            var clone = $("#dv_AddAction0").clone(true).attr("id", function () { return this.id + f; }).find(":text,:file").val("").end();
//            clone.find("input[class^=textBox]").attr("id", function () { return this.id + f; });
//            clone.find("select[class^=dropdown]").attr("id", function () { return this.id + f; });
//            clone.find("input[class^=rad_icon]").attr("id", function () { return this.id + f; }).attr("name", function () { return this.name + f; });
//            clone.find("div[class^=dvChanges]").attr("id", function () { return this.id + f });
//            clone.find("div[class^=increment]").attr("id", function () { return this.id + f; }).attr("name", function () { return this.name + f; });
//            clone.find("img").attr("id", function () { return this.id + f; });
//            $("#dv_ActionCont").append(clone);
//            $("#dv_btn0" + f).html("Button " + (quantity2 + 1));
//            f++;
//            if ($(".mm_Action").length > 2)
//                $("#btnAction").hide();
//        }
//    }
//}
//////////// Action 1
$("#img_Add_ABA0").click(function () {
    var quantity = $("#NameDataContainer_ABA div").length;
    if (d == "")
        d = quantity;
    var clone = $("#NameData_ABA0").clone(true).attr("id", function () { return this.id + '0' + d; }).find(":text,:file").val("").end();
    clone.find("input[class^=textBox]").attr("id", function () { return this.id + '0' + d; });
    clone.find("img").attr("id", function () { return this.id + d; }).attr("src", cdnpath + "collapse_minus.png").attr("onclick", "RemoveParamABA1(" + d + ")");
    $("#NameDataContainer_ABA").append(clone);
    $("#txtName_ABA0" + d).val("");
    $("#txtData_ABA0" + d).val("");
    $("#NameData_ABA00" + d).show();
    $("#NameData_ABA00" + d).css("width", "100%").css("margin-left", "25%");
    d++;
});
function RemoveParamABA1(id) {
    $("#NameData_ABA00" + id).remove();
}
$("#img_Add_ABB0").click(function () {
    var quantity = $("#NameDataContainer_ABB0 div").length;
    if (g == "")
        g = quantity;
    var clone = $("#NameData_ABB0").clone(true).attr("id", function () { return this.id + '0' + g; }).find(":text,:file").val("").end();
    clone.find("input[class^=textBox]").attr("id", function () { return this.id + '0' + g; });
    clone.find("img").attr("id", function () { return this.id + g; }).attr("src", cdnpath + "collapse_minus.png").attr("onclick", "RemoveParamABB1(" + g + ")");
    $("#NameDataContainer_ABB0").append(clone);
    $("#txtName_ABB0" + g).val("");
    $("#txtData_ABB0" + g).val("");
    $("#NameData_ABB00" + g).show();
    $("#NameData_ABB00" + g).css("width", "100%").css("margin-left", "25%");
    g++;
});
function RemoveParamABB1(id) {
    $("#NameData_ABB00" + id).remove();
}
//////////// Action 2
$("#img_Add_ABA10").click(function () {
    var quantity = $("#NameDataContainer_ABA1 div").length;
    if (d2 == "")
        d2 = quantity;
    var clone = $("#NameData_ABA1").clone(true).attr("id", function () { return this.id + '0' + d2; }).find(":text,:file").val("").end();
    clone.find("input[class^=textBox]").attr("id", function () { return this.id + '0' + d2; });
    clone.find("img").attr("id", function () { return this.id + d2; }).attr("src", cdnpath + "collapse_minus.png").attr("onclick", "RemoveParamABA2(" + d2 + ")");
    $("#NameDataContainer_ABA1").append(clone);
    $("#txtName_ABA10" + d2).val("");
    $("#txtData_ABA10" + d2).val("");
    $("#NameData_ABA10" + d2).show();
    $("#NameData_ABA10" + d2).css("width", "100%").css("margin-left", "25%");
    d2++;
});
function RemoveParamABA2(id) {
    $("#NameData_ABA10" + id).remove();
}
$("#img_Add_ABB10").click(function () {
    var quantity = $("#NameDataContainer_ABB1 div").length;
    if (g2 == "")
        g2 = quantity;
    var clone = $("#NameData_ABB1").clone(true).attr("id", function () { return this.id + '0' + g2; }).find(":text,:file").val("").end();
    clone.find("input[class^=textBox]").attr("id", function () { return this.id + '0' + g2; });
    clone.find("img").attr("id", function () { return this.id + g2; }).attr("src", cdnpath + "collapse_minus.png").attr("onclick", "RemoveParamABB2(" + g2 + ")");
    $("#NameDataContainer_ABB1").append(clone);
    $("#txtName_ABB10" + g2).val("");
    $("#txtData_ABB10" + g2).val("");
    $("#NameData_ABB10" + g2).show();
    $("#NameData_ABB10" + g2).css("width", "100%").css("margin-left", "25%");
    g2++;
});
function RemoveParamABB2(id) {
    $("#NameData_ABB10" + id).remove();
}
//////////// Action 3
$("#img_Add_ABA20").click(function () {
    var quantity = $("#NameDataContainer_ABA2 div").length;
    if (d3 == "")
        d3 = quantity;
    var clone = $("#NameData_ABA2").clone(true).attr("id", function () { return this.id + '0' + d3; }).find(":text,:file").val("").end();
    clone.find("input[class^=textBox]").attr("id", function () { return this.id + '0' + d3; });
    clone.find("img").attr("id", function () { return this.id + d3; }).attr("src", cdnpath + "collapse_minus.png").attr("onclick", "RemoveParamABA3(" + d3 + ")");
    $("#NameDataContainer_ABA2").append(clone);
    $("#txtName_ABA20" + d3).val("");
    $("#txtData_ABA20" + d3).val("");
    $("#NameData_ABA20" + d3).show();
    $("#NameData_ABA20" + d3).css("width", "100%").css("margin-left", "25%");
    d3++;
});
function RemoveParamABA3(id) {
    $("#NameData_ABA20" + id).remove();
}
$("#img_Add_ABB20").click(function () {
    var quantity = $("#NameDataContainer_ABB2 div").length;
    if (g3 == "")
        g3 = quantity;
    var clone = $("#NameData_ABB2").clone(true).attr("id", function () { return this.id + '0' + g3; }).find(":text,:file").val("").end();
    clone.find("input[class^=textBox]").attr("id", function () { return this.id + '0' + g3; });
    clone.find("img").attr("id", function () { return this.id + g3; }).attr("src", cdnpath + "collapse_minus.png").attr("onclick", "RemoveParamABB3(" + g3 + ")");
    $("#NameDataContainer_ABB2").append(clone);
    $("#txtName_ABB20" + g3).val("");
    $("#txtData_ABB20" + g3).val("");
    $("#NameData_ABB20" + g3).show();
    $("#NameData_ABB20" + g3).css("width", "100%").css("margin-left", "25%");
    g3++;
});
function RemoveParamABB3(id) {
    $("#NameData_ABB20" + id).remove();
}
//////////
function GetActionName(v) {
    var ActnName = "";
    switch (parseInt(v)) {
        case 1:
            ActnName = "Redirect";
            break;
        case 2:
            ActnName = "Deeplinking";
            break;
        case 3:
            ActnName = "External";
            break;
        case 4:
            ActnName = "Copy";
            break;
        case 5:
            ActnName = "Call";
            break;
        case 6:
            ActnName = "Share";
            break;
        case 7:
            ActnName = "Reminder";
            break;
        case 8:
            ActnName = "EventTracking";
            break;
        case 9:
            ActnName = "TextMessage";
            break;
        default:
            ActnName = "Dismiss";
            break;
    }
    return ActnName;
}
function RemoveAction(i) {
    var k = $("#" + i.id).val();
    var k2 = i.id.replace("img_RemoveBtn0", "");
    $("#dv_AddAction0" + k2).hide();
    //$("#dv_btn0" + k2).html("");
    if (document.getElementById('dv_AddAction0').style.display != "none" && document.getElementById('dv_AddAction01').style.display != "none" &&
        document.getElementById('dv_AddAction02').style.display != "none") {
        $("#btnAction").hide();
    }
    else {
        $("#btnAction").show();
    }
}