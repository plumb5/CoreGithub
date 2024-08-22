
$(".iconTopNav").click(function () {
    $(this).next().toggleClass("showDiv");
});

$(".icon.ion-ios-printer-outline").click(function () {
    //window.print();
    $(".container").printThis({
        debug: false, // show the iframe for debugging
        importCSS: true, // import parent page css
        importStyle: false, // import style tags
        printContainer: true, // print outer container/$.selector
        loadCSS: "../Content/css/plumb5-style.css", // path to additional css file - use an array [] for multiple
        pageTitle: "", // add title to print page
        removeInline: false, // remove inline styles from print elements
        removeInlineSelector: "*", // custom selectors to filter inline styles. removeInline must be true
        printDelay: 333, // variable print delay
        header: null, // prefix to html
        footer: null, // postfix to html
        base: false, // preserve the BASE tag or accept a string for the URL
        formValues: true, // preserve input/form values
        canvas: true, // copy canvas content
        doctypeString: "...", // enter a different doctype for older markup
        removeScripts: false, // remove script tags from print content
        copyTagClasses: false, // copy classes from the html & body tag
        beforePrintEvent: null, // function for printEvent in iframe
        beforePrint: null, // function called before iframe is filled
        afterPrint: null, // function called before iframe is removed
    });
});

$(".selchbxall").click(function () {
    if ($(this).is(":checked")) {
        $(".selChk").prop('checked', true);
    } else {
        $(".selChk").prop('checked', false);;
    }

});

$('.barMenu').on('click', function (e) {
    e.preventDefault();
    if (window.matchMedia('(min-width: 1200px)').matches) {
        $('body').toggleClass('container-flex');
    } else {
        $('body').toggleClass('show-sidebar');
    }
});

$(".btnFilItem .dropdown-menu .dropdown-item").click(function () {
    var getDrpListVal = $(this).text();
    $(this).parent().prev().html(getDrpListVal + '<i class="icon ion-android-arrow-dropdown"></i>');
});



$("#addFilterItem").click(function () {
    var filtContent = $(this).parent().prev('.filterMainAppnd').children().html();
    $(".filterMainAppnd").append(filtContent);
});

$(".clseFitr").click(function () {
    $(this).parents(".filterWap").addClass('hideDiv');
});

$(".filterWrap").click(function () {
    $(".filterWap").toggleClass('hideDiv');
});

$(".filterMainAppnd").on("click", ".clseWrapFilt", function (e) {
    if ($('.filterItem').length == 1 && $('.andFiltWrap').length == 1) {
        e.preventDefault();
    } else {
        $(this).parents('.filterItem').next(".andFiltWrap").remove();
        $(this).parents('.filterItem').remove();
    }

});

$(".dropdown-menu.keepopen").click(function (e) {
    e.stopPropagation();
});

$(".topbandWrap i.ion-android-close").click(function () {
    $(".tableWrapper").removeClass("h-400");
    $(this).parents('.rightPopupwrap').removeClass('showFlx');
});

setTimeout(function () {
    $(".lmsphonecallwrap").addClass("lmsphonecallshow");
}, 2000);

$(".lmsphonereject").click(function () {
    $(".lmsphonecallwrap").removeClass("lmsphonecallshow");
});