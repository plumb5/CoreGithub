var googleWorkSpace = "";
var GTM = {
    InitializeGoogleSignUp: function () {
        gapi.load('auth2', function () {
            auth2 = gapi.auth2.init({
                client_id: '683399030434-tstdhpf4ohto4g3hr1gsc5lins2kbjm5.apps.googleusercontent.com',
                scope: 'https://adwords.google.com/api/adwords https://www.googleapis.com/auth/tagmanager.edit.containers https://www.googleapis.com/auth/tagmanager.readonly https://www.googleapis.com/auth/tagmanager.manage.accounts'
            });
        });
    },
    signInCallback: function (authResult) {
        if (authResult['code']) {
            GTM.ShowGTMPopUpWithSpinning();
            $.ajax({
                url: '/MyProfile/GoogleTagManager/GetGoogleAccessToken',
                type: 'POST',
                data: JSON.stringify({ 'accountId': Plumb5AccountId, 'code': authResult['code'] }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {
                    if (result) {
                        GTM.GetGoogleAccount();
                    } else {
                        GTM.ClosePop();
                        ShowErrorMessage(GlobalErrorList.GoogleTagManager.UnableToAccess);
                    }
                },
                error: function (error) {
                    console.log(error);
                    ShowErrorMessage(GlobalErrorList.GoogleTagManager.UnableToAccess);
                }
            });
        } else {
            ShowErrorMessage(GlobalErrorList.GoogleTagManager.UnableToAccess);
        }
    },
    //accountDetails
    GetGoogleAccount: function () {
        GTM.ShowGTMPopUpWithSpinning();
        $.ajax({
            url: '/MyProfile/GoogleTagManager/GetGoogleAccount',
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result.length > 0) {
                    GTM.ShowGTMPopUpWithGoogDetails();
                    let googleaccounts = JSON.parse(result);
                    GTM.BindGoogleAccounts(googleaccounts);
                    $("#ui_gtmAccounts").removeClass("hideDiv");
                    GTM.setStepsAttribute(1);
                } else {
                    GTM.ClosePop();
                    ShowErrorMessage(GlobalErrorList.GoogleTagManager.UnableToAccess);
                }
            },
            error: function (error) {
                console.log(error);
                ShowErrorMessage(GlobalErrorList.GoogleTagManager.UnableToAccess);
            }
        });
    },
    BindGoogleAccounts: function (AccountsResult) {
        $("#ui_gtmAccounts").empty();
        let htmlContent = `<h4 class="box-title p-0">Select Account</h4>
                                        <p class="text-muted">Choose the account to retrieve the containers</p>`;

        if (AccountsResult != undefined && AccountsResult != null) {
            if (AccountsResult.account != null && AccountsResult.account.length > 0) {
                for (i = 0; i < AccountsResult.account.length; i++) {
                    htmlContent += `<div class="custom-control custom-radio">
                                        <input type="radio" id="accountpath_${i}" accountId="${AccountsResult.account[i].accountId}" value="${AccountsResult.account[i].path}" name="accountpath" class="custom-control-input">
                                        <label class="custom-control-label" for="accountpath_${i}">${AccountsResult.account[i].name}</label>
                                    </div>`;
                }
            }
        }

        $("#ui_gtmAccounts").append(htmlContent);
    },

    //Container steps 2
    GetGoogleContainer: function (accountpath) {
        GTM.ShowGTMPopUpWithSpinning();
        $.ajax({
            url: '/MyProfile/GoogleTagManager/GetGoogleContainers',
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'accountpath': accountpath }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result.length > 0) {
                    GTM.ShowGTMPopUpWithGoogDetails();
                    let googleContainer = JSON.parse(result);
                    GTM.BindGoogleContainer(googleContainer);
                    $("#ui_gtmContainer").removeClass("hideDiv");
                    GTM.setStepsAttribute(2);
                } else {
                    GTM.ClosePop();
                    ShowErrorMessage(GlobalErrorList.GoogleTagManager.UnableToAccessContainer);
                }
            },
            error: function (error) {
                console.log(error);
                ShowErrorMessage(GlobalErrorList.GoogleTagManager.UnableToAccessContainer);
            }
        });
    },
    BindGoogleContainer: function (ContainerResult) {
        $("#ui_gtmContainer").empty();
        let htmlContent = `<h4 class="box-title p-0">Select Container </h4>
                                        <p class="text-muted">Choose the container to retrieve the workspaces</p>`;

        if (ContainerResult != undefined && ContainerResult != null) {
            if (ContainerResult.container != null && ContainerResult.container.length > 0) {
                for (i = 0; i < ContainerResult.container.length; i++) {
                    htmlContent += `<div class="custom-control custom-radio">
                                        <input type="radio" id="containerpath_${i}" accountId="${ContainerResult.container[i].accountId}" containerId="${ContainerResult.container[i].containerId}" value="${ContainerResult.container[i].path}" name="containerpath" class="custom-control-input">
                                        <label class="custom-control-label" for="containerpath_${i}">${ContainerResult.container[i].name}</label>
                                    </div>`;
                }
            }
        }

        $("#ui_gtmContainer").append(htmlContent);
    },

    //workspace steps 3
    GetGoogleWorkSpace: function (containerpath) {
        GTM.ShowGTMPopUpWithSpinning();
        $.ajax({
            url: '/MyProfile/GoogleTagManager/GetGoogleWorkSpace',
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'containerpath': containerpath }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result.length > 0) {
                    GTM.ShowGTMPopUpWithGoogDetails();
                    let googleWorkSpace = JSON.parse(result);
                    GTM.BindGoogleWorkSpace(googleWorkSpace);
                    $("#ui_gtmWorkspace").removeClass("hideDiv");
                    GTM.setStepsAttribute(3);
                } else {
                    GTM.ClosePop();
                    ShowErrorMessage(GlobalErrorList.GoogleTagManager.UnableToAccessWorkSpace);
                }
            },
            error: function (error) {
                console.log(error);
                ShowErrorMessage(GlobalErrorList.GoogleTagManager.UnableToAccessWorkSpace);
            }
        });
    },
    BindGoogleWorkSpace: function (WorkSpaceResult) {
        $("#ui_gtmWorkspace").empty();
        let htmlContent = `<h4 class="box-title p-0">Select WorkSpaces </h4>
                                        <p class="text-muted">Choose the workspaces to add plumb5 script</p>`;

        if (WorkSpaceResult != undefined && WorkSpaceResult != null) {
            if (WorkSpaceResult.workspace != null && WorkSpaceResult.workspace.length > 0) {
                for (i = 0; i < WorkSpaceResult.workspace.length; i++) {
                    htmlContent += `<div class="custom-control custom-radio">
                                        <input type="radio" id="workspacepath_${i}" accountId="${WorkSpaceResult.workspace[i].accountId}" containerId="${WorkSpaceResult.workspace[i].containerId}" workspaceId="${WorkSpaceResult.workspace[i].workspaceId}" value="${WorkSpaceResult.workspace[i].path}" name="workspacepath" class="custom-control-input">
                                        <label class="custom-control-label" for="workspacepath_${i}">${WorkSpaceResult.workspace[i].name}</label>
                                    </div>`;
                }
            }
        }

        $("#ui_gtmWorkspace").append(htmlContent);
    },

    //Add Plumb5 Tag with scripts steps 4
    AddGoogleTags: function (workspacepath) {
        GTM.ShowGTMPopUpWithSpinning();
        googleWorkSpace = workspacepath;
        $.ajax({
            url: '/MyProfile/GoogleTagManager/AddPlumb5Tag',
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'workspcpath': workspacepath, 'sTagName': `Plumb5Script_0${Plumb5AccountId}`, 'domainName': CleanText($('#ui_drpdwn_DomainName').val()) }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                GTM.GetGoogleTags(workspacepath);
                GTM.setStepsAttribute(4);
            },
            error: function (error) {
                console.log(error);
                ShowErrorMessage(GlobalErrorList.GoogleTagManager.UnableToAddTag);
            }
        });
    },

    //Bind Tags
    GetGoogleTags: function (workspacepath) {
        $.ajax({
            url: '/MyProfile/GoogleTagManager/GetGoogleTags',
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'workspcpath': workspacepath }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                if (result.length > 0) {
                    GTM.ShowGTMPopUpWithGoogDetails();
                    let tagsList = JSON.parse(result);
                    GTM.BindGoogleTags(tagsList);
                    $("#ui_gtmTagList").removeClass("hideDiv");
                } else {
                    GTM.ClosePop();
                    ShowErrorMessage(GlobalErrorList.GoogleTagManager.UnableToGetTag);
                }
            },
            error: function (error) {
                console.log(error);
                ShowErrorMessage(GlobalErrorList.GoogleTagManager.UnableToGetTag);
            }
        });
    },
    BindGoogleTags: function (TagsResult) {
        $("#ui_gtmTagList").empty();
        let innerHtmlContent = ``;
        if (TagsResult != undefined && TagsResult != null) {
            if (TagsResult.tag != null && TagsResult.tag.length > 0) {
                for (i = 0; i < TagsResult.tag.length; i++) {
                    innerHtmlContent += `<tr id="ui_deleted_${i}">
                                            <td>${TagsResult.tag[i].name}</td>
                                            <td>${TagsResult.tag[i].type}</td>
                                            <td>${(TagsResult.tag[i].tagFiringOption != undefined && TagsResult.tag[i].tagFiringOption != null) ? TagsResult.tag[i].tagFiringOption : "NA"}</td>
                                            <td class="text-center"><i class="icon ion-android-delete delscripticn" path="${TagsResult.tag[i].path}" onclick="GTM.DeleteTag('${TagsResult.tag[i].path}',${i})"></i></td>
                                         </tr>`;
                }
            } else {
                innerHtmlContent = `<tr><td colspan="4" class="border-bottom-0"><div class="no-data ">There is no data for this view.</div></td></tr>`;
            }
        } else {
            innerHtmlContent = `<tr><td colspan="4" class="border-bottom-0"><div class="no-data ">There is no data for this view.</div></td></tr>`;
        }


        let htmlContent = `<h4 class="box-title p-0">Tag List</h4>
                            <div class="tabtblwrp">
                                <div class="tableWrapper">
                                    <div class="table-responsive min-h-100">
                                        <table class="table border tbl-td-ta-lft">
                                            <thead>
                                                <tr>
                                                    <th class="helpIcon td-wid-20 m-p-w-300" scope="col">
                                                        <div class="sortWrap"><i class="icon ion-arrow-down-c addColor"></i></div>
                                                        <div class="spacBet">
                                                            <div>Tag Name</div>
                                                            <div class="th-iconWrp"><i class="icon ion-ios-help-outline"></i>
                                                                <div class="toottipWrap">Tag Name
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </th>
                                                    <th class="helpIcon td-wid-15 m-p-w-170" scope="col">
                                                        <div class="sortWrap"><i class="icon ion-arrow-down-c addColor"></i></div>
                                                        <div class="spacBet">
                                                            <div>Type</div>
                                                            <div class="th-iconWrp"><i class="icon ion-ios-help-outline"></i>
                                                                <div class="toottipWrap">type of script
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </th>
                                                    <th class="helpIcon td-wid-25 m-p-w-170" scope="col">Tag Firing
                                                        Option
                                                    </th>
                                                    <th class="helpIcon td-wid-8 m-p-w-170" scope="col">Delete
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>   
                                                ${innerHtmlContent}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>`;

        $("#ui_gtmTagList").append(htmlContent);
    },

    //Delete Tags
    DeleteTag: function (Tagpath, row) {
        $.ajax({
            url: '/MyProfile/GoogleTagManager/DeletePlumb5Tag',
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId, 'Tagpath': Tagpath }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (result) {
                ShowSuccessMessage(GlobalErrorList.GoogleTagManager.DeletedSuccessfully);
                $(`#ui_deleted_${row}`).remove();
            },
            error: function (error) {
                console.log(error);
                ShowErrorMessage(GlobalErrorList.GoogleTagManager.UnableToDelete);
            }
        });
    },

    ShowGTMPopUpWithSpinning: function () {
        $("#ui_ScriptPopUp,#ui_GoogleTagPopup").addClass("hideDiv");
        $("#ui_googleSpinnerTag,#ui_bindGoogleDetails").addClass("hideDiv");
        $("#ui_gtmAccounts,#ui_gtmContainer,#ui_gtmWorkspace,#ui_gtmTagList").addClass("hideDiv");
        $("#ui_GoogleTagPopup,#ui_googleSpinnerTag").removeClass("hideDiv");
    },
    ShowGTMPopUpWithGoogDetails: function () {
        $("#ui_ScriptPopUp,#ui_GoogleTagPopup").addClass("hideDiv");
        $("#ui_googleSpinnerTag,#ui_bindGoogleDetails").addClass("hideDiv");
        $("#ui_gtmAccounts,#ui_gtmContainer,#ui_gtmWorkspace,#ui_gtmTagList").addClass("hideDiv");
        $("#ui_GoogleTagPopup,#ui_bindGoogleDetails").removeClass("hideDiv");
    },
    ClosePop: function () {
        $("#ui_ScriptPopUp,#ui_GoogleTagPopup").addClass("hideDiv");
    },
    Next: function () {
        if (parseInt($("#ui_linkNext").attr("steps")) == 4) {
            GTM.ChangeButtonDoneToNext();
            GTM.ChangeButtonBackToCancel();
            $("#ui_GoogleTagPopup").addClass("hideDiv");
        } else {
            let steps = parseInt($("#ui_linkNext").attr("steps")) + 1;
            GTM.ShowGoogleDetails(steps);
            GTM.ChangeButtonCancelToBack();

            if (steps == 4) {
                GTM.ChangeButtonNextToDone();
            } else {
                GTM.ChangeButtonDoneToNext();
            }
        }
    },
    Back: function () {
        GTM.ShowGTMPopUpWithSpinning();
        let steps = parseInt($("#ui_linkNext").attr("steps")) - 1;

        switch (steps) {
            case 2://Container
                GTM.setStepsAttribute(2);
                GTM.ShowGTMPopUpWithGoogDetails();
                $("#ui_gtmContainer").removeClass("hideDiv");
                break;
            case 3://workspace
                GTM.setStepsAttribute(3);
                GTM.ShowGTMPopUpWithGoogDetails();
                $("#ui_gtmWorkspace").removeClass("hideDiv");
                break;
            case 4://Adding and Showing Tags in Grid
                GTM.setStepsAttribute(4);
                GTM.ShowGTMPopUpWithGoogDetails();
                $("#ui_gtmTagList").removeClass("hideDiv");
                break;
            default:
                GTM.setStepsAttribute(1);
                GTM.ShowGTMPopUpWithGoogDetails();
                $("#ui_gtmAccounts").removeClass("hideDiv");
                break;
        }

        if (steps == 1) {
            GTM.ChangeButtonBackToCancel();
        } else {
            GTM.ChangeButtonCancelToBack();
        }

        if (steps != 4) {
            GTM.ChangeButtonDoneToNext();
        }
    },
    ShowGoogleDetails: function (steps) {
        switch (steps) {
            case 2://Container
                let accountpath = $('input[name="accountpath"]:checked').val();
                if (accountpath != undefined && accountpath != null && accountpath.length > 0) {
                    GTM.GetGoogleContainer(accountpath);
                } else {
                    ShowErrorMessage(GlobalErrorList.GoogleTagManager.SelectAccount);
                }
                break;
            case 3://workspace
                let containerpath = $('input[name="containerpath"]:checked').val();
                if (containerpath != undefined && containerpath != null && containerpath.length > 0) {
                    GTM.GetGoogleWorkSpace(containerpath);
                } else {
                    ShowErrorMessage(GlobalErrorList.GoogleTagManager.SelectContainer);
                }
                break;
            case 4://Adding and Showing Tags in Grid
                let workspacepath = $('input[name="workspacepath"]:checked').val();
                if (workspacepath != undefined && workspacepath != null && workspacepath.length > 0) {
                    GTM.AddGoogleTags(workspacepath);
                } else {
                    ShowErrorMessage(GlobalErrorList.GoogleTagManager.SelectWorkSpace);
                }
                break;
            default:
                GTM.ChangeButtonBackToCancel();
                GTM.GetGoogleAccount();
                break;
        }
    },
    setStepsAttribute: function (steps) {
        $("#ui_linkNext").removeAttr("steps").attr("steps", steps);
    },
    ChangeButtonCancelToBack: function () {
        $("#ui_btnBack").html("Back");
    },
    ChangeButtonBackToCancel: function () {
        $("#ui_btnBack").html("Cancel");
    },
    ChangeButtonNextToDone: function () {
        $("#ui_linkNext").html("Done")
    },
    ChangeButtonDoneToNext: function () {
        $("#ui_linkNext").html("Next")
    }
};

$(document).ready(function () {
    GTM.InitializeGoogleSignUp();
});

$('#installGoogleTagManager').click(function () {
    auth2.grantOfflineAccess().then(GTM.signInCallback);
});

$("#ui_linkNext").click(function () {
    GTM.Next();
});

$("#ui_btnBack").click(function () {
    if ($("#ui_btnBack").html().toLowerCase() == "cancel") {
        $("#ui_GoogleTagPopup").addClass("hideDiv");
    } else {
        GTM.Back();
    }
});
