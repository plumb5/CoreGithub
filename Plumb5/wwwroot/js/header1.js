var regHeaderExpEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
var regHeaderDomain = /^www\.[a-zA-Z0-9-\.]+\.(com|org|net|mil|edu|ca|co.uk|com.au|gov|in|eu|biz|info|mobi|us|ly|cc|bz|tv|me|vg|ws|name|org.uk|me.uk|de|be|cn|gs|tc|ms)$/;

function CheckLoginDetails() {
    $.ajax({
        url: "/Account/CheckLoginDetails",
        type: "POST",
        dataType: "json",
        data: "",
        success: function (data) {
           
           

            if (data != 0) {
                $("#dvMyPage").html("My Account");


                $("#dvp5user").html('Hey ' + data.UserName+',');
                if (data.UserId == 1) {
                    $("#dvMyPage").attr("href", "Analytics/Dashboard/AdminHome");
                }
                else {
                    $("#dvMyPage").attr("href", "Account/MyAccounts");
                }

                //$("#dvUserLogin").html("Log out");
                //$("#dvUserLogin").attr("onclick", "LogOut();");
            } else {

                $("#dvUserLogin").html("Customer Login");
                $("#dvUserLogin").attr("href", "Account/register");//https://www.plumb5.com/register.aspx
                //$("#dvUserLogin").attr("onclick", "Checksignin(1);");
            }
        }
    })


  
}


function Checksignin(action) {
    if (action == 0) {
        $("#popUp").hide();
        $("#dvTrial").hide();
        $("#dvLoginpanel").hide();
    }
    else if (action == 1) {
        $("#popUp").hide();
        $("#dvTrial").hide();
        $("#dvLoginpanel").hide();
        $("#dvForgotpanel").hide();
        $("#dvLoginpanel").show(1000);
    }
}

