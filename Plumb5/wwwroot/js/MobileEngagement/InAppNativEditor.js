var campaignId = '0', BannerId = 0;
$(document).ready(function () {
    $("#tr_respondChat").hide();
    BannerId = $.urlParam("Id");
    campaignId = $.urlParam("CampaignId");
    if (campaignId == '0') {
        $("input:radio[value='1']").prop("checked", "checked");
    }
    $('#txtScreenName').autocomplete({
        source: function (request, response) {
            return {
                label: item.Value,
                value: item.Value + ""
            }
        },
        minLength: 1,
        focus: function (event, ui) {
            $(event.target).val(ui.item.label);
            return false;
        }
    });
    if (campaignId > 0) {
        if ($("#hdn_ruleStatus").val() == "1")
            BindMobileRules(campaignId);
        if ($("#hdn_responseStatus").val() == "1")
            BindMobileResponseSetting(campaignId);
        if ($("#hdn_BannerId").val() != '5') {
            $("#ddlType option[value='Rb']").remove();
        }
        if ($("#hdn_BannerId").val() == '7')
            $("#dv_closeDialog").hide();
        else
            $("#dv_closeDialog").show();
    }
    else {
        if (BannerId != 7) {
            $("#tr_SendMailOut").hide();
            $("#tr_SendSMSOut").hide();
            $("#dv_closeDialog").show();
        } else {
            $("#tr_SendMailOut").show();
            $("#tr_SendSMSOut").show();
            $("#dv_closeDialog").hide();
        }
        if (BannerId == 2) {
            $("#tr_AssignSalesPerson").hide();
        } else {
            $("#tr_AssignSalesPerson").show();
        }
        if (BannerId != 5 || $("#hdn_BannerId").val() != 5) {
            $("#ddlType option[value='Rb']").remove();
        }
    }
});
var hdnRedirectVal = "0";
function Redirection(value) {
    if (value === "1") {//Redirect to screen
        $("#DrpSelectRedirectToScreenId").prop("disabled", false);
        $("#DrpSelectRedirectToScreenId").val(hdnRedirectVal);
        $("#txtExternalUrl").prop("disabled", true);
        $("#txtExternalUrl").val("");
        $("#NameDataContainerHideShowId").hide().toggle("fade");
    } else {    //Deep Linking Url
        hdnRedirectVal = $("#DrpSelectRedirectToScreenId").val();
        $("#txtExternalUrl").prop("disabled", false);
        $("#DrpSelectRedirectToScreenId").val("");
        $("#DrpSelectRedirectToScreenId").prop("disabled", true);
        $("#NameDataContainerHideShowId").show().toggle("fade");
    }
}
var drpSelectedId2 = "";
$('input[name="txtNam"]').click(function () {
    var parameterId = $(this).attr('id');
    if (parameterId.indexOf("IdtxtName") > -1) {
        drpSelectedId2 = $("#DrpSelectRedirectToScreenId").val();
    } else {
        drpSelectedId2 = $("#DrpSelectRedirectToScreen").val();
    }
    if (drpSelectedId2 != "0") {
        $('#' + parameterId).autocomplete({
            source: function (request, response) {
                $.ajax({
                    url: "../MobileEngagement/GetAutosuggest",
                    data: "{ 'action':'" + drpSelectedId2 + "Screen" + "','q': '" + request.term + "'}",
                    dataType: "json",
                    type: "POST",
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        if (data.Table.length === 0) {
                            response({ label: 'No matches found' });
                        }
                        else {
                            response($.map(data.Table, function (item) {
                                return {
                                    label: item.label,
                                    value: item.label + ""
                                }
                            }))
                        }
                    },
                    error: function (xmlHttpRequest) {
                        alert(xmlHttpRequest.responseText);
                    }
                });
            },
            minLength: 1,
            focus: function (event, ui) {
                $(event.target).val(ui.item.label);
                return false;
            }
        });
    }
    else {
        ShowErrorMessage("Please select the Screen Name!");
    }
});
//Rules
$("#div_Rule").click(function () {
    $("#div_Rule_Content").toggle('fade');
});
//Response Settings
$("#div_Response").click(function () {
    $("#div_Response_Content").toggle('fade');
});
//Add New Rows
var d = "";
$("#img_Add").click(function () {
    if (this.id === "img_Add") {
        var quantity = $("#NameDataContainer div").length;
        if (d == "")
            d = quantity;
        var clone = $("#NameData").clone(true).attr("id", function () { return this.id + '0' + d; }).find(":text,:file").val("").end();
        clone.find("input[class^=textBox]").attr("id", function () { return this.id + '0' + d; });
        clone.find("img").attr("id", function () { return this.id + '0' + d; }).attr("src", cdnpath + "collapse_minus.png").attr("onclick", "RemoveParam(" + d + ")");
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
function RemoveExternalParam(id) {
    $("#NameData_A0" + id).remove();
    e--;
}
//Add New Rows For Id 1
var d2 = "";
$("#img_AddId").click(function () {
    if (this.id === "img_AddId") {
        var quantity = $("#NameDataContainerId div").length;
        if (d2 == "")
            d2 = quantity;
        var clone = $("#IdNameData").clone(true).attr("id", function () { return this.id + '0' + d2; }).find(":text,:file").val("").end();
        clone.find("input[class^=textBox]").attr("id", function () { return this.id + '0' + d2; });
        clone.find("img").attr("id", function () { return this.id + '0' + d2; }).attr("src", cdnpath + "collapse_minus.png").attr("onclick", "RemoveParamId(" + d2 + ")");
        //clone.find("img").attr("id", function () { return this.id + quantity; }).attr("src", "//www.plumb5.com/images/collapse_minus.png");
        $("#NameDataContainerId").append(clone);
        $("#IdtxtName0" + d2).val("");
        $("#txtData0" + d2).val("");
        $("#IdNameData0" + d2).show();
        d2++;
    } else {
        var id = this.id.replace("img_AddId", "");
        $("#IdNameData0" + id).remove();
        d2--;
    }
});
function RemoveParamId(id) {
    $("#IdNameData0" + id).remove();
    d2--;
}
//Redirection Radio Checking
$("input:radio[name='RedirectId']").change(function () {
    Redirection($(this).val());
});
////
var finalFieldId1 = []; var clickImg = 0, arr = [];
var obj = JSON.parse(text);
//Main Div .................
var dvmain = document.getElementById("dvMain").style; var oldimage = "";
if (obj.Display == undefined) {//No Display
    $("#dvContiner").hide();
    $("#dv_Id1").show();

    $("#hdn_FileName").val(obj.Image);
    if (obj.Image.indexOf('http://') > -1 || obj.Image.indexOf('https://') > -1 || obj.Image.indexOf('www.//') > -1 || obj.Image.indexOf('//www.') > -1 ||
        obj.Image.indexOf('//') > -1) {
        document.getElementById("dvField").innerHTML = '<img id=field_Id src=' + obj.Image + ' style="width:100%;"/>';
        $("#txtImageUrlId").val(obj.Image);
    }
    else {
        document.getElementById("dvField").innerHTML = "<img id=field_Id src='../../images/MobileEngagementUploads/" + obj.Image.toString().replace(/%20/g, " ") + "' style='width:100%;'/>";
        $("#txtImageUrlId").val(cdnpath + 'MobileEngagementUploads/' + obj.Image);
    }
    $("input[name=ImgUrlId][value='1']").prop("checked", true);
    $("#txtImageUrlId").prop("disabled", false);
    $("#fileuploadId").prop("disabled", true);
    $("#file_uploadId").prop("disabled", true);
    //$("#fileuploadId").css("background", "#A2A2A2");
    $("#txtIntervalId").val(obj.Interval);
    if (obj.Redirect.indexOf("http://") > -1 || obj.Redirect.indexOf("https://") > -1) {
        $("#txtExternalUrl").val(obj.Redirect);
        $("#NameDataContainerHideShowId").hide();
        $("#DrpSelectRedirectToScreenId").prop("disabled", true);
        $("input[name=RedirectId][value='2']").prop("checked", true);
        $("#txtExternalUrl").prop("disabled", false);
    }
    else {
        $("#DrpSelectRedirectToScreenId").val(obj.Redirect);
        $("input[name=RedirectId][value='1']").prop("checked", true);
        $("#txtExternalUrl").prop("disabled", true);
        $("#DrpSelectRedirectToScreenId").prop("disabled", false);
        var params = obj.Parameter.toString().split(",");
        for (var n = 0; n < params.length; n++) {//Cloning Again
            if (n === 0) {
                $("#IdtxtName0").val(params[n].split("=")[0]);
                $("#IdtxtData0").val(params[n].split("=")[1]);
            }
            else {
                var quantity = $("#NameDataContainerId div").length;
                var clone = $("#IdNameData0").clone(true).attr("id", function () { return this.id + quantity; }).find(":text,:file").val("").end();
                clone.find("input[class^=textBox]").attr("id", function () { return this.id + quantity; });
                clone.find("img").attr("id", function () { return this.id + quantity; }).attr("src", cdnpath + "collapse_minus.png").attr("onclick", "RemoveParamId(" + quantity + ")");
                $("#NameDataContainerId").append(clone);
                $("#IdtxtName0" + quantity).val(params[n].split("=")[0]);
                $("#IdtxtData0" + quantity).val(params[n].split("=")[1]);
                $("#IdNameData0" + quantity).show();
            }
        }
    }
    finalFieldId1 = obj;
}
else {
    $("#dvContiner").show();
    dvmain.backgroundColor = obj.Display.BgColor;
    dvmain.padding = obj.Display.Padding.replace(/,/g, "px ") + "px";
    dvmain.border = "" + obj.Display.BorderWidth + "px solid " + obj.Display.Border + "";
    dvmain.borderRadius = obj.Display.BorderRadius + "px";

    if (obj.Display.Position == "Top") {
        dvmain.top = "285px";
    }
    if (obj.Display.Position == "Center") {
        dvmain.top = "385px";
    }
    if (obj.Display.Position == "Bottom") {
        dvmain.top = "405px";
        //dvmain.bottom = "70px";
    }
    $("input[name=BgImgUrl][value='1']").prop("checked", true);
    if (obj.Display.BgImage.length > 0) {

        if (obj.Display.BgImage.indexOf('http://') > -1 || obj.Display.BgImage.indexOf('https://') > -1 || obj.Display.BgImage.indexOf('www.//') > -1 ||
            obj.Display.BgImage.indexOf('//www.') > -1 || obj.Display.BgImage.indexOf('//') > -1) {
            dvmain.backgroundImage = "url(" + obj.Display.BgImage + ")";
            document.getElementById('txtImageUrlBg').value = obj.Display.BgImage;
        }
        //else if (upldImg == 1)
        //    innerField = '<img id=field-' + fieldNo + ' src="' + $("#hdn_src").val() + '" style="width: 100%;"/>';
        else {
            dvmain.backgroundImage = "url(" + cdnpath + '/MobileEngagementUploads/' + obj.Display.BgImage + ")";
            document.getElementById('txtImageUrlBg').value = cdnpath + '/MobileEngagementUploads/' + obj.Display.BgImage;
        }

        //document.getElementById('txtImageUrlBg').value = obj.Display.BgImage;
        dvmain.backgroundRepeat = "no-repeat";
        //dvmain.backgroundImage = "url(" + obj.Display.BgImage + ")";
    }
    var fheight = (510 * obj.Display.Height) / 100;
    if (obj.Display.Height != '0') {
        document.getElementById("dvMain").style.height = fheight + 'px';
    }
    document.getElementById("chkHeightD").checked = true;
    document.getElementById('ddlPosition').value = obj.Display.Position;
    document.getElementById('ddlAnimation').value = obj.Display.Animation;
    document.getElementById('mtxtBgColor').value = obj.Display.BgColor;
    document.getElementById('mtxtBorderColor').value = obj.Display.Border;
    ////Animation
    if (obj.Display.Animation == "1") {
        $("#dvMain").hide();
        $("#dvMain").show('slide', { direction: 'down' }, 300);
    }
    else if (obj.Display.Animation == "2") {
        $("#dvMain").hide();
        $("#dvMain").show('slide', { direction: 'up' }, 300);
        //$("#dvMobile").hide().slideDown().show();
    }
    else if (obj.Display.Animation == "3") {
        $("#dvMain").hide();
        $("#dvMain").show('slide', { direction: 'right' }, 300);
    }
    else if (obj.Display.Animation == "4") {
        $("#dvMain").hide();
        $("#dvMain").show('slide', { direction: 'left' }, 300);
    }
    document.getElementById('txtInterval').value = obj.Display.Interval;
    //// Close Button
    if (obj.Display.Close == 0) {
        $("#dv_CloseBtn").hide();
    } else {
        $("#dv_CloseBtn").show();
    }
    document.getElementById('ddlClose').value = obj.Display.Close;

    var paddings = obj.Display.Padding.split(/,/);
    Slide('mPaddingl', 0, 100, paddings[3], null);
    Slide('mPaddingt', 0, 100, paddings[0], null);
    Slide('mPaddingr', 0, 100, paddings[1], null);
    Slide('mPaddingb', 0, 100, paddings[2], null);

    Slide('mPaddingall', 0, 100, paddings[0], null);
    if (paddings[0] == paddings[1] && paddings[1] == paddings[2] && paddings[2] == paddings[3]) {
        document.getElementById("mchkPadT").checked = true;
        document.getElementById("mdvPaddingAll").style.display = 'block';
        document.getElementById("mdvPadding").style.display = 'none';
    }
    else {
        document.getElementById("mchkPadS").checked = true;
        document.getElementById("mdvPaddingAll").style.display = 'none';
        document.getElementById("mdvPadding").style.display = 'block';
    }
    Slide('mBorder', 0, 5, obj.Display.BorderWidth, null);
    Slide('mRadius', 0, 25, obj.Display.BorderRadius, null);
    Slide('mHeight', 0, 100, obj.Display.Height, null);

    var finalDisplay = [];
    finalDisplay = obj.Display;

    //Field Div .................
    var getFieldNo = 0, getFieldType = "", innerDvField = "", innerDvField2 = "", innerFinalDvField = "", innerField = "", innerGroupField = "";
    var finalField = [];
    finalField = obj.Fields;
    //var fType, fText, fSize, fColor, fBgColor, fStyle, fBorder, fBorderWidth, fBorderRadius, fMandatory, fWidth, fMargin, fPadding, fAlign, fOrientation, Group, fAction, fMessage, fRedirect, fParameter;
    var gLoop = 0;
    fieldDivBinding(0);
    function fieldDivBinding(New) {
        if (New == 0 || New == 2) {
            $("#dvField").html("");
            if (New == 2)
                innerFinalDvField = "";
            for (var fieldNo = 0; fieldNo < finalField.length; fieldNo++) {
                BindIneerField(fieldNo, 0);
                var bccolor = finalField[fieldNo].BgColor;
                var getAlign = finalField[fieldNo].Align; position = "";
                if (getAlign == 'Center') {
                    getAlign = "0 auto";
                }
                else if (getAlign == 'Top') {
                    position = "position: absolute;top: 0px;";
                }
                else if (getAlign == 'Bottom') {
                    position = "position: absolute;bottom: 0px;";
                }
                var wid = parseInt(fieldNo) + 1;
                var getMargin = finalField[fieldNo].Margin.split(/,/);
                var setMargin = getMargin[1] + "px " + getMargin[2] + "px " + getMargin[3] + "px " + getMargin[0] + "px";
                var getPadding = finalField[fieldNo].Padding.split(/,/);
                var setPadding = getPadding[1] + "px " + getPadding[2] + "px " + getPadding[3] + "px " + getPadding[0] + "px";
                innerDvField = "";

                if (($("#hdn_BannerId").val() == '2' && finalField[fieldNo].Type == 'Img') || ($("#hdn_BannerId").val() == '7' && finalField[fieldNo].Type == 'Tv' && finalField[fieldNo].Text != "Widget - Text")) {
                    innerDvField = '<div id="customWidget' + fieldNo + '" style="height: auto;"><div title="Click to customize widget no ' + wid + '" class="mobilebox" onClick="selectedField(' + fieldNo + ')"  id=dv-' + fieldNo + ' style="cursor: pointer; word-wrap: break-word; background-color:' + bccolor + ';border:' + finalField[fieldNo].BorderWidth + 'px solid ' + finalField[fieldNo].Border + ';border-radius:' + finalField[fieldNo].BorderRadius + 'px;width:' + finalField[fieldNo].Width + '%;margin:' + setMargin + ';Padding:' + setPadding + ';text-align:' + finalField[fieldNo].Orientation + ';margin:' + getAlign + ';float:' + finalField[fieldNo].Align + ';' + position + '" >' + innerField + '</div></div>';
                } else {
                    if (finalField[fieldNo].Type == 'Tv' || finalField[fieldNo].Type == 'Img' || finalField[fieldNo].Type == 'Rb') {
                        innerDvField = '<div id="customWidget' + fieldNo + '" style="height: auto;"><div title="Click to customize widget no ' + wid + '" class="mobilebox" onClick="selectedField(' + fieldNo + ')"  id=dv-' + fieldNo + ' style="cursor: pointer; word-wrap: break-word; background-color:' + bccolor + ';border:' + finalField[fieldNo].BorderWidth + 'px solid ' + finalField[fieldNo].Border + '; border-radius:' + finalField[fieldNo].BorderRadius + 'px; width:' + finalField[fieldNo].Width + '%;margin:' + setMargin + '; Padding:' + setPadding + ';text-align:' + finalField[fieldNo].Orientation + ';margin:' + getAlign + ';float:' + finalField[fieldNo].Align + ';' + position + '" >' + innerField + '</div></div>';
                    }
                    else if (finalField[fieldNo].Type == 'Btn') {
                        innerDvField = '<div id="BtnId' + finalField[fieldNo].Group + '"><div id="customWidget' + fieldNo + '" style="height: auto;"><div title="Click to customize widget no ' + wid + '" class="mobilebox" onClick="selectedField(' + fieldNo + ')"  id=dv-' + fieldNo + ' style="cursor: pointer; word-wrap: break-word; background-color:' + bccolor + ';border:' + finalField[fieldNo].BorderWidth + 'px solid ' + finalField[fieldNo].Border + '; border-radius:' + finalField[fieldNo].BorderRadius + 'px; width:' + finalField[fieldNo].Width + '%;margin:' + setMargin + '; Padding:' + setPadding + ';text-align:' + finalField[fieldNo].Orientation + ';margin:' + getAlign + ';float:' + finalField[fieldNo].Align + ';' + position + '" >' + innerField + '</div></div></div>';
                    }
                    else if (finalField[fieldNo].Type == 'Rg' || finalField[fieldNo].Type == 'Cb') {
                        innerDvField = '<div id="customWidget' + fieldNo + '" style="height: auto;"><div title="Click to customize widget no ' + wid + '" class="mobilebox" onClick="selectedField(' + fieldNo + ')"  id=dv-' + fieldNo + ' style="cursor: pointer; word-wrap: break-word; margin:' + finalField[fieldNo].Margin.replace(/,/g, "px ") + "px" + ';margin:' + getAlign + '; width:' + finalField[fieldNo].Width + '%; float:' + finalField[fieldNo].Align + '; Padding:' + setPadding + '; border-radius:' + finalField[fieldNo].BorderRadius + 'px; background-color:' + finalField[fieldNo].BgColor + '; border:' + finalField[fieldNo].BorderWidth + 'px solid ' + finalField[fieldNo].Border + '" >' + innerField + '</div></div>';
                    } else
                        innerDvField = '<div id="customWidget' + fieldNo + '" style="height: auto;"><div title="Click to customize widget no ' + wid + '" class="mobilebox" onClick="selectedField(' + fieldNo + ')"  id=dv-' + fieldNo + ' style="cursor: pointer; word-wrap: break-word; margin:' + finalField[fieldNo].Margin.replace(/,/g, "px ") + "px" + ';margin:' + getAlign + '; width:' + finalField[fieldNo].Width + '%; float:' + finalField[fieldNo].Align + ';" >' + innerField + '</div></div>';//width: ' + finalField[fieldNo].Width + '%;
                }
                ////

                //Horizontally align..........................................................
                var group = finalField[fieldNo].Group;
                if (group != '1') {
                    gLoop = gLoop + 1;
                    innerGroupField += innerDvField
                    if (group == gLoop) {
                        innerDvField = "<div id='dv_BtnId" + finalField[fieldNo].Group + "'>" + innerGroupField + "</div>";
                        innerGroupField = "1"; gLoop = 0;
                    }
                }
                if (innerGroupField == "1") {
                    innerFinalDvField += innerDvField;
                    innerGroupField = "";
                }
                else if (group == '1') {
                    innerFinalDvField += innerDvField;
                }
            }
            document.getElementById("dvField").innerHTML = innerFinalDvField;
        } else {
            fieldNo = finalField.length - 1;
            BindIneerField(fieldNo, 0);
            var bccolor = finalField[fieldNo].BgColor;
            var getAlign = finalField[fieldNo].Align; position = "";
            if (getAlign == 'Center') {
                getAlign = "0 auto";
            }
            else if (getAlign == 'Top') {
                position = "position: absolute;top: 0px;";
            }
            else if (getAlign == 'Bottom') {
                position = "position: absolute;bottom: 0px;";
            }
            var wid = parseInt(fieldNo) + 1;
            var getMargin = finalField[fieldNo].Margin.split(/,/);
            var setMargin = getMargin[1] + "px " + getMargin[2] + "px " + getMargin[3] + "px " + getMargin[0] + "px";
            var getPadding = finalField[fieldNo].Padding.split(/,/);
            var setPadding = getPadding[1] + "px " + getPadding[2] + "px " + getPadding[3] + "px " + getPadding[0] + "px";
            innerDvField2 = "";
            if (finalField[fieldNo].Type == 'Tv')
                innerDvField2 = '<div id="customWidget' + fieldNo + '" style="height: auto;"><div title="Click to customize widget no ' + wid + '" class="mobilebox" onClick="selectedField(' + fieldNo + ')"  id=dv-' + fieldNo + ' style="cursor: pointer; word-wrap: break-word; background-color:' + bccolor + ';border:' + finalField[fieldNo].BorderWidth + 'px solid ' + finalField[fieldNo].Border + '; border-radius:' + finalField[fieldNo].BorderRadius + 'px; width:' + finalField[fieldNo].Width + '%;margin:' + setMargin + '; Padding:' + setPadding + ';text-align:' + finalField[fieldNo].Orientation + ';margin:' + getAlign + ';float:' + finalField[fieldNo].Align + ';' + position + '" >' + innerField + '</div></div>';
            innerFinalDvField = "";
            innerFinalDvField = $("#dvField").html();
            innerFinalDvField += innerDvField2;
            document.getElementById("dvField").innerHTML = innerFinalDvField;
        }

        for (var i = 0; i < finalField.length; i++) {
            if ($("#hdn_BannerId").val() == '4' || $("#hdn_BannerId").val() == '5')
                $("#customWidget" + i).css("height", "auto");
            else
                $("#customWidget" + i).css("height", $("#dv-" + i).height() + 15);
        }
    }
}
function BindIneerField(fieldNo, first) {
    var getstyle = "font-weight: " + finalField[fieldNo].Style + "; ";
    $("input[name=ImgUrl][value='1']").prop("checked", true);
    if (finalField[fieldNo].Style == 'Bold_Italic') {
        getstyle += "font-weight: Bold; ";
        getstyle += "font-style: italic;";
    }
    else if (finalField[fieldNo].Style == 'Italic') {
        getstyle += "font-weight: normal; ";
        getstyle += "font-style: italic;";
    }
    if (finalField[fieldNo].Type == 'Tv' || finalField[fieldNo].Type == 'Btn') {
        innerField = '<span  id=field-' + fieldNo + ' style="font-size:' + finalField[fieldNo].Size + 'px;color:' + finalField[fieldNo].Color + ';' + getstyle + ';">' + finalField[fieldNo].Text/*.replace(/&lt;/g, "<").replace(/&gt;/g, ">")*/ + '</span>';
    }
    else if (finalField[fieldNo].Type == 'Img') {
        if ($("#hdn_FileName").val() != "" && upldImg == 1) {
            finalField[fieldNo].ImageUrl = $("#hdn_FileName").val();
            $("#txtImageUrl").val($("#hdn_FileName").val());
        } else {
            $("#hdn_FileName").val(finalField[fieldNo].ImageUrl);
            $("#txtImageUrl").val(finalField[fieldNo].ImageUrl);
        }

        if (obj.Fields[fieldNo].ImageUrl.indexOf('http://') > -1 || obj.Fields[fieldNo].ImageUrl.indexOf('https://') > -1 ||
            obj.Fields[fieldNo].ImageUrl.indexOf('www.//') > -1 || obj.Fields[fieldNo].ImageUrl.indexOf('//www.') > -1 || obj.Fields[fieldNo].ImageUrl.indexOf('//') > -1) {
            innerField = '<img id=field-' + fieldNo + ' src="' + finalField[fieldNo].ImageUrl + '" style="width: 100%;"/>';
            //clickImg = 1;
        }
        else if (upldImg == 1) {
            innerField = '<img id=field-' + fieldNo + ' src="' + $("#hdn_src").val() + '" style="width: 100%;"/>';
            oldimage += $("#hdn_src").val() + ",";
        } else
            innerField = '<img id=field-' + fieldNo + ' src="' + cdnpath + 'MobileEngagementUploads/' + finalField[fieldNo].ImageUrl + '" style="width: 100%;"/>';
        oldimage += finalField[fieldNo].ImageUrl + ",";
    }
    else if (finalField[fieldNo].Type == 'Et') {
        innerField = '<input type="text" id=field-' + fieldNo + ' style="width: ' + (finalField[fieldNo].Width == 100 ? 93 : finalField[fieldNo].Width) + '%;font-size:' + finalField[fieldNo].Size + 'px;color:' + finalField[fieldNo].Color + ';' + getstyle + ';background-color:' + finalField[fieldNo].BgColor + ';border:' + finalField[fieldNo].BorderWidth + 'px solid ' + finalField[fieldNo].Border + ';border-radius:' + finalField[fieldNo].BorderRadius + 'px;Padding:' + finalField[fieldNo].Padding.replace(/,/g, "px ") + "px" + ';text-align:' + finalField[fieldNo].Orientation + ';" value="' + finalField[fieldNo].Text + '" />';
    }
    else if (finalField[fieldNo].Type == 'Cd') {
        innerField = '<input type="text" id=field-' + fieldNo + ' style="width: ' + (finalField[fieldNo].Width == 100 ? 93 : finalField[fieldNo].Width) + '%;font-size:' + finalField[fieldNo].Size + 'px;color:' + finalField[fieldNo].Color + ';' + getstyle + ';background-color:' + finalField[fieldNo].BgColor + ';border:' + finalField[fieldNo].BorderWidth + 'px solid ' + finalField[fieldNo].Border + ';border-radius:' + finalField[fieldNo].BorderRadius + 'px;Padding:' + finalField[fieldNo].Padding.replace(/,/g, "px ") + "px" + ';text-align:' + finalField[fieldNo].Orientation + ';" value="' + finalField[fieldNo].Text + '" />';
        $('#txtTextDateTime').attr('onclick', 'DatePicker("field-' + fieldNo + '");');
        $("#txtTextDateTime").attr('data-format', 'yyyy-MM-dd hh:mm:ss');
    }
    else if (finalField[fieldNo].Type == 'Rg') {
        var intext = finalField[fieldNo].Text.split(/,/); var option = "";
        for (i = 0; i < intext.length; i++) {
            option += '<input type="radio"><span type="radio" id=field-' + fieldNo + ' style="font-size:' + finalField[fieldNo].Size + 'px;color:' + finalField[fieldNo].Color + ';' + getstyle + ';Padding:' + finalField[fieldNo].Padding.replace(/,/g, "px ") + "px" + ';text-align:' + finalField[fieldNo].Orientation + ';" >' + intext[i] + '</span>';
        }
        innerField = option;
    }
    else if (finalField[fieldNo].Type == 'Cb') {
        innerField = '<input type="checkbox"><span type="radio" id=field-' + fieldNo + ' style="font-size:' + finalField[fieldNo].Size + 'px;color:' + finalField[fieldNo].Color + ';' + getstyle + ';Padding:' + finalField[fieldNo].Padding.replace(/,/g, "px ") + "px" + ';text-align:' + finalField[fieldNo].Orientation + ';background-color:' + finalField[fieldNo].BgColor + ';" >' + finalField[fieldNo].Text + '</span>';
    }
    else if (finalField[fieldNo].Type == 'Sp') {
        var intext = finalField[fieldNo].Text.split(/,/); var option = "";
        for (i = 0; i < intext.length; i++) {
            option += "<option value=" + intext[i] + ">" + intext[i] + "</option>";
        }
        innerField = '<select id=field-' + fieldNo + ' style="width: ' + finalField[fieldNo].Width + '%;font-size:' + finalField[fieldNo].Size + 'px;color:' + finalField[fieldNo].Color + ';' + getstyle + ';Padding:' + finalField[fieldNo].Padding.replace(/,/g, "px ") + "px" + ';text-align:' + finalField[fieldNo].Orientation + ';background-color:' + finalField[fieldNo].BgColor + ';border:' + finalField[fieldNo].BorderWidth + 'px solid ' + finalField[fieldNo].Border + ';border-radius:' + finalField[fieldNo].BorderRadius + 'px;" >' + option + '</Select>';
    }
    else if (finalField[fieldNo].Type == 'Rb') {
        var img = '';
        for (i = 0; i < parseInt(finalField[fieldNo].Text); i++) {
            img += '<img style="width: 30px;" src="/images/MobileEngagement/starclicked.png" />';
        }
        innerField = '<div id=field-' + fieldNo + '>' + img + '</div>';
    }
    if (first == 1) {
        if (finalField[fieldNo].Type == 'Tv' || finalField[fieldNo].Type == 'Btn' || finalField[fieldNo].Type == 'Cb' || finalField[fieldNo].Type == 'Rg') {
            document.getElementById("dv-" + fieldNo).style.backgroundColor = finalField[fieldNo].BgColor;
        }
        $("#field-" + fieldNo).remove();
        document.getElementById("dv-" + fieldNo).innerHTML = innerField;
    }
}
//......................................
var customeName = 0, selectedWid = "", selectId = "", selectedData = "";
function selectedField(fieldNo) {
    selectedWid = fieldNo;
    selectId += fieldNo + ",";
    selectedData = fieldNo;
    $("#lbl_txt").show();
    $("#lbl_txt").html("Text :");
    ////////////
    if (obj.Fields[fieldNo].Type != "Btn") { //// groups/Horizontal allign
        $("#ddlGroup").prop("disabled", true);
        $("#ddlGroup").css("background-color", "#EBEBE4");
    } else {
        $("#ddlGroup").prop("disabled", false);
        $("#ddlGroup").css("background-color", "#FFFFFF");
    }
    ////////////
    if ($("#txtWidgetName").val() === "" && customeName == 1) {
        ShowErrorMessage("Please provide the customize widget name!");
        $("#txtWidgetName").focus();
        return false;
    }
    else if ($("#txtScore").val() === "" && customeName == 1) {
        ShowErrorMessage("Please enter score!");
        $("#txtScore").focus();
        return false;
    }
    if ($("#hdn_BannerId").val() == '4' || $("#hdn_BannerId").val() == '5')
        $("#customWidget" + i).css("height", "auto");
    else
        $("#customWidget" + i).css("height", $("#dv-" + i).height() + 15);
    $("#txtText").show();
    $("#txtTextDateTime").hide();
    customeName = 1;
    $("input[name=dialog][value='1']").prop("checked", true);
    document.getElementById("dvWidget").style.display = 'block';
    document.getElementById("dvContiner").style.display = 'none';
    var wid = parseInt(fieldNo) + 1;
    document.getElementById("lblWidget").innerHTML = "Customize Widget No - " + wid;
    getFieldNo = fieldNo;
    getFieldType = obj.Fields[fieldNo].Type;
    //alert(obj.Fields[fieldNo].Type);
    document.getElementById('txtWidgetName').value = obj.Fields[fieldNo].Name;
    document.getElementById('ddlType').value = obj.Fields[fieldNo].Type;
    if (obj.Fields[fieldNo].Type != "Tv" && obj.Fields[fieldNo].Type != "Et") {
        $("#txtText").removeClass("taggingVal", "");
    }
    else {
        $("#txtText").addClass(" taggingVal");
    }
    if (obj.Fields[fieldNo].Type == "Img") {
        clickImg = 1;
        if (obj.Fields[fieldNo].ImageUrl.indexOf('http://') > -1 || obj.Fields[fieldNo].ImageUrl.indexOf('https://') > -1 ||
            obj.Fields[fieldNo].ImageUrl.indexOf('www.//') > -1 || obj.Fields[fieldNo].ImageUrl.indexOf('//www.') > -1 || obj.Fields[fieldNo].ImageUrl.indexOf('//') > -1) {
            document.getElementById('txtImageUrl').value = obj.Fields[fieldNo].ImageUrl;
            $("#hdn_FlName").val(obj.Fields[fieldNo].ImageUrl);
        }
        else {
            document.getElementById('txtImageUrl').value = cdnpath + "MobileEngagementUploads/" + obj.Fields[fieldNo].ImageUrl;
            $("#hdn_FlName").val(obj.Fields[fieldNo].ImageUrl);
        }
        $("#dvtxt").hide();
        $("#dvImg").show();
        //$("#lbl_ImgUrl").show();
        //$("#dv_Imgurl").show();
        if ($("#file_upload").val() != "") {
            $("#txtImageUrl").prop("disabled", true);
            $("#fileupload").prop("disabled", false);
            $("#file_upload").prop("disabled", false);
            //$("#txtImageUrl").css("background", "#999");
            $("input[name=ImgUrl][value='2']").prop("checked", true);
        }
        else {
            $("input[name=ImgUrl][value='1']").prop("checked", true);
            $("#txtImageUrl").prop("disabled", false);
            $("#fileupload").prop("disabled", true);
            $("#file_upload").prop("disabled", true);
            //$("#fileupload").css("background", "#A2A2A2");
        }
    }
    else if (obj.Fields[fieldNo].Type == "Cd") {
        $("#lbl_txt").html("Countdown Date :");
        $('#txtTextDateTime').attr('onclick', 'DatePicker("field-' + fieldNo + '");');
        $("#txtTextDateTime").attr('data-format', 'yyyy-MM-dd hh:mm:ss');
        $("#txtText").hide();
        $("#txtTextDateTime").show();
        $("#dvtxt").show();
        document.getElementById('txtTextDateTime').value = obj.Fields[fieldNo].Text;
        $("#dvImg").hide();
    }
    else {
        $("#dvtxt").show();
        document.getElementById('txtText').value = obj.Fields[fieldNo].Text.replace(/amp;/g, "").replace(/&lt;/g, "<").replace(/&gt;/g, ">");
        $("#dvImg").hide();
        //$("#lbl_ImgUrl").hide();
        //$("#dv_Imgurl").hide();
    }
    if (obj.Fields[fieldNo].Type == "Img" || obj.Fields[fieldNo].Type == "Tv" || obj.Fields[fieldNo].Type == "Btn") {
        $("#dv_Action").show();
    } else {
        $("#dv_Action").hide();
    }
    document.getElementById('txtScore').value = obj.Fields[fieldNo].Score;
    document.getElementById('ddlCategory').value = (obj.Fields[fieldNo].Category == "" ? "None" : obj.Fields[fieldNo].Category);
    document.getElementById('ddlAlign').value = obj.Fields[fieldNo].Align;
    document.getElementById('ddlOrientation').value = obj.Fields[fieldNo].Orientation;
    document.getElementById('txtColor').value = obj.Fields[fieldNo].Color;
    document.getElementById('ddlStyle').value = obj.Fields[fieldNo].Style;
    document.getElementById('txtColor').style.backgroundColor = obj.Fields[fieldNo].Color;
    document.getElementById('txtBgColor').value = obj.Fields[fieldNo].BgColor;
    document.getElementById('txtBgColor').style.backgroundColor = obj.Fields[fieldNo].BgColor;
    document.getElementById('txtBorderColor').value = obj.Fields[fieldNo].Border;
    document.getElementById('txtBorderColor').style.backgroundColor = obj.Fields[fieldNo].Border;
    document.getElementById('ddlMandatory').value = obj.Fields[fieldNo].Mandatory;
    document.getElementById('ddlGroup').value = obj.Fields[fieldNo].Group;

    /// Action
    $("#dv_1").hide(); $("#dv_2").hide(); $("#dv_3").hide(); $("#dv_4").hide(); $("#dv_5").hide(); $("#dv_6").hide(); $("#dv_7").hide(); $("#dv_8").hide(); $("#dv_9").hide(); $("#dv_10").hide();
    $("#ddlActionType").val(obj.Fields[fieldNo].Action == "" ? "0" : obj.Fields[fieldNo].Action);
    document.getElementById('txtMessage').value = obj.Fields[fieldNo].Message;
    if (obj.Fields[fieldNo].Redirect != "" && obj.Fields[fieldNo].Redirect != null) {
        if (obj.Fields[fieldNo].Action == "Screen") {
            $("#dv_1").show();
            $("#DrpSelectRedirectToScreen").val(obj.Fields[fieldNo].Redirect);
            if (obj.Fields[fieldNo].Parameter != "") {
                var k2 = obj.Fields[fieldNo].Parameter.split(",");
                for (var n3 = 0; n3 < k2.length; n3++) {
                    if (n3 === 0) {
                        $("#NameDataContainerHideShow").show();
                        $("#txtName0").val(k2[n3].split("=")[0]);
                        $("#txtData0").val(k2[n3].split("=")[1]);
                    }
                    else {
                        var quantity = $("#NameDataContainer div").length;
                        var clone = $("#NameData0").clone(true).attr("id", function () { return this.id + quantity; }).find(":text,:file").val("").end();
                        clone.find("input[class^=textBox]").attr("id", function () { return this.id + quantity; });
                        clone.find("img").attr("id", function () { return this.id + quantity; }).attr("src", cdnpath + "images/collapse_minus.png").attr("onclick", "RemoveParam(" + quantity + ")");
                        $("#NameDataContainer").append(clone);
                        $("#txtName0" + quantity).val(k2[n3].split("=")[0]);
                        $("#txtData0" + quantity).val(k2[n3].split("=")[1]);
                        $("#NameData0" + quantity).show();
                    }
                }
            }
        }
        else if (obj.Fields[fieldNo].Action == "Deeplink") {
            $("#dv_2").show();
            $("#txtDeepLinkUrl").val(obj.Fields[fieldNo].Redirect);
            if (obj.Fields[fieldNo].Parameter != "") {
                var k2 = obj.Fields[fieldNo].Parameter.split(",");
                for (var n3 = 0; n3 < k2.length; n3++) {
                    if (n3 === 0) {
                        $("#NameDataContainerHideShow_A").show();
                        $("#txtName_A0").val(k2[n3].split("=")[0]);
                        $("#txtData_A0").val(k2[n3].split("=")[1]);
                    }
                    else {
                        var quantity = $("#NameDataContainer_A div").length;
                        var clone = $("#NameData_A0").clone(true).attr("id", function () { return this.id + quantity; }).find(":text,:file").val("").end();
                        clone.find("input[class^=textBox]").attr("id", function () { return this.id + quantity; });
                        clone.find("img").attr("id", function () { return this.id + quantity; }).attr("src", cdnpath + "collapse_minus.png").attr("onclick", "RemoveExternalParam(" + quantity + ")");
                        $("#NameDataContainer_A").append(clone);
                        $("#txtName_A0" + quantity).val(k2[n3].split("=")[0]);
                        $("#txtData_A0" + quantity).val(k2[n3].split("=")[1]);
                    }
                }
            }
        }
        else if (obj.Fields[fieldNo].Action == "Browser") {
            $("#dv_3").show();
            $("#ui_txtClickExternal0").val(obj.Fields[fieldNo].Redirect);
        }
        else if (obj.Fields[fieldNo].Action == "Copy") {
            $("#dv_4").show();
            $("#ui_txtClickCopy0").val(obj.Fields[fieldNo].Redirect);

        }
        else if (obj.Fields[fieldNo].Action == "Call") {
            $("#dv_5").show();
            $("#ui_txtClickCall0").val(obj.Fields[fieldNo].Redirect);
        }
        else if (obj.Fields[fieldNo].Action == "Share") {
            $("#dv_6").show();
            $("#ui_txtClickShare10").val(obj.Fields[fieldNo].Redirect);
            $("#ui_txtClickShare20").val(obj.Fields[fieldNo].Parameter);
        }
        else if (obj.Fields[fieldNo].Action == "Reminder") {
            $("#dv_7").show();
            $("#ui_ddlClickRemind0").val(obj.Fields[fieldNo].Redirect);
            $("#ui_txtClickRemind0").val(obj.Fields[fieldNo].Parameter);
        }
        else if (obj.Fields[fieldNo].Action == "Event") {
            $("#dv_8").show();
            $("#ui_txtClickEvent10").val(obj.Fields[fieldNo].Redirect);
            $("#ui_txtClickEvent20").val(obj.Fields[fieldNo].Parameter);
        }
        else if (obj.Fields[fieldNo].Action == "Sms") {
            $("#dv_9").show();
            $("#ui_txtClickTxtMessage10").val(obj.Fields[fieldNo].Redirect);
            $("#ui_txtClickTxtMessage20").val(obj.Fields[fieldNo].Parameter);
        }
        else if (obj.Fields[fieldNo].Action == "Permission") {
            $("#dv_10").show();
            //$("#ui_txtClickPrmission0").val(obj.Fields[fieldNo].Redirect);
            var products = obj.Fields[fieldNo].Redirect.split(",");
            for (var i = 0; i < products.length; i++) {
                var idAndLabel = products[i]
                var data = new Array();
                data["item"] = new Array();
                data.item.value = idAndLabel;
                data.item.label = idAndLabel;
                AppendSelected("ui_txtClickPrmission0_values", data, "AddedPermission");
            }
        }
    }

    $("input[name=dialog][value=" + obj.Fields[fieldNo].CloseDialog + "]").prop("checked", true);
    if (obj.Fields[fieldNo].Action == "Cancel") {
        $("input[name=dialog][value='1']").prop("checked", true);
        $("#chkDialogNo").prop("disabled", true);
    } else {
        $("#chkDialogNo").prop("disabled", false);
    }

    Slide('Width', 0, 100, obj.Fields[fieldNo].Width, fieldNo);
    Slide('Size', 0, 100, obj.Fields[fieldNo].Size, fieldNo);
    Slide('Border', 0, 5, obj.Fields[fieldNo].BorderWidth, fieldNo);
    Slide('Radius', 0, 25, obj.Fields[fieldNo].BorderRadius, fieldNo);

    var margins = obj.Fields[fieldNo].Margin.split(/,/);
    Slide('Marginl', 0, 100, margins[0], fieldNo);
    Slide('Margint', 0, 100, margins[1], fieldNo);
    Slide('Marginr', 0, 100, margins[2], fieldNo);
    Slide('Marginb', 0, 100, margins[3], fieldNo);

    Slide('Marginall', 0, 100, margins[0], fieldNo);
    if (margins[0] == margins[1] && margins[1] == margins[2] && margins[2] == margins[3]) {
        document.getElementById("chkMarT").checked = true;
        document.getElementById("dvMarginAll").style.display = 'block';
        document.getElementById("dvMargin").style.display = 'none';
    }
    else {
        document.getElementById("chkMarS").checked = true;
        document.getElementById("dvMarginAll").style.display = 'none';
        document.getElementById("dvMargin").style.display = 'block';
    }
    var paddings = obj.Fields[fieldNo].Padding.split(/,/);
    Slide('Paddingl', 0, 100, paddings[0], fieldNo);
    Slide('Paddingt', 0, 100, paddings[1], fieldNo);
    Slide('Paddingr', 0, 100, paddings[2], fieldNo);
    Slide('Paddingb', 0, 100, paddings[3], fieldNo);

    Slide('Paddingall', 0, 100, paddings[0], fieldNo);
    if (paddings[0] == paddings[1] && paddings[1] == paddings[2] && paddings[2] == paddings[3]) {
        document.getElementById("chkPadT").checked = true;
        document.getElementById("dvPaddingAll").style.display = 'block';
        document.getElementById("dvPadding").style.display = 'none';
    }
    else {
        document.getElementById("chkPadS").checked = true;
        document.getElementById("dvPaddingAll").style.display = 'none';
        document.getElementById("dvPadding").style.display = 'block';
    }
    document.getElementById("dvCategory").style.display = 'none';
    if (obj.Fields[fieldNo].Type == 'Et') { document.getElementById("dvCategory").style.display = 'block'; };
}
function BindIneerHtml(getvar, mfield, fieldNo) {
    //padding main container............................
    if (mfield.indexOf('mPadding') > -1) {
        var pl, pt, pr, pb;
        var paddings = finalDisplay.Padding.split(/,/);
        pl = paddings[3]; pt = paddings[0]; pr = paddings[1]; pb = paddings[2];

        if (mfield == 'mPaddingl') {
            pl = getvar;
            document.getElementById("dvField").style.paddingLeft = getvar + 'px';
        }
        else if (mfield == 'mPaddingt') {
            pt = getvar;
            document.getElementById("dvField").style.paddingTop = getvar + 'px';
        }
        else if (mfield == 'mPaddingr') {
            pr = getvar;
            document.getElementById("dvField").style.paddingRight = getvar + 'px';
        }
        else if (mfield == 'mPaddingb') {
            pb = getvar;
            document.getElementById("dvMain").style.paddingBottom = getvar + 'px';
        }
        else if (mfield == 'mPaddingall') {
            pl = getvar; pt = getvar; pr = getvar; pb = getvar;

            Slide('mPaddingl', 0, 100, getvar, fieldNo);
            Slide('mPaddingt', 0, 100, getvar, fieldNo);
            Slide('mPaddingr', 0, 100, getvar, fieldNo);
            Slide('mPaddingb', 0, 100, getvar, fieldNo);

            document.getElementById("dvField").style.paddingLeft = getvar + 'px';
            document.getElementById("dvField").style.paddingTop = getvar + 'px';
            document.getElementById("dvField").style.paddingRight = getvar + 'px';
            document.getElementById("dvMain").style.paddingBottom = getvar + 'px';
        }
        finalDisplay.Padding = pt + "," + pr + "," + pb + "," + pl;
    }
    else if (mfield == 'mBorder') {
        finalDisplay.BorderWidth = getvar;
        document.getElementById("dvMain").style.borderWidth = getvar + 'px';
    }
    else if (mfield == 'mRadius') {
        finalDisplay.BorderRadius = getvar;
        document.getElementById("dvMain").style.borderRadius = getvar + 'px';
    }
    else if (mfield == 'mHeight') {
        finalDisplay.Height = getvar;
        var height = (510 * getvar) / 100;
        if (getvar != '0') {
            document.getElementById("dvMain").style.height = height + 'px';
        }
    }
    //manage widgets............................
    else if (mfield == 'Width') {
        var editid = "dv-" + fieldNo;
        if (getFieldType == 'Et' || getFieldType == 'Sp') {
            editid = "field-" + fieldNo;
        }
        finalField[fieldNo]["Width"] = getvar;
        document.getElementById(editid).style.width = getvar + '%';
    }
    else if (mfield == 'Size') {
        finalField[fieldNo]["Size"] = getvar;
        document.getElementById("field-" + fieldNo).style.fontSize = getvar + 'px';
    }
    else if (mfield == 'Border') {
        var editid = "dv-" + fieldNo;
        if (getFieldType == 'Et' || getFieldType == 'Sp') {
            editid = "field-" + fieldNo;
        }
        finalField[fieldNo]["BorderWidth"] = getvar;
        document.getElementById(editid).style.borderWidth = getvar + 'px';
    }
    else if (mfield == 'Radius') {
        var editid = "dv-" + fieldNo;
        if (getFieldType == 'Et' || getFieldType == 'Sp') {
            editid = "field-" + fieldNo;
        }
        finalField[fieldNo]["BorderRadius"] = getvar;
        document.getElementById(editid).style.borderRadius = getvar + 'px';
    }
    //margin............................
    else if (mfield.indexOf('Margin') > -1) {
        var ml, mt, mr, mb;
        var margins = finalField[fieldNo].Margin.split(/,/);
        ml = margins[0]; mt = margins[1]; mr = margins[2]; mb = margins[3];

        if (mfield == 'Marginl') {
            ml = getvar;
            document.getElementById("dv-" + fieldNo).style.marginLeft = getvar + 'px';
        }
        else if (mfield == 'Margint') {
            mt = getvar;
            document.getElementById("dv-" + fieldNo).style.marginTop = getvar + 'px';
        }
        else if (mfield == 'Marginr') {
            mr = getvar;
            document.getElementById("dv-" + fieldNo).style.marginRight = getvar + 'px';
        }
        else if (mfield == 'Marginb') {
            mb = getvar;
            document.getElementById("dv-" + fieldNo).style.marginBottom = getvar + 'px';
        }
        else if (mfield == 'Marginall') {
            ml = getvar; mt = getvar; mr = getvar; mb = getvar;

            Slide('Marginl', 0, 100, getvar, fieldNo);
            Slide('Margint', 0, 100, getvar, fieldNo);
            Slide('Marginr', 0, 100, getvar, fieldNo);
            Slide('Marginb', 0, 100, getvar, fieldNo);

            document.getElementById("dv-" + fieldNo).style.marginLeft = getvar + 'px';
            document.getElementById("dv-" + fieldNo).style.marginTop = getvar + 'px';
            document.getElementById("dv-" + fieldNo).style.marginRight = getvar + 'px';
            document.getElementById("dv-" + fieldNo).style.marginBottom = getvar + 'px';
        }
        finalField[fieldNo]["Margin"] = ml + "," + mt + "," + mr + "," + mb;
    }
    //padding............................
    else if (mfield.indexOf('Padding') > -1) {
        var editid = "customWidget" + fieldNo;
        if (getFieldType == 'Et' || getFieldType == 'Sp') {
            editid = "field-" + fieldNo;
        }
        else
            editid = "dv-" + fieldNo;

        var pl, pt, pr, pb;
        var paddings = finalField[fieldNo].Padding.split(/,/);
        pl = paddings[0]; pt = paddings[1]; pr = paddings[2]; pb = paddings[3];

        if (mfield == 'Paddingl') {
            pl = getvar;
            document.getElementById(editid).style.paddingLeft = getvar + 'px';
        }
        else if (mfield == 'Paddingt') {
            pt = getvar;
            document.getElementById(editid).style.paddingTop = getvar + 'px';
        }
        else if (mfield == 'Paddingr') {
            pr = getvar;
            document.getElementById(editid).style.paddingRight = getvar + 'px';
        }
        else if (mfield == 'Paddingb') {
            pb = getvar;
            document.getElementById(editid).style.paddingBottom = getvar + 'px';
        }
        else if (mfield == 'Paddingall') {
            pl = getvar; pt = getvar; pr = getvar; pb = getvar;

            Slide('Paddingl', 0, 100, getvar, fieldNo);
            Slide('Paddingt', 0, 100, getvar, fieldNo);
            Slide('Paddingr', 0, 100, getvar, fieldNo);
            Slide('Paddingb', 0, 100, getvar, fieldNo);

            document.getElementById(editid).style.paddingLeft = getvar + 'px';
            document.getElementById(editid).style.paddingTop = getvar + 'px';
            document.getElementById(editid).style.paddingRight = getvar + 'px';
            document.getElementById(editid).style.paddingBottom = getvar + 'px';
        }
        finalField[fieldNo]["Padding"] = pl + "," + pt + "," + pr + "," + pb;
    }
}
function Slide(div, min, max, init, fieldNo) {
    $('#' + div).slider({
        range: "min",
        min: min,
        max: max,
        value: init,
        slide: function (event, ui) {
            if (div == "Width")
                $('#' + div + "i").val(ui.value + " %");
            else
                $('#' + div + "i").val(ui.value + " px");
            BindIneerHtml(ui.value, div, fieldNo);
        }
    });
    if (div == "Width")
        $('#' + div + "i").val($('#' + div).slider("value") + " %");
    else
        $('#' + div + "i").val($('#' + div).slider("value") + " px");
}
function DatePicker(id) {
    $(".dropdown-menu").css("top", $("#txtTextDateTime").position().top + 37);
    $(".dropdown-menu").css("left", $("#txtTextDateTime").position().left + 2);
    $('#txtTextDateTime').datetimepicker({
        language: 'pt-BR'
    });
    $("#txtTextDateTime").attr('data-format', 'yyyy-MM-dd hh:mm:ss');
    if ($("#txtTextDateTime").val() != "" && $("#ddlType").val() == "Cd") {
        document.getElementById("field-" + getFieldNo).value = $("#txtTextDateTime").val();
        $("#txtText").val($("#txtTextDateTime").val());
        finalField[getFieldNo]["Text"] = $("#txtTextDateTime").val();
    }
}
var DeepLinkValid = 0, ExternlaValid = 0;
function ChangeText(mfield, text) {
    if ($("#ddlType").val() != "Img")
        $("#lbl_txt").show();
    $("#txtText").show();
    $("#txtTextDateTime").hide();
    switch (mfield) {
        case "mBgColor":
            dvmain.backgroundColor = text;
            finalDisplay.BgColor = text;
            break;
        case "mBorderColor":
            dvmain.borderColor = text;
            finalDisplay.Border = text;
            break;
        case "Interval":
            finalDisplay.Interval = text;
            break;
        case "BGImage":
            //document.getElementById("dvMain").innerHTML = '<img id=field_Id src=' + text + ' style="width:100%;"/>';
            dvmain.backgroundImage = "url(" + text + ")";
            dvmain.backgroundRepeat = "no-repeat";
            finalDisplay.BgImage = text;
            break;
        case "ContentImg":
            document.getElementById("dv-" + getFieldNo).innerHTML = '<img id=field-' + getFieldNo + ' src=' + text + ' style="width:100%;"/>';
            $("#lbl_txt").hide();
            break;
        case "Text":
            switch (getFieldType) {
                case "Et":
                    document.getElementById("field-" + getFieldNo).value = text;
                    break;
                case "Sp":
                    var intext = text.split(/,/); var option = "";
                    for (i = 0; i < intext.length; i++)
                        option += "<option value=" + intext[i] + ">" + intext[i] + "</option>";

                    document.getElementById("field-" + getFieldNo).innerHTML = option;
                    break;
                case "Rb":
                    var img = '';
                    for (i = 0; i < parseInt(finalField[getFieldNo].Text); i++)
                        img += '<img style="width: 30px;" src="/images/MobileEngagement/starclicked.png" />';

                    innerField = '<div id=field-' + getFieldNo + '>' + img + '</div>';
                    document.getElementById("dv-" + getFieldNo).innerHTML = innerField;
                    break;
                case "Img":
                    document.getElementById("dv-" + getFieldNo).innerHTML = '<img id=field-' + getFieldNo + ' src=' + text + ' style="width:100%;"/>';
                    $("#lbl_txt").hide();
                    break;
                case "Cd":
                    document.getElementById("field-" + getFieldNo).value = text;
                    break;
                default:
                    document.getElementById("field-" + getFieldNo).innerHTML = text.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;");
                    break;
            }
            finalField[getFieldNo]["Text"] = text;
            break;
        case "Color":
            document.getElementById("field-" + getFieldNo).style.color = text;
            finalField[getFieldNo]["Color"] = text;
            break;
        case "BgColor":
            var editid = "dv-" + getFieldNo;
            if (getFieldType == 'Et' || getFieldType == 'Sp')
                editid = "field-" + getFieldNo;
            document.getElementById(editid).style.backgroundColor = text;
            finalField[getFieldNo]["BgColor"] = text;
            break;
        case "BorderColor":
            var editid = "dv-" + getFieldNo;
            if (getFieldType == 'Et' || getFieldType == 'Sp')
                editid = "field-" + getFieldNo;
            document.getElementById(editid).style.borderColor = text;
            finalField[getFieldNo]["Border"] = text;
            break;
        case "Name":
            finalField[getFieldNo]["Name"] = text;
            break;
        case "Score":
            finalField[getFieldNo]["Score"] = text;
            break;
        case "Message":
            finalField[getFieldNo]["Message"] = text;
            break;
        case "DeepLink":
            finalField[getFieldNo]["Redirect"] = (text == "Please provide the URL" ? "" : text);
            finalField[getFieldNo]["Parameter"] = "";
            break;
        case "RedirectToScreen":
            finalField[getFieldNo]["Redirect"] = text;
            break;
        case "RedirectToScreenPrm":
            finalField[getFieldNo]["Redirect"] = GetListDataBySpanId($("#ui_txtClickPrmission0_values"), "value", "AddedPermission").join(",");
            finalField[getFieldNo]["Redirect"] = finalField[getFieldNo]["Redirect"].replace("-", "~");
            break;
        //case "RedirectToScreen":
        //    finalField[getFieldNo]["Redirect"] = value;
        //    break;
        case "RedirectToScreenId": // For Id fst one.
            finalFieldId1["Redirect"] = text;
            break;
        case "RedirectToScreenD":
            if (text.indexOf(".") > -1) {
                finalField[getFieldNo]["Redirect"] = text;
                DeepLinkValid = 0;
            } else {
                DeepLinkValid = 1;
                ShowErrorMessage("Please provide valid Url!");
            }
            break;
        case "RedirectToScreenE":
            if (text.indexOf("http") > -1 && text.indexOf("http") == 0) {
                finalField[getFieldNo]["Redirect"] = text;
                ExternlaValid = 0;
            } else {
                ExternlaValid = 1;
                ShowErrorMessage("Please provide valid Url!");
            }
            break;
        case "ParameterValues":
            finalField[getFieldNo]["Parameter"] = text;
            break;
        case "Parameter":
            var datas = "";
            for (var m = 0; m < $("#NameDataContainer div").length; m++) {
                var b = m === 0 ? "" : m;
                datas += $("#txtName0" + b).val().trim() + "=" + $("#txtData0" + b).val().trim() + ",";
            }
            datas = datas.slice(0, -1);
            datas = datas == "=" ? "" : datas;
            finalField[getFieldNo]["Parameter"] = datas;
            break;
    }
    for (var i = 0; i < finalField.length; i++) {
        if ($("#hdn_BannerId").val() == '4' || $("#hdn_BannerId").val() == '5')
            $("#customWidget" + i).css("height", "auto");
        else
            $("#customWidget" + i).css("height", $("#dv-" + i).height() + 15);
    }
}
function ChangeDDl(mfield, value) {
    $("#txtText").show(); $("#lbl_txt").html("Text :");
    $("#txtTextDateTime").hide();
    switch (mfield) {
        case 'Position':
            dvmain.top = "";
            dvmain.bottom = "";
            if (value == "Top")
                dvmain.top = "285px";
            if (value == "Center")
                dvmain.top = "385px";
            if (value == "Bottom")
                dvmain.top = "405px";
            //dvmain.bottom = "0px";
            finalDisplay.Position = value;
            break;
        case 'Animation':
            if (value == "1") {
                $("#dvMain").hide();
                $("#dvMain").show('slide', { direction: 'down' }, 300);
            }
            else if (value == "2") {
                $("#dvMain").hide();
                $("#dvMain").show('slide', { direction: 'up' }, 300);
                //$("#dvMobile").hide().slideDown().show();
            }
            else if (value == "3") {
                $("#dvMain").hide();
                $("#dvMain").show('slide', { direction: 'right' }, 300);
            }
            else if (value == "4") {
                $("#dvMain").hide();
                $("#dvMain").show('slide', { direction: 'left' }, 300);
            }
            finalDisplay.Animation = value;
            break;
        case 'Close':
            if (value != 0 && ($("#hdn_BannerId").val() != '2' || $("#hdn_BannerId").val() != '7')) {
                $("#dv-0").css("position", "relative").css("top", "-20px");
            }
            else
                $("#dv-0").css("position", "").css("top", "");
            if (value == 0) {
                $("#dv_CloseBtn").hide();
            } else {
                $("#dv_CloseBtn").show();
            }
            finalDisplay.Close = value;
            break;
        case 'Mandatory':
            finalField[getFieldNo]["Mandatory"] = value;
            break;
        case 'Group':
            if ($("#ddlType").val() != "Btn")
                ShowErrorMessage('Horizontally align can change only for Type - Button!');
            HorizontalFields(value);
            finalField[getFieldNo]["Group"] = value;
            break;
        case 'Type':
            getFieldType = value;
            finalField[getFieldNo]["Type"] = value;
            BindIneerField(getFieldNo, 1);
            document.getElementById("dvCategory").style.display = 'none';
            finalField[getFieldNo]["Category"] = "None";
            if (getFieldType == 'Et' || getFieldType == 'Sp') {
                if (getFieldType == 'Et') {
                    document.getElementById("dvCategory").style.display = 'block';
                };
                document.getElementById("dv-" + getFieldNo).style.backgroundColor = '';
                document.getElementById("dv-" + getFieldNo).style.borderWidth = '0px';
            }
            else if (getFieldType == 'Cd') {
                $("#txtText").hide();
                $("#txtTextDateTime").show();
                document.getElementById("dv-" + getFieldNo).style.backgroundColor = '';
                document.getElementById("dv-" + getFieldNo).style.borderWidth = '0px';
                $(".dropdown-menu").css("top", $("#txtTextDateTime").position().top + 37);
                $(".dropdown-menu").css("left", $("#txtTextDateTime").position().left + 2);
                $('#txtTextDateTime').datetimepicker({
                    language: 'pt-BR'
                });
                $("#txtTextDateTime").attr('data-format', 'yyyy-MM-dd hh:mm:ss');
            }
            else {
                document.getElementById("dv-" + getFieldNo).style.backgroundColor = finalField[getFieldNo].BgColor;
                document.getElementById("dv-" + getFieldNo).style.borderWidth = finalField[getFieldNo].BorderWidth + 'px';
            }
            finalField[getFieldNo]["Width"] = 100;
            Slide('Width', 0, 100, 100, getFieldNo);
            document.getElementById("dv-" + getFieldNo).style.width = '100%';
            if (getFieldType == 'Et' || getFieldType == 'Cd')
                document.getElementById("field-" + getFieldNo).style.width = '93%';
            else
                document.getElementById("field-" + getFieldNo).style.width = '100%';
            if (value == "Img") {
                $("#dvImg").show();
                //$("#lbl_ImgUrl").show();
                //$("#dv_Imgurl").show();
                $("#lbl_txt").hide();
                $("#dvtxt").hide();
                //$("#txtText").hide();
                $("#txtImageUrl").prop("disabled", false);
                $("#fileupload").prop("disabled", true);
                $("#file_upload").prop("disabled", true);
            } else {
                $("#dvImg").hide();
                //$("#lbl_ImgUrl").hide();
                //$("#dv_Imgurl").hide();
                $("#lbl_txt").show();
                $("#dvtxt").show();
                //$("#txtText").show();
            }
            if (value != "Tv" && value != "Et") {
                $("#txtText").removeClass("taggingVal", "");
            }
            else {
                $("#txtText").addClass(" taggingVal");
            }
            if (value == "Img" || value == "Tv" || value == "Btn") {
                $("#dv_Action").show();
            } else {
                $("#dv_Action").hide();
            }
            if (value == "Cd")
                $("#lbl_txt").html("Countdown Date :");
            else
                $("#lbl_txt").html("Text :");

            if (value != "Btn") { //// groups/Horizontal allign
                $("#ddlGroup").prop("disabled", true);
                $("#ddlGroup").css("background-color", "#EBEBE4");
            } else {
                $("#ddlGroup").prop("disabled", false);
                $("#ddlGroup").css("background-color", "#FFFFFF");
            }
            break;
        case 'Align':
            var editid = "dv-" + getFieldNo;
            if (getFieldType == 'Et' || getFieldType == 'Sp')
            { editid = "field-" + getFieldNo; }
            document.getElementById(editid).style.position = "relative";
            document.getElementById(editid).style.top = "";
            document.getElementById(editid).style.bottom = "";

            if (value == 'Center') {
                document.getElementById(editid).style.margin = "0 auto";
                document.getElementById(editid).style.float = "";
            }
            else if (value == 'Top') {
                document.getElementById(editid).style.position = "absolute";
                document.getElementById(editid).style.top = "0px";
                document.getElementById(editid).style.bottom = "";
            }
            else if (value == 'Bottom') {
                document.getElementById(editid).style.position = "absolute";
                document.getElementById(editid).style.bottom = "0px";
                document.getElementById(editid).style.top = "";
            }
            else
                document.getElementById(editid).style.float = value;

            finalField[getFieldNo]["Align"] = value;
            break;
        case 'Orientation':
            var editid = "dv-" + getFieldNo;
            if (getFieldType == 'Et' || getFieldType == 'Sp')
                editid = "field-" + getFieldNo;
            document.getElementById(editid).style.textAlign = value;
            finalField[getFieldNo]["Orientation"] = value;
            break;
        case 'Style':
            document.getElementById("field-" + getFieldNo).style.fontWeight = value;
            document.getElementById("field-" + getFieldNo).style.fontStyle = "";

            if (value == 'Bold_Italic') {
                document.getElementById("field-" + getFieldNo).style.fontStyle = "italic";
                document.getElementById("field-" + getFieldNo).style.fontWeight = "Bold";
            }
            else if (value == 'Italic') {
                document.getElementById("field-" + getFieldNo).style.fontStyle = "italic";
                document.getElementById("field-" + getFieldNo).style.fontWeight = "Normal";
            }
            finalField[getFieldNo]["Style"] = value;
            break;
        case 'Category':
            finalField[getFieldNo]["Category"] = value;
            break;
        case "ActionType":
            $("#chkDialogNo").prop("disabled", false);
            $("input[name=dialog][value='1']").prop("checked", true);
            $("#dv_1").hide();
            $("#dv_2").hide();
            $("#dv_3").hide();
            $("#dv_4").hide();
            $("#dv_5").hide();
            $("#dv_6").hide();
            $("#dv_7").hide();
            $("#dv_8").hide();
            $("#dv_9").hide();
            $("#dv_10").hide();
            switch (value) {
                case 'Form':
                    $("input[name=dialog][value='1']").prop("checked", true);
                    break;
                case 'Cancel':
                    $("input[name=dialog][value='1']").prop("checked", true);
                    $("#chkDialogNo").prop("disabled", true);
                    break;
                case 'Screen':
                    $("#dv_1").show();
                    break;
                case 'Deeplink':
                    $("#dv_2").show();
                    break;
                case 'Browser':
                    $("#dv_3").show();
                    break;
                case 'Copy':
                    $("#dv_4").show();
                    break;
                case 'Call':
                    $("#dv_5").show();
                    break;
                case 'Share':
                    $("#dv_6").show();
                    break;
                case 'Reminder':
                    $("#dv_7").show();
                    break;
                case 'Event':
                    $("#dv_8").show();
                    break;
                case 'Sms':
                    $("#dv_9").show();
                    break;
                case 'Permission':
                    $("#dv_10").show();
                    break;
                default:
                    $("#dv_1").hide();
                    $("#dv_2").hide();
                    $("#dv_3").hide();
                    $("#dv_4").hide();
                    $("#dv_5").hide();
                    $("#dv_6").hide();
                    $("#dv_7").hide();
                    $("#dv_8").hide();
                    $("#dv_9").hide();
                    $("#dv_10").hide();
                    break;
            }
            finalField[getFieldNo]["Action"] = value;
            break;
        case "RedirectToScreen":
            finalField[getFieldNo]["Redirect"] = value;
            break;
    }
    for (var i = 0; i < finalField.length; i++) {
        if ($("#hdn_BannerId").val() == '4' || $("#hdn_BannerId").val() == '5')
            $("#customWidget" + i).css("height", "auto");
        else
            $("#customWidget" + i).css("height", $("#dv-" + i).height() + 15);
    }
}
var oldFileds = "";
function HorizontalFields(value) {
    var width = 100; arr = [];
    if (value == 1) {

    } else if (value == 2) {
        width = 49;
    } else {
        width = 32;
    }
    var grp = parseInt(value);
    for (var i = 0; grp > i; i++) {
        var text = '{' +
            '"Type": "Btn",' +
            '"Text": "Field - ' + grp + '",' +
            '"ImageUrl": "",' +
            '"Name": "Field - ' + grp + '",' +
            '"Category": "",' +
            '"Score": "1",' +
            '"Size": "15",' +
            '"Color": "#767676",' +
            '"BgColor": "#EBEBE9",' +
            '"Style": "Bold",' +
            '"Border": "#000000",' +
            '"BorderWidth": "0",' +
            '"BorderRadius": "0",' +
            '"Mandatory": "1",' +
            '"Width": ' + '"' + width + '",' +
            '"Margin": "0,10,0,10",' +
            '"Padding": "0,8,0,8",' +
            '"Align": "Left",' +
            '"Orientation": "Center",' +
            '"Group":' + '"' + grp + '",' +
            '"Action": "",' +
            '"Message": "",' +
            '"Redirect": "",' +
            '"Parameter": "",' +
            '"CloseDialog":"1"}';

        var nobj2 = JSON.parse(text);
        arr.push(nobj2);
    }
    for (var j = 0; (obj['Fields'].length + arr.length) - 1 > j; j++) {
        if (j == selectedData) {

            obj['Fields'].splice(selectedData, selectedData);
            for (k = 0; arr.length > k; k++)
                obj['Fields'].splice(selectedData, 0, arr[k]);
        }
        //else if (j > selectedData) {
        //    obj['Fields'][j + 1];
        //}
    }
    fieldDivBinding(2);
}

$(document).ready(function () {
    $('#txtTextDateTime').click(function (event) {
        event.stopPropagation();
    });
});
$(document).click(function (e) {
    var targetbox = $('.dropdown-menu');
    if (!targetbox.is(e.target) && targetbox.has(e.target).length === 0) {
        $('.dropdown-menu').hide('slow');
        if ($('#txtTextDateTime').val() != "" && $("#ddlType").val() == "Cd") {
            document.getElementById("field-" + getFieldNo).value = $('#txtTextDateTime').val();
            $("#txtText").val($("#txtTextDateTime").val());
            finalField[getFieldNo]["Text"] = $('#txtTextDateTime').val();
        }
    }
});
function changeRb(mvar, value) {
    if (mvar == 'mPadding') {
        if (value == "1") {
            document.getElementById("mdvPaddingAll").style.display = 'block';
            document.getElementById("mdvPadding").style.display = 'none';
        }
        else {
            document.getElementById("mdvPaddingAll").style.display = 'none';
            document.getElementById("mdvPadding").style.display = 'block';
        }
    }
    switch (mvar) {
        case 'mHeight':
            if (value == "1") {
                var height = ($("#dvMain").height() / 510) * 100;
                Slide('mHeight', 0, 100, height, null);
                document.getElementById("dvHeight").style.display = 'block';
            }
            else {
                $("#dvMain").height("");
                document.getElementById("dvHeight").style.display = 'none';
            }
            break;
        case 'Margin':
            if (value == "1") {
                document.getElementById("dvMarginAll").style.display = 'block';
                document.getElementById("dvMargin").style.display = 'none';
            }
            else {
                document.getElementById("dvMarginAll").style.display = 'none';
                document.getElementById("dvMargin").style.display = 'block';
            }
            break;
        case 'Dialog':
            finalField[getFieldNo]["CloseDialog"] = value;
            break;
        default:
            if (value == "1") {
                document.getElementById("dvPaddingAll").style.display = 'block';
                document.getElementById("dvPadding").style.display = 'none';
            }
            else {
                document.getElementById("dvPaddingAll").style.display = 'none';
                document.getElementById("dvPadding").style.display = 'block';
            }
            break;
    }
}
function ChangeT1(type, val) {
    switch (type) {
        case "Parameter":
            var datas = "";
            for (var m = 0; m < $("#NameDataContainerId div").length; m++) {
                var b = m === 0 ? "" : m;
                datas += $("#IdtxtName0" + b).val() + "=" + $("#IdtxtData0" + b).val() + ",";
            }
            datas = datas.slice(0, -1);
            datas = datas == "=" ? "" : datas;
            finalFieldId1["Parameter"] = datas;
            break;
        case "TextImg":
            document.getElementById("dvField").innerHTML = '<img id=field_Id src=' + val + ' style="width:100%;"/>';
            finalFieldId1["Image"] = val;
            //if (val == "")
            //    $("#field_Id").hide();
            //else {
            //    $("#field_Id").show();
            //    $("#span_FileNameId").empty();
            //}
            break;
        case "RedirectToScreen":
            finalFieldId1["Redirect"] = val;
            break;
        case "Deep":
            if (val.indexOf("http") > -1 && val.indexOf("http") == 0) {
                finalFieldId1["Redirect"] = val;
                ExternlaValid = 0;
            } else {
                ExternlaValid = 1;
                ShowErrorMessage("Please provide valid Url!");
            }
            finalFieldId1["Parameter"] = "";
            break;
        case 'Interval':
            finalFieldId1["Interval"] = val;
            break;
    }
}
//Add new widget.....
function NewWidget() {
    var text = '{' +
        '"Type": "Tv",' +
        '"Text": "Widget - Text",' +
        '"ImageUrl": "",' +
        '"Name": "Heading",' +
        '"Category": "",' +
        '"Score": "1",' +
        '"Size": "25",' +
        '"Color": "#767676",' +
        '"BgColor": "#EBEBE9",' +
        '"Style": "Bold",' +
        '"Border": "#000000",' +
        '"BorderWidth": "0",' +
        '"BorderRadius": "0",' +
        '"Mandatory": "1",' +
        '"Width": "95",' +
        '"Margin": "0,10,0,10",' +
        '"Padding": "0,8,0,8",' +
        '"Align": "Center",' +
        '"Orientation": "Center",' +
        '"Group": "1",' +
        '"Action": "",' +
        '"Message": "",' +
        '"Redirect": "",' +
        '"Parameter": "",' +
        '"CloseDialog":"1"}';
    var nobj = JSON.parse(text);

    obj['Fields'].push(nobj);
    //finalField = obj.Fields;
    //innerFinalDvField = "";
    fieldDivBinding(1);
}
function ConfirmedDelete() {
    $("#dvDeletePanel").hide();
    DeleteWidget();
}
function DeleteWidget() {
    //obj['Fields'].splice(getFieldNo, 1);
    //innerFinalDvField = "";
    //fieldDivBinding(0);
    $("#customWidget" + selectedWid).remove();
    var fil = [];
    for (var a = 0; a < finalField.length; a++) {
        if (a != selectedWid)
            fil.push(finalField[a]);
    }
    finalField = fil;
}
////// Image Uploading
$("input[name='ImgUrl']").click(function () {
    if ($(this).val() == 2) {
        $("#txtImageUrl").prop("disabled", true);
        $("#fileupload").prop("disabled", false);
        $("#file_upload").prop("disabled", false);
        //$("#fileupload").css("background", "#565656");
        $("#fileupload").addClass("btn_file");
        $("#fileupload").removeClass("btn_fileDisable");

        if ($("#file_upload").val() != "") {
            var inputVal3 = $("#hdn_src").val();
            $('#field-' + getFieldNo).attr('src', inputVal3);
            $("#field-" + getFieldNo).css("width", "100%");
        } else {
            $('#field-' + getFieldNo).attr('src', '');
        }
    }
    else {
        $("#txtImageUrl").prop("disabled", false);
        $("#fileupload").prop("disabled", true);
        $("#file_upload").prop("disabled", true);
        //$("#fileupload").css("background", "#A2A2A2");
        $("#fileupload").addClass("btn_fileDisable");
        $("#fileupload").removeClass("btn_file");

        if ($("#txtImageUrl").val() != "") {
            var inputVal2 = $("#txtImageUrl").val();
            $("#field-" + getFieldNo).attr("src", inputVal2);
            $("#field-" + getFieldNo).css("width", "100%");
        }
        else {
            $("#field-" + getFieldNo).attr("src", '');
        }
    }
});
////// Image Uploading For Bg
$("input[name='BgImgUrl']").click(function () {
    if ($(this).val() == 2) {
        $("#txtImageUrlBg").prop("disabled", true);
        $("#fileuploadBg").prop("disabled", false);
        $("#file_uploadBg").prop("disabled", false);
        //$("#fileuploadBg").css("background", "#565656");
        $("#fileuploadBg").addClass("btn_file");
        $("#fileuploadBg").removeClass("btn_fileDisable");

        if ($("#file_uploadBg").val() != "") {
            var inputVal3 = $("#hdn_src").val();
            dvmain.backgroundImage = "url(" + inputVal3 + ")";
            dvmain.backgroundRepeat = "no-repeat";
        } else {
            dvmain.backgroundImage = "";
        }
    }
    else {
        $("#txtImageUrlBg").prop("disabled", false);
        $("#fileuploadBg").prop("disabled", true);
        $("#file_uploadBg").prop("disabled", true);
        //$("#fileuploadBg").css("background", "#A2A2A2");
        $("#fileuploadBg").addClass("btn_fileDisable");
        $("#fileuploadBg").removeClass("btn_file");

        if ($("#txtImageUrlBg").val() != "") {
            var inputVal2 = $("#txtImageUrlBg").val();
            dvmain.backgroundImage = "url(" + inputVal2 + ")";
            dvmain.backgroundRepeat = "no-repeat";
        }
        else {
            dvmain.backgroundImage = "";
        }
    }
});
////// Image Uploading For Id = 1
$("input[name='ImgUrlId']").click(function () {
    if ($(this).val() == 2) {
        $("#txtImageUrlId").prop("disabled", true);
        $("#fileuploadId").prop("disabled", false);
        $("#file_uploadId").prop("disabled", false);
        //$("#fileuploadId").css("background", "#565656");
        $("#fileuploadId").addClass("btn_file");
        $("#fileuploadId").removeClass("btn_fileDisable");

        if ($("#file_uploadId").val() != "") {
            var inputVal3 = $("#hdn_src").val();
            $('#field_Id').attr('src', inputVal3);
            $("#field_Id").css("width", "100%");
        }
        else {
            $('#field_Id').attr('src', '');
        }
    }
    else {
        $("#txtImageUrlId").prop("disabled", false);
        $("#fileuploadId").prop("disabled", true);
        $("#file_uploadId").prop("disabled", true);
        //$("#fileuploadId").css("background", "#A2A2A2");
        $("#fileuploadId").addClass("btn_fileDisable");
        $("#fileuploadId").removeClass("btn_file");
        if ($("#txtImageUrlId").val() != "") {
            var inputVal2 = $("#txtImageUrlId").val();
            $("#field_Id").attr("src", inputVal2);
            $("#field_Id").css("width", "100%");
        } else {
            $("#field_Id").attr("src", '');
        }
    }
});
var imageArray = [];
var upldImg = 0;
/// Image Uploading checking
function ImageUpload(Id, inputVal) {
    $("#hdn_FileName").empty();
    if (Id == "")
        $('#span_FileName').empty();
    $("#hdn_ImgId").empty();
    if ($("#file_upload" + Id).val() != "") {
        var Uploadfile = $("#file_upload" + Id).get(0);
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
        choice.url = "../MobileEngagement/FileFormat",
            choice.type = "POST";
        choice.data = fromdata;
        choice.contentType = false;
        choice.processData = false;
        choice.async = false;
        choice.success = function (response) {
            if (response == 0) {
                $("#file_upload" + Id).val('');
                $('#span_FileName' + Id).hide();
                $('#span_error' + Id).html('Please Select Only Image File');
                $('#span_error' + Id).show();
            }
            else {
                var filedata = $("#file_upload").get(0).files;
                $('#span_error' + Id).hide();
                $('#span_FileName' + Id).show();
                $('#span_FileName' + Id).html(response.length > 30 ? response.substring(0, 30) + "..." : response);
                $("#span_FileName" + Id).attr('title', "" + response + "");
                $("#hdn_FileName").val(response);
                $("#hdn_ImgId").val(Id);
                upldImg = 1;
                var reader = new FileReader();
                reader.onload = function (e) {
                    if (Id == "Bg") {
                        dvmain.backgroundImage = "url(" + cdnpath + "MobileEngagementUploads/" + response + ")";
                        dvmain.backgroundRepeat = "no-repeat";
                        $("#hdn_FlNameBg").val(response);
                    }
                    else if (Id != "") {
                        if (cdnpath.indexOf("//") == 0) {
                            document.getElementById("dvField").innerHTML = '<img id=field_Id src=' +
                                (window.location.protocol == "http:" || window.location.protocol == "https:" ? window.location.protocol : "")
                                + cdnpath + "MobileEngagementUploads/" + response + ' style="width:100%;"/>';
                        }
                        else {
                            document.getElementById("dvField").innerHTML = '<img id=field_Id src=' + cdnpath + "MobileEngagementUploads/" + response + ' style="width:100%;"/>';
                        }
                    }
                    else {
                        $("#field-" + getFieldNo).css("width", "100%");

                        if (cdnpath.indexOf("//") == 0) {
                            $('#field-' + getFieldNo).attr('src', (window.location.protocol == "http:" || window.location.protocol == "https:" ? window.location.protocol : "") +
                                cdnpath + "MobileEngagementUploads/" + response);
                        } else {
                            $('#field-' + getFieldNo).attr('src', cdnpath + "MobileEngagementUploads/" + response);
                        }
                        imageArray.push(filedata);
                    }

                    if (cdnpath.indexOf("//") == 0) {
                        $("#hdn_src").val((window.location.protocol == "http:" || window.location.protocol == "https:" ? window.location.protocol : "") +
                            cdnpath + "MobileEngagementUploads/" + response);
                    } else {
                        $("#hdn_src").val(cdnpath + "MobileEngagementUploads/" + response);
                    }

                    if (Id != "Id") {
                        for (var i = 0; i < finalField.length; i++) {
                            if ($("#hdn_BannerId").val() == '4' || $("#hdn_BannerId").val() == '5' || $("#hdn_BannerId").val() == '8')
                                $("#customWidget" + i).css("height", "auto");
                            else
                                $("#customWidget" + i).css("height", $("#dv-" + i).height() + 15);
                        }
                    }
                }
                reader.readAsDataURL(inputVal.files[0]);
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
function dateValidation(dat) {
    var obj = dat;
    var day = obj.split("-")[2];
    var month = obj.split("-")[1];
    var year = obj.split("-")[0];
    if ((day < 1 || day > 31) || (month < 1 && month > 12) && (year.length != 4)) {
        ShowErrorMessage("Invalid Format"); return false;
    }
    else {
        var obj2 = new Date();
        var day2 = obj2.getDate();
        var month2 = obj2.getMonth();
        var year2 = obj2.getFullYear();
        var dt = new Date(year, month - 1, day);
        var today = new Date(year2, month2, day2);
        if (dt < today)
            return true;
        else
            return false;
    }
}
//Saving the campaign
var ImageName = "";
function SaveCampaign() {
    var val123 = 0, RparameterValidation = 0, DparameterValidation = 0;
    var startDt = (new Date($("#ui_txtStartDate").val()).getFullYear() + '-' + (new Date($("#ui_txtStartDate").val()).getMonth() + 1) + '-' + (new Date($("#ui_txtStartDate").val()).getDate() - 1)),
        endDt = (new Date($("#ui_txtExpiryDate").val()).getFullYear() + '-' + (new Date($("#ui_txtExpiryDate").val()).getMonth() + 1) + '-' + (new Date($("#ui_txtExpiryDate").val()).getDate() - 1));
    if ($("#ddlActionType").val() != "Form" || $("#ddlActionType").val() != "Cancel") {
        if ($("#ddlActionType").val() == "Screen") {
            if ($("#DrpSelectRedirectToScreen").val() == "0" || $("#DrpSelectRedirectToScreen").val() == "") {
                val123 = 1;
            }
            else {
                for (var m = 0; m < (d == "" ? $("#NameDataContainer div").length : d); m++) {
                    var b = m === 0 ? "" : m;
                    if ($("#txtName0" + b).val() != "") {
                        if ($("#txtName0" + b).val() != "No matches found" && $("#txtData0" + b).val() == "") {
                            RparameterValidation = 1;
                        }
                        else if ($("#txtName0" + b).val() != "No matches found" && $("#txtData0" + b).val() != "") {
                            RparameterValidation = 0;
                        }
                    }
                }
            }
        }
        else if ($("#ddlActionType").val() == "Deeplink") {
            if ($("#txtDeepLinkUrl").val() == "") {
                val123 = 1;
            }
            else {
                for (var m = 0; m < (e == "" ? $("#NameDataContainer_A div").length : e); m++) {
                    var b = m === 0 ? "" : m;
                    if ($("#txtName_A0" + b).val() != "") {
                        if ($("#txtName_A0" + b).val() != "No matches found" && $("#txtData_A0" + b).val() == "") {
                            DparameterValidation = 1;
                        }
                        else if ($("#txtName_A0" + b).val() != "No matches found" && $("#txtName_A0" + b).val() != "") {
                            DparameterValidation = 0;
                        }
                    }
                }
            }
        }
        else if ($("#ddlActionType").val() == "Browser") {
            if ($("#ui_txtClickExternal0").val() == "") {
                val123 = 1;
            }
        }
        else if ($("#ddlActionType").val() == "Copy") {
            if ($("#ui_txtClickCopy0").val() == "") {
                val123 = 1;
            }
        }
        else if ($("#ddlActionType").val() == "Call") {
            if ($("#ui_txtClickCall0").val() == "") {
                val123 = 1;
            }
        }
        else if ($("#ddlActionType").val() == "Share") {
            if ($("#ui_txtClickShare10").val() == "") {
                val123 = 1;
            }
            else if ($("#ui_txtClickShare20").val() == "") {
                val123 = 1;
            }
        }
        else if ($("#ddlActionType").val() == "Reminder") {
            if ($("#ui_ddlClickRemind0").val() == "0") {
                val123 = 1;
            }
            else if ($("#ui_txtClickRemind0").val() == "") {
                val123 = 1;
            }
        }
        else if ($("#ddlActionType").val() == "Event") {
            if ($("#ui_txtClickEvent10").val() == "") {
                val123 = 1;
            }
            else if ($("#ui_txtClickEvent20").val() == "") {
                val123 = 1;
            }
        }
        else if ($("#ddlActionType").val() == "Sms") {
            if ($("#ui_txtClickTxtMessage10").val() == "") {
                val123 = 1;
            }
            else if ($("#ui_txtClickTxtMessage20").val() == "") {
                val123 = 1;
            }
        }
        else if ($("#ddlActionType").val() == "Permission") {
            if ($("#ui_txtClickPrmission0_values").children().length == 0) {
                val123 = 1;
            }
        }
    }
    //// Id is 1
    var RIdparameterValidation = 0;
    if (parseInt($.urlParam("Id")) == 1 || $("#hdn_BannerId").val() == 1) {
        for (var m = 0; m < (d2 == "" ? $("#NameDataContainerId div").length : d2); m++) {
            var b = m === 0 ? "" : m;
            if ($("#IdtxtName0" + b).val() != "") {
                if ($("#IdtxtName0" + b).val() != "No matches found" && $("#IdtxtData0" + b).val() == "") {
                    RIdparameterValidation = 1;
                }
                else if (($("#IdtxtName0" + b).val() != "" || $("#IdtxtName0" + b).val() != "No matches found") && $("#IdtxtData0" + b).val() != "") {
                    RIdparameterValidation = 0;
                }
            }
        }
    }
    if (parseInt($.urlParam("Id")) == 1 || $("#hdn_BannerId").val() == 1) {
        if ($("#txtName").val() === "" || $("#txtName").val() === "Please enter the campaign name")
            ShowErrorMessage("Please provide the campaign name");
        else if ($("input[name^=ImgUrlId]:checked").val() === "1" && $("#txtImageUrlId").val() == "") {
            ShowErrorMessage("Please provide the image URL");
            return false;
        }
        else if ($("input[name^=ImgUrlId]:checked").val() === "2" && $("#span_FileNameId").text() === "") {
            ShowErrorMessage("Please upload the image");
            return false;
        }
        else if ($("input[name='RedirectId']:checked").val() == "1" && ($("#DrpSelectRedirectToScreenId").val() == "0" || $("#DrpSelectRedirectToScreenId").val() == "")) {
            ShowErrorMessage("Please select Redirect to Screen!");
            return false;
        }
        else if (RIdparameterValidation == 1) {
            ShowErrorMessage("Please provide the all Redirect to screen Parameters");
            return false;
        }
        else if ($("input[name='RedirectId']:checked").val() == "2" && $("#txtExternalUrl").val() == "") {
            ShowErrorMessage("Please enter the External URL!");
            return false;
        }
    }
    if ($("#txtName").val() === "" || $("#txtName").val() === "Please enter the campaign name") {
        ShowErrorMessage("Please provide the campaign name!");
        $("#txtName").focus();
    }
    else if ($("#txtInterval").val() === "") {
        ShowErrorMessage("Please enter the interval value in seconds!");
        $("#txtInterval").focus();
    }
    else if ($("#txtWidgetName").val() === "" && customeName == 1) {
        ShowErrorMessage("Please provide the customize widget name!");
        $("#txtWidgetName").focus();
    }
    else if ($("#txtScore").val() === "") {
        ShowErrorMessage("Please enter score!");
        $("#txtScore").focus();
    }
    else if (val123 == 1) {
        if ($("#ddlActionType").val() != "Form" || $("#ddlActionType").val() != "Cancel") {
            if ($("#ddlActionType").val() == "Screen") {
                if ($("#DrpSelectRedirectToScreen").val() == "0" || $("#DrpSelectRedirectToScreen").val() == "") {
                    ShowErrorMessage("Please select Redirect to Screen!");
                    return false;
                }
            }
            else if ($("#ddlActionType").val() == "Deeplink") {
                if ($("#txtDeepLinkUrl").val() == "") {
                    ShowErrorMessage("Please enter the DeepLink Url!");
                    return false;
                }
            }
            else if ($("#ddlActionType").val() == "Browser") {
                if ($("#ui_txtClickExternal0").val() == "") {
                    ShowErrorMessage("Please enter the External URL!");
                    return false;
                }
            }
            else if ($("#ddlActionType").val() == "Copy") {
                if ($("#ui_txtClickCopy0").val() == "") {
                    ShowErrorMessage("Please enter the Coupon Number!");
                    return false;
                }
            }
            else if ($("#ddlActionType").val() == "Call") {
                if ($("#ui_txtClickCall0").val() == "") {
                    ShowErrorMessage("Please enter the Phone Number!");
                    return false;
                }
            }
            else if ($("#ddlActionType").val() == "Share") {
                if ($("#ui_txtClickShare10").val() == "") {
                    ShowErrorMessage("Please enter the Report!");
                    return false;
                }
                else if ($("#ui_txtClickShare20").val() == "") {
                    ShowErrorMessage("Please enter the Report!");
                    return false;
                }
            }
            else if ($("#ddlActionType").val() == "Reminder") {
                if ($("#ui_ddlClickRemind0").val() == "0") {
                    ShowErrorMessage("Please select the Time!");
                    return false;
                }
                else if ($("#ui_txtClickRemind0").val() == "") {
                    ShowErrorMessage("Please enter the Reminder!");
                    return false;
                }
            }
            else if ($("#ddlActionType").val() == "Event") {
                if ($("#ui_txtClickEvent10").val() == "") {
                    ShowErrorMessage("Please enter the Event Name!");
                    return false;
                }
                else if ($("#ui_txtClickEvent20").val() == "") {
                    ShowErrorMessage("Please enter the Event Value!");
                    return false;
                }
            }
            else if ($("#ddlActionType").val() == "Sms") {
                if ($("#ui_txtClickTxtMessage10").val() == "") {
                    ShowErrorMessage("Please enter the Text Message!");
                    return false;
                }
                else if ($("#ui_txtClickTxtMessage20").val() == "") {
                    ShowErrorMessage("Please enter the Text Message!");
                    return false;
                }
            }
            else if ($("#ddlActionType").val() == "Permission") {
                if ($("#ui_txtClickPrmission0_values").children().length == 0) {
                    ShowErrorMessage("Please enter the Permission!");
                    return false;
                }
            }
        }
    }
    else if (RparameterValidation == 1) {
        ShowErrorMessage("Please provide the all Redirect to screen Parameters!");
    }
    else if (DeepLinkValid == 1) {
        ShowErrorMessage("Please provide the valid DeepLink Url!");
    }
    else if (DparameterValidation == 1) {
        ShowErrorMessage("Please provide the all Deep linking url Parameters!");
    }
    else if (ExternlaValid == 1) {
        ShowErrorMessage("Please provide the valid 'http' External Url!");
    }
    else if ($("#ui_txtStartDate").val() == "" && $("#ui_txtExpiryDate").val() != "") {
        ShowErrorMessage("Please provide the Start Date!");
        $("#ui_txtStartDate").focus();
    }
    else if ($("#ui_txtStartDate").val() != "" && $("#ui_txtExpiryDate").val() == "") {
        ShowErrorMessage("Please provide the Expiry Date!");
        $("#ui_txtExpiryDate").focus();
    }
    else if ($("#ui_txtStartDate").val() != "" && $("#ui_txtExpiryDate").val() != "" && ($("#ui_txtStartDate").val() > $("#ui_txtExpiryDate").val())) {
        ShowErrorMessage("Please provide the Valid Date!");
    }
    else if (dateValidation($("#ui_txtStartDate").val()) != false) {
        ShowErrorMessage("Please provide the Valid Date!");
        return false;
    }
    else if (dateValidation($("#ui_txtExpiryDate").val()) != false) {
        ShowErrorMessage("Please provide the Valid Date!");
        return false;
    }
    else if (!ValidationOfRules()) {
        $("#dvLoading").hide();
        return false;
    }
    else if (!ValidationOfResponseSetting()) {
        $("#dvLoading").hide();
        return false;
    }
    else {
        $("#dvLoading").show();
        var display = "", fields = "", ruleStatus = 0, responseStatus = 0, concate = "";
        if (finalDisplay != undefined || finalField != undefined) {
            if ($("input[name^=BgImgUrl]:checked").val() === "1") {
                finalDisplay.BgImage = $("#txtImageUrlBg").val();
            } else if ($("#span_FileNameBg").text() != "") {
                if (cdnpath.indexOf("//") == 0) {
                    finalDisplay.BgImage = (window.location.protocol == "http:" || window.location.protocol == "https:" ? window.location.protocol : "") +
                        cdnpath + "MobileEngagementUploads/" + $("#hdn_FlNameBg").val();
                }
                else {
                    finalDisplay.BgImage = cdnpath + "MobileEngagementUploads/" + $("#hdn_FlNameBg").val();
                }
            }
            finalDisplay.Padding = $("#mPaddingti").val() + "," + $("#mPaddingri").val() + "," + $("#mPaddingbi").val() + "," + $("#mPaddingli").val();
            display = '"Display":{"Position":"' + finalDisplay.Position + '","Animation":"' + finalDisplay.Animation + '","BgColor":"' + finalDisplay.BgColor + '","BgImage":"' + finalDisplay.BgImage + '","Padding":"' + finalDisplay.Padding.replace(/ px/g, "") + '","Border":"' + finalDisplay.Border + '","BorderWidth":"' + finalDisplay.BorderWidth + '","BorderRadius":"' + finalDisplay.BorderRadius + '","Height":"' + finalDisplay.Height + '","Interval":"' + finalDisplay.Interval + '","ScreenName":"' + finalDisplay.ScreenName + '","Close":"' + finalDisplay.Close + '"},';
            var y = 0;
            for (var m = 0; m < finalField.length; m++) {
                if (finalField[m].Type != "Img") {
                    fields += '{"Type":"' + finalField[m].Type + '","Text":"' + finalField[m].Text.replace(/&lt;/g, "<").replace(/&gt;/g, ">") + '","ImageUrl":"" ,"Name":"' + finalField[m].Name + '","Category":"' + finalField[m].Category + '","Score":"' + finalField[m].Score + '","Size":"' + finalField[m].Size.toString().trim() + '","Color":"' + (finalField[m].Color.toString().trim() == "" ? "#FFFFFF" : finalField[m].Color.toString().trim()) + '","BgColor":"' + finalField[m].BgColor.toString().trim() + '","Style":"' + (finalField[m].Style == "" ? "Normal" : finalField[m].Style) + '","Border":"' + finalField[m].Border.toString().trim() + '","BorderWidth":"' + finalField[m].BorderWidth + '","BorderRadius":"' + finalField[m].BorderRadius + '","Mandatory":"' + finalField[m].Mandatory + '","Width":"' + finalField[m].Width + '","Margin":"' + finalField[m].Margin + '","Padding":"' + finalField[m].Padding + '","Align":"' + finalField[m].Align + '","Orientation":"' + finalField[m].Orientation + '","Group":"' + finalField[m].Group + '","Action":"' + finalField[m].Action + '","Message":"' + finalField[m].Message + '","Redirect":"' + finalField[m].Redirect + '","Parameter":"' + finalField[m].Parameter + '","CloseDialog":"' + ((finalField[m].CloseDialog == "undefined" || finalField[m].CloseDialog == undefined) ? "0" : finalField[m].CloseDialog) + '"},';
                } else {
                    if (campaignId > 0) {
                        if ($("#field-" + m).attr('src').indexOf("//") == 0) {
                            ImageName = (window.location.protocol == "http:" || window.location.protocol == "https:" ? window.location.protocol : "") +
                                $("#field-" + m).attr('src');
                        }
                        else {
                            ImageName = $("#field-" + m).attr('src');
                        }
                        fields += '{"Type":"' + finalField[m].Type + '","Text":"' + finalField[m].Text.replace(/&lt;/g, "<").replace(/&gt;/g, ">") + '","ImageUrl":"' + (ImageName == undefined ? "" : ImageName) + '","Name":"' + finalField[m].Name + '","Category":"' + finalField[m].Category + '","Score":"' + finalField[m].Score + '","Size":"' + finalField[m].Size.toString().trim() + '","Color":"' + (finalField[m].Color.toString().trim() == "" ? "#FFFFFF" : finalField[m].Color.toString().trim()) + '","BgColor":"' + finalField[m].BgColor.toString().trim() + '","Style":"' + (finalField[m].Style == "" ? "Normal" : finalField[m].Style) + '","Border":"' + finalField[m].Border.toString().trim() + '","BorderWidth":"' + finalField[m].BorderWidth + '","BorderRadius":"' + finalField[m].BorderRadius + '","Mandatory":"' + finalField[m].Mandatory + '","Width":"' + finalField[m].Width + '","Margin":"' + finalField[m].Margin + '","Padding":"' + finalField[m].Padding + '","Align":"' + finalField[m].Align + '","Orientation":"' + finalField[m].Orientation + '","Group":"' + finalField[m].Group + '","Action":"' + finalField[m].Action + '","Message":"' + finalField[m].Message + '","Redirect":"' + finalField[m].Redirect + '","Parameter":"' + finalField[m].Parameter + '","CloseDialog":"' + ((finalField[m].CloseDialog == "undefined" || finalField[m].CloseDialog == undefined) ? "0" : finalField[m].CloseDialog) + '"},';
                    }
                    else {
                        if (clickImg == 1 || upldImg == 1) {
                            if ($("#field-" + m).attr('src').indexOf("//") == 0) {
                                ImageName = (window.location.protocol == "http:" || window.location.protocol == "https:" ? window.location.protocol : "") +
                                    $("#field-" + m).attr('src');
                            }
                            else {
                                ImageName = $("#field-" + m).attr('src');
                            }
                        }
                        else if ($("#txtImageUrl").val() != "" && $("#txtImageUrl").val().indexOf("http") > -1)
                            ImageName = $("#txtImageUrl").val();
                        else {
                            ImageName = "";
                        }
                        fields += '{"Type":"' + finalField[m].Type + '","Text":"' + finalField[m].Text.replace(/&lt;/g, "<").replace(/&gt;/g, ">") + '","ImageUrl":"' + ImageName + '","Name":"' + finalField[m].Name + '","Category":"' + finalField[m].Category + '","Score":"' + finalField[m].Score + '","Size":"' + finalField[m].Size.toString().trim() + '","Color":"' + (finalField[m].Color.toString().trim() == "" ? "#FFFFFF" : finalField[m].Color.toString().trim()) + '","BgColor":"' + finalField[m].BgColor.toString().trim() + '","Style":"' + (finalField[m].Style == "" ? "Normal" : finalField[m].Style) + '","Border":"' + finalField[m].Border.toString().trim() + '","BorderWidth":"' + finalField[m].BorderWidth + '","BorderRadius":"' + finalField[m].BorderRadius + '","Mandatory":"' + finalField[m].Mandatory + '","Width":"' + finalField[m].Width + '","Margin":"' + finalField[m].Margin + '","Padding":"' + finalField[m].Padding + '","Align":"' + finalField[m].Align + '","Orientation":"' + finalField[m].Orientation + '","Group":"' + finalField[m].Group + '","Action":"' + finalField[m].Action + '","Message":"' + finalField[m].Message + '","Redirect":"' + finalField[m].Redirect + '","Parameter":"' + finalField[m].Parameter + '","CloseDialog":"' + ((finalField[m].CloseDialog == "undefined" || finalField[m].CloseDialog == undefined) ? "0" : finalField[m].CloseDialog) + '"},';
                    }
                }
            }
            fields = fields.slice(0, -1);
            fields = '"Fields":[' + fields + ']';
            var concate = '{' + display + fields + '}';
        }
        else {
            var parameter1 = "";
            if (finalFieldId1.Parameter == undefined) {
                for (var m = 0; m < $("#NameDataContainerId div").length; m++) {
                    var b = m === 0 ? "" : m;
                    parameter1 += $("#IdtxtName0" + b).val().trim() + "=" + $("#IdtxtData0" + b).val().trim() + ",";
                }
                parameter1 = parameter1.slice(0, -1);
            }
            ImageName = $("#field_Id").attr('src');
            display = '"Image":"' + ($("input[name^=ImgUrlId]:checked").val() === "1" ? finalFieldId1.Image : ImageName) + '","ScreenName":"","Redirect":"' + (finalFieldId1.Redirect == undefined ? $("#DrpSelectRedirectToScreenId").val() : finalFieldId1.Redirect) + '","Parameter":"' + (finalFieldId1.Parameter == undefined ? parameter1 : finalFieldId1.Parameter) + '","Interval":"' + finalFieldId1.Interval + '"';
            concate = '{' + display + '}';
        }

        if ($("#div_Rule_Content input[type='checkbox']:checked").length > 0)
            ruleStatus = 1;
        if ($("#div_Response_Content input[type='checkbox']:checked").length > 0)
            responseStatus = 1;
        var inputs = {
            CampaignName: $("#txtName").val(), Design: concate, BannerId: (parseInt($.urlParam("Id")) == 0 ? $("#hdn_BannerId").val() : parseInt($.urlParam("Id"))),
            CampaignId: campaignId, RuleScreen: $("#DrpSelectScreenRule").val(), ruleStatus: ruleStatus,
            responseStatus: responseStatus, RecentEvent: ($("#ui_chkRecentClickedButton").prop("checked") == true ? 1 : 0),
            StaticForm: ($("input[name='StaticFrm']:checked").val() == 1 ? 0 : 1), StartDate: $("#ui_txtStartDate").val(), ExpiryDate: $("#ui_txtExpiryDate").val()
        };
        $.ajax({
            url: "../MobileEngagement/SaveInAppDesign",
            type: "Post",
            data: JSON.stringify({ 'data': inputs }),
            //data: "{'campaignName':'" + campaignId + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (parseInt(response) > 0) {
                    ShowErrorMessage("Successfully created the Campaign");
                    SaveMobileFormRules(response, 'created');
                    SaveMobileResponseSetting(response, 'created');
                    $("#div_Rule_Content").hide();
                }
                else if (parseInt(response) === -3) {
                    ShowErrorMessage("Successfully updated the Campaign");
                    SaveMobileFormRules(campaignId, 'updated');
                    SaveMobileResponseSetting(campaignId, 'updated');
                }
                else if (parseInt(response) === -2)
                    ShowErrorMessage("Campaign name is already exists");
                $("#dvLoading").hide();
            },
            error: function (objxmlRequest) {
                window.console.log(objxmlRequest.responseText);
            }
        });
    }
}
/// Save MobileForm Rules
function SaveMobileFormRules(Id, btnVal) {
    RulesData(Id);
    var inputs = {};
    if (btnVal == 'created')
        inputs = { Id: Id, action: 'SaveRules', TypeOfCampaign: 2 };
    else
        inputs = { Id: Id, action: 'UpdateRules', TypeOfCampaign: 2 };
    $.ajax({
        url: "../MobileEngagement/SaveMobileFormRules",
        type: "Post",
        data: JSON.stringify({ 'ruleConditions': ruleConditions, 'inputs': inputs }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (parseInt(response) > 0) {
                //ShowErrorMessage("Successfully inserted Form rules");
            }
        }
    });
}
//// Bind Mobile Rules
function BindMobileRules(Id) {
    var inputs = { Id: Id, action: 'GetRules', TypeOfCampaign: 2 };
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

function SaveMobileResponseSetting(Id, btnVal) {
    ResponseSettingData();
    var inputs = {};
    if (btnVal == 'created')
        inputs = { Id: Id, action: 'SaveResponseSetting', TypeOfCampaign: 2 };
    else
        inputs = { Id: Id, action: 'UpdateResponseSetting', TypeOfCampaign: 2 };
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

function BindMobileResponseSetting(Id) {
    var inputs = { Id: Id, action: 'GetResponseSettings', TypeOfCampaign: 2 };
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
//// Permissions
GetListDataBySpanId = function (spanTag, valueType, replaceId) {
    var objectValues = new Array();
    spanTag.children().each(function () {
        var value = "";
        if (replaceId.length > 0)
            value = $(this).attr(valueType).replace(replaceId, "");
        else
            value = $(this).attr(valueType);
        objectValues.push(value);
    });
    return objectValues;
};

$("#ui_txtClickPrmission0").click(function () {
    var availableTags = [
        "android.permission.CALL_PHONE",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.SEND_SMS",
        "android.permission.RECEIVE_SMS",
        "android.permission.READ_SMS",
        "android.permission.CAMERA",
        "android.permission.READ_CONTACTS",
        "android.permission.WRITE_CONTACTS",
        "android.permission.RECORD_AUDIO"
    ];
    $("#ui_txtClickPrmission0").autocomplete({
        source: availableTags,

        select: function (events, selectedItem) {
            AppendSelected2("ui_txtClickPrmission0_values", selectedItem, "AddedPermission");
        },
        close: function (event, ui) {
            $(this).val("");
        }
    });
});

function AppendSelected2(appendTo, data, fieldId) {
    var mainDiv = document.createElement("div");
    mainDiv.id = fieldId + "_" + data.item.value.replace(/ /g, "_").replace(/,/g, "_").replace(/./g, "_");
    mainDiv.className = "vrAutocomplete";
    mainDiv.setAttribute("value", data.item.value);
    mainDiv.setAttribute("identifier", data.item.value.replace(/ /g, "_").replace(/,/g, "_").replace(/./g, "_"));
    $(".vrAutocomplete").css("height", "27px");
    var span = document.createElement("span");
    span.className = "vnAutocomplete";

    var contentDiv = document.createElement("div");
    contentDiv.className = "vtAutocomplete";
    contentDiv.innerHTML = data.item.label;

    var removeDiv = document.createElement("div");
    removeDiv.className = "vmAutocomplete";
    removeDiv.setAttribute("onclick", "RemoveData2('" + fieldId + "_" + data.item.value.replace(/ /g, "_").replace(/,/g, "_").replace(/./g, "_") + "');");

    span.appendChild(contentDiv);
    span.appendChild(removeDiv);
    mainDiv.appendChild(span);

    var isElementIsNotAdded = true;

    $("#" + appendTo).children().each(function () {
        if (data.item.value.replace(/ /g, "_").replace(/,/g, "_").replace(/./g, "_") == $(this).attr("identifier")) {
            isElementIsNotAdded = false;
            return false;
        }
    });
    if (isElementIsNotAdded)
        $("#" + appendTo).append(mainDiv);
    else
        ShowErrorMessage("This Item is already added.");
}

function RemoveData2(data) {
    //data = $.trim(data);
    $("#" + data).remove();
}