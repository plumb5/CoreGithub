var dltvalue = 0, TypeName;
function addinbox() {
    ShowErrorMessage("Added Successfully");
    ///Setting Up Events - Static Dictionary
    var jsForSettingUpEvents = p5trackerpath + "?AccountId=" + $("#hdn_AccountId").val() + "&ScoreSet=True";
    jsForSettingUpEvents = 'https:' == document.location.protocol ? jsForSettingUpEvents.replace("http", "https") : jsForSettingUpEvents;
    var elem = document.createElement("img");
    elem.setAttribute("src", jsForSettingUpEvents);
    elem.setAttribute("height", "0");
    elem.setAttribute("width", "0");
    if (document.body != null && document.body != 'undefined') {
        document.body.appendChild(elem);
    } else {
        document.getElementsByTagName('body')[0].appenChild(elem);
    }
}
function updateinbox() {
    ShowErrorMessage("Updated Successfully");
}
function deleteinbox() {
    dltvalue = 1;
    ShowErrorMessage("Deleted Successfully");
}
function bindsourcenew() {
    Display($("#txtFilterName").val());
}
function Display(obj) {
    var id = "div[id*=dvBindSources]";
    var spanid = id + ":has('div')";
    $(document).ready(function () {
        $(id).show();
        if (obj.length != 0) {
            $(spanid).each(function () {
                if ($(this).find("span:contains(" + obj + ")").length == 0)
                    $(this).hide();
            });
        }
    });
}
$(document).ready(function () {
    BindSources();
    $("#chkBindSources").click(function () {
        $("#divmsg").hide();
        $("#dvBindSources input[type='checkbox']").attr("disabled", false);
        $('.case').attr('checked', this.checked);
        if ($('.case').attr('checked') == 'checked' && document.getElementById("hdnSearchBy").value != "1") {
            $('#hdnSources').val('5');
        }
        else
            document.getElementById('hdnSources').value = '0';
    });
    $("#chpagesall").click(function () {
        $("#divmsg").hide();
        $("#dvPages input[type='checkbox']").attr("disabled", false);
        $('.case1').attr('checked', this.checked);
        if ($('.case1').attr('checked') == 'checked' && document.getElementById("hdnSearchBy").value != "1") {
            $('#hdnSources').val('5');
        }
        else
            $('#hdnSources').val('0');
    });
    $("#chkEventsAll").click(function () {
        $("#divmsg").hide();
        $("#dvEvents input[type='checkbox']").attr("disabled", false);
        $('.case2').attr('checked', this.checked);
        if ($('.case2').attr('checked') == 'checked' && document.getElementById("hdnSearchBy").value != "1") {
            $('#hdnSources').val('5');
        }
        else
            $('#hdnSources').val('0');
    });
    $("#chkGroupsAll").click(function () {
        $("#divmsg").hide();
        $("#dvGroups input[type='checkbox']").attr("disabled", false);
        $('.case3').attr('checked', this.checked);
        if ($('.case3').attr('checked') == 'checked' && document.getElementById("hdnSearchBy").value != "1") {
            $('#hdnSources').val('5');
        }
        else
            $('#hdnSources').val('0');
    });
    $('#btnAddScoretosources').click(function () {
        if ($('#hdnSources').val() != '5') {
            $('#hdnSources').val('0');

            $('#dvBindSources input:checked').each(function (m) {
                document.getElementById('hdnSources').value += ',' + $(this).attr('value');
                if (m == 10) {
                    ShowErrorMessage("Please select 10 data or select the Select all option");
                    return false;
                }
            });
        }
        if (document.getElementById('hdnSources').value == "0") {
            ShowErrorMessage("Please select the Source");
            return;
        }
        else if (document.getElementById('txtScore').value == '') {//document.getElementById('hdnSources').value != "0" && 
            ShowErrorMessage("Please Enter the Score");
            return;
        }
        if (document.getElementById('hdnSources').value == "0") {
            return;
        }
        if (document.getElementById('txtScore').value != '') {
            document.getElementById('dvLoading').style.display = "block";
            var AccountIdall = document.getElementById('hdn_AccountId').value;
            var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountIdall + '&type=addsource&searchval=' + document.getElementById('hdnSources').value + '&score=' + document.getElementById('txtScore').value;
            $.getJSON(urlsearch, function (json) {
                $.each(json, function (i, weed) {
                    if (weed.pocketnumbershtml == "Success") {
                        BindSources();
                        document.getElementById('txtScore').value = '';
                        $("#btnAddScoretosources").removeAttr("disabled", "disabled");
                        addinbox();
                    }
                });
            });
        }
    });
    $('#btnAddScoretosourceType').click(function () {
        if ($('#hdnSources').val() != '5') {
            $('#hdnSources').val('0');
            $('#dvBindSourceType input:checked').each(function () {//$('input[name="sourcetypes"]:checked').each(function () {
                document.getElementById('hdnSources').value += ',' + $(this).val();
            });
        }
        if (document.getElementById('hdnSources').value == "0") {
            ShowErrorMessage("Please select the SourceType");
            return;
        }
        else if (document.getElementById('txtSourceTypeScore').value == '') {//document.getElementById('hdnSources').value != "0" && 
            ShowErrorMessage("Please Enter the Score");
            return;
        }
        if (document.getElementById('hdnSources').value == "0") {
            return;
        }
        if (document.getElementById('txtSourceTypeScore').value != '') {
            document.getElementById('dvLoading').style.display = "block";
            var AccountIdall = document.getElementById('hdn_AccountId').value;
            var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountIdall + '&type=addsourceType&searchval=' + document.getElementById('hdnSources').value + '&score=' + document.getElementById('txtSourceTypeScore').value;
            $.getJSON(urlsearch, function (json) {
                $.each(json, function (i, weed) {
                    if (weed.pocketnumbershtml == "Success") {
                        GetBindSourceTypes();
                        document.getElementById('txtSourceTypeScore').value = '';
                        $("#btnAddScoretosources").removeAttr("disabled", "disabled");
                        document.getElementById('dvLoading').style.display = "none";
                        addinbox();
                        $("#dvBindSourceType input:checked").each(function (i) {
                            if ($(this).val() == "Direct") {
                                $("#dv_Direct").hide();
                            } else if ($(this).val() == "Search") { $("#dv_Search").hide(); }
                            else if ($(this).val() == "Social") { $("#dv_Social").hide(); }
                            else if ($(this).val() == "Refer") { $("#dv_Refer").hide(); }
                            else if ($(this).val() == "Email") { $("#dv_Email").hide(); }
                            else if ($(this).val() == "Sms") { $("#dv_Sms").hide(); }
                            else if ($(this).val() == "Paid") { $("#dv_Paid").hide(); }
                        });
                    }
                });
            });
        }
    });
    $('#btnAddPageScore').click(function () {
        if (document.getElementById('hdnSources').value != '5') {
            document.getElementById('hdnSources').value = '0';
            $('#dvPages input:checked').each(function () {
                document.getElementById('hdnSources').value += ',' + $(this).attr('value');
            });
        }
        if (document.getElementById('hdnSources').value == "0") {
            ShowErrorMessage("Please select the Page");
            return;
        }
        else if (document.getElementById('txtPageScores').value == '') {//document.getElementById('hdnSources').value != "0" && 
            ShowErrorMessage("Please Enter the Score");
            return;
        }
        if (document.getElementById('txtPageScores').value != '') {
            document.getElementById('dvLoading').style.display = "block";
            var AccountIdall = document.getElementById('hdn_AccountId').value;

            var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountIdall + '&type=addpages&searchval=' + document.getElementById('hdnSources').value + '&score=' + document.getElementById('txtPageScores').value;
            $.getJSON(urlsearch, function (json) {
                $.each(json, function (i, weed) {
                    if (weed.pocketnumbershtml == "Success") {
                        BindPages();
                        document.getElementById('txtPageScores').value = '';
                        $("#btnAddPageScore").removeAttr("disabled", "disabled");
                    }
                });
                document.getElementById('dvLoading').style.display = "none";
                addinbox();
            });
        }
    });
    $('#btnTimeDuration').click(function () {
        var e = document.getElementById("ddlAvgTimeDuration");
        if (document.getElementById('txtTimeScore').value != '') {
            $("#btnAddPageScore").attr("disabled", "disabled");
        }
        if (document.getElementById('txtTimeScore').value == '') {
            ShowErrorMessage("Please enter the Score");
            return;
        }
        if (document.getElementById('txtTimeScore').value != '') {
            var AccountIdall = document.getElementById('hdn_AccountId').value;

            var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountIdall + '&type=addtimes&searchval=' + e.options[e.selectedIndex].value + '&score=' + document.getElementById('txtTimeScore').value + '&timetext=' + e.options[e.selectedIndex].text;

            $.getJSON(urlsearch, function (json) {
                $.each(json, function (i, weed) {
                    if (weed.pocketnumbershtml == "Success") {
                        GetBindTimes();
                        document.getElementById('txtTimeScore').value = '';
                        $("#btnTimeDuration").removeAttr("disabled", "disabled");
                    }
                });
                addinbox();
            });
        }
    });
    $('#btnAddPageDepth').click(function () {
        var e = document.getElementById("ddlPageDepths");
        if (document.getElementById('txtPageDepthScore').value != '') {
            $("#btnAddPageScore").attr("disabled", "disabled");
        }
        if (document.getElementById('txtPageDepthScore').value == '') {
            ShowErrorMessage("Please enter the Score");
            return;
        }
        if (document.getElementById('txtPageDepthScore').value != '') {
            var AccountIdall = document.getElementById('hdn_AccountId').value;

            var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountIdall + '&type=adddepths&searchval=' + e.options[e.selectedIndex].value + '&score=' + document.getElementById('txtPageDepthScore').value + '&timetext=' + e.options[e.selectedIndex].text;

            $.getJSON(urlsearch, function (json) {
                $.each(json, function (i, weed) {
                    if (weed.pocketnumbershtml == "Success") {
                        GetBindPageDepths();
                        document.getElementById('txtPageDepthScore').value = '';
                        $("#btnTimeDuration").removeAttr("disabled", "disabled");
                    }
                });
                addinbox();
            });
        }
    });
    $('#btnAddFrequency').click(function () {
        var e = document.getElementById("ddlFrequency");
        if (document.getElementById('txtFrequencyScore').value != '') {
            $("#btnAddPageScore").attr("disabled", "disabled");
        }
        if (document.getElementById('txtFrequencyScore').value == '') {
            ShowErrorMessage("Please enter the Score");
            return;
        }
        if (document.getElementById('txtFrequencyScore').value != '') {
            var AccountIdall = document.getElementById('hdn_AccountId').value;
            var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountIdall + '&type=addfrequency&searchval=' + e.options[e.selectedIndex].value + '&score=' + document.getElementById('txtFrequencyScore').value + '&timetext=' + e.options[e.selectedIndex].text;
            $.getJSON(urlsearch, function (json) {
                $.each(json, function (i, weed) {
                    if (weed.pocketnumbershtml == "Success") {
                        GetBindFrequency();
                        document.getElementById('txtFrequencyScore').value = '';
                        $("#btnTimeDuration").removeAttr("disabled", "disabled");
                    }
                });
                addinbox();
            });
        }
    });
    $('#btnAddRecency').click(function () {
        var e = document.getElementById("ddlRecency");
        if (document.getElementById('txtRecencyScore').value != '') {
            $("#btnAddPageScore").attr("disabled", "disabled");
        }
        if (document.getElementById('txtRecencyScore').value == '') {
            ShowErrorMessage("Please enter the Score");
            return;
        }
        if (document.getElementById('txtRecencyScore').value != '') {
            var AccountIdall = document.getElementById('hdn_AccountId').value;

            var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountIdall + '&type=addrecency&searchval=' + e.options[e.selectedIndex].value + '&score=' + document.getElementById('txtRecencyScore').value + '&timetext=' + e.options[e.selectedIndex].text;

            $.getJSON(urlsearch, function (json) {
                $.each(json, function (i, weed) {
                    if (weed.pocketnumbershtml == "Success") {
                        GetBindRecency();
                        document.getElementById('txtRecencyScore').value = '';
                        $("#btnTimeDuration").removeAttr("disabled", "disabled");
                    }
                });
                addinbox();
            });
        }
    });
    $('#btnAddEventScore').click(function () {
        if (document.getElementById('hdnSources').value != '5') {
            document.getElementById('hdnSources').value = '';
            $('#dvEvents input:checked').each(function () {
                document.getElementById('hdnSources').value += ',' + $(this).attr('value');
            });
        }
        if (document.getElementById('hdnSources').value == '') {
            ShowErrorMessage("Please select the Events");
            return;
        }
        else if (document.getElementById('txtEventScores').value == '') {
            ShowErrorMessage("Please Enter the Score");
            return;
        }
        if (document.getElementById('txtEventScores').value != '') {
            document.getElementById('dvLoading').style.display = "block";
            var AccountIdall = document.getElementById('hdn_AccountId').value;

            var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountIdall + '&type=addevents&searchval=' + document.getElementById('hdnSources').value + '&score=' + document.getElementById('txtEventScores').value;
            $.getJSON(urlsearch, function (json) {
                $.each(json, function (i, weed) {
                    if (weed.pocketnumbershtml == "Success") {
                        BindEvents();
                        document.getElementById('txtEventScores').value = '';
                        $("#btnTimeDuration").removeAttr("disabled", "disabled");
                    }
                });
                document.getElementById('dvLoading').style.display = "none";
                addinbox();
            });
        }
    });
    $('#btnAddGroupScore').click(function () {
        if (document.getElementById('hdnSources').value != '5') {
            document.getElementById('hdnSources').value = '';
            $('#dvGroups input:checked').each(function () {
                document.getElementById('hdnSources').value += ',' + $(this).attr('value');
            });
        }
        if (document.getElementById('hdnSources').value == '') {
            ShowErrorMessage("Please select the Group");
            return;
        }
        else if (document.getElementById('txtGroupScores').value == '') {
            ShowErrorMessage("Please Enter the Score");
            return;
        }
        if (document.getElementById('txtGroupScores').value != '') {
            document.getElementById('dvLoading').style.display = "block";
            var AccountIdall = document.getElementById('hdn_AccountId').value;

            var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountIdall + '&type=addgroups&searchval=' + document.getElementById('hdnSources').value + '&score=' + document.getElementById('txtGroupScores').value;
            $.getJSON(urlsearch, function (json) {
                $.each(json, function (i, weed) {
                    if (weed.pocketnumbershtml == "Success") {
                        BindGroups();
                        document.getElementById('txtGroupScores').value = '';
                        $("#btnTimeDuration").removeAttr("disabled", "disabled");
                    }
                });
                document.getElementById('dvLoading').style.display = "none";
                addinbox();
            });
        }
    });
    $('#txtFilterName').autocomplete({
        source: "/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=" + document.getElementById('hdn_AccountId').value + "&type=typosource",
        minLength: 1,
        focus: function (event, ui) {
            $(event.target).val(ui.item.label);
            return false;
        }
    });
    $.ui.autocomplete.prototype._renderItem = function (ul, item) {
        var term = this.term.split(' ').join('|');
        var re = new RegExp("(" + term + ")", "gi");
        var t = item.label.replace(re, "<b>$1</b>");
        return $("<li></li>")
         .data("item.autocomplete", item)
         .append("<a>" + t + "</a>")
         .appendTo(ul);

    };
    $('#txtpagescore').autocomplete({
        source: "/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=" + document.getElementById('hdn_AccountId').value + "&type=typopage",
        minLength: 1,
        focus: function (event, ui) {
            $(event.target).val(ui.item.label);
            return false;
        }
    });
    $.ui.autocomplete.prototype._renderItem = function (ul, item) {
        var term = this.term.split(' ').join('|');
        var re = new RegExp("(" + term + ")", "gi");
        var t = item.label.replace(re, "<b>$1</b>");
        return $("<li></li>")
         .data("item.autocomplete", item)
         .append("<a>" + t + "</a>")
         .appendTo(ul);

    };
    $('#txtEventsScores').autocomplete({
        source: "/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=" + document.getElementById('hdn_AccountId').value + "&type=typoevents",
        minLength: 1,
        focus: function (event, ui) {
            $(event.target).val(ui.item.label);
            return false;
        }
    });
    $.ui.autocomplete.prototype._renderItem = function (ul, item) {
        var term = this.term.split(' ').join('|');
        var re = new RegExp("(" + term + ")", "gi");
        var t = item.label.replace(re, "<b>$1</b>");
        return $("<li></li>")
         .data("item.autocomplete", item)
         .append("<a>" + t + "</a>")
         .appendTo(ul);

    };
    $('#txtGroupsScores').autocomplete({
        source: "/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=" + document.getElementById('hdn_AccountId').value + "&type=typogroups",
        minLength: 1,
        focus: function (event, ui) {
            $(event.target).val(ui.item.label);
            return false;
        }
    });
    $.ui.autocomplete.prototype._renderItem = function (ul, item) {
        var term = this.term.split(' ').join('|');
        var re = new RegExp("(" + term + ")", "gi");
        var t = item.label.replace(re, "<b>$1</b>");
        return $("<li></li>")
         .data("item.autocomplete", item)
         .append("<a>" + t + "</a>")
         .appendTo(ul);

    };
});
function showtabs(obj) {
    document.getElementById("hdnSearchBy").value = "0";
    $("#tblsources").hide();
    $("#tblsourceType").hide();
    $("#tblpages").hide();
    $("#tbldepths").hide();
    $("#tbltimes").hide();
    $("#tblfrequency").hide();
    $("#tblrecency").hide();
    $("#tblevents").hide();
    $("#tDLGroups").hide();
    $("#tbleditscore").hide();
    document.getElementById('sources').className = 'button1';
    document.getElementById('sourceType').className = 'button1';
    document.getElementById('pages').className = 'button1';
    document.getElementById('times').className = 'button1';
    document.getElementById('depths').className = 'button1';
    document.getElementById('frequency').className = 'button1';
    document.getElementById('recency').className = 'button1';
    document.getElementById('events').className = 'button1';
    document.getElementById('groups').className = 'button1';
    var getobj = "#tbl" + obj.replace('', '');
    document.getElementById(obj).className = 'button';
    $(getobj).show("clip");
    if (getobj == '#tblsources') {
        BindSources();
    }
    if (getobj == '#tblsourceType') {
        GetBindSourceTypes();
    }
    if (getobj == '#tblpages') {
        BindPages();
    }
    if (getobj == '#tbltimes') {
        GetBindTimes();
    }
    if (getobj == '#tbldepths') {
        GetBindPageDepths();
    }
    if (getobj == '#tblfrequency') {
        GetBindFrequency();
    }
    if (getobj == '#tblrecency') {
        GetBindRecency();
    }
    if (getobj == '#tblevents') {
        BindEvents();
    }
    if (getobj == '#tDLGroups') {
        BindGroups();
    }

    return false;
}
function BindSources() {
    window.divcontent.innerHTML = '';
    document.getElementById('dvLoading').style.display = "block";
    getstatus = 0;
    var AccountId = document.getElementById('hdn_AccountId').value;
    var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountId + '&type=source';
    $.getJSON(urlsearch, function (json) {
        $.each(json, function (i, weed) {
            document.getElementById('dvBindSources').innerHTML = weed.pocketnumbershtml;
            GetBindSources();
        });
    });
}
function GetBindEvents() {
    document.getElementById('dvLoading').style.display = "block";
    window.divcontent.innerHTML = '';
    var AccountId = document.getElementById('hdn_AccountId').value;
    $(document).ready(function () {
        var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountId + '&type=getevents';
        $.getJSON(urlsearch, function (json) {
            $.each(json, function (i, weed) {
                window.divcontent.innerHTML = weed.pocketnumbershtml;
                if (window.divcontent.innerHTML == '') {
                    $("#dvDefault").css("display", "block");
                    $("#dvLoading").css("display", "none");
                    $("#divcontent").css("display", "none");
                }
            });
            $("#dvExpend").css({ 'height': $("#dvControlPanel").height() + 20 });
            document.getElementById('dvLoading').style.display = "none";
        });
    });
}
function GetBindGroups() {
    document.getElementById('dvLoading').style.display = "block";
    window.divcontent.innerHTML = '';
    var AccountId = document.getElementById('hdn_AccountId').value;
    $(document).ready(function () {
        var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountId + '&type=getgroups';
        $.getJSON(urlsearch, function (json) {
            $.each(json, function (i, weed) {
                window.divcontent.innerHTML = weed.pocketnumbershtml;
                if (window.divcontent.innerHTML == '') {
                    $("#dvDefault").css("display", "block");
                    $("#dvLoading").css("display", "none");
                    $("#divcontent").css("display", "none");
                }
            });
            $("#dvExpend").css({ 'height': $("#dvControlPanel").height() + 20 });
            document.getElementById('dvLoading').style.display = "none";
        });

    });
}
function GetBindSources() {
    document.getElementById('dvLoading').style.display = "block";
    window.divcontent.innerHTML = '';
    var AccountId = document.getElementById('hdn_AccountId').value;
    var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountId + '&type=getsource';
    $.getJSON(urlsearch, function (json) {
        $.each(json, function (i, weed) {
            window.divcontent.innerHTML = weed.pocketnumbershtml;
            if (window.divcontent.innerHTML == '') {
                $("#dvDefault").css("display", "block");
                $("#dvLoading").css("display", "none");
                $("#divcontent").css("display", "none");
            }
        });
        $("#dvExpend").css({ 'height': $("#dvControlPanel").height() + 20 });
        if (window.divcontent.innerHTML != '') {
            document.getElementById('dvLoading').style.display = "none";
        }
    });
}
function GetBindSourceTypes() {
    document.getElementById('dvLoading').style.display = "block";
    window.divcontent.innerHTML = '';
    var AccountId = document.getElementById('hdn_AccountId').value;
    var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountId + '&type=getsourceType';
    $.getJSON(urlsearch, function (json) {
        $.each(json, function (i, weed) {
            window.divcontent.innerHTML = weed.pocketnumbershtml;
            if (dltvalue == 0) {
                $(".itemStyle").each(function (i) {
                    var SrcName = document.getElementById("dv_" + i).innerHTML;
                    if (SrcName == "Direct") { $("#dv_Direct").hide(); }
                    else if (SrcName == "Search") { $("#dv_Search").hide(); }
                    else if (SrcName == "Social") { $("#dv_Social").hide(); }
                    else if (SrcName == "Refer") { $("#dv_Refer").hide(); }
                    else if (SrcName == "Email") { $("#dv_Email").hide(); }
                    else if (SrcName == "Sms") { $("#dv_Sms").hide(); }
                    else if (SrcName == "Paid") { $("#dv_Paid").hide(); }
                });
            } else {
                if (TypeName == "Direct") { $("#dv_Direct").show(); }
                if (TypeName == "Search") { $("#dv_Search").show(); }
                if (TypeName == "Social") { $("#dv_Social").show(); }
                if (TypeName == "Refer") { $("#dv_Refer").show(); }
                if (TypeName == "Email") { $("#dv_Email").show(); }
                if (TypeName == "Sms") { $("#dv_Sms").show(); }
                if (TypeName == "Paid") { $("#dv_Paid").show(); }
                $('input[name="sourcetypes"]').each(function () {
                    this.checked = false;
                });
            }
            if (window.divcontent.innerHTML == '') {
                $("#dvDefault").css("display", "block");
                $("#dvLoading").css("display", "none");
                $("#divcontent").css("display", "none");
            }
        });
        $("#dvExpend").css({ 'height': $("#dvControlPanel").height() + 20 });
        if (window.divcontent.innerHTML != '') {
            document.getElementById('dvLoading').style.display = "none";
        }
    });
}
function myabcd(myobj1, myobj2, myobj3, myobj4) {
    $("#tbleditscore").show("slow");
    document.getElementById('spnentertype').innerHTML = myobj1;
    document.getElementById('hdnbtnsource').value = myobj1;
    document.getElementById('spansource').innerHTML = myobj2;
    document.getElementById('txteditscore').value = myobj3;
    document.getElementById('hdnbtnedit').value = myobj4;
    return false;
}
function GetBindPages() {
    document.getElementById('dvLoading').style.display = "block";
    window.divcontent.innerHTML = '';
    var AccountId = document.getElementById('hdn_AccountId').value;
    $(document).ready(function () {
        var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountId + '&type=getpage';
        $.getJSON(urlsearch, function (json) {
            $.each(json, function (i, weed) {
                window.divcontent.innerHTML = weed.pocketnumbershtml;
                if (window.divcontent.innerHTML == '') {
                    $("#dvDefault").css("display", "block");
                    $("#dvLoading").css("display", "none");
                    $("#divcontent").css("display", "none");
                }
            });
            $("#dvExpend").css({ 'height': $("#dvControlPanel").height() + 20 });
            document.getElementById('dvLoading').style.display = "none";
        });

    });
}
function GetBindTimes() {
    document.getElementById('dvLoading').style.display = "block";
    window.divcontent.innerHTML = '';
    var AccountId = document.getElementById('hdn_AccountId').value;
    $(document).ready(function () {
        var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountId + '&type=gettime';
        $.getJSON(urlsearch, function (json) {
            $.each(json, function (i, weed) {
                window.divcontent.innerHTML = weed.pocketnumbershtml;
                if (window.divcontent.innerHTML == '') {
                    $("#dvDefault").css("display", "block");
                    $("#dvLoading").css("display", "none");
                    $("#divcontent").css("display", "none");
                }
            });
            $("#dvExpend").css({ 'height': $("#dvControlPanel").height() + 20 });
            document.getElementById('dvLoading').style.display = "none";
        });

    });
}
function GetBindPageDepths() {
    document.getElementById('dvLoading').style.display = "block";
    window.divcontent.innerHTML = '';
    var AccountId = document.getElementById('hdn_AccountId').value;
    $(document).ready(function () {
        var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountId + '&type=getdepth';
        $.getJSON(urlsearch, function (json) {
            $.each(json, function (i, weed) {
                window.divcontent.innerHTML = weed.pocketnumbershtml;
                if (window.divcontent.innerHTML == '') {
                    $("#dvDefault").css("display", "block");
                    $("#dvLoading").css("display", "none");
                    $("#divcontent").css("display", "none");
                }
            });
            $("#dvExpend").css({ 'height': $("#dvControlPanel").height() + 20 });
            document.getElementById('dvLoading').style.display = "none";
        });

    });
}
function GetBindFrequency() {
    document.getElementById('dvLoading').style.display = "block";
    window.divcontent.innerHTML = '';
    var AccountId = document.getElementById('hdn_AccountId').value;
    $(document).ready(function () {
        var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountId + '&type=getfrequency';
        $.getJSON(urlsearch, function (json) {
            $.each(json, function (i, weed) {
                window.divcontent.innerHTML = weed.pocketnumbershtml;
                if (window.divcontent.innerHTML == '') {
                    $("#dvDefault").css("display", "block");
                    $("#dvLoading").css("display", "none");
                    $("#divcontent").css("display", "none");
                }
            });
            $("#dvExpend").css({ 'height': $("#dvControlPanel").height() + 20 });
            document.getElementById('dvLoading').style.display = "none";
        });

    });
}
function GetBindRecency() {
    document.getElementById('dvLoading').style.display = "block";
    window.divcontent.innerHTML = '';
    var AccountId = document.getElementById('hdn_AccountId').value;
    $(document).ready(function () {
        var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountId + '&type=getrecency';
        $.getJSON(urlsearch, function (json) {
            $.each(json, function (i, weed) {
                window.divcontent.innerHTML = weed.pocketnumbershtml;
                if (window.divcontent.innerHTML == '') {
                    $("#dvDefault").css("display", "block");
                    $("#dvLoading").css("display", "none");
                    $("#divcontent").css("display", "none");
                }
            });
            $("#dvExpend").css({ 'height': $("#dvControlPanel").height() + 20 });
            document.getElementById('dvLoading').style.display = "none";
        });

    });
}
function BindPages() {
    document.getElementById('dvLoading').style.display = "block";
    var AccountId = document.getElementById('hdn_AccountId').value;
    $(document).ready(function () {
        var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountId + '&type=pages';
        $.getJSON(urlsearch, function (json) {
            $.each(json, function (i, weed) {
                document.getElementById('dvPages').innerHTML = weed.pocketnumbershtml;
            });
            GetBindPages();
            document.getElementById('dvLoading').style.display = "none";
        });

    });
}
function BindEvents() {
    document.getElementById('dvLoading').style.display = "block";
    var AccountId = document.getElementById('hdn_AccountId').value;
    $(document).ready(function () {
        var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountId + '&type=events';
        $.getJSON(urlsearch, function (json) {
            $.each(json, function (i, weed) {
                document.getElementById('dvEvents').innerHTML = weed.pocketnumbershtml;
            });
            GetBindEvents();
            document.getElementById('dvLoading').style.display = "none";
        });

    });
}
function BindGroups() {
    document.getElementById('dvLoading').style.display = "block";
    var AccountId = document.getElementById('hdn_AccountId').value;
    $(document).ready(function () {
        var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountId + '&type=groups';
        $.getJSON(urlsearch, function (json) {
            $.each(json, function (i, weed) {
                document.getElementById('dvGroups').innerHTML = weed.pocketnumbershtml;
            });
            GetBindGroups();
            document.getElementById('dvLoading').style.display = "none";
        });
    });
}

function BindAllTypes(obj) {
    document.getElementById("hdnSearchBy").value = "1";
    var AccountIdall = document.getElementById('hdn_AccountId').value;
    var srchval;
    if (obj == 'source') {
        document.getElementById('dvLoading').style.display = "block";
        srchval = document.getElementById('txtFilterName').value;
        var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountIdall + '&type=' + obj + '&searchval=' + srchval;
        $.getJSON(urlsearch, function (json) {
            $.each(json, function (i, weed) {
                document.getElementById('dvBindSources').innerHTML = weed.pocketnumbershtml;
                showdv(2);
            });
            document.getElementById('dvLoading').style.display = "none";
        });
    }
    else if (obj == 'pages') {
        document.getElementById('dvLoading').style.display = "block";
        srchval = document.getElementById('txtpagescore').value;
        var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountIdall + '&type=' + obj + '&searchval=' + srchval;
        $.getJSON(urlsearch, function (json) {
            $.each(json, function (i, weed) {
                document.getElementById('dvPages').innerHTML = weed.pocketnumbershtml;
                showdvscore(2);
            });
            document.getElementById('dvLoading').style.display = "none";
        });
    }
    else if (obj == 'events') {
        document.getElementById('dvLoading').style.display = "block";
        srchval = document.getElementById('txtEventsScores').value;
        var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountIdall + '&type=' + obj + '&searchval=' + srchval;
        $.getJSON(urlsearch, function (json) {
            $.each(json, function (i, weed) {
                document.getElementById('dvEvents').innerHTML = weed.pocketnumbershtml;
                showdvevents(2);
            });
            document.getElementById('dvLoading').style.display = "none";
        });
    }
    else if (obj == 'groups') {
        document.getElementById('dvLoading').style.display = "block";
        srchval = document.getElementById('txtGroupsScores').value;
        var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountIdall + '&type=' + obj + '&searchval=' + srchval;
        $.getJSON(urlsearch, function (json) {
            $.each(json, function (i, weed) {
                document.getElementById('dvGroups').innerHTML = weed.pocketnumbershtml;
                showdvgroups(2);
            });
            document.getElementById('dvLoading').style.display = "none";
        });
    }
}


//function deletesourcevalue(mynewobj, mynewobj1) {
//    $(function () {
//        $("#dialog-confirm").dialog({
//            resizable: false,
//            height: 170,
//            modal: true,
//            buttons: {
//                "Delete": function () {
//                    var AccountIdall = document.getElementById('hdn_AccountId').value;
//                    var getsource = mynewobj;
//                    var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountIdall + '&type=delete&searchval=' + mynewobj1;
//                    $.getJSON(urlsearch, function (json) {
//                        $.each(json, function (i, weed) {
//                            if (weed.pocketnumbershtml == "Success") {
//                                deleteinbox();
//                                if (getsource == 'source') {
//                                    BindSources();
//                                }
//                                if (getsource == 'page') {
//                                    BindPages();
//                                }
//                                if (getsource == 'time') {
//                                    GetBindTimes();
//                                }
//                                if (getsource == 'frequency') {
//                                    GetBindFrequency();
//                                }
//                                if (getsource == 'recency') {
//                                    GetBindRecency();
//                                }
//                                if (getsource == 'events') {
//                                    BindEvents();
//                                }
//                                if (getsource == 'groups') {
//                                    BindGroups();
//                                }
//                            }
//                        });
//                    });
//                    $(this).dialog("close");
//                },
//                Cancel: function () {
//                    $(this).dialog("close");
//                }
//            }
//        });
//    });
//}
function ConfirmedDelete(DataId) {
    var arData = DataId.split('~');
    var AccountIdall = document.getElementById('hdn_AccountId').value;
    var getsource = arData[0];
    var scoreId = arData[1];
    if (getsource == "sourceType")
        TypeName = arData[2];
    var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountIdall + '&type=delete&searchval=' + scoreId;
    $.getJSON(urlsearch, function (json) {
        $.each(json, function (i, weed) {
            if (weed.pocketnumbershtml == "Success") {
                deleteinbox();
                switch (getsource) {
                    case "source":
                        BindSources();
                        break;
                    case "sourceType":
                        GetBindSourceTypes();
                        break;
                    case "page":
                        BindPages();
                        break;
                    case "time":
                        GetBindTimes();
                        break;
                    case "pagedepth":
                        GetBindPageDepths();
                        break;
                    case "frequency":
                        GetBindFrequency();
                        break;
                    case "recency":
                        GetBindRecency();
                        break;
                    case "events":
                        BindEvents();
                        break;
                    case "groups":
                        BindGroups();
                        break;
                }
                $("#dvDeletePanel").hide();
            }
        });

    });
}
function update() {
    $("#btnUpdate").attr("disabled", "disabled");
    var AccountIdall = document.getElementById('hdn_AccountId').value;
    var getsource = document.getElementById('hdnbtnsource').value;
    if (document.getElementById('txteditscore').value != '') {
        var urlsearch = '/Areas/Analytics/Handlers/bindallsources.ashx?AccountId=' + AccountIdall + '&type=update&searchval=' + document.getElementById('hdnbtnedit').value + '&score=' + document.getElementById('txteditscore').value;
        $.getJSON(urlsearch, function (json) {
            $.each(json, function (i, weed) {
                if (weed.pocketnumbershtml == "Success") {

                    if (getsource == 'source') {
                        BindSources();
                    }
                    if (getsource == 'sourceType') {
                        GetBindSourceTypes();
                    }
                    if (getsource == 'page') {
                        BindPages();
                    }
                    if (getsource == 'time') {
                        GetBindTimes();
                    }
                    if (getsource == 'pagedepth') {
                        GetBindPageDepths();
                    }
                    if (getsource == 'frequency') {
                        GetBindFrequency();
                    }
                    if (getsource == 'recency') {
                        GetBindRecency();
                    }
                    if (getsource == 'events') {
                        BindEvents();
                    }
                    if (getsource == 'groups') {
                        BindGroups();
                    }
                    $("#btnUpdate").removeAttr("disabled", "disabled");
                    $("#tbleditscore").hide("slow");
                }
            });
            updateinbox();
            $("#dvExpend").css({ 'height': $("#dvControlPanel").height() - 185 });
        });
    }
}

function showdv(obj) {
    if (obj == 1) {
        $('#dvFilterName').show(500);
    }
    if (obj == 2) {
        $('#dvFilterName').hide(500);
    }
    return false;
}
function showdvscore(objgetstat) {
    if (objgetstat == 1) {
        $('#dvscore').show(500);
    }
    if (objgetstat == 2) {
        $('#dvscore').hide(500);
    }
    return false;
}
function showdvevents(obj1) {
    if (obj1 == 1) {
        $('#dvFilterNameEvents').show(500);
    }
    if (obj1 == 2) {
        $('#dvFilterNameEvents').hide(500);
    }
    return false;
}
function showdvgroups(obj1) {
    if (obj1 == 1) {
        $('#dvFilterNameGroups').show(500);
    }
    if (obj1 == 2) {
        $('#dvFilterNameGroups').hide(500);
    }
    return false;
}
function makeuncheck() {

    // add multiple select / deselect functionality      
    if ($(".case").length == $(".case:checked").length) {
        $("#chkBindSources").attr("checked", "checked");
        if (document.getElementById("hdnSearchBy").value != "1")
            document.getElementById('hdnSources').value = '5';
    } else {
        $("#chkBindSources").removeAttr("checked");
        document.getElementById('hdnSources').value = '0';
    }
    document.getElementById('spnslct').innerHTML = "Select All";
    if ($("#dvBindSources input[type='checkbox']:checked").length >= 10) {
        $("#divmsg").show();
        ShowErrorMessage("Maximum 10 sources will be inserted at a time");
        $("#dvBindSources input[type='checkbox']").attr("disabled", true);
        return false;
    }
    else {
        $("#divmsg").hide();
    }
    $("#dvBindSources input[type='checkbox']").attr("disabled", false);
}
function makeuncheckpage() {
    // add multiple select / deselect functionality      
    if ($(".case1").length == $(".case:checked").length) {
        $("#chpagesall").attr("checked", "checked");
        if (document.getElementById("hdnSearchBy").value != "1")
            document.getElementById('hdnSources').value = '5';
    } else {
        $("#chpagesall").removeAttr("checked");
        document.getElementById('hdnSources').value = '0';
    }
    document.getElementById('Span1').innerHTML = "Select All";
    if ($("#dvPages input[type='checkbox']:checked").length >= 10) {
        $("#divmsg").show();
        ShowErrorMessage("Maximum 10 pages will be inserted at a time");
        $("#dvPages input[type='checkbox']").attr("disabled", true);
        return false;
    }
    else {
        $("#divmsg").hide();
    }
    $("#dvPages input[type='checkbox']").attr("disabled", false);
}
function makeuncheckevent() {
    // add multiple select / deselect functionality      
    if ($(".case2").length == $(".case:checked").length) {
        $("#chkEventsAll").attr("checked", "checked");
        if (document.getElementById("hdnSearchBy").value != "1")
            document.getElementById('hdnSources').value = '5';
    } else {
        $("#chkEventsAll").removeAttr("checked");
        document.getElementById('hdnSources').value = '0';
    }
    document.getElementById('Span2').innerHTML = "Select All";
    if ($("#dvEvents input[type='checkbox']:checked").length >= 10) {
        $("#divmsg").show();
        ShowErrorMessage("Maximum 10 events will be inserted at a time");
        $("#dvEvents input[type='checkbox']").attr("disabled", true);
        return false;
    }
    else {
        $("#divmsg").hide();
    }
    $("#dvEvents input[type='checkbox']").attr("disabled", false);
}
function makeuncheckgroups() {
    // add multiple select / deselect functionality      
    if ($(".case3").length == $(".case:checked").length) {
        $("#chkGroupsAll").attr("checked", "checked");
        if (document.getElementById("hdnSearchBy").value != "1")
            document.getElementById('hdnSources').value = '5';
    } else {
        $("#chkGroupsAll").removeAttr("checked");
        document.getElementById('hdnSources').value = '0';
    }
    document.getElementById('Span3').innerHTML = "Select All";
    if ($("#dvGroups input[type='checkbox']:checked").length >= 10) {
        $("#divmsg").show();
        ShowErrorMessage("Maximum 10 groups will be inserted at a time");
        $("#dvGroups input[type='checkbox']").attr("disabled", true);
        return false;
    }
    else {
        $("#divmsg").hide();
    }
    $("#dvGroups input[type='checkbox']").attr("disabled", false);
}
$(document).ready(function () {
    $('.ui-helper-hidden-accessible').hide();
});
