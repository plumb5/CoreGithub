$(document).ready(function () {
    $("#dvLoading").hide();
});

$("#ui_btnSubmitCardDetails").click(function () {

    //Card Name
    if ($.trim($("#ui_txtNameOnCard").val()).length == 0) {
        ShowErrorMessage("Please enter the Card Name");
        $("#ui_txtNameOnCard").focus();
        return false;
    }
    //Card Number
    if ($.trim($("#txtCardNumber1").val()).length == 0 || $("#txtCardNumber1").val().length > 4 || $("#txtCardNumber1").val() < 0 || $("#txtCardNumber1").val().length < 4) {
        ShowErrorMessage("Please enter the first 4 digits of Card Number Correctly");
        $("#txtCardNumber1").focus();
        return false;
    }
   
    if ($.trim($("#txtCardNumber2").val()).length == 0 || $("#txtCardNumber2").val().length > 4 || $("#txtCardNumber2").val() < 0 || $("#txtCardNumber2").val().length < 4) {
        ShowErrorMessage("Please enter the second 4 digits of Card Number Correctly");
        $("#txtCardNumber2").focus();
        return false;
    }

    if ($.trim($("#txtCardNumber3").val()).length == 0 || $("#txtCardNumber3").val().length > 4 || $("#txtCardNumber3").val() < 0 || $("#txtCardNumber3").val().length < 4) {
        ShowErrorMessage("Please enter the third 4 digits of Card Number Correctly");
        $("#txtCardNumber3").focus();
        return false;
    }

    if ($.trim($("#txtCardNumber4").val()).length == 0 || $("#txtCardNumber4").val().length > 4 || $("#txtCardNumber4").val() < 0 || $("#txtCardNumber4").val().length < 4) {
        ShowErrorMessage("Please enter the fourth 4 digits of Card Number Correctly");
        $("#txtCardNumber4").focus();
        return false;
    }

    //Date validation
    var currentDate = new Date();

    var month = currentDate.getMonth() + 1;
    var CurrentYear = currentDate.getFullYear();

    if ($.trim($("#txtMonth").val()).length == 0) {
        ShowErrorMessage("Please enter the  month");
        $("#txtMonth").focus();
        return false;
    }

    if ($("#txtMonth").val() > 12 || $("#txtMonth").val() < 0 || $("#txtMonth").val().length > 2) {
        ShowErrorMessage("Please enter valid month");
        $("#txtMonth").focus();
        return false;
    }
    if ($.trim($("#txtYear").val()).length == 0) {
        ShowErrorMessage("Please enter the year");
        $("#txtYear").focus();
        return false;
    }
    if ($("#txtYear").val() < CurrentYear || $("#txtYear").val().length > 4 || $("#txtYear").val().length < 4) {
        ShowErrorMessage("Please enter valid year");
        $("#txtYear").focus();
        return false;
    }

    if ($("#txtYear").val() < CurrentYear) {
        ShowErrorMessage("Your card is already expired year.");
        return false;
    }
    if ($("#txtMonth").val() < month && $("#txtYear").val() == CurrentYear) {
        ShowErrorMessage("Your card is already expired.");
        return false;
    }
    //Card Verification Number 
    if ($.trim($("#ui_txtCardVerificationNumber").val()).length == 0 || $("#ui_txtCardVerificationNumber").val().length > 3 || $("#ui_txtCardVerificationNumber").val() < 0 || $("#ui_txtCardVerificationNumber").val().length < 3) {
        ShowErrorMessage("Please enter correct CVV");
        $("#ui_txtCardVerificationNumber").focus();
        return false;
    }

    return true;
});


function ValidateAlpha(evt) {
    var keyCode = (evt.which) ? evt.which : evt.keyCode
    if ((keyCode < 65 || keyCode > 90) && (keyCode < 97 || keyCode > 123) && keyCode != 32)
        return false;
    return true;
}

function autotab(event, destination) {
    var charCode;
    if (window.event)
        charCode = window.event.keyCode; //IE
    else
        charCode = event.which; //firefox    


    if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;

    if ($("#" + event.target.id).val().length == 3) {
        $("#" + destination).focus();
    }
    return true;
}



function Delete(CardDetailsId) {

    $("#dialog-confirm").dialog({
        resizable: false,
        height: 170,
        modal: true,
        buttons: {
            "Delete": function () {
                DeleteCardDetails(CardDetailsId);
                $(this).dialog("close");
            },
            Cancel: function () {
                $(this).dialog("close");
            }
        }
    });
}

function DeleteCardDetails(CardDetailsId) {
    $("#dvLoading").show();
    $.ajax({
        url: "../Account/DeleteCardDetails",
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ 'CardDetailsId': CardDetailsId }),
        success: function (response) {
            if (response) {
                $("#ui_div_" + CardDetailsId).hide("fast", function () {
                    $(this).remove();
                    if ($("#ui_dvData > .itemStyle").length == 0) {
                        $("#ui_dvData").html("<div class='itemStyle'>No records found</div>");
                    }
                });
            }
            else {
                ShowErrorMessage("Unable to delete");
            }
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
}
