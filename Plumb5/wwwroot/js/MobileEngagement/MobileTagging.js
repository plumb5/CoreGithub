$(document).ready(function () {
    //var html = '<div class="mobiledroptarget" style="display: none"><div id="div_taggingheader" style="cursor:pointer;">Tagging</div>' +
    //'<p ondragstart="dragStart(event)" draggable="true" id="p_name">&lt;!--NAME--&gt;</p>' +
    //'<p ondragstart="dragStart(event)" draggable="true" id="p_email">&lt;!--EMAILID--&gt;</p>' +
    //'<p ondragstart="dragStart(event)" draggable="true" id="p_phone">&lt;!--ContactNumber--&gt;</p></div>' +
    //'<div style="font-size: 18px; color: #4CAF50; font-weight: bold; cursor: pointer;"><span id="span_tagging">Tagging</span></div>';
    //$("body").append(html);

    $("#span_tagging").click(function () {
        $(".mobiledroptarget").show();
        $("#span_tagging").hide();
    });
    $("#div_taggingheader").click(function () {
        $(".mobiledroptarget").hide();
        $("#span_tagging").show();
    });
    $("input:text").attr("ondrop", "drop(event)").attr("ondragover", "allowDrop(event)");
    $(".taggingVal").attr("ondrop", "drop(event)").attr("ondragover", "allowDrop(event)");
});
function dragStart(event) {
    event.dataTransfer.setData("Text", event.target.id);
}
function allowDrop(event) {
    event.preventDefault();
}
function drop(event) {
    event.preventDefault();
    var data = event.dataTransfer.getData("Text");
    if (event.target.className.indexOf("taggingVal") > -1)
        event.target.value += (event.target.value != "" ? " " : "") + document.getElementById(data).innerText;
    //setTimeout(function () { ChangeText('Text', event.target.value); }, 100);
}