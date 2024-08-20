function BindCorresponding(mainDrpIndex, relationDrpIndex) {
    var contect = parent.pre_formFields[relationDrpIndex].SubFields.split("!");
    var masterDll = contect[0];
    var subData = contect[1];
    var eachMasterData = masterDll.split("%");
    var eachSubData = subData.split("%");
    var selectedValue = $("#ui_Field" + mainDrpIndex).val();

    var index = eachMasterData.indexOf(selectedValue);

    var bindSubdata = eachSubData[index];

    var each = bindSubdata.split(",");
    $("#ui_Field" + relationDrpIndex).empty();
    for (var i = 0; i < each.length; i++) {
        var drpbind = '<option value="' + each[i] + '">' + each[i] + '</option>';
        $("#ui_Field" + relationDrpIndex).append(drpbind);
    }
}