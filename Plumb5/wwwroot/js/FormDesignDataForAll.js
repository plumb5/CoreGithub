
GetHeightWidthFromCustomStyle = function () {

    var height = 0, width = 0;
    var content = $("#ui_bgCustomStyle").val();
    var firstContent;
    if (content.indexOf("width") > -1) {
        firstContent = content.substring(content.indexOf("width") + 6, content.length);
        width = $.trim(firstContent.substring(0, firstContent.indexOf(";")).replace("px", ""));
        width = parseInt(width) + 25;
    }
    if (content.indexOf("height") > -1) {
        firstContent = content.substring(content.indexOf("height") + 7, content.length);
        height = $.trim(firstContent.substring(0, firstContent.indexOf(";")).replace("px", ""));
        height = parseInt(height) + 25;
    }
    return { Width: width, Height: height }
};

CloseButtondDesign = function () {

    var cssContent = "";
    var IsCustomDesign = false;
    if ($("#ui_radClosetandard").is(":checked")) {
        cssContent = "height:" + $("#ui_txtCloseHeight").val() + "px;";
        cssContent += "width:" + $("#ui_txtCloseWidth").val() + "px;";
        if ($("#ui_IsCloseBackground").is(":checked")) {
            if ($("#ui_lblCloseBtnUploadValue").val().length > 0) {
                cssContent += "background-image:url(" + $("#ui_lblCloseBtnUploadValue").val() + ");";
            }
            else {
                var colorCode = ConvertHexColorToRGB($("#ui_txtCloseBgColor").val().replace("#", ""));
                cssContent += "background-color:rgba(" + colorCode.R + "," + colorCode.G + "," + colorCode.B + "," + parseInt($("#ui_txtOpacityValue").val()) / 10 + ");";
            }
        }
        else {
            cssContent += "background:none;";
        }
        cssContent += "border-radius:" + $("#ui_ddlCloseBorderRadius").val() + ";";
        cssContent += "border:solid " + $("#ui_ddlCloseBorderWidth").val() + " " + $("#ui_txtCloseBorderColor").val() + ";";
        cssContent += "color:" + $("#ui_txtCloseColor").val() + ";";
        cssContent += "font-family:" + $("#ui_ddlCloseStyleFontFamily").val() + ";";
        cssContent += "font-size:" + $("#ui_ddlCloseStyleFontSize").val() + ";";
        cssContent += "font-weight:" + $("#ui_ddlCloseStyleFontWeight").val() + ";";
        cssContent += "margin:" + $("#ui_ddlCloseMargin").val() + ";";
        cssContent += "padding:" + $("#ui_ddlClosePadding").val() + ";";

        // Follwing Line littel Complex, like this done because of to avoid More Colomn in DB
        if ($("#ui_ddlClosePosition").val() == "1")
            cssContent += "right:" + $("#ui_ddlClosePositioLeftRight").val() + ";top:" + $("#ui_ddlCloseTop").val() + ";";
        else if ($("#ui_ddlClosePosition").val() == "2")
            cssContent += "left:" + $("#ui_ddlClosePositioLeftRight").val() + ";top:" + $("#ui_ddlCloseTop").val() + ";";
        else if ($("#ui_ddlClosePosition").val() == "3")
            cssContent += "right:" + $("#ui_ddlClosePositioLeftRight").val() + ";bottom:" + $("#ui_ddlCloseTop").val() + ";";
        else if ($("#ui_ddlClosePosition").val() == "4")
            cssContent += "left:" + $("#ui_ddlClosePositioLeftRight").val() + ";bottom:" + $("#ui_ddlCloseTop").val() + ";";

        cssContent += "text-align: center;";
    }
    else if ($("#ui_radCloseCustome").is(":checked")) {
        IsCustomDesign = 1;
        cssContent = $("#ui_txtCloseCustomeDesign").val();
    }

    return { cssContent: cssContent, IsCustomDesign: IsCustomDesign }

};

ButtonDesign = function () {

    var cssContent = "", buttonName = "", IsCustomDesign = false;

    if ($("#ui_radButtonStandard").is(":checked")) {
        cssContent = "height:" + $("#ui_txtButtonHeight").val() + "px;";
        cssContent += "width:" + $("#ui_txtButtonWidth").val() + "px;";

        if ($("#ui_FileButtonImage").val().length > 0) {
            cssContent += "background-image:url(" + $("#ui_FileButtonImage").val() + ");";
        }
        else {
            var colorCode = ConvertHexColorToRGB($("#ui_txtButtonBgColor").val().replace("#", ""));
            cssContent += "background-color:rgba(" + colorCode.R + "," + colorCode.G + "," + colorCode.B + "," + parseInt($("#ui_txtButtonOpacityValue").val()) / 10 + ");";
        }
        cssContent += "color:" + $("#ui_txtButtonFontColor").val() + ";";
        cssContent += "font-family:" + $("#ui_txtButtonFontFamily").val() + ";";
        cssContent += "font-size:" + $("#ui_txtButtonFontSize").val() + ";";
        cssContent += "padding:" + $("#ui_ddlButtonPadding").val() + ";";
        cssContent += "margin:" + $("#ui_ddlButtonMargin").val() + ";";
        cssContent += "border-radius:" + $("#ui_ddlButtonBorderRadius").val() + ";";
        var colorCode = ConvertHexColorToRGB($("#ui_txtButtonBorderColor").val().replace("#", ""));
        cssContent += "border:solid " + $("#ui_ddlButtonBorderWidth").val() + " rgba(" + colorCode.R + "," + colorCode.G + "," + colorCode.B + "," + parseInt($("#ui_txtButtonOpacityValue").val()) / 10 + ");";
    }
    else if ($("#ui_radButtonCustom").is(":checked")) {
        IsCustomDesign = 1;
        cssContent = $("#ui_txtButtonCustomeDesign").val();
    }

    if (document.getElementById("ui_txtButton_ButtonName"))
        buttonName = $("#ui_txtButton_ButtonName").val();

    return { cssContent: cssContent, buttonName: buttonName, IsCustomDesign: IsCustomDesign }

};

