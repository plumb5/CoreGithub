var Data = {
    "CreativeAgency": ['TMARC', 'JUSTPALM', 'Gorilla Creative Media', 'The Niche Guys', 'ThumbTribe', 'Liquorice', 'Gloo@Oglivy', 'Bamboo Network'],
    "EmailServiceProvider": ['Elastic Email', 'NetCore Falconide'],
    "SmsServiceProvider": ['Plivo', 'ChannelMobile', 'Tmarc', 'JustPlam'],
    "UnileverCategory": ['Personal Care', 'Home Care', 'Food & Refreshment', 'All'],
    "Jobs": ['1) Raise awareness of a brand, product or offer', '2) Engagement through interaction to build trust and creditility', '3) Conversion to drive purchase intent or trial', '4) Advocacy to promote loyality through repeat activity or sharing of content'],
    "Location": ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Port Elizabeth']
};

$(document).ready(function () {
    GetAccountDetails();
    GetUserGroupPermissions();
    BindDetails();
    $("#dvLoading").hide();
});

function GetAccountDetails() {
    $.ajax({
        url: "/AgencyForm/GetAccountDetails",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            BindAccountDetails(response);
            $("#dvLoading").hide();
        },
        error: function (objxmlRequest) {
        }
    });
}

function BindAccountDetails(Details) {

    if (Details != null) {
        if (Details.length > 0) {
            $.each(Details, function () {
                $("#ui_ddlBrand").append("<option value='" + $(this)[0].AccountId + "'>" + $(this)[0].DomainName + "</option>");
            });
        }
    }

    $('#ui_ddlBrand').multiselect({
        columns: 2,
        placeholder: 'Select Brand'
        //selectAll: true
    });

    $("#ui_ddlBrand").multiselect('refresh');
}

function GetUserGroupPermissions() {
    $.ajax({
        url: "/AgencyForm/GetUserGroupPermissionsList",
        type: 'Post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: BindUserGroupPermissions
    });
}

function BindUserGroupPermissions(response) {
    if (response != undefined && response != null && response.length > 0) {
        $.each(response, function () {
            $("#ui_ddlPermission").append("<option value='" + $(this)[0].Id + "'>" + $(this)[0].Name + "</option>");
        });
    }

    $('#ui_ddlPermission').multiselect({
        columns: 2,
        placeholder: 'Select Role'
        //selectAll: true
    });

    $("#ui_ddlPermission").multiselect('refresh');
}

function BindDetails() {
    $.each(Data.CreativeAgency, function (i) {
        var opt = document.createElement('option');
        opt.value = Data.CreativeAgency[i];
        opt.text = Data.CreativeAgency[i];
        document.getElementById("ui_ddlCreativeAgency").options.add(opt);
    });

    $.each(Data.EmailServiceProvider, function (i) {
        var opt = document.createElement('option');
        opt.value = Data.EmailServiceProvider[i];
        opt.text = Data.EmailServiceProvider[i];
        document.getElementById("ui_ddlEmailProvider").options.add(opt);
    });

    $.each(Data.SmsServiceProvider, function (i) {
        var opt = document.createElement('option');
        opt.value = Data.SmsServiceProvider[i];
        opt.text = Data.SmsServiceProvider[i];
        document.getElementById("ui_ddlSmsProvider").options.add(opt);
    });

    $.each(Data.UnileverCategory, function (i) {
        var opt = document.createElement('option');
        opt.value = Data.UnileverCategory[i];
        opt.text = Data.UnileverCategory[i];
        document.getElementById("ui_ddlCategoryName").options.add(opt);
    });

    $.each(Data.Jobs, function (i) {
        var opt = document.createElement('option');
        opt.value = Data.Jobs[i];
        opt.text = Data.Jobs[i];
        document.getElementById("ui_ddlJobToDone").options.add(opt);
    });

    //$.each(Data.Location, function (i) {
    //    var opt = document.createElement('option');
    //    opt.value = Data.Location[i];
    //    opt.text = Data.Location[i];
    //    document.getElementById("ui_ddlLocation").options.add(opt);
    //});


}

