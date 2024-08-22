$(document).ready(function () {  

});
var optionsBound = false;

$("#Ui_LmsField").click(function () {
    HidePageLoading();
    $('#ui_ddlPublisher, #custrad01, #custrad02, #pubcustrad01, #pubcustrad02').prop('disabled', true);
    $('#ui_ddlpriPublisher, #pricustrad3, #pricustrad4, #pripubcustrad3, #pripubcustrad4').prop('disabled', true);
    $('#ui_ddlallPublisher, #allcustrad5, #allcustrad6, #allpubcustrad5, #allpubcustrad6').prop('disabled', true);

    $('#ui_ddlFieldType1, #custrad1, #custrad2, #pubcustrad1, #pubcustrad2').prop('disabled', true);
    $('#ui_ddlFieldType2, #custrad3, #custrad4, #pubcustrad3, #pubcustrad4').prop('disabled', true);
    $('#ui_ddlFieldType3, #custrad5, #custrad6, #pubcustrad5, #pubcustrad6').prop('disabled', true);
    $('#ui_ddlFieldType4, #custrad7, #custrad8, #pubcustrad7, #pubcustrad8').prop('disabled', true);
    $('#ui_ddlFieldType5, #custrad9, #custrad10, #pubcustrad9, #pubcustrad10').prop('disabled', true);
    $('#ui_ddlFieldType6, #custrad11, #custrad12, #pubcustrad11, #pubcustrad12').prop('disabled', true);
    $('#ui_ddlFieldType7, #custrad13, #custrad14, #pubcustrad13, #pubcustrad14').prop('disabled', true);
    $('#ui_ddlFieldType8, #custrad15, #custrad16, #pubcustrad15, #pubcustrad16').prop('disabled', true);
    $('#ui_ddlFieldType9, #custrad17, #custrad18, #pubcustrad17, #pubcustrad18').prop('disabled', true);
    $('#ui_ddlFieldType10, #custrad19, #custrad20, #pubcustrad19, #pubcustrad20').prop('disabled', true);

    $('#ui_ddlFieldType11, #custrad21, #custrad22, #pubcustrad21, #pubcustrad22').prop('disabled', true);
    $('#ui_ddlFieldType12, #custrad23, #custrad24, #pubcustrad23, #pubcustrad24').prop('disabled', true);
    $('#ui_ddlFieldType13, #custrad25, #custrad26, #pubcustrad25, #pubcustrad26').prop('disabled', true);
    $('#ui_ddlFieldType14, #custrad27, #custrad28, #pubcustrad27, #pubcustrad28').prop('disabled', true);
    $('#ui_ddlFieldType15, #custrad29, #custrad30, #pubcustrad29, #pubcustrad30').prop('disabled', true);

    if (!optionsBound) {
        for (var i = 0; i < PropertySetting.length; i++) {
            var option = $("<option></option>");
            option.val(PropertySetting[i].PropertyName);
            option.text(PropertySetting[i].DisplayName);
            $(".ddlCotactFld").append(option);
        }

        optionsBound = true;  
    }
    GetLmsCustomFields();
    $("#ui_divLmsFields").removeClass("hideDiv");
});

$("#ui_btnCloseLeadField, #ui_iCloseLeadField").click(function () {
    $("#ui_divLmsFields").addClass("hideDiv");
});

function validation() {
    const specialCharRegex = /[^a-zA-Z0-9\s]/;
    const invalidField = ['#ui_txtPublisher', '#ui_txtpriPublisher','#ui_txtallPublisher', '#ui_txtCustomfieldName2', '#ui_txtCustomfieldName3', '#ui_txtCustomfieldName4', '#ui_txtCustomfieldName5', '#ui_txtCustomfieldName6', '#ui_txtCustomfieldName7', '#ui_txtCustomfieldName8', '#ui_txtCustomfieldName9', '#ui_txtCustomfieldName10']
        .find(fieldId => specialCharRegex.test($(fieldId).val().trim()));

    if (invalidField) {
        ShowErrorMessage(GlobalErrorList.LmsCustomFields.FieldName);
        return false;
    }
    if ($('#ui_txtCustomfieldName1').val() == "") {
        if ($('#ui_txtCustomfieldName2').val() != "" || $('#ui_txtCustomfieldName3').val() != "" || $('#ui_txtCustomfieldName4').val() != "" || $('#ui_txtCustomfieldName5').val() != "" || $('#ui_txtCustomfieldName6').val() != "" || $('#ui_txtCustomfieldName7').val() != "" || $('#ui_txtCustomfieldName8').val() != "" || $('#ui_txtCustomfieldName9').val() != "" || $('#ui_txtCustomfieldName10').val() != "") {
            ShowErrorMessage(GlobalErrorList.LmsCustomFields.CustomFields1);
            return;
        }
    }
    if ($('#ui_txtCustomfieldName2').val() == "") {
        if ($('#ui_txtCustomfieldName3').val() != "" || $('#ui_txtCustomfieldName4').val() != "" || $('#ui_txtCustomfieldName5').val() != "" || $('#ui_txtCustomfieldName6').val() != "" || $('#ui_txtCustomfieldName7').val() != "" || $('#ui_txtCustomfieldName8').val() != "" || $('#ui_txtCustomfieldName9').val() != "" || $('#ui_txtCustomfieldName10').val() != "" ) {
            ShowErrorMessage(GlobalErrorList.LmsCustomFields.CustomFields2);
            return;
        }
    }
    if ($('#ui_txtCustomfieldName3').val() == "") {
        if ($('#ui_txtCustomfieldName4').val() != "" || $('#ui_txtCustomfieldName5').val() != "" || $('#ui_txtCustomfieldName6').val() != "" || $('#ui_txtCustomfieldName7').val() != "" || $('#ui_txtCustomfieldName8').val() != "" || $('#ui_txtCustomfieldName9').val() != "" || $('#ui_txtCustomfieldName10').val() != "" ) {
            ShowErrorMessage(GlobalErrorList.LmsCustomFields.CustomFields3);
            return;
        }
    }
    if ($('#ui_txtCustomfieldName4').val() == "") {
        if ($('#ui_txtCustomfieldName5').val() != "" || $('#ui_txtCustomfieldName6').val() != "" || $('#ui_txtCustomfieldName7').val() != "" || $('#ui_txtCustomfieldName8').val() != "" || $('#ui_txtCustomfieldName9').val() != "" || $('#ui_txtCustomfieldName10').val() != "") {
            ShowErrorMessage(GlobalErrorList.LmsCustomFields.CustomFields4);
            return;
        }
    }
    if ($('#ui_txtCustomfieldName5').val() == "") {
        if ($('#ui_txtCustomfieldName6').val() != "" || $('#ui_txtCustomfieldName7').val() != "" || $('#ui_txtCustomfieldName8').val() != "" || $('#ui_txtCustomfieldName9').val() != "" || $('#ui_txtCustomfieldName10').val() != "") {
            ShowErrorMessage(GlobalErrorList.LmsCustomFields.CustomFields5);
            return;
        }
    }
    if ($('#ui_txtCustomfieldName6').val() == "") {
        if ($('#ui_txtCustomfieldName7').val() != "" || $('#ui_txtCustomfieldName8').val() != "" || $('#ui_txtCustomfieldName9').val() != "" || $('#ui_txtCustomfieldName10').val() != "") {
            ShowErrorMessage(GlobalErrorList.LmsCustomFields.CustomFields6);
            return;
        }
    }
    if ($('#ui_txtCustomfieldName7').val() == "") {
        if ($('#ui_txtCustomfieldName8').val() != "" || $('#ui_txtCustomfieldName9').val() != "" || $('#ui_txtCustomfieldName10').val() != "") {
            ShowErrorMessage(GlobalErrorList.LmsCustomFields.CustomFields7);
            return;
        }
    }
    if ($('#ui_txtCustomfieldName8').val() == "") {
        if ($('#ui_txtCustomfieldName9').val() != "" || $('#ui_txtCustomfieldName10').val() != "") {
            ShowErrorMessage(GlobalErrorList.LmsCustomFields.CustomFields8);
            return;
        }
    }
    if ($('#ui_txtCustomfieldName9').val() == "") {
        if ($('#ui_txtCustomfieldName10').val() != "") {
            ShowErrorMessage(GlobalErrorList.LmsCustomFields.CustomFields9);
            return;
        }
    }

    if ($('#ui_txtCustomfieldName10').val() == "") {
        if ($('#ui_txtCustomfieldName11').val() != "") {
            ShowErrorMessage(GlobalErrorList.LmsCustomFields.CustomFields9);
            return;
        }
    }
    if ($('#ui_txtCustomfieldName11').val() == "") {
        if ($('#ui_txtCustomfieldName12').val() != "") {
            ShowErrorMessage(GlobalErrorList.LmsCustomFields.CustomFields9);
            return;
        }
    }
    if ($('#ui_txtCustomfieldName12').val() == "") {
        if ($('#ui_txtCustomfieldName13').val() != "") {
            ShowErrorMessage(GlobalErrorList.LmsCustomFields.CustomFields9);
            return;
        }
    }
    if ($('#ui_txtCustomfieldName13').val() == "") {
        if ($('#ui_txtCustomfieldName14').val() != "") {
            ShowErrorMessage(GlobalErrorList.LmsCustomFields.CustomFields9);
            return;
        }
    }
    if ($('#ui_txtCustomfieldName14').val() == "") {
        if ($('#ui_txtCustomfieldName15').val() != "") {
            ShowErrorMessage(GlobalErrorList.LmsCustomFields.CustomFields9);
            return;
        }
    }

    var checkboxesToCheck = ['#custrad02','#pricustrad2','#allcustrad2','#custrad2', '#custrad4', '#custrad6', '#custrad8', '#custrad10', '#custrad12', '#custrad14', '#custrad16', '#custrad18', '#custrad20', '#custrad22', '#custrad24', '#custrad26', '#custrad28', '#custrad30'];
    var checkedCheckboxes = checkboxesToCheck.filter(function (checkboxId) {
        return $(checkboxId).prop('checked');
    });

    if (checkedCheckboxes.length > 5) {
       
        ShowErrorMessage(GlobalErrorList.LmsCustomFields.SearchBy);      
        $(checkedCheckboxes[checkedCheckboxes.length - 1]).prop('checked', false);
        return;
    }

    var pubcheckboxesToCheck = ['#pubcustrad02', '#pripubcustrad2', '#allpubcustrad2','#pubcustrad2', '#pubcustrad4', '#pubcustrad6', '#pubcustrad8', '#pubcustrad10', '#pubcustrad12', '#pubcustrad14', '#pubcustrad16', '#pubcustrad18', '#pubcustrad20', '#pubcustrad22', '#pubcustrad24', '#pubcustrad26', '#pubcustrad28', '#pubcustrad30'];
    var pubcheckedCheckboxes = pubcheckboxesToCheck.filter(function (checkboxId) {
        return $(checkboxId).prop('checked');
    });

    if (pubcheckedCheckboxes.length > 5) {

        ShowErrorMessage(GlobalErrorList.LmsCustomFields.SearchBy);
        $(checkedCheckboxes[pubcheckedCheckboxes.length - 1]).prop('checked', false);
        return;
    }
    return true;
}

$('#ui_txtPublisher').on('input', function () {
    var textBoxValue = $(this).val();

    if (textBoxValue.trim().length > 0) {
        $('#ui_ddlPublisher, #custrad01, #custrad02, #pubcustrad01, #pubcustrad02').prop('disabled', false);
    } else {
        $('#ui_ddlPublisher, #custrad01, #custrad02, #pubcustrad01, #pubcustrad02').prop({ disabled: true, selectedIndex: 0 }).filter(':checked').prop('checked', false);
    }
});
$('#ui_txtpriPublisher').on('input', function () {
    var textBoxValue = $(this).val();

    if (textBoxValue.trim().length > 0) {
        $('#ui_ddlpriPublisher, #pricustrad1, #pricustrad2, #pripubcustrad1, #pripubcustrad2').prop('disabled', false);
    } else {
        $('#ui_ddlpriPublisher, #pricustrad1, #pricustrad2, #pripubcustrad1, #pripubcustrad2').prop({ disabled: true, selectedIndex: 0 }).filter(':checked').prop('checked', false);
    }
});
$('#ui_txtallPublisher').on('input', function () {
    var textBoxValue = $(this).val();

    if (textBoxValue.trim().length > 0) {
        $('#ui_ddlallPublisher, #allcustrad1, #allcustrad2, #allpubcustrad1, #allpubcustrad2').prop('disabled', false);
    } else {
        $('#ui_ddlallPublisher, #allcustrad1, #allcustrad2, #allpubcustrad1, #allpubcustrad2').prop({ disabled: true, selectedIndex: 0 }).filter(':checked').prop('checked', false);

    }
});

//-----------------------------------------------------

$('#ui_txtCustomfieldName1').on('input', function () {
    var textBoxValue = $(this).val();

    if (textBoxValue.trim().length > 0) {
        $('#ui_ddlFieldType1, #custrad1, #custrad2, #pubcustrad1, #pubcustrad2').prop('disabled', false);
    } else {
        $('#ui_ddlFieldType1, #custrad1, #custrad2, #pubcustrad1, #pubcustrad2').prop({ disabled: true, selectedIndex: 0 }).filter(':checked').prop('checked', false);
    }
});
$('#ui_txtCustomfieldName2').on('input', function () {
    var textBoxValue = $(this).val();

    if (textBoxValue.trim().length > 0) {
        $('#ui_ddlFieldType2, #custrad3, #custrad4, #pubcustrad3, #pubcustrad4').prop('disabled', false);
    } else {
        $('#ui_ddlFieldType2, #custrad3, #custrad4, #pubcustrad3, #pubcustrad4').prop({ disabled: true, selectedIndex: 0 }).filter(':checked').prop('checked', false);
    }
});
$('#ui_txtCustomfieldName3').on('input', function () {
    var textBoxValue = $(this).val();

    if (textBoxValue.trim().length > 0) {
        $('#ui_ddlFieldType3, #custrad5, #custrad6, #pubcustrad5, #pubcustrad6').prop('disabled', false);
    } else {
        $('#ui_ddlFieldType3, #custrad5, #custrad6, #pubcustrad5, #pubcustrad6').prop({ disabled: true, selectedIndex: 0 }).filter(':checked').prop('checked', false);

    }
});
$('#ui_txtCustomfieldName4').on('input', function () {
    var textBoxValue = $(this).val();

    if (textBoxValue.trim().length > 0) {
        $('#ui_ddlFieldType4, #custrad7, #custrad8, #pubcustrad7, #pubcustrad8').prop('disabled', false);
    } else {
        $('#ui_ddlFieldType4, #custrad7, #custrad8, #pubcustrad7, #pubcustrad8').prop({ disabled: true, selectedIndex: 0 }).filter(':checked').prop('checked', false);
    }
});
$('#ui_txtCustomfieldName5').on('input', function () {
    var textBoxValue = $(this).val();

    if (textBoxValue.trim().length > 0) {
        $('#ui_ddlFieldType5, #custrad9, #custrad10, #pubcustrad9, #pubcustrad10').prop('disabled', false);
    } else {
       // $('#ui_ddlFieldType5, #custrad9, #custrad10').prop('disabled', true);
        $('#ui_ddlFieldType5, #custrad9, #custrad10, #pubcustrad9, #pubcustrad10').prop({ disabled: true, selectedIndex: 0 }).filter(':checked').prop('checked', false);
    }
});
$('#ui_txtCustomfieldName6').on('input', function () {
    var textBoxValue = $(this).val();

    if (textBoxValue.trim().length > 0) {
        $('#ui_ddlFieldType6, #custrad11, #custrad12, #pubcustrad11, #pubcustrad12').prop('disabled', false);
    } else {
        $('#ui_ddlFieldType6, #custrad11, #custrad12, #pubcustrad11, #pubcustrad12').prop({ disabled: true, selectedIndex: 0 }).filter(':checked').prop('checked', false);
    }
});
$('#ui_txtCustomfieldName7').on('input', function () {
    var textBoxValue = $(this).val();

    if (textBoxValue.trim().length > 0) {
        $('#ui_ddlFieldType7, #custrad13, #custrad14, #pubcustrad13, #pubcustrad14').prop('disabled', false);
    } else {
        $('#ui_ddlFieldType7, #custrad13, #custrad14, #pubcustrad13, #pubcustrad14').prop({ disabled: true, selectedIndex: 0 }).filter(':checked').prop('checked', false);
    }
});
$('#ui_txtCustomfieldName8').on('input', function () {
    var textBoxValue = $(this).val();

    if (textBoxValue.trim().length > 0) {
        $('#ui_ddlFieldType8, #custrad15, #custrad16, #pubcustrad15, #pubcustrad16').prop('disabled', false);
    } else {
        $('#ui_ddlFieldType8, #custrad15, #custrad16, #pubcustrad15, #pubcustrad16').prop({ disabled: true, selectedIndex: 0 }).filter(':checked').prop('checked', false);
    }
});
$('#ui_txtCustomfieldName9').on('input', function () {
    var textBoxValue = $(this).val();

    if (textBoxValue.trim().length > 0) {
        $('#ui_ddlFieldType9, #custrad17, #custrad18, #pubcustrad17, #pubcustrad18').prop('disabled', false);
    } else {
        $('#ui_ddlFieldType9, #custrad17, #custrad18, #pubcustrad17, #pubcustrad18').prop({ disabled: true, selectedIndex: 0 }).filter(':checked').prop('checked', false);
    }
});
$('#ui_txtCustomfieldName10').on('input', function () {
    var textBoxValue = $(this).val();

    if (textBoxValue.trim().length > 0) {
        $('#ui_ddlFieldType10, #custrad19, #custrad20, #pubcustrad19, #pubcustrad20').prop('disabled', false);
    } else {
        $('#ui_ddlFieldType10, #custrad19, #custrad20, #pubcustrad19, #pubcustrad20').prop({ disabled: true, selectedIndex: 0 }).filter(':checked').prop('checked', false);
    }
});

//.....

$('#ui_txtCustomfieldName11').on('input', function () {
    var textBoxValue = $(this).val();

    if (textBoxValue.trim().length > 0) {
        $('#ui_ddlFieldType11, #custrad21, #custrad22, #pubcustrad21, #pubcustrad22').prop('disabled', false);
    } else {
        $('#ui_ddlFieldType11, #custrad21, #custrad22, #pubcustrad21, #pubcustrad22').prop({ disabled: true, selectedIndex: 0 }).filter(':checked').prop('checked', false);
    }
});

$('#ui_txtCustomfieldName12').on('input', function () {
    var textBoxValue = $(this).val();

    if (textBoxValue.trim().length > 0) {
        $('#ui_ddlFieldType12, #custrad23, #custrad24, #pubcustrad23, #pubcustrad24').prop('disabled', false);
    } else {
        $('#ui_ddlFieldType12, #custrad23, #custrad24, #pubcustrad23, #pubcustrad24').prop({ disabled: true, selectedIndex: 0 }).filter(':checked').prop('checked', false);
    }
});

$('#ui_txtCustomfieldName13').on('input', function () {
    var textBoxValue = $(this).val();

    if (textBoxValue.trim().length > 0) {
        $('#ui_ddlFieldType13, #custrad25, #custrad26, #pubcustrad25, #pubcustrad26').prop('disabled', false);
    } else {
        $('#ui_ddlFieldType13, #custrad25, #custrad26, #pubcustrad25, #pubcustrad26').prop({ disabled: true, selectedIndex: 0 }).filter(':checked').prop('checked', false);
    }
});

$('#ui_txtCustomfieldName14').on('input', function () {
    var textBoxValue = $(this).val();

    if (textBoxValue.trim().length > 0) {
        $('#ui_ddlFieldType14, #custrad27, #custrad28, #pubcustrad27, #pubcustrad28').prop('disabled', false);
    } else {
        $('#ui_ddlFieldType14, #custrad27, #custrad28, #pubcustrad27, #pubcustrad28').prop({ disabled: true, selectedIndex: 0 }).filter(':checked').prop('checked', false);
    }
});

$('#ui_txtCustomfieldName15').on('input', function () {
    var textBoxValue = $(this).val();

    if (textBoxValue.trim().length > 0) {
        $('#ui_ddlFieldType15, #custrad29, #custrad30, #pubcustrad29, #pubcustrad30').prop('disabled', false);
    } else {
        $('#ui_ddlFieldType15, #custrad29, #custrad30, #pubcustrad29, #pubcustrad30').prop({ disabled: true, selectedIndex: 0 }).filter(':checked').prop('checked', false);
    }
});



var LmsCustomFields = [];
var pubcustomField1 = {};
var pubcustomField2 = {};
var pubcustomField3 = {};

var customField1 = {};
var customField2 = {};
var customField3 = {};
var customField4 = {};
var customField5 = {};
var customField6 = {};
var customField7 = {};
var customField8 = {};
var customField9 = {};
var customField10 = {};
var customField11 = {};
var customField12 = {};
var customField13 = {};
var customField14 = {};
var customField15 = {};

$(document).on("click", "#ui_btn_Save", function () {
    if (!validation()) {
        // Validation failed, return or show an error message
        return false;
    }
    LmsCustomFields = [];

    pubcustomField1.FieldDisplayName = $('#ui_txtPublisher').val();
    pubcustomField1.Position = $('#ui_ddlPublisher').val();
    pubcustomField1.OverrideBy = $('#custrad01').prop('checked');
    pubcustomField1.SearchBy = $('#custrad02').prop('checked');
    pubcustomField1.PublisherField = $('#pubcustrad01').prop('checked');
    pubcustomField1.PublisherSearchBy = $('#pubcustrad02').prop('checked');
    pubcustomField1.FieldName = 'Publisher'
    LmsCustomFields.push(pubcustomField1);


    pubcustomField2.FieldDisplayName = $('#ui_txtpriPublisher').val();
    pubcustomField2.Position = $('#ui_ddlpriPublisher').val();
    pubcustomField2.OverrideBy = $('#pricustrad1').prop('checked');
    pubcustomField2.SearchBy = $('#pricustrad2').prop('checked');
    pubcustomField2.PublisherField = $('#pripubcustrad1').prop('checked');
    pubcustomField2.PublisherSearchBy = $('#pripubcustrad2').prop('checked');
    pubcustomField2.FieldName = 'PrimaryPublisher'
    LmsCustomFields.push(pubcustomField2);

    pubcustomField3.FieldDisplayName = $('#ui_txtallPublisher').val();
    pubcustomField3.Position = $('#ui_ddlallPublisher').val();
    pubcustomField3.OverrideBy = $('#allcustrad1').prop('checked');
    pubcustomField3.SearchBy = $('#allcustrad2').prop('checked');
    pubcustomField3.PublisherField = $('#allpubcustrad2').prop('checked');
    pubcustomField3.PublisherSearchBy = $('#allpubcustrad2').prop('checked');
    pubcustomField3.FieldName = 'AllPublisher'
    LmsCustomFields.push(pubcustomField3);

    //-----------------------------------------
    customField1.FieldDisplayName = $('#ui_txtCustomfieldName1').val();
    customField1.Position = $('#ui_ddlFieldType1').val();
    customField1.OverrideBy = $('#custrad1').prop('checked');
    customField1.SearchBy = $('#custrad2').prop('checked');
    customField1.PublisherField = $('#pubcustrad1').prop('checked');
    customField1.PublisherSearchBy = $('#pubcustrad2').prop('checked');
    customField1.FieldName ='LmsCustomField1'
    LmsCustomFields.push(customField1);

   
    customField2.FieldDisplayName = $('#ui_txtCustomfieldName2').val();
    customField2.Position = $('#ui_ddlFieldType2').val();
    customField2.OverrideBy = $('#custrad3').prop('checked');
    customField2.SearchBy = $('#custrad4').prop('checked');
    customField2.PublisherField = $('#pubcustrad3').prop('checked');
    customField2.PublisherSearchBy = $('#pubcustrad4').prop('checked');
    customField2.FieldName = 'LmsCustomField2'
    LmsCustomFields.push(customField2);

    customField3.FieldDisplayName = $('#ui_txtCustomfieldName3').val();
    customField3.Position  = $('#ui_ddlFieldType3').val();
    customField3.OverrideBy = $('#custrad5').prop('checked');
    customField3.SearchBy = $('#custrad6').prop('checked');
    customField3.PublisherField = $('#pubcustrad5').prop('checked');
    customField3.PublisherSearchBy = $('#pubcustrad6').prop('checked');
    customField3.FieldName = 'LmsCustomField3'
    LmsCustomFields.push(customField3);

    customField4.FieldDisplayName = $('#ui_txtCustomfieldName4').val();
    customField4.Position = $('#ui_ddlFieldType4').val();
    customField4.OverrideBy = $('#custrad7').prop('checked');
    customField4.SearchBy = $('#custrad8').prop('checked');
    customField4.PublisherField = $('#pubcustrad7').prop('checked');
    customField4.PublisherSearchBy = $('#pubcustrad8').prop('checked');
    customField4.FieldName = 'LmsCustomField4'
    LmsCustomFields.push(customField4);

    customField5.FieldDisplayName = $('#ui_txtCustomfieldName5').val();
    customField5.Position = $('#ui_ddlFieldType5').val();
    customField5.OverrideBy = $('#custrad9').prop('checked');
    customField5.SearchBy = $('#custrad10').prop('checked');
    customField5.PublisherField = $('#pubcustrad9').prop('checked');
    customField5.PublisherSearchBy = $('#pubcustrad10').prop('checked');
    customField5.FieldName = 'LmsCustomField5'
    LmsCustomFields.push(customField5);

    customField6.FieldDisplayName = $('#ui_txtCustomfieldName6').val();
    customField6.Position = $('#ui_ddlFieldType6').val();
    customField6.OverrideBy = $('#custrad11').prop('checked');
    customField6.SearchBy = $('#custrad12').prop('checked');
    customField6.PublisherField = $('#pubcustrad11').prop('checked');
    customField6.PublisherSearchBy = $('#pubcustrad12').prop('checked');
    customField6.FieldName = 'LmsCustomField6'
    LmsCustomFields.push(customField6);

    customField7.FieldDisplayName = $('#ui_txtCustomfieldName7').val();
    customField7.Position = $('#ui_ddlFieldType7').val();
    customField7.OverrideBy = $('#custrad13').prop('checked');
    customField7.SearchBy = $('#custrad14').prop('checked');
    customField7.PublisherField = $('#pubcustrad13').prop('checked');
    customField7.PublisherSearchBy = $('#pubcustrad14').prop('checked');
    customField7.FieldName = 'LmsCustomField7'
    LmsCustomFields.push(customField7);

    customField8.FieldDisplayName = $('#ui_txtCustomfieldName8').val();
    customField8.Position = $('#ui_ddlFieldType8').val();
    customField8.OverrideBy = $('#custrad15').prop('checked');
    customField8.SearchBy = $('#custrad16').prop('checked');
    customField8.PublisherField = $('#pubcustrad15').prop('checked');
    customField8.PublisherSearchBy = $('#pubcustrad16').prop('checked');
    customField8.FieldName = 'LmsCustomField8'
    LmsCustomFields.push(customField8);

    customField9.FieldDisplayName = $('#ui_txtCustomfieldName9').val();
    customField9.Position = $('#ui_ddlFieldType9').val();
    customField9.OverrideBy = $('#custrad17').prop('checked');
    customField9.SearchBy = $('#custrad18').prop('checked');
    customField9.PublisherField = $('#pubcustrad17').prop('checked');
    customField9.PublisherSearchBy = $('#pubcustrad18').prop('checked');
    customField9.FieldName = 'LmsCustomField9'
    LmsCustomFields.push(customField9);

    customField10.FieldDisplayName = $('#ui_txtCustomfieldName10').val();
    customField10.Position = $('#ui_ddlFieldType10').val();
    customField10.OverrideBy = $('#custrad19').prop('checked');
    customField10.SearchBy = $('#custrad20').prop('checked');
    customField10.PublisherField = $('#pubcustrad19').prop('checked');
    customField10.PublisherSearchBy = $('#pubcustrad20').prop('checked');
    customField10.FieldName = 'LmsCustomField10'
    LmsCustomFields.push(customField10);

    //-------

    customField11.FieldDisplayName = $('#ui_txtCustomfieldName11').val();
    customField11.Position = $('#ui_ddlFieldType11').val();
    customField11.OverrideBy = $('#custrad21').prop('checked');
    customField11.SearchBy = $('#custrad22').prop('checked');
    customField11.PublisherField = $('#pubcustrad21').prop('checked');
    customField11.PublisherSearchBy = $('#pubcustrad22').prop('checked');
    customField11.FieldName = 'LmsCustomField11'
    LmsCustomFields.push(customField11);

    customField12.FieldDisplayName = $('#ui_txtCustomfieldName12').val();
    customField12.Position = $('#ui_ddlFieldType12').val();
    customField12.OverrideBy = $('#custrad23').prop('checked');
    customField12.SearchBy = $('#custrad24').prop('checked');
    customField12.PublisherField = $('#pubcustrad23').prop('checked');
    customField12.PublisherSearchBy = $('#pubcustrad24').prop('checked');
    customField12.FieldName = 'LmsCustomField12'
    LmsCustomFields.push(customField12);

    customField13.FieldDisplayName = $('#ui_txtCustomfieldName13').val();
    customField13.Position = $('#ui_ddlFieldType13').val();
    customField13.OverrideBy = $('#custrad25').prop('checked');
    customField13.SearchBy = $('#custrad26').prop('checked');
    customField13.PublisherField = $('#pubcustrad25').prop('checked');
    customField13.PublisherSearchBy = $('#pubcustrad26').prop('checked');
    customField13.FieldName = 'LmsCustomField13'
    LmsCustomFields.push(customField13);

    customField14.FieldDisplayName = $('#ui_txtCustomfieldName14').val();
    customField14.Position = $('#ui_ddlFieldType14').val();
    customField14.OverrideBy = $('#custrad27').prop('checked');
    customField14.SearchBy = $('#custrad28').prop('checked');
    customField14.PublisherField = $('#pubcustrad27').prop('checked');
    customField14.PublisherSearchBy = $('#pubcustrad28').prop('checked');
    customField14.FieldName = 'LmsCustomField14'
    LmsCustomFields.push(customField14);

    customField15.FieldDisplayName = $('#ui_txtCustomfieldName15').val();
    customField15.Position = $('#ui_ddlFieldType15').val();
    customField15.OverrideBy = $('#custrad29').prop('checked');
    customField15.SearchBy = $('#custrad30').prop('checked');
    customField15.PublisherField = $('#pubcustrad29').prop('checked');
    customField15.PublisherSearchBy = $('#pubcustrad30').prop('checked');
    customField15.FieldName = 'LmsCustomField15'
    LmsCustomFields.push(customField15);


    var str = "";
    $.ajax({
        url: "/Prospect/LmsCustomFields/SaveLmsCustomFields",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId, 'LmsCustomFields': LmsCustomFields}), 
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            ShowSuccessMessage(GlobalErrorList.LmsCustomFields.Success);
        },
        error: ShowAjaxError
    });
});
 
function GetLmsCustomFields() {

    $.ajax({
        url: "/Prospect/LmsCustomFields/GetLmsCustomFields",
        type: 'Post',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            
           
            for (let i = 0; i < response.length; i++) {
                const fieldName = response[i].FieldName;
                if (fieldName == 'Publisher') {
                    $(`#ui_txtPublisher`).val(response[i].FieldDisplayName);
                    $(`#ui_ddlPublisher`).prop('disabled', false).val(response[i].Position);
                    $(`#custrad01`).prop('disabled', false).prop('checked', response[i].OverrideBy);
                    $(`#custrad02`).prop('disabled', false).prop('checked', response[i].SearchBy);
                    $(`#pubcustrad01`).prop('disabled', false).prop('checked', response[i].PublisherField);
                    $(`#pubcustrad02`).prop('disabled', false).prop('checked', response[i].PublisherSearchBy);
                }
                else if(fieldName == 'PrimaryPublisher') {
                    $(`#ui_txtpriPublisher`).val(response[i].FieldDisplayName);
                    $(`#ui_ddlpriPublisher`).prop('disabled', false).val(response[i].Position);
                    $(`#pricustrad1`).prop('disabled', false).prop('checked', response[i].OverrideBy);
                    $(`#pricustrad2`).prop('disabled', false).prop('checked', response[i].SearchBy);
                    $(`#pripubcustrad1`).prop('checked', response[i].PublisherField);
                    $(`#pripubcustrad2`).prop('checked', response[i].PublisherSearchBy);
                }
                else if (fieldName == 'AllPublisher') {
                    $(`#ui_txtallPublisher`).val(response[i].FieldDisplayName);
                    $(`#ui_ddlallPublisher`).prop('disabled', false).val(response[i].Position);
                    $(`#allcustrad1`).prop('checked', response[i].OverrideBy);
                    $(`#allcustrad2`).prop('checked', response[i].SearchBy);
                    $(`#allpubcustrad1`).prop('checked', response[i].PublisherField);
                    $(`#allpubcustrad2`).prop('checked', response[i].PublisherSearchBy);
                }
                else {
                    const fieldNumber = parseInt(fieldName.replace("LmsCustomField", ""));
                    const $txtField = $(`#ui_txtCustomfieldName${fieldNumber}`);
                    const $ddlField = $(`#ui_ddlFieldType${fieldNumber}`);
                    const $overrideCheckbox = $(`#custrad${2 * fieldNumber - 1}`);
                    const $searchCheckbox = $(`#custrad${2 * fieldNumber}`);
                    const $publisherfield = $(`#pubcustrad${2 * fieldNumber - 1}`);
                    const $publishersearchby = $(`#pubcustrad${2 * fieldNumber}`);

                    if ($txtField.length) {
                        $txtField.val(response[i].FieldDisplayName);
                    }
                    if ($ddlField.length) {
                        $ddlField.val(response[i].Position);
                    }
                    if ($overrideCheckbox.length) {
                        $overrideCheckbox.prop('checked', response[i].OverrideBy);
                    }
                    if ($searchCheckbox.length) {
                        $searchCheckbox.prop('checked', response[i].SearchBy);
                    }
                    if ($publisherfield.length) {
                        $publisherfield.prop('checked', response[i].PublisherField);
                    }
                    if ($publishersearchby.length) {
                        $publishersearchby.prop('checked', response[i].PublisherSearchBy);
                    }
                    $ddlField.prop('disabled', false);
                    $overrideCheckbox.prop('disabled', false);
                    $searchCheckbox.prop('disabled', false);
                    $publisherfield.prop('disabled', false);
                    $publishersearchby.prop('disabled', false);
                }
            }

        },
        error: function (error) {
         
        }
    });
}