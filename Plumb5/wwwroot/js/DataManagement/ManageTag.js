var PlumbUserId = $("#hdn_UserId").val();
var AccountId = $("#hdn_AdsId").val();
var TagId = ""; var DsId = 0;
var clickPreview = false;
var SavetagClick = false;
var blocksavetag = false;

var chkArray = new Array();
var chkTblName = new Array();
var Tbl1ColArr = new Array();
var Tbl2ColArr = new Array();
var Tbl3ColArr = new Array();
var Tbl4ColArr = new Array();

var specialKeys = new Array();
specialKeys.push(8); //Backspace
specialKeys.push(9); //Tab
specialKeys.push(46); //Delete
specialKeys.push(36); //Home
specialKeys.push(35); //End
specialKeys.push(37); //Left
specialKeys.push(39); //Right
function IsAlphaNumeric(e) {
    var keyCode = e.keyCode == 0 ? e.charCode : e.keyCode;
    var ret = ((keyCode >= 48 && keyCode <= 57) || (keyCode >= 65 && keyCode <= 90) || (keyCode >= 97 && keyCode <= 122) || (specialKeys.indexOf(e.keyCode) != -1 && e.charCode != e.keyCode));
    return ret;
}

$(document).ready(function () {
    TagId = urlParam('TagId');
    if (TagId == 0) {
        BindDataSource();
    }
    else {
      
        Edit();
    }
});

function verify(chk) {
    if (chk == 1) {
        document.getElementById("RdbCount").checked = false;
       

        var ddbvalue = $('#ddldatasource').val();
        if (ddbvalue == 0) {
            GetData()
        }

     
    }
    else {

      
        document.getElementById("RdbMap").checked = false;
        var ddbvalue = $('#ddldatasource').val();
        if(ddbvalue==0)
            {
            GetData()
        }
    }
}

//Bind Data Source Name
function BindDataSource() {
   
    $("#ddldatasource").empty();
    $("#dvLoading").show();
    $.ajax({
        url: "/DataImport/BindDatatSource",
        type: 'POST',
        async: false,
        data: "{'AccountId':" + AccountId + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
           
            if (response.Table.length > 0) {
                var DefaultOption = document.createElement('option');
                DefaultOption.value = "0";
                DefaultOption.text = "Select DataSource";
                document.getElementById("ddldatasource").options.add(DefaultOption);
                $.each(response.Table, function () {
                    var opt = document.createElement('option');
                    //if (this.Id == 1 || this.Id == 2 || this.DataSourceName == "Plumb") {
                    // }
                    if (this.Id == 1)
                    {

                    }
                    else {
                        opt.value = this.Id;
                        opt.text = this.DataSourceName;
                        document.getElementById("ddldatasource").options.add(opt);
                    }
                });
                DsId = response.Table[2].Id
                $("#dvLoading").hide();
            }
            else {
                var DefaultOption = document.createElement('option');
                DefaultOption.value = "0";
                DefaultOption.text = "Select DataSource";
                document.getElementById("ddldatasource").options.add(DefaultOption);
                $("#dvLoading").hide();
            }
        },
        error: function (objxmlRequest, textStatus, errorThrown) {
        }
    });
}


//Bind Table Names
function BindTableNames() {
  
    var clickPreview = false;
    window.scrollTo(0, 0);
    $("#ChkTblNames").empty();
    var value1 = 10;
    var DSName = $('#ddldatasource option:selected').text();
    var DSId = $('#ddldatasource option:selected').attr('value');
    if (DSId == 0) {
       
        $("#divTableNames").css('display', 'none');
        $("#DvTables").css('display', 'none');
        $("#DvPreview").css('display', 'none');
       // ShowErrorMessage("Please select the Data Source !!!");
       
    }
    else {
       
        $("#dvLoading").show();
        var chkId = 0;
        $.ajax({
            url: "/Tagging/BindTableNames",
            type: 'POST',
            async: false,
            data: "{'AccountId':" + AccountId + ",'DataSourceId':'" + DSId + "','RdBtn':'" + value1 + "'}",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                
                var BindTable = "";
                if (response == null) {
                   
                    $("#dvLoading").hide();
                    ShowErrorMessage("Files do not Exist for this Data Source.");
                }
                else {
                    //|| response.Table3.length > 0
                    if (response.Table.length > 0 || response.Table2.length > 0 ) {
                        $("#divTableNames").css('display', 'block');
                       // if (response.Table.length > 0) {
                           
                            $.each(response.Table, function () {
                                chkId = chkId + 1;
                                var tblname = this.FileTitle;
                                var ExcelFileName = "";// this.FileName;
                                if (this.DataSourceId == 3) {
                                    ExcelFileName = this.DataSourceName + "/" + this.FileName
                                }
                                else {
                                    ExcelFileName = this.FileName;
                                }

                                BindTable += "<div style='height: 15px;padding:8px 3px;' class='itemStyle'>";
                                BindTable += "<div style='float: left; width: 100%;'><input class='Tables' type=\"checkbox\" name=\"" + tblname + "\" id=\"ChkTbl" + chkId + "\" value=\"" + ExcelFileName + "\" />" + tblname + "</div></div>";
                                // createCheckbox(chkId, tblname, ExcelFileName);
                            });
                       // }
                        //*Newly added 29/07/2016*
                       
                      
                        //if (DSName == "SalesForce")
                        //{
                        //    $.each(response.Table3, function () {

                        //        chkId = chkId + 1;
                        //        BindTable += "<div style='height: 15px;padding:8px 3px;' class='itemStyle'>";
                        //        BindTable += "<div style='float: left; width: 100%;'><input class='Tables' type=\"checkbox\" name=\"" + this.TableName + "\" id=\"ChkTbl" + chkId + "\" value=\"" + this.TableName + "$$" + "\" />" + this.TableName + "<span id='TblNotification' class='LeadNotificationAlert' style=\"Position:relative;\">$$</span></div></div>";
                        //    });
                        //}
                        //else if (DSName = "Microsoftcrm")
                        //{
                        //    $.each(response.Table3, function () {

                        //        chkId = chkId + 1;
                        //        BindTable += "<div style='height: 15px;padding:8px 3px;' class='itemStyle'>";
                        //        BindTable += "<div style='float: left; width: 100%;'><input class='Tables' type=\"checkbox\" name=\"" + this.TableName + "\" id=\"ChkTbl" + chkId + "\" value=\"" + this.TableName + "@@" + "\" />" + this.TableName + "<span id='TblNotification' class='LeadNotificationAlert' style=\"Position:relative;\">@@</span></div></div>";
                        //    });
                        //}
                            //*Newly added 29/07/2016*
                        //else
                        //    {
                            $.each(response.Table2, function () {
                             
                            chkId = chkId + 1;
                            BindTable += "<div style='height: 15px;padding:8px 3px;' class='itemStyle'>";
                            if (this.AppId == 5)
                            {
                                BindTable += "<div style='float: left; width: 100%;'><input class='Tables' type=\"checkbox\" name=\"" + this.TableName + "\" id=\"ChkTbl" + chkId + "\" value=\"" + this.TableName + "$$" + "\" />" + this.TableName + "<span id='TblNotification' class='LeadNotificationAlert' style=\"Position:relative;\">$</span></div></div>";
                            }
                            else if(this.AppId==6)
                            {
                                BindTable += "<div style='float: left; width: 100%;'><input class='Tables' type=\"checkbox\" name=\"" + this.TableName + "\" id=\"ChkTbl" + chkId + "\" value=\"" + this.TableName + "@@" + "\" />" + this.TableName + "<span id='TblNotification' class='LeadNotificationAlert' style=\"Position:relative;\">@@</span></div></div>";
                            }
                            else if (this.AppId == 7) {
                                BindTable += "<div style='float: left; width: 100%;'><input class='Tables' type=\"checkbox\" name=\"" + this.TableName + "\" id=\"ChkTbl" + chkId + "\" value=\"" + this.TableName + "^^" + "\" />" + this.TableName + "<span id='TblNotification' class='LeadNotificationAlert' style=\"Position:relative;\">^^</span></div></div>";
                            }
                            else if (this.AppId == 8) {
                                BindTable += "<div style='float: left; width: 100%;'><input class='Tables' type=\"checkbox\" name=\"" + this.TableName + "\" id=\"ChkTbl" + chkId + "\" value=\"" + this.TableName + "***" + "\" />" + this.TableName + "<span id='TblNotification' class='LeadNotificationAlert' style=\"Position:relative;\">***</span></div></div>";
                            }
                            else
                                {
                                BindTable += "<div style='float: left; width: 100%;'><input class='Tables' type=\"checkbox\" name=\"" + this.TableName + "\" id=\"ChkTbl" + chkId + "\" value=\"" + this.TableName + "\" />" + this.TableName + "<span id='TblNotification' class='LeadNotificationAlert' style=\"Position:relative;\">*</span></div></div>";
                                }
                        });
                       // }
                       
                        $("#dvLoading").hide();
                        $("#ChkTblNames").append(BindTable);
                        $("div#ChkTblNames").niceScroll({ cursorcolor: "#CCCCCC", cursorwidth: "8px" }).resize();
                    }
                    else {
                        $("#dvLoading").hide();
                        ShowErrorMessage("Files do not Exist for this Data Source.");
                    }
                }

            },
            error: function (objxmlRequest) {
            }

        });
    }
}

function createCheckbox(chkId, tblname, ExcelName) {
    $('<input/>', {
        id: "ChkTbl" + chkId,
        type: 'Checkbox',
        value: ExcelName,
        name: tblname,
        class: 'Tables'
    }).appendTo('#ChkTblNames');

    $("#ChkTbl" + chkId).after("<span>" + tblname + "</span><br/>");

    //$('<label/>', {
    //    for: "ChkTbl" + chkId,
    //    text: tblname
    //}).appendTo("#ChkTbl" + chkId);
}

function GetData() {
    //setTimeout(function () { window.scrollTo(0, document.body.scrollHeight); }, 1)
    setTimeout(function () { window.scrollTo(0, 0); }, 50);
    // $("#DvTables").empty();
    document.getElementById("dvTbl1").innerHTML = "";
    document.getElementById("dvTbl2").innerHTML = "";
    document.getElementById("dvTbl3").innerHTML = "";
    document.getElementById("dvTbl4").innerHTML = "";
    document.getElementById("lblTbl1").innerHTML = "";
    document.getElementById("lblTbl2").innerHTML = "";
    document.getElementById("lblTbl3").innerHTML = "";
    document.getElementById("lblTbl4").innerHTML = "";
    $("#dvLoading").show();
    chkArray = [];
    chkTblName = [];
    if ($("input[class='Tables']:checked")) {
        $("input[class='Tables']:checked").each(function () {
            clickPreview = false;
            chkArray.push($(this).val());
            chkTblName.push($(this).attr("name"));
           
        });
    }
    if ($("#ddldatasource").val() == 0) {
        $("#dvLoading").hide();
        ShowErrorMessage("Please select the Data Source name.");
    }
    else if (chkArray.length == 0) {
        $("#dvLoading").hide();
        ShowErrorMessage("Please select the File.");
    }
    else if (chkArray.length == 1) {
        $("#dvLoading").hide();
        ShowErrorMessage("Minimum number of files to be selected is  2.");
    }  
    else if (chkArray.length >= 5) {
        $("#dvLoading").hide();
        ShowErrorMessage("Maximum number of files that can be selected is 4.");
    }
    else {
        for (var i = 0; i < chkArray.length; i++) {
            BindColumns(chkArray[i], chkTblName[i], i + 1);
            // BindCountColumns(chkArray[i], ChkTables[i], i + 1);
        }
    }
    $("#HdnTblChkCount").val(chkArray.length);

    $("div#dvTbl1").niceScroll({ cursorcolor: "#CCCCCC", cursorwidth: "8px" }).resize();
    $("div#dvTbl2").niceScroll({ cursorcolor: "#CCCCCC", cursorwidth: "8px" }).resize();
    $("div#dvTbl3").niceScroll({ cursorcolor: "#CCCCCC", cursorwidth: "8px" }).resize();
    $("div#dvTbl4").niceScroll({ cursorcolor: "#CCCCCC", cursorwidth: "8px" }).resize();
}

function BindColumns(FileName, TableName, TblPos) {
   
    document.getElementById("dvTbl" + TblPos + "").innerHTML = "";
    // document.getElementById("dvTbl2").innerHTML = "";
    // document.getElementById("dvTbl3").innerHTML = "";
    // document.getElementById("dvTbl4").innerHTML = "";
    $("#Hdtbl" + TblPos + "").val("");
    //   $("#Hdtbl2").val("");
    //   $("#Hdtbl3").val("");
    //  $("#Hdtbl4").val("");
    var dsname = $("#ddldatasource :selected").text();
    // top: 495px
    // margin-left: 15%
    //margin-left: 15%;  top: 495px;
  

    var colorpallete1 = "<div id='Divcolorone' style='width:20px;height:200px;float:right;position:absolute;display:none;' onclick='checkS()'>" +
       "<div class='sp-container sp-light sp-input-disabled sp-palette-only sp-initial-disabled'" +
   " style=' position: relative; '>" +
  " <div class='sp-palette-container'>" +
      " <div class='sp-palette sp-thumb sp-cf'>" +
           "<div class='sp-cf sp-palette-row sp-palette-row-0'>" +
               "<table>" +
                  " <tbody>" +
                      " <tr>" +
                          " <td>" +
                             "  <span onclick=\"ColorAppend('red'); return false;\" title='red' style='background-color: Red;'" +
                                 "    class='sp-thumb-light'></span>" +
                          " </td>" +
                       "</tr>" +
                  " </tbody>" +
               "</table>" +
               "<table>" +
                 "  <tbody>" +
                    "   <tr>" +
                         "  <td>" +
                            "   <span onclick=\"ColorAppend('blue'); return false;\" title='blue' style='background-color: blue;'" +
                               "      class='sp-thumb-light'></span>" +
                           "</td>" +
                       "</tr>" +
                   "</tbody>" +
               "</table>" +
           "</div>" +
          " <div class='sp-cf sp-palette-row sp-palette-row-selection'>" +
              " <table>" +
                  " <tbody>" +
                       "<tr>" +
                         "  <td>" +
                             "  <span onclick=\"ColorAppend('black'); return false;\" title='black' style='background-color: black;'" +
                                   "  class='sp-thumb-light'></span>" +
                           "</td>" +
                    "   </tr>" +
                  " </tbody>" +
              " </table>" +
           "</div>" +
          " <div class='sp-cf sp-palette-row sp-palette-row-selection'>" +
             "  <table>" +
                 "  <tbody>" +
                     "  <tr>" +
                          " <td>" +
                              " <span onclick=\"ColorAppend('green'); return false;\" title='green' style='background-color: green;'" +
                                  "   class='sp-thumb-light'></span>" +
                           "</td>" +
                     "  </tr>" +
                   "</tbody>" +
              " </table>" +
           "</div>" +
          " <div class='sp-cf sp-palette-row sp-palette-row-selection'>" +
              " <table>" +
                  " <tbody>" +
                    "   <tr>" +
                        "   <td>" +
                            "   <span onclick=\"ColorAppend('yellow'); return false;\" title='yellow' style='background-color: yellow;'" +
                                 "    class='sp-thumb-light'></span>" +
                        "   </td>" +
                       "</tr>" +
                 "  </tbody>" +
              " </table>" +
         "  </div>" +
           "<div class='sp-cf sp-palette-row sp-palette-row-selection'>" +
               "<table>" +
                   "<tbody>" +
                       "<tr>" +
                          " <td>" +
                               "<span onclick=\"ColorAppend('white'); return false;\" title='white' style='background-color: white;'" +
                                    " class='sp-thumb-light'></span>" +
                         "  </td>" +
                       "</tr>" +
                   "</tbody>" +
               "</table>" +
          " </div>" +
      " </div>" +
   "</div>" +
"</div>" +
"</div>";
    var colorpallete2 = "<div id='DivcolorTwo' style='width:20px;height:200px;float:right;position:absolute;display:none;' onclick='checkS()'>" +
      "<div class='sp-container sp-light sp-input-disabled sp-palette-only sp-initial-disabled'" +
  " style=' position: relative; '>" +
 " <div class='sp-palette-container'>" +
     " <div class='sp-palette sp-thumb sp-cf'>" +
          "<div class='sp-cf sp-palette-row sp-palette-row-0'>" +
              "<table>" +
                 " <tbody>" +
                     " <tr>" +
                         " <td>" +
                            "  <span onclick=\"ColorAppend('red'); return false;\" title='red' style='background-color: Red;'" +
                                "    class='sp-thumb-light'></span>" +
                         " </td>" +
                      "</tr>" +
                 " </tbody>" +
              "</table>" +
              "<table>" +
                "  <tbody>" +
                   "   <tr>" +
                        "  <td>" +
                           "   <span onclick=\"ColorAppend('blue'); return false;\" title='blue' style='background-color: blue;'" +
                              "      class='sp-thumb-light'></span>" +
                          "</td>" +
                      "</tr>" +
                  "</tbody>" +
              "</table>" +
          "</div>" +
         " <div class='sp-cf sp-palette-row sp-palette-row-selection'>" +
             " <table>" +
                 " <tbody>" +
                      "<tr>" +
                        "  <td>" +
                            "  <span onclick=\"ColorAppend('black'); return false;\" title='black' style='background-color: black;'" +
                                  "  class='sp-thumb-light'></span>" +
                          "</td>" +
                   "   </tr>" +
                 " </tbody>" +
             " </table>" +
          "</div>" +
         " <div class='sp-cf sp-palette-row sp-palette-row-selection'>" +
            "  <table>" +
                "  <tbody>" +
                    "  <tr>" +
                         " <td>" +
                             " <span onclick=\"ColorAppend('green'); return false;\" title='green' style='background-color: green;'" +
                                 "   class='sp-thumb-light'></span>" +
                          "</td>" +
                    "  </tr>" +
                  "</tbody>" +
             " </table>" +
          "</div>" +
         " <div class='sp-cf sp-palette-row sp-palette-row-selection'>" +
             " <table>" +
                 " <tbody>" +
                   "   <tr>" +
                       "   <td>" +
                           "   <span onclick=\"ColorAppend('yellow'); return false;\" title='yellow' style='background-color: yellow;'" +
                                "    class='sp-thumb-light'></span>" +
                       "   </td>" +
                      "</tr>" +
                "  </tbody>" +
             " </table>" +
        "  </div>" +
          "<div class='sp-cf sp-palette-row sp-palette-row-selection'>" +
              "<table>" +
                  "<tbody>" +
                      "<tr>" +
                         " <td>" +
                              "<span onclick=\"ColorAppend('white'); return false;\" title='white' style='background-color: white;'" +
                                   " class='sp-thumb-light'></span>" +
                        "  </td>" +
                      "</tr>" +
                  "</tbody>" +
              "</table>" +
         " </div>" +
     " </div>" +
  "</div>" +
"</div>" +
"</div>";
    var colorpallete3 = "<div id='DivcolorThree' style=' width:20px;height:200px;float:right;position:absolute;display:none;' onclick='checkS()'>" +
       "<div class='sp-container sp-light sp-input-disabled sp-palette-only sp-initial-disabled'" +
   " style=' position: relative; '>" +
  " <div class='sp-palette-container'>" +
      " <div class='sp-palette sp-thumb sp-cf'>" +
           "<div class='sp-cf sp-palette-row sp-palette-row-0'>" +
               "<table>" +
                  " <tbody>" +
                      " <tr>" +
                          " <td>" +
                             "  <span onclick=\"ColorAppend('red'); return false;\" title='red' style='background-color: Red;'" +
                                 "    class='sp-thumb-light'></span>" +
                          " </td>" +
                       "</tr>" +
                  " </tbody>" +
               "</table>" +
               "<table>" +
                 "  <tbody>" +
                    "   <tr>" +
                         "  <td>" +
                            "   <span onclick=\"ColorAppend('blue'); return false;\" title='blue' style='background-color: blue;'" +
                               "      class='sp-thumb-light'></span>" +
                           "</td>" +
                       "</tr>" +
                   "</tbody>" +
               "</table>" +
           "</div>" +
          " <div class='sp-cf sp-palette-row sp-palette-row-selection'>" +
              " <table>" +
                  " <tbody>" +
                       "<tr>" +
                         "  <td>" +
                             "  <span onclick=\"ColorAppend('black'); return false;\" title='black' style='background-color: black;'" +
                                   "  class='sp-thumb-light'></span>" +
                           "</td>" +
                    "   </tr>" +
                  " </tbody>" +
              " </table>" +
           "</div>" +
          " <div class='sp-cf sp-palette-row sp-palette-row-selection'>" +
             "  <table>" +
                 "  <tbody>" +
                     "  <tr>" +
                          " <td>" +
                              " <span onclick=\"ColorAppend('green'); return false;\" title='green' style='background-color: green;'" +
                                  "   class='sp-thumb-light'></span>" +
                           "</td>" +
                     "  </tr>" +
                   "</tbody>" +
              " </table>" +
           "</div>" +
          " <div class='sp-cf sp-palette-row sp-palette-row-selection'>" +
              " <table>" +
                  " <tbody>" +
                    "   <tr>" +
                        "   <td>" +
                            "   <span onclick=\"ColorAppend('yellow'); return false;\" title='yellow' style='background-color: yellow;'" +
                                 "    class='sp-thumb-light'></span>" +
                        "   </td>" +
                       "</tr>" +
                 "  </tbody>" +
              " </table>" +
         "  </div>" +
           "<div class='sp-cf sp-palette-row sp-palette-row-selection'>" +
               "<table>" +
                   "<tbody>" +
                       "<tr>" +
                          " <td>" +
                               "<span onclick=\"ColorAppend('white'); return false;\" title='white' style='background-color: white;'" +
                                    " class='sp-thumb-light'></span>" +
                         "  </td>" +
                       "</tr>" +
                   "</tbody>" +
               "</table>" +
          " </div>" +
      " </div>" +
   "</div>" +
"</div>" +
"</div>";
    var colorpallete4 = "<div id='DivcolorFour' style=' width:20px;height:200px;float:right;position:absolute;display:none;' onclick='checkS()'>" +
       "<div class='sp-container sp-light sp-input-disabled sp-palette-only sp-initial-disabled'" +
   " style=' position: relative; '>" +
  " <div class='sp-palette-container'>" +
      " <div class='sp-palette sp-thumb sp-cf'>" +
           "<div class='sp-cf sp-palette-row sp-palette-row-0'>" +
               "<table>" +
                  " <tbody>" +
                      " <tr>" +
                          " <td>" +
                             "  <span onclick=\"ColorAppend('red'); return false;\" title='red' style='background-color: Red;'" +
                                 "    class='sp-thumb-light'></span>" +
                          " </td>" +
                       "</tr>" +
                  " </tbody>" +
               "</table>" +
               "<table>" +
                 "  <tbody>" +
                    "   <tr>" +
                         "  <td>" +
                            "   <span onclick=\"ColorAppend('blue'); return false;\" title='blue' style='background-color: blue;'" +
                               "      class='sp-thumb-light'></span>" +
                           "</td>" +
                       "</tr>" +
                   "</tbody>" +
               "</table>" +
           "</div>" +
          " <div class='sp-cf sp-palette-row sp-palette-row-selection'>" +
              " <table>" +
                  " <tbody>" +
                       "<tr>" +
                         "  <td>" +
                             "  <span onclick=\"ColorAppend('black'); return false;\" title='black' style='background-color: black;'" +
                                   "  class='sp-thumb-light'></span>" +
                           "</td>" +
                    "   </tr>" +
                  " </tbody>" +
              " </table>" +
           "</div>" +
          " <div class='sp-cf sp-palette-row sp-palette-row-selection'>" +
             "  <table>" +
                 "  <tbody>" +
                     "  <tr>" +
                          " <td>" +
                              " <span onclick=\"ColorAppend('green'); return false;\" title='green' style='background-color: green;'" +
                                  "   class='sp-thumb-light'></span>" +
                           "</td>" +
                     "  </tr>" +
                   "</tbody>" +
              " </table>" +
           "</div>" +
          " <div class='sp-cf sp-palette-row sp-palette-row-selection'>" +
              " <table>" +
                  " <tbody>" +
                    "   <tr>" +
                        "   <td>" +
                            "   <span onclick=\"ColorAppend('yellow'); return false;\" title='yellow' style='background-color: yellow;'" +
                                 "    class='sp-thumb-light'></span>" +
                        "   </td>" +
                       "</tr>" +
                 "  </tbody>" +
              " </table>" +
         "  </div>" +
           "<div class='sp-cf sp-palette-row sp-palette-row-selection'>" +
               "<table>" +
                   "<tbody>" +
                       "<tr>" +
                          " <td>" +
                               "<span onclick=\"ColorAppend('white'); return false;\" title='white' style='background-color: white;'" +
                                    " class='sp-thumb-light'></span>" +
                         "  </td>" +
                       "</tr>" +
                   "</tbody>" +
               "</table>" +
          " </div>" +
      " </div>" +
   "</div>" +
"</div>" +
"</div>";

  
    $.ajax({
        url: "/Tagging/BindColumnNames",
        type: 'Post',
        async: false,
        data: "{'ExcelName':'" + FileName + "','DataSourceName':'" + dsname + "','AccountId': '" + $("#hdn_AdsId").val() + "'}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
           
            var BindTable = "";
            var HdnTbl = "";
            var ColorpallateDiv = "";
            if (response == null) {
               
                $("#dvLoading").hide();
                ShowErrorMessage("Sorry ,The file is not found.");
                // $(".plumb-frm").hide();
               
            }
            else {
                //$(".plumb-frm").show();
              
                var selectedtablename = [];
                $("#ChkTblNames input[type='checkbox']:checked").each(function () {
                    selectedtablename.push(this.value);
                });
               
               if (selectedtablename.length > 2 && response.ID == "31")
                { 
                   ShowErrorMessage("Maximum number of online files that can be selected is 2.");
                   $("#DvTables").css('display', 'none');
                   $("#DvPreview").css('display', 'none');
                    $("#dvLoading").hide();
                   
                }
                else{
             
              
                //if (jQuery.inArray("Contact", selectedtablename) !== -1)

                if (response.Result.Table.length > 0) {

                    var RdbId = $("input[type=radio]:checked").attr('id');
                   
                    
                    if (RdbId == "RdbMap") {
                        var loops = 0;
                     
                        var kcol = response.Result.Table[0];
                       
                        if (response.ID == "31") {
                           
                            // for (var a in kcol) {
                           

                                $.each(response.Result.Table, function () {

                                    var colname1 = this.COLUMN_NAME;
                                    var colname1contact = this.COLUMN_NAMEMAP;
                                    var tblname1 = TableName;
                                    
                                    //  var colname1 = a;
                                    //var tblname1 = TableName;
                                    if (colname1 == "Id") {
                                    } else {

                                        if (tblname1 == "Contact") {
                                            loops = loops + 1;
                                            BindTable += "<div style='height: 15px;' class='itemStyle'>";
                                            BindTable += "<div style='float: left; width: 90%;'><input type=\"checkbox\" name=\"chk_group" + TblPos + "\" id=\"rad" + 1 + "\" value=\"" + colname1contact + TblPos + "\" />" + colname1 + "</div>";
                                            BindTable += "<div style='float: left; width: 10%;'><a href=\"#\" onclick=\"changeColor1('" + tblname1 + "~-" + colname1 + "~!" + loops + "','tbl" + TblPos + "'); return false;\">";
                                            BindTable += "<input style='width: 13px;height: 6px; float: right;' class='colorchange' type='text'  id='" + tblname1 + "~-" + colname1 + "~!" + loops + "' /></a></div>";
                                            HdnTbl += tblname1 + "~-" + colname1 + "~!" + loops + "" + ",";
                                            BindTable += "</div>";
                                        }
                                        else {
                                            loops = loops + 1;
                                            BindTable += "<div style='height: 15px;' class='itemStyle'>";
                                            BindTable += "<div style='float: left; width: 90%;'><input type=\"checkbox\" name=\"chk_group" + TblPos + "\" id=\"rad" + 1 + "\" value=\"" + colname1 + TblPos + "\" />" + colname1 + "</div>";
                                            BindTable += "<div style='float: left; width: 10%;'><a href=\"#\" onclick=\"changeColor1('" + tblname1 + "~-" + colname1 + "~!" + loops + "','tbl" + TblPos + "'); return false;\">";
                                            BindTable += "<input style='width: 13px;height: 6px; float: right;' class='colorchange' type='text'  id='" + tblname1 + "~-" + colname1 + "~!" + loops + "' /></a></div>";
                                            HdnTbl += tblname1 + "~-" + colname1 + "~!" + loops + "" + ",";
                                            BindTable += "</div>";
                                        }

                                    }
                                });
                           
                            // }
                            
                        }
                        
                        else {
                            $.each(response.Result.Table, function () {
                              
                                var colname1 = this.COLUMN_NAME;
                                var tblname1 = TableName;
                              
                                if (colname1 == "Id") {
                                } else {
                                    loops = loops + 1;
                                    BindTable += "<div style='height: 15px;' class='itemStyle'>";
                                    BindTable += "<div style='float: left; width: 90%;'><input type=\"checkbox\" name=\"chk_group" + TblPos + "\" id=\"rad" + 1 + "\" value=\"" + colname1 + TblPos + "\" />" + colname1 + "</div>";
                                    BindTable += "<div style='float: left; width: 10%;'><a href=\"#\" onclick=\"changeColor1('" + tblname1 + "~-" + colname1 + "~!" + loops + "','tbl" + TblPos + "'); return false;\">";
                                    BindTable += "<input style='width: 13px;height: 6px; float: right;' class='colorchange' type='text'  id='" + tblname1 + "~-" + colname1 + "~!" + loops + "' /></a></div>";
                                    HdnTbl += tblname1 + "~-" + colname1 + "~!" + loops + "" + ",";
                                    BindTable += "</div>";
                                }
                            });
                        }



                         
                  
                        ////var colname1 = a;
                        ////var tblname1 = TableName;
                        ////if (colname1 == "Id") {
                        ////} else {
                        ////    loops = loops + 1;
                        ////    BindTable += "<div style='height: 15px;' class='itemStyle'>";
                        ////    BindTable += "<div style='float: left; width: 90%;'><input type=\"checkbox\" name=\"chk_group" + TblPos + "\" id=\"rad" + 1 + "\" value=\"" + colname1 + TblPos + "\" />" + colname1 + "</div>";
                        ////    BindTable += "<div style='float: left; width: 10%;'><a href=\"#\" onclick=\"changeColor1('" + tblname1 + "~-" + colname1 + "~!" + loops + "','tbl" + TblPos + "'); return false;\">";
                        ////    BindTable += "<input style='width: 13px;height: 6px; float: right;' class='colorchange' type='text'  id='" + tblname1 + "~-" + colname1 + "~!" + loops + "' /></a></div>";
                        ////    HdnTbl += tblname1 + "~-" + colname1 + "~!" + loops + "" + ",";
                        ////    BindTable += "</div>";
                        ////}
                        //  }
                        $("#lblTbl" + TblPos + "").html(TableName);
                        $("#Hdtbl" + TblPos + "").val(HdnTbl);
                        $("#dvTbl" + TblPos + "").append(BindTable);
                    }
                    else if (RdbId == "RdbCount") {
                       
                        var loops = 0;
                        var kcol = response.Result.Table[0];
                        if (response.ID == "31") {
                            // for (var a in kcol) {



                            $.each(response.Result.Table, function () { 
                                //var kcol = response.Result.Table;
                                // var colname1 = a;
                                /*Newlyadded*/
                               
                                var colname1 = this.COLUMN_NAME;
                               
                                var a = colname1;
                                /*Newlyadded*/
                                
                                var tblname1 = TableName;
                                if (colname1 == "Id") {
                                } else {
                                    loops = loops + 1;
                                    BindTable += "<div style='height: 15px;' class='itemStyle'>";
                                    BindTable += "<div style='float: left; width: 90%;'>" + a + "</div><div style='float: left; width: 10%;'><input type='text' style='width:13px; height:6px; float:right;' onclick='changeColor(this.id,\"Tbl" + TblPos + "\")'  id='~" + a + "~!" + tblname1 + "-" + loops + "' /></div>";
                                    HdnTbl += "~" + a + "~!" + tblname1 + "-" + loops + "" + ",";
                                    BindTable += "</div>";
                                }
                                //  }
                            });
                        }
                        else {

                            $.each(response.Result.Table, function () {

                                var colname1 = this.COLUMN_NAME;

                                var a = colname1;
                                var tblname1 = TableName;

                                if (colname1 == "Id") {

                                } else {

                                    loops = loops + 1;
                                    BindTable += "<div style='height: 15px;' class='itemStyle'>";
                                    BindTable += "<div style='float: left; width: 90%;'>" + a + "</div><div style='float: left; width: 10%;'><input type='text' style='width:13px; height:6px; float:right;' onclick='changeColor(this.id,\"Tbl" + TblPos + "\")'  id='~" + a + "~!" + tblname1 + "-" + loops + "' /></div>";
                                    HdnTbl += "~" + a + "~!" + tblname1 + "-" + loops + "" + ",";
                                    BindTable += "</div>";

                                }
                            });
                        }
                        
                        $("#Hdtbl" + TblPos + "").val(HdnTbl);

                        if (TblPos == "1") {
                            ColorpallateDiv = colorpallete1;
                        }
                        else if (TblPos == "2") {
                            ColorpallateDiv = colorpallete2;
                        }
                        else if (TblPos == "3") {
                            ColorpallateDiv = colorpallete3;
                        }
                        else if (TblPos == "4") {
                            ColorpallateDiv = colorpallete4;
                        }
                        $("#lblTbl" + TblPos + "").html(TableName);
                        $("#dvTbl" + TblPos + "").append(BindTable + ColorpallateDiv);
                    }
                    $("#dvLoading").hide();
                    $("#DvTables").css('display', 'block');
                    $("#DvPreview").css('display', 'block');

                    if (TagId == 0) {


                        $('#Divcolorone,#DivcolorTwo,#DivcolorThree,#DivcolorFour').css({ "margin-left": "75%", "top": "7px" });

                    }
                    else {


                        //$("#thisdiv").niceScroll({ horizrailenabled: false });
                        //$("#thisdiv1").niceScroll({ horizrailenabled: false });
                        //$("#thisdiv2").niceScroll({ horizrailenabled: false });
                        //$("#thisdiv3").niceScroll({ horizrailenabled: false });
                        //$("#ChkTblNames").niceScroll({ horizrailenabled: false });


                        $('#Divcolorone,#DivcolorTwo,#DivcolorThree,#DivcolorFour').css({ "margin-left": "15%", "top": "495px" });
                      
                    }
                }
            }
            }
        },
        error: function (objxmlRequest) {
            $("#dvLoading").hide();
            window.console.log(objxmlRequest.responseText);
        }
    });
}

function Edit() {
  
    $("#dvLoading").show();
    $("#HdnQry").val("");
    $.ajax({
        url: "/Tagging/TaggingDeatilsById",
        type: 'POST',
        async: false,
        data: "{'AccountId':" + $("#hdn_AdsId").val() + ",'TagId': " + TagId + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (response == null) {
               
                $("#dvLoading").hide();
                ShowErrorMessage("Sorry, Details not found.");
            }
            else {
                if (response.Table.length > 0) {
                    $("#HdnQry").val(response.Table[0].TaggedFile);
                    $("#TxtTagTitle").val(response.Table[0].TagTitle);
                    //commented 15-11-2016
                    // document.getElementById("TxtTagTitle").setAttribute('readonly', 'readonly');
                    //commented 15-11-2016
                    html = "<option value='" + response.Table[0].DataSourceId + "'>" + response.Table[0].DataSourceName + "</option>";
                    $("#ddldatasource").append(html);
                    if (response.Table[0].TagType == true) {
                        $("#RdbMap").attr("checked", "checked");
                        $("#RdbCount").attr('disabled', 'disabled');//RdbCount
                    }
                    else {  
                        $("#RdbMap").prop('checked', false);
                        $("#RdbCount").attr("checked", "checked");
                        $("#RdbMap").attr('disabled', 'disabled');
                    }
                    BindTableNames();
                   
                   CheckSeletedFile(response.Table[0].FileTitle);
                   GetData();
                    var FileTitle = response.Table[0].FileTitle.split(',');
                    if (response.Table[0].TagType == true) {
                        for (var i = 1; i <= FileTitle.length; i++) {
                            var UniqId = "response.Table[0].UniqueIdFile" + i;
                            var Columns = "response.Table[0].File" + i + "Values";
                            changeColor1(eval(UniqId), 'tbl' + i + '')
                          
                        }
                    }
                    for (var j = 1; j <= FileTitle.length; j++) {
                        var Columns = "response.Table[0].File" + j + "Values";
                        if (response.Table[0].TagType == true) {
                            CheckSelectedColumns(eval(Columns), j);
                        } else {
                            CheckSelectedColors(eval(Columns), "Tbl" + j);
                        }
                    }
                }
            }
            $("#BtnsaveTagging").val("Update Tagging");
            $("#dvLoading").hide();
        },
        error: function (objxmlRequest) {
            $("#dvLoading").hide();
            window.console.log(objxmlRequest.responseText);
        }
    });
}
function CheckSeletedFile(FileTitle) {
  
    var fileTtl = FileTitle.split(',');
    for (var i = 0; i < fileTtl.length; i++) {
        $("input[name='" + fileTtl[i] + "'").attr('checked', true);
    }
}
function CheckSelectedColumns(ColumnValues, Tbl) {
 
    ColumnValues = ColumnValues.substring(0, ColumnValues.length - 1);
    var Columns = ColumnValues.split(',');
    for (var i = 0; i < Columns.length; i++) {
        if (Columns[i].indexOf(Tbl) != -1) {
            $("input[Value='" + Columns[i] + "'").attr('checked', true);
        } else {
            $("input[Value='" + Columns[i] + Tbl + "'").attr('checked', true);
        }
    }
}
function CheckSelectedColors(ColumnValues, Tbl) {
    
    ColumnValues = ColumnValues.substring(0, ColumnValues.length - 1);
    var Columns = ColumnValues.split(',');
    for (var i = 0; i < Columns.length; i++) {
        var Colour = Columns[i];
        var color = Colour.substring(Colour.indexOf("!~!"));
        // var searchhref1 = searchhref.substring(searchhref.indexOf("!~!"));
        color = color.replace("!~!", "");
        var str = Columns[i];
        var Len = str.indexOf('!~!');
        var res = str.substring(0, Len);
        document.getElementById('Hidden1').value = res;
        document.getElementById('Hidden2').value = Tbl;
        ColorAppend(color);
    }
}


//Gridview Preview for both map and count Tagging
function GetMapStruct(list1, list2, list3, list4) {
    
   
    clickPreview = true;
    var FillCount = $("#HdnTblChkCount").val();
    document.getElementById("dvReport").innerHTML = "";
    //Tbl1ColArr.sort();
    //Tbl2ColArr.sort();
    RemoveUniqueIdFromArr(Tbl1ColArr, $("#HdnUniqId1").val())
    RemoveUniqueIdFromArr(Tbl2ColArr, $("#HdnUniqId2").val())
    //  Tbl1ColArr.sort();
    //  Tbl2ColArr.sort();
    $("#dvLoading").css("display", "block");
    $("#dvLoading").show();
    $("#dvLoading1").show();
    if (Tbl3ColArr.length == 0) {
        Tbl3ColArr.push("");
    }
    else {
        Tbl3ColArr.sort();
        RemoveUniqueIdFromArr(Tbl3ColArr, $("#HdnUniqId3").val())

    }
    if (Tbl4ColArr.length == 0) {
        Tbl4ColArr.push("");
    }
    else {
        Tbl4ColArr.sort();
        RemoveUniqueIdFromArr(Tbl4ColArr, $("#HdnUniqId4").val())

    }
    var dsname = $("#ddldatasource :selected").text();
    $.ajax({
        url: "/Tagging/GetMapStruct",
        type: 'Post',
        data: JSON.stringify({ 'TblCount': FillCount, 'ExcelNames': chkArray, 'DataSourceName': dsname, 'Tbl1ColArr': Tbl1ColArr, 'Tbl2ColArr': Tbl2ColArr, 'Tbl3ColArr': Tbl3ColArr, 'Tbl4ColArr': Tbl4ColArr, 'AccountId': $("#hdn_AdsId").val() }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async:false,
        beforeSend: function () {
            $("#dvLoading").show();

        },
        success: function (response) {
          
            var json_obj = $.parseJSON(response);//parse JSON
           
            if (response == 0)
            {
               
                $("#dvLoading").hide();
                $("#dvLoading1").hide();
                hideit();
                //sessionStorage.removeItem("TagcheckDm");
                //sessionStorage.setItem("tagsaveblock", 1);
                clickPreview = false;
                blocksavetag = true;
               
                ShowErrorMessage('Please select an additional column along with the common key column.')
                
            }
            else{
            if (response == null) {
                $("#dvLoading").hide();
                $("#dvLoading1").hide();
               // sessionStorage.removeItem("TagcheckDm");
                //sessionStorage.setItem("TagcheckDm", 1);
                clickPreview = false;
                blocksavetag = true;
               // sessionStorage.setItem("tagsaveblock", 1);
                hideit();
                ShowErrorMessage('Please Check the Unique Id for Tagging.')
            }
           
            else if (json_obj.Table.length > 0) {
               // sessionStorage.setItem("tagsaveblock", 0);
                var innerDivhtml = "";
                var kcol = json_obj.Table[0];
                var ColumnNames = new Array();
                for (var colname in kcol) {
                    ColumnNames.push(colname);
                }
                var totalCount = ColumnNames.length;
                var divWidth = Math.floor(100 / totalCount);
                divWidth = divWidth - 0.3;
                var totalwidth = 0;
                //if (totalCount >= 20) {
                //    var totalwidth = totalCount * 11;
                //    divWidth = Math.floor(totalwidth / 100);
                //    divWidth = divWidth;
                //}
                //if (totalCount >= 30) {
                //    var totalwidth = totalCount * 11;
                //    divWidth = Math.floor(totalwidth / 100);
                //    divWidth = divWidth;
                //}
                //if (totalCount >= 40) {
                //    var totalwidth = totalCount * 11;
                //    divWidth = Math.floor(totalwidth / 100);
                //    divWidth = 2.2;
                //}
                //if (totalCount >= 50) {
                //    var totalwidth = totalCount * 11;
                //    divWidth = Math.floor(totalwidth / 100);
                //    divWidth = 1.5;
                //}
                //if (totalCount >= 55) {
                //    var totalwidth = totalCount * 11;
                //    divWidth = Math.floor(totalwidth / 100);
                //    divWidth = 1.4;
                //}
                //if (totalCount >= 60) {
                //    var totalwidth = totalCount * 11;
                //    divWidth = Math.floor(totalwidth / 100);
                //    divWidth = 1.6;
                //}
                if (totalCount < 15) {
                   // alert("below 15")
                    var totalwidth = totalCount * 11;
                    divWidth = Math.floor(totalwidth / 100);
                    divWidth = 5;
                    totalwidth = 240;
                }
                if (totalCount >= 15 && totalCount <= 20) {
                   // alert("Morethan 15")
                    var totalwidth = totalCount * 11;
                    divWidth = Math.floor(totalwidth / 100);
                    divWidth = 4;
                    totalwidth = 295;
                }
                if (totalCount > 20 && totalCount <= 30) {
                    //alert("Morethan 20")
                    var totalwidth = totalCount * 11;
                    divWidth = Math.floor(totalwidth / 100);
                    divWidth = 2.3;
                    totalwidth = 550;
                }
                if (totalCount > 30 && totalCount <= 40) {
                    //alert("Morethan 30")
                    var totalwidth = totalCount * 11;
                    divWidth = Math.floor(totalwidth / 100);
                    divWidth = 1.5;
                    totalwidth = 800;
                }
                if (totalCount > 40 && totalCount <= 50) {
                    //alert("Morethan 40")
                    var totalwidth = totalCount * 11;
                    divWidth = Math.floor(totalwidth / 100);
                    divWidth = 1;
                    totalwidth = 1200
                }
                if (totalCount > 50 && totalCount <= 60) {
                    //alert("Morethan 50")
                    var totalwidth = totalCount * 11;
                    divWidth = Math.floor(totalwidth / 100);
                    divWidth = 0.8;
                    //divWidth = 0.6;
                    totalwidth = 1500

                }
                if (totalCount > 60 && totalCount <= 70) {
                    //alert("Morethan 60")
                    var totalwidth = totalCount * 11;
                    divWidth = Math.floor(totalwidth / 100);
                    divWidth = 1;
                    totalwidth = 1500;
                }
                if (totalCount > 70 && totalCount <= 80) {
                    //alert("Morethan 70")
                    var totalwidth = totalCount * 11;
                    divWidth = Math.floor(totalwidth / 100);
                    divWidth = 1;
                    totalwidth = 1700
                }

                //if (SavetagClick == false)
                //{
                //if (totalCount <= 10) {

                    for (var i = 0; i < json_obj.Table.length; i++) {
                        innerDivhtml += "<div style='height:15px;padding:10px 5px;width:100%;' class='itemStyle'>"
                        var ColumnValue = json_obj.Table[i];
                        var valueofrow;
                        for (var colval in ColumnValue) {

                            if (ColumnValue[colval] == "" || ColumnValue[colval] == null) {

                                //&nbsp;
                                innerDivhtml += "<div style='float: left;padding:0px; width: " + divWidth + "%;overflow:hidden; text-overflow: ellipsis;padding-right:0.3%; alt:'''> &nbsp;</div>"
                            }

                            else {
                                var splitteddatefinal = ColumnValue[colval].toString().split("T");

                                if (splitteddatefinal.length == 2) {

                                    var date = splitteddatefinal[0];
                                    var d = new Date(date.split("/").reverse().join("-"));

                                    var dd = d.getDate();
                                    var mm = d.getMonth() + 1;
                                    var yy = d.getFullYear();
                                    var datepreview = dd + "/" + mm + "/" + yy;
                                    if (datepreview == "NaN/NaN/NaN") {
                                        innerDivhtml += "<div title=" + ColumnValue[colval] + " style='float: left;padding:0px; width: " + divWidth + "%;overflow:hidden; text-overflow: ellipsis;padding-right:0.3%; alt:'''>" +
                                           ColumnValue[colval] + "</div>"
                                    }
                                    else {
                                        innerDivhtml += "<div title=" + datepreview + " style='float: left;padding:0px; width: " + divWidth + "%;overflow:hidden; text-overflow: ellipsis;padding-right:0.3%; alt:'''>" +
                                         datepreview + "</div>"
                                    }
                                }
                                else {
                                    innerDivhtml += "<div title=" + ColumnValue[colval] + " style='float: left;padding:0px; width: " + divWidth + "%;overflow:hidden; text-overflow: ellipsis;padding-right:0.3%; alt:'''>" +
                                           ColumnValue[colval] + "</div>"
                                }
                            }
                        }
                        innerDivhtml += "</div>"
                    }
                    var divheader = "<div id='dvhdr' style='height: 15px;padding:10px 5px;width:100%;' class='headerstyle'>"
                    for (var colname in kcol) {
                        divheader += "<div title='" + colname + "' style='float: left;;padding:0px; width:" + divWidth + "%; overflow:hidden; text-overflow: ellipsis;padding-right:0.3%;text-align: left;'>" +
                                        colname + "</div>";
                    }
                    divheader += "</div>";

                   // var totalwidth = totalCount * 11;

                    //if (totalwidth < 100) {
                      //  totalwidth = 100;
                   // }
                    $('#dvReport').css('width', totalwidth + "%");
                    // window.divmsgs.innerHTML = divheader + innerDivhtml;
                    $("#dvReport").append(divheader + innerDivhtml);

                    divs();
                    //}
                    //else
                    //{
                    //    ShowErrorMessage('No Preview available as data exceeds 10 columns !!!');
                    //}
                    ////}
                //}
            }
            else if (json_obj.Table1.length > 0) {
                //sessionStorage.setItem("tagsaveblock", 0);
                var innerDivhtml = "";
                var kcol = json_obj.Table1[0];
                var ColumnNames = new Array();
                for (var colname in kcol) {
                    ColumnNames.push(colname);
                }
                var totalCount = ColumnNames.length;
                var divWidth = Math.floor(100 / totalCount);
                divWidth = divWidth - 0.3;
                var totalwidth = 0;
               
                //if (totalCount >= 20) {
                //    var totalwidth = totalCount * 11;
                //    divWidth = Math.floor(totalwidth / 100);
                //    divWidth = divWidth;
                //}
                //if (totalCount >= 30) {
                //    var totalwidth = totalCount * 11;
                //    divWidth = Math.floor(totalwidth / 100);
                //    divWidth = divWidth;
                //}
                //if (totalCount >= 40) {
                //    var totalwidth = totalCount * 11;
                //    divWidth = Math.floor(totalwidth / 100);
                //    divWidth = 2.2;
                //}
                //if (totalCount >= 50) {
                //    var totalwidth = totalCount * 11;
                //    divWidth = Math.floor(totalwidth / 100);
                //    divWidth = 1.5;
                //}
                //if (totalCount >= 55) {
                //    var totalwidth = totalCount * 11;
                //    divWidth = Math.floor(totalwidth / 100);
                //    divWidth = 1.4;
                //}
                //if (totalCount >= 60) {
                //    var totalwidth = totalCount * 11;
                //    divWidth = Math.floor(totalwidth / 100);
                //    divWidth = 1.6;
                //}
                if (totalCount < 15) {
                    //alert("below 15")
                    var totalwidth = totalCount * 11;
                    divWidth = Math.floor(totalwidth / 100);
                    divWidth = 5;
                    totalwidth = 240;
                }
                if (totalCount >= 15 && totalCount <= 20) {
                    //alert("Morethan 15")
                    var totalwidth = totalCount * 11;
                    divWidth = Math.floor(totalwidth / 100);
                    divWidth = 4;
                    totalwidth = 295;
                }
                if (totalCount > 20 && totalCount <= 30) {
                    //alert("Morethan 20")
                    var totalwidth = totalCount * 11;
                    divWidth = Math.floor(totalwidth / 100);
                    divWidth = 2.3;
                    totalwidth = 550;
                }
                if (totalCount > 30 && totalCount <= 40) {
                    //alert("Morethan 30")
                    var totalwidth = totalCount * 11;
                    divWidth = Math.floor(totalwidth / 100);
                    divWidth = 1.5;
                    totalwidth = 800;
                }
                if (totalCount > 40 && totalCount <= 50) {
                   // alert("Morethan 40")
                    var totalwidth = totalCount * 11;
                    divWidth = Math.floor(totalwidth / 100);
                    divWidth = 1;
                    totalwidth = 1200
                }
                if (totalCount > 50 && totalCount <= 60) {
                   // alert("Morethan 50")
                    var totalwidth = totalCount * 11;
                    divWidth = Math.floor(totalwidth / 100);
                    divWidth = 0.8;
                    //divWidth = 0.6;
                    totalwidth = 1500

                }
                if (totalCount > 60 && totalCount <= 70) {
                    //alert("Morethan 60")
                    var totalwidth = totalCount * 11;
                    divWidth = Math.floor(totalwidth / 100);
                    divWidth = 1;
                    totalwidth = 1500;
                }
                if (totalCount > 70 && totalCount <= 80) {
                   // alert("Morethan 70")
                    var totalwidth = totalCount * 11;
                    divWidth = Math.floor(totalwidth / 100);
                    divWidth = 1;
                    totalwidth = 1700
                }

                for (var i = 0; i < json_obj.Table1.length; i++) {
                    innerDivhtml += "<div style='height:15px;padding:10px 5px;width:100%;' class='itemStyle'>"
                    var ColumnValue = json_obj.Table1[i];
                    var valueofrow;
                    for (var colval in ColumnValue) {

                        if (ColumnValue[colval] == "" || ColumnValue[colval] == null) {

                            //&nbsp;
                            innerDivhtml += "<div style='float: left;padding:0px; width: " + divWidth + "%;overflow:hidden; text-overflow: ellipsis;padding-right:0.3%; alt:'''> &nbsp;</div>"
                        }

                        else {
                            var splitteddatefinal = ColumnValue[colval].toString().split("T");

                            if (splitteddatefinal.length == 2) {

                                var date = splitteddatefinal[0];
                                var d = new Date(date.split("/").reverse().join("-"));

                                var dd = d.getDate();
                                var mm = d.getMonth() + 1;
                                var yy = d.getFullYear();
                                var datepreview = dd + "/" + mm + "/" + yy;
                                innerDivhtml += "<div tle=" + datepreview + " style='float: left;padding:0px; width: " + divWidth + "%;overflow:hidden; text-overflow: ellipsis;padding-right:0.3%; alt:'''>" +
                                 datepreview + "</div>"
                            }
                            else {
                                innerDivhtml += "<div title=" + ColumnValue[colval] + " style='float: left;padding:0px; width: " + divWidth + "%;overflow:hidden; text-overflow: ellipsis;padding-right:0.3%; alt:'''>" +
                                       ColumnValue[colval] + "</div>"
                            }
                        }
                    }
                    innerDivhtml += "</div>"
                }
                var divheader = "<div id='dvhdr' style='height: 15px;padding:10px 5px;width:100%;' class='headerstyle'>"
                for (var colname in kcol) {
                    divheader += "<div title='" + colname + "' style='float: left;;padding:0px; width:" + divWidth + "%; overflow:hidden; text-overflow: ellipsis;padding-right:0.3%;text-align: left;'>" +
                                    colname + "</div>";
                }
                divheader += "</div>";
                // window.divmsgs.innerHTML = divheader + innerDivhtml;
                var totalwidth = totalCount * 11;

                if (totalwidth < 100) {
                    totalwidth = 100;
                }
                $('#dvReport').css('width', totalwidth + "%");
                $("#dvReport").append(divheader + innerDivhtml);

                divs();
            }

                $("#dvLoading").hide();
                $("#dvLoading1").hide();
                $("#dvLoading").css("display", "none");
                if (TagId == 0) {
                    $("#BtnsaveTagging").val("Save Tagging")

                } else {
                    $("#BtnsaveTagging").val("Update Tagging")
                }
                $("#DvSaveTagging").css('display', 'block');
                //$("#dvhdr").niceScroll({ cursorcolor: "#CCCCCC", cursorwidth: "8px" }).resize();
            }
        },
        complete: function () {
            $("#dvLoading").hide(); // on complete of ajax hide it.
        },
        error: function (objxmlRequest) {
            $("#dvLoading").hide();
            window.console.log(objxmlRequest.responseText);
        }
    });
}

function GetCountStruct(Red, Blue, Black, Green, Yellow) {
  
    clickPreview = true;
    $("#dvLoading").css("display", "block");
    $("#dvLoading1").show();
    var FillCount = $("#HdnTblChkCount").val();
    document.getElementById("dvReport").innerHTML = "";
    var dsname = $("#ddldatasource :selected").text();
    $.ajax({
        url: "/Tagging/GetCountStruct",
        type: 'Post',
        data: JSON.stringify({ 'TblCount': FillCount, 'ExcelNames': chkArray, 'DataSourceName': dsname, 'RedColor': Red, 'BlueColor': Blue, 'BlackColor': Black, 'GreenColor': Green, 'YellowColor': Yellow, 'AccountId': $("#hdn_AdsId").val() }),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            
            if (response == null) {
            }
            else if (response.Table1.length > 0) {
               // savetagcheckafterpreview = 0;
               // if (SavetagClick == false) {
                    var innerDivhtml = "";
                    var kcol = response.Table1[0];
                    var ColumnNames = new Array();
                    for (var colname in kcol) {
                        ColumnNames.push(colname);
                    }
                    var totalCount = ColumnNames.length;
                    var divWidth = Math.floor(100 / totalCount);
                    divWidth = divWidth - 0.3;
                    for (var i = 0; i < response.Table1.length; i++) {
                        innerDivhtml += "<div style='height: 15px;padding:10px 5px;' class='itemStyle'>"
                        var ColumnValue = response.Table1[i];
                        for (var colval in ColumnValue) {
                            if (ColumnValue[colval] == "" || ColumnValue[colval] == null) {
                                innerDivhtml += "<div style='float: left;padding:0px; width: " + divWidth + "%;overflow:hidden; text-overflow: ellipsis;padding-right:0.3%; alt:'''>&nbsp;</div>"
                            }
                            else {
                                innerDivhtml += "<div style='float: left;padding:0px; width: " + divWidth + "%;overflow:hidden; text-overflow: ellipsis;padding-right:0.3%; alt:'''>" +
                                       ColumnValue[colval] + "</div>"
                            }
                        }
                        innerDivhtml += "</div>"
                    }
                    var divheader = "<div style='height: 15px;padding:10px 5px;' class='headerstyle'>"
                    for (var colname in kcol) {
                        divheader += "<div title='" + colname + "' style='float: left;padding:0px; width:" + divWidth + "%;overflow:hidden; text-overflow: ellipsis;padding-right:0.3%;text-align: left;'>" +
                                        colname + "</div>";
                    }
                    divheader += "</div>";
                    $("#dvReport").append(divheader + innerDivhtml);
                    //   window.dvReport.innerHTML = divheader + innerDivhtml;
                
                  
            $("#dvLoading").css("display", "none");
            if (TagId == 0) {
                $("#BtnsaveTagging").val("Save Tagging")

            } else {
                $("#BtnsaveTagging").val("Update Tagging")
            }
            $("#DvSaveTagging").css('display', 'block');
            divs();
               // }
                $("#dvLoading1").hide();
            }
            
        },
        error: function (objxmlRequest) {
            $("#dvLoading").hide();
            window.console.log(objxmlRequest.responseText);
        }
    });
}

function RemoveUniqueIdFromArr(arr, uniqId) {
    var found = arr.indexOf(uniqId);

    if (found != -1) {
        arr.splice(found, 1);
        arr.splice(0, 0, uniqId);
    }
    else {
        arr.push(uniqId);
        var found1 = arr.indexOf(uniqId);
        arr.splice(found1, 1);
        arr.splice(0, 0, uniqId);
    }
}


function SaveTagDetails() {
    SavetagClick = true;
    //alert(clickPreview);
    var Fil1Values = "";;
    var Fil2Values = "";
    var Fil3Values = "";
    var Fil4Values = "";
    var TagTitle = $("#TxtTagTitle").val();
    if (TagTitle == "") {
        ShowErrorMessage("Please enter the Tag Title.");
    }
    else {
        $("#dvLoading").show();
      
        var TagType = 0;
        var RdbId = $("input[type=radio]:checked").attr('id');
        
        if (RdbId == "RdbMap") {
            TagType = 1;
            Fil1Values = $("#HdViewlist1").val();
            Fil2Values = $("#HdViewlist2").val();
            Fil3Values = $("#HdViewlist3").val();
            Fil4Values = $("#HdViewlist4").val();

        }
        else if (RdbId == "RdbCount") {
            TagType = 0;
            
            Fil1Values = $("#HdsameColors1").val();
            Fil2Values = $("#HdsameColors2").val();
            Fil3Values = $("#HdsameColors3").val();
            Fil4Values = $("#HdsameColors4").val();
        }
        //if (clickPreview == false) {
        //GetListItem();
        //}
        //  if (Fil1Values == "" && Fil2Values == "") {
        //if (clickPreview == false) {
        //    alert("preview false");
        //    GetListItem();
        //    if (RdbId == "RdbMap") {
        //        TagType = 1;
        //        Fil1Values = $("#HdViewlist1").val();
        //        Fil2Values = $("#HdViewlist2").val();
        //        Fil3Values = $("#HdViewlist3").val();
        //        Fil4Values = $("#HdViewlist4").val();
        //    }
        //    else if (RdbId == "RdbCount") {
        //        TagType = 0;
        //        HdsameColors1
        //        Fil1Values = $("#HdsameColors1").val();
        //        Fil2Values = $("#HdsameColors2").val();
        //        Fil3Values = $("#HdsameColors3").val();
        //        Fil4Values = $("#HdsameColors4").val();
        //    }
        //}
      
        
        if (clickPreview == false) {
            
            GetListItem();
         
            var savetagcheck = sessionStorage.getItem("TagcheckDm");
           if (savetagcheck == 1)
           {
                return false;
           }
           
            if (RdbId == "RdbMap") {
                TagType = 1;
                Fil1Values = $("#HdViewlist1").val();
                Fil2Values = $("#HdViewlist2").val();
                Fil3Values = $("#HdViewlist3").val();
                Fil4Values = $("#HdViewlist4").val();
            }
            else if (RdbId == "RdbCount") {
                TagType = 0;
                
                Fil1Values = $("#HdsameColors1").val();
                Fil2Values = $("#HdsameColors2").val();
                Fil3Values = $("#HdsameColors3").val();
                Fil4Values = $("#HdsameColors4").val();
            }
       }
        var UniqueIdFile1 = $("#HdUniqueId1").val();
        var UniqueIdFile2 = $("#HdUniqueId2").val();
        var UniqueIdFile3 = $("#HdUniqueId3").val();
        var UniqueIdFile4 = $("#HdUniqueId4").val();
        var dsId = $("#ddldatasource :selected").val();
        
        
        //alert(sessionStorage.getItem("TagcheckDm"));
        //alert(sessionStorage.getItem("tagsaveblock"));
        savetagcheckafterpreview = sessionStorage.getItem("TagcheckDm");
        //if (savetagcheck == 1 || savetagcheck == null) {
           
        //    clickPreview = false;
        //    ShowErrorMessage("Please select an additional column along with the common key column.");
        //    $("#dvLoading").hide();
        //    return false;
        //}
        //alert("blocksae:"+blocksavetag);
        
        if (savetagcheckafterpreview == 0 ) {

            ///GetListItem();
            //clickPreview = false;
            $.ajax({
                url: "/Tagging/SaveTaggingDetails",
                type: 'Post',
                data: JSON.stringify({ 'AccountId': AccountId, 'DataSourceId': dsId, 'TagTitle': TagTitle, 'TagType': TagType, 'ExcelNames': chkTblName, 'Fil1Values': Fil1Values, 'Fil2Values': Fil2Values, 'Fil3Values': Fil3Values, 'Fil4Values': Fil4Values, 'UniqueIdFile1': UniqueIdFile1, 'UniqueIdFile2': UniqueIdFile2, 'UniqueIdFile3': UniqueIdFile3, 'UniqueIdFile4': UniqueIdFile4, 'TagId': TagId, 'TaggedFile': $("#HdnQry").val() }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                async:false,
                success: function (response) {

                    if (response == 0 && TagId == 0) {
                        ShowErrorMessage("Tag Title already Exists.");
                        clickPreview = false;
                    }
                    else if (TagId != 0 && response == 0) {
                        ShowErrorMessage("Updated Successfully.");
                        clickPreview = false;
                    }
                    else if (response != null) {
                        ShowErrorMessage("Data has been tagged successfully.");
                        clickPreview = false;
                    }
                    $("#dvLoading").hide();
                },
                error: function (objxmlRequest) {
                    $("#dvLoading").hide();
                    window.console.log(objxmlRequest.responseText);
                }
            });
        }
    }
    // }
}
function hideit() {
    $("#divmsgs").hide("slow");
}
function divs() {
    $("#divmsgs").show(1000);
}
//function ShowErrorMessage(errMessage) {
//    divmsg.innerHTML = errMessage + '<span style="float:right;cursor:pointer;padding-right: 8px;" onclick=javascript:$("#divmsg").hide()>X</span>';

//    messageDiv = $(".MsgStyle");
//    //messageDiv.fadeIn(500);
//    messageDiv.fadeIn(500).delay(5000).fadeOut(1000, function () {
//    });
//}

// Get CheckBox List and Same color columnsmo


function GetListItem() {
   
    $("#dvLoading").show();
    var RdbId = $("input[type=radio]:checked").attr('id');

    if (RdbId == "RdbMap") {
      
        GetChkdItems();
    }
    else if (RdbId == "RdbCount") {
        
        GetChkdColors();
    }
    $("#dvLoading").hide();
}

function GetChkdColors() {
  
    document.getElementById("HdsameColors1").value = "";
    document.getElementById("HdsameColors2").value = "";
    document.getElementById("HdsameColors3").value = "";
    document.getElementById("HdsameColors4").value = "";
    var Divobj = document.getElementById("dvTbl1");
    var tblTxtCol = Divobj.getElementsByTagName('input');
    for (var i = 0; i < tblTxtCol.length; i++) {
        if (tblTxtCol[i].type == "text") {
            var Selectedcolor = document.getElementById(tblTxtCol[i].id).style.backgroundColor;
            if (Selectedcolor != '') {
                var allcolrs = tblTxtCol[i].id + '!~!' + Selectedcolor;
                document.getElementById("HdsameColors1").value += allcolrs + ',';
                allcolrs = "";
            }
        }
    }

    var Divobj = document.getElementById("dvTbl2");
    var tblTxtCol = Divobj.getElementsByTagName('input');
    for (var i = 0; i < tblTxtCol.length; i++) {
        if (tblTxtCol[i].type == "text") {
            var Selectedcolor = document.getElementById(tblTxtCol[i].id).style.backgroundColor;
            if (Selectedcolor != '') {
                var allcolrs = tblTxtCol[i].id + '!~!' + Selectedcolor;
                document.getElementById("HdsameColors2").value += allcolrs + ',';
                allcolrs = "";
            }
        }
    }
    var Divobj = document.getElementById("dvTbl3");
    var tblTxtCol = Divobj.getElementsByTagName('input');
    for (var i = 0; i < tblTxtCol.length; i++) {
        if (tblTxtCol[i].type == "text") {
            var Selectedcolor = document.getElementById(tblTxtCol[i].id).style.backgroundColor;
            if (Selectedcolor != '') {
                var allcolrs = tblTxtCol[i].id + '!~!' + Selectedcolor;
                document.getElementById("HdsameColors3").value += allcolrs + ',';
                allcolrs = "";
            }
        }
    }
    var Divobj = document.getElementById("dvTbl4");
    var tblTxtCol = Divobj.getElementsByTagName('input');
    for (var i = 0; i < tblTxtCol.length; i++) {
        if (tblTxtCol[i].type == "text") {
            var Selectedcolor = document.getElementById(tblTxtCol[i].id).style.backgroundColor;
            if (Selectedcolor != '') {
                var allcolrs = tblTxtCol[i].id + '!~!' + Selectedcolor;
                document.getElementById("HdsameColors4").value += allcolrs + ',';
                allcolrs = "";
            }
        }
    }
    TagTableCount();
}

function GetChkdItems() {
   
    $("#dvLoading").show();
    Tbl1ColArr = [];
    Tbl2ColArr = [];
    Tbl3ColArr = [];
    Tbl4ColArr = [];
    document.getElementById("HdViewlist1").value = "";
    document.getElementById("HdViewlist2").value = "";
    document.getElementById("HdViewlist3").value = "";
    document.getElementById("HdViewlist4").value = "";
    var list1 = document.getElementsByName("chk_group1");
    for (var i = 0; i < list1.length; i++) {
        
        if (list1[i].checked) {
           
            document.getElementById("HdViewlist1").value += list1[i].value + ",";
            var list = list1[i].value;
            var lastChar = list[list.length - 1];
            if (lastChar == "1")
            {
                list = list.substring(0, list.length - 1)
            }
           // list = list.replace('1', '');
            //alert(list.trim());
           
            Tbl1ColArr.push(list.trim());
        }
    }
    var list2 = document.getElementsByName("chk_group2");
    for (var j = 0; j < list2.length; j++) {
        if (list2[j].checked) {
           
            document.getElementById("HdViewlist2").value += list2[j].value + ",";
            var list = list2[j].value;
            var lastChar = list[list.length - 1];
            if (lastChar == "2")
            {
                list = list.substring(0, list.length - 1)
            }
            //list = list.replace('2', '');
            Tbl2ColArr.push(list.trim());
            // Tbl2ColArr.push(list2[j].value);
        }
    }
    var list2 = document.getElementsByName("chk_group3");
    for (var j = 0; j < list2.length; j++) {
        if (list2[j].checked) {
            document.getElementById("HdViewlist3").value += list2[j].value + ",";
            var list = list2[j].value;
            var lastChar = list[list.length - 1];
            if (lastChar == "3") {
                list = list.substring(0, list.length - 1)
            }
            //list = list.replace('3', '');
            Tbl3ColArr.push(list.trim());
            // Tbl3ColArr.push(list2[j].value);
        }
    }
    var list2 = document.getElementsByName("chk_group4");
    for (var j = 0; j < list2.length; j++) {
        if (list2[j].checked) {
            document.getElementById("HdViewlist4").value += list2[j].value + ",";
            var list = list2[j].value;
            var lastChar = list[list.length - 1];
            if (lastChar == "4") {
                list = list.substring(0, list.length - 1)
            }
           // list = list.replace('4', '');
            Tbl4ColArr.push(list.trim());
            //   Tbl4ColArr.push(list2[j].value);
        }
    }
    TagTableMap();
    $("#dvLoading").hide();
}



//Color Append and color bind


function changeColor1(id, TblNo) {
    
    var columntest = UniqueColumn(id);
  
    var Data = '';
   
  
   
    //$("input[name='chk_group4']").removeAttr("disabled");

    if (id != '') {
        if (TblNo == 'tbl1') {
            $("input[name='chk_group1']").removeAttr("disabled");
            Data = $("#Hdtbl1").val()//document.getElementById("Hdtbl1").value;
            // document.getElementById("HdUniqueId1").value = id;
            $("#HdUniqueId1").val(id);
            $('input[name=chk_group1]').prop('checked', false);
            $("input[Value='" + columntest + 1 + "'").attr('checked', true);
            $("input[Value='" + columntest + 1 + "']").attr('disabled', true);
         
        }
        if (TblNo == 'tbl2') {
            $("input[name='chk_group2']").removeAttr("disabled");
            Data = $("#Hdtbl2").val()
            $("#HdUniqueId2").val(id);
            $('input[name=chk_group2]').prop('checked', false);
            $("input[Value='" + columntest + 2 + "'").attr('checked', true);
            $("input[Value='" + columntest + 2 + "']").attr('disabled', true);
        }

        if (TblNo == 'tbl3') {
            $("input[name='chk_group3']").removeAttr("disabled");
            Data = $("#Hdtbl3").val()
            $("#HdUniqueId3").val(id);
            $('input[name=chk_group3]').prop('checked', false);
            $("input[Value='" + columntest + 3 + "'").attr('checked', true);
            $("input[Value='" + columntest + 3 + "']").attr('disabled', true);

        }
        if (TblNo == 'tbl4') {
            $("input[name='chk_group4']").removeAttr("disabled");
            Data = $("#Hdtbl4").val()
            $("#HdUniqueId4").val(id);
            $('input[name=chk_group4]').prop('checked', false);
            $("input[Value='" + columntest + 4 + "'").attr('checked', true);
            $("input[Value='" + columntest + 4 + "']").attr('disabled', true);

        }
        var str_array = Data.split(',');
        for (var i = 0; i < str_array.length; i++) {
            if (str_array[i] != "") {

                document.getElementById(id).style.color = "#ff0000"; // forecolor
                document.getElementById(id).style.backgroundColor = "#ff0000"; // backcolor

                if (str_array[i] != id) {
                    document.getElementById(str_array[i]).style.color = "#000000"; // forecolor
                    document.getElementById(str_array[i]).style.backgroundColor = "#000000"; // backcolor
                }

            }
        }
    }
}

function UniqueColumn(UniqueCol) {
    var UniqueCol1 = UniqueCol.substring(UniqueCol.indexOf("~-"));
    var tbllen = UniqueCol1.indexOf("~!");
    UniqueCol1 = UniqueCol1.substring(0, tbllen);
    UniqueCol1 = UniqueCol1.replace("~-", "");
    return UniqueCol1;
}

function changeColor(id, tbl) {
   
    document.getElementById('Hidden1').value = "";
    document.getElementById('Hidden2').value = "";
    document.getElementById('Hidden1').value = id;
    document.getElementById('Hidden2').value = tbl;

    if (tbl == 'Tbl1') {
        if (document.getElementById('Divcolorone') !== null) {
            document.getElementById('Divcolorone').style.display = 'block';
        }
        if (document.getElementById('DivcolorTwo') !== null) {
            document.getElementById('DivcolorTwo').style.display = 'none';
        }
        if (document.getElementById('DivcolorThree') !== null) {
            document.getElementById('DivcolorThree').style.display = 'none';
        }
        if (document.getElementById('DivcolorFour') !== null) {
            document.getElementById('DivcolorFour').style.display = 'none';

        }


    }
    if (tbl == 'Tbl2') {
  
        if (document.getElementById('DivcolorTwo') !== null) {
            document.getElementById('DivcolorTwo').style.display = 'block';
        }
        if (document.getElementById('Divcolorone') !== null) {
            document.getElementById('Divcolorone').style.display = 'none';
        }
        if (document.getElementById('DivcolorThree') !== null) {
            document.getElementById('DivcolorThree').style.display = 'none';
        }
        if (document.getElementById('DivcolorFour') !== null) {
            document.getElementById('DivcolorFour').style.display = 'none';
        }
    }
    if (tbl == 'Tbl3') {
        if (document.getElementById('DivcolorTwo') !== null) {
            document.getElementById('DivcolorTwo').style.display = 'none';
        }
        if (document.getElementById('Divcolorone') !== null) {
            document.getElementById('Divcolorone').style.display = 'none';
        }
        if (document.getElementById('DivcolorThree') !== null) {
            document.getElementById('DivcolorThree').style.display = 'block';
        }
        if (document.getElementById('DivcolorFour') !== null) {
            document.getElementById('DivcolorFour').style.display = 'none';
        }
    }
    if (tbl == 'Tbl4') {
        if (document.getElementById('DivcolorTwo') !== null) {
            document.getElementById('DivcolorTwo').style.display = 'none';
        }
        if (document.getElementById('Divcolorone') !== null) {
            document.getElementById('Divcolorone').style.display = 'none';
        }
        if (document.getElementById('DivcolorThree') !== null) {
            document.getElementById('DivcolorThree').style.display = 'none';
        }
        if (document.getElementById('DivcolorFour') !== null) {
            document.getElementById('DivcolorFour').style.display = 'block';
        }
    }
}

function ColorAppend(color) {
   
    var colorindexcheck = color.indexOf("255");
    if(colorindexcheck!=-1)
    {
        return false;
    }
    var Id = document.getElementById('Hidden1').value;
    var TblNo = document.getElementById('Hidden2').value;
    var Data = "";
    if (TblNo == 'Tbl1') {
        Data = document.getElementById("Hdtbl1").value;
    }
    if (TblNo == 'Tbl2') {
       
        Data = document.getElementById("Hdtbl2").value;
    }
    if (TblNo == 'Tbl3') {
        Data = document.getElementById("Hdtbl3").value;
    }
    if (TblNo == 'Tbl4') {
        Data = document.getElementById("Hdtbl4").value;
    }
    var str_array = Data.split(',');

    for (var i = 0; i < str_array.length; i++) {
        if (str_array[i] != "") {

            var Existcolor = document.getElementById(str_array[i]).style.backgroundColor;

            if (Existcolor == color) {

                document.getElementById(str_array[i]).style.backgroundColor = '#fff';
                document.getElementById(Id).style.backgroundColor = color;
                if (TblNo == 'Tbl1') {
                    if (document.getElementById('Divcolorone') !== null) {
                        document.getElementById('Divcolorone').style.display = 'none';
                    }
                }
                if (TblNo == 'Tbl2') {
                    if (document.getElementById('DivcolorTwo') !== null) {
                        document.getElementById('DivcolorTwo').style.display = 'none';
                    }
                }
                if (TblNo == 'Tbl3') {
                    if (document.getElementById('DivcolorThree') !== null) {
                        document.getElementById('DivcolorThree').style.display = 'none';
                    }
                }
                if (TblNo == 'Tbl4') {
                    if (document.getElementById('DivcolorFour') !== null) {
                        document.getElementById('DivcolorFour').style.display = 'none';

                    }
                }
            }
            else {
                document.getElementById(Id).style.backgroundColor = color;
                if (TblNo == 'Tbl1') {
                    if (document.getElementById('Divcolorone') !== null) {
                        document.getElementById('Divcolorone').style.display = 'none';
                    }

                }
                if (TblNo == 'Tbl2') {
                    if (document.getElementById('DivcolorTwo') !== null) {
                        document.getElementById('DivcolorTwo').style.display = 'none';
                    }
                }
                if (TblNo == 'Tbl3') {
                    if (document.getElementById('DivcolorThree') !== null) {
                        document.getElementById('DivcolorThree').style.display = 'none';
                    }
                }
                if (TblNo == 'Tbl4') {
                    if (document.getElementById('DivcolorFour') !== null) {
                        document.getElementById('DivcolorFour').style.display = 'none';
                    }
                }
            }
        }
    }
}

function checkS(e) {
    // capture the mouse position
    var posx = 0;
    var posy = 0;
    if (!e) var e = window.event;
    if (e.pageX || e.pageY) {
        posx = e.pageX;
        posy = e.pageY;
    }
    else if (e.clientX || e.clientY) {
        posx = e.clientX;
        posy = e.clientY;
    }
   
    if (document.getElementById('pos') !== null) {
        document.getElementById('pos').innerHTML = 'Mouse position is: X=' + posx + ' Y=' + posy;
    }
    if (document.getElementById('pos') !== null) {
        document.getElementById('pos').style.left = posx;
    }
    if (document.getElementById('pos') !== null) {
        document.getElementById('pos').style.top = posy;
    }
}
