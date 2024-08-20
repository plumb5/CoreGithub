var rssContent = "";
var rssFeedUrl = "http://blackbox4.wordpress.com/feed/";
rssFeedUrl = document.location.protocol === "https:" ? rssFeedUrl.replace("http", "https") : rssFeedUrl;
google.load("feeds", "1");
$(document).ready(function () {
    RssLoadData();
});
RssLoadData = function () {
    var feed = new google.feeds.Feed(rssFeedUrl);
    feed.setNumEntries(3);
    feed.load(function (result) {
        if (!result.error) {
            $.each(result.feed.entries, function () {
                rssContent += "<div style='width:100%;font-family:Source Sans Pro,sans-serif;float:left;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;'><a class='tick' style='font-size:20px;color:#795548;' target='_blank' title='" + this.title + "' href='" + this.link + "'>" + this.title + "</a></div>" +
                    "<div style='width:100%;font-family:Source Sans Pro,sans-serif;font-size:15px;color: #646464;float:left'>" + this.contentSnippet + "</div><br/><br/><br/><br/>";
            });
            if (rssContent == "")
                $("#dvContentThings").html("There is no published data at this time !!").attr("class", "descrip").css("font-size", "16px").attr("padding", "10px");
            else
                $("#dvContentThings").html(rssContent);
        } else {
            $("#dvContentThings").html("There is no published data at this time !!").attr("class", "descrip").css("font-size", "16px").attr("padding", "10px");
        }
    });
};