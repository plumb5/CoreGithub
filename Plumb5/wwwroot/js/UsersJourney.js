$(document).ready(() => {
    $('#ui_divContactUCPScreen').css('margin-top', '76px');
    $('#ui_divCloseUCP').css('display', 'none');
    $('.sidebar,.barMenu').css('display', 'none');
    $('.dropdown-item').css('display', 'none');
    $('a[href="/Login/SignOut"]').css('display', 'block');

    const aid = $.urlParam("aid")
    const mid = $.urlParam("mid");
    const cid = $.urlParam("cid")
    const label = document.getElementById("urlid");
    if (mid == 0 && cid == 0) { 
        label.style.display = "inline";
    }
    else {
        label.style.display = "None";
        ShowContactUCP($.urlParam("mid"), "", $.urlParam("cid"));
    }
    

});