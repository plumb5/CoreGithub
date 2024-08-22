function imageManager(val) {
    $('html').css('overflow', 'hidden');
    $("#dv_back").css("height", $(document).height() + "px");
    $("#dv_back").show();
    $("#dv_IconManager").fadeIn('slow');
    $(".libbtn").hide();
    $("#libdefaultIcons" + val).show();
    $("#libcustomIcons" + val).show();
    $("#libdefaultIcons" + val).addClass("btn-primary");
    $("#libdefaultIcons" + val).removeClass("btn-default");
    $("#libcustomIcons" + val).addClass("btn-default");
    switch (val) {
        case 1:
            $("#dv_default1").show();
            $("#dv_default2").hide();
            $("#dv_default3").hide();
            $("#dv_default4").hide();
            $("#dv_default5").hide();
            $("#dv_default6").hide();
            $("#dv_custom1").hide();
            $("#dv_custom2").hide();
            $("#dv_custom3").hide();
            $("#dv_custom4").hide();
            $("#dv_custom5").hide();
            $("#dv_custom6").hide();
            break;
        case 2:
            if ($("#ui_YesRNoImage").is(":checked")) {
                $("#dv_default2").show();
                $("#dv_default1").hide();
                $("#dv_default3").hide();
                $("#dv_default4").hide();
                $("#dv_default5").hide();
                $("#dv_default6").hide();
                $("#dv_custom1").hide();
                $("#dv_custom2").hide();
                $("#dv_custom3").hide();
                $("#dv_custom4").hide();
                $("#dv_custom5").hide();
                $("#dv_custom6").hide();
            }
            break;
        case 3:
            $("#dv_default3").show();
            $("#dv_default1").hide();
            $("#dv_default2").hide();
            $("#dv_default4").hide();
            $("#dv_default5").hide();
            $("#dv_default6").hide();
            $("#dv_custom1").hide();
            $("#dv_custom2").hide();
            $("#dv_custom3").hide();
            $("#dv_custom3").hide();
            $("#dv_custom4").hide();
            $("#dv_custom5").hide();
            $("#dv_custom6").hide();
            break;
        case 4:
            $("#dv_default4").show();
            $("#dv_default1").hide();
            $("#dv_default2").hide();
            $("#dv_default3").hide();
            $("#dv_default5").hide();
            $("#dv_default6").hide();
            $("#dv_custom1").hide();
            $("#dv_custom2").hide();
            $("#dv_custom3").hide();
            $("#dv_custom3").hide();
            $("#dv_custom4").hide();
            $("#dv_custom5").hide();
            $("#dv_custom6").hide();
            break;
        case 5:
            $("#dv_default5").show();
            $("#dv_default1").hide();
            $("#dv_default2").hide();
            $("#dv_default3").hide();
            $("#dv_default4").hide();
            $("#dv_default6").hide();
            $("#dv_custom1").hide();
            $("#dv_custom2").hide();
            $("#dv_custom3").hide();
            $("#dv_custom3").hide();
            $("#dv_custom4").hide();
            $("#dv_custom5").hide();
            $("#dv_custom6").hide();
            break;
        case 6:
            $("#dv_default6").show();
            $("#dv_default1").hide();
            $("#dv_default2").hide();
            $("#dv_default3").hide();
            $("#dv_default4").hide();
            $("#dv_default5").hide();
            $("#dv_custom1").hide();
            $("#dv_custom2").hide();
            $("#dv_custom3").hide();
            $("#dv_custom3").hide();
            $("#dv_custom4").hide();
            $("#dv_custom5").hide();
            $("#dv_custom6").hide();
            break;
    }
}

$("#ui_YesRNoImage").click(function () {
    if ($("#ui_YesRNoImage").is(":checked")) {
        $("#dv_ImageIntermediate").show();
        $("#dv_DisImgs").show();
    }
    else {
        $("#dv_ImageIntermediate").hide();
        $("#dv_DisImgs").hide();
    }
});

function notidefaultIcons(val, num) {
    if (num == 1) {
        $("#dv_default" + val).css("display", "none");
        $("#dv_custom" + val).css("display", "block");
        $("#libcustomIcons" + val).addClass("btn-primary");
        $("#libcustomIcons" + val).removeClass("btn-default");
        $("#libdefaultIcons" + val).addClass("btn-default");
        $(".close-Btn").css("color", "#616161");
    } else {
        $("#dv_default" + val).css("display", "block");
        $("#dv_custom" + val).css("display", "none");
        $("#libdefaultIcons" + val).addClass("btn-primary");
        $("#libdefaultIcons" + val).removeClass("btn-default");
        $("#libcustomIcons" + val).addClass("btn-default");
        $(".close-Btn").css("color", "#fdfafa");
    }
}
function selectIcon(val, id) {
    $("#logo_upload" + val).val('');
    switch (val) {
        case 1:
            if (id == 1) {
                if ($("#drp_ticker").val() == "image")
                    $("#img_uploading1").attr("src", "/images/trynotify.png");
                else
                    $("#img_uploading").attr("src", "/images/trynotify.png");
                $(".iz_1").removeClass("slct_icon");
                $("#img1_" + id).addClass("slct_icon");
            }
            else {
                if ($("#drp_ticker").val() == "image")
                    $("#img_uploading1").attr("src", "/images/pushicon/" + (id - 1) + ".png");
                else
                    $("#img_uploading").attr("src", "/images/pushicon/" + (id - 1) + ".png");
                $(".iz_1").removeClass("slct_icon");
                $("#img1_" + id).addClass("slct_icon");
            }
            break;
        case 2:
            if (id == 1) {
                $("#img_uploading2").attr("src", "/images/trynotify.png");
                $(".iz_2").removeClass("slct_icon");
                $("#img2_" + id).addClass("slct_icon");
            }
            else {
                $("#img_uploading2").attr("src", "/images/pushicon/" + (id - 1) + ".png");
                $(".iz_2").removeClass("slct_icon");
                $("#img2_" + id).addClass("slct_icon");
            }
            break;
        case 3:
            if (id == 1) {
                $("#img_uploading3").attr("src", "/images/trynotify.png");
                $(".iz_3").removeClass("slct_icon");
                $("#img3_" + id).addClass("slct_icon");
            }
            else {
                $("#img_uploading3").attr("src", "/images/pushicon/" + (id - 1) + ".png");
                $(".iz_3").removeClass("slct_icon");
                $("#img3_" + id).addClass("slct_icon");
            }
            break;
        case 4:
            if (id == 1) {
                $("#img_uploading4").attr("src", "/images/trynotify.png");
                $("#imgbtn1").attr("src", "/images/trynotify.png");
                $(".iz_4").removeClass("slct_icon");
                $("#img4_" + id).addClass("slct_icon");
            }
            else {
                $("#img_uploading4").attr("src", "/images/pushicon/" + (id - 1) + ".png");
                $("#imgbtn1").attr("src", "/images/pushicon/" + (id - 1) + ".png");
                $(".iz_4").removeClass("slct_icon");
                $("#img4_" + id).addClass("slct_icon");
            }
            break;
        case 5:
            if (id == 1) {
                $("#img_uploading5").attr("src", "/images/trynotify.png");
                $("#imgbtn2").attr("src", "/images/trynotify.png");
                $(".iz_5").removeClass("slct_icon");
                $("#img5_" + id).addClass("slct_icon");
            }
            else {
                $("#img_uploading5").attr("src", "/images/pushicon/" + (id - 1) + ".png");
                $("#imgbtn2").attr("src", "/images/pushicon/" + (id - 1) + ".png");
                $(".iz_5").removeClass("slct_icon");
                $("#img5_" + id).addClass("slct_icon");
            }
            break;
        case 6:
            if (id == 1) {
                $("#img_uploading6").attr("src", "/images/trynotify.png");
                $(".iz_6").removeClass("slct_icon");
                $("#img6_" + id).addClass("slct_icon");
            }
            else {
                $("#img_uploading6").attr("src", "/images/pushicon/" + (id - 1) + ".png");
                $(".iz_6").removeClass("slct_icon");
                $("#img6_" + id).addClass("slct_icon");
            }
            break;
    }
}
function NoIcon(val) {
    switch (val) {
        case 4:
            $("#dv_extImg0").hide();
            $("#imgbtn1").css('opacity', 0);
            $("#span_btn1").css("left", "-24px");
            break;
        case 5:
            $("#dv_extImg01").hide();
            $("#imgbtn2").css('opacity', 0);
            $("#span_btn2").css("left", "-24px");
            break;
        case 6:
            $("#dv_extImg02").hide();
            break;
    }
}
function IconShow(val) {
    switch (val) {
        case 4:
            $("#dv_extImg0").show();
            $("#dv_btn1").show();
            $("#imgbtn1").css('opacity', 1);
            $("#span_btn1").css("left", "3px");
            $("#imgbtn1").attr('src', window.img_uploading4.src);
            break;
        case 5:
            $("#dv_extImg01").show();
            $("#dv_btn2").show();
            $("#imgbtn2").css('opacity', 1);
            $("#span_btn2").css("left", "3px");
            $("#imgbtn2").attr('src', window.img_uploading5.src);
            break;
        case 6:
            $("#dv_extImg02").show();
            break;
    }
}
function Close() {
    $("#dv_back").hide();
    $('html').css('overflow-y', 'scroll');
    $("#dv_IconManager").fadeOut('slow');
}
$(document).ready(function () {
    $('.dvManager').click(function (event) {
        event.stopPropagation();
    });
});
$(document).click(function (e) {
    var targetbox = $('#dv_IconManager');
    if (!targetbox.is(e.target) && targetbox.has(e.target).length === 0) {
        $('#dv_IconManager').fadeOut('slow');
        $("#dv_back").hide();
        $('html').css('overflow-y', 'scroll');
    }
});