$(document).ready(function () {
    HidePageLoading();
});


$('#ui_btn_CopyScript').click(function () {
    var range = document.createRange();
    range.selectNode(document.getElementById('ui_code_AccountScriptDetails'));
    window.getSelection().addRange(range);
    document.execCommand("copy");
});