TitleDesignCss = function () {

    var cssContent = "", IsCustomDesign = false;

    if ($("#ui_radTitleStandard").is(":checked")) {

        cssContent += "color:" + $("#ui_txtTitleColor").val() + ";";
        cssContent += "font-family:" + $("#ui_ddlTitleFontFamily").val() + ";";
        cssContent += "font-size:" + $("#ui_ddlTitleFontSize").val() + ";";
        cssContent += "font-style:" + $("#ui_ddlTitleFontStyle").val() + ";";
        cssContent += "font-weight:" + $("#ui_ddlTitleFontWeight").val() + ";";
        cssContent += "padding:" + $("#ui_ddlTitlePadding").val() + ";";
        cssContent += "margin:" + $("#ui_ddlTitleMargin").val() + ";";
        cssContent += "line-height:" + $("#ui_ddlTitleLineHeight").val() + ";";
    }
    else if ($("#ui_radTitleCustom").is(":checked")) {
        IsCustomDesign = 1;
        cssContent = $("#ui_txtTitleCustomCss").val();
    }
    return { cssContent: cssContent, IsCustomDesign: IsCustomDesign }
};

DescriptionDesignCss = function () {

    var cssContent = "", IsCustomDesign = false;

    if ($("#ui_radDescriptionStandard").is(":checked")) {
        cssContent += "color:" + $("#ui_txtDescriptionColor").val() + ";";
        cssContent += "font-family:" + $("#ui_ddlDescriptionFontFamily").val() + ";";
        cssContent += "font-size:" + $("#ui_ddlDescriptionFontSize").val() + ";";
        cssContent += "font-style:" + $("#ui_ddlDescriptionFontStyle").val() + ";";
        cssContent += "font-weight:" + $("#ui_ddlDescriptionFontWeight").val() + ";";
        cssContent += "padding:" + $("#ui_ddlDescriptionPadding").val() + ";";
        cssContent += "margin:" + $("#ui_ddlDescriptionMargin").val() + ";";
        cssContent += "line-height:" + $("#ui_ddlDescriptionLineHeight").val() + ";";
    }
    else if ($("#ui_radDescriptionCustom").is(":checked")) {
        IsCustomDesign = 1;
        cssContent = $("#ui_txtDescriptionCustomCss").val();
    }
    return { cssContent: cssContent, IsCustomDesign: IsCustomDesign }
};

LabelDesignCss = function () {

    var cssContent = "", IsCustomDesign = false;

    if ($("#ui_radLabelStandard").is(":checked")) {

        cssContent += "width:" + $("#ui_txtLabelWidth").val() + "px;";
        cssContent += "line-height:" + $("#ui_ddlLabelLineHeight").val() + ";";
        cssContent += "color:" + $("#ui_txtLabelColor").val() + ";";
        cssContent += "font-family:" + $("#ui_ddlLabelFontFamily").val() + ";";
        cssContent += "font-size:" + $("#ui_ddlLabelFontSize").val() + ";";
        cssContent += "font-style:" + $("#ui_ddlLabelFontStyle").val() + ";";
        cssContent += "padding:" + $("#ui_ddlLabelPadding").val() + ";";
        cssContent += "margin:" + $("#ui_ddlLabelMargin").val() + ";";
    }
    else if ($("#ui_radLabelCustom").is(":checked")) {
        IsCustomDesign = 1;
        cssContent = $("#ui_txtLabelCustomCss").val();
    }
    return { cssContent: cssContent, IsCustomDesign: IsCustomDesign }
};

TextboxDropdownCss = function () {

    var cssContent = "", IsCustomDesign = false;

    if ($("#ui_radTextBoxDropdownStandard").is(":checked")) {
        cssContent += "height:" + $("#ui_txtTextboxDropdownHeight").val() + "px;";
        cssContent += "width:" + $("#ui_txtTextboxDropdownWidth").val() + "px;";
        cssContent += "background-color:" + $("#ui_txtTextboxDropdownBgColor").val() + ";";
        cssContent += "color:" + $("#ui_txtTextboxDropdownFontColor").val() + ";";
        cssContent += "font-family:" + $("#ui_txtTextboxDropdownFontFamily").val() + ";";
        cssContent += "font-size:" + $("#ui_txtTextboxDropdownFontSize").val() + ";";
        cssContent += "padding:" + $("#ui_ddlTextboxDropdownPadding").val() + ";";
        cssContent += "border-radius:" + $("#ui_ddlTextboxDropdownBorderRadius").val() + ";";
        var colorCode = $("#ui_txtTextboxDropdownBorderColor").val();
        cssContent += "border:solid " + $("#ui_ddlTextboxDropdownBorderWidth").val() + " " + colorCode + ";";
    }
    else if ($("#ui_radTextBoxDropdownCustom").is(":checked")) {
        IsCustomDesign = 1;
        cssContent = $("#ui_txtTextBoxDropdownDesign").val();
    }
    return { cssContent: cssContent, IsCustomDesign: IsCustomDesign }

};

PlaceHolderDesignClass = function () {
    cssContent = $("#ui_txtPlaceHolderClass").val();
    return { cssContent: cssContent }
};

function ChangeStyleContentForBgImg(styleObject, imageurl) {

    if (styleObject.val().indexOf("background-image:url") > -1) {
        var lastContent = "";
        var buttonStyleContent = styleObject.val();
        var bgimgStartIndex = styleObject.val().indexOf("background-image:url");
        var firstContent = buttonStyleContent.substring(0, bgimgStartIndex);
        var remainingContent = buttonStyleContent.substring(bgimgStartIndex, buttonStyleContent.length);
        if (remainingContent.indexOf(";") > -1) {
            lastContent = remainingContent.substring(remainingContent.indexOf(";") + 1, remainingContent.length);
        }
        firstContent += lastContent + "background-image:url(" + imageurl + ");";
        firstContent = CleanText(firstContent);
        styleObject.val(firstContent);
    }
    else {
        if (styleObject.val().slice(-1) == ";") {
            styleObject.val(styleObject.val() + "background-image:url(" + imageurl + ");");
        }
        if (styleObject.val().length == 0) {
            styleObject.val("background-image:url(" + imageurl + ");");
        }
        else {
            styleObject.val(styleObject.val() + ";background-image:url(" + imageurl + ");");
        }
    }
}

BindBackgroundDesginData = function () {

    var backgroundDesignData = "";
    if (formDetails.IsMainBackgroundDesignCustom == false && formDetails.MainBackgroundDesign != null && formDetails.MainBackgroundDesign.length > 0) {

        backgroundDesignData = formDetails.MainBackgroundDesign.split(";");


        if (backgroundDesignData[0].indexOf("height:") > -1) {
            var height = backgroundDesignData[0].split(":")[1].replace("px", "").replace("%", "");
            $("#ui_txtHeight").val(height);
        }

        if (backgroundDesignData[1].indexOf("width:") > -1) {
            var width = backgroundDesignData[1].split(":")[1].replace("px", "").replace("%", "");
            $("#ui_txtWidth").val(width);
        }


        if (backgroundDesignData.length>2 && backgroundDesignData[2].indexOf("background:none") < 0) {

            if (backgroundDesignData[2].indexOf("background-color") > -1) {
                var rgba = backgroundDesignData[2].split(":")[1];
                var colorCode = RGBToHex(rgba);
                $("#ui_txtbackgroundColor").val("#" + colorCode.HexValue).css({ backgroundColor: "#" + colorCode.HexValue })
                $("#ui_txtOpacityValue").slider('option', { value: colorCode.Opacity });
                document.getElementById("ui_txtOpacityValue").style.color = 0.213 * colorCode.R + 0.715 * colorCode.G + 0.072 * colorCode.B < 0.5 ? '#FFF' : '#000';
            }
            else {
                var bgImage = backgroundDesignData[2].replace("background-image:url(", "").replace(")", "");
                $("#ui_FilebackgroundImage").val(bgImage);
            }
            if (backgroundDesignData[3].indexOf("padding") > -1) {
                var padding = backgroundDesignData[3].split(":")[1];
                $("#ui_ddlbgPadding").val(padding);
            }
            if (backgroundDesignData[4].indexOf("border-radius") > -1) {
                var borderRadius = backgroundDesignData[4].split(":")[1];
                $("#ui_ddlBgBorderRadius").val($.trim(borderRadius));
            }
            if (backgroundDesignData[5].indexOf("border") > -1) {
                var border = backgroundDesignData[5].split(":")[1].replace("solid ", "").split(" ");
                $("#ui_ddlBgBorderWidth").val($.trim(border[0]));
                var colorCode = RGBToHex(border[1]);
                $("#ui_txtBorderColor").val("#" + colorCode.HexValue).css({ backgroundColor: "#" + colorCode.HexValue });
                document.getElementById("ui_txtBorderColor").style.color = 0.213 * colorCode.R + 0.715 * colorCode.G + 0.072 * colorCode.B < 0.5 ? '#FFF' : '#000';
            }
        }
        else {
            $("#ui_chkBackground").click();
        }
    }
    else if (formDetails.IsMainBackgroundDesignCustom == true) {
        $("#ui_bgCustomStyle").val(formDetails.MainBackgroundDesign);
    }

    var BackgroundDesignFadeColor = "";
    if (formDetails.BackgroundFadeColor != null && formDetails.BackgroundFadeColor.length > 0) {
        $("#ui_chkBackGroundFadeColorOpacity").prop("checked", true);

        BackgroundDesignFadeColor = formDetails.BackgroundFadeColor.split(";");

        if (BackgroundDesignFadeColor[0].indexOf("background-color") > -1) {
            var backgroundfadecolor = BackgroundDesignFadeColor[0].split(":")[1];
            $("#ui_txtBackGroundFadeColorOpacity").val(backgroundfadecolor);
        }
        if (BackgroundDesignFadeColor[1].indexOf("opacity") > -1) {
            var Opacity = BackgroundDesignFadeColor[1].split(":")[1];
            $("#ui_txBackGroundFadeOpacityValue").slider('option', { value: Opacity * 10 });
        }
    }
};

BindCloseCss = function () {
    var closeDesignData = "";
    if (formDetails.IsCloseCustomCss == false && formDetails.CloseCss != null && formDetails.CloseCss.length > 0) {

        closeDesignData = formDetails.CloseCss.split(";");

        if (closeDesignData[0].indexOf("height") > -1) {
            var height = closeDesignData[0].split(":")[1].replace("px", "");
            $("#ui_txtCloseHeight").val(height);
        }
        if (closeDesignData[1].indexOf("width") > -1) {
            var width = closeDesignData[1].split(":")[1].replace("px", "");
            $("#ui_txtCloseWidth").val(width);
        }

        if (closeDesignData[2].indexOf("background:none") < 0) {

            $("#ui_IsCloseBackground").prop("checked", true);

            if (closeDesignData[2].indexOf("background-color") > -1) {
                var rgba = closeDesignData[2].split(":")[1];
                var colorCode = RGBToHex(rgba);
                $("#ui_txtCloseBgColor").val("#" + colorCode.HexValue).css({ backgroundColor: "#" + colorCode.HexValue })

                document.getElementById("ui_txtCloseBgColor").style.color = 0.213 * colorCode.R + 0.715 * colorCode.G + 0.072 * colorCode.B < 0.5 ? '#FFF' : '#000';
            }
            else {
                var bgImage = closeDesignData[2].replace("background-image:url(", "").replace(")", "");
                $("#ui_lblCloseBtnUploadValue").val(bgImage);
            }
        }

        if (closeDesignData[3].indexOf("border-radius") > -1) {
            var borderRadius = closeDesignData[3].split(":")[1];
            $("#ui_ddlCloseBorderRadius").val(borderRadius);
        }

        if (closeDesignData[4].indexOf("border") > -1) {
            var border = closeDesignData[4].split(":")[1].replace("solid ", "").split(" ");
            $("#ui_ddlCloseBorderWidth").val($.trim(border[0]));
            var colorCode = ConvertHexColorToRGB(border[1].replace("#", ""));
            $("#ui_txtCloseBorderColor").val(border[1]).css({ backgroundColor: border[1] });
            document.getElementById("ui_txtCloseBorderColor").style.color = 0.213 * colorCode.R + 0.715 * colorCode.G + 0.072 * colorCode.B < 0.5 ? '#FFF' : '#000';
        }
        if (closeDesignData[5].indexOf("color") > -1) {
            var color = closeDesignData[5].split(":")[1];
            $("#ui_txtCloseColor").val(color).css({ backgroundColor: color });
            var colorCode = ConvertHexColorToRGB(color);
            document.getElementById("ui_txtCloseColor").style.color = 0.213 * colorCode.R + 0.715 * colorCode.G + 0.072 * colorCode.B < 0.5 ? '#FFF' : '#000';
        }
        if (closeDesignData[6].indexOf("font-family") > -1) {
            var fontFamily = closeDesignData[6].split(":")[1];
            $("#ui_ddlCloseStyleFontFamily").val(fontFamily);
        }
        if (closeDesignData[7].indexOf("font-size") > -1) {
            var fontSize = closeDesignData[7].split(":")[1];
            $("#ui_ddlCloseStyleFontSize").val(fontSize);
        }
        if (closeDesignData[8].indexOf("font-weight") > -1) {
            var fontWeight = closeDesignData[8].split(":")[1];
            $("#ui_ddlCloseStyleFontWeight").val(fontWeight);
        }
        if (closeDesignData[9].indexOf("margin") > -1) {
            var margin = closeDesignData[9].split(":")[1];
            $("#ui_ddlCloseMargin").val(margin);
        }
        if (closeDesignData[10].indexOf("padding") > -1) {
            var padding = closeDesignData[10].split(":")[1];
            $("#ui_ddlClosePadding").val(padding);
        }

        if (closeDesignData[11].indexOf("right") > -1 && closeDesignData[12].indexOf("top") > -1) {
            $("#ui_ddlClosePosition").val("1");
            var right = closeDesignData[11].split(":")[1];
            $("#ui_ddlClosePositioLeftRight").val(right);

            var top = closeDesignData[12].split(":")[1];
            $("#ui_ddlCloseTop").val(top);
        }
        else if (closeDesignData[11].indexOf("left") > -1 && closeDesignData[12].indexOf("top") > -1) {
            $("#ui_ddlClosePosition").val("2");
            var left = closeDesignData[11].split(":")[1];
            $("#ui_ddlClosePositioLeftRight").val(left);

            var top = closeDesignData[12].split(":")[1];
            $("#ui_ddlCloseTop").val(top);
        }
        else if (closeDesignData[11].indexOf("right") > -1 && closeDesignData[12].indexOf("bottom") > -1) {
            $("#ui_ddlClosePosition").val("3");
            var right = closeDesignData[11].split(":")[1];
            $("#ui_ddlClosePositioLeftRight").val(right);

            var bottom = closeDesignData[12].split(":")[1];
            $("#ui_ddlCloseTop").val(bottom);
        }
        else if (closeDesignData[11].indexOf("left") > -1 && closeDesignData[12].indexOf("bottom") > -1) {
            $("#ui_ddlClosePosition").val("4");
            var left = closeDesignData[11].split(":")[1];
            $("#ui_ddlClosePositioLeftRight").val(left);

            var bottom = closeDesignData[12].split(":")[1];
            $("#ui_ddlCloseTop").val(bottom);

        }
    }
};

BindButtonCss = function () {

    var buttonDesignData = "";

    if (formDetails.IsButtonCustomCss == false && formDetails.ButtonCss != null && formDetails.ButtonCss.length > 0) {

        buttonDesignData = formDetails.ButtonCss.split(";");

        if (buttonDesignData[0].indexOf("height") > -1) {
            var height = buttonDesignData[0].split(":")[1].replace("px", "");
            $("#ui_txtButtonHeight").val(height);
        }
        if (buttonDesignData[1].indexOf("width") > -1) {
            var width = buttonDesignData[1].split(":")[1].replace("px", "");
            $("#ui_txtButtonWidth").val(width);
        }
        if (buttonDesignData[2].indexOf("background-color") > -1) {
            var rgba = buttonDesignData[2].split(":")[1];
            var colorCode = RGBToHex(rgba);
            $("#ui_txtButtonBgColor").val("#" + colorCode.HexValue).css({ backgroundColor: "#" + colorCode.HexValue })
            $("#ui_txtButtonOpacityValue").slider('option', { value: colorCode.Opacity });
            document.getElementById("ui_txtButtonBgColor").style.color = 0.213 * colorCode.R + 0.715 * colorCode.G + 0.072 * colorCode.B < 0.5 ? '#FFF' : '#000';
        }
        else {
            var bgImage = buttonDesignData[2].replace("background-image:url(", "").replace(")", "");
            $("#ui_FileButtonImage").val(bgImage);
        }

        if (buttonDesignData[3].indexOf("color") > -1) {
            var color = buttonDesignData[3].split(":")[1];
            $("#ui_txtButtonFontColor").val(color).css({ backgroundColor: color });
            var rgbColor = ConvertHexColorToRGB(color.replace("#", ""));
            document.getElementById("ui_txtButtonFontColor").style.color = 0.213 * rgbColor.R + 0.715 * rgbColor.G + 0.072 * rgbColor.B < 0.5 ? '#FFF' : '#000';
        }

        if (buttonDesignData[4].indexOf("font-family") > -1) {
            var fontFamily = buttonDesignData[4].split(":")[1];
            $("#ui_txtButtonFontFamily").val(fontFamily);
        }

        if (buttonDesignData[5].indexOf("font-size") > -1) {
            var fontSize = buttonDesignData[5].split(":")[1];
            $("#ui_txtButtonFontSize").val(fontSize);
        }
        if (buttonDesignData[6].indexOf("padding") > -1) {
            var padding = buttonDesignData[6].split(":")[1];
            $("#ui_ddlButtonPadding").val(padding);
        }
        if (buttonDesignData[7].indexOf("margin") > -1) {
            var margin = buttonDesignData[7].split(":")[1];
            $("#ui_ddlButtonMargin").val(margin);
        }

        if (buttonDesignData[8].indexOf("border-radius") > -1) {
            var borderRadius = buttonDesignData[8].split(":")[1];
            $("#ui_ddlButtonBorderRadius").val(borderRadius);
        }

        if (buttonDesignData[9].indexOf("border") > -1) {
            var border = buttonDesignData[9].split(":")[1].replace("solid ", "").split(" ");
            $("#ui_ddlButtonBorderWidth").val($.trim(border[0]));
            var colorCode = RGBToHex(border[1]);
            $("#ui_txtButtonBorderColor").val("#" + colorCode.HexValue).css({ backgroundColor: "#" + colorCode.HexValue });
            document.getElementById("ui_txtButtonBorderColor").style.color = 0.213 * colorCode.R + 0.715 * colorCode.G + 0.072 * colorCode.B < 0.5 ? '#000' : '#FFF';
        }
    }
    else if (formDetails.IsButtonCustomCss == true) {

        $("#ui_radButtonCustom").prop("checked", true);
        $("#dvMainButtonCustomCss").show();
        $("#dvMainButtonStandardCss").hide();

        $("#ui_txtButtonCustomeDesign").val(formDetails.ButtonCss);

    }

    if (document.getElementById("ui_txtButton_ButtonName") && formDetails.ButtonName != null && formDetails.ButtonName.length > 0)
        $("#ui_txtButton_ButtonName").val(formDetails.ButtonName);
};

BindTitleCss = function () {

    var titleDesignData = "";

    if (formDetails.IsTitleCssCustom == false && formDetails.TitleCss != null && formDetails.TitleCss.length > 0) {

        titleDesignData = formDetails.TitleCss.split(";");

        if (titleDesignData[0].indexOf("color") > -1) {
            var color = titleDesignData[0].split(":")[1];
            $("#ui_txtTitleColor").val(color).css({ backgroundColor: color });
            var rgbColor = ConvertHexColorToRGB(color.replace("#", ""));
            document.getElementById("ui_txtTitleColor").style.color = 0.213 * rgbColor.R + 0.715 * rgbColor.G + 0.072 * rgbColor.B < 0.5 ? '#FFF' : '#000';
        }
        if (titleDesignData[1].indexOf("font-family") > -1) {
            var fontFamily = titleDesignData[1].split(":")[1];
            $("#ui_ddlTitleFontFamily").val(fontFamily);
        }
        if (titleDesignData[2].indexOf("font-size") > -1) {
            var fontSize = titleDesignData[2].split(":")[1];
            $("#ui_ddlTitleFontSize").val(fontSize);
        }
        if (titleDesignData[3].indexOf("font-style") > -1) {
            var fontStyle = titleDesignData[3].split(":")[1];
            $("#ui_ddlTitleFontStyle").val(fontStyle);
        }
        if (titleDesignData[4].indexOf("font-weight") > -1) {
            var fontWeight = titleDesignData[4].split(":")[1];
            $("#ui_ddlTitleFontWeight").val(fontWeight);
        }
        if (titleDesignData[5].indexOf("padding") > -1) {
            var padding = titleDesignData[5].split(":")[1];
            $("#ui_ddlTitlePadding").val(padding);
        }
        if (titleDesignData[6].indexOf("margin") > -1) {
            var margin = titleDesignData[6].split(":")[1];
            $("#ui_ddlTitleMargin").val(margin);
        }
        if (titleDesignData[7].indexOf("line-height") > -1) {
            var lineHeight = titleDesignData[7].split(":")[1];
            $("#ui_ddlTitleLineHeight").val(lineHeight);
        }
    }
    else if (formDetails.IsTitleCssCustom == true) {
        $("#ui_radTitleCustom").prop("checked", true);
        $("#dvTitleStandardCss").hide();
        $("#dvTitleCustomeCss").show();

        $("#ui_txtTitleCustomCss").val(formDetails.TitleCss);
    }

};

BindDescriptionCss = function () {

    var descriptionDesignData = "";

    if (formDetails.IsDescriptionCustomCss == false && formDetails.DescriptionCss != null && formDetails.DescriptionCss.length > 0) {

        descriptionDesignData = formDetails.DescriptionCss.split(";");

        if (descriptionDesignData[0].indexOf("color") > -1) {
            var color = descriptionDesignData[0].split(":")[1];
            $("#ui_txtDescriptionColor").val(color).css({ backgroundColor: color });
            var rgbColor = ConvertHexColorToRGB(color.replace("#", ""));
            document.getElementById("ui_txtDescriptionColor").style.color = 0.213 * rgbColor.R + 0.715 * rgbColor.G + 0.072 * rgbColor.B < 0.5 ? '#FFF' : '#000';
        }
        if (descriptionDesignData[1].indexOf("font-family") > -1) {
            var fontFamily = descriptionDesignData[1].split(":")[1];
            $("#ui_ddlDescriptionFontFamily").val(fontFamily);
        }
        if (descriptionDesignData[2].indexOf("font-size") > -1) {
            var fontSize = descriptionDesignData[2].split(":")[1];
            $("#ui_ddlDescriptionFontSize").val(fontSize);
        }
        if (descriptionDesignData[3].indexOf("font-style") > -1) {
            var fontStyle = descriptionDesignData[3].split(":")[1];
            $("#ui_ddlDescriptionFontStyle").val(fontStyle);
        }
        if (descriptionDesignData[4].indexOf("font-weight") > -1) {
            var fontWeight = descriptionDesignData[4].split(":")[1];
            $("#ui_ddlDescriptionFontWeight").val(fontWeight);
        }
        if (descriptionDesignData[5].indexOf("padding") > -1) {
            var padding = descriptionDesignData[5].split(":")[1];
            $("#ui_ddlDescriptionPadding").val(padding);
        }
        if (descriptionDesignData[6].indexOf("margin") > -1) {
            var margin = descriptionDesignData[6].split(":")[1];
            $("#ui_ddlDescriptionMargin").val(margin);
        }
        if (descriptionDesignData[7].indexOf("line-height") > -1) {
            var lineHeight = descriptionDesignData[7].split(":")[1];
            $("#ui_ddlDescriptionLineHeight").val(lineHeight);
        }
    }
    else if (formDetails.IsDescriptionCustomCss == true) {
        $("#ui_radDescriptionCustom").prop("checked", true);
        $("#dvDescriptionStandardCss").hide();
        $("#dvDescriptionCustomeCss").show();

        $("#ui_txtDescriptionCustomCss").val(formDetails.DescriptionCss);
    }

};

BindLabelCss = function () {

    var labelDesignData = "";

    if (formDetails.IsLabelCustomCss == false && formDetails.LabelCss != null && formDetails.LabelCss.length > 0) {

        labelDesignData = formDetails.LabelCss.split(";");

        if (labelDesignData[0].indexOf("width") > -1) {
            var width = labelDesignData[0].split(":")[1];
            $("#ui_txtLabelWidth").val(width.replace("px", ""));
        }
        if (labelDesignData[1].indexOf("line-height") > -1) {
            var lineHeight = labelDesignData[1].split(":")[1];
            $("#ui_ddlLabelLineHeight").val(lineHeight);
        }
        if (labelDesignData[2].indexOf("color") > -1) {
            var color = labelDesignData[2].split(":")[1];
            $("#ui_txtLabelColor").val(color).css({ backgroundColor: color });
            var rgbColor = ConvertHexColorToRGB(color.replace("#", ""));
            document.getElementById("ui_txtLabelColor").style.color = 0.213 * rgbColor.R + 0.715 * rgbColor.G + 0.072 * rgbColor.B < 0.5 ? '#FFF' : '#000';
        }
        if (labelDesignData[3].indexOf("font-family") > -1) {
            var fontFamily = labelDesignData[3].split(":")[1];
            $("#ui_ddlLabelFontFamily").val(fontFamily);
        }
        if (labelDesignData[4].indexOf("font-size") > -1) {
            var fontSize = labelDesignData[4].split(":")[1];
            $("#ui_ddlLabelFontSize").val(fontSize);
        }
        if (labelDesignData[5].indexOf("font-style") > -1) {
            var fontStyle = labelDesignData[5].split(":")[1];
            $("#ui_ddlLabelFontStyle").val(fontStyle);
        }
        if (labelDesignData[6].indexOf("padding") > -1) {
            var padding = labelDesignData[6].split(":")[1];
            $("#ui_ddlLabelPadding").val(padding);
        }
        if (labelDesignData[7].indexOf("margin") > -1) {
            var margin = labelDesignData[7].split(":")[1];
            $("#ui_ddlLabelMargin").val(margin);
        }
    }
    else if (formDetails.IsLabelCustomCss == true) {
        $("#ui_radLabelCustom").prop("checked", true);
        $("#dvLabelStandardCss").hide();
        $("#dvLabelCustomeCss").show();
        $("#ui_txtLabelCustomCss").val(formDetails.LabelCss);
    }
};

BindTextboxDropCss = function () {

    var textboxDropdownDesignData = "";

    if (formDetails.IsTextboxDropCustomCss == false && formDetails.TextboxDropCss != null && formDetails.TextboxDropCss.length > 0) {

        textboxDropdownDesignData = formDetails.TextboxDropCss.split(";");

        if (textboxDropdownDesignData[0].indexOf("height") > -1) {
            var height = textboxDropdownDesignData[0].split(":")[1].replace("px", "");
            $("#ui_txtTextboxDropdownHeight").val(height);
        }
        if (textboxDropdownDesignData[1].indexOf("width") > -1) {
            var width = textboxDropdownDesignData[1].split(":")[1].replace("px", "");
            $("#ui_txtTextboxDropdownWidth").val(width);
        }
        if (textboxDropdownDesignData[2].indexOf("background-color") > -1) {
            var color = textboxDropdownDesignData[2].split(":")[1];
            $("#ui_txtTextboxDropdownBgColor").val(color).css({ backgroundColor: color });
            var rgbColor = ConvertHexColorToRGB(color.replace("#", ""));
            document.getElementById("ui_txtTextboxDropdownBgColor").style.color = 0.213 * rgbColor.R + 0.715 * rgbColor.G + 0.072 * rgbColor.B < 0.5 ? '#FFF' : '#000';
        }
        if (textboxDropdownDesignData[3].indexOf("color") > -1) {
            var color = textboxDropdownDesignData[3].split(":")[1];
            $("#ui_txtTextboxDropdownFontColor").val(color).css({ backgroundColor: color });
            var rgbColor = ConvertHexColorToRGB(color.replace("#", ""));
            document.getElementById("ui_txtTextboxDropdownFontColor").style.color = 0.213 * rgbColor.R + 0.715 * rgbColor.G + 0.072 * rgbColor.B < 0.5 ? '#FFF' : '#000';
        }
        if (textboxDropdownDesignData[4].indexOf("font-family") > -1) {
            var fontFamily = textboxDropdownDesignData[4].split(":")[1];
            $("#ui_txtTextboxDropdownFontFamily").val(fontFamily);
        }
        if (textboxDropdownDesignData[5].indexOf("font-size") > -1) {
            var fontSize = textboxDropdownDesignData[5].split(":")[1];
            $("#ui_txtTextboxDropdownFontSize").val(fontSize);
        }
        if (textboxDropdownDesignData[6].indexOf("padding") > -1) {
            var padding = textboxDropdownDesignData[6].split(":")[1];
            $("#ui_ddlTextboxDropdownPadding").val(padding);
        }
        if (textboxDropdownDesignData[7].indexOf("border-radius") > -1) {
            var borderRadius = textboxDropdownDesignData[7].split(":")[1];
            $("#ui_ddlTextboxDropdownBorderRadius").val(borderRadius);
        }
        if (textboxDropdownDesignData[8].indexOf("border") > -1) {
            var border = textboxDropdownDesignData[8].split(":")[1].replace("solid ", "").split(" ");
            $("#ui_ddlTextboxDropdownBorderWidth").val($.trim(border[0]));
            var colorCode = ConvertHexColorToRGB(border[1].replace("#", ""));
            $("#ui_txtTextboxDropdownBorderColor").val(border[1]).css({ backgroundColor: border[1] });
            document.getElementById("ui_txtTextboxDropdownBorderColor").style.color = 0.213 * colorCode.R + 0.715 * colorCode.G + 0.072 * colorCode.B < 0.5 ? '#FFF' : '#000';
        }
    }
    else if (formDetails.IsTextboxDropCustomCss == true) {
        $("#ui_radTextBoxDropdownCustom").prop("checked", true);
        $("#dvTextBoxDropdownStandardCss").hide();
        $("#dvTextBoxDropdownCustomCss").show();
        $("#ui_txtTextBoxDropdownDesign").val(formDetails.TextboxDropCss);
    }
};

BindPlaceHolderClass = function () {
    if (formDetails.PlaceHolderClass != null && formDetails.PlaceHolderClass.length > 0) {
        $("#ui_txtPlaceHolderClass").val(formDetails.PlaceHolderClass);
    }
};

BindErrorDesignCss = function () {
    var ErrorDesignData = "";

    if (formDetails.IsErrorCustomCss == false && formDetails.ErrorCss != null && formDetails.ErrorCss.length > 0) {

        ErrorDesignData = formDetails.ErrorCss.split(";");

        if (ErrorDesignData[0].indexOf("color") > -1) {
            var color = ErrorDesignData[0].split(":")[1];
            $("#ui_txtErrorColor").val(color).css({ backgroundColor: color });
            var rgbColor = ConvertHexColorToRGB(color.replace("#", ""));
            document.getElementById("ui_txtErrorColor").style.color = 0.213 * rgbColor.R + 0.715 * rgbColor.G + 0.072 * rgbColor.B < 0.5 ? '#FFF' : '#000';
        }
        if (ErrorDesignData[1].indexOf("font-family") > -1) {
            var fontFamily = ErrorDesignData[1].split(":")[1];
            $("#ui_ddlErrorFontFamily").val(fontFamily);
        }
        if (ErrorDesignData[2].indexOf("font-size") > -1) {
            var fontSize = ErrorDesignData[2].split(":")[1];
            $("#ui_ddlErrorFontSize").val(fontSize);
        }
        if (ErrorDesignData[3].indexOf("font-style") > -1) {
            var fontStyle = ErrorDesignData[3].split(":")[1];
            $("#ui_ddlErrorFontStyle").val(fontStyle);
        }
        if (ErrorDesignData[4].indexOf("font-weight") > -1) {
            var fontWeight = ErrorDesignData[4].split(":")[1];
            $("#ui_ddlErrorFontWeight").val(fontWeight);
        }
        if (ErrorDesignData[5].indexOf("padding") > -1) {
            var padding = ErrorDesignData[5].split(":")[1];
            $("#ui_ddlErrorPadding").val(padding);
        }
        if (ErrorDesignData[6].indexOf("margin") > -1) {
            var margin = ErrorDesignData[6].split(":")[1];
            $("#ui_ddlErrorMargin").val(margin);
        }
        if (ErrorDesignData[7].indexOf("line-height") > -1) {
            var lineHeight = ErrorDesignData[7].split(":")[1];
            $("#ui_ddlErrorLineHeight").val(lineHeight);
        }
    }
    else if (formDetails.IsErrorCustomCss == true) {
        $("#ui_radErrorCustom").prop("checked", true);
        $("#dvErrorStandardCss").hide();
        $("#dvErrorCustomeCss").show();

        $("#ui_txtErrorCustomCss").val(formDetails.ErrorCss);
    }
};

$("#ui_chkBackground").click(function () {
    if ($(this).is(":checked"))
        $(".bgDesing").removeClass("BlurAndOpacity");
    else
        $(".bgDesing").addClass("BlurAndOpacity");
});

$("#ui_chkCloseCss").click(function () {
    if ($(this).is(":checked"))
        $("#dvMainCloseCss").removeClass("BlurAndOpacity");
    else
        $("#dvMainCloseCss").addClass("BlurAndOpacity");
});

$("input:radio[name='OnInPage']").click(function () {

    if ($("#ui_radOnPage").is(":checked")) {
        $(".settingEffect").removeClass("BlurAndOpacity");
        $("#ui_trRedirectUrl").hide();

    }
    else {
        $(".settingEffect").addClass("BlurAndOpacity");
        $("#ui_trRedirectUrl").show();
    }
});

$("input:radio[name='bgStandardCustom']").click(function () {

    if ($("#ui_radBgStandard").is(":checked")) {
        $("#dvBgStandardCss").show(1000);
        $("#dvBgCustomCss").hide(1000);
    }
    else {
        $("#dvBgCustomCss").show(1000);
        $("#dvBgStandardCss").hide(1000);
    }
});

$("input:radio[name='CloseStandardCustom']").click(function () {

    if ($("#ui_radClosetandard").is(":checked")) {
        $("#dvCloseStandardDesign").show(1000);
        $("#dvCloseCustomDesign").hide(1000);
    }
    else {
        $("#dvCloseCustomDesign").show(1000);
        $("#dvCloseStandardDesign").hide(1000);
    }
});

$("input:radio[name='ButtonStandardCustom']").click(function () {

    if ($("#ui_radButtonStandard").is(":checked")) {
        $("#dvMainButtonStandardCss").show(1000);
        $("#dvMainButtonCustomCss").hide(1000);
    }
    else {
        $("#dvMainButtonCustomCss").show(1000);
        $("#dvMainButtonStandardCss").hide(1000);
    }
});

$("input:radio[name='TitleStandardCustom']").click(function () {

    if ($("#ui_radTitleStandard").is(":checked")) {
        $("#dvTitleStandardCss").show(1000);
        $("#dvTitleCustomeCss").hide(1000);
    }
    else {
        $("#dvTitleCustomeCss").show(1000);
        $("#dvTitleStandardCss").hide(1000);
    }
});

$("input:radio[name='DescriptionStandardCustom']").click(function () {

    if ($("#ui_radDescriptionStandard").is(":checked")) {
        $("#dvDescriptionStandardCss").show(1000);
        $("#dvDescriptionCustomeCss").hide(1000);
    }
    else {
        $("#dvDescriptionCustomeCss").show(1000);
        $("#dvDescriptionStandardCss").hide(1000);
    }
});

$("input:radio[name='LabelStandardCustom']").click(function () {

    if ($("#ui_radLabelStandard").is(":checked")) {
        $("#dvLabelStandardCss").show(1000);
        $("#dvLabelCustomeCss").hide(1000);
    }
    else {
        $("#dvLabelCustomeCss").show(1000);
        $("#dvLabelStandardCss").hide(1000);
    }
});

$("input:radio[name='TextBoxDropdownStandardCustom']").click(function () {

    if ($("#ui_radTextBoxDropdownStandard").is(":checked")) {
        $("#dvTextBoxDropdownStandardCss").show(1000);
        $("#dvTextBoxDropdownCustomCss").hide(1000);
    }
    else {
        $("#dvTextBoxDropdownCustomCss").show(1000);
        $("#dvTextBoxDropdownStandardCss").hide(1000);
    }
});

$(".designEachOptionTitle").click(function () {
    if ($(this).next().is("visible"))
        $(this).next().hide(1000);
    else
        $(this).next().show(1000);
    var mainEventObj = $(this).next();
    $(".designEachOption").each(function () {
        if ($(this).attr("id") != mainEventObj.attr("id")) {
            $(this).hide(1000);
        }
    });
});

$("#ui_txtCloseBgColor").change(function () {
    $("#ui_lblCloseBtnUploadValue").val("");
});

$("#ui_txtbackgroundColor").change(function () {
    $("#ui_FilebackgroundImage").val("");
});

$("#ui_txtButtonBgColor").change(function () {
    $("#ui_FileButtonImage").val("");
});

$("input:radio[name='PageLoadOrOnExitOrOnScroll']").click(function () {
    if ($(this).val() == "2") {
        $("#ui_txtShowOnScrollDownHeight").removeClass("tdHide");
    }
    else {
        $("#ui_txtShowOnScrollDownHeight").addClass("tdHide");
    }
});

$("input:radio[name='ErrorStandardCustom']").click(function () {

    if ($("#ui_radErrorStandard").is(":checked")) {
        $("#dvErrorStandardCss").show(1000);
        $("#dvErrorCustomeCss").hide(1000);
    }
    else {
        $("#dvErrorCustomeCss").show(1000);
        $("#dvErrorStandardCss").hide(1000);
    }
});

function GetFlashImageUploaded(tagId, CallBack) {

    $("#" + tagId).change(function () {
        $("#dvLoading").show();
        var data = new FormData();
        var files = $("#" + tagId).get(0).files;
        if (files.length > 0) {
            data.append("UploadedImage", files[0]);
        }
        $.ajax({
            url: "/FileUpload/UploadFile",
            type: 'POST',
            data: data,
            contentType: false,
            processData: false,
            success: function (response) {
                CallBack(response.filePath);
                $("#" + tagId).replaceWith($("#" + tagId).clone());
                GetFlashImageUploaded(tagId, CallBack);
            },
            error: ShowAjaxError
        });
    });
}

function BackGroundUploadedData(outputdata) {
    $("#ui_FilebackgroundImage").val(outputdata);
    $("#dvLoading").hide();

    if ($("#iframeFormPreview").is(":visible")) {
        $("#ui_lblPreview").click();
    }
}

function ButtonStandardImage(outputdata) {
    $("#ui_FileButtonImage").val(outputdata);
    $("#dvLoading").hide();

    if ($("#iframeFormPreview").is(":visible")) {
        $("#ui_lblPreview").click();
    }
}

function CloseBtnImage(outputdata) {
    $("#ui_lblCloseBtnUploadValue").val(outputdata);
    $("#dvLoading").hide();

    if ($("#iframeFormPreview").is(":visible")) {
        $("#ui_lblPreview").click();
    }
}

function BgCustomImage(outputdata) {

    ChangeStyleContentForBgImg($("#ui_bgCustomStyle"), outputdata);
    $("#dvLoading").hide();

    if ($("#iframeFormPreview").is(":visible")) {
        $("#ui_lblPreview").click();
    }
}

GetOnlyBackgroundDesign = function () {

    var bgContent = "", IsCustomBgDesign = false, backgroundFadeColor = "", isPercentageWise = $("#ui_radBgOnpixel").is(":checked") ? "px" : "%";

    bgContent = "height:" + $("#ui_txtHeight").val() + isPercentageWise + ";width:" + $("#ui_txtWidth").val() + isPercentageWise + ";";

    if ($("#ui_radBgStandard").is(":checked")) {
        if ($("#ui_chkBackground").is(":checked")) {

            if ($("#ui_FilebackgroundImage").val().length > 0) {
                bgContent += "background-image:url(" + $("#ui_FilebackgroundImage").val() + ");";
            }
            else {
                var colorCode = ConvertHexColorToRGB($("#ui_txtbackgroundColor").val().replace("#", ""));
                bgContent += "background-color:rgba(" + colorCode.R + "," + colorCode.G + "," + colorCode.B + "," + parseInt($("#ui_txtOpacityValue").val()) / 10 + ");";
            }

            bgContent += "padding:" + $("#ui_ddlbgPadding").val() + ";";
            bgContent += "border-radius:" + $("#ui_ddlBgBorderRadius").val() + ";";

            var colorCode = ConvertHexColorToRGB($("#ui_txtBorderColor").val().replace("#", ""));
            bgContent += "border:solid " + $("#ui_ddlBgBorderWidth").val() + " rgba(" + colorCode.R + "," + colorCode.G + "," + colorCode.B + "," + parseInt($("#ui_txtOpacityValue").val()) / 10 + ");";
        }
        else {
            bgContent += "background:none;";
        }
    }
    else if ($("#ui_radBgCustom").is(":checked")) {
        IsCustomBgDesign = true;
        bgContent += $("#ui_bgCustomStyle").val();
    }

    if ($("#ui_chkBackGroundFadeColorOpacity").is(":checked")) {
        backgroundFadeColor = "background-color:" + $("#ui_txtBackGroundFadeColorOpacity").val() + ";opacity:" + parseInt($("#ui_txBackGroundFadeOpacityValue").val()) / 10 + ";";
    }

    return { bgContent: bgContent, IsCustomBgDesign: IsCustomBgDesign, backgroundFadeColor: backgroundFadeColor }
};

function ErrorDesignCss() {
    var cssContent = "", IsCustomDesign = false;

    if ($("#ui_radErrorStandard").is(":checked")) {
        cssContent += "color:" + $("#ui_txtErrorColor").val() + ";";
        cssContent += "font-family:" + $("#ui_ddlErrorFontFamily").val() + ";";
        cssContent += "font-size:" + $("#ui_ddlErrorFontSize").val() + ";";
        cssContent += "font-style:" + $("#ui_ddlErrorFontStyle").val() + ";";
        cssContent += "font-weight:" + $("#ui_ddlErrorFontWeight").val() + ";";
        cssContent += "padding:" + $("#ui_ddlErrorPadding").val() + ";";
        cssContent += "margin:" + $("#ui_ddlErrorMargin").val() + ";";
        cssContent += "line-height:" + $("#ui_ddlErrorLineHeight").val() + ";";
    }
    else if ($("#ui_radErrorCustom").is(":checked")) {
        IsCustomDesign = true;
        cssContent = $("#ui_txtErrorCustomCss").val();
    }
    return { cssContent: cssContent, IsCustomDesign: IsCustomDesign }

};