$("#ui_btnSave").click(function () {
    $("#dvLoading").show();

    if (ValidateForm()) {
        var agencyForm = { UserInfoUserId: 0, CampaignName: "", MarketingName: "", MarketingSpecify: "", UnileverCategory: "", Brand: "", GroupPermission: "", CreativeAgency: "", CreativeAgencyContacts: "", ServiceProvider: "", EmailServiceProvider: "", SmsServiceProvider: "", ServiceProviderContacts: "", BriefSuppliedDate: null, BriefSuppliedSpecify: "", CampaignLaunchDate: null, CampaignEndDate: null, DataInPlumb5: "", CampaignReportToULDate: null, JobDone: "", Background: "", CampaignMechanics: "", CampaignKPI: "", Gender: "", Location: "", IsMobileOrEmail: "", RecordsCount: "", CompletedPIA: "", S3OrAPI: "", ApprovalDate: null, ApprovedBy: "", ApprovalSentTo: "", CampaignExpiryDate: null, FormTicketId: "", IsDeleteAccount: null, IsDeletePermission: null };

        var selectedBrandId = [];
        var selectedBrands = [];
        var selectedPermissionId = [];
        var selectedPermissions = [];
        $('#ui_ddlBrand :selected').each(function () {
            selectedBrandId.push($(this).val());
            selectedBrands.push($(this).text());
        });

        $('#ui_ddlPermission :selected').each(function () {
            selectedPermissionId.push($(this).val());
            selectedPermissions.push($(this).text());
        });

        agencyForm.CampaignName = CleanText($("#ui_txtCampaignName").val());
        agencyForm.MarketingName = CleanText($("#ui_txtMarketingName").val());
        agencyForm.MarketingSpecify = CleanText($("#ui_txtMarketingSpecifyName").val());
        agencyForm.UnileverCategory = CleanText($("#ui_ddlCategoryName").val());
        agencyForm.IsDeleteAccount = $("input[name=useraccount]:checked").val() == "1" ? true : false;
        agencyForm.Brand = selectedBrandId.join(",");
        agencyForm.IsDeletePermission = $("input[name=userpermission]:checked").val() == "1" ? true : false;
        agencyForm.GroupPermission = selectedPermissionId.join(",");
        agencyForm.CreativeAgency = CleanText($("#ui_ddlCreativeAgency").val());
        agencyForm.CreativeAgencyContacts = CleanText($("#ui_txtCreativeAgencyContacts").val());

        var selectedProvider = $("input[name=ServiceProvider]:checked").val();
        agencyForm.ServiceProvider = selectedProvider;
        if (selectedProvider == "Mail") {
            agencyForm.EmailServiceProvider = CleanText($("#ui_ddlEmailProvider").val());
        }
        else if (selectedProvider == "Sms") {
            agencyForm.SmsServiceProvider = CleanText($("#ui_ddlSmsProvider").val());
        }

        agencyForm.ServiceProviderContacts = CleanText($("#ui_txtServiceProviderContacts").val());
        agencyForm.BriefSuppliedDate = CleanText($("#ui_txtDateBriefSupplied").val());
        agencyForm.BriefSuppliedSpecify = CleanText($("#ui_txtBriefDateSpecifyName").val());
        agencyForm.CampaignLaunchDate = CleanText($("#ui_txtDateCampaignLaunchDate").val());
        agencyForm.CampaignEndDate = CleanText($("#ui_txtDateCampaignEndDate").val());
        agencyForm.CampaignExpiryDate = CleanText($("#ui_txtDateCampaignExpiryDate").val());
        agencyForm.DataInPlumb5 = $("input[name=CampaignIngestion]:checked").val();
        agencyForm.CampaignReportToULDate = CleanText($("#ui_txtDateCampaignReportToUL").val());
        agencyForm.JobDone = CleanText($("#ui_ddlJobToDone").val());
        agencyForm.Background = CleanText($("#ui_txtareaBackGround").val());
        agencyForm.CampaignMechanics = CleanText($("#ui_txtareaCampaignMechanics").val());
        agencyForm.CampaignKPI = CleanText($("#ui_txtareaCampaignKPI").val());
        agencyForm.Gender = $("input[name=Gender]:checked").val();
        agencyForm.Location = CleanText($("#ui_txtLocation").val());
        agencyForm.IsMobileOrEmail = $("input[name=MobileOrEmail]:checked").val();
        agencyForm.RecordsCount = CleanText($("#ui_txtRecordsCount").val());
        agencyForm.CompletedPIA = $("input[name=PIA]:checked").val();
        agencyForm.S3OrAPI = $("input[name=S3OrAPI]:checked").val();

        $.ajax({
            url: "/AgencyForm/Save",
            type: 'Post',
            data: JSON.stringify({ 'agencyForm': agencyForm, 'brands': selectedBrands.join(","), 'permissions': selectedPermissions.join(",") }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != undefined && response != null && response > 0) {
                    ShowErrorMessage("Request sent successfully");
                    $("#dvLoading").hide();
                }
                else {
                    ShowErrorMessage("Problem in saving.");
                    $("#dvLoading").hide();
                }
            },
            error: function (objxmlRequest) {
            }
        });
    }
    else {
        $("#dvLoading").hide();
    }
});

function ValidateForm() {

    if (CleanText($("#ui_txtCampaignName").val()).length == 0) {
        ShowErrorMessage("Please enter Campaign Name");
        return false;
    }

    if (CleanText($("#ui_txtMarketingName").val()).length == 0) {
        ShowErrorMessage("Please enter Marketing");
        return false;
    }

    if (CleanText($("#ui_txtMarketingSpecifyName").val()).length == 0) {
        ShowErrorMessage("Please enter Specify");
        return false;
    }

    if ($("#ui_ddlCategoryName").get(0).selectedIndex == 0) {
        ShowErrorMessage("Please select Unilever Category");
        return false;
    }

    var selectedBrand = [];
    $('#ui_ddlBrand :selected').each(function () {
        selectedBrand.push($(this).val());
    });

    if (selectedBrand.length == 0) {
        ShowErrorMessage("Please select Brand");
        return false;
    }

    var selectedPermission = [];
    $('#ui_ddlPermission :selected').each(function () {
        selectedPermission.push($(this).val());
    });

    if (selectedPermission.length == 0) {
        ShowErrorMessage("Please Choose Role");
        return false;
    }

    if ($("#ui_ddlCreativeAgency").get(0).selectedIndex == 0) {
        ShowErrorMessage("Please select Creative Agency");
        return false;
    }

    if (CleanText($("#ui_txtCreativeAgencyContacts").val()).length == 0) {
        ShowErrorMessage("Please enter Creative Agency contacts");
        return false;
    }

    var selectedProvider = $("input[name=ServiceProvider]:checked").val();
    if (selectedProvider == "Mail") {
        if ($("#ui_ddlEmailProvider").get(0).selectedIndex == 0) {
            ShowErrorMessage("Please select Email Service Provider");
            return false;
        }
    }
    else if (selectedProvider == "Sms") {
        if ($("#ui_ddlSmsProvider").get(0).selectedIndex == 0) {
            ShowErrorMessage("Please select Sms Service Provider");
            return false;
        }
    }
    else {
        ShowErrorMessage("Please select Service Provider");
        return false;
    }

    if (CleanText($("#ui_txtServiceProviderContacts").val()).length == 0) {
        ShowErrorMessage("Please enter Service Provider contacts");
        return false;
    }

    if (CleanText($("#ui_txtDateBriefSupplied").val()).length == 0) {
        ShowErrorMessage("Please enter Date Brief supplied");
        return false;
    }

    if (CleanText($("#ui_txtBriefDateSpecifyName").val()).length == 0) {
        ShowErrorMessage("Please enter Specify");
        return false;
    }

    if (CleanText($("#ui_txtDateCampaignLaunchDate").val()).length == 0) {
        ShowErrorMessage("Please enter Campaign Launch date");
        return false;
    }

    if (CleanText($("#ui_txtDateCampaignEndDate").val()).length == 0) {
        ShowErrorMessage("Please enter Campaign End date");
        return false;
    }

    if (CleanText($("#ui_txtDateCampaignReportToUL").val()).length == 0) {
        ShowErrorMessage("Please enter Campaign report to UL");
        return false;
    }

    if ($("#ui_ddlJobToDone").get(0).selectedIndex == 0) {
        ShowErrorMessage("Please select job");
        return false;
    }

    if (CleanText($("#ui_txtLocation").val()).length == 0) {
        ShowErrorMessage("Please enter Location");
        return false;
    }

    if (CleanText($("#ui_txtRecordsCount").val()).length == 0) {
        ShowErrorMessage("Please enter No. of records required?");
        return false;
    }

    return true;
}

$("input[name=ServiceProvider]:radio").change(function () {

    var selectedval = $("input[name=ServiceProvider]:checked").val();

    $("#ui_divMailProvider").hide();
    $("#ui_divSmsprovider").hide();

    if (selectedval == "Mail") {
        $("#ui_divMailProvider").show();
    }
    else if (selectedval == "Sms") {
        $("#ui_divSmsprovider").show();
    }

});

$("#btnUserGrpBack").click(function () {
    window.history.back();
})