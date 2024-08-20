using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLMobileVisitorPreInformationSQL : CommonDataBaseInteraction, IDLMobileVisitorPreInformation
    {
        CommonInfo connection;
        public DLMobileVisitorPreInformationSQL(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobileVisitorPreInformationSQL(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public int GetLeadType(string DeviceId)
        {
            string storeProcCommand = "Mobile_VisitorPreInformation";
            List<string> paramName = new List<string> { "@Action", "@DeviceId" };
            object[] objDat = { "GetLeadType", DeviceId };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<int>(Command);
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <returns></returns>
        public string[] GetContactDetailsByDeviceId(string DeviceId)
        {
            MobileVisitorDetails visitorDetails = new MobileVisitorDetails();
            string storeProcCommand = "Mobile_VisitorPreInformation";
            List<string> paramName = new List<string> { "@Action", "@DeviceId" };
            object[] objDat = { "GetEmailidByDeviceId", DeviceId };

            string[] VisitorInfo = { "", "", "", "" };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                try
                {
                    Command.Connection.Open();
                    using (var reader = Command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            VisitorInfo[0] = reader["Name"].ToString();
                            VisitorInfo[1] = reader["EmailId"].ToString();
                            VisitorInfo[2] = reader["PhoneNumber"].ToString();
                            VisitorInfo[3] = reader["LeadType"].ToString();
                        }
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    Command.Connection.Close();
                }
            }
            return VisitorInfo;
        }


        public MobileVisitorDetails GetContactInfoTaggingByDeviceId(string DeviceId)
        {
            MobileVisitorDetails VisitorInfo = new MobileVisitorDetails();

            string storeProcCommand = "Mobile_VisitorPreInformation";
            List<string> paramName = new List<string> { "@Action", "@DeviceId" };
            object[] objDat = { "GetEmailidByDeviceId", DeviceId };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                try
                {
                    Command.Connection.Open();
                    using (var reader = Command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            //VisitorInfo[0] = reader["Name"].ToString();
                            //VisitorInfo[1] = reader["EmailId"].ToString();
                            //VisitorInfo[2] = reader["PhoneNumber"].ToString();
                            //VisitorInfo[3] = reader["LeadType"].ToString();

                            VisitorInfo.Name = reader["Name"].ToString();
                            VisitorInfo.EmailId = reader["EmailId"].ToString();
                            VisitorInfo.PhoneNumber = reader["PhoneNumber"].ToString();
                            VisitorInfo.LeadType = int.Parse(reader["LeadType"].ToString());
                            VisitorInfo.Location = reader["Location"].ToString();
                            VisitorInfo.Gender = reader["Gender"].ToString();
                            VisitorInfo.MaritalStatus = reader["MaritalStatus"].ToString();
                            VisitorInfo.Education = reader["Education"].ToString();
                            VisitorInfo.Occupation = reader["Occupation"].ToString();
                            VisitorInfo.Interests = reader["Interests"].ToString();
                        }
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    Command.Connection.Close();
                }
            }
            return VisitorInfo;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <param name="MobileFormId"></param>
        /// <returns></returns>
        public string[] GetSessionContactDetails(string DeviceId, int MobileFormId)
        {
            MobileVisitorDetails visitorDetails = new MobileVisitorDetails();
            string storeProcCommand = "Mobile_VisitorPreInformation";
            List<string> paramName = new List<string> { "@Action", "@DeviceId", "@MobileFormId" };
            object[] objDat = { "GetContactSession", DeviceId, MobileFormId };

            string[] SessionInfo = { "", "" };
            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                try
                {
                    Command.Connection.Open();
                    using (var reader = Command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            SessionInfo[0] = reader["SessionId"].ToString();
                        }
                        if (reader.NextResult())
                        {
                            while (reader.Read())
                            {
                                SessionInfo[1] = reader["ContactId"].ToString();
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    Command.Connection.Close();
                }
            }
            return SessionInfo;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="EmailId"></param>
        /// <param name="Mobile"></param>
        /// <returns></returns>
        public string[] GetContactDetailsByEmailMobile(string EmailId, string Mobile)
        {
            string[] VisitorInfo = { "", "", "", "" };

            if (EmailId.Length > 0 || Mobile.Length > 0)
            {
                MobileVisitorDetails visitorDetails = new MobileVisitorDetails();
                string storeProcCommand = "[Contact_Details]";

                IDbCommand getCommand = null;
                if (EmailId.Length > 0)
                {
                    List<string> paramName = new List<string> { "@Action", "@EmailId" };
                    object[] objDat = { "GET", EmailId };
                    getCommand = GetCommand(connection, storeProcCommand, paramName, objDat);
                }
                else if (Mobile.Length > 0)
                {
                    List<string> paramName = new List<string> { "@Action", "@PhoneNumber" };
                    object[] objDat = { "GET", Mobile };
                    getCommand = GetCommand(connection, storeProcCommand, paramName, objDat);
                }

                using (IDbCommand Command = getCommand)
                {
                    try
                    {
                        Command.Connection.Open();
                        using (var reader = Command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                VisitorInfo[0] = reader["Name"].ToString();
                                VisitorInfo[1] = reader["EmailId"].ToString();
                                VisitorInfo[2] = reader["PhoneNumber"].ToString();
                                VisitorInfo[3] = reader["LeadType"].ToString();
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        throw ex;
                    }
                    finally
                    {
                        Command.Connection.Close();
                    }
                }
            }
            return VisitorInfo;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <returns></returns>
        public string GetGroupList(string DeviceId)
        {
            string storeProcCommand = "Mobile_VisitorPreInformation";
            List<string> paramName = new List<string> { "@Action", "@DeviceId" };
            object[] objDat = { "GroupIdDeviceId", DeviceId };
            object[] objOutput = { };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))//objOutput
            {
                return ReadSingleValue<string>(Command);
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <returns></returns>
        public short GetSession(string DeviceId)
        {
            string storeProcCommand = "SelectVisitorDetails";
            List<string> paramName = new List<string> { "@Key", "@DeviceId" };
            object[] objDat = { "Aggregate", DeviceId };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<short>(Command, "Session");
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <returns></returns>
        public short GetBehavioralScore(string DeviceId)
        {
            string storeProcCommand = "SelectVisitorDetails";
            List<string> paramName = new List<string> { "@Key", "@DeviceId" };
            object[] objDat = { "Aggregate", DeviceId };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<short>(Command, "Score");
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <returns></returns>
        public short GetPageDepeth(string DeviceId)
        {
            string storeProcCommand = "SelectVisitorDetails";
            List<string> paramName = new List<string> { "@Key", "@DeviceId" };
            object[] objDat = { "Recent", DeviceId };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<short>(Command, "PageDepth");
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <returns></returns>
        public short GetPageviews(string DeviceId)
        {
            string storeProcCommand = "SelectVisitorDetails";
            List<string> paramName = new List<string> { "@Key", "@DeviceId" };
            object[] objDat = { "Aggregate", DeviceId };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<short>(Command, "PageViews");
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <returns></returns>
        public short GetFrequency(string DeviceId)
        {
            string storeProcCommand = "SelectVisitorDetails";
            List<string> paramName = new List<string> { "@Key", "@DeviceId" };
            object[] objDat = { "Aggregate", DeviceId };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<short>(Command, "Frequency");
            }
        }

        //public string GetSource(string DeviceId)
        //{
        //    string storeProcCommand = "SelectVisitorDetails";
        //    List<string> paramName = new List<string> { "@Key", "@DeviceId" };
        //    object[] objDat = { "Recent", DeviceId };

        //    using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
        //    {
        //        return ReadSingleValue<string>(Command, "RecentSource");
        //    }
        //}
        /// <summary>
        /// 
        /// </summary>
        /// <param name="EmailId"></param>
        /// <returns></returns>
        public bool IsMailRespondent(string EmailId)
        {
            if (!String.IsNullOrEmpty(EmailId))
            {
                string storeProcCommand = "Mobile_VisitorPreInformation";
                List<string> paramName = new List<string> { "@Action", "@EmailId" };
                object[] objDat = { "IsMailRespondent", EmailId };

                using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
                {
                    return !String.IsNullOrEmpty(ReadSingleValue<string>(Command, "EmailId"));
                }
            }
            return false;
        }

        //public string SearchKeyword(string DeviceId)
        //{
        //    using (BLCustomDetailsFormTracking obj = new BLCustomDetailsFormTracking(AdsId))
        //    {
        //        return obj.SearchKeyword(DeviceId);
        //    }
        //}
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <returns></returns>
        public string[] GetCityCountry(string DeviceId)
        {
            string[] CountryAndCity = { "", "" };
            string storeProcCommand = "SelectVisitorDetails";
            List<string> paramName = new List<string> { "@Key", "@DeviceId" };
            object[] objDat = { "Recent", DeviceId };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                try
                {
                    Command.Connection.Open();
                    using (var reader = Command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            CountryAndCity[0] = reader["RecentCountry"].ToString();
                            CountryAndCity[1] = reader["RecentCity"].ToString();
                        }
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    Command.Connection.Close();
                }
            }

            return CountryAndCity;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <param name="FormId"></param>
        /// <param name="ChatId"></param>
        /// <param name="FormType"></param>
        /// <returns></returns>
        public bool AlreadyVisitedPages(string DeviceId, int FormId, int ChatId, int FormType)
        {
            string storeProcCommand = "Mobile_VisitorPreInformation";
            List<string> paramName = new List<string> { "@Action", "@DeviceId", "@MobileFormId", "@ChatId", "@CampaignType" };
            object[] objDat = { "AlreadyVisitedPages", DeviceId, FormId, ChatId, FormType };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<int>(Command) > 0;
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <returns></returns>
        public short OverAllTimeSpentInSite(string DeviceId)
        {
            string storeProcCommand = "SelectVisitorDetails";
            List<string> paramName = new List<string> { "@Key", "@DeviceId" };
            object[] objDat = { "Aggregate", DeviceId };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<short>(Command, "AvgTime");
            }
        }

        //public bool isMobileBrowser()
        //{
        //    HttpContext context = HttpContext.Current;

        //    if (context.Request.UserAgent.ToString().ToLower().Contains("android"))
        //        return true;

        //    if (context.Request.Browser.IsMobileDevice)
        //    {
        //        return true;
        //    }

        //    if (context.Request.ServerVariables["HTTP_X_WAP_PROFILE"] != null)
        //    {
        //        return true;
        //    }

        //    if (context.Request.ServerVariables["HTTP_ACCEPT"] != null && context.Request.ServerVariables["HTTP_ACCEPT"].ToLower().Contains("wap"))
        //    {
        //        return true;
        //    }

        //    if (context.Request.ServerVariables["HTTP_USER_AGENT"] != null)
        //    {
        //        string[] mobiles =
        //            new[]
        //        {
        //            "midp", "j2me", "avant", "docomo",
        //            "novarra", "palmos", "palmsource",
        //            "240x320", "opwv", "chtml",
        //            "pda", "windows ce", "mmp/",
        //            "blackberry", "mib/", "symbian",
        //            "wireless", "nokia", "hand", "mobi",
        //            "phone", "cdm", "up.b", "audio",
        //            "SIE-", "SEC-", "samsung", "HTC",
        //            "mot-", "mitsu", "sagem", "sony"
        //            , "alcatel", "lg", "eric", "vx",
        //            "NEC", "philips", "mmm", "xx",
        //            "panasonic", "sharp", "wap", "sch",
        //            "rover", "pocket", "benq", "java",
        //            "pt", "pg", "vox", "amoi",
        //            "bird", "compal", "kg", "voda",
        //            "sany", "kdd", "dbt", "sendo",
        //            "sgh", "gradi", "jb", "dddi",
        //            "moto", "iphone"
        //        };

        //        foreach (string s in mobiles)
        //        {
        //            if (context.Request.ServerVariables["HTTP_USER_AGENT"].ToLower().Contains(s.ToLower()))
        //            {
        //                return true;
        //            }
        //        }
        //    }

        //    return false;
        //}

        //public bool iAndriodBrowser()
        //{
        //    HttpContext context = HttpContext.Current;

        //    if (context.Request.UserAgent.ToString().ToLower().Contains("android"))
        //        return true;

        //    if (context.Request.Browser.IsMobileDevice)
        //    {
        //        return true;
        //    }

        //    if (context.Request.ServerVariables["HTTP_X_WAP_PROFILE"] != null)
        //    {
        //        return true;
        //    }

        //    if (context.Request.ServerVariables["HTTP_ACCEPT"] != null && context.Request.ServerVariables["HTTP_ACCEPT"].ToLower().Contains("wap"))
        //    {
        //        return true;
        //    }

        //    if (context.Request.ServerVariables["HTTP_USER_AGENT"] != null)
        //    {
        //        string[] mobiles =
        //            new[]
        //        {
        //            "midp", "j2me", "avant", "docomo",
        //            "novarra", "palmos", "palmsource",
        //            "240x320", "opwv", "chtml",
        //            "pda", "windows ce", "mmp/",
        //            "blackberry", "mib/", "symbian",
        //            "wireless", "nokia", "hand", "mobi",
        //            "phone", "cdm", "up.b", "audio",
        //            "SIE-", "SEC-", "samsung", "HTC",
        //            "mot-", "mitsu", "sagem", "sony"
        //            , "alcatel", "lg", "eric", "vx",
        //            "NEC", "philips", "mmm", "xx",
        //            "panasonic", "sharp", "wap", "sch",
        //            "rover", "pocket", "benq", "java",
        //            "pt", "pg", "vox", "amoi",
        //            "bird", "compal", "kg", "voda",
        //            "sany", "kdd", "dbt", "sendo",
        //            "sgh", "gradi", "jb", "dddi",
        //            "moto", "iphone"
        //        };

        //        foreach (string s in mobiles)
        //        {
        //            if (context.Request.ServerVariables["HTTP_USER_AGENT"].ToLower().Contains(s.ToLower()))
        //            {
        //                return true;
        //            }
        //        }
        //    }

        //    return false;
        //}
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <returns></returns>
        public string GetClickedButton(string DeviceId)
        {
            string storeProcCommand = "SelectVisitorDetails";
            List<string> paramName = new List<string> { "@Key", "@DeviceId" };
            object[] objDat = { "AggregateOfEventProduct", DeviceId };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<string>(Command, "Events");
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="EmailId"></param>
        /// <returns></returns>
        public bool RespondedChatAgent(string EmailId)
        {
            string storeProcCommand = "Mobile_VisitorPreInformation";
            List<string> paramName = new List<string> { "@Action", "@EmailId" };
            object[] objDat = { "RespondedChatAgent", EmailId };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return !String.IsNullOrEmpty(ReadSingleValue<string>(Command));
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="EmailId"></param>
        /// <returns></returns>
        public byte[] MailCampignResponsiveStage(string EmailId)
        {
            byte[] MailResposiveStage = { 0, 0 };

            string storeProcCommand = "Mobile_VisitorPreInformation";
            List<string> paramName = new List<string> { "@Action", "@EmailId" };
            object[] objDat = { "MailCampaignsStage", EmailId };



            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                try
                {
                    Command.Connection.Open();
                    using (var reader = Command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            if (!String.IsNullOrEmpty(reader["Score"].ToString()))
                                MailResposiveStage[0] = Convert.ToByte(reader["Score"]);
                            if (!String.IsNullOrEmpty(reader["ScoreType"].ToString()))
                                MailResposiveStage[1] = Convert.ToByte(reader["ScoreType"]);
                        }
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    Command.Connection.Close();
                }
            }

            return MailResposiveStage;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <param name="FormType"></param>
        /// <returns></returns>
        public List<int> ResponseFormList(string DeviceId, int FormType)
        {
            List<int> FormIdList = new List<int>();
            string storeProcCommand = "Mobile_VisitorPreInformation";
            List<string> paramName = new List<string> { "@Action", "@DeviceId", "@CampaignType" };
            object[] objDat = { "ResponseFormList", DeviceId, FormType };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                try
                {
                    Command.Connection.Open();
                    using (var reader = Command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            FormIdList.Add(Convert.ToInt32(reader["MobileFormId"]));
                        }
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    Command.Connection.Close();
                }
            }
            return FormIdList;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <param name="FormType"></param>
        /// <returns></returns>
        public List<int> NotResponseFormList(string DeviceId, int FormType)
        {
            List<int> FormIdList = new List<int>();
            string storeProcCommand = "Mobile_VisitorPreInformation";
            List<string> paramName = new List<string> { "@Action", "@DeviceId", "@CampaignType" };
            object[] objDat = { "NotResponseFormList", DeviceId, FormType };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                try
                {
                    Command.Connection.Open();
                    using (var reader = Command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            FormIdList.Add(Convert.ToInt32(reader["MobileFormId"]));
                        }
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    Command.Connection.Close();
                }
            }
            return FormIdList;
        }

        //public DataSet FormLeadDetailsAnswerDependency(string DeviceId, int FormId)
        //{
        //    DataSet ds = new DataSet();
        //    string storeProcCommand = "Mobile_VisitorPreInformation";
        //    List<string> paramName = new List<string> { "@Action", "@DeviceId", "MobileFormId" };
        //    object[] objDat = { "ResponseLeadData", DeviceId, FormId };

        //    using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
        //    {
        //        try
        //        {
        //            Command.Connection.Open();
        //            SqlDataAdapter dataAdapter = new SqlDataAdapter((SqlCommand)Command);
        //            dataAdapter.Fill(ds);
        //            return ds;
        //        }
        //        catch (Exception ex)
        //        {
        //            throw ex;
        //        }
        //        finally
        //        {
        //            Command.Connection.Close();
        //        }
        //    }
        //}

        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <param name="FormId"></param>
        /// <param name="FormType"></param>
        /// <returns></returns>
        public short ClosedFormNthTime(string DeviceId, int FormId, int FormType)
        {
            string storeProcCommand = "Mobile_VisitorPreInformation";
            List<string> paramName = new List<string> { "@Action", "@DeviceId", "@MobileFormId", "@CampaignType" };
            object[] objDat = { "ClosedFormNthTime", DeviceId, FormId, FormType };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<short>(Command, "ClosedCount");
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <param name="SessionRefeer"></param>
        /// <param name="FormId"></param>
        /// <param name="FormType"></param>
        /// <returns></returns>
        public short ClosedFormSessionWise(string DeviceId, string SessionRefeer, int FormId, int FormType)
        {
            string storeProcCommand = "Mobile_VisitorPreInformation";
            List<string> paramName = new List<string> { "@Action", "@DeviceId", "@SessionRefer", "@MobileFormId", "@CampaignType" };
            object[] objDat = { "ClosedFormNthTimeSessionWise", DeviceId, SessionRefeer, FormId, FormType };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<short>(Command, "CloseCountSessionWise");
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <returns></returns>
        public string AddProductToCart(string DeviceId)
        {
            string storeProcCommand = "SelectVisitorDetails";
            List<string> paramName = new List<string> { "@Key", "@DeviceId" };
            object[] objDat = { "AggregateOfEventProduct", DeviceId };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<string>(Command, "AddedToCart");
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <param name="ContactId"></param>
        /// <param name="FormId"></param>
        /// <returns></returns>
        public string ViewedButNotAddedProductsToCart(string DeviceId, int ContactId, int FormId)
        {
            string storeProcCommand = "Mobile_VisitorPreInformation";
            List<string> paramName = new List<string> { "@Key", "@DeviceId", "@ContactId", "@MobileFormId" };
            object[] objDat = { "ViewedInCartOrNotInCart", DeviceId, ContactId, FormId };
            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<string>(Command);
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <returns></returns>
        public string DroppedProductsFromCart(string DeviceId, int ContactId, int FormId)
        {
            string storeProcCommand = "Mobile_VisitorPreInformation";
            List<string> paramName = new List<string> { "@Key", "@DeviceId", "@ContactId", "@MobileFormId" };
            object[] objDat = { "DroppedProductSlabOrFreeBie", DeviceId, ContactId, FormId };
            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<string>(Command);
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <returns></returns>
        public string PurchasedProducts(string DeviceId)
        {
            string storeProcCommand = "SelectVisitorDetails";
            List<string> paramName = new List<string> { "@Key", "@DeviceId" };
            object[] objDat = { "AggregateOfEventProduct", DeviceId };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<string>(Command, "ProductPurchased");
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <returns></returns>
        public short CustomerTotalPurchase(string DeviceId)
        {
            string storeProcCommand = "SelectVisitorDetails";
            List<string> paramName = new List<string> { "@Key", "@DeviceId" };
            object[] objDat = { "Aggregate", DeviceId };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<short>(Command, "ProductPurchased");
            };
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <returns></returns>
        public short CustomerCurrentValue(string DeviceId)
        {
            string storeProcCommand = "SelectVisitorDetails";
            List<string> paramName = new List<string> { "@Key", "@DeviceId" };
            object[] objDat = { "Aggregate", DeviceId };
            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<short>(Command, "ProductPurchasedValue");
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <param name="ContactId"></param>
        /// <returns></returns>
        public bool IsBusinessOrIndividualMember(string DeviceId, int ContactId)
        {
            string storeProcCommand = "Mobile_VisitorPreInformation";
            List<string> paramName = new List<string> { "@Action", "@DeviceId", "@ContactId" };
            object[] objDat = { "BusinessOrIndividualMember", DeviceId, ContactId };
            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<bool>(Command);
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <param name="ContactId"></param>
        /// <returns></returns>
        public bool IsOfflineOrOnlinePurchase(string DeviceId, int ContactId)
        {
            string storeProcCommand = "Mobile_VisitorPreInformation";
            List<string> paramName = new List<string> { "@Action", "@DeviceId", "@ContactId" };
            object[] objDat = { "OfflineOrOnlinePurchase", DeviceId, ContactId };
            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<bool>(Command);
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <param name="ContactId"></param>
        /// <returns></returns>
        public short GetLastPurchaseInterval(string DeviceId, int ContactId)
        {
            string storeProcCommand = "Mobile_VisitorPreInformation";
            List<string> paramName = new List<string> { "@Action", "@DeviceId", "@ContactId" };
            object[] objDat = { "LastPurchase", DeviceId, ContactId };
            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<short>(Command);
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <param name="ContactId"></param>
        /// <returns></returns>
        public short GetCustomerExpirdayInterval(string DeviceId, int ContactId)
        {
            string storeProcCommand = "Mobile_VisitorPreInformation";
            List<string> paramName = new List<string> { "@Action", "@DeviceId", "@ContactId" };
            object[] objDat = { "ExpiryDay", DeviceId, ContactId };
            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<short>(Command);
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <param name="FormId"></param>
        /// <param name="FormType"></param>
        /// <returns></returns>
        public short GetFormImpression(string DeviceId, int FormId, int FormType)
        {
            string storeProcCommand = "Mobile_VisitorPreInformation";
            List<string> paramName = new List<string> { "@Action", "@DeviceId", "@MobileFormId", "@CampaignType" };
            object[] objDat = { "FormImpression", DeviceId, FormId, FormType };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<short>(Command);
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <param name="FormId"></param>
        /// <param name="FormType"></param>
        /// <returns></returns>
        public short GetFormCloseCount(string DeviceId, int FormId, int FormType)
        {
            string storeProcCommand = "Mobile_VisitorPreInformation";
            List<string> paramName = new List<string> { "@Action", "@DeviceId", "@MobileFormId", "@CampaignType" };
            object[] objDat = { "FormCloseCount", DeviceId, FormId, FormType };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<short>(Command);
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <param name="FormId"></param>
        /// <param name="FormType"></param>
        /// <returns></returns>
        public short GetFormResponseCount(string DeviceId, int FormId, int FormType)
        {
            string storeProcCommand = "Mobile_VisitorPreInformation";
            List<string> paramName = new List<string> { "@Action", "@DeviceId", "@MobileFormId", "@CampaignType" };
            object[] objDat = { "FormResponseCount", DeviceId, FormId, FormType };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<short>(Command);
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <param name="FormId"></param>
        /// <param name="FormType"></param>
        /// <returns></returns>
        public short GetCountShowThisFormOnlyNthTime(string DeviceId, int FormId, int FormType)
        {
            string storeProcCommand = "Mobile_VisitorPreInformation";
            List<string> paramName = new List<string> { "@Action", "@DeviceId", "@MobileFormId", "@CampaignType" };
            object[] objDat = { "GetCountShowThisFormOnlyNthTime", DeviceId, FormId, FormType };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<short>(Command);
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="EmailId"></param>
        /// <returns></returns>
        public byte OnlineSentimentIs(string EmailId)
        {
            if (!String.IsNullOrEmpty(EmailId))
            {
                string storeProcCommand = "FormRules_EngauageAndQ5";
                List<string> paramName = new List<string> { "@Action", "@EmailId" };
                object[] objDat = { "OnlineSentimentIs", EmailId };

                using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
                {
                    return ReadSingleValue<byte>(Command);
                }
            }
            return 0;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="EmailId"></param>
        /// <returns></returns>
        public byte SocialStatusIs(int ContactId)
        {
            if (ContactId > 0)
            {
                string storeProcCommand = "FormRules_EngauageAndQ5";
                List<string> paramName = new List<string> { "@Action", "@EmailId" };
                object[] objDat = { "Socialstatus", ContactId };

                using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
                {
                    return ReadSingleValue<byte>(Command);
                }
            }
            return 0;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="ContactId"></param>
        /// <returns></returns>
        public short InfluentialScore(int ContactId)
        {
            if (ContactId > 0)
            {
                string storeProcCommand = "FormRules_EngauageAndQ5";
                List<string> paramName = new List<string> { "@Action", "@EmailId" };
                object[] objDat = { "Influentialscore", ContactId };

                using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
                {
                    return ReadSingleValue<byte>(Command);
                }
            }
            return 0;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <returns></returns>
        public byte ProductRatingIs(string DeviceId)
        {
            string storeProcCommand = "Mobile_VisitorPreInformation";
            List<string> paramName = new List<string> { "@Action", "@DeviceId" };
            object[] objDat = { "ProductRatingIs", DeviceId };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<byte>(Command);
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <returns></returns>
        public short NurtureStatusIs(int ContactId)
        {
            if (ContactId > 0)
            {
                string storeProcCommand = "Forms_SP_AllFormsLoading";
                List<string> paramName = new List<string> { "@Action", "@ContactId" };
                object[] objDat = { "NurtureStatusIs", ContactId };

                using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
                {
                    return ReadSingleValue<short>(Command);
                }
            }
            return 0;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="EmailId"></param>
        /// <returns></returns>
        public string GetGenderValue(int ContactId)
        {
            if (ContactId > 0)
            {
                string storeProcCommand = "FormRules_EngauageAndQ5";
                List<string> paramName = new List<string> { "@Action", "@ContactId" };
                object[] objDat = { "Gender", ContactId };

                using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
                {
                    return ReadSingleValue<string>(Command);
                }
            }
            return null;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="ContactId"></param>
        /// <returns></returns>
        public byte GetMaritalStatus(int ContactId)
        {
            if (ContactId > 0)
            {
                string storeProcCommand = "Contact_Details";
                List<string> paramName = new List<string> { "@Action", "@ContactId", "@FieldNames" };
                object[] objDat = { "GetDetails", ContactId, "Maritalstatus" };
                using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
                {
                    string MaritalStatus = ReadSingleValue<string>(Command);
                    if (!String.IsNullOrEmpty(MaritalStatus))
                    {
                        if (MaritalStatus.ToLower().Trim() == "not married" || MaritalStatus.ToLower().Trim() == "single")
                            return 1;
                        else if (MaritalStatus.ToLower().Trim() == "married")
                            return 2;
                        else if (MaritalStatus.ToLower().Trim() == "divorced")
                            return 3;
                    }
                }
            }
            return 0;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="ContactId"></param>
        /// <returns></returns>
        public string ProfessionIs(int ContactId)
        {
            if (ContactId > 0)
            {
                string storeProcCommand = "Contact_Details";
                List<string> paramName = new List<string> { "@Action", "@ContactId", "@FieldNames" };
                object[] objDat = { "GetDetails", ContactId, "Occupation" };
                using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
                {
                    return ReadSingleValue<string>(Command);
                }
            }
            return null;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="ContactId"></param>
        /// <returns></returns>
        public byte ConnectedSocially(int ContactId)
        {
            if (ContactId > 0)
            {
                string storeProcCommand = "FormRules_EngauageAndQ5";
                List<string> paramName = new List<string> { "@Action", "@ContactId" };
                object[] objDat = { "Connectedsocially", ContactId };
                using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
                {
                    return ReadSingleValue<byte>(Command);
                }
            }
            return 0;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="EmailId"></param>
        /// <returns></returns>
        public short LoyaltyPoints(int ContactId)
        {
            if (ContactId > 0)
            {
                string storeProcCommand = "FormRules_EngauageAndQ5";
                List<string> paramName = new List<string> { "@Action", "@ContactId" };
                object[] objDat = { "Loyaltypoints", ContactId };

                using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
                {
                    return ReadSingleValue<byte>(Command);
                }
            }
            return 0;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="EmailId"></param>
        /// <returns></returns>
        public short RFMSScoreIs(string EmailId)
        {
            return 0;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <returns></returns>
        public byte PaidCampaignFlag(string DeviceId)
        {
            string storeProcCommand = "SelectVisitorDetails";
            List<string> paramName = new List<string> { "@Key", "@DeviceId" };
            object[] objDat = { "Recent", DeviceId };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<byte>(Command, "PaidCampaignFlag");
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="FormId"></param>
        /// <param name="TypeOfCamp"></param>
        /// <returns></returns>
        public MobileFormRules GetFormRule(int FormId, int TypeOfCamp)
        {
            string storeProcCommand = "Mobile_Rules";
            List<string> paramName = new List<string> { "@Action", "@MobileFormId", "@TypeOfCamp" };
            object[] objDat = { "GetRawRules", FormId, TypeOfCamp };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return DataReaderMapToDetail<MobileFormRules>(Command);
            }
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="DeviceId"></param>
        /// <returns></returns>
        public string GetRecentEvent(string DeviceId)
        {
            string storeProcCommand = "SelectVisitorDetails";
            List<string> paramName = new List<string> { "@Key", "@DeviceId" };
            object[] objDat = { "Recent", DeviceId };

            using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
            {
                return ReadSingleValue<string>(Command, "RecentEvent");
            }
        }

        ////for sending mail and sms
        //public FormResponseReportToSetting Get(int MobileFormId)
        //{
        //    string storeProcCommand = "MobileResponseSettings";
        //    List<string> paramName = new List<string> { "@Action", "@MobileFormId" };
        //    object[] objDat = { "GetReportSettings", MobileFormId };
        //    using (IDbCommand Command = GetCommand(connection, storeProcCommand, paramName, objDat))
        //    {
        //        return DataReaderMapToDetail<FormResponseReportToSetting>(Command);
        //    }
        //}

    }
}
