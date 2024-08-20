//var rssContent = "";
//var rssFeedUrl = "http://blackbox4.wordpress.com/feed/";
//rssFeedUrl = document.location.protocol === "https:" ? rssFeedUrl.replace("http", "https") : rssFeedUrl;
//google.load("feeds", "1");
//$(document).ready(function () {
//    google.setOnLoadCallback(RssLoadData());
//});
//RssLoadData = function () {
//    var feed = new google.feeds.Feed(rssFeedUrl);
//    feed.setNumEntries(3);
//    feed.load(function (result) {
//        if (!result.error) {
//            $.each(result.feed.entries, function () {
//                rssContent += "<div style='width:100%;font-family:Source Sans Pro,sans-serif;float:left;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'><a class='tick' style='font-size:20px;color:#795548;' target='_blank' title='" + this.title + "' href='" + this.link + "'>" + this.title + "</a></div>" +
//                    "<div style='width:100%;font-family:Source Sans Pro,sans-serif;font-size:15px;color: #646464;float:left'>" + this.contentSnippet + "</div><br/><br/><br/><br/>";
//            });
//            if (rssContent == "")
//                $("#dvContentThings").html("There is no published data at this time !!").attr("class", "descrip").css("font-size", "16px").attr("padding", "10px");
//            else
//                $("#dvContentThings").html(rssContent);
//        } else {
//            $("#dvContentThings").html("There is no published data at this time !!").attr("class", "descrip").css("font-size", "16px").attr("padding", "10px");
//        }
//    });
//};


//var rssFeedUrl = "http://blackbox4.wordpress.com/feed/";
//rssFeedUrl = document.location.protocol === "https:" ? rssFeedUrl.replace("http", "https") : rssFeedUrl;
//YUI().use('yql', function (y) {
//    var rssContent = "";
//    var query = 'select * from rss(0,3) where url = "' + rssFeedUrl + "\"";
//    var q = y.YQL(query, function (r) {
//        //r now contains the result of the YQL Query as a JSON
//        var feed = r.query.results.item; // get feed as array of entries
//        for (var i = 0; i < feed.length; i++) {
//            rssContent += "<div style='width:100%;font-family:Source Sans Pro,sans-serif;float:left;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'><a class='tick' style='font-size:20px;color:#795548;' target='_blank' title='" +
//                feed[i].title + "' href='" + feed[i].link + "'>" + feed[i].title + "</a></div>" +
//                "<div style='width:100%;font-family:Source Sans Pro,sans-serif;font-size:15px;color: #646464;float:left'>" +
//                ({shortBodyPlain}.length > 200 ? {shortBodyPlain}.toString().substring(0, 150) + "...<br>" : {shortBodyPlain}) + "<br></div>";
//        }
//        if (rssContent == "")
//            $("#dvContentThings").html("There is no published data at this time !!").attr("class", "descrip").css("font-size", "16px").attr("padding", "10px");
//        else
//            $("#dvContentThings").html(rssContent);
//    });
//})


    jQuery(function ($) {
        $("#dvContentThings").rss("http://blackbox4.wordpress.com/feed/",
        {
            limit: 3,
            ssl: true,
            entryTemplate: "<div id='rssfeed' style='width:101%;font-family:Source Sans Pro,sans-serif;float:left;display:inline-block;overflow:hidden;text-overflow:ellipsis;height:4.2em;margin-left:-32px;color:gray'><a class='tick' style='font-size:20px;color:#795548;white-space:nowrap;' target='_blank' title='{url}' href='{url}'>{title}</a><br/>" + '{shortBodyPlain}'.substring(0, 20) + "..." + "</div><div style='width:100%;font-family:Source Sans Pro,sans-serif;font-size:15px;color:#646464;float:left;overflow:hidden;text-overflow:ellipses'><br></div>"
        })
    });
    $("#dvLoading").css('display', 'none');



