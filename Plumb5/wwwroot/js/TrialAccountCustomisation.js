
var userDetails = {
    FirstName: "", EmailId: "", MobilePhone: "", DomainForTrack: ""
};

$("#trailSubmit").click(function () {

    if (!Validation()) {
        return;
    }

    userDetails.FirstName = $("#trailName").val();
    userDetails.EmailId = $("#trailEmail").val();
    userDetails.MobilePhone = $("#trailPhone").val();
    userDetails.DomainForTrack = $("#trailWebsite").val();

    $.ajax({
        url: "../SignUpSignIn/TrialAccount",
        type: 'Post',
        data: JSON.stringify({ 'userDetails': userDetails }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response.d.ErrorMessage != null && response.d.ErrorMessage.length > 0) {
                $("#ermess").show().html(response.d.ErrorMessage);
            }
            else {
                $("#trailSubmit").prop("disabled", true);
                $("#ermess").show().html("Your account has been created and E-Mail verification link is sent to your inbox");
            }
        },
        error: function () {

        }
    });
});

function Validation() {

    var regEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    var filter = /^[0-9-+]+$/;
    if ($("#trailName").val() == "") {
        $("#ermess").show().html("Please Enter Your Name");
        $("#trailName").focus();
        return false;
    }

    if ($("#trailEmail").val() == "") {
        $("#ermess").show().html("Please Enter your Email");
        $("#trailEmail").focus();
        return false;
    }

    if (!regEmail.test($("#trailEmail").val())) {
        $("#ermess").show().html("Is Your Email Id is Correct ?");
        $("#trailEmail").focus();
        return false;
    }

    if (!filter.test($("#trailPhone").val()) || $("#trailPhone").val() == "") {
        $("#ermess").show().html("Please Enter Valid Number");
        $("#trailPhone").focus();
        return false;
    }

    if ($("#trailWebsite").val() == "") {
        $("#ermess").show().html("Please Enter your Website URL");
        $("#trailWebsite").focus();
        return false;
    }
    return true;
}

function ValidateMobile(mobno) {
    var mlen = mobno.length;
    var regNumber = /^\d{10,20}$/;
    var regAnotherNumber = /^\+[0-9]{2,3}-[0-9]\d{10}$/;
    var regNumberPlus = /^\+\d{10,20}$/;
    var regNumberPlus91 = /^\+91\d{10,20}$/;
    var regNumberPlus91Minus = /^\+91-\d{10,20}$/;
    if (regNumber.test(mobno))
        return true;
    if (regNumberPlus.test(mobno))
        return true;
    if (regNumberPlus91.test(mobno))
        return true;
    if (regNumberPlus91Minus.test(mobno))
        return true;
    else if (regAnotherNumber.test(mobno))
        return true;
    else if (mobno.charAt(0) != '+' && mlen == 10)
        return true;
    else if (mobno.charAt(0) == '+') {
        if (mobno.substr(0, 3) == '+91' && mobno.length == 13) {
            return true;
        }
    }
    else if (mobno.indexOf("-") < 0 && mobno.length == 12 && mobno.substr(0, 2) == '91')
        return true;
    return false;
}

