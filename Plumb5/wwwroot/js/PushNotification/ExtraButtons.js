function AddActionBtn() {
    if (document.getElementById('dv_AddAction0').style.display == "none") {
        $("#dv_AddAction0").show();
        $("#dv_positn").css("position", "");
        //if ($("#ui_txtActionName0").val() != "") {
        $("#dv_btn1").show();
        $("#span_btn1").val($("#ui_txtActionName0").val());
        //}
    }
    else if (document.getElementById('dv_AddAction01').style.display == "none") {
        $("#dv_AddAction01").show();
        $("#dv_positn").css("position", "");
        //if ($("#ui_txtActionName01").val() != "") {
        $("#dv_btn2").show();
        $("#span_btn2").val($("#ui_txtActionName01").val());
        //}
    }
    else if (document.getElementById('dv_AddAction02').style.display == "none") {
        $("#dv_AddAction02").show();
        //$("input[name^=Icon02][value='0']").attr("checked", true);
        $("#dv_positn").css("position", "");
    }
    if (document.getElementById('dv_AddAction0').style.display != "none" && document.getElementById('dv_AddAction01').style.display != "none") {
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
    switch (parseInt(k)) {
        case 1:
            $("#dv_1" + k2).show();
            break;
        default:
            $("#dv_1" + k2).hide();
            break;
    }
}
function RemoveAction(i) {
    var k = $("#" + i.id).val();
    var k2 = i.id.replace("img_RemoveBtn0", "");
    var a = k2 == "" ? 1 : 2;
    $("#dv_AddAction0" + k2).hide();
    $("#dv_btn" + a).hide();

    if (document.getElementById('dv_AddAction0').style.display != "none" && document.getElementById('dv_AddAction01').style.display != "none") {
        $("#btnAction").hide();
    }
    else {
        $("#btnAction").show();
    }
}

$(".designEachOptionTitle").click(function () {
    if ($(this).next().is("visible"))
        $(this).next().hide(1000);
    else
        $(this).next().show(1000);
});

$("input:radio[name='rad_Background']").click(function () {
    if ($("#ui_radBackgroundDefault").is(":checked")) {
        $("#dv_standardBackground").show(1000);
        $("#dv_customBackground").hide(1000);
    }
    else {
        $("#dv_customBackground").show(1000);
        $("#dv_standardBackground").hide(1000);
    }
});
$("input:radio[name='rad_Image']").click(function () {
    if ($("#ui_radImageDefault").is(":checked")) {
        $("#dv_standardImage").show(1000);
        $("#dv_customImage").hide(1000);
    }
    else {
        $("#dv_customImage").show(1000);
        $("#dv_standardImage").hide(1000);
    }
});
$("input:radio[name='rad_Ttl']").click(function () {
    if ($("#ui_radTtlDefault").is(":checked")) {
        $("#dv_standardTitle").show(1000);
        $("#dv_customTitle").hide(1000);
    }
    else {
        $("#dv_customTitle").show(1000);
        $("#dv_standardTitle").hide(1000);
    }
});
$("input:radio[name='rad_SubTtl']").click(function () {
    if ($("#ui_radSubTtlDefault").is(":checked")) {
        $("#dv_standardSubTitle").show(1000);
        $("#dv_customSubTitle").hide(1000);
    }
    else {
        $("#dv_customSubTitle").show(1000);
        $("#dv_standardSubTitle").hide(1000);
    }
});

$("input:radio[name='rad_Allow']").click(function () {
    if ($("#ui_radAllowDefault").is(":checked")) {
        $("#dv_standardAllow").show(1000);
        $("#dv_customAllow").hide(1000);
    }
    else {
        $("#dv_customAllow").show(1000);
        $("#dv_standardAllow").hide(1000);
    }
});

$("input:radio[name='rad_DisAllow']").click(function () {
    if ($("#ui_radDisAllowDefault").is(":checked")) {
        $("#dv_standardDisAllow").show(1000);
        $("#dv_customDisAllow").hide(1000);
    }
    else {
        $("#dv_customDisAllow").show(1000);
        $("#dv_standardDisAllow").hide(1000);
    }
});

$("input:radio[name='rad_Image2']").click(function () {
    if ($("#ui_radImageDefault2").is(":checked")) {
        $("#dv_standardImage2").show(1000);
        $("#dv_customImage2").hide(1000);
    }
    else {
        $("#dv_customImage2").show(1000);
        $("#dv_standardImage2").hide(1000);
    }
});
$("input:radio[name='rad_Header']").click(function () {
    if ($("#ui_radHeaderDefault").is(":checked")) {
        $("#dv_standardHeader").show(1000);
        $("#dv_customHeader").hide(1000);
    }
    else {
        $("#dv_customHeader").show(1000);
        $("#dv_standardHeader").hide(1000);
    }
});

$("input:radio[name='rad_Content']").click(function () {
    if ($("#ui_radContentDefault").is(":checked")) {
        $("#dv_standardContent").show(1000);
        $("#dv_customContent").hide(1000);
    }
    else {
        $("#dv_customContent").show(1000);
        $("#dv_standardContent").hide(1000);
    }
});

$("input:radio[name='rad_showNbox']").click(function () {
    if ($("input[name='rad_showNbox'][value='2']").prop("checked"))
        $("#dv_ShowPages").show();
    else
        $("#dv_ShowPages").hide();
});
$("#ui_chkPages").click(function () {
    $("#dv_DntShowPages").toggle();
});