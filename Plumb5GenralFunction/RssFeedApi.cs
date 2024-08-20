using Newtonsoft.Json;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Xml;

namespace Plumb5GenralFunction
{
    public class RSSFeedModel
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string RedirectTo { get; set; }
        public string RssPubDate { get; set; }
    }

    public class RssFeedApi
    {
        public RSSFeedModel GetRssDetails(WebPushRssFeed webPushRssFeed)
        {
            RSSFeedModel rssModel = new RSSFeedModel();
            XmlDocument _doc = new XmlDocument();
            try
            {
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls
                       | SecurityProtocolType.Tls11
                       | SecurityProtocolType.Tls12;

                _doc.Load(webPushRssFeed.RssUrl);

                XmlNodeList item = _doc.GetElementsByTagName("item");
                if (item.Count == 0)
                    item = _doc.GetElementsByTagName("channel");
                var freach = 0;
                foreach (XmlNode nodeItem in item)
                {
                    foreach (XmlNode nodeChild in nodeItem.ChildNodes)
                    {
                        if (nodeChild.Name == "title")
                        {
                            rssModel.Title = nodeChild.InnerText.ToString();

                            if (rssModel.Title.Length > 99)
                            {
                                rssModel.Title = rssModel.Title.Substring(0, 99);
                            }
                        }
                        else if (nodeChild.Name == "link")
                        {
                            rssModel.RedirectTo = nodeChild.InnerText.ToString();
                        }
                        else if (nodeChild.Name == "pubDate")
                        {
                            var date = nodeChild.InnerText.ToString();
                            var date2 = Convert.ToDateTime(date).ToString("yyyy/MM/dd HH:mm:ss");
                            rssModel.RssPubDate = date2.ToString();
                        }
                        else if (nodeChild.Name == "description")
                        {
                            rssModel.Description = nodeChild.InnerText.ToString();
                            if (rssModel.Description.Length > 499)
                            {
                                rssModel.Description = rssModel.Description.Substring(0, 499);
                            }
                        }

                        if (rssModel.Title != null && rssModel.RedirectTo != null && rssModel.Description != null && rssModel.RssPubDate != null)
                        {
                            freach = 1;
                            break;
                        }
                    }
                    if (freach == 1)
                        break;
                }
            }
            catch (Exception ex)
            {
                ErrorUpdation.AddErrorLog("RssFeedApi", JsonConvert.SerializeObject(new { InnerXml = _doc.InnerXml.ToString(), webPushRssFeed = webPushRssFeed, Error = ex.Message }), "Rss Feed Api Calling Error", DateTime.Now, "WebPushTest-->RssFeedApi-->GetRssDetails", ex.StackTrace, true);
            }

            return rssModel;
        }
        public Tuple<RSSFeedModel, string> GetRssDetails(string RssUrl)
        {
            RSSFeedModel rssModel = new RSSFeedModel();
            string ErrorMessage = string.Empty;
            XmlDocument _doc = new XmlDocument();
            try
            {
                ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls
                       | SecurityProtocolType.Tls11
                       | SecurityProtocolType.Tls12;

                _doc.Load(RssUrl);

                XmlNodeList item = _doc.GetElementsByTagName("item");
                if (item.Count == 0)
                    item = _doc.GetElementsByTagName("channel");
                var freach = 0;
                foreach (XmlNode nodeItem in item)
                {
                    foreach (XmlNode nodeChild in nodeItem.ChildNodes)
                    {
                        if (nodeChild.Name == "title")
                        {
                            rssModel.Title = nodeChild.InnerText.ToString();

                            if (rssModel.Title.Length > 99)
                            {
                                rssModel.Title = rssModel.Title.Substring(0, 99);
                            }
                        }
                        else if (nodeChild.Name == "link")
                        {
                            rssModel.RedirectTo = nodeChild.InnerText.ToString();
                        }
                        else if (nodeChild.Name == "pubDate")
                        {
                            var date = nodeChild.InnerText.ToString();
                            var date2 = Convert.ToDateTime(date).ToString("yyyy/MM/dd HH:mm:ss");
                            rssModel.RssPubDate = date2.ToString();
                        }
                        else if (nodeChild.Name == "description")
                        {
                            rssModel.Description = nodeChild.InnerText.ToString();
                            if (rssModel.Description.Length > 499)
                            {
                                rssModel.Description = rssModel.Description.Substring(0, 499);
                            }
                        }

                        if (rssModel.Title != null && rssModel.RedirectTo != null && rssModel.Description != null && rssModel.RssPubDate != null)
                        {
                            freach = 1;
                            break;
                        }
                    }
                    if (freach == 1)
                        break;
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = ex.Message;
                ErrorUpdation.AddErrorLog("RssFeedApi", JsonConvert.SerializeObject(new { InnerXml = _doc.InnerXml.ToString(), webPushRssFeedURL = RssUrl, Error = ex.Message }), "Rss Feed Api Calling Error", DateTime.Now, "WebPushTest-->RssFeedApi-->GetRssDetails", ex.StackTrace);
            }

            return Tuple.Create(rssModel, ErrorMessage);
        }
    }
}
