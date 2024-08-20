
var getCondition = [];
var TableNames = [];
var SegmentGroupLevel = 1;
var SegmentComparison = 1;
var preDefinedData = null;
var GroupId = 0;

var SegmentJson = [];
var CustomFields = [];

var CustomeEventNameData = [];
var CustomEventValue = "";
var CustomEventsIndex = 0;
//var SegmentJson = [
//{
//    "tablename": "SessionTracker",
//    "description": "User Behaviour",
//    "columns": [
//       {
//           "name": "City",
//           "datatype": "nvarchar"
//       },
//       {
//           "name": "Country",
//           "datatype": "nvarchar"
//       }]
//},
//{
//    "tablename": "Contact1",
//    "description": "Contact Details",
//    "columns": [
//       {
//           "name": "Gender",
//           "datatype": "nvarchar"
//       },
//       {
//           "name": "EmailId",
//           "datatype": "nvarchar"
//       },
//       {
//           "name": "age",
//           "datatype": "int"
//       }
//    ]
//}
////,
////{
////    "tablename": "MobileSessionTracker",
////    "description": "Contact Behaviour",
////    "columns": [
////       {
////           "name": "City",
////           "datatype": "nvarchar"
////       },
////       {
////           "name": "DeviceBrandName",
////           "datatype": "nvarchar"
////       },
////       {
////           "name": "DeviceModelName",
////           "datatype": "nvarchar"
////       }
////    ]
////}
//];


$(document).ready(function () {
    $('#btnTest').show();
    $('#ui_btn_CreateSegment').hide();

    SegmentBuilderUtil.AllTableColumn();

    preDefinedData = null;
    GroupId = 0;
    BindSearch();
});

$('#ui_btn_CreateSegment').click(function () {

    if (SegmentBuilderUtil.ValidateSegment()) {
        SegmentBuilderUtil.getSegmentCondition();
        SegmentBuilderUtil.Create();
    }
});


var SegmentBuilderUtil = {
    AllTableColumn: function () {
        ShowPageLoading();
        $.ajax({
            url: "/CustomEvents/CustomEventsSegmentBuilder/GetAllTableColumns",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response != null && response.length > 0) {

                    SegmentJson = response;
                    $("#table_1").append(SegmentBuilderUtil.BindingTableName());

                    if ($.urlParam("GroupId") > 0) {
                        GroupId = parseInt($.urlParam("GroupId"));
                        SegmentBuilderUtil.GroupDetails(GroupId);
                        SegmentBuilderUtil.GetSegmentJson();
                    }
                    else { SegmentBuilderUtil.GroupMaxCount(); }
                }

                //HidePageLoading();

            },
            error: ShowAjaxError
        });
    },
    BindingTableName: function () {
        SegmentBuilderUtil.allowSaveBtn();
        var tableHtml = "";
        for (var p = 0; p < SegmentJson.length; p++) {
            tableHtml += `<option value="${SegmentJson[p].TableName}">${SegmentJson[p].DisplayTableName}</option>`;
        }
        return tableHtml;
    },
    BindingColumnName: function (Comparison) {
        SegmentBuilderUtil.allowSaveBtn();
        var selTable = $("#table_" + Comparison).val();
        if (selTable == 'select') {
            $("#column_" + Comparison).empty();
            var columnHtml = '<option value="select" >Select Column</option>';
            $("#column_" + Comparison).append(columnHtml);
        } else {
            if (selTable == "CustomEvents") {
                let eventName = $(`#table_${Comparison} option:selected`).text();
                let columnHtml = '<option value="select" >Select Column</option>';
                let getColumns = SegmentJson.find(x => x.DisplayTableName === eventName).ColumnNames;

                for (let p = 0; p < getColumns.length; p++) {
                    columnHtml += `<option datatype="${getColumns[p].DataType}" value="EventData${p + 1}">${getColumns[p].ColumnName}</option>`;
                }

                $("#column_" + Comparison).empty();
                $("#column_" + Comparison).append(columnHtml);
            } else {
                let getColumns = SegmentJson.find(x => x.TableName === selTable).ColumnNames;
                let columnHtml = '<option value="select" >Select Column</option>';
                for (var p = 0; p < getColumns.length; p++) {
                    if (selTable == 'Contact' && !getColumns[p].ColumnName.includes('CustomField')) {
                        columnHtml += `<option datatype="${getColumns[p].DataType}" value="${getColumns[p].ColumnName}">${getColumns[p].ColumnName}</option>`;
                    }
                    else if (selTable == "SessionTracker" || selTable == "MainTracker" || selTable == "EventTracker" || selTable == "MailSent" || selTable == "SmsSent" || selTable == "WhatsappSent" || selTable == "WebPushSent") {
                        columnHtml += `<option datatype="${getColumns[p].DataType}" value="${getColumns[p].ColumnName}">${getColumns[p].ColumnName}</option>`;
                    }
                }
                if (selTable == 'Contact' && CustomFields != null && CustomFields.length > 0) {
                    for (var c = 0; c < CustomFields.length; c++) {
                        columnHtml += `<option datatype="varchar" value="CustomField${c + 1}" >${CustomFields[c].FieldName}</option>`;
                    }
                }

                $("#column_" + Comparison).empty();
                $("#column_" + Comparison).append(columnHtml);
            }


        }
    },
    BindingInputValue: function (colid) {
        SegmentBuilderUtil.allowSaveBtn();
        var dataType = $("#column_" + colid + " option:selected").attr("datatype");
        var type = dataType == "int" ? 'number' : dataType == "varchar" ? "text" : "text";
        $("#value_" + colid).prop('type', type);

        let logicComparison = $(`#logic_${colid}`).val();

        if (logicComparison == "AverageEquals" || logicComparison == "AverageGreaterThan" || logicComparison == "AverageLessThan" || logicComparison == "AverageNotEquals"
            || logicComparison == "TotalEquals" || logicComparison == "TotalGreaterThan" || logicComparison == "TotalLessThan" || logicComparison == "TotalNotEquals") {

            if (dataType != "number") {
                ShowErrorMessage("Please select number column for this condition");
            }
        }
    },
    Create: function () {

        let FromDate = null;
        let ToDate = null;

        let dates = getFromAndToDateInUTC($("#startdate").val(), $("#enddate").val());
        if (dates == false) {
            HidePageLoading();
            return;
        }
        FromDate = dates[0];
        ToDate = dates[1];

        let index = TableNames.indexOf("CustomEvents");
        if (index > -1) {
            TableNames.splice(index, 1);
        }
        let tableName = ["CustomEvents"].concat(TableNames);
        TableNames = tableName;

        ShowPageLoading();

        $.ajax({
            url: "/CustomEvents/CustomEventsSegmentBuilder/CreateSegmentBuilder",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'GroupId': GroupId, 'GroupName': $("#txtGroupName").val(), 'GroupDescription': $("#txtGroupDescription").val(), 'Segment': getCondition, 'TableNames': TableNames, 'FromDate': FromDate, 'ToDate': ToDate }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (response.status == true) {
                    if (GroupId == 0) {
                        window.location.href = '/ManageContact/Group';
                    } else {
                        ShowSuccessMessage(GlobalErrorList.SegmentBuilder.SucessUpdate);
                    }
                } else {
                    console.log(response.message);
                    ShowErrorMessage(response.message);
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    getSegmentCondition: function () {
        var Level = 1;
        getCondition = [];
        TableNames = [];
        var Comparison = "";
        var CustomEventsData = null;
        $('.segmentcond').each(function () {
            var $this = $(this);

            var condition = {};

            $('input,select,button', this).each(function () {

                if ($(this).attr("name") == "tablename") {
                    if (!TableNames.includes(this.value)) { TableNames.push(this.value); }

                    if (this.value === "CustomEvents") {
                        let condition = {};
                        condition.Column = "EventName";
                        condition.Comparison = "";
                        condition.Condition = "";
                        condition.DataType = "string";
                        condition.Level = Level;
                        condition.Operator = "Equals";
                        condition.Table = "CustomEvents";
                        condition.Value = $("option:selected", this).text();

                        CustomEventsData = condition;
                        //getCondition.push(condition);
                    }

                    condition.Table = this.value;
                    condition.Level = Level;
                }
                else if ($(this).attr("name") == "columnname") {
                    condition.Column = this.value;

                    condition.DataType = $("option:selected", this).attr("datatype"); //"string";
                }
                else if ($(this).attr("name") == "value") {
                    condition.Value = this.value;
                }


                //Operator------ Equals,in,like
                else if ($(this).attr("name") == "logic") {
                    condition.Operator = this.value;
                }

                //Comparison------ and or or
                else if ($(this).attr("name") == "segmentgrpand") {
                    Level = Level + 1;
                    if ($(this).hasClass("active") && condition.Comparison == undefined) {
                        Comparison = condition.Comparison = "and";
                    }
                }
                else if ($(this).attr("name") == "segmentgrpor") {
                    if ($(this).hasClass("active") && condition.Comparison == undefined) {
                        Comparison = condition.Comparison = "or";
                    }
                }

                else if ($(this).attr("name") == "segmentand") {
                    if ($(this).hasClass("active") && condition.Comparison == undefined) {
                        Comparison = condition.Comparison = "and";
                    }
                }
                else if ($(this).attr("name") == "segmentor") {
                    if ($(this).hasClass("active") && condition.Comparison == undefined) {
                        Comparison = condition.Comparison = "or";
                    }
                }


            });

            if ($(this).attr('class').indexOf("segmoreconditwrp") == -1) {
                if (condition.Condition == undefined) {
                    condition.Condition = "and";
                }

                if (CustomEventsData != null) {
                    CustomEventsData.Comparison = Comparison;
                    CustomEventsData.Condition = Comparison;
                    getCondition.push(CustomEventsData);
                }

                condition.Comparison = Comparison;
                getCondition.push(condition);
            }

        });
    },
    GetSegmentJson: function () {
        $.ajax({
            url: "/SegmentBuilder/CreateSegment/GetSegment",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'GroupId': GroupId }),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {

                $("#lblLastUpdate").html("Last Updated on: <span class='text-color-error'>" + $.datepicker.formatDate("M dd yy", GetJavaScriptDateObj(response[0].UpdatedDate)) + " " + PlumbTimeFormat(GetJavaScriptDateObj(response[0].UpdatedDate)) + "</span>");
                if (response.length > 0) {
                    let SegmentJson = JSON.parse(response[0].SegmentJson);
                    CustomeEventNameData = JSLINQ(SegmentJson).Where(function () { return (this.Column == "EventName"); }).items;
                    let SegmentJsons = JSLINQ(SegmentJson).Where(function () { return (this.Column !== "EventName"); }).items;

                    SegmentBuilderUtil.setSegmentCondition(SegmentJsons);
                    if (response[0].IsNewOrExisting == true) {
                        $("#ui_nowonwards").prop('checked', true);
                        AppendDays(false);
                        $("#ui_selectdays").val(response[0].NoOfDays).change();
                    } else {
                        $("#ui_existingdatabase").prop('checked', true);
                        AppendDays(true);
                        $("#ui_selectdays").val(response[0].NoOfDays).change();
                    }
                }
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    setSegmentCondition: function (getSegmentCondition) {

        SegmentGroupLevel = 1;
        SegmentComparison = 1;
        var getLevel = 0;
        for (var k = 0; k < getSegmentCondition.length; k++) {

            preDefinedData = getSegmentCondition[k];
            var Level = preDefinedData.Level;

            if (k == 0) {
                if (preDefinedData.Table === "CustomEvents") {
                    CustomEventValue = CustomeEventNameData[CustomEventsIndex].Value;
                    CustomEventsIndex++;
                    SegmentBuilderUtil.BindPredefinedData(1);
                } else {
                    SegmentBuilderUtil.BindPredefinedData(1);
                }

            }

            if (k != 0 && (getLevel != Level)) {
                if (preDefinedData.Table === "CustomEvents") {
                    CustomEventValue = CustomeEventNameData[CustomEventsIndex].Value;
                    CustomEventsIndex++;
                }
                $(".segaddnewgrpbtn").click();
            }


            if (getLevel == Level) {
                if (preDefinedData.Table === "CustomEvents") {
                    CustomEventValue = CustomeEventNameData[CustomEventsIndex].Value;
                    CustomEventsIndex++;
                    CreateSubCondition(Level);
                } else {
                    CreateSubCondition(Level);
                }

            }
            getLevel = Level;

        }

        preDefinedData = null;
    },
    BindPredefinedData: function (id, Group) {
        if (preDefinedData != null) {

            if (Group == 1) {
                if (preDefinedData.Comparison == "and") {
                    $("#segmentgrp_and_" + id).addClass("active");
                } else {
                    $("#segmentgrp_or_" + id).addClass("active");
                }
            } else {
                if (preDefinedData.Comparison == "and") {
                    $("#segment_and_" + id).addClass("active");
                } else {
                    $("#segment_or_" + id).addClass("active");
                }
            }

            if (preDefinedData.Table === "CustomEvents") {
                $(`#table_${id} option`).filter(function () {
                    return $(this).text() == CustomEventValue;
                }).prop('selected', true).change();
            } else {
                $("#table_" + id).val(preDefinedData.Table).change();
            }

            //$("#table_" + id).val(preDefinedData.Table)
            SegmentBuilderUtil.BindingColumnName(id);
            $("#column_" + id).val(preDefinedData.Column).change();
            $("#logic_" + id).val(preDefinedData.Operator).change();
            $("#value_" + id).val(preDefinedData.Value)

            if (preDefinedData.Operator == "CountEquals" || preDefinedData.Operator == "CountGreaterThan" || preDefinedData.Operator == "CountLessThan" || preDefinedData.Operator == "CountNotEquals") {
                $("#column_" + id).prop("disabled", true);
            } else if (preDefinedData.Operator == "IsNotEmpty" || preDefinedData.Operator == "IsEmpty") {
                $("#value_" + id).prop("disabled", true);
            }
        }
        else {
            if (Group == 1) {
                $("#segmentgrp_and_" + id).addClass("active");

            } else {
                $("#segment_and_" + id).addClass("active");
            }
        }
    },
    GroupMaxCount: function () {
        ShowPageLoading();
        $.ajax({
            url: "/SegmentBuilder/CreateSegment/GetGroupMaxCount",
            type: 'POST',
            data: JSON.stringify({ 'accountId': Plumb5AccountId }),
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                var Count = parseInt(response.returnVal) + 1;
                $('#txtGroupName').val("CustomEvents-" + Count);
                HidePageLoading();
            },
            error: ShowAjaxError
        });
    },
    ValidateSegment: function () {
        var result = true;
        if (CleanText($("#txtGroupName").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.SegmentBuilder.Title);
            result = false;
        }
        else if (CleanText($("#txtGroupDescription").val()).length == 0) {
            ShowErrorMessage(GlobalErrorList.SegmentBuilder.Description);
            result = false;
        }
        else {

            $('.segmentcond').each(function () {
                let logicValue = "";
                let columValue = "";
                $('input,select,button', this).each(function () {
                    if ($(this).attr("name") == "tablename") {
                        var getData = this.value;
                        if (getData == "select") {
                            ShowErrorMessage(GlobalErrorList.SegmentBuilder.Table);
                            result = false;
                        }
                    }
                    else if ($(this).attr("name") == "columnname") {
                        var getData = this.value;
                        //if (getData == "select") {
                        //    ShowErrorMessage(GlobalErrorList.SegmentBuilder.Column);
                        //    result = false;
                        //}
                    }
                    else if ($(this).attr("name") == "logic") {
                        logicValue = this.value;

                        if (columValue == "select") {
                            switch (logicValue) {
                                case "CountEquals":
                                case "CountGreaterThan":
                                case "CountLessThan":
                                case "CountNotEquals":
                                    break;
                                default:
                                    ShowErrorMessage(GlobalErrorList.SegmentBuilder.Column);
                                    result = false;
                            }
                        }
                    }
                    else if ($(this).attr("name") == "value") {
                        var getData = this.value;
                        if (getData.length == 0) {
                            switch (logicValue) {
                                case "IsEmpty":
                                    break;
                                case "IsNotEmpty":
                                    break;
                                default:
                                    ShowErrorMessage(GlobalErrorList.SegmentBuilder.Value);
                                    result = false;
                            }
                        }
                    }
                })
            });
        }

        return result;
    },
    TestQuery: function () {
        if (SegmentBuilderUtil.ValidateSegment()) {
            SegmentBuilderUtil.getSegmentCondition();

            let FromDate = null;
            let ToDate = null;

            let dates = getFromAndToDateInUTC($("#startdate").val(), $("#enddate").val());
            if (dates == false) {
                return;
            }

            FromDate = dates[0];
            ToDate = dates[1];

            let index = TableNames.indexOf("CustomEvents");
            if (index > -1) {
                TableNames.splice(index, 1);
            }
            let tableName = ["CustomEvents"].concat(TableNames);
            TableNames = tableName;

            ShowPageLoading();
            $.ajax({
                url: "/CustomEvents/CustomEventsSegmentBuilder/VerifyQuery",
                type: 'POST',
                data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'Segment': getCondition, 'TableNames': TableNames, 'FromDate': FromDate, 'ToDate': ToDate }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {
                    if (response.Status == true) {
                        if (response.ContactList != null && response.ContactList.length <= 0) {
                            ShowErrorMessage("No data for this condition, presently");
                        } else {
                            $('#btnTest').hide();
                            $('#ui_btn_CreateSegment').show();
                        }

                    } else {
                        console.log(response.Result);
                        ShowErrorMessage(response.Result);
                    }
                    HidePageLoading();

                },
                error: ShowAjaxError
            });
        }

    },
    GroupDetails: function (GroupId) {
        $.ajax({
            url: "/SegmentBuilder/CreateSegment/GetGroupsDetails",
            type: 'POST',
            data: JSON.stringify({ 'AccountId': Plumb5AccountId, 'GroupId': GroupId }),
            async: false,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                $('#txtGroupName').val(response.Name);
                $('#txtGroupDescription').val(response.GroupDescription);
            },
            error: ShowAjaxError
        });
    },
    allowSaveBtn: function () {
        $('#btnTest').show();
        $('#ui_btn_CreateSegment').hide();
    },
    DisableCommonField: function (Comparison) {
        SegmentBuilderUtil.allowSaveBtn();
        let selCondition = $("#logic_" + Comparison).val();
        if (selCondition == "IsNotEmpty" || selCondition == "IsEmpty") {
            $(`#value_${Comparison}`).val('').prop("disabled", true);
        } else {
            $(`#value_${Comparison}`).prop("disabled", false);
        }

        if (selCondition == "CountEquals" || selCondition == "CountGreaterThan" || selCondition == "CountLessThan" || selCondition == "CountNotEquals")
            $(`#column_${Comparison}`).val('select').change().prop("disabled", true);
        else
            $(`#column_${Comparison}`).change().prop("disabled", false);

        var dataType = $("#column_" + Comparison + " option:selected").attr("datatype");
        let logicComparison = $(`#logic_${Comparison}`).val();

        if (logicComparison == "AverageEquals" || logicComparison == "AverageGreaterThan" || logicComparison == "AverageLessThan" || logicComparison == "AverageNotEquals"
            || logicComparison == "TotalEquals" || logicComparison == "TotalGreaterThan" || logicComparison == "TotalLessThan" || logicComparison == "TotalNotEquals") {

            if (dataType != "number") {
                ShowErrorMessage("Please select number column for this condition");
            }
        }
    }
}




//UI Part.................................................................
$(".segaddnewgrpbtn").click(function () {
    SegmentBuilderUtil.allowSaveBtn();

    SegmentGroupLevel = SegmentGroupLevel + 1;
    SegmentComparison = SegmentComparison + 1;

    let getsegaddnewgrp = `<div class="segmoreconditwrp segmentcond">
  <div class="segandorvertiwrp">
    <div class="seghitevert"></div>
    <div class="segandorwrp m-p-mb-0">
      <button name="segmentgrpand" type="button" class ="btn btn-andor" id="segmentgrp_and_${SegmentComparison}">And</button>
      <button name="segmentgrpor" type="button" class ="btn btn-andor" id="segmentgrp_or_${SegmentComparison}">Or</button>
    </div>
    <div class="seghitevert"></div>
    <div class="box-litgrey w-100 position-relative">
      <div class="segcondimainclse">
        <i class="icon ion-android-close"></i>
      </div>
      <div class ="segconditfldwrp segmentcond">
       <div class="row m-gut">
         <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3 p-gut m-mb-10">
           <div class="form-group">
             <select name="tablename" id="table_${SegmentComparison}" class ="form-control addCampName"  OnChange="SegmentBuilderUtil.BindingColumnName(${SegmentComparison})">
               <option value="select">Select Table</option>
               ${SegmentBuilderUtil.BindingTableName()}
             </select>
           </div>
         </div>
         <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3 p-gut m-mb-10">
           <div class="form-group">
             <select name="columnname" id="column_${SegmentComparison}" class ="form-control addCampName"  OnChange="SegmentBuilderUtil.BindingInputValue(${SegmentComparison})">
               <option value="select" >Select Column</option>
             </select>
           </div>
         </div>
         <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3 p-gut m-mb-10">
           <div class="form-group">
             <select name="logic" id="logic_${SegmentComparison}" class ="form-control addCampName" OnChange="SegmentBuilderUtil.DisableCommonField(${SegmentComparison})">
                <option value="Equals">Equals</option>
                <option value="In">In</option>
                <option value="Like">Like</option>
                <option value="GreaterOrEquals">GreaterThan Or Equals</option>
                <option value="GreaterThan">GreaterThan</option>
                <option value="LessOrEquals">LessThan Or Equals</option>
                <option value="LessThan">LessThan</option>
                <option value="NotEquals">NotEquals</option>
                <option value="NotLike">NotLike</option>
                <option value="IsNotEmpty">IsNotEmpty</option>
                <option value="IsEmpty">IsEmpty</option>
                <option value="CountEquals">No.Of Occurences Is Equals</option>
                <option value="CountGreaterThan">No.Of Occurences Is GreaterThan</option>
                <option value="CountLessThan">No.Of Occurences Is LessThan</option>
                <option value="CountNotEquals">No.Of Occurences Is NotEquals</option>
                <option value="AverageEquals">Average Of Selected Column Is Equals</option>
                <option value="AverageGreaterThan">Average Of Selected Column Is GreaterThan</option>
                <option value="AverageLessThan">Average Of Selected Column Is LessThan</option>
                <option value="AverageNotEquals">Average Of Selected Column Is NotEquals</option>
                <option value="TotalEquals">Total Of Selected Column Is Equals</option>
                <option value="TotalGreaterThan">Total Of Selected Column Is GreaterThan</option>
                <option value="TotalLessThan">Total Of Selected Column Is LessThan</option>
                <option value="TotalNotEquals">Total Of Selected Column Is NotEquals</option>
             </select>
           </div>
         </div>
         <div class="col-sm-6 col-md-3 col-lg-3 col-xl-3 p-gut m-mb-10">
           <input type="text" name="value" class ="form-control form-control-sm" id="value_${SegmentComparison}">
         </div>
       </div>
     </div>
     <button onclick="CreateSubCondition(${SegmentGroupLevel});" id="BtnAddCond_${SegmentGroupLevel}" type="button" class ="btn btn-transcol addanthrnewconditbtn">+Add another condition</button>
   </div>
  </div>
</div>`;
    $(getsegaddnewgrp).insertBefore(".segaddnewgrpbtnwrp");


    SegmentBuilderUtil.BindPredefinedData(SegmentComparison, 1);

    //SubCondition();
    //addanothercondit();
    segandorbtn();
    deletesegmentcond();
    $(document).on("click", ".segcondimainclse", function () {
        SegmentBuilderUtil.allowSaveBtn();
        $(this).parents(".segmoreconditwrp").remove();
    });
    BindSearch();
});

function CreateSubCondition(grpLevel) {
    SegmentBuilderUtil.allowSaveBtn();
    SegmentComparison = SegmentComparison + 1;

    let getandorhtml = `<div class="segconditappndwrp segmentcond">
    <div class="segandorwrp">
      <button name="segmentand" type="button" class ="btn btn-andor" id="segment_and_${SegmentComparison}">And</button>
      <button name="segmentor" type="button" class ="btn btn-andor" id="segment_or_${SegmentComparison}">Or</button>
    </div>
    <div class="segconditdetwrp">
      <div class="form-group">
        <select name="tablename" id="table_${SegmentComparison}" class ="form-control addCampName"  OnChange="SegmentBuilderUtil.BindingColumnName(${SegmentComparison})">
               <option value="select">Select Table</option>
               ${SegmentBuilderUtil.BindingTableName()}
             </select>
      </div>
    </div>
    <div class="segconditnamwrp">
      <div class="form-group">
        <select name="columnname" id="column_${SegmentComparison}" class ="form-control addCampName"  OnChange="SegmentBuilderUtil.BindingInputValue(${SegmentComparison})">
               <option value="select" >Select Column</option>
             </select>
      </div>
    </div>
    <div class="segconditiswrp">
      <div class="form-group">
        <select name="logic" id="logic_${SegmentComparison}" class ="form-control addCampName" OnChange="SegmentBuilderUtil.DisableCommonField(${SegmentComparison})">
            <option value="Equals">Equals</option>
            <option value="In">In</option>
            <option value="Like">Like</option>
            <option value="GreaterOrEquals">GreaterThan Or Equals</option>
            <option value="GreaterThan">GreaterThan</option>
            <option value="LessOrEquals">LessThan Or Equals</option>
            <option value="LessThan">LessThan</option>
            <option value="NotEquals">NotEquals</option>
            <option value="NotLike">NotLike</option>
            <option value="IsNotEmpty">IsNotEmpty</option>
            <option value="IsEmpty">IsEmpty</option>
            <option value="CountEquals">No.Of Occurences Is Equals</option>
            <option value="CountGreaterThan">No.Of Occurences Is GreaterThan</option>
            <option value="CountLessThan">No.Of Occurences Is LessThan</option>
            <option value="CountNotEquals">No.Of Occurences Is NotEquals</option>
            <option value="AverageEquals">Average Of Selected Column Is Equals</option>
            <option value="AverageGreaterThan">Average Of Selected Column Is GreaterThan</option>
            <option value="AverageLessThan">Average Of Selected Column Is LessThan</option>
            <option value="AverageNotEquals">Average Of Selected Column Is NotEquals</option>
            <option value="TotalEquals">Total Of Selected Column Is Equals</option>
            <option value="TotalGreaterThan">Total Of Selected Column Is GreaterThan</option>
            <option value="TotalLessThan">Total Of Selected Column Is LessThan</option>
            <option value="TotalNotEquals">Total Of Selected Column Is NotEquals</option>
        </select>
      </div>
    </div>
    <div class="segcondittxtbxwrp">
      <input type="text" name="value" class ="form-control form-control-sm" id="value_${SegmentComparison}">
    </div>
    <i class="icon ion-android-close segcondfldclse"></i>
  </div>`;
    $('#BtnAddCond_' + grpLevel).before(getandorhtml);

    SegmentBuilderUtil.BindPredefinedData(SegmentComparison, 0);

    //$(getandorhtml).insertBefore(this);
    segandorbtn();
    deletesegmentcond();
    BindSearch();
    // });
}


segandorbtn = () => {
    SubCondition = 0;
    $(".btn-andor").click(function () {
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
    });
};

deletesegmentcond = () => {
    SubCondition = 0;
    $(document).on("click", ".segcondfldclse", function () {
        SegmentBuilderUtil.allowSaveBtn();
        $(this).parent().remove();
    });
};

$("#editseggrpname").click(function () {
    $(this).prev().removeAttr("disabled");
    let checkpencilicn = $(this).hasClass("fa-pencil");
    if (checkpencilicn == true) {
        $("#editseggrpname").removeClass("fa-pencil").addClass("fa-check");
    } else {
        $("#editseggrpname").removeClass("fa-check").addClass("fa-pencil");
        $(this).prev().attr("disabled", "disabled");
    }
});
$("#editseggrpdescrp").click(function () {
    $(this).prev().removeAttr("disabled");
    let checkpencilicndes = $(this).hasClass("fa-pencil");
    if (checkpencilicndes == true) {
        $("#editseggrpdescrp").removeClass("fa-pencil").addClass("fa-check");
    } else {
        $("#editseggrpdescrp").removeClass("fa-check").addClass("fa-pencil");
        $(this).prev().attr("disabled", "disabled");
    }
});

$(".segserchmicwrp .fa-microphone").click(function () {
    let checkinptvisable = $(this).prev().hasClass("hideDiv");
    if (checkinptvisable == true) {
        $(this).prev().removeClass("hideDiv").focus();
        $(this).removeClass("mr-20").addClass("mic-post active");
        $(".seggrouptitwrp").addClass("med-hide");
    } else {
        $(this).prev().addClass("hideDiv");
        $(this).removeClass("mic-post active").addClass("mr-20");
        $(".seggrouptitwrp").removeClass("med-hide");
    }
});

$("#ui_existingdatabase").click(() => {
    SegmentBuilderUtil.allowSaveBtn();
    AppendDays(true);
});

$("#ui_nowonwards").click(() => {
    SegmentBuilderUtil.allowSaveBtn();
    AppendDays(false);
});

function AppendDays(IsExisitingDatabase) {
    $("#ui_selectdays").empty();
    if (IsExisitingDatabase) {
        for (let i = 1; i <= 30; i++) {
            $("#ui_selectdays").append(`<option class="text-color-queued" value="${i}">Last ${i} Day</option>`);
        }
    } else {
        for (let i = 1; i <= 7; i++) {
            $("#ui_selectdays").append(`<option class="text-color-queued" value="${i}">Last ${i} Day</option>`);
        }
    }
}

function BindSearch() {
    $('.addCampName').select2({
        placeholder: 'This is my placeholder',
        minimumResultsForSearch: '',
        dropdownAutoWidth: false,
        containerCssClass: 'dropdownactiv'
    });
}

$("#startdate").datepicker({
    changeMonth: true,
    changeYear: true,
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: false,
});
$("#enddate").datepicker({
    changeMonth: true,
    changeYear: true,
    prevText: "click for previous months",
    nextText: "click for next months",
    showOtherMonths: true,
    selectOtherMonths: true,
});