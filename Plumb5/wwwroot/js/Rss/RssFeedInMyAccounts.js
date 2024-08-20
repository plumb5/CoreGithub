////From jQuery Direct Fetch As XML - RSS Feed - Plumb5 - Updated by Mbn @ 16 June 2017
//var query = 'select * from rss where url = "http://blackbox4.wordpress.com/feed/"';
//var yql = window.location.protocol + "//query.yahooapis.com/v1/public/yql?q=" + query;
//$(document).ready(function () {
//    $.ajax({
//        dataType: "xml",
//        url: yql,
//        success: function (response) {
//            var resXml = response;//response.activeElement.innerHTML;
//            var rssContent = "";
//            $(resXml).find("item").each(function (index) {
//                var title = $(this.innerHTML)[0].innerText.trim();
//                var link = $(this.innerHTML)[3].data.trim();
//                var description = $(this)[0].innerHTML.substring($(this)[0].innerHTML.indexOf("<description><![CDATA[") + 22).toString();
//                rssContent += "<div style='width:100%;font-family:Source Sans Pro,sans-serif;float:left;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'><a class='tick' style='font-size:20px;color:#795548;' target='_blank' title='" +
//                    title + "' href='" + link + "'>" + title + "</a></div>" +
//                    "<div style='width:100%;font-family:Source Sans Pro,sans-serif;font-size:15px;color: #646464;float:left'><span>" +
//                    (description.toString().length > 200 ? description.toString().substring(0, 150).toString() + "..." : description) + "</span><br /><br /></div>";
//                if (index === 2) return false;
//            });
//            $("#dvContentThings").html(rssContent);
//        },
//        error: function () {
//        }
//    });
//});
$(document).ready(function () {
    var yql = window.location.protocol + "//query.yahooapis.com/v1/public/yql?q=select%20title%2Clink%2Cdescription%20from%20rss%20where%20url%3D%22https%3A%2F%2Fblackbox4.wordpress.com%2Ffeed%3Fformat%3Dxml%22&format=json&diagnostics=true&callback=";
    var rssContent = "";
    $.getJSON(yql, function (data) {
        $.each(data.query.results.item, function (i) {
            var title = data.query.results.item[i].title;
            var description = data.query.results.item[i].description;
            var link = data.query.results.item[i].link;
            rssContent += "<div style='width:100%;font-family:Source Sans Pro,sans-serif;float:left;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'><a class='tick' style='font-size:20px;color:#795548;' target='_blank' title='" +
                title + "' href='" + link + "'>" + title + "</a></div>" +
                "<div style='width:100%;font-family:Source Sans Pro,sans-serif;font-size:15px;color: #646464;float:left'>" +
                (description.toString().length > 200 ? description.toString().substring(0, 150) + "...<br>" : description) + "<br></div>";
            if (i === 2) return false;
        });
        $("#dvContentThings").html(rssContent);
    });
});
