
//$(document).ready(function () {
GetProviderNameForDomainValidation();
//});
function GetProviderNameForDomainValidation() {
    //ShowPageLoading();
    $.ajax({
        url: "/Mail/MailSettings/GetProviderNameForDomainValidation",
        type: 'POST',
        data: JSON.stringify({ 'accountId': Plumb5AccountId }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: BindConfigurationDetails,
        error: ShowAjaxError
    });
};

function BindConfigurationDetails(response) {
    if (response.mailConfigurationDetails.length > 0) {
        var ProviderName = JSLINQ(response.mailConfigurationDetails).Where(function () { return (this.ProviderName.toLowerCase() == "elastic mail") });
        if (ProviderName.items.length > 0 && ProviderName.items[0].ProviderName.toLowerCase() == "elastic mail") {
            $('#dvdomainValidation').removeClass("hideDiv");
            GetDetailsofVerfiyDomain();

        }
        else {
            $('#dvdomainValidation').addClass("hideDiv");
        }
    }
    // HidePageLoading();
}
var isCalledElasticMailDetails = false;
function GetDetailsofVerfiyDomain() {

    if (!isCalledElasticMailDetails) {

        $.ajax({
            url: "/Mail/MailSettings/GetDetailsofVerfiyDomain",
            type: 'Post',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: BindListOfDomainDetails,
            error: ShowAjaxError
        });
        isCalledElasticMailDetails = true;
    }
}
function BindListOfDomainDetails(DomainDetails) {
    var reportTableTrs;
    if (DomainDetails.length > 0) {
        $("#dv_DomainTitle").show();

        $.each(DomainDetails, function () {
            var VerfiyClassName, VerfiyTitleName, SPFClassName, SPFTitleName, DMKIClassName, DMKITitleName, MXClassName, MXTitleName, CNAMEClassName, CNAMETitleName, DMARCClassName, DMARCTitleName, tdContent = "";
            if ($(this)[0].Verify == 0) {
                VerfiyClassName = "icon ion-android-close";
                VerfiyTitleName = "Not Verified";
            }
            else if ($(this)[0].Verify == 1) {
                VerfiyClassName = "icon ion-android-done";
                VerfiyTitleName = "Verified";
            }
            else if ($(this)[0].Verify == 2) {
                VerfiyClassName = "icon ion-android-done notverify";
                VerfiyTitleName = "Not Valid";
            }

            //Verfiy SPF

            if ($(this)[0].SPF == 0) {
                SPFClassName = "icon ion-android-close";
                SPFTitleName = "Not Verified";
            }
            else if ($(this)[0].SPF == 1) {
                SPFClassName = "icon ion-android-done";
                SPFTitleName = "Verified";
            }
            else if ($(this)[0].SPF == 2) {
                SPFClassName = "icon ion-android-done notverify";
                SPFTitleName = "Not Valid";
            }

            //Verfiy DMKI

            if ($(this)[0].DMKI == 0) {
                DMKIClassName = "icon ion-android-close";
                DMKITitleName = "Not Verified";
            }
            else if ($(this)[0].DMKI == 1) {
                DMKIClassName = "icon ion-android-done";
                DMKITitleName = "Verified";
            }
            else if ($(this)[0].DMKI == 2) {
                DMKIClassName = "icon ion-android-done notverify";
                DMKITitleName = "Not Valid";
            }

            //Verfiy MX

            if ($(this)[0].MX == 0) {
                MXClassName = "icon ion-android-close";
                MXTitleName = "Not Verified";
            }
            else if ($(this)[0].MX == 1) {
                MXClassName = "icon ion-android-done";
                MXTitleName = "Verified";
            }
            else if ($(this)[0].MX == 2) {
                MXClassName = "icon ion-android-done notverify";
                MXTitleName = "Not Valid";
            }

            //CNAME
            if ($(this)[0].CNAME == 0) {
                CNAMEClassName = "icon ion-android-close";
                CNAMETitleName = "Not Verified";
            }
            else if ($(this)[0].CNAME == 1) {
                CNAMEClassName = "icon ion-android-done";
                CNAMETitleName = "Verified";
            }
            else if ($(this)[0].CNAME == 2) {
                CNAMEClassName = "icon ion-android-done notverify";
                CNAMETitleName = "Not Valid";
            }

            //DMARC
            if ($(this)[0].DMARC == 0) {
                DMARCClassName = "icon ion-android-close";
                DMARCTitleName = "Not Verified";
            }
            else if ($(this)[0].DMARC == 1) {
                DMARCClassName = "icon ion-android-done";
                DMARCTitleName = "Verified";
            }
            else if ($(this)[0].DMARC == 2) {
                DMARCClassName = "icon ion-android-done notverify";
                DMARCTitleName = "Not Valid";
            }


            reportTableTrs +=
                "<tr>" +
                "<td>" + $(this)[0].Domain.toUpperCase() + "</td>" +
                "<td class='text-center'><i class='" + SPFClassName + "' title=" + SPFTitleName + "></i></td>" +
                "<td class='text-center'><i class='" + DMKIClassName + "' title=" + DMKITitleName + "></i></i></td>" +
                "<td class='text-center'><i class='" + CNAMEClassName + "' title=" + CNAMETitleName + "></i></td>" +
                "<td class='text-center'><i class='" + DMARCClassName + "' title=" + DMARCTitleName + "></i></td>" +
                "<td class='text-center'><i class='" + MXClassName + "' title=" + MXTitleName + "></i></td>" +
                "<td class='text-center'><button type='button' class='btn btn-third btn-sm' onclick='VerifyDomainDetails(" + $(this)[0].Id + ");'>Verify</button></td>" +
                //"<td class='text-center'><i class='icon ion-android-delete' data-toggle='modal'' data-target='#deletedomain' onclick='ConfirmedDomainDelete(" + $(this)[0].Id + ");'></i></td>" +
                "</tr>";
        });
        $("#ui_tbodyDomainValidationReportData").html(reportTableTrs);
    }
    else {
        reportTableTrs = "<tr>" +
            "<td colspan='4' class='text-center font-weight-bold'>There is no data for this view. </td>" +
            "</tr>";
        $("#ui_tbodyDomainValidationReportData").html(reportTableTrs);
    }
}

function VerifyDomainDetails(Id) {
    ShowPageLoading();
    $.ajax({
        url: "/Connector/Verify",
        type: 'Post',
        data: JSON.stringify({ 'Id': Id }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response) {
                ShowSuccessMessage(GlobalErrorList.MailDomainValidation.SuccessValidation);
            }
            else {
                ShowErrorMessage(GlobalErrorList.MailDomainValidation.ErrorValidation);
            }
            HidePageLoading();
            setTimeout(function () { window.location.reload(); }, 3000);
        },
        error: ShowAjaxError
    });
}
