$(document).ready(function () {
    setTimeout(function () { BindRuleToolTipData(); }, 3000);
});

function BindRuleToolTipData() {
    if (RuleToolTipDataList != undefined && RuleToolTipDataList != null) {
        //By BYAUDIENCE
        for (var property in RuleToolTipDataList.BYAUDIENCE) {
            $(`#${property}`).attr("data-content", RuleToolTipDataList.BYAUDIENCE[property][1]);
        }

        //By BYBEHAVIOUR
        for (var property in RuleToolTipDataList.BYBEHAVIOUR) {
            $(`#${property}`).attr("data-content", RuleToolTipDataList.BYBEHAVIOUR[property][1]);
        }

        //By BYEVENT
        for (var property in RuleToolTipDataList.BYEVENT) {
            $(`#${property}`).attr("data-content", RuleToolTipDataList.BYEVENT[property][1]);
        }

        //By BYINTERACTION
        for (var property in RuleToolTipDataList.BYINTERACTION) {
            $(`#${property}`).attr("data-content", RuleToolTipDataList.BYINTERACTION[property][1]);
        }

        //By BYPROFILE
        for (var property in RuleToolTipDataList.BYPROFILE) {
            $(`#${property}`).attr("data-content", RuleToolTipDataList.BYPROFILE[property][1]);
        }
    }

    RuleToolTipBind();
}

function RuleToolTipBind() {
    $('[data-toggle="popover"]').popover();
}