using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Data;
using System.Globalization;
using System.Web;
using Facebook;
using HtmlAgilityPack;

namespace Plumb5.Areas.FacebookPage.Models
{
    public class p5FBManager
    {
        #region Private Variables
        private readonly string fbAppID = string.Empty;
        private readonly string fbAppSecret = string.Empty;
        private string AccountName = string.Empty;
        private string AccountID = string.Empty;
        private string accessToken = string.Empty;
        private string longAccessToken = string.Empty;
        #endregion
        public List<Page> pageList = new List<Page>();
        public p5FBManager(string sAppID, string sAppSecret)
        {
            this.fbAppID = sAppID;
            this.fbAppSecret = sAppSecret;

        }
        public string initTokenAccess(string RequestAccessToken)
        {
            try
            {
                this.accessToken = RequestAccessToken;
                var client = new FacebookClient(this.accessToken);
                dynamic result = client.Get("me", new { fields = "name,id" });
                this.AccountName = result.name;
                this.AccountID = result.id;
                GetExtendedAccessToken(this.accessToken);
                GetExtendedPageAccessToken();
            }
            catch (Exception ex)
            {
                throw (ex);
            }

            return JsonConvert.SerializeObject(pageList, new JsonSerializerSettings { TypeNameHandling = TypeNameHandling.Objects });

        }
        public void initTokenJson(string tokenJSON)
        {
            this.pageList = JsonConvert.DeserializeObject<List<Page>>(tokenJSON, new JsonSerializerSettings { TypeNameHandling = TypeNameHandling.Objects });
        }
        public static string getURLMetaTags(string sURL)
        {
            dynamic retval = new System.Dynamic.ExpandoObject();
            retval.Title = String.Empty;
            retval.Description = String.Empty;
            retval.ImageUrl = String.Empty;
            try
            {

                var webGet = new HtmlWeb();
                webGet.UserAgent = "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36";
                HtmlDocument document = webGet.Load(sURL);
                var metaTags = document.DocumentNode.SelectNodes("//meta");
                if (metaTags != null)
                {
                    foreach (var tag in metaTags)
                    {
                        var tagName = tag.Attributes["name"];
                        var tagContent = tag.Attributes["content"];
                        var tagProperty = tag.Attributes["property"];
                        if (tagProperty != null && tagContent != null && tagProperty.Value != null)
                        {
                            switch (tagProperty.Value.ToLower())
                            {
                                case "og:title":
                                    retval.Title = tagContent.Value;
                                    break;
                                case "og:description":
                                    retval.Description = tagContent.Value;
                                    break;
                                case "og:image":
                                    retval.ImageUrl = tagContent.Value;
                                    break;
                            }
                        }
                    }

                    return JsonConvert.SerializeObject(retval);

                }
            }
            catch
            {
                retval.Title = String.Empty;
                retval.Description = String.Empty;
                retval.ImageUrl = String.Empty;
            }
            return JsonConvert.SerializeObject(retval, Formatting.Indented);
        }
        public string getLeads(Page _page, DateTime LastFetchDate)
        {
            string retval = string.Empty;
            List<dynamic> LeadList = new List<dynamic>();
            try
            {
                var fbc = new FacebookClient();
                var edgeurl = _page.ID + "/leadgen_forms?fields=id";
                dynamic result = fbc.Get(edgeurl, new
                {
                    access_token = _page.pgAccessToken
                });
                foreach (dynamic row in result.data)
                {
                    edgeurl = row.id + "/leads?fields=created_time,id,ad_id,form_id,field_data";
                    int unixTime = (Int32)(LastFetchDate.ToUniversalTime().Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
                    dynamic leadResults = fbc.Get(edgeurl, new
                    {
                        filtering = "[{'field': 'time_created','operator': 'GREATER_THAN','value': " + unixTime + "}]",
                        access_token = _page.pgAccessToken
                    });
                    foreach (dynamic leadrow in leadResults.data)
                    {
                        dynamic lead = new System.Dynamic.ExpandoObject();
                        lead.created_time = leadrow.created_time;
                        lead.id = leadrow.id;
                        lead.form_id = leadrow.form_id;
                        lead.ad_id = leadrow.ad_id;
                        foreach (dynamic leadData in leadrow.field_data)
                        {
                            string FldName = leadData.name;
                            switch (FldName.ToLower())
                            {
                                case "full_name":
                                    {
                                        lead.full_name = leadData.values[0];
                                        break;
                                    }
                                case "email":
                                    {
                                        lead.email = leadData.values[0];
                                        break;
                                    }
                                case "phone_number":
                                    {
                                        lead.phone_number = leadData.values[0];
                                        break;
                                    }

                            }



                        }
                        LeadList.Add(lead);
                    }
                }

            }
            catch (Exception ex)
            {
                retval = ex.Message;
            }
            return JsonConvert.SerializeObject(LeadList, Formatting.Indented); ;
        }
        #region Private Functions
        private void GetExtendedAccessToken(string ShortLivedToken)
        {
            string extendedToken = string.Empty;
            FacebookClient fbc = new FacebookClient();
            try
            {
                dynamic result = fbc.Get("/oauth/access_token", new
                {
                    grant_type = "fb_exchange_token",
                    client_id = fbAppID,
                    client_secret = fbAppSecret,
                    fb_exchange_token = ShortLivedToken
                });
                extendedToken = result.access_token;
            }
            catch (Exception ex)
            {
                throw (ex);
            }


            this.longAccessToken = extendedToken;
        }
        private void GetExtendedPageAccessToken()
        {
            try
            {
                var fbc = new FacebookClient(this.longAccessToken);
                dynamic result = fbc.Get("me/accounts", new
                {
                    access_token = this.longAccessToken
                });
                foreach (dynamic row in result.data)
                {
                    Page pg = new Page(row.id, row.name);
                    pg.LongAccessToken = this.longAccessToken;
                    pg.pgAccessToken = row.access_token;
                    pg.profilepicURL = getPagePicURL(row.id, row.access_token);
                    pg.AccountID = this.AccountID;
                    pg.AccountName = this.AccountName;
                    pageList.Add(pg);
                }

            }
            catch (Exception ex)
            {
                throw (ex);
            }


        }
        private string getPagePicURL(string pageID, string sPageAcessToken)
        {

            var fbc = new FacebookClient();
            string edgeurl = "/" + pageID + "/picture";

            dynamic result = fbc.Get(edgeurl, new
            {
                redirect = false,
                access_token = sPageAcessToken
            });
            return result.data.url;

        }
        #endregion
        #region Classes
        public class Page
        {
            public string ID = string.Empty;
            public string Name = string.Empty;
            public string profilepicURL = string.Empty;
            public string pgAccessToken = string.Empty;
            public string LongAccessToken = string.Empty;
            public string AccountID = string.Empty;
            public string AccountName = string.Empty;
            public List<PubPost> PublishedPostList = new List<PubPost>();
            public List<SchPost> ScheduledPostList = new List<SchPost>();
            public Page(string fbPageID, string fbPageName)
            {
                this.ID = fbPageID;
                this.Name = fbPageName;
            }
            public string getInsights(string strdatePeriod)
            {
                PageInsightInfo result = new PageInsightInfo(this.ID, strdatePeriod, this.pgAccessToken);
                result.getInsights();
                return JsonConvert.SerializeObject(result.dsPageInsightInfo, Formatting.Indented);

            }
            public string getPublishedPosts(string sTimePeriod)
            {
                dynamic result = null;
                var fbc = new FacebookClient();
                string[] stime = getTimefromTimePeriod(sTimePeriod);
                string edgeurl = "/" + this.ID + "/published_posts";
                result = fbc.Get(edgeurl, new
                {
                    since = stime[0],
                    until = stime[1],
                    access_token = this.pgAccessToken
                });
                foreach (var sPost in result["data"])
                {
                    PubPost tmpPost = new PubPost(this.pgAccessToken, this.AccountID, sPost.id, sPost.created_time, sPost.message);
                    PublishedPostList.Add(tmpPost);
                }
                return JsonConvert.SerializeObject(PublishedPostList, Formatting.Indented);
            }
            public string getScheduledPosts()
            {

                dynamic result = null;
                var fbc = new FacebookClient();
                string edgeurl = "/" + this.ID + "/scheduled_posts";
                result = fbc.Get(edgeurl, new
                {
                    fields = "id,created_time,scheduled_publish_time,message,attachments",
                    access_token = this.pgAccessToken
                });
                foreach (var sPost in result["data"])
                {
                    string mediaURL = string.Empty;
                    try
                    {
                        mediaURL = sPost.attachments.data[0].url;
                        mediaURL = mediaURL.Replace("https://l.facebook.com/l.php?", "");
                        string[] urlArr = mediaURL.Split('&');
                        mediaURL = HttpUtility.UrlDecode(urlArr[0].Replace("u=", ""));
                    }
                    catch { mediaURL = ""; }
                    SchPost tmpPost = new SchPost(this.pgAccessToken, this.AccountID, sPost.id, sPost.created_time, sPost.scheduled_publish_time, sPost.message, mediaURL);
                    ScheduledPostList.Add(tmpPost);
                }
                return JsonConvert.SerializeObject(ScheduledPostList, Formatting.Indented);
            }
            private string[] getTimefromTimePeriod(string TimePeriod)
            {
                string[] retval = new string[2];
                switch (TimePeriod)
                {
                    case "last7d":
                        {
                            retval[0] = DateTime.Now.AddDays(-7).ToString("yyyy-MM-ddTHH:mm:ss+0000");
                            retval[1] = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss+0000");
                            break;
                        }
                    case "last30d":
                        {
                            retval[0] = DateTime.Now.AddDays(-30).ToString("yyyy-MM-ddTHH:mm:ss+0000");
                            retval[1] = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss+0000");
                            break;
                        }
                    case "last90d":
                        {
                            retval[0] = DateTime.Now.AddDays(-90).ToString("yyyy-MM-ddTHH:mm:ss+0000");
                            retval[1] = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss+0000");
                            break;
                        }
                    case "last180d":
                        {
                            retval[0] = DateTime.Now.AddDays(-180).ToString("yyyy-MM-ddTHH:mm:ss+0000");
                            retval[1] = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss+0000");
                            break;
                        }
                    case "last300d":
                        {
                            retval[0] = DateTime.Now.AddDays(-300).ToString("yyyy-MM-ddTHH:mm:ss+0000");
                            retval[1] = DateTime.Now.ToString("yyyy-MM-ddTHH:mm:ss+0000");
                            break;
                        }
                }

                return retval;

            }
            public string getPageEmbed()
            {
                dynamic result = null;
                var fbc = new FacebookClient();
                string edgeurl = "/oembed_page";
                result = fbc.Get(edgeurl, new
                {
                    url = "https://www.facebook.com/" + this.ID,
                    maxheight = 800,
                    maxwidth = 500,
                    access_token = this.pgAccessToken
                });
                return "<html><body>" + result["html"] + "</body></html>";


            }
            private class PageInsightInfo
            {
                public int totalFans = 0;
                public int totalPageViews = 0;
                public int totalActions = 0;
                public int totalLikes = 0;
                private dynamic pgInsights = null;
                public DataSet dsPageInsightInfo = new DataSet("PageInsightInfo");
                public PageInsightInfo(string sPageID, string sTimePeriod, string sPageAccessToken)
                {
                    dynamic result = null;
                    var fbc = new FacebookClient();
                    string edgeurl = "/" + sPageID + "/insights";
                    result = fbc.Get(edgeurl, new
                    {
                        date_preset = sTimePeriod,
                        period = "day",
                        metric = "page_fans," +
                                "page_views_total," +
                                "page_total_actions," +
                                "page_actions_post_reactions_like_total," +
                                "page_positive_feedback_by_type," +
                                "page_impressions_paid," +
                                "page_impressions_organic," +
                                "page_impressions_viral," +
                                "page_fans_gender_age," +
                                "page_fans_country",
                        access_token = sPageAccessToken
                    });
                    this.pgInsights = result;
                }
                public void getInsights()
                {
                    // Find the first array using Linq
                    string strResult = JsonConvert.SerializeObject(this.pgInsights);
                    var jsonLinq = JObject.Parse(strResult);
                    var srcArray = jsonLinq.Descendants().Where(d => d is JArray).First();

                    foreach (JObject row in srcArray.Children<JObject>())
                    {
                        switch (row.First.First.ToString())
                        {

                            case "page_fans":
                            case "page_views_total":
                            case "page_total_actions":
                            case "page_actions_post_reactions_like_total":
                                {

                                    if (dsPageInsightInfo.Tables.Contains("PageSummary"))
                                    {
                                        DataTable dttemp = JsonConvert.DeserializeObject<DataTable>(_pageSummary(row));
                                        dsPageInsightInfo.Tables["PageSummary"].Rows.Add(dttemp.Rows[0].ItemArray);
                                    }
                                    else
                                    {
                                        DataTable dt = JsonConvert.DeserializeObject<DataTable>(_pageSummary(row));
                                        dt.TableName = "PageSummary";
                                        dsPageInsightInfo.Tables.Add(dt);
                                    }
                                    break;
                                }
                            case "page_positive_feedback_by_type":
                                {
                                    dsPageInsightInfo.Tables.Add(_getAudienceEngagementData(row));
                                    break;
                                }
                            case "page_impressions_paid":
                            case "page_impressions_organic":
                            case "page_impressions_viral":
                                {

                                    if (dsPageInsightInfo.Tables.Contains("PageImpressions"))
                                    {
                                        _pageImpressions(row, dsPageInsightInfo.Tables["PageImpressions"], row.First.First.ToString());

                                    }
                                    else
                                    {

                                        DataTable dt = new DataTable("PageImpressions");
                                        dt.Columns.Add("Date", typeof(String));
                                        dt.Columns.Add("Paid", typeof(String));
                                        dt.Columns.Add("Organic", typeof(String));
                                        dt.Columns.Add("Viral", typeof(String));
                                        dsPageInsightInfo.Tables.Add(dt);
                                        _pageImpressions(row, dsPageInsightInfo.Tables["PageImpressions"], row.First.First.ToString());
                                    }
                                    break;
                                }
                            case "page_fans_gender_age":
                                {
                                    DataTable dt = new DataTable("GenderPercentage");
                                    dt.Columns.Add("Male", typeof(String));
                                    dt.Columns.Add("Female", typeof(String));
                                    dsPageInsightInfo.Tables.Add(dt);
                                    DataTable dt2 = new DataTable("GenderAgeBreakup");
                                    DataColumn dtcPrimary = dt2.Columns.Add("Age Range", typeof(String));
                                    dt2.Columns.Add("M", typeof(String));
                                    dt2.Columns.Add("F", typeof(String));
                                    dt2.PrimaryKey = new DataColumn[] { dtcPrimary };
                                    dt2.Rows.Add("18-24", "0", "0");
                                    dt2.Rows.Add("25-34", "0", "0");
                                    dt2.Rows.Add("35-44", "0", "0");
                                    dt2.Rows.Add("45-54", "0", "0");
                                    dt2.Rows.Add("55-64", "0", "0");
                                    dt2.Rows.Add("65+", "0", "0");
                                    dsPageInsightInfo.Tables.Add(dt2);
                                    _getPageGenderStats(row, dsPageInsightInfo.Tables["GenderPercentage"], dsPageInsightInfo.Tables["GenderAgeBreakup"]);
                                    break;
                                }
                            case "page_fans_country":
                                {
                                    DataTable dt = new DataTable("FansByCountry");
                                    dt.Columns.Add("CountryCode", typeof(String));
                                    dt.Columns.Add("CountryName", typeof(String));
                                    dt.Columns.Add("Fans", typeof(int));
                                    dsPageInsightInfo.Tables.Add(dt);
                                    _getPageFansCountry(row, dsPageInsightInfo.Tables["FansByCountry"]);
                                    break;
                                }




                        }
                    }


                }
                private string _pageSummary(JObject _row)
                {
                    JArray trgArray = new JArray();
                    JObject cleanRow = new JObject();
                    foreach (JProperty column in _row.Properties())
                    {
                        // Only include JValue types
                        if (column.Value is JValue)
                        {
                            if (column.Name != "title" && column.Name != "period" && column.Name != "description" && column.Name != "id")
                            {

                                cleanRow.Add(column.Name, column.Value);

                            }
                        }
                        else
                        {
                            try
                            {
                                string strvalueResult = JsonConvert.SerializeObject(column.Value);
                                JArray jsonLinq2 = JArray.Parse(strvalueResult);
                                int totalcount = Convert.ToInt32(jsonLinq2[jsonLinq2.Count - 1]["value"]);
                                cleanRow.Add(column.Name, totalcount);
                            }
                            catch { }
                        }
                    }
                    trgArray.Add(cleanRow);
                    return trgArray.ToString();
                }
                private void _pageImpressions(JObject _row, DataTable tblImpr, string metric_name)
                {

                    foreach (JProperty column in _row.Properties())
                    {
                        // Only include JValue types
                        if (!(column.Value is JValue))
                        {
                            try
                            {
                                string strvalueResult = JsonConvert.SerializeObject(column.Value);
                                JArray jsonLinq2 = JArray.Parse(strvalueResult);

                                switch (metric_name)
                                {
                                    case "page_impressions_paid":
                                        {
                                            foreach (JObject item in jsonLinq2.Children())
                                            {

                                                JToken values = item.GetValue("value");
                                                JToken end_time = item.GetValue("end_time");
                                                tblImpr.Rows.Add(item.GetValue("end_time"), item.GetValue("value"), "0", "0");


                                            }
                                            break;
                                        }
                                    case "page_impressions_organic":
                                        {
                                            int cntr = 0;
                                            foreach (JObject item in jsonLinq2.Children())
                                            {

                                                tblImpr.Rows[cntr]["organic"] = item.GetValue("value");

                                                cntr++;
                                            }
                                            break;
                                        }
                                    case "page_impressions_viral":
                                        {
                                            int cntr = 0;
                                            foreach (JObject item in jsonLinq2.Children())
                                            {

                                                tblImpr.Rows[cntr]["viral"] = item.GetValue("value");

                                                cntr++;
                                            }
                                            break;
                                        }

                                }


                            }
                            catch { }
                        }
                    }


                }
                private string isNulltoZeroOrValue(JToken item)
                {
                    string retval = string.Empty;
                    if (item == null)
                    {
                        retval = "0";
                    }
                    else
                    {
                        retval = item.ToString();
                    }
                    return retval;

                }
                private DataTable _getAudienceEngagementData(JObject _row)
                {
                    DataTable dt = new DataTable("AudienceEngagement");
                    dt.Columns.Add("Date", typeof(String));
                    dt.Columns.Add("Like", typeof(String));
                    dt.Columns.Add("Comment", typeof(String));
                    dt.Columns.Add("Share", typeof(String));
                    JArray trgArray = new JArray();
                    JObject cleanRow = new JObject();
                    foreach (JProperty column in _row.Properties())
                    {
                        // Only include JValue types
                        if (!(column.Value is JValue))
                        {
                            try
                            {
                                string strvalueResult = JsonConvert.SerializeObject(column.Value);
                                JArray jsonLinq2 = JArray.Parse(strvalueResult);
                                foreach (JObject item in jsonLinq2.Children())
                                {

                                    JToken values = item.GetValue("value");
                                    JToken end_time = item.GetValue("end_time");
                                    dt.Rows.Add(item.GetValue("end_time"), isNulltoZeroOrValue(values["like"]), isNulltoZeroOrValue(values["comment"]), isNulltoZeroOrValue(values["link"]));


                                }

                                //cleanRow.Add(column.Name, totalcount);
                            }
                            catch { }
                        }
                    }
                    trgArray.Add(cleanRow);
                    return dt;
                }
                private void _getPageGenderStats(JObject _row, DataTable tblGndrSumm, DataTable tblGndrbrkup)
                {
                    foreach (JProperty column in _row.Properties())
                    {
                        // Only include JValue types
                        if (!(column.Value is JValue))
                        {
                            try
                            {
                                string strvalueResult = JsonConvert.SerializeObject(column.Value);
                                JArray jsonLinq2 = JArray.Parse(strvalueResult);
                                JToken genderList = jsonLinq2[jsonLinq2.Count - 1]["value"];
                                int totalMale = 0;
                                int totalFemale = 0;
                                foreach (JProperty jt in genderList)
                                {
                                    string colName = jt.Name;
                                    if (colName.IndexOf("U") < 0)
                                    {
                                        DataRow dr = tblGndrbrkup.Rows.Find(colName.Substring(2));
                                        dr[colName.Substring(0, 1)] = jt.Value;
                                        switch (colName.Substring(0, 1))
                                        {
                                            case "M":
                                                {
                                                    totalMale += Convert.ToInt32(jt.Value);
                                                    break;
                                                }
                                            case "F":
                                                {
                                                    totalFemale += Convert.ToInt32(jt.Value);
                                                    break;
                                                }
                                        }
                                    }
                                }
                                int totalgender = totalMale + totalFemale;
                                tblGndrSumm.Rows.Add((totalMale * 100 / totalgender), (totalFemale * 100 / totalgender));
                            }
                            catch { }
                        }
                    }
                }
                private void _getPageFansCountry(JObject _row, DataTable tblCountry)
                {
                    foreach (JProperty column in _row.Properties())
                    {
                        // Only include JValue types
                        if (!(column.Value is JValue))
                        {
                            try
                            {
                                string strvalueResult = JsonConvert.SerializeObject(column.Value);
                                JArray jsonLinq2 = JArray.Parse(strvalueResult);
                                JToken CountryList = jsonLinq2[jsonLinq2.Count - 1]["value"];
                                foreach (JProperty jt in CountryList)
                                {
                                    RegionInfo myRI1 = new RegionInfo(jt.Name);
                                    tblCountry.Rows.Add(jt.Name, myRI1.DisplayName, Convert.ToInt32(jt.Value));
                                }
                            }
                            catch { }
                        }
                    }
                    tblCountry.DefaultView.Sort = "Fans DESC";

                }


            }
        }
        public class PubPost
        {
            public string ID = string.Empty;
            public string CreatedDate = string.Empty;
            public string Message = string.Empty;
            public int Clicks = 0;
            public int Likes = 0;
            public int Comments = 0;
            public int TotalImpressions = 0;
            public int PaidImpressions = 0;
            public int EngagementRate_prc = 0;
            public string postURL = string.Empty;
            public string oEmbedHTML = string.Empty;
            private string _pgtoken = string.Empty;
            private string AccountID = string.Empty;
            public PubPost(string pgtoken, string sAccountID, string sID, string screatedDt, string sMsg)
            {
                this.ID = sID;
                this.CreatedDate = Convert.ToDateTime(screatedDt).ToShortDateString();
                this.Message = sMsg;
                this._pgtoken = pgtoken;
                this.AccountID = sAccountID;
                string retval = string.Empty;
                dynamic result = null;
                ///////////////////////////////////////////////////
                var fbc = new FacebookClient();
                string edgeurl = "/" + this.ID + "/insights";
                result = fbc.Get(edgeurl, new
                {
                    date_preset = "lifetime",
                    period = "lifetime",
                    metric = "post_clicks," +
                            "post_impressions," +
                            "post_impressions_paid",
                    access_token = this._pgtoken
                });
                foreach (var sMetric in result["data"])
                {
                    //switch (sMetric.name)
                    //{
                    //    case "post_clicks":
                    //    {
                    //        this.Clicks =(int) sMetric.values[0].value;
                    //        break;
                    //    }
                    //case "post_impressions":
                    //    {
                    //        this.TotalImpressions = (int)sMetric.values[0].value;
                    //        break;
                    //    }
                    //case "post_impressions_paid":
                    //    {
                    //        this.PaidImpressions = (int)sMetric.values[0].value;
                    //        break;
                    //    }
                    //}

                }
                ///////////////////////////////////////////////////
                fbc = new FacebookClient();
                edgeurl = "/" + this.ID;
                result = fbc.Get(edgeurl, new
                {
                    fields = "likes.summary(true).limit(0)," +
                            "comments.summary(true).limit(0)," +
                            "permalink_url",
                    access_token = this._pgtoken
                });
                this.Likes = (int)result["likes"].summary.total_count;
                this.Comments = (int)result["comments"].summary.total_count;
                this.postURL = result["permalink_url"];
                ///////////////////////////////////////////////////

                if (this.TotalImpressions > 0)
                {
                    double EngPercent = this.Clicks * 100 / this.TotalImpressions;
                    this.EngagementRate_prc = (int)Math.Round(EngPercent, 1);
                }

            }
            public PubPost(string pgtoken, string PostURL)
            {
                this._pgtoken = pgtoken;
                this.postURL = PostURL;
            }
            public string getPostEmbedHTML()
            {
                string retval = string.Empty;
                dynamic result = null;
                try
                {
                    var fbc = new FacebookClient();
                    string edgeurl = "/oembed_post";
                    result = fbc.Get(edgeurl, new
                    {
                        url = this.postURL,
                        useiframe = true,
                        access_token = this._pgtoken
                    });
                    this.oEmbedHTML = result["html"];
                    retval = this.oEmbedHTML;
                }
                catch (Exception ex)
                {
                    string x = ex.Message;
                }
                return retval;
            }
        }
        public class SchPost
        {
            public string ID = string.Empty;
            private string CreatedDate = string.Empty;
            public DateTime ScheduledDate = DateTime.UtcNow;
            public string Message = string.Empty;
            public string postURL = string.Empty;
            public string mediaURL = string.Empty;
            private string _pgtoken = string.Empty;
            private string AccountID = string.Empty;

            public SchPost(string pgtoken, string sAccountID, string sPostID, string screatedDt, double sSchDt, string sMsg)
            {
                this.ID = sPostID;
                this.CreatedDate = Convert.ToDateTime(screatedDt).ToShortDateString();
                this.ScheduledDate = UnixTimeStampToDateTime(sSchDt); //.ToString("dd MMM yyyy hh:mm tt");
                this.Message = sMsg;
                this._pgtoken = pgtoken;
                this.AccountID = sAccountID;
                string retval = string.Empty;
                dynamic result = null;
                ///////////////////////////////////////////////////
                var fbc = new FacebookClient();
                string edgeurl = "/" + this.ID + "/insights";
                ///////////////////////////////////////////////////
                fbc = new FacebookClient();
                edgeurl = "/" + this.ID;
                result = fbc.Get(edgeurl, new
                {
                    fields = "permalink_url",
                    access_token = this._pgtoken
                });
                this.postURL = result["permalink_url"];
                ///////////////////////////////////////////////////


            }
            public SchPost(string pgtoken, string sAccountID, string sPostID, string screatedDt, double sSchDt, string sMsg, string sMediaLink)
            {
                this.ID = sPostID;
                this.CreatedDate = Convert.ToDateTime(screatedDt).ToShortDateString();
                this.ScheduledDate = UnixTimeStampToDateTime(sSchDt); //.ToString("dd MMM yyyy hh:mm tt");
                this.Message = sMsg;
                this._pgtoken = pgtoken;
                this.AccountID = sAccountID;
                this.mediaURL = sMediaLink;
                string retval = string.Empty;
                dynamic result = null;
                ///////////////////////////////////////////////////
                var fbc = new FacebookClient();
                string edgeurl = "/" + this.ID + "/insights";
                ///////////////////////////////////////////////////
                fbc = new FacebookClient();
                edgeurl = "/" + this.ID;
                result = fbc.Get(edgeurl, new
                {
                    fields = "permalink_url",
                    access_token = this._pgtoken
                });
                this.postURL = result["permalink_url"];
                ///////////////////////////////////////////////////


            }
            public SchPost(string pgtoken, string sAccountID, string sPostID, DateTime sSchDt, string sMsg, string sLink)
            {
                this.ID = sPostID;
                this.ScheduledDate = sSchDt; //.ToString("dd MMM yyyy hh:mm tt");
                this.Message = sMsg;
                this._pgtoken = pgtoken;
                this.AccountID = sAccountID;
                this.postURL = sLink;
                ///////////////////////////////////////////////////
            }
            public SchPost(string pgtoken, string sAccountID, DateTime sSchDt, string sMsg, string sLink)
            {
                // this.ID = sPostID;
                this.ScheduledDate = sSchDt; //.ToString("dd MMM yyyy hh:mm tt");
                this.Message = sMsg;
                this._pgtoken = pgtoken;
                this.AccountID = sAccountID;
                this.postURL = sLink;
                ///////////////////////////////////////////////////
            }
            public SchPost(string pgtoken, string sPostID)
            {
                this._pgtoken = pgtoken;
                this.ID = sPostID;
            }
            public bool UpdatePost()
            {
                bool retval = false;
                try
                {
                    dynamic result = null;
                    dynamic Parameters = new System.Dynamic.ExpandoObject();
                    Parameters.published = false;
                    Parameters.scheduled_publish_time = (Int32)(this.ScheduledDate.ToUniversalTime().Subtract(new DateTime(1970, 1, 1))).TotalSeconds;
                    Parameters.message = this.Message;
                    Parameters.access_token = _pgtoken;
                    Parameters.link = this.postURL;
                    var fbc = new FacebookClient();
                    string edgeurl = "/" + this.ID;
                    result = fbc.Post(edgeurl, Parameters);
                    retval = true;
                }
                catch (Exception ex)
                {
                    var x = ex.Message;
                }
                return retval;
            }
            public string CreatePost()
            {
                string retval = string.Empty;
                try
                {
                    dynamic result = null;
                    dynamic Parameters = new System.Dynamic.ExpandoObject();
                    Parameters.published = false;
                    Parameters.scheduled_publish_time = this.ScheduledDate.ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ss+0000");
                    Parameters.message = this.Message;
                    Parameters.access_token = _pgtoken;
                    if (this.postURL != "") { Parameters.link = this.postURL; }
                    var fbc = new FacebookClient();
                    string edgeurl = "/" + AccountID + "/feed";
                    result = fbc.Post(edgeurl, Parameters);
                    retval = result["id"];
                }
                catch (Exception ex)
                {
                    retval = ex.Message;
                }
                return retval;
            }
            public bool DeletePost()
            {
                bool retval = false;
                try
                {
                    dynamic result = null;
                    dynamic Parameters = new System.Dynamic.ExpandoObject();
                    Parameters.access_token = this._pgtoken;
                    var fbc = new FacebookClient();
                    string edgeurl = "/" + this.ID;
                    result = fbc.Delete(edgeurl, Parameters);
                    retval = true;
                }
                catch (Exception ex)
                {
                    var x = ex.Message;
                }
                return retval;
            }
            private DateTime UnixTimeStampToDateTime(double unixTimeStamp)
            {
                // Unix timestamp is seconds past epoch
                System.DateTime dtDateTime = new DateTime(1970, 1, 1, 0, 0, 0, 0, System.DateTimeKind.Utc);
                dtDateTime = dtDateTime.AddSeconds(unixTimeStamp).ToLocalTime();
                return dtDateTime;
            }

        }
        #endregion
    }
}
