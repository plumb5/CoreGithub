
$("#ui_btnFilterSave").click(function () {

    $("#dvLoading").show();

    if (validateFilter()) {
        var FilterDetails = GetFilterForQuery();
        SaveUpdateFilter(FilterDetails);
    }
    //$("#dvLoading").hide();
});

function SaveUpdateFilter(GroupByFilter) {

    $("#dvLoading").show();

    var FilterDetails = { GroupId: 0, IsOtherGroup: false, TimeInterval: null, FilterContent: "", FilterQuery: "", CreatedDate: null };

    FilterDetails.GroupId = GroupByFilter.GroupId;
    FilterDetails.IsOtherGroup = GroupByFilter.IsOtherGroup;
    FilterDetails.TimeInterval = GroupByFilter.TimeInterval;
    FilterDetails.FilterContent = JSON.stringify(GroupByFilter.FilterContent);

    var allFilter = GroupByFilter.FilterContent;
    FilterDetails.FilterQuery = MakeQuery(allFilter);

    $.ajax({
        url: "/Mobile/MobileGroupByFilter/SaveUpdate",
        type: 'POST',
        data: JSON.stringify({ 'groupByFilter': FilterDetails }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        //async: false,
        success: function (response) {
            if (response.Status == 'Success' && response.Result > 0) {
                ShowErrorMessage("Filter Saved/Updated");
            }
            else if (response.Status == 'Fail') {
                ShowErrorMessage(response.Result);
            }
            else
                ShowErrorMessage("Something went wrong");
            $("#dvLoading").hide();
        },
        error: ShowAjaxError
    });
}


$("#ui_btnFilterTest").click(function () {

    $("#dvLoading").show();

    if (validateFilter()) {
        var FilterDetails = GetFilterForQuery();

        var allFilter = FilterDetails.FilterContent;
        var FilterQuery = MakeQuery(allFilter);

        $.ajax({
            url: "/Mobile/MobileGroupByFilter/VerifyQuery",
            type: 'POST',
            data: JSON.stringify({ 'FilterQuery': FilterQuery }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            //async: false,
            success: ShowQueryResult,
            error: ShowAjaxError
        });
    }
});

function ShowQueryResult(response) {

    if (response.Status == 'Success') {
        var QueryResult = response.Result;
        if (QueryResult != undefined && QueryResult.length > 0) {
            $("#ui_divFilterPopUpData").html("<div style='height: 15px;' class='headerstyle'>" +
           "<div style='float: left; width: 39%; text-align: left;'>Name</div>" +
           "<div style='float: left; width: 44%; text-align: left;'>EmailId</div>" +
           "<div style='float: left; width: 15%;text-align: left;'>PhoneNumber</div>" +
           "</div>");

            $("#ui_lblFilterResult").html("Filter condition is fine," + QueryResult[0].UserGroupId + " results found and below is the top 10 result based on condition");

            for (var i = 0; i < QueryResult.length; i++) {
                var divContent = "";
                divContent += "<div style=width:39%; >" + QueryResult[i].Name + "</div>";
                divContent += "<div class='EmailMasking' style=width:44%; >" + MaskEmailId(QueryResult[i].EmailId) + "</div>";
                divContent += "<div class='PhoneMasking' style=width:15%; >" + MaskPhoneNumber(QueryResult[i].PhoneNumber) + "</div>";
                $("#ui_divFilterPopUpData").append("<div class='itemStyle'>" + divContent + "</div>");
            }
        }
        else if (QueryResult != undefined && QueryResult.length == 0) {
            $("#ui_divFilterPopUpData").html('');
            $("#ui_lblFilterResult").html("Filter condition is fine, But we don't have any matching result now");
        }
    }
    else if (response.Status == 'SqlError') {
        $("#ui_lblFilterResult").html("There is a query error");
        $("#ui_divFilterPopUpData").html(response.Result);
    }
    else if (response.Status == 'Error') {
        $("#ui_lblFilterResult").html("There is an error to run this query");
        $("#ui_divFilterPopUpData").html(response.Result);
    }
    else if (response.Status == 'Fail') {
        $("#ui_lblFilterResult").html(response.Result);
        $("#ui_divFilterPopUpData").html('');
    }
    else {
        $("#ui_lblFilterResult").html("Something went wrong");
        $("#ui_divFilterPopUpData").html('');
    }

    $(".bgShadedDiv").show();
    $("#ui_divFilterPopUp").show();
    $("#dvLoading").hide();
}

function GetFilterForQuery() {

    var FilterDetails = { GroupId: 0, IsOtherGroup: null, TimeInterval: null, FilterContent: [] };
    var AllFilter = $('div[id^=ui_divFilterContainer_]');

    if (AllFilter.length > 0) {
        var GroupId = $.urlParam("GroupId");
        FilterDetails.GroupId = GroupId;
        if ($("#ui_chkFilterGroup").is(':checked'))
            FilterDetails.IsOtherGroup = true;
        else
            FilterDetails.IsOtherGroup = false;
        FilterDetails.TimeInterval = $('input[name=ui_rdbtnFilterInterval]:checked').val();

        for (var i = 0; i < AllFilter.length; i++) {
            var FilterContent = { FilterType: 0, ColumnName: "", ColumnDataType: "", Condition: [] };
            if (i == 0)
                FilterContent.FilterType = 0;
            else
                FilterContent.FilterType = $('input[name=ui_rdbtnFilterQueryType_' + i + '_0]:checked').val();
            FilterContent.ColumnName = $('#ui_ddlFilterContactColumn_' + i).val();
            FilterContent.ColumnDataType = $('#ui_ddlFilterContactColumn_' + i + ' option:selected')[0].getAttribute("datatype");

            var FilterSubContainerId = "ui_divFilterConditionSubContainer_" + i;
            var AllCondition = $('div[id^=' + FilterSubContainerId + ']');
            if (AllCondition.length > 0) {
                for (var j = 0; j < AllCondition.length; j++) {
                    var FilterCondition = { QueryType: 0, ConditionType: 0, ConditionValue: "" };
                    var elementSuffixId = i + '_' + j;
                    if (j == 0)
                        FilterCondition.QueryType = 0;
                    else
                        FilterCondition.QueryType = $('input[name=ui_rdbtnConditionQueryType_' + elementSuffixId + ']:checked').val();
                    FilterCondition.ConditionType = $('#ui_ddlFilterCondition_' + elementSuffixId).val();
                    FilterCondition.ConditionValue = $('#ui_txtFilterConditionValue_' + elementSuffixId).val();
                    FilterContent.Condition.push((FilterCondition));
                }
            }
            FilterDetails.FilterContent.push((FilterContent));
        }
    }

    return FilterDetails;
}

function MakeQuery(allFilter) {

    var queryString = "(";
    for (var i = 0; i < allFilter.length; i++) {
        if (allFilter[i].FilterType == 1) {
            queryString += " And (";
        }
        else if (allFilter[i].FilterType == 2) {
            queryString += " Or (";
        }

        var allCondition = allFilter[i].Condition;
        var ConditionColumn = allFilter[i].ColumnName;
        var ColumnDataType = allFilter[i].ColumnDataType;
        var subQueryString = "";
        if (allCondition.length > 0) {

            var inValues = "";
            var notInValues = "";
            if (allCondition[0].ConditionType == 1 && ColumnDataType != "DateTime") {
                if (ColumnDataType == "String")
                    inValues = "'" + allCondition[0].ConditionValue + "'";
                else
                    inValues = "" + allCondition[0].ConditionValue + "";
            }
            else if (allCondition[0].ConditionType == 2 && ColumnDataType != "DateTime") {
                if (ColumnDataType == "String")
                    notInValues = "'" + allCondition[0].ConditionValue + "'";
                else
                    notInValues = "" + allCondition[0].ConditionValue + "";
            }
            else {
                subQueryString = getSubQuery(allCondition[0].ConditionType, ConditionColumn, allCondition[0].ConditionValue, ColumnDataType, subQueryString);
            }


            var inQueryData = JSLINQ(allCondition).Where(function () { return (this.ConditionType == 1 && this.QueryType == 2 && ColumnDataType != "DateTime"); });
            if (inQueryData != undefined && inQueryData.items != undefined && inQueryData.items.length > 0) {
                if (ColumnDataType == "String")
                    var inValueList = "'" + (JSLINQ(inQueryData.items).Select(function (item) { return item.ConditionValue; })).items.join("','") + "'";
                else
                    var inValueList = "" + (JSLINQ(inQueryData.items).Select(function (item) { return item.ConditionValue; })).items.join(",") + "";

                if (inValues.length > 0)
                    inValues = inValues + "," + inValueList;
                else
                    inValues = inValueList;
            }

            if (inValues.length > 0) {

                if (subQueryString.length > 0)
                    subQueryString += " OR " + ConditionColumn + "" + " IN (" + "" + inValues + ")";
                else
                    subQueryString = "" + ConditionColumn + "" + " IN (" + "" + inValues + ")";
            }

            var notInQueryData = JSLINQ(allCondition).Where(function () { return (this.ConditionType == 2 && this.QueryType == 2 && ColumnDataType != "DateTime"); });
            if (notInQueryData != undefined && notInQueryData.items != undefined && notInQueryData.items.length > 0) {
                if (ColumnDataType == "String")
                    var notInValueList = "'" + (JSLINQ(notInQueryData.items).Select(function (item) { return item.ConditionValue; })).items.join("','") + "'";
                else
                    var notInValueList = "" + (JSLINQ(notInQueryData.items).Select(function (item) { return item.ConditionValue; })).items.join(",") + "";

                if (notInValues.length > 0)
                    notInValues = notInValues + "," + notInValueList;
                else
                    notInValues = notInValueList;
            }

            if (notInValues.length > 0) {
                if (subQueryString.length > 0)
                    subQueryString += " OR " + ConditionColumn + "" + " NOT IN (" + "" + notInValues + ")";
                else
                    subQueryString = "" + ConditionColumn + "" + " NOT IN (" + "" + notInValues + ")";
            }

            var restData = JSLINQ(allCondition).Where(function () { return (((this.ConditionType != 1 && this.QueryType != 2) || (this.ConditionType == 1 && ColumnDataType == "DateTime") || (this.ConditionType != 2 && this.QueryType != 2) || (this.ConditionType == 2 && ColumnDataType == "DateTime") || ((this.ConditionType != 1 && this.ConditionType != 2) && this.QueryType == 2)) && this.QueryType != 0); });
            if (restData != undefined && restData.items != undefined && restData.items.length > 0) {
                for (var j = 0; j < restData.items.length; j++) {

                    if (restData.items[j].QueryType == 1) {
                        subQueryString += " And ";

                        subQueryString = getSubQuery(restData.items[j].ConditionType, ConditionColumn, restData.items[j].ConditionValue, ColumnDataType, subQueryString);
                    }
                    else if (restData.items[j].QueryType == 2) {
                        subQueryString += " Or ";

                        subQueryString = getSubQuery(restData.items[j].ConditionType, ConditionColumn, restData.items[j].ConditionValue, ColumnDataType, subQueryString);
                    }
                }
            }
        }

        queryString += subQueryString + ")";
    }

    return EncryptString(queryString);
}

function getSubQuery(ConditionType, ConditionColumn, ConditionValue, ColumnDataType, subQueryString) {

    if (ConditionType == 1) {
        if (ColumnDataType == "String")
            subQueryString += "" + ConditionColumn + "" + " Like " + "'" + ConditionValue + "'";
        else if (ColumnDataType == "DateTime")
            subQueryString += "cast(" + ConditionColumn + " as date)" + " = " + "DateAdd(Day," + ConditionValue + ",cast(Getdate() as date))";
        else
            subQueryString += "" + ConditionColumn + "" + " Like " + "" + ConditionValue + "";
    }
    else if (ConditionType == 2) {
        if (ColumnDataType == "String")
            subQueryString += "" + ConditionColumn + "" + " Not Like " + "'" + ConditionValue + "'";
        else if (ColumnDataType == "DateTime")
            subQueryString += "cast(" + ConditionColumn + " as date)" + " != " + "DateAdd(Day," + ConditionValue + ",cast(Getdate() as date))";
        else
            subQueryString += "" + ConditionColumn + "" + " Not Like " + "" + ConditionValue + "";
    }
    else if (ConditionType == 3) {
        if (ColumnDataType == "String")
            subQueryString += "" + ConditionColumn + "" + " > " + "'" + ConditionValue + "'";
        else if (ColumnDataType == "DateTime")
            subQueryString += "cast(" + ConditionColumn + " as date)" + " > " + "DateAdd(Day," + ConditionValue + ",cast(Getdate() as date))";
        else
            subQueryString += "" + ConditionColumn + "" + " > " + "" + ConditionValue + "";
    }
    else if (ConditionType == 4) {
        if (ColumnDataType == "String")
            subQueryString += "" + ConditionColumn + "" + " < " + "'" + ConditionValue + "'";
        else if (ColumnDataType == "DateTime")
            subQueryString += "cast(" + ConditionColumn + " as date)" + " < " + "DateAdd(Day," + ConditionValue + ",cast(Getdate() as date))";
        else
            subQueryString += "" + ConditionColumn + "" + " < " + "" + ConditionValue + "";
    }
    else if (ConditionType == 5) {
        subQueryString += "" + ConditionColumn + "" + " Like '" + "%" + ConditionValue + "%'";
    }
    else if (ConditionType == 6) {
        subQueryString += "" + ConditionColumn + "" + " Not Like '" + "%" + ConditionValue + "%'";
    }
    else if (ConditionType == 7) {
        if (ColumnDataType == "String")
            subQueryString += "" + ConditionColumn + "" + " >= " + "'" + ConditionValue + "'";
        else if (ColumnDataType == "DateTime")
            subQueryString += "cast(" + ConditionColumn + " as date)" + " >= " + "DateAdd(Day," + ConditionValue + ",cast(Getdate() as date))";
        else
            subQueryString += "" + ConditionColumn + "" + " >= " + "" + ConditionValue + "";
    }

    else if (ConditionType == 8) {
        if (ColumnDataType == "String")
            subQueryString += "" + ConditionColumn + "" + " <= " + "'" + ConditionValue + "'";
        else if (ColumnDataType == "DateTime")
            subQueryString += "cast(" + ConditionColumn + " as date)" + " <= " + "DateAdd(Day," + ConditionValue + ",cast(Getdate() as date))";
        else
            subQueryString += "" + ConditionColumn + "" + " <= " + "" + ConditionValue + "";
    }

    else if (ConditionType == 9) {
        subQueryString += "(" + ConditionColumn + " IS NULL OR CAST(" + ConditionColumn + " as varchar)='')";
    }

    else if (ConditionType == 10) {
        subQueryString += "(" + ConditionColumn + " IS NOT NULL AND CAST(" + ConditionColumn + " as varchar)!='')";
    }

    return subQueryString;
}