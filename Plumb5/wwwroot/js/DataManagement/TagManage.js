var RedQuery = "", BlueQuery = "", BlackQuery = "", GreenQuery = "", YellowQuery = "", FinalCountQry = "";
var FullQuery1R = "", FullQuery1B = "", FullQuery1Bl = "", FullQuery1G = "", FullQuery1Y = "";
var FullQuery2R = "", FullQuery2B = "", FullQuery2Bl = "", FullQuery2G = "", FullQuery2Y = "";
var FullQuery3R = "", FullQuery3B = "", FullQuery3Bl = "", FullQuery3G = "", FullQuery3Y = "";
var FullQuery4R = "", FullQuery4B = "", FullQuery4Bl = "", FullQuery4G = "", FullQuery4Y = "";

var Red = new Array();
var Blue = new Array();
var Black = new Array();
var Green = new Array();
var Yellow = new Array();
sessionStorage.setItem("TagcheckDm", 0);
function TagTableCount() {
    Red.length = [];
    Blue.length = [];
    Black.length = [];
    Green.length = [];
    Yellow.length = [];
    $("#HdnQry").val("");
    var FillCount = $("#HdnTblChkCount").val();
    var tbl1 = "", tbl2 = "", tbl3 = "", tbl4 = "";
    RedQuery = "", BlueQuery = "", BlackQuery = "", GreenQuery = "", YellowQuery = "", FinalCountQry = "";
    FullQuery1R = "", FullQuery1B = "", FullQuery1Bl = "", FullQuery1G = "", FullQuery1Y = "";
    FullQuery2R = "", FullQuery2B = "", FullQuery2Bl = "", FullQuery2G = "", FullQuery2Y = "";
    FullQuery3R = "", FullQuery3B = "", FullQuery3Bl = "", FullQuery3G = "", FullQuery3Y = "";
    FullQuery4R = "", FullQuery4B = "", FullQuery4Bl = "", FullQuery4G = "", FullQuery4Y = "";
    tbl1 = document.getElementById("HdsameColors1").value;
    tbl2 = document.getElementById("HdsameColors2").value;
    tbl3 = document.getElementById("HdsameColors3").value;
    tbl4 = document.getElementById("HdsameColors4").value;

    FirstTable(tbl1);
    SecondTable(tbl2);
    ThirdTable(tbl3);
    FourthTable(tbl4);
    FinalQuery(FillCount);
}

function FirstTable(tbl1) {
    var colour = tbl1;
    if (colour.substring(colour.length - 1, colour.length == ",")) {
        colour = colour.substring(0, colour.length - 1);
    }
    var columnNames = colour.split(',');
    var TblName1 = GetTableName(columnNames[0]);
    for (var i = 0; i < columnNames.length; i++) {
        var searchhref = columnNames[i].substring(columnNames[i].indexOf("!~!"));
        searchhref = searchhref.replace("!~!", "");
        var column = "";
        if (searchhref == "red") {
            column = GetColumnName(columnNames[i]);
            FullQuery1R = "(select count ([" + column + "])from " + TblName1 + " ) as [" + column + "],";
            RedQuery = "(select count ([" + column + "])as Total from " + TblName1 + ",";
            Red.push(column + "#1");
        }
        if (searchhref == "blue") {
            column = GetColumnName(columnNames[i]);
            FullQuery1B = "(select count ([" + column + "])from " + TblName1 + " ) as [" + column + "],";
            BlueQuery = "(select count ([" + column + "])as Total from " + TblName1 + ",";
            Blue.push(column + "#1");
        }
        if (searchhref == "black") {
            column = GetColumnName(columnNames[i]);
            FullQuery1Bl = "(select count ([" + column + "])from " + TblName1 + " ) as [" + column + "],";
            BlackQuery = "(select count ([" + column + "])as Total from " + TblName1 + ",";
            Black.push(column + "#1");
        }
        if (searchhref == "green") {
            column = GetColumnName(columnNames[i]);
            FullQuery1G = "(select count ([" + column + "])from " + TblName1 + " ) as [" + column + "],";
            GreenQuery = "(select count ([" + column + "])as Total from " + TblName1 + ",";
            Green.push(column + "#1");
        }
        if (searchhref == "yellow") {
            column = GetColumnName(columnNames[i]);
            FullQuery1Y = "(select count ([" + column + "])from " + TblName1 + " ) as [" + column + "],";
            YellowQuery = "(select count ([" + column + "])as Total from " + TblName1 + ",";
            Yellow.push(column + "#1");
        }

    }
}

function SecondTable(tbl2) {
    var colour = tbl2;
    if (colour.substring(colour.length - 1, colour.length == ",")) {
        colour = colour.substring(0, colour.length - 1);
    }
    var columnNames = colour.split(',');
    var TblName = GetTableName(columnNames[0]);
    for (var i = 0; i < columnNames.length; i++) {
        var searchhref = columnNames[i].substring(columnNames[i].indexOf("!~!"));
        searchhref = searchhref.replace("!~!", "");
        var column = "";
        if (searchhref == "red") {
            column = GetColumnName(columnNames[i]);
            FullQuery2R = "(select count ([" + column + "])from " + TblName + " ) as [" + column + "],";
            RedQuery = RedQuery + "(select count ([" + column + "])as Total from " + TblName + ",";
            Red.push(column + "#2");
        }
        if (searchhref == "blue") {
            column = GetColumnName(columnNames[i]);
            FullQuery2B = "(select count ([" + column + "])from " + TblName + " ) as [" + column + "],";
            BlueQuery = BlueQuery + "(select count ([" + column + "])as Total from " + TblName + ",";
            Blue.push(column + "#2");
        }
        if (searchhref == "black") {
            column = GetColumnName(columnNames[i]);
            FullQuery2Bl = "(select count ([" + column + "])from " + TblName + " ) as [" + column + "],";
            BlackQuery = BlackQuery + "(select count ([" + column + "])as Total from " + TblName + ",";
            Black.push(column + "#2");
        }
        if (searchhref == "green") {
            column = GetColumnName(columnNames[i]);
            FullQuery2G = "(select count ([" + column + "])from " + TblName + " ) as [" + column + "],";
            GreenQuery = GreenQuery + "(select count ([" + column + "])as Total from " + TblName + ",";
            Green.push(column + "#2");
        }
        if (searchhref == "yellow") {
            column = GetColumnName(columnNames[i]);
            FullQuery2Y = "(select count ([" + column + "])from " + TblName + " ) as [" + column + "],";
            YellowQuery = YellowQuery + "(select count ([" + column + "])as Total from " + TblName + ",";
            Yellow.push(column + "#2");
        }

    }
}

function ThirdTable(tbl3) {
    var colour = tbl3;
    if (colour.substring(colour.length - 1, colour.length == ",")) {
        colour = colour.substring(0, colour.length - 1);
    }
    var columnNames = colour.split(',');
    var TblName = GetTableName(columnNames[0]);
    for (var i = 0; i < columnNames.length; i++) {
        var searchhref = columnNames[i].substring(columnNames[i].indexOf("!~!"));
        searchhref = searchhref.replace("!~!", "");
        var column = "";
        if (searchhref == "red") {
            column = GetColumnName(columnNames[i]);
            FullQuery3R = "(select count ([" + column + "])from " + TblName + " ) as [" + column + "],";
            RedQuery = RedQuery + "(select count ([" + column + "])as Total from " + TblName + ",";
            Red.push(column + "#3");
        }
        if (searchhref == "blue") {
            column = GetColumnName(columnNames[i]);
            FullQuery3B = "(select count ([" + column + "])from " + TblName + " ) as [" + column + "],";
            BlueQuery = BlueQuery + "(select count ([" + column + "])as Total from " + TblName + ",";
            Blue.push(column + "#3");
        }
        if (searchhref == "black") {
            column = GetColumnName(columnNames[i]);
            FullQuery3Bl = "(select count ([" + column + "])from " + TblName + " ) as [" + column + "],";
            BlackQuery = BlackQuery + "(select count ([" + column + "])as Total from " + TblName + ",";
            Black.push(column + "#3");
        }
        if (searchhref == "green") {
            column = GetColumnName(columnNames[i]);
            FullQuery3G = "(select count ([" + column + "])from " + TblName + " ) as [" + column + "],";
            GreenQuery = GreenQuery + "(select count ([" + column + "])as Total from " + TblName + ",";
            Green.push(column + "#3");
        }
        if (searchhref == "yellow") {
            column = GetColumnName(columnNames[i]);
            FullQuery3Y = "(select count ([" + column + "])from " + TblName + " ) as [" + column + "],";
            YellowQuery = YellowQuery + "(select count ([" + column + "])as Total from " + TblName + ",";
            Yellow.push(column + "#3");
        }

    }
}

function FourthTable(tbl4) {
    var colour = tbl4;
    if (colour.substring(colour.length - 1, colour.length == ",")) {
        colour = colour.substring(0, colour.length - 1);
    }
    var columnNames = colour.split(',');
    var TblName = GetTableName(columnNames[0]);
    for (var i = 0; i < columnNames.length; i++) {
        var searchhref = columnNames[i].substring(columnNames[i].indexOf("!~!"));
        searchhref = searchhref.replace("!~!", "");
        var column = "";
        if (searchhref == "red") {
            column = GetColumnName(columnNames[i]);
            FullQuery4R = "(select count ([" + column + "])from " + TblName + " ) as [" + column + "],";
            RedQuery = RedQuery + "(select count ([" + column + "])as Total from " + TblName + ",";
            Red.push(column + "#4");
        }
        if (searchhref == "blue") {
            column = GetColumnName(columnNames[i]);
            FullQuery4B = "(select count ([" + column + "])from " + TblName + " ) as [" + column + "],";
            BlueQuery = BlueQuery + "(select count ([" + column + "])as Total from " + TblName + ",";
            Blue.push(column + "#4");
        }
        if (searchhref == "black") {
            column = GetColumnName(columnNames[i]);
            FullQuery4Bl = "(select count ([" + column + "])from " + TblName + " ) as [" + column + "],";
            BlackQuery = BlackQuery + "(select count ([" + column + "])as Total from " + TblName + ",";
            Black.push(column + "#4");
        }
        if (searchhref == "green") {
            column = GetColumnName(columnNames[i]);
            FullQuery4G = "(select count ([" + column + "])from " + TblName + " ) as [" + column + "],";
            GreenQuery = GreenQuery + "(select count ([" + column + "])as Total from " + TblName + ",";
            Green.push(column + "#4");
        }
        if (searchhref == "yellow") {
            column = GetColumnName(columnNames[i]);
            FullQuery4Y = "(select count ([" + column + "])from " + TblName + " ) as [" + column + "],";
            YellowQuery = YellowQuery + "(select count ([" + column + "])as Total from " + TblName + ",";
            Yellow.push(column + "#4");
        }

    }
}

function FinalQuery(FillCount) {
    // if (FillCount == "2") {
    var tbl2fullQry = "", tblfullQry = "";
    if (RedQuery.substring(RedQuery.length - 1, RedQuery.length == ",")) {
        var red = ToGetCommonColorCount(RedQuery);
        if (red == "") {
            tblfullQry = FullQuery1R + tblfullQry;
            if (FullQuery2R != "") {
                tblfullQry = FullQuery2R + tblfullQry;
            }
            if (FullQuery3R != "") {
                tblfullQry = FullQuery3R + tblfullQry;
            }
            if (FullQuery4R != "") {
                tblfullQry = FullQuery4R + tblfullQry;
            }
        }
        else {
            tblfullQry = tblfullQry + red;
        }
    }
    if (BlueQuery.substring(BlueQuery.length - 1, BlueQuery.length == ",")) {
        var blue = ToGetCommonColorCount(BlueQuery);
        if (blue == "") {
            tblfullQry = FullQuery1B + tblfullQry;
            if (FullQuery2B != "") {
                tblfullQry = FullQuery2B + tblfullQry;
            }
            if (FullQuery3B != "") {
                tblfullQry = FullQuery3B + tblfullQry;
            }
            if (FullQuery4B != "") {
                tblfullQry = FullQuery4B + tblfullQry;
            }
        }
        else {
            tblfullQry = tblfullQry + "," + blue;
        }
    }
    if (BlackQuery.substring(BlackQuery.length - 1, BlackQuery.length == ",")) {
        var black = ToGetCommonColorCount(BlackQuery);
        if (black == "") {
            tblfullQry = FullQuery1Bl + tblfullQry;
            if (FullQuery2Bl != "") {
                tblfullQry = FullQuery2Bl + tblfullQry;
            }
            if (FullQuery3Bl != "") {
                tblfullQry = FullQuery3Bl + tblfullQry;
            }
            if (FullQuery4Bl != "") {
                tblfullQry = FullQuery4Bl + tblfullQry;
            }
        }
        else {
            tblfullQry = tblfullQry + "," + black;
        }
    }
    if (GreenQuery.substring(GreenQuery.length - 1, GreenQuery.length == ",")) {
        var green = ToGetCommonColorCount(GreenQuery);
        if (green == "") {
            tblfullQry = FullQuery1G + tblfullQry;
            if (FullQuery2G != "") {
                tblfullQry = FullQuery2G + tblfullQry;
            }
            if (FullQuery3G != "") {
                tblfullQry = FullQuery3G + tblfullQry;
            }
            if (FullQuery4G != "") {
                tblfullQry = FullQuery4G + tblfullQry;
            }
        }
        else {
            tblfullQry = tblfullQry + "," + green;
        }
    }
    if (YellowQuery.substring(YellowQuery.length - 1, YellowQuery.length == ",")) {
        var yellow = ToGetCommonColorCount(YellowQuery);
        if (yellow == "") {
            tblfullQry = FullQuery1Y + tblfullQry;
            if (FullQuery2Y != "") {
                tblfullQry = FullQuery2Y + tblfullQry;
            }
            if (FullQuery3Y != "") {
                tblfullQry = FullQuery3Y + tblfullQry;
            }
            if (FullQuery4Y != "") {
                tblfullQry = FullQuery4Y + tblfullQry;
            }
        }
        else {
            tblfullQry = tblfullQry + "," + yellow;
        }
    }
    var LastFinalQry = ToRemoveLastFirstComma(tblfullQry);
    LastFinalQry = ReplaceComma(LastFinalQry);
    LastFinalQry = "Select " + LastFinalQry;
    //  alert(LastFinalQry);

    //  $("#HdnQry").val(LastFinalQry);
    // }
   
    GetCountStruct(Red, Blue, Black, Green, Yellow);
}

function TagTableMap() {
  
   
    var yourArray = new Array();
    var yourArray2 = new Array();
    $("#HdnUniqId1").val("");
    $("#HdnUniqId2").val("");
    $("#HdnUniqId3").val("");
    $("#HdnUniqId4").val("");

    $("#Hidden1").val("");
    $("#Hidden2").val("");
    $("#Hidden3").val("");
    $("#Hidden4").val("");


    var Error = 0;
    var Table1String = "", Table2String = "", Table3String = "", Table4String = "";
    var unqcol1 = "", unqcol2 = "", unqcol3 = "", unqcol4 = "";
    var uniqueid1 = "", uniqueid2 = "", uniqueid3 = "", uniqueid4 = "";
    var list1 = "", list2 = "", list3 = "", list4 = "";
    var FillCount = $("#HdnTblChkCount").val();

    uniqueid1 = $("#HdUniqueId1").val();
    uniqueid2 = $("#HdUniqueId2").val();
    uniqueid3 = $("#HdUniqueId3").val();
    uniqueid4 = $("#HdUniqueId4").val();
    list1 = $("#HdViewlist1").val();
    list2 = $("#HdViewlist2").val();
    list3 = $("#HdViewlist3").val();
    list4 = $("#HdViewlist4").val();

   
    if (FillCount == 2) {
        if (uniqueid1 != "" && uniqueid2 != "") {
            if (list1 != "" && list2 != "") {
                Error = 0;

                var table1list = list1.split(',');
                var table2list = list2.split(',');
                if (table1list.length <= 2 || table2list.length <= 2)
                {
                    Error = 1;
                    ShowErrorMessage('Please select an additional column along with the common key column.');
                }
            }           
            else {
                Error = 1;
              
                ShowErrorMessage('Please Select the Column Names.');
               
            }
        }
        else {
            Error = 1;
           
            ShowErrorMessage('Please Select An Unique Id for Tagging.');
           
            
        }
    }
    if (FillCount == 3) {
        if (uniqueid3 != "") {
            if (list3 != "") {
                Error = 0;
                var table3list = list3.split(',');
              
                if (table3list.length <= 2) {
                    Error = 1;
                    ShowErrorMessage('Please select an additional column along with the common key column.');
                }
            }
            else {
                Error = 1;
               
                ShowErrorMessage('Please Select the Column Names.');
                
            }
        }
        else {
            Error = 1;
           
            ShowErrorMessage('Please Select An Unique Id for Tagging.');
            
        }
    }
    if (FillCount == 4) {
        if (uniqueid4 != "") {
            if (list4 != "") {
                Error = 0;
                var table4list = list4.split(',');

                if (table4list.length <= 2) {
                    Error = 1;
                    ShowErrorMessage('Please select an additional column along with the common key column.');
                }
            }
            else {
                Error = 1;
               
                ShowErrorMessage('Please Select the Column Names.');
              
            }
        }
        else {
            Error = 1;
          
            ShowErrorMessage('Please Select An Unique Id for Tagging.');
            
        }
    }

    if (FillCount > 1 && Error == 0) {
        unqcol1 = UniqueColumn(uniqueid1);
        unqcol2 = UniqueColumn(uniqueid2);
        unqcol3 = UniqueColumn(uniqueid3);
        unqcol4 = UniqueColumn(uniqueid4);

        var tbl1name = GetTableName1(uniqueid1);
        var tbl2name = GetTableName1(uniqueid2);
        var tbl3name = GetTableName1(uniqueid3);
        var tbl4name = GetTableName1(uniqueid4)
        list1 = list1.substring(0, list1.length - 1);
        list2 = list2.substring(0, list2.length - 1);
        list3 = list3.substring(0, list3.length - 1);
        list4 = list4.substring(0, list4.length - 1);
        list1 = RemoveUniqueId(list1, unqcol1);
        list2 = RemoveUniqueId(list2, unqcol2);
        list3 = RemoveUniqueId(list3, unqcol3);
        list4 = RemoveUniqueId(list4, unqcol4);
        $("#HdnUniqId1").val(unqcol1.trim());
        $("#HdnUniqId2").val(unqcol2.trim());
        $("#HdnUniqId3").val(unqcol3.trim());
        $("#HdnUniqId4").val(unqcol4.trim());


        if (FillCount == 4) {
            //if (unqcol1 == unqcol2 && unqcol1 == unqcol3 && unqcol1 == unqcol4) {
            //    Error = 0;
            Table1String = "Select " + list1 + " from " + tbl1name;
            Table2String = "Select " + list2 + " from " + tbl2name;
            Table3String = "Select " + list3 + " from " + tbl3name;
            Table4String = "Select " + list4 + " from " + tbl4name;
            //}
            //else {
            //    Error = 1;
            //    ShowErrorMessage('Unique Id for Tagging should be same !!');
            //}
        }
        if (FillCount == 3) {
            Table1String = "Select " + list1 + " from " + tbl1name;
            Table2String = "Select " + list2 + " from " + tbl2name;
            Table3String = "Select " + list3 + " from " + tbl3name;
            Table4String = "";
        }
        if (FillCount == 2) {
            Table1String = "Select " + list1 + " from " + tbl1name;
            Table2String = "Select " + list2 + " from " + tbl2name;
            Table3String = "";
            Table4String = "";
        }

        $("#Hidden1").val(Table1String);
        $("#Hidden2").val(Table2String);
        $("#Hidden3").val(Table3String);
        $("#Hidden4").val(Table4String);
        sessionStorage.setItem("TagcheckDm", 0);
        GetMapStruct(list1, list2, list3, list4);
    }
    else
    {
        sessionStorage.setItem("TagcheckDm", 1);
        //CheckTagging();
    }

}

function ToRemoveLastFirstComma(str) {
    var string = str;
    if (string.substring(string.length - 1, string.length) == ",") {
        var k = string.substring(0, string.length - 1);
        string = k;
    }
    if (string.charAt(0) === ',') {
        string = string.slice(1);
    }
    return string;
}

//Replace double comma to single comma
function ReplaceComma(str) {
    var find1 = ",,";
    var re1 = new RegExp(find1, 'g');
    str = str.replace(re1, ",");

    return str;
}

function ToGetCommonColorCount(str) {
    var qqrryy = "";
    str = str.substring(0, str.length - 1);
    var col = str.split(",(");
    if (col.length > 1) {
        var column = col[0].match(/[^[\]]+(?=])/g);
        if (col.length == 2) {
            qqrryy = "(select SUM([Total]) from " + col[0] + " Union All " + col[1] + ")as x)as [" + column + "]";
        }
        if (col.length == 3) {
            qqrryy = "(select SUM([Total]) from " + col[0] + " Union All " + col[1] + " Union All " + col[2] + ")as x)as [" + column + "]";
        }
        if (col.length == 4) {
            qqrryy = "(select SUM([Total]) from " + col[0] + " Union All " + col[1] + " Union All " + col[2] + " Union All " + col[3] + ")as x)as [" + column + "]";
        }
    }
    return qqrryy;
}

function GetTableName(TableName) {
    var TblName1 = TableName.substring(TableName.indexOf("~!"));
    var tbllen = TblName1.indexOf("-");
    TblName1 = TblName1.substring(0, tbllen);
    TblName1 = TblName1.replace("~!", "");
    return TblName1;
}

function GetTableName1(TableName) {
    var TblName1 = TableName;
    var tbllen = TableName.substring(TableName.indexOf("~-")).length;
    TblName1 = TblName1.substring(0, TblName1.length - tbllen);
    return TblName1;
}

function UniqueColumn(UniqueCol) {
    var UniqueCol1 = UniqueCol.substring(UniqueCol.indexOf("~-"));
    var tbllen = UniqueCol1.indexOf("~!");
    UniqueCol1 = UniqueCol1.substring(0, tbllen);
    UniqueCol1 = UniqueCol1.replace("~-", "");
    return UniqueCol1;
}

function GetColumnName(ColumnName) {
    var searchhref = ColumnName.substring(ColumnName.indexOf("~"));
    var leng = searchhref.indexOf("~!");
    searchhref = searchhref.substring(0, leng);
    searchhref = searchhref.replace("~", "");
    return searchhref;
}

//To remove Checked UniqueId from the column lists
function RemoveUniqueId(List, UniqueId) {
    var ReturnList = List;
    // if (ReturnList.indexOf(UniqueId) != -1) {
    if (ReturnList.match("\\b" + UniqueId + "\\b")) {
        ReturnList = ReturnList.replace(UniqueId, "");
    }
    else {
        ReturnList = ReturnList;
    }
    ReturnList = ToRemoveLastFirstComma(ReturnList);
    ReturnList = ReplaceComma(ReturnList);
    return ReturnList;
}

//function CheckTagging()
//{
//    var returnvalueforsession = "";
//    sessionStorage.setItem("issync", 1);
//    returnvalueforsession=sessionStorage.getItem("issync");
//    return returnvalueforsession;
//}