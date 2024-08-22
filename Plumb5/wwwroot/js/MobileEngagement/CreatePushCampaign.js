var ArrgeoId = [], ArrbecId = [];
var campaignId = '0';
var totalid = 0;
//Initial Ready State
$(document).ready(function () {
    campaignId = $.urlParam("CampaignId");

    if (campaignId == '0') {
        $("input:radio[value='1']").prop("checked", "checked");
        Redirection("1");
        $("#hdDiv").show();
    } else {
        //Bind the data        
        BindCampaignData(campaignId);


        $("title").html('Edit Push Campaign - Mobile Engagement | Plumb5');
        $("#dv_Title").text("Edit Campaign");
        $("#btnsave").val("Update Campaign");
        $("#hdDiv").hide();

    }

    //$("#tr_PageUrl").hide(); // only for test commented -- For Push Campaign this rule not available
    //$("#tr_QueryString").hide();

    //$("#tr_SendMailOut").hide();
    //$("#tr_SendSMSOut").hide();
});
/// Big Picture Style
$("input[name='ImgUrl']").click(function () {
    if ($(this).val() == 2) {
        $("#txtImageUrl").prop("disabled", true);
        $("#fileupload").prop("disabled", false);
        $("#file_upload").prop("disabled", false);
        $("#fileupload").addClass("btn_file");
        $("#fileupload").removeClass("btn_fileDisable");
        //$("#fileupload").css("background", "#565656");
    }
    else {
        $("#txtImageUrl").prop("disabled", false);
        $("#fileupload").prop("disabled", true);
        $("#file_upload").prop("disabled", true);
        //$("#fileupload").css("background", "#A2A2A2");
        $("#fileupload").addClass("btn_fileDisable");
        $("#fileupload").removeClass("btn_file");
    }
});
/// Image Uploading checking
function ImageUpload() {
    $('#span_FileName').empty();
    if ($("#file_upload").val() != "") {
        var Uploadfile = $("#file_upload").get(0);
        var uploadedfile = Uploadfile.files;
        var fromdata;
        if (typeof window.FormData == "undefined") {
            fromdata = [];
        }
        else {
            fromdata = new window.FormData();
        }
        for (var i = 0; i < uploadedfile.length; i++) {
            if (typeof window.FormData == "undefined") {
                fromdata.push(uploadedfile[i].name, uploadedfile[i]);
            }
            else {
                fromdata.append(uploadedfile[i].name, uploadedfile[i]);
            }
        }
        var size = parseFloat(uploadedfile[0].size / 1024).toFixed(2);
        if (size > 1000) {
            ShowErrorMessage("Please upload less than 1MB size images!");
            return false;
        }
        var choice = {};
        choice.url = "../MobileEngagement/FileFormat",
            choice.type = "POST";
        choice.data = fromdata;
        choice.contentType = false;
        choice.processData = false;
        choice.async = false;
        choice.success = function (response) {
            if (response == 0) {
                $("#file_upload").val('');
                $('#span_FileName').hide();
                $('#span_error').html('Please Select Only Image File');
                $('#span_error').show();
                $("#dv_span").show();
                $("#AddImageContainer").css("height", "120");
            }
            else {
                $('#span_error').hide();
                $('#span_FileName').show();
                $('#span_FileName').html(response.length > 50 ? response.substring(0, 50) + "..." : response);
                $("#span_FileName").attr('title', "" + response + "");
                $("#dv_span").show();
                $("#AddImageContainer").css("height", "120");
            }
        };
        choice.error = function (result) {
            $("#dvLoading").hide();
            ShowErrorMessage("Error!!");
        };
        $.ajax(choice);
        event.preventDefault();
    }
}
//Scheduling
$("#div_Schedule").click(function () {
    $("#div_Schedule_Content").toggle('fade');
    initMap();
});
//Beacon
$("#div_Beacons").click(function () {
    $("#div_Beacon_Content").toggle('fade');
});
//Rules
$("#div_Rule").click(function () {
    $("#div_Rule_Content").toggle('fade');
});
//Response Settings
$("#div_Response").click(function () {
    $("#div_Response_Content").toggle('fade');
});
//Dropdown Selection
$("#ddlType").change(function () {
    imagePath(this.value);
    if ($("#ddlType").val() == "3")
        $("#AddImageContainer").show();
    else
        $("#AddImageContainer").hide();
    if ($("#ddlType").val() == "4") {
        $("#Profile_Message").show();
        $("#dv_Msg").css("height", "120");
    }
    else {
        $("#Profile_Message").hide();
        $("#dv_Msg").css("height", "107");
    }
});
//
function imagePath(value) {
    $("#img_Mobile").hide();
    switch (value) {
        case "1":
            $("#img_Mobile").attr("src", "/images/MobileEngagement/smal_single.png").toggle("fade");
            break;
        case "2":
            $("#img_Mobile").attr("src", "/images/MobileEngagement/small_multiple.png").toggle("fade");
            break;
        case "3":
            $("#img_Mobile").attr("src", "/images/MobileEngagement/small_offer_details.png").toggle("fade");
            break;
        case "4":
            $("#img_Mobile").attr("src", "/images/MobileEngagement/smal_profile.png").toggle("fade");
            break;
    }
}
//Redirection Radio Checking
$("input:radio[name='Redirect']").change(function () {

    Redirection($(this).val());
});

//$("input:radio[name='RedirectIOS']").change(function () {
//    Redirection($(this).val());
//});

var hdnRedirectVal = "";
var hdnRedirectValIOS = "";
function Redirection(value) {

    if (value === "1") {  //Redirect to screen
        $("#selectDrp").prop("disabled", false);
        $("#selectDrp").val(hdnRedirectVal);
        $("#txtDeepLinkUrl").prop("disabled", true);
        $("#txtExternalUrl").prop("disabled", true);
        $("#NameDataContainerHideShow").show();
        $("#NameDataContainerHideShow_A").hide();

        // for ios

        $("#selectDrpIOS").prop("disabled", false);
        $("#selectDrpIOS").val(hdnRedirectValIOS);


        $("#txtNamIOS").removeAttr("disabled");
        $("#txtDatIOS").removeAttr("disabled");


        $("#NameDataContainerHideShowIOS").show();
        $("#NameDataContainerHideShow_AIOS").hide();
        $("#NameDataContainer_AIOS").show();
    }
    else if (value === "3") {  //External
        if ($("#selectDrp").val() != "0" || $("#selectDrp").val() != "")
            hdnRedirectVal = $("#selectDrp").val();
        $("#txtDeepLinkUrl").prop("disabled", true);
        $("#txtExternalUrl").prop("disabled", false);
        $("#selectDrp").val("");
        $("#selectDrp").prop("disabled", true);
        $("#NameDataContainerHideShow").hide();
        $("#NameDataContainerHideShow_A").hide();


        // ios

        if ($("#selectDrpIOS").val() != "0" || $("#selectDrpIOS").val() != "")
            hdnRedirectValIOS = $("#selectDrpIOS").val();
        $("#selectDrpIOS").val("");
        $("#selectDrpIOS").prop("disabled", true);

        $("#NameDataContainerHideShowIOS").hide();
        $("#NameDataContainerHideShow_AIOS").hide();
    }
    else {  //Deep Linking Url
        $("#selectDrp").prop("disabled", true);
        if ($("#selectDrp").val() != "0" || $("#selectDrp").val() != "")
            hdnRedirectVal = $("#selectDrp").val();
        $("#NameDataContainerHideShow").hide();
        $("#NameDataContainerHideShow_A").show();
        $("#selectDrp").val("");
        $("#txtDeepLinkUrl").prop("disabled", false);
        $("#txtExternalUrl").prop("disabled", true);

        $("#NameDataContainer_AIOS").hide();

        // ios

        $("#selectDrpIOS").prop("disabled", true);
        if ($("#selectDrpIOS").val() != "0" || $("#selectDrpIOS").val() != "")
            hdnRedirectValIOS = $("#selectDrp").val();


        $("#NameDataContainerHideShowIOS").hide();
        $("#NameDataContainerHideShow_AIOS").show();
        $("#selectDrpIOS").val("");

    }
}
//Add New Rows
var d = "";
$("#img_Add").click(function () {

    if (this.id === "img_Add") {
        var quantity = $("#NameDataContainer div").length;
        if (d == "")
            d = quantity;
        var clone = $("#NameData").clone(true).attr("id", function () { return this.id + '0' + d; }).find(":text,:file").val("").end();
        clone.find("input[class^=textBox]").attr("id", function () { return this.id + '0' + d; });
        clone.find("img").attr("id", function () { return this.id + 'd' + d; }).attr("src", cdnpath + "collapse_minus.png").attr("onclick", "RemoveParam(" + d + ")");
        $("#NameDataContainer").append(clone);
        $("#txtName0" + d).val("");
        $("#txtData0" + d).val("");
        $("#NameData0" + d).show();
        d++;
    } else {
        var id = this.id.replace("img_Add", "");
        $("#NameData0" + id).remove();
        d--;
    }
});
function RemoveParam(id) {
    $("#NameData0" + id).remove();
    d--;
}
//// For External Url
var e = "";
$("#img_Add_A").click(function () {
    if (this.id === "img_Add_A") {
        var quantity = $("#NameDataContainer_A div").length;
        if (e == "")
            e = quantity;
        var clone = $("#NameData_A").clone(true).attr("id", function () { return this.id + '0' + e; }).find(":text,:file").val("").end();
        clone.find("input[class^=textBox]").attr("id", function () { return this.id + '0' + e; });
        clone.find("img").attr("id", function () { return this.id + 'A' + e; }).attr("src", cdnpath + "collapse_minus.png").attr("onclick", "RemoveExternalParam(" + e + ")");
        $("#NameDataContainer_A").append(clone);
        $("#txtName_A0" + e).val("");
        $("#txtData_A0" + e).val("");
        $("#NameData_A0" + e).show();
        e++;
    } else {
        var id = this.id.replace("img_Add_A", "");
        $("#NameData_A0" + id).remove();
        e--;
    }
});

var eIOS = "";
$("#img_Add_AIOS").click(function () {

    if (this.id === "img_Add_AIOS") {
        var quantity = $("#NameDataContainer_AIOS div").length;
        if (eIOS == "")
            eIOS = quantity;
        var clone = $("#NameData_AIOS").clone(true).attr("id", function () { return this.id + '0' + eIOS; }).find(":text,:file").val("").end();
        clone.find("input[class^=textBox]").attr("id", function () { return this.id + '0' + eIOS; });
        clone.find("img").attr("id", function () { return this.id + 'A' + eIOS; }).attr("src", cdnpath + "collapse_minus.png").attr("onclick", "RemoveExternalParamIOS(" + eIOS + ")");
        $("#NameDataContainer_AIOS").append(clone);
        $("#txtName_A0IOS" + eIOS).val("");
        $("#txtData_A0IOS" + eIOS).val("");
        $("#NameData_A0IOS" + eIOS).show();
        eIOS++;
    } else {
        var id = this.id.replace("img_Add_AIOS", "");
        $("#NameData_A0IOS" + id).remove();
        eIOS--;
    }
});
function RemoveExternalParam(id) {
    $("#NameData_A0" + id).remove();
    eIOS--;
}


// IOS Add new rows
var dIOS = "";
$("#img_AddIOS").click(function () {
    totalid++;
    //here
    $("#hdDiv").hide();
    if (this.id === "img_AddIOS") {
        var quantity = $("#NameDataContainerIOS div").length;
        if (dIOS == "")
            dIOS = quantity;
        var clone = $("#NameDataIOS").clone(true).attr("id", function () { return this.id + '0' + dIOS; }).find(":text,:file").val("").end();
        clone.find("input[class^=textBox]").attr("id", function () { return this.id + '0' + dIOS; });
        clone.find("img").attr("id", function () { return this.id + 'dIOS' + dIOS; }).attr("src", cdnpath + "collapse_minus.png").attr("onclick", "RemoveParamIOS(" + dIOS + ")");
        $("#NameDataContainerIOS").append(clone);
        $("#txtNameIOS0" + dIOS).val("");
        $("#txtDataIOS0" + dIOS).val("");
        $("#NameDataIOS0" + dIOS).show();
        dIOS++;
    } else {
        var id = this.id.replace("img_AddIOS", "");
        $("#NameDataIOS0" + id).remove();
        dIOS--;
    }
});

function RemoveParamIOS(id) {

    $("#NameDataIOS0" + id).remove();
    totalid--;
    id--;
    //alert(totalid);


    if (totalid === 0) {
        $("#hdDiv").show();
    }
}

var hdnCount = 0, drpSelectedId = "";
$('input[name="txtNam"]').click(function () {
    var parameterId = $(this).attr('id');
    var clsName = $(this).attr('class');
    if (parameterId.indexOf("txtName_ABA") > -1) {
        if (clsName.indexOf("Button1") > -1)
            drpSelectedId = $("#ui_ddlClickRedirect0").val();
        if (clsName.indexOf("Button2") > -1)
            drpSelectedId = $("#ui_ddlClickRedirect01").val();
        if (clsName.indexOf("Button3") > -1)
            drpSelectedId = $("#ui_ddlClickRedirect02").val();
    }
    else {
        drpSelectedId = $("#selectDrp").val();
    }

    //if (drpSelectedId != "0") {
    //    $('#' + parameterId).autocomplete({
    //        source: function (request, response) {
    //            $.ajax({
    //                url: "../MobileEngagement/GetAutosuggest",
    //                data: "{'type': 'SreenPageParameter',  'action':'" + drpSelectedId + "','q': '" + request.term + "'}",
    //                dataType: "json",
    //                type: "POST",
    //                contentType: "application/json; charset=utf-8",
    //                success: function (data) {
    //                    if (data.Table.length === 0) {
    //                        response({ label: 'No matches found' });
    //                    }
    //                    else {
    //                        response($.map(data.Table, function (item) {
    //                            return {
    //                                label: item.label,
    //                                value: item.label + ""
    //                            }
    //                        }))
    //                    }
    //                },
    //                error: function (xmlHttpRequest) {
    //                    alert(xmlHttpRequest.responseText);
    //                }
    //            });
    //        },
    //        minLength: 1,
    //        focus: function (event, ui) {
    //            $(event.target).val(ui.item.label);
    //            return false;
    //        }
    //    });
    //}
    //else {
    //    ShowErrorMessage("Please select the Screen Name!");
    //}
});
//Saving
function Campaign(val, lnth) {
    if (val == "Send") {
        $.ajax({
            url: "../MobileEngagement/GetStatus",
            data: "{ 'action': 'statusforParticularCamp' ,'campaignId': '" + campaignId + "'}",
            dataType: "json",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            success: function (reponse) {
                if (reponse === 0) {
                    ShowErrorMessage("Please check your Campaign status is Inactive!");
                }
                else {
                    SendCampaignafterChkStatus(val, lnth);
                }
            }
        });
    }
    else {

        SendCampaignafterChkStatus(val, lnth);
    }
}
function SendCampaignafterChkStatus(val, lnth) {
    var ImageName = "", ValidationG = 0, ValidationLat = 0, ValidationLng = 0, ValidationRad = 0, val123 = 0, DeepVal = 0, ExtnlVal = 0, RparameterValidation = 0, DparameterValidation = 0;
    if (document.getElementById('dv_AddAction0').style.display != "none") {
        hdnCount = 1;
    }
    if (document.getElementById('dv_AddAction01').style.display != "none") {
        hdnCount = 2;
    }
    if (document.getElementById('dv_AddAction02').style.display != "none") {
        hdnCount = 3;
    }
    if (hdnCount != 0) {
        for (var m = 0; m < hdnCount; m++) {
            var b = m === 0 ? "" : m;
            if ($("#ui_txtActionName0" + b).val() == "") {
                val123 = 1;
            }
            else if ($("#ui_ddlAction0" + b).val() != 0) {
                if ($("#ui_ddlAction0" + b).val() == "1") {
                    if ($("#ui_ddlClickRedirect0" + b).val() == "0") {
                        val123 = 1;
                    }
                    else {
                        for (var m21 = 0; m21 < (d == "" ? $("#NameDataContainer div").length : d) ; m21++) {
                            var b2 = m21 === 0 ? "" : m21;
                            if ($("#txtName0" + b2).val() != "") {
                                if ($("#txtName0" + b2).val() != "No matches found" && $("#txtData0" + b2).val() == "") {
                                    RparameterValidation = 1;
                                }
                                else if ($("#txtName0" + b2).val() != "No matches found" && $("#txtData0" + b2).val() != "") {
                                    RparameterValidation = 0;
                                }
                            }
                        }
                    }
                }
                else if ($("#ui_ddlAction0" + b).val() == "2") {
                    if ($("#ui_txtClickDeepLink0" + b).val() == "") {
                        val123 = 1;
                    }
                    else if ($("#ui_txtClickDeepLink0" + b).val() != "") {
                        if ($("#ui_txtClickDeepLink0" + b).val().indexOf(".") == -1)
                            DeepVal = 1
                    }
                    else {
                        for (var m3 = 0; m3 < (e == "" ? $("#NameDataContainer_A div").length : e) ; m3++) {
                            var b3 = m3 === 0 ? "" : m3;
                            if ($("#txtName_A0" + b3).val() != "") {
                                if ($("#txtName_A0" + b3).val() != "No matches found" && $("#txtData_A0" + b3).val() == "") {
                                    DparameterValidation = 1;
                                }
                                else if ($("#txtName_A0" + b3).val() != "No matches found" && $("#txtName_A0" + b3).val() != "") {
                                    DparameterValidation = 0;
                                }
                            }
                        }
                    }
                }
                else if ($("#ui_ddlAction0" + b).val() == "3") {
                    if ($("#ui_txtClickExternal0" + b).val() == "") {
                        val123 = 1;
                    }
                    else {
                        if ($("#ui_txtClickExternal0" + b).val().indexOf("http") == -1)
                            ExtnlVal = 1
                    }
                }
                else if ($("#ui_ddlAction0" + b).val() == "4") {
                    if ($("#ui_txtClickCopy0" + b).val() == "") {
                        val123 = 1;
                    }
                }
                else if ($("#ui_ddlAction0" + b).val() == "5") {
                    if ($("#ui_txtClickCall0" + b).val() == "") {
                        val123 = 1;
                    }
                }
                else if ($("#ui_ddlAction0" + b).val() == "6") {
                    if ($("#ui_txtClickShare10" + b).val() == "") {
                        val123 = 1;
                    }
                    else if ($("#ui_txtClickShare20" + b).val() == "") {
                        val123 = 1;
                    }
                }
                else if ($("#ui_ddlAction0" + b).val() == "7") {
                    if ($("#ui_ddlClickRemind0" + b).val() == "0") {
                        val123 = 1;
                    }
                    else if ($("#ui_txtClickRemind0" + b).val() == "") {
                        val123 = 1;
                    }
                }
                else if ($("#ui_ddlAction0" + b).val() == "8") {
                    if ($("#ui_txtClickEvent10" + b).val() == "") {
                        val123 = 1;
                    }
                    else if ($("#ui_txtClickEvent20" + b).val() == "") {
                        val123 = 1;
                    }
                }
                else if ($("#ui_ddlAction0" + b).val() == "9") {
                    if ($("#ui_txtClickTxtMessage10" + b).val() == "") {
                        val123 = 1;
                    }
                    else if ($("#ui_txtClickTxtMessage20" + b).val() == "") {
                        val123 = 1;
                    }
                }
            }
        }
    }
    ////// Geo Validation
    if ((document.getElementById('geofenceContainer').style.display != "none" || document.getElementById('geofenceContainer').style.display != "") && $(".geoclass").length > 0 && lnth == 1) {
        for (var m5 = 0; m5 < $(".geoclass").length; m5++) {
            var b5 = m5 === 0 ? "" : m5;
            if ($("#pac_inputname0" + b5).val() == "") {
                ValidationG = 1;
            }
            else if ($("#pac_inputlat0" + b5).val() == "") {
                ValidationLat = 1;
            }
            else if ($("#pac_inputlng0" + b5).val() == "") {
                ValidationLng = 1;
            }
            else if ($("#pac_inputRadius0" + b5).val() == "") {
                ValidationRad = 1;
            }
        }
    }
    //// Beacon validation
    var BName = 0, BUudi = 0, BMj = 0, BMn = 0, Brad = 0, iB_UUDIvalidation = 0;
    for (var r = 0; r < $(".beaconclass").length; r++) {
        var m2 = r === 0 ? "" : r;
        if ($(".beaconclass").length > 0 && document.getElementById('div_Beacon_Content').style.display != "none") {
            if ($("#Beacon_inputname0" + m2).val() == "") {
                BName = 1;
            }
            else if ($("#Beacon_MajorId0" + m2).val() == "") {
                BMj = 1;
            }
            else if ($("#Beacon_MinorId0" + m2).val() == "") {
                BMn = 1;
            }
            else if ($("#Beacon_Radius0" + m2).val() == "") {
                Brad = 1;
            }
            else {
                if ($("#Beacon_Uudi0" + m2).val() == "") {
                    BUudi = 1;
                }
                else if ($("#Beacon_Uudi0" + m2).val() != undefined) {
                    var iBuudi = $("#Beacon_Uudi0" + m2).val() == undefined ? "" : $("#Beacon_Uudi0" + m2).val();
                    if (iBuudi.length >= 36 && iBuudi.indexOf("-") > -1)
                        iB_UUDIvalidation = 0;
                    else {
                        iB_UUDIvalidation = 1;
                    }
                }
            }
        }
    }
    var GNameChk = Array(), BNameChk = [];
    ///// Name Validation
    for (var m4 = 0; m4 < $(".geo_hdnClass").length; m4++) {
        var b4 = m4 === 0 ? "" : m4;
        var GN2 = $("#pac_inputname0" + b4).val() == undefined ? "" : $("#pac_inputname0" + b4).val().split(",");
        if (GN2[0] != undefined)
            GNameChk.push(GN2[0] == undefined ? "" : GN2[0].toLowerCase());
    }
    for (var p = 0; p < $(".beacon_hdnClass").length; p++) {
        var t = p === 0 ? "" : p;
        BNameChk.push($("#Beacon_inputname0" + t).val() == undefined ? "" : $("#Beacon_inputname0" + t).val().toLowerCase());
    }
    var nameExisting = 0;
    if (GNameChk.length > 0 && BNameChk.length > 0) {
        if (GNameChk[0] != "") {
            var Lessdata = (GNameChk.length > BNameChk.length) ? GNameChk : BNameChk;
            var Moredata = (GNameChk.length > BNameChk.length) ? BNameChk : GNameChk;
            $.each(Lessdata, function (key, value) {
                if (jQuery.inArray(value, Moredata) >= 0) {
                    nameExisting = 1;
                }
            });
        }
    }
    //////// End Name Validation
    if ($("#txtName").val() == "")
        ShowErrorMessage("Please provide the campaign name");
    else if ($("#ddlType").val() === "3" && $("input[name^=ImgUrl]:checked").val() === "1" && $("#txtImageUrl").val() == "")
        ShowErrorMessage("Please provide the image URL");
    else if ($("#ddlType").val() === "3" && $("input[name^=ImgUrl]:checked").val() === "2" && $("#span_FileName").text() === "")
        ShowErrorMessage("Please upload the image");
    else if ($("#txtTicker").val() == "")
        ShowErrorMessage("Please provide the ticker");
    else if ($("#txtTitle").val() == "")
        ShowErrorMessage("Please provide the title");
    else if ($("#txtMessage").val() == "")
        ShowErrorMessage("Please provide the message");
        //else if ($("#txtSubText").val() == "")
        //    ShowErrorMessage("Please provide the SubText");
    else if ($("input[name^=Redirect]:checked").val() === "2" && $("#txtDeepLinkUrl").val() == "")
        ShowErrorMessage("Please provide the Deeplink Url!");
    else if ($("input[name^=Redirect]:checked").val() === "3" && $("#txtExternalUrl").val() == "")
        ShowErrorMessage("Please provide the 'http' External Url!");
    else if ($("input[name^=Redirect]:checked").val() === "1" && ($("#selectDrp").val() === "0" || $("#selectDrp").val() === ""))
        ShowErrorMessage("Please select the screen");
    else if (RparameterValidation == 1)
        ShowErrorMessage("Please provide the all Redirect to screen Parameters!");
    else if ($("#txtExternalUrl").val().indexOf("http") == -1 && $("#txtExternalUrl").val() != "" && $("input[name^=Redirect]:checked").val() === "3")
        ShowErrorMessage("Please provide the valid 'http' External Url!");
    else if ($("#txtDeepLinkUrl").val().indexOf(".") == -1 && $("#txtDeepLinkUrl").val() != "" && $("input[name^=Redirect]:checked").val() === "2")
        ShowErrorMessage("Please provide the valid Deeplink Url!");
    else if (DparameterValidation == 1)
        ShowErrorMessage("Please provide the all Deep linking url Parameters");

    else if (val123 == 1) {
        for (var m6 = 0; m6 < hdnCount; m6++) {
            var b = m6 === 0 ? "" : m6;
            if ($("#ui_txtActionName0" + b).val() == "") {
                ShowErrorMessage("Please enter the Button Name!");
                return false;
            }
            else if ($("#ui_ddlAction0" + b).val() != 0) {
                if ($("#ui_ddlAction0" + b).val() == "1") {
                    if ($("#ui_ddlClickRedirect0" + b).val() == "0") {
                        ShowErrorMessage("Please select the Screen!");
                        return false;
                    }
                }
                else if ($("#ui_ddlAction0" + b).val() == "2") {
                    if ($("#ui_txtClickDeepLink0" + b).val() == "") {
                        ShowErrorMessage("Please enter the DeepLink URL!");
                        return false;
                    }
                }
                else if ($("#ui_ddlAction0" + b).val() == "3") {
                    if ($("#ui_txtClickExternal0" + b).val() == "") {
                        ShowErrorMessage("Please enter the External URL!");
                        return false;
                    }
                }
                else if ($("#ui_ddlAction0" + b).val() == "4") {
                    if ($("#ui_txtClickCopy0" + b).val() == "") {
                        ShowErrorMessage("Please enter the Coupon Number!");
                        return false;
                    }
                }
                else if ($("#ui_ddlAction0" + b).val() == "5") {
                    if ($("#ui_txtClickCall0" + b).val() == "") {
                        ShowErrorMessage("Please enter the Phone Number!");
                        return false;
                    }
                }
                else if ($("#ui_ddlAction0" + b).val() == "6") {
                    if ($("#ui_txtClickShare10" + b).val() == "") {
                        ShowErrorMessage("Please enter the Report!");
                        return false;
                    }
                    else if ($("#ui_txtClickShare20" + b).val() == "") {
                        ShowErrorMessage("Please enter the Report!");
                        return false;
                    }
                }
                else if ($("#ui_ddlAction0" + b).val() == "7") {
                    if ($("#ui_ddlClickRemind0" + b).val() == "0") {
                        ShowErrorMessage("Please select the Time!");
                        return false;
                    }
                    else if ($("#ui_txtClickRemind0" + b).val() == "") {
                        ShowErrorMessage("Please enter the Reminder!");
                        return false;
                    }
                }
                else if ($("#ui_ddlAction0" + b).val() == "8") {
                    if ($("#ui_txtClickEvent10" + b).val() == "") {
                        ShowErrorMessage("Please enter the Event Name!");
                        return false;
                    }
                    else if ($("#ui_txtClickEvent20" + b).val() == "") {
                        ShowErrorMessage("Please enter the Event Value!");
                        return false;
                    }
                }
                else if ($("#ui_ddlAction0" + b).val() == "9") {
                    if ($("#ui_txtClickTxtMessage10" + b).val() == "") {
                        ShowErrorMessage("Please enter the Text Message!");
                        return false;
                    }
                    else if ($("#ui_txtClickTxtMessage20" + b).val() == "") {
                        ShowErrorMessage("Please enter the Text Message!");
                        return false;
                    }
                }
            }
        }
    }
    else if (DeepVal == 1) {
        ShowErrorMessage("Please provide the valid DeepLink Url!");
        return false;
    }
    else if (ExtnlVal == 1) {
        ShowErrorMessage("Please provide the valid 'http' External Url!");
        return false;
    }
    else if (ValidationG == 1 || ValidationLat == 1 || ValidationLng == 1 || ValidationRad == 1) {
        if (ValidationG == 1) {
            ShowErrorMessage("Please enter a location");
            return false;
        }
        else if (ValidationLat == 1) {
            ShowErrorMessage("Please provide the Latitude");
            return false;
        }
        else if (ValidationLng == 1) {
            ShowErrorMessage("Please provide the Longitude");
            return false;
        }
        else if (ValidationRad == 1) {
            ShowErrorMessage("Please enter the radius");
            return false;
        }
    }
    else if (BName == 1 || BUudi == 1 || BMj == 1 || BMn == 1 || Brad == 1) {
        if (BName == 1) {
            ShowErrorMessage("Please enter the Beacon Name");
            return false;
        }
        else if (BUudi == 1) {
            ShowErrorMessage("Please enter the UUDI");
            return false;
        }
        else if (BMj == 1) {
            ShowErrorMessage("Please provide the Major Id");
            return false;
        }
        else if (BMn == 1) {
            ShowErrorMessage("Please provide the Minor Id");
            return false;
        }
        else if (Brad == 1) {
            ShowErrorMessage("Please enter the radius");
            return false;
        }
    }
    else if (iB_UUDIvalidation == 1) {
        ShowErrorMessage("Please provide valid UUDI!");
    }
    else if (nameExisting == 1) {
        ShowErrorMessage("Please provide different names for Geofence and Beacon!");
    }
    else {
        if ($("#file_upload").val() != "") {
            var Uploadfile = "";
            Uploadfile = $("#file_upload").get(0);
            var uploadedfile = Uploadfile.files;
            var fromdata;
            if (typeof window.FormData == "undefined") {
                fromdata = [];
            }
            else {
                fromdata = new window.FormData();
            }
            for (var i = 0; i < uploadedfile.length; i++) {
                if (typeof window.FormData == "undefined") {
                    fromdata.push(uploadedfile[i].name, uploadedfile[i]);
                }
                else {
                    fromdata.append(uploadedfile[i].name, uploadedfile[i]);
                }
            }
            var choice = {};
            choice.url = "../MobileEngagement/SaveImage",
                choice.type = "POST";
            choice.data = fromdata;
            choice.contentType = false;
            choice.processData = false;
            choice.async = false;
            choice.success = function (response) {
                if (response == 0) {
                    $("#file_upload").val('');
                    $('#span_FileName').hide();
                    $('#span_error').html('Please Select Only Image File');
                    $('#span_error').show();
                }
                else {
                    ImageName = response;
                    SaveCapaign(val, ImageName);
                }
            };
            choice.error = function (result) {
                $("#dvLoading").hide();
                ShowErrorMessage("Error!!");
            };
            $.ajax(choice);
            event.preventDefault();
        }
        else {
            SaveCapaign(val, ImageName);
        }
    }
}
///Save Campaign
function SaveCapaign(val, imageName) {

    if (!ValidationOfRules()) {
        $("#dvLoading").hide();
        return false;
    }
    //if (!ValidationOfResponseSetting()) {
    //    $("#dvLoading").hide();
    //    return false;
    //}


    $("#dvLoading").show();
    var redirectionUrl = "", datas = "", externalUrl = "", deeplinkurl = "", ruleStatus = 0, responseStatus = 0, geoName = "", lat = "", lang = "", rad = "", etrtrigger = "";
    var redirectionUrlIOS = "", datasIOS = "";

    if ($("input[name=Redirect]:checked").val() === "3") //Deep Linking URL
        externalUrl = $("#txtExternalUrl").val();

    else if ($("input[name=Redirect]:checked").val() === "2") {
        for (var m7 = 0; m7 < $("#NameDataContainer_A div").length; m7++) {
            var b = m7 === 0 ? "" : m7;
            if ($("#txtName_A0" + b).val() != "" || $("#txtData_A0" + b).val() != "")
                datas += $("#txtName_A0" + b).val() + "=" + $("#txtData_A0" + b).val() + ",";
        }

        datas = datas.slice(0, -1);
        datas = datas == "=" ? "" : datas;
        deeplinkurl = $("#txtDeepLinkUrl").val();
    }


    else {
        for (var m8 = 0; m8 < $("#NameDataContainer div").length; m8++) {
            var b = m8 === 0 ? "" : m8;
            if ($("#txtName0" + b).val() != "" || $("#txtData0" + b).val() != "")
                datas += $("#txtName0" + b).val() + "=" + $("#txtData0" + b).val() + ",";
        }
        datas = datas.slice(0, -1);
        datas = datas == "=" ? "" : datas;
        redirectionUrl = $("#selectDrp").val();
    }


    // new ios



    //if ($("input[name^=RedirectIOS]:checked").val() === "3") //Deep Linking URL
    //    externalUrl = $("#txtExternalUrl").val();

    //else if ($("input[name^=RedirectIOS]:checked").val() === "2") {
    //    for (var m7 = 0; m7 < $("#NameDataContainer_AIOS div").length; m7++) {
    //        var b = m7 === 0 ? "" : m7;
    //        if ($("#txtName_A0IOS" + b).val() != "" || $("#txtData_A0IOS" + b).val() != "")
    //            datasIOS += $("#txtName_A0IOS" + b).val() + "=" + $("#txtData_A0IOS" + b).val() + ",";
    //    }

    if ($("input[name^=Redirect]:checked").val() === "3") //Deep Linking URL
        externalUrl = $("#txtExternalUrl").val();

    else if ($("input[name^=Redirect]:checked").val() === "2") {
        for (var m7 = 0; m7 < $("#NameDataContainer_AIOS div").length; m7++) {
            var b = m7 === 0 ? "" : m7;
            if ($("#txtName_A0IOS" + b).val() != "" || $("#txtData_A0IOS" + b).val() != "")
                datasIOS += $("#txtName_A0IOS" + b).val() + "=" + $("#txtData_A0IOS" + b).val() + ",";
        }

        datasIOS = datasIOS.slice(0, -1);
        datasIOS = datasIOS == "=" ? "" : datasIOS;
        deeplinkurl = $("#txtDeepLinkUrl").val();
    }


    else {
        var ccid = $.urlParam("CampaignId");
        debugger;
        for (var m8 = 0; m8 < 1; m8++) {
            var b = m8 === 0 ? "" : m8;
            if ($("#txtName0IOS" + b).val() != "" || $("#txtData0IOS" + b).val() != "")
                datasIOS += $("#txtName0IOS" + b).val() + "=" + $("#txtData0IOS" + b).val() + ",";
        }

        for (var m8 = 1; m8 < $("#NameDataContainerIOS div").length; m8++) {
            var b = m8 === 0 ? "" : m8;
            if ($("#txtNameIOS" + b).val() != "" || $("#txtData0IOS" + b).val() != "")

                //if (ccid === 0)
                datasIOS += $("#txtNameIOS0" + b).val() + "=" + $("#txtDataIOS0" + b).val() + ",";
            //else
            //  datasIOS += $("#txtName0IOS" + b).val() + "=" + $("#txtData0IOS" + b).val() + ",";
        }
        datasIOS = datasIOS.slice(0, -1);
        datasIOS = datasIOS == "=" ? "" : datasIOS;
        redirectionUrlIOS = $("#selectDrpIOS").val();

        //alert(datasIOS);
    }


    // nwe ios end



    if (parseInt($("#ddlType").val()) == "3") {
        if ($("input[name^=ImgUrl]:checked").val() === "1") {
            if (cdnpath.indexOf("//") == 0 || $("#txtImageUrl").val().indexOf("//") == 0) {
                if ($("#txtImageUrl").val().indexOf("http") == -1) {
                    imageName = (window.location.protocol == "http:" || window.location.protocol == "https:" ? window.location.protocol : "") + $("#txtImageUrl").val();
                }
                else {
                    imageName = $("#txtImageUrl").val();
                }
            }
            else {
                imageName = $("#txtImageUrl").val();
            }
        }
        else {
            if (imageName.indexOf("http") == -1) {
                if (cdnpath.indexOf("http") == -1) {
                    imageName = ((window.location.protocol == "http:" || window.location.protocol == "https:") ? window.location.protocol : "") +
                        cdnpath
                        + "MobileEngagementUploads/" + imageName;
                } else {
                    cdnpath = cdnpath.replace("https:", "").replace("http:", "");

                    imageName = ((window.location.protocol == "http:" || window.location.protocol == "https:") ? window.location.protocol : "") +
                        cdnpath
                        + "MobileEngagementUploads/" + imageName;
                }
            }
        }
    }
    if ($("#div_Rule_Content input[type='checkbox']:checked").length > 0)
        ruleStatus = 1;
    if ($("#div_Response_Content input[type='checkbox']:checked").length > 0)
        responseStatus = 1;
    //// Add Action
    var ExtraButtons = "", ActionNo = "";
    for (var m9 = 0; m9 < hdnCount; m9++) {
        var b = m9 === 0 ? "" : m9;
        ActionNo += $("#ui_txtActionName0" + b).val() + "^" + $("input[name=Icon0" + b + "]:checked").val() + "^" + $("#ui_ddlAction0" + b).val();//GetActionName($("#ui_ddlAction0" + b).val());
        if ($("#ui_ddlAction0" + b).val() == "1") {
            var a2 = "";
            for (var m2 = 0; m2 < $("#NameDataContainer_ABA" + b + " div").length; m2++) {
                var n = m2 === 0 ? "" : m2;
                a2 += $("#txtName_ABA" + b + "0" + n).val() + "=" + $("#txtData_ABA" + b + "0" + n).val() + ",";
            }
            a2 = a2.slice(0, -1);
            ActionNo += "^" + $("#ui_ddlClickRedirect0" + b).val() + "^" + a2;
        }
        else if ($("#ui_ddlAction0" + b).val() == "2") {
            var a2 = "";
            for (var m3 = 0; m3 < $("#NameDataContainer_ABB" + b + " div").length; m3++) {
                var n = m3 === 0 ? "" : m3;
                a2 += $("#txtName_ABB" + b + "0" + n).val() + "=" + $("#txtData_ABB" + b + "0" + n).val() + ",";
            }
            a2 = a2.slice(0, -1);
            ActionNo += "^" + $("#ui_txtClickDeepLink0" + b).val() + "^" + a2;
        }
        else if ($("#ui_ddlAction0" + b).val() == "3") {
            ActionNo += "^" + $("#ui_txtClickExternal0" + b).val();
        }
        else if ($("#ui_ddlAction0" + b).val() == "4") {
            ActionNo += "^" + $("#ui_txtClickCopy0" + b).val();
        }
        else if ($("#ui_ddlAction0" + b).val() == "5") {
            ActionNo += "^" + $("#ui_txtClickCall0" + b).val();
        }
        else if ($("#ui_ddlAction0" + b).val() == "6") {
            ActionNo += "^" + $("#ui_txtClickShare10" + b).val() + "^" + $("#ui_txtClickShare20" + b).val();
        }
        else if ($("#ui_ddlAction0" + b).val() == "7") {
            ActionNo += "^" + $("#ui_ddlClickRemind0" + b).val() + "^" + $("#ui_txtClickRemind0" + b).val();
        }
        else if ($("#ui_ddlAction0" + b).val() == "8") {
            ActionNo += "^" + $("#ui_txtClickEvent10" + b).val() + "^" + $("#ui_txtClickEvent20" + b).val();
        }
        else if ($("#ui_ddlAction0" + b).val() == "9") {
            ActionNo += "^" + $("#ui_txtClickTxtMessage10" + b).val() + "^" + $("#ui_txtClickTxtMessage20" + b).val();
        }
        ActionNo += "|";
    }
    ActionNo = ActionNo.slice(0, -1);
    /////   Geofence
    var ArrGId = [], ArrayGeoName = [], ArrayLat = [], ArrayLong = [], ArrayRad = [], ArrayTrigger = [], ArrayLocality = [], ArrayCity = [], ArrayState = [], ArrayCountry = [], ArrAction = [];
    ArrGId2 = ArrGId2.slice(0, -1);
    for (var m10 = 0; m10 < $(".geo_hdnClass").length; m10++) {
        var b = m10 === 0 ? "" : m10;
        var GN = $("#pac_inputname0" + b).val() == undefined ? "" : $("#pac_inputname0" + b).val().split(",");
        ArrayGeoName.push(GN[0]);
        ArrayLat.push($("#pac_inputlat0" + b).val() == undefined ? "" : $("#pac_inputlat0" + b).val());
        ArrayLong.push($("#pac_inputlng0" + b).val() == undefined ? "" : $("#pac_inputlng0" + b).val());
        ArrayRad.push($("#pac_inputRadius0" + b).val() == undefined ? "" : $("#pac_inputRadius0" + b).val());
        ArrayTrigger.push($("#ddl_Trigger0" + b).val() == undefined ? "" : $("#ddl_Trigger0" + b).val());
        ArrayLocality.push($("#hdn_Locality0" + b).val() == undefined ? "" : $("#hdn_Locality0" + b).val());
        ArrayCity.push($("#hdn_City0" + b).val() == undefined ? "" : $("#hdn_City0" + b).val());
        ArrayState.push($("#hdn_State0" + b).val() == undefined ? "" : $("#hdn_State0" + b).val());
        ArrayCountry.push($("#hdn_Country0" + b).val() == undefined ? "" : $("#hdn_Country0" + b).val());
        if ($("#hdn_geoId0" + b).val() == 0) {
            ArrGId.push($("#hdn_geoId0" + b).val());
            ArrAction.push("Insert");
        } else if ($("#hdn_geoId0" + b).val() > 0) {
            ArrGId.push($("#hdn_geoId0" + b).val());
            ArrAction.push("Update");
        } else {
            ArrGId.push(ArrGId2.split(","));
            ArrAction.push("Delete");
        }
    }
    /////   Beacon
    var ArrBeaconId = [], ArrayBeaconName = [], ArrayUUDI = [], ArrayMajor = [], ArrayMinor = [], ArrayBeaconRad = [], ArrayBeaconTrigger = [], ArrBeaconAction = [];
    ArrBeaconId2 = ArrBeaconId2.slice(0, -1);
    for (var p = 0; p < $(".beacon_hdnClass").length; p++) {
        var t = p === 0 ? "" : p;
        ArrayBeaconName.push($("#Beacon_inputname0" + t).val() == undefined ? "" : $("#Beacon_inputname0" + t).val());
        ArrayUUDI.push($("#Beacon_Uudi0" + t).val() == undefined ? "" : $("#Beacon_Uudi0" + t).val());
        ArrayMajor.push($("#Beacon_MajorId0" + t).val() == undefined ? "" : $("#Beacon_MajorId0" + t).val());
        ArrayMinor.push($("#Beacon_MinorId0" + t).val() == undefined ? "" : $("#Beacon_MinorId0" + t).val());
        ArrayBeaconRad.push($("#Beacon_Radius0" + t).val() == undefined ? "" : $("#Beacon_Radius0" + t).val());
        ArrayBeaconTrigger.push($("#Beacon_Trigger0" + t).val() == undefined ? "" : $("#Beacon_Trigger0" + t).val());
        if ($("#hdn_beaconId0" + t).val() == 0) {
            ArrBeaconId.push($("#hdn_beaconId0" + t).val());
            ArrBeaconAction.push("Insert");
        } else if ($("#hdn_beaconId0" + t).val() > 0) {
            ArrBeaconId.push($("#hdn_beaconId0" + t).val());
            ArrBeaconAction.push("Update");
        } else {
            ArrBeaconId.push(ArrBeaconId2.split(","));
            ArrBeaconAction.push("Delete");
        }
    }
    var message = "";
    if (parseInt($("#ddlType").val()) == 4 && $("#txtMessage").val().match(/\n/g) != null)
        message = $("#txtMessage").val();
    else
        message = $("#txtMessage").val().replace(/\n/g, "");
    // alert(message);



    $.ajax({
        url: "../MobileEngagement/SavePushCampaign",
        type: "Post",
        data: "{'BtnAction':'" + val + "','CampaignName':'" + $("#txtName").val() + "','Type': '" + parseInt($("#ddlType").val()) + "', 'ImageUrl': '" + imageName +
        "', 'Ticker': '" + $("#txtTicker").val() + "', 'Title': '" + $("#txtTitle").val() + "', 'Message': '" + message + "', 'SubText': '" + $("#txtSubText").val() +
        "', 'Redirection': '" + redirectionUrl + "', 'External': '" + externalUrl + "', 'DeepLinkUrl': '" + deeplinkurl + "', 'Parameters': '" + datas +
        "', 'ExtraButtons': '" + ActionNo + "', 'RuleStatus': '" + ruleStatus + "', 'ResponseStatus': '" + responseStatus + "', 'CampaignId': '" + campaignId +
        "', 'geoId': '" + ArrGId + "', 'GeoName': '" + ArrayGeoName + "', 'Lat': '" + ArrayLat + "', 'Long': '" + ArrayLong + "', 'Rad': '" + ArrayRad + "', 'Trigger': '" +
        ArrayTrigger + "', 'Locality': '" + ArrayLocality + "', 'City': '" + ArrayCity + "', 'State': '" + ArrayState + "', 'Country': '" + ArrayCountry +
        "', 'action': '" + ArrAction + "', 'beaconId': '" + ArrBeaconId + "', 'BeaconName': '" + ArrayBeaconName + "', 'UUDI': '" + ArrayUUDI + "', 'Major': '" +
        ArrayMajor + "', 'Minor': '" + ArrayMinor + "', 'BeaconRad': '" + ArrayBeaconRad + "', 'BeaconTrigger': '" + ArrayBeaconTrigger + "', 'beaconAction': '" +
        ArrBeaconAction + "', 'geoUpdate': '" + geoUpdate + "', 'beaconUpdate': '" + beaconUpdate + "', 'sendingType' : '" + parseInt($("input[name^=typeodSend]:checked").val()) + "', 'redirectionIOS': '" + redirectionUrlIOS + "', 'parametersIOS': '" + datasIOS + "' }",

        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (parseInt(response) > 0 && val != "Send") {
                SaveMobileFormRules(response, 'Onlycreated');
                ShowErrorMessage("Successfully created the campaign");
                $("#div_Rule_Content").hide();
                ClearAll();
            }
            else if (parseInt(response) > 0 && val == "Send") {
                SaveMobileFormRules(response, 'createSend');
                //ShowErrorMessage("Successfully created and sent the Campaign");
                $("#div_Rule_Content").hide();
                ClearAll();
            }
            else if (parseInt(response) > 0 || (parseInt(response) == -3 && val == "Send")) {
                SaveMobileFormRules(campaignId, 'Send');
                //SaveMobileResponseSetting(campaignId, 'updated'); 
            }
            else if (parseInt(response) == -3 && val != "Send") {
                ShowErrorMessage("Successfully updated the campaign");
                SaveMobileFormRules(campaignId, 'updated');
                //SaveMobileResponseSetting(campaignId, 'updated');
            }
            else if (parseInt(response) == -6) {
                SaveMobileFormRules(response, 'Sending');
                //SaveMobileResponseSetting(response, 'Sending');
            }
            else if (parseInt(response) == -2) {
                ShowErrorMessage("Campaign name is already exists");
                $("#dvLoading").hide();
            }
            else if (parseInt(response) == -21) {
                ShowErrorMessage("Geofence name is already exists");
                $("#dvLoading").hide();
            }
            else if (parseInt(response) == -22) {
                ShowErrorMessage("Beacon name is already exists");
                $("#dvLoading").hide();
            }
            else if (parseInt(response) == 0) {
                ShowErrorMessage("Something went wrong!");
                $("#dvLoading").hide();
            }
        },
        error: function (objxmlRequest) {
            window.console.log(objxmlRequest.responseText);
        }
    });
}
/// Save MobileForm Rules
function SaveMobileFormRules(Id, btnVal) {
    $("#dvLoading").show();
    RulesData(Id);
    var inputs = {};
    if (btnVal == 'Onlycreated' || btnVal == 'createSend')
        inputs = { Id: Id, action: 'SaveRules', TypeOfCampaign: 1 };
    else if (btnVal == "Sending")
        inputs = { Id: Id, action: 'Sending', TypeOfCampaign: 1 };
    else
        inputs = { Id: Id, action: 'UpdateRules', TypeOfCampaign: 1 };
    $.ajax({
        url: "../MobileEngagement/SaveMobileFormRules",
        type: "Post",
        data: JSON.stringify({ 'ruleConditions': ruleConditions, 'inputs': inputs }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (parseInt(response) >= 0) {
                if (btnVal == "Send")
                    ShowErrorMessage("Successfully campaigns has been sent, Number of campaign sent is " + response);
                else if (btnVal == 'createSend')
                    ShowErrorMessage("Successfully created the campaign and has been sent, Number of campaign sent is " + response);
                //ShowErrorMessage("Successfully inserted Form rules");
            }
            $("#dvLoading").hide();
        }
    });
}
function SaveMobileResponseSetting(Id, btnVal) {
    ResponseSettingData();
    var inputs = {};
    if (btnVal == 'created')
        inputs = { Id: Id, action: 'SaveResponseSetting', TypeOfCampaign: 1 };
    else if (btnVal == "Sending")
        inputs = { Id: Id, action: 'Sending', TypeOfCampaign: 1 };
    else
        inputs = { Id: Id, action: 'UpdateResponseSetting', TypeOfCampaign: 1 };
    $.ajax({
        url: "../MobileEngagement/SaveMobileResponseSetting",
        type: "Post",
        data: JSON.stringify({ 'responseSettings': responseSettings, 'inputs': inputs }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (parseInt(response) > 0) {
                //ShowErrorMessage("Successfully inserted Form rules");     
            }
        }
    });
}
/// Reset columns
function ClearAll() {
    $("#txtName").val("");
    $("#ddlType").val("1");
    $("#span_FileName").text("");
    $("input[name=ImgUrl][value='1']").prop("checked", true);
    $("input[name=ImgUrl][value='2']").prop("checked", false);
    $("#txtImageUrl").prop("disabled", false);
    $("#file_upload").prop("disabled", true);
    $("#fileupload").prop("disabled", true);
    $("#fileupload").css("background", "#A2A2A2");
    $("#AddImageContainer").hide();
    $("#txtImageUrl").val("");
    $("#txtTicker").val("");
    $("#txtTitle").val("");
    $("#txtMessage").val("");
    $("#txtSubText").val("");
    $("#selectDrp").val("");
    $("#txtName0").val("");
    $("#txtData0").val("");
    $("input[name=Redirect][value='1']").prop("checked", true);
    $("input[name=Redirect][value='2']").prop("checked", false);
    $("input[name=Redirect][value='3']").prop("checked", false);
    $("#NameDataContainerHideShow").show();
    $("#NameDataContainerHideShow_A").hide();
    $("#selectDrp").prop("disabled", false);
    var lngth = $("#NameDataContainer > div").length + 1;
    for (var i = 1; i < lngth; i++) {
        $("#NameData0" + i).remove();
    }
    $("#txtDeepLinkUrl").prop("disabled", true);
    $("#txtDeepLinkUrl").val("");
    var lngth2 = $("#NameDataContainer_A > div").length + 1;
    for (var i = 1; i < lngth2; i++) {
        $("#NameData_A0" + i).remove();
    }
    $("#txtExternalUrl").prop("disabled", true);
    $("#txtExternalUrl").val("");
    ////
    $("#geofenceContainer").hide();
    $("#geo0").hide();
    var lngth = $("#geofenceContainer > div").length + 1;
    for (var i = 1; i < lngth; i++) {
        $("#geo0" + i).remove();
        $("#pac_inputname0" + i).val("");
        $("#pac_inputlat0" + i).val("");
        $("#pac_inputlng0" + i).val("");
    }
    $("#geofenceContainer").css("padding-top", "0px");
    for (var j = 1; j < $("#beaconContainer div").length; j++) {
        $("#beacon0" + j).remove();
    }
    $("#Beacon_inputname0").val("");
    $("#Beacon_Uudi0").val("B9407F30-F5F8-466E-AFF9-25556B57FE6D");
    $("#Beacon_MajorId0").val("");
    $("#Beacon_MinorId0").val("");
    $("#Beacon_Radius0").val("1");
    $("#Beacon_Trigger0").val("1");
}
//Bind the exisiting datas
function BindCampaignData(campaignId) {

    $.ajax({
        url: "../MobileEngagement/BindCampaignData",
        type: "Post",
        //data: JSON.stringify({ 'Data': inputs }),
        data: "{'campaignId':'" + campaignId + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {

            if (response.Table.length > 0) {
                $("#dvLoading").show();
                $.each(response.Table, function () {
                    $("#txtName").val(this.CampaignName);
                    $("#ddlType").val(this.Type);
                    imagePath(this.Type.toString());
                    if (this.Type === 3) {
                        $("#AddImageContainer").show();
                        $("input[name^=ImgUrl][value='1']").attr("checked", true);
                        if (this.ImageUrl != "null" && this.ImageUrl.indexOf("/") > -1)
                            $("#txtImageUrl").val(this.ImageUrl);
                        else {
                            if (cdnpath.indexOf("//") == 0 && this.ImageUrl.indexOf("//") == 0) {
                                $("#txtImageUrl").val((window.location.protocol == "http:" || window.location.protocol == "https:" ? window.location.protocol : "") +
                                    cdnpath + "MobileEngagementUploads/" + this.ImageUrl);
                            }
                            else {
                                $("#txtImageUrl").val(cdnpath + "MobileEngagementUploads/" + this.ImageUrl);
                            }
                        }
                    }
                    $("#txtTicker").val(this.Ticker);


                    var parser = new DOMParser;
                    var dom = parser.parseFromString(
                        '<!doctype html><body>' + this.Message,
                        'text/html');
                    var decodedString = dom.body.textContent;
                    $("#txtMessage").val(decodedString);

                    // for title remove amp
                    var parser1 = new DOMParser;
                    var dom1 = parser1.parseFromString(
                       '<!doctype html><body>' + this.Title,
                       'text/html');

                    var decodedStringTitle = dom1.body.textContent;
                    $("#txtTitle").val(decodedStringTitle);




                    $("input[name^=typeodSend][value='" + this.IsAndriodIOS + "']").attr("checked", true);
                    if (this.Type == 4) {
                        $("#Profile_Message").show();
                        $("#dv_Msg").css("height", "120");
                    }
                    else {
                        $("#Profile_Message").hide();
                        $("#dv_Msg").css("height", "107");
                    }

                    // for Subtext remove amp
                    var parser2 = new DOMParser;
                    var dom2 = parser2.parseFromString(
                       '<!doctype html><body>' + this.SubText,
                       'text/html');

                    var decodedStringSubText = dom2.body.textContent;
                    $("#txtSubText").val(decodedStringSubText);



                    if (this.ExternalUrl != null && this.ExternalUrl != "") {
                        $("input[name^=Redirect][value='3']").attr("checked", true);
                        $("#txtExternalUrl").val(this.ExternalUrl);
                        $("#txtDeepLinkUrl").prop("disabled", true);
                    }
                    else if (this.DeepLinkUrl != null && this.DeepLinkUrl != "") {
                        $("input[name^=Redirect][value='2']").attr("checked", true);
                        $("#selectDrp").prop("disabled", true);
                        $("#txtExternalUrl").prop("disabled", true);

                        $("txtName_A0IOS").prop("disabled", true);
                        $("txtData_A0IOS").prop("disabled", true);
                        //img_Add_AIOS
                        $("#txtDeepLinkUrl").val(this.DeepLinkUrl);
                        var params = this.Parameters.toString().split(",");


                        for (var n = 0; n < params.length; n++) {//Cloning Again
                            if (n === 0) {
                                $("#NameDataContainerHideShow_A").toggle("fade");
                                $("#txtName_A0").val(params[n].split("=")[0]);
                                $("#txtData_A0").val(params[n].split("=")[1]);
                            }
                            else {
                                var quantity = $("#NameDataContainer_A div").length;
                                var clone = $("#NameData_A0").clone(true).attr("id", function () { return this.id + quantity; }).find(":text,:file").val("").end();
                                clone.find("input[class^=textBox]").attr("id", function () { return this.id + quantity; });
                                clone.find("img").attr("id", function () { return this.id + quantity; }).attr("src", cdnpath + "collapse_minus.png").attr("onclick", "RemoveExternalParam(" + quantity + ")");
                                $("#NameDataContainer_A").append(clone);
                                $("#txtName_A0" + quantity).val(params[n].split("=")[0]);
                                $("#txtData_A0" + quantity).val(params[n].split("=")[1]);

                            }
                        }
                    }
                    else {

                        $("input[name^=Redirect][value='1']").attr("checked", true);
                        $("#selectDrp").prop("disabled", false);
                        $("#txtDeepLinkUrl").prop("disabled", true);
                        $("#selectDrp").val(this.RedirectTo);
                        var params = this.Parameters.toString().split(",");
                        for (var n = 0; n < params.length; n++) {//Cloning Again
                            if (n === 0) {
                                $("#NameDataContainerHideShow").toggle("fade");
                                $("#txtName0").val(params[n].split("=")[0]);
                                $("#txtData0").val(params[n].split("=")[1]);
                            }
                            else {
                                var quantity = $("#NameDataContainer div").length;
                                var clone = $("#NameData0").clone(true).attr("id", function () { return this.id + quantity; }).find(":text,:file").val("").end();
                                clone.find("input[class^=textBox]").attr("id", function () { return this.id + quantity; });
                                clone.find("img").attr("id", function () { return this.id + quantity; }).attr("src", cdnpath + "collapse_minus.png").attr("onclick", "RemoveParam(" + quantity + ")");
                                $("#NameDataContainer").append(clone);
                                $("#txtName0" + quantity).val(params[n].split("=")[0]);
                                $("#txtData0" + quantity).val(params[n].split("=")[1]);
                            }
                        }

                        // for ios 222

                        //$("input[name^=RedirectIOS][value='1']").attr("checked", true);

                        $("input[name^=Redirect][value='1']").attr("checked", true);
                        $("#selectDrpIOS").prop("disabled", false);
                        $("#txtDeepLinkUrl").prop("disabled", true);
                        $("#selectDrpIOS").val(this.IosRedirectTo);
                        var params = this.IosParameters != undefined ? this.IosParameters.toString().split(",") : "";
                        for (var n = 0; n < params.length; n++) {//Cloning Again
                            if (n === 0) {

                                //$("#NameDataContainerHideShowIOS").toggle("fade");
                                $("#txtName0IOS").val(params[n].split("=")[0]);
                                $("#txtData0IOS").val(params[n].split("=")[1]);



                            }
                            else {

                                var quantity = $("#NameDataContainerIOS div").length;
                                var clone = $("#NameDataIOS0").clone(true).attr("id", function () { return this.id + quantity; }).find(":text,:file").val("").end();
                                clone.find("input[class^=textBox]").attr("id", function () { return this.id + quantity; });
                                clone.find("img").attr("id", function () { return this.id + quantity; }).attr("src", cdnpath + "collapse_minus.png").attr("onclick", "RemoveParamIOS(" + quantity + ")");

                                $("#NameDataContainerIOS").append(clone);
                                $("#txtName0IOS" + quantity).val(params[n].split("=")[0]);
                                $("#txtData0IOS" + quantity).val(params[n].split("=")[1]);
                                //alert(n+': t'); 
                            }

                            if (n > 1)
                                totalid = n - 1;


                            //campaignId = $.urlParam("CampaignId");
                            if (totalid >= 0) {
                                $("#hdDiv").show();
                            }
                        }
                        //show
                        if (totalid >= 0) {
                            $("#hdDiv").show();
                        }
                        // for ios end
                    }
                    if (this.ExtraButtons != "" && this.ExtraButtons != null) {
                        var ExtraBtns = this.ExtraButtons.toString().split("|");
                        for (var n2 = 0; n2 < ExtraBtns.length; n2++) {
                            var ExtraSeparate = ExtraBtns[n2].split("^");
                            var b = n2 === 0 ? "" : n2;
                            $("#ui_txtActionName0" + b).val(ExtraSeparate[0]);
                            $("input[name^=Icon0" + b + "][value='" + ExtraSeparate[1] + "']").attr("checked", true);
                            $("#ui_ddlAction0" + b).val(ExtraSeparate[2]);
                            $("#dv_AddAction0" + b).show();
                            if (b == 2) {
                                $("#btnAction").hide();
                            }
                            if (ExtraSeparate[2] != 0 && ExtraSeparate[3] != "") {
                                if (ExtraSeparate[2] == "1") {
                                    $("#dv_1" + b).show();
                                    $("#ui_ddlClickRedirect0" + b).val(ExtraSeparate[3]);
                                    if (ExtraSeparate[4] != "") {
                                        var k2 = ExtraSeparate[4].split(",");
                                        for (var n3 = 0; n3 < k2.length; n3++) {
                                            if (n3 === 0) {
                                                $("#txtName_ABA" + b + "0").val(k2[n3].split("=")[0]);
                                                $("#txtData_ABA" + b + "0").val(k2[n3].split("=")[1]);
                                            }
                                            else {
                                                var quantity = $("#NameDataContainer_ABA" + b + " div").length;
                                                var clone = $("#NameData_ABA" + b).clone(true).attr("id", function () { return this.id + "0" + quantity; }).find(":text,:file").val("").end();
                                                clone.find("input[class^=textBox]").attr("id", function () { return this.id + "0" + quantity; });
                                                clone.find("img").attr("id", function () { return this.id + "0" + quantity; }).attr("src", cdnpath + "collapse_minus.png").attr("onclick", "RemoveParamABA" + (b + 1) + "(" + quantity + ")");
                                                $("#NameDataContainer_ABA" + b).append(clone);
                                                $("#txtName_ABA" + b + "0" + quantity).val(k2[n3].split("=")[0]);
                                                $("#txtData_ABA" + b + "0" + quantity).val(k2[n3].split("=")[1]);
                                                $("#NameData_ABA" + b + "0" + quantity).show();
                                                $("#NameData_ABA" + b + "0" + quantity).css("width", "100%").css("margin-left", "25%");
                                            }
                                        }
                                    }
                                }
                                else if (ExtraSeparate[2] == "2") {
                                    $("#dv_2" + b).show();
                                    $("#ui_txtClickDeepLink0" + b).val(ExtraSeparate[3]);
                                    if (ExtraSeparate[4] != "") {
                                        var k2 = ExtraSeparate[4].split(",");
                                        for (var n3 = 0; n3 < k2.length; n3++) {
                                            if (n3 === 0) {
                                                $("#txtName_ABB" + b + "0").val(k2[n3].split("=")[0]);
                                                $("#txtData_ABB" + b + "0").val(k2[n3].split("=")[1]);
                                            }
                                            else {
                                                var quantity = $("#NameDataContainer_ABB" + b + " div").length;
                                                var clone = $("#NameData_ABB" + b).clone(true).attr("id", function () { return this.id + "0" + quantity; }).find(":text,:file").val("").end();
                                                clone.find("input[class^=textBox]").attr("id", function () { return this.id + "0" + quantity; });
                                                clone.find("img").attr("id", function () { return this.id + "0" + quantity; }).attr("src", cdnpath + "collapse_minus.png").attr("onclick", "RemoveParamABB" + (b + 1) + "(" + quantity + ")");
                                                $("#NameDataContainer_ABB" + b).append(clone);
                                                $("#txtName_ABB" + b + "0" + quantity).val(k2[n3].split("=")[0]);
                                                $("#txtData_ABB" + b + "0" + quantity).val(k2[n3].split("=")[1]);
                                                $("#NameData_ABB" + b + "0" + quantity).show();
                                                $("#NameData_ABB" + b + "0" + quantity).css("width", "100%").css("margin-left", "25%");
                                            }
                                        }
                                    }
                                }
                                else if (ExtraSeparate[2] == "3") {
                                    $("#dv_3" + b).show();
                                    $("#ui_txtClickExternal0" + b).val(ExtraSeparate[3]);
                                }
                                else if (ExtraSeparate[2] == "4") {
                                    $("#dv_4" + b).show();
                                    $("#ui_txtClickCopy0" + b).val(ExtraSeparate[3]);

                                }
                                else if (ExtraSeparate[2] == "5") {
                                    $("#dv_5" + b).show();
                                    $("#ui_txtClickCall0" + b).val(ExtraSeparate[3]);
                                }
                                else if (ExtraSeparate[2] == "6") {
                                    $("#dv_6" + b).show();
                                    $("#ui_txtClickShare10" + b).val(ExtraSeparate[3]);
                                    $("#ui_txtClickShare20" + b).val(ExtraSeparate[4]);
                                }
                                else if (ExtraSeparate[2] == "7") {
                                    $("#dv_7" + b).show();
                                    $("#ui_ddlClickRemind0" + b).val(ExtraSeparate[3]);
                                    $("#ui_txtClickRemind0" + b).val(ExtraSeparate[4]);
                                }
                                else if (ExtraSeparate[2] == "8") {
                                    $("#dv_8" + b).show();
                                    $("#ui_txtClickEvent10" + b).val(ExtraSeparate[3]);
                                    $("#ui_txtClickEvent20" + b).val(ExtraSeparate[4]);
                                }
                                else if (ExtraSeparate[2] == "9") {
                                    $("#dv_9" + b).show();
                                    $("#ui_txtClickTxtMessage10" + b).val(ExtraSeparate[3]);
                                    $("#ui_txtClickTxtMessage20" + b).val(ExtraSeparate[4]);
                                }
                            }
                        }
                    }
                    if (this.RuleStatus == 1)
                        BindMobileRules(campaignId);
                    //if (this.ResponseStatus == 1)
                    //    BindMobileResponseSetting(campaignId);
                    $("#dvLoading").hide();
                });
                if (response.Table1.length > 0) {
                    $("#div_Schedule_Content").show();
                    $("#geofenceContainer").show();
                    var geocoder = new google.maps.Geocoder(), Latitude = "", Longitude = "", getCountry = "";
                    for (var n = 0; n < response.Table1.length; n++) {//Cloning Again
                        ArrgeoId.push(response.Table1[n].Id);
                        if (n === 0) {
                            $("#pac_inputname0").val(response.Table1[n].GeofenceName).css("border", "1px solid #ccc"); arrGeoName.push(response.Table1[n].GeofenceName);
                            $("#pac_inputlat0").val(response.Table1[n].Latitude).css("border", "1px solid #ccc"); arrLatitude.push(response.Table1[n].Latitude);
                            $("#pac_inputlng0").val(response.Table1[n].Longitude).css("border", "1px solid #ccc"); arrLongitude.push(response.Table1[n].Longitude);
                            $("#pac_inputRadius0").val(response.Table1[n].Radius);
                            $("#ddl_Trigger0").val(response.Table1[n].EntryExist);
                            $("#hdn_geoId0").val(response.Table1[n].Id);
                            $("#hdn_Locality0").val(response.Table1[n].Locality);
                            $("#hdn_City0").val(response.Table1[n].City);
                            $("#hdn_State0").val(response.Table1[n].State);
                            $("#hdn_Country0").val(response.Table1[n].Country);
                        }
                        else {
                            var quantity = $(".geoclass").length;
                            var clone2 = $("#geo_hdn0").clone(true).attr("id", function () { return "geo_hdn0" + quantity; }).find(":text,:file").val("").end();
                            clone2.find("input[id^=hdn_geoId0]").attr("id", function () { return this.id + quantity; });
                            var clone = $("#geo0").clone(true).attr("id", function () { return "geo0" + quantity; }).find(":text,:file").val("").end();
                            clone.find("input[class^=textBox]").attr("id", function () { return this.id + quantity; });
                            clone.find("select[id^=ddl_Trigger0]").attr("id", function () { return this.id + quantity; });
                            clone.find("img").attr("id", function () { return "GeoimgRemove" + quantity; }).attr("src", "/images/MobileEngagement/remove.png");
                            clone.find("input[class^=hdnvalues]").attr("id", function () { return this.id + quantity; });
                            $("#geofenceContainer").append(clone2);
                            $("#geofenceContainer").append(clone);
                            $("#geo0" + quantity).css("border-top", "0px solid #cfcfcf");
                            $("#pac_inputname0" + quantity).val(response.Table1[n].GeofenceName).css("border", "1px solid #ccc"); arrGeoName.push(response.Table1[n].GeofenceName);
                            $("#pac_inputlat0" + quantity).val(response.Table1[n].Latitude).css("border", "1px solid #ccc"); arrLatitude.push(response.Table1[n].Latitude);
                            $("#pac_inputlng0" + quantity).val(response.Table1[n].Longitude).css("border", "1px solid #ccc"); arrLongitude.push(response.Table1[n].Longitude);
                            $("#pac_inputRadius0" + quantity).val(response.Table1[n].Radius);
                            $("#ddl_Trigger0" + quantity).val(response.Table1[n].EntryExist);
                            $("#hdn_geoId0" + quantity).val(response.Table1[n].Id);
                            $("#hdn_Locality0" + quantity).val(response.Table1[n].Locality);
                            $("#hdn_City0" + quantity).val(response.Table1[n].City);
                            $("#hdn_State0" + quantity).val(response.Table1[n].State);
                            $("#hdn_Country0" + quantity).val(response.Table1[n].Country);
                        } //$("#pac_inputname0" + b).css("border", "1px solid #ccc"); $("#pac_inputlat0" + b).css("border", "1px solid #ccc"); $("#pac_inputlng0" + b).css("border", "1px solid #ccc");
                        var map = new google.maps.Map(document.getElementById('map'), {
                            zoom: 3,
                            center: { lat: 12.9715987, lng: 77.5945627 },
                        });
                        var i = 0;
                        geocoder.geocode({ 'address': response.Table1[n].GeofenceName }, function (results, status) {
                            if (status == google.maps.GeocoderStatus.OK) {
                                Latitude = results[0].geometry.location.lat();
                                Longitude = results[0].geometry.location.lng();
                                mapPoints = "<div style='font-size: 13px; color: black;font-weight:500;width:150px'>" + arrGeoName[i];
                                AddMarker(Latitude, Longitude, mapPoints, map);
                            }
                            i++;
                        });
                    }
                    if ($(".geoclass").length > 1)
                        $("#GeoimgRemove").hide();
                    else
                        $("#GeoimgRemove").show();
                }
                else {
                    //$("#div_Schedule_Content").hide();
                }
                if (response.Table2.length > 0) {
                    $("#div_Beacons").show();
                    $("#div_Beacon_Content").show();
                    for (var x = 0; x < response.Table2.length; x++) {//Cloning Again
                        ArrbecId.push(response.Table2[x].BeaconId);
                        if (x === 0) {
                            $("#Beacon_inputname0").val(response.Table2[x].BeaconName);
                            $("#Beacon_Uudi0").val(response.Table2[x].BeaconUuid);
                            $("#Beacon_MajorId0").val(response.Table2[x].MajorId);
                            $("#Beacon_MinorId0").val(response.Table2[x].MinorId);
                            $("#Beacon_Radius0").val(response.Table2[x].Radius);
                            $("#Beacon_Trigger0").val(response.Table2[x].EntryExist);
                            $("#hdn_beaconId0").val(response.Table2[x].BeaconId);
                        }
                        else {
                            var quantity = $(".beaconclass").length;
                            var clone2 = $("#beacon_hdn0").clone(true).attr("id", function () { return "beacon_hdn0" + quantity; }).find(":text,:file").val("").end();
                            clone2.find("input[id^=hdn_beaconId0]").attr("id", function () { return this.id + quantity; });
                            var clone = $("#beacon0").clone(true).attr("id", function () { return "beacon0" + quantity; }).find(":text,:file").val("").end();
                            clone.find("input[class^=textBox]").attr("id", function () { return this.id + quantity; });
                            clone.find("select[id^=Beacon_Radius0]").attr("id", function () { return this.id + quantity; });
                            clone.find("select[id^=Beacon_Trigger0]").attr("id", function () { return this.id + quantity; });
                            clone.find("img").attr("id", function () { return "BeaconAddNew" + quantity; }).attr("src", "/images/MobileEngagement/remove.png").attr("title", "Remove");
                            $("#beaconContainer").append(clone2);
                            $("#beaconContainer").append(clone);
                            $("#Beacon_inputname0" + quantity).val(response.Table2[x].BeaconName);
                            $("#Beacon_Uudi0" + quantity).val(response.Table2[x].BeaconUuid);
                            $("#Beacon_MajorId0" + quantity).val(response.Table2[x].MajorId);
                            $("#Beacon_MinorId0" + quantity).val(response.Table2[x].MinorId);
                            $("#Beacon_Radius0" + quantity).val(response.Table2[x].Radius);
                            $("#Beacon_Trigger0" + quantity).val(response.Table2[x].EntryExist);
                            $("#hdn_beaconId0" + quantity).val(response.Table2[x].BeaconId);
                        }
                    }
                }
                $("#dvLoading").hide();
            }
        },
        error: function (objxmlRequest) {
            window.console.log(objxmlRequest.responseText);
        }
    });



}
//// Bind Mobile Rules
function BindMobileRules(Id) {
    $("#div_Rule_Content").show();
    var inputs = { Id: Id, action: 'GetRules', TypeOfCampaign: 1 };
    $.ajax({
        url: "../MobileEngagement/GetMobileRules",
        type: "Post",
        data: JSON.stringify({ 'ruleConditions': ruleConditions, 'inputs': inputs }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table.length > 0) {
                ruleConditions = response.Table[0];
                BindAudienceData();
                BindBehaviorData();
                BindInteractionData();
                BindInteractionEventData();
                BindProfileData();
            }
        }
    });
}
//// Bind Mobile ResponseSetting
function BindMobileResponseSetting(Id) {
    $("#div_Response_Content").show();
    var inputs = { Id: Id, action: 'GetResponseSettings', TypeOfCampaign: 1 };
    $.ajax({
        url: "../MobileEngagement/GetMobileResponseSettings",
        type: "Post",
        data: JSON.stringify({ 'inputs': inputs }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.Table.length > 0) {
                responseSettings = response.Table[0];
                BindResponseSettings();
            }
        }
    });
}