using P5GenralDL;
using P5GenralML;
using Plumb5GenralFunction;
using System.Data;
using System.Reflection;

namespace Plumb5.Areas.Prospect.Models
{
    public class LmsCampaingReport
    {
        public string UserinfoName { get; set; }
        public int UserInfoUserId { get; set; }
        public int LMSMailcount { get; set; }
        public int LMSSmscount { get; set; }
        public int LMSWhatsAppCount { get; set; }
        public int LMScallcount { get; set; }
        public int InBound { get; set; }
        public int OutBound { get; set; }
        public string CalledNumber { get; set; }

    }
    public class LmsFollowUpReport
    {
        public string UserinfoName { get; set; }
        public int FollowUpUserId { get; set; }
        public int PlannedCount { get; set; }
        public int MissedCount { get; set; }
        public int CompleteCount { get; set; }
    }
    public class LmsExport
    {

        public string MainPath { get; set; }
        //Darshan
        public async Task Export(int AdsId, List<MLLeadsDetails> mLContacts, List<MLUserHierarchy> userHierarchy, string FileType, string DbType)
        {
            DataSet dataSet = new DataSet("General");
            DataTable MainDataTable = new DataTable();
            List<string> DistinctFieldNames = new List<string>();

            List<LmsStage> lmsStageList = new List<LmsStage>();
            using (var objStage = DLLmsStage.GetDLLmsStage(AdsId, DbType))
            {
                lmsStageList = await objStage.GetAllList();
            }

            List<ContactFieldProperty> ContactFieldPropertyList;
            using (var objDL = DLContactFieldProperty.GetDLContactFieldProperty(AdsId, DbType))
            {
                ContactFieldPropertyList = await objDL.GetSelectedContactField();
            }
            List<LmsCustomFields> LmsCustomFields;
            List<ContactFieldProperty> addlmspropertieslist = new List<ContactFieldProperty>();
            using (var objLmsLeads = DLLmsCustomFields.GetDLLmsCustomFields(AdsId, DbType))
            {
                LmsCustomFields = await objLmsLeads.GetDetails();
            }
            LmsCustomFields = LmsCustomFields.Where(x => x.Position != null).Select(x => x).ToList();

            if (mLContacts != null && mLContacts.Count > 0)
            {
                DataTable dtListOfResponsesData = new DataTable();
                dtListOfResponsesData = Helper.ToDataTables(mLContacts);

                if (dtListOfResponsesData != null && dtListOfResponsesData.Rows.Count > 0)
                {
                    foreach (var ContactFieldProperty in ContactFieldPropertyList)
                    {
                        if (ContactFieldProperty.PropertyName != "UserInfoUserId" && ContactFieldProperty.PropertyName != "Score" && ContactFieldProperty.PropertyName != "Remarks")
                            MainDataTable.Columns.Add(ContactFieldProperty.DisplayName);
                    }

                    if (LmsCustomFields != null && LmsCustomFields.Count > 0)
                    {
                        for (int i = 0; i < LmsCustomFields.Count; i++)
                        {
                            ContactFieldProperty addlmsproperties = new ContactFieldProperty();
                            MainDataTable.Columns.Add(LmsCustomFields[i].FieldDisplayName);
                            addlmsproperties.DisplayName = LmsCustomFields[i].FieldDisplayName.ToString();
                            addlmsproperties.PropertyName = LmsCustomFields[i].FieldName.ToString();
                            addlmspropertieslist.Add(addlmsproperties);
                        }
                    }
                    if (!MainDataTable.Columns.Contains("Source"))
                        MainDataTable.Columns.Add("Source");
                    MainDataTable.Columns.Add("Handled By");
                    MainDataTable.Columns.Add("Stage");
                    MainDataTable.Columns.Add("Stage Updated Date");
                    MainDataTable.Columns.Add("Search Keyword");
                    MainDataTable.Columns.Add("Page Url");
                    MainDataTable.Columns.Add("Referrer Url");
                    MainDataTable.Columns.Add("Notes");
                    MainDataTable.Columns.Add("FollowUp Date");
                    MainDataTable.Columns.Add("FollowUp User Name");
                    MainDataTable.Columns.Add("Label Updated Date");
                    MainDataTable.Columns.Add("Reminder Date");
                    MainDataTable.Columns.Add("Created Date");
                    MainDataTable.Columns.Add("Updated Date");
                    MainDataTable.Columns.Add("Revenue");
                    MainDataTable.Columns.Add("Closure Date");

                    string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(AdsId, DbType);
                    ContactFieldPropertyList.AddRange(addlmspropertieslist);
                    for (int i = 0; i < dtListOfResponsesData.Rows.Count; i++)
                    {
                        DataRow dr = MainDataTable.NewRow();

                        foreach (var ContactFieldProperty in ContactFieldPropertyList)
                        {
                            if (ContactFieldProperty.PropertyName != "UserInfoUserId" && ContactFieldProperty.PropertyName != "Score")
                                dr[ContactFieldProperty.DisplayName] = Convert.ToString(dtListOfResponsesData.Rows[i][ContactFieldProperty.PropertyName]);
                        }

                        dr["Source"] = Convert.ToString(dtListOfResponsesData.Rows[i]["LmsGroupName"]);

                        if (!String.IsNullOrEmpty(Convert.ToString(dtListOfResponsesData.Rows[i]["UserInfoUserId"])) && userHierarchy != null && userHierarchy.Count > 0)
                        {
                            var userList = (from p in userHierarchy
                                            where p.UserInfoUserId == Convert.ToInt32(dtListOfResponsesData.Rows[i]["UserInfoUserId"])
                                            select p.FirstName).ToList();
                            if (userList != null && userList.Count > 0)
                                dr["Handled By"] = userList[0];
                        }

                        int ScoreValue = 0;
                        if (!String.IsNullOrEmpty(Convert.ToString(dtListOfResponsesData.Rows[i]["Score"])))
                            ScoreValue = Convert.ToInt32(Convert.ToString(dtListOfResponsesData.Rows[i]["Score"]));

                        if (ScoreValue > -1 && lmsStageList != null && lmsStageList.Count > 0)
                        {
                            var stageList = (from p in lmsStageList
                                             where p.Score == ScoreValue
                                             select p.Stage).ToList();
                            if (stageList != null && stageList.Count > 0)
                                dr["Stage"] = stageList[0];
                        }

                        dr["Stage Updated Date"] = Convert.ToString(dtListOfResponsesData.Rows[i]["ScoreUpdatedDate"]) == "" ? "" : Convert.ToString(Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(Convert.ToString(dtListOfResponsesData.Rows[i]["ScoreUpdatedDate"]))));
                        dr["Search Keyword"] = Convert.ToString(dtListOfResponsesData.Rows[i]["SearchKeyword"]);
                        dr["Page Url"] = Convert.ToString(dtListOfResponsesData.Rows[i]["PageUrl"]);
                        dr["Referrer Url"] = Convert.ToString(dtListOfResponsesData.Rows[i]["ReferrerUrl"]);
                        dr["Notes"] = Convert.ToString(dtListOfResponsesData.Rows[i]["Notes"]);
                        dr["FollowUp Date"] = Convert.ToString(dtListOfResponsesData.Rows[i]["FollowUpDate"]) == "" ? "" : Convert.ToString(Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(Convert.ToString(dtListOfResponsesData.Rows[i]["FollowUpDate"]))));

                        //For Follow Up UserId
                        int FollowUpUserId = 0;
                        if (!String.IsNullOrEmpty(Convert.ToString(dtListOfResponsesData.Rows[i]["FollowUpUserId"])))
                            FollowUpUserId = Convert.ToInt32(Convert.ToString(dtListOfResponsesData.Rows[i]["FollowUpUserId"]));

                        if (FollowUpUserId > 0 && userHierarchy != null && userHierarchy.Count > 0)
                        {
                            var followupuserList = (from p in userHierarchy
                                                    where p.UserInfoUserId == FollowUpUserId
                                                    select p.FirstName).ToList();
                            if (followupuserList != null && followupuserList.Count > 0)
                                dr["FollowUp User Name"] = followupuserList[0];
                        }

                        dr["Label Updated Date"] = Convert.ToString(dtListOfResponsesData.Rows[i]["LeadLabelUpdatedDate"]) == "" ? "" : Convert.ToString(Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(Convert.ToString(dtListOfResponsesData.Rows[i]["LeadLabelUpdatedDate"]))));

                        dr["Reminder Date"] = Convert.ToString(dtListOfResponsesData.Rows[i]["ReminderDate"]) == "" ? "" : Convert.ToString(Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(Convert.ToString(dtListOfResponsesData.Rows[i]["ReminderDate"]))));

                        dr["Created Date"] = Convert.ToString(dtListOfResponsesData.Rows[i]["CreatedDate"]) == "" ? "" : Convert.ToString(Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(Convert.ToString(dtListOfResponsesData.Rows[i]["CreatedDate"]))));
                        dr["Updated Date"] = Convert.ToString(dtListOfResponsesData.Rows[i]["UpdatedDate"]) == "" ? "" : Convert.ToString(Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(Convert.ToString(dtListOfResponsesData.Rows[i]["UpdatedDate"]))));
                        dr["Revenue"] = string.IsNullOrEmpty(Convert.ToString(dtListOfResponsesData.Rows[i]["Revenue"])) ? "0" : Convert.ToString(dtListOfResponsesData.Rows[i]["Revenue"]);
                        dr["Closure Date"] = Convert.ToString(dtListOfResponsesData.Rows[i]["ClouserDate"]) == "" ? "" : Convert.ToString(Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(Convert.ToString(dtListOfResponsesData.Rows[i]["ClouserDate"]))));

                        MainDataTable.Rows.Add(dr);
                    }
                    dataSet.Tables.Add(MainDataTable);
                }
            }
            else
            {
                dataSet.Tables.Add(MainDataTable);
            }

            string FileName = "LMSExport_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + FileType;

            string Path = Convert.ToString(AllConfigURLDetails.KeyValueForConfig["MAINPATH"]) + "\\TempFiles\\" + FileName;

            if (FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, Path);
            else
                Helper.SaveDataSetToExcel(dataSet, Path);

            MainPath = Convert.ToString(AllConfigURLDetails.KeyValueForConfig["ONLINEURL"]) + "TempFiles/" + FileName;
        }

        public async Task HistoryExport(int AdsId, List<MLLeadsDetails> customReport, List<MLUserHierarchy> userHierarchy, string FileType, string StartDate, string EndDate, string DbType)
        {
            DataSet dataSet = new DataSet("General");
            DataTable MainDataTable = new DataTable();
            List<string> DistinctFieldNames = new List<string>();

            if (customReport != null && customReport.Count > 0)
            {
                List<ContactExtraField> contactExtraFields = new List<ContactExtraField>();
                using (var objContactFields = DLContactExtraField.GetDLContactExtraField(AdsId, DbType))
                {
                    contactExtraFields = await objContactFields.GetList();
                }
                List<LmsCustomFields> LmsCustomFields;
                List<ContactFieldProperty> addlmspropertieslist = new List<ContactFieldProperty>();
                using (var objLmsLeads = DLLmsCustomFields.GetDLLmsCustomFields(AdsId, DbType))
                {
                    LmsCustomFields = await objLmsLeads.GetDetails();
                }
                LmsCustomFields = LmsCustomFields.Where(x => x.Position != null).Select(x => x).ToList();
                List<LmsStage> lmsStageList = new List<LmsStage>();
                using (var objStage = DLLmsStage.GetDLLmsStage(AdsId, DbType))
                {
                    lmsStageList = await objStage.GetAllList();
                }

                MainDataTable.Columns.Add("Name");
                MainDataTable.Columns.Add("Email Id");
                MainDataTable.Columns.Add("Phone Number");
                MainDataTable.Columns.Add("Stage");
                MainDataTable.Columns.Add("Source");
                MainDataTable.Columns.Add("Handled By");
                MainDataTable.Columns.Add("Column Name");
                MainDataTable.Columns.Add("Previous Value");
                MainDataTable.Columns.Add("Updated Value");
                MainDataTable.Columns.Add("Updated Date");
                MainDataTable.Columns.Add("Revenue");
                MainDataTable.Columns.Add("Closure Date");
                List<int> ContactIds = customReport.Select(x => x.ContactId).Distinct().ToList();

                List<MLContact> lmshistorydetails = new List<MLContact>();
                if (StartDate != null && EndDate != null && StartDate!=""&& EndDate!="")
                {
                    using (var objDL = DLLmsCustomReport.GetDLLmsCustomReport(AdsId, DbType))
                    {
                        lmshistorydetails = await objDL.GetLeadsHistoryReport("GetLeadsCurrentHistory", ContactIds, StartDate, EndDate);
                        lmshistorydetails.AddRange(await objDL.GetLeadsHistoryReport("GetLeadsHistoryReport", ContactIds, StartDate, EndDate));
                    }
                }
                else
                {
                    using (var objDL = DLLmsCustomReport.GetDLLmsCustomReport(AdsId, DbType))
                    {
                        lmshistorydetails = await objDL.GetLeadsHistoryReport("GetLeadsCurrentHistory", ContactIds, DateTime.UtcNow.AddMonths(-6).ToString("yyyyMMdd"), DateTime.UtcNow.ToString("yyyyMMdd"));
                        lmshistorydetails.AddRange(await objDL.GetLeadsHistoryReport("GetLeadsHistoryReport", ContactIds, DateTime.UtcNow.AddMonths(-6).ToString("yyyyMMdd"), DateTime.UtcNow.ToString("yyyyMMdd")));
                    }
                }

                foreach (var ContactId in ContactIds)
                {
                    //var createdDate = (from p in customReport
                    //                   where p.ContactId == Convert.ToInt32(ContactId)
                    //                   select p.CreatedDate).ToList();

                    //MLUCPVisitor mLUCPVisitor;
                    //if (StartDate != null && EndDate != null)
                    //    mLUCPVisitor = new MLUCPVisitor() { ContactId = ContactId, FromDate = createdDate[0], ToDate = DateTime.UtcNow };
                    //else
                    //    mLUCPVisitor = new MLUCPVisitor() { ContactId = ContactId, FromDate = DateTime.ParseExact(StartDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture), ToDate = DateTime.ParseExact(EndDate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture) };

                    //List<MLContact> individualHistoryDetails = new List<MLContact>();
                    //using (DLUCP objDL = new DLUCP(AdsId))
                    //{
                    //    individualHistoryDetails = objDL.GetLmsAuditDetails(mLUCPVisitor);
                    //}

                    var individualHistoryDetails = lmshistorydetails.Where(x => x.ContactId == ContactId).ToList();

                    DataTable dtListOfResponsesData = new DataTable();
                    dtListOfResponsesData = Helper.ToDataTables(individualHistoryDetails);

                    if (dtListOfResponsesData != null && dtListOfResponsesData.Rows.Count > 0)
                    {
                        string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(AdsId, DbType);
                        PropertyInfo[] properties = typeof(MLContact).GetProperties();

                        string CurrentName = String.Empty, CurrentEmailId = String.Empty, CurrentPhoneNumber = String.Empty;
                        for (int i = 1; i < dtListOfResponsesData.Rows.Count; i++)
                        {
                            if (i == 1)
                            {
                                CurrentName = Convert.ToString(dtListOfResponsesData.Rows[i - 1]["Name"]) != null && Convert.ToString(dtListOfResponsesData.Rows[i - 1]["Name"]) != "" ? Convert.ToString(dtListOfResponsesData.Rows[i - 1]["Name"]) : "NA";
                                CurrentEmailId = Convert.ToString(dtListOfResponsesData.Rows[i - 1]["EmailId"]) != null && Convert.ToString(dtListOfResponsesData.Rows[i - 1]["EmailId"]) != "" ? Convert.ToString(dtListOfResponsesData.Rows[i - 1]["EmailId"]) : "NA";
                                CurrentPhoneNumber = Convert.ToString(dtListOfResponsesData.Rows[i - 1]["PhoneNumber"]) != null && Convert.ToString(dtListOfResponsesData.Rows[i - 1]["PhoneNumber"]) != "" ? Convert.ToString(dtListOfResponsesData.Rows[i - 1]["PhoneNumber"]) : "NA";
                            }

                            for (var j = 0; j < properties.Length; j++)
                            {
                                if (properties[j].Name.ToLower() != "lastmodifybyuserid" && properties[j].Name.ToLower() != "usergroupid" && properties[j].Name.ToLower() != "contactid" && properties[j].Name.ToLower() != "lmsgroupid" && properties[j].Name.ToLower() != "remarks" && properties[j].Name.ToLower() != "toreminderphonenumber" && properties[j].Name.ToLower() != "toreminderemailid" && properties[j].Name.ToLower() != "isadsenseoradword" && properties[j].Name.ToLower() != "createddate" && properties[j].Name.ToLower() != "updateddate" && properties[j].Name.ToLower() != "notes" && properties[j].Name.ToLower() != "mailtemplateid" && properties[j].Name.ToLower() != "mailalertscheduledate" && properties[j].Name.ToLower() != "fromemailid" && properties[j].Name.ToLower() != "subject" && properties[j].Name.ToLower() != "fromname" && properties[j].Name.ToLower() != "smstemplateid" && properties[j].Name.ToLower() != "smsalertscheduledate" && properties[j].Name.ToLower() != "customsmscontent" && properties[j].Name.ToLower() != "isnewlead" && properties[j].Name.ToLower() != "scoreupdateddate" && properties[j].Name.ToLower() != "followupcontent" && properties[j].Name.ToLower() != "followupstatus" && properties[j].Name.ToLower() != "followupuserid" && properties[j].Name.ToLower() != "followupupdateddate" && properties[j].Name.ToLower() != "leadlabelupdateddate" && properties[j].Name.ToLower() != "followupcreateddate" && properties[j].Name.ToLower() != "handledbyupdateddate" && properties[j].Name.ToLower() != "issourcemoved" && properties[j].Name.ToLower() != "sourcemoveddate")
                                {
                                    if (Convert.ToString(dtListOfResponsesData.Rows[i - 1]["" + properties[j].Name + ""]) != Convert.ToString(dtListOfResponsesData.Rows[i]["" + properties[j].Name + ""]))
                                    {
                                        DataRow dr = MainDataTable.NewRow();
                                        dr["Name"] = CurrentName;
                                        dr["Email Id"] = CurrentEmailId;
                                        dr["Phone Number"] = CurrentPhoneNumber;
                                        var oldStageValue = (from p in lmsStageList
                                                             where p.Score == Convert.ToInt32(dtListOfResponsesData.Rows[i]["Score"])
                                                             select p.Stage).ToList();
                                        dr["Stage"] = oldStageValue != null && oldStageValue.Count > 0 ? oldStageValue[0] : "NA";
                                        dr["Source"] = dtListOfResponsesData.Rows[i]["LmsGroupName"];
                                        var oldHandledByValue = (from p in userHierarchy
                                                                 where p.UserInfoUserId == Convert.ToInt32(dtListOfResponsesData.Rows[i]["UserInfoUserId"])
                                                                 select p.FirstName).ToList();
                                        dr["Handled By"] = oldHandledByValue != null && oldHandledByValue.Count > 0 ? oldHandledByValue[0] : "NA";

                                        if (properties[j].Name.ToLower() == "userinfouserid")
                                        {
                                            dr["Column Name"] = "Handled By";

                                            if (Convert.ToInt32(dtListOfResponsesData.Rows[i - 1]["" + properties[j].Name + ""]) > 0)
                                            {
                                                var currentValue = (from p in userHierarchy
                                                                    where p.UserInfoUserId == Convert.ToInt32(dtListOfResponsesData.Rows[i - 1]["" + properties[j].Name + ""])
                                                                    select p.FirstName).ToList();

                                                dr["Updated Value"] = currentValue != null && currentValue.Count > 0 ? currentValue[0] : "NA";
                                            }
                                            else
                                                dr["Updated Value"] = "NA";

                                            if (Convert.ToInt32(dtListOfResponsesData.Rows[i]["" + properties[j].Name + ""]) > 0)
                                            {
                                                var oldValue = (from p in userHierarchy
                                                                where p.UserInfoUserId == Convert.ToInt32(dtListOfResponsesData.Rows[i]["" + properties[j].Name + ""])
                                                                select p.FirstName).ToList();

                                                dr["Previous Value"] = oldValue != null && oldValue.Count > 0 ? oldValue[0] : "NA";
                                            }
                                            else
                                                dr["Previous Value"] = "NA";
                                        }

                                        if (properties[j].Name.ToLower().Contains("customfield"))
                                        {
                                            if (contactExtraFields != null && contactExtraFields.Count > 0)
                                            {
                                                int cutomFieldIndex = properties[j].Name.Length == 12 ? Convert.ToInt32(properties[j].Name.Substring(properties[j].Name.Length - 1, 1)) : Convert.ToInt32(properties[j].Name.Substring(properties[j].Name.Length - 2, 2));
                                                dr["Column Name"] = Convert.ToString(contactExtraFields[cutomFieldIndex - 1].FieldName);
                                            }
                                            else
                                                dr["Column Name"] = "NA";

                                            dr["Updated Value"] = dtListOfResponsesData.Rows[i - 1]["" + properties[j].Name + ""] != null && Convert.ToString(dtListOfResponsesData.Rows[i - 1]["" + properties[j].Name + ""]) != String.Empty ? Convert.ToString(dtListOfResponsesData.Rows[i - 1]["" + properties[j].Name + ""]) : "NA";

                                            dr["Previous Value"] = dtListOfResponsesData.Rows[i]["" + properties[j].Name + ""] != null && Convert.ToString(dtListOfResponsesData.Rows[i]["" + properties[j].Name + ""]) != String.Empty ? Convert.ToString(dtListOfResponsesData.Rows[i]["" + properties[j].Name + ""]) : "NA";
                                        }

                                        if (properties[j].Name.ToLower() == "score")
                                        {
                                            dr["Column Name"] = "Stage";

                                            if (Convert.ToInt32(dtListOfResponsesData.Rows[i - 1]["" + properties[j].Name + ""]) >= 0)
                                            {
                                                var currentValue = (from p in lmsStageList
                                                                    where p.Score == Convert.ToInt32(dtListOfResponsesData.Rows[i - 1]["" + properties[j].Name + ""])
                                                                    select p.Stage).ToList();

                                                dr["Updated Value"] = currentValue != null && currentValue.Count > 0 ? currentValue[0] : "NA";
                                            }
                                            else
                                                dr["Updated Value"] = "NA";

                                            if (Convert.ToInt32(dtListOfResponsesData.Rows[i]["" + properties[j].Name + ""]) >= 0)
                                            {
                                                var oldValue = (from p in lmsStageList
                                                                where p.Score == Convert.ToInt32(dtListOfResponsesData.Rows[i]["" + properties[j].Name + ""])
                                                                select p.Stage).ToList();

                                                dr["Previous Value"] = oldValue != null && oldValue.Count > 0 ? oldValue[0] : "NA";
                                            }
                                            else
                                                dr["Previous Value"] = "NA";
                                        }

                                        if (properties[j].Name.ToLower() == "reminderdate" || properties[j].Name.ToLower() == "age" || properties[j].Name.ToLower() == "followupdate")
                                        {
                                            dr["Column Name"] = properties[j].Name;

                                            dr["Updated Value"] = Convert.ToString(dtListOfResponsesData.Rows[i - 1]["" + properties[j].Name + ""]) == "" ? "NA" : Convert.ToString(Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(Convert.ToString(dtListOfResponsesData.Rows[i - 1]["" + properties[j].Name + ""]))));

                                            dr["Previous Value"] = Convert.ToString(dtListOfResponsesData.Rows[i]["" + properties[j].Name + ""]) == "" ? "NA" : Convert.ToString(Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(Convert.ToString(dtListOfResponsesData.Rows[i]["" + properties[j].Name + ""]))));
                                        }

                                        if (properties[j].Name.ToLower() == "searchkeyword" || properties[j].Name.ToLower() == "pageurl" || properties[j].Name.ToLower() == "referrerurl" || properties[j].Name.ToLower() == "name" || properties[j].Name.ToLower() == "emailid" || properties[j].Name.ToLower() == "phonenumber" || properties[j].Name.ToLower() == "alternateemailids" || properties[j].Name.ToLower() == "alternatephonenumbers" || properties[j].Name.ToLower() == "lmsgroupname" || properties[j].Name.ToLower() == "place" || properties[j].Name.ToLower() == "companyname" || properties[j].Name.ToLower() == "address1" || properties[j].Name.ToLower() == "address2"
                                            || properties[j].Name.ToLower() == "statename" || properties[j].Name.ToLower() == "domainname" || properties[j].Name.ToLower() == "religion" || properties[j].Name.ToLower() == "zipcode" || properties[j].Name.ToLower() == "companyweburl" || properties[j].Name.ToLower() == "companyaddress" || properties[j].Name.ToLower() == "projects" || properties[j].Name.ToLower() == "maritalstatus" || properties[j].Name.ToLower() == "interests" || properties[j].Name.ToLower() == "country" || properties[j].Name.ToLower() == "gender" || properties[j].Name.ToLower() == "education" || properties[j].Name.ToLower() == "occupation" || properties[j].Name.ToLower() == "location" || properties[j].Name.ToLower() == "lastname" || properties[j].Name.ToLower() == "leadlabel")
                                        {
                                            dr["Column Name"] = properties[j].Name.ToLower() == "lmsgroupname" ? "Source" : properties[j].Name;

                                            dr["Updated Value"] = Convert.ToString(dtListOfResponsesData.Rows[i - 1]["" + properties[j].Name + ""]) == "" ? "NA" : Convert.ToString(dtListOfResponsesData.Rows[i - 1]["" + properties[j].Name + ""]);

                                            dr["Previous Value"] = Convert.ToString(dtListOfResponsesData.Rows[i]["" + properties[j].Name + ""]) == "" ? "NA" : Convert.ToString(dtListOfResponsesData.Rows[i]["" + properties[j].Name + ""]);
                                        }

                                        if (properties[j].Name.ToLower() == "repeatleadcount")
                                        {
                                            dr["Column Name"] = "Repeat Lead";

                                            dr["Updated Value"] = Convert.ToString(dtListOfResponsesData.Rows[i - 1]["UpdatedDate"]) == "" ? "NA" : Convert.ToString(Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(Convert.ToString(dtListOfResponsesData.Rows[i - 1]["UpdatedDate"]))));

                                            dr["Previous Value"] = Convert.ToString(dtListOfResponsesData.Rows[i]["UpdatedDate"]) == "" ? "NA" : Convert.ToString(Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(Convert.ToString(dtListOfResponsesData.Rows[i]["UpdatedDate"]))));
                                        }

                                        dr["Updated Date"] = Convert.ToString(dtListOfResponsesData.Rows[i - 1]["UpdatedDate"]) == "" ? "NA" : Convert.ToString(Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(Convert.ToString(dtListOfResponsesData.Rows[i - 1]["UpdatedDate"]))));
                                        dr["Revenue"] = string.IsNullOrEmpty(Convert.ToString(dtListOfResponsesData.Rows[i]["Revenue"])) ? "0" : Convert.ToString(dtListOfResponsesData.Rows[i]["Revenue"]);
                                        dr["Closure Date"] = Convert.ToString(dtListOfResponsesData.Rows[i]["ClouserDate"]) == "" ? "" : Convert.ToString(Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(Convert.ToString(dtListOfResponsesData.Rows[i]["ClouserDate"]))));

                                        MainDataTable.Rows.Add(dr);
                                    }
                                }
                            }
                        }
                    }
                }
                dataSet.Tables.Add(MainDataTable);
            }
            else
            {
                dataSet.Tables.Add(MainDataTable);
            }

            string FileName = "LMSHistoryExport_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + FileType;

            string Path = Convert.ToString(AllConfigURLDetails.KeyValueForConfig["MAINPATH"]) + "\\TempFiles\\" + FileName;

            if (FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, Path);
            else
                Helper.SaveDataSetToExcel(dataSet, Path);

            MainPath = Convert.ToString(AllConfigURLDetails.KeyValueForConfig["ONLINEURL"]) + "TempFiles/" + FileName;
        }
        public async Task<List<LmsCampaingReport>> GetLmsCampaignDetails(LoginInfo user, int AccountId, int UserId, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OffSet, int FetchNext, string UserinfoName, int OrderbyVal, LmsCustomReport filterLead, string DbType)
        {

            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            List<LmsCampaingReport> finalcampaignreportdetails = new List<LmsCampaingReport>();
            int userHierarchyUserId = 0;
            if (UserId == 0)
            {
                userHierarchyUserId = user.UserId;
                using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(DbType))
                {
                    userHierarchy = await objUserHierarchy.GetHisUsers(userHierarchyUserId, AccountId);
                    userHierarchy.Add(await objUserHierarchy.GetHisDetails(userHierarchyUserId));
                }
                userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();
            }
            else
            {
                userHierarchyUserId = UserId;
                using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(DbType))
                {
                    userHierarchy.Add(await objUserHierarchy.GetHisDetails(userHierarchyUserId));
                }
                userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();
            }
            List<int> usersId = new List<int>();
            string UserIdList = "";
            if (UserinfoName != null && UserinfoName != "")
                usersId = userHierarchy.Where(x => x.FirstName.ToLower().Contains("" + UserinfoName + "")).Select(x => x.UserInfoUserId).Distinct().ToList();
            else
                usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();
            UserIdList = string.Join(",", usersId.ToArray());
            DataSet dataSet = new DataSet();
            if (UserIdList != "")
            {
                using (var objDL = DLLmsCampaignReport.GetDLLmsCampaignReport(AccountId, DbType))
                {
                    dataSet = await objDL.GetLmsCampaignReport(UserIdList, FromDateTime, ToDateTime, OffSet, FetchNext, OrderbyVal, filterLead);
                }
            }

            var myData = dataSet.Tables[0].AsEnumerable().Select(r => new LmsCampaingReport
            {
                UserInfoUserId = r.Field<int>("UserInfoUserId"),
                LMSMailcount = r.Field<int>("LMSMailcount"),
                LMSSmscount = r.Field<int>("LMSSmscount"),
                LMSWhatsAppCount = r.Field<int>("LMSWhatsAppCount"),
                LMScallcount = r.Field<int>("LMScallcount"),
                InBound = r.Field<int>("InBound"),
                OutBound = r.Field<int>("OutBound"),
                CalledNumber = r.Field<string>("CalledNumber")
            });

            List<LmsCampaingReport> eachdetails = myData.ToList();

            if (eachdetails != null && eachdetails.Count() > 0)
            {
                //for (int k = 0; k < eachdetails.Count(); k++)
                //{
                //    if (eachdetails[k].CalledNumber != "0" )
                //    {
                //        string _callednumber = eachdetails[k].CalledNumber;
                //        if (_callednumber.Length > 10)
                //            _callednumber = eachdetails[k].CalledNumber.Substring(2);

                //        eachdetails[k].UserInfoUserId = userHierarchy.Where(x => x.MobilePhone == _callednumber).Select(p => p.UserInfoUserId).FirstOrDefault();
                //        //eachdetails[k].UserInfoUserId = userHierarchy.Where(x => x.MobilePhone == _callednumber).Select(x => x).ToList()[0].UserInfoUserId;
                //    }
                //}
                List<int> userList = eachdetails.Where(x => x.UserInfoUserId != 0).Select(x => x.UserInfoUserId).Distinct().ToList();

                if (userList != null && userList.Count() > 0)
                {
                    for (int i = 0; i < userList.Count(); i++)
                    {
                        List<LmsCampaingReport> eachcampaigndetails = new List<LmsCampaingReport>();
                        eachcampaigndetails = eachdetails.Where(x => x.UserInfoUserId == userList[i]).Select(x => x).ToList();
                        LmsCampaingReport _eachcampaigndetails = new LmsCampaingReport();
                        if (eachcampaigndetails != null && eachcampaigndetails.Count() > 0)
                        {
                            for (int j = 0; j < eachcampaigndetails.Count(); j++)
                            {
                                _eachcampaigndetails.LMSMailcount += eachcampaigndetails[j].LMSMailcount;
                                _eachcampaigndetails.LMSSmscount += eachcampaigndetails[j].LMSSmscount;
                                _eachcampaigndetails.LMSWhatsAppCount += eachcampaigndetails[j].LMSWhatsAppCount;
                                _eachcampaigndetails.LMScallcount += eachcampaigndetails[j].LMScallcount;
                                _eachcampaigndetails.InBound += eachcampaigndetails[j].InBound;
                                _eachcampaigndetails.OutBound += eachcampaigndetails[j].OutBound;

                            }

                            _eachcampaigndetails.UserInfoUserId = eachcampaigndetails[0].UserInfoUserId;
                            _eachcampaigndetails.CalledNumber = eachcampaigndetails[0].CalledNumber == "" ? "NA" : eachcampaigndetails[0].CalledNumber;

                            if (eachcampaigndetails[0].UserInfoUserId == 0)
                                _eachcampaigndetails.UserinfoName = "NA";
                            else
                                _eachcampaigndetails.UserinfoName = userHierarchy.Where(x => x.UserInfoUserId == eachcampaigndetails[0].UserInfoUserId).Select(x => x).ToList()[0].FirstName;
                            finalcampaignreportdetails.Add(_eachcampaigndetails);
                        }

                    }
                }
            }
            return finalcampaignreportdetails.OrderByDescending(x => x.UserInfoUserId).Skip(OffSet).Take(FetchNext).ToList(); ;
        }
        public async Task<List<LmsFollowUpReport>> GetLmsFollowUpDetails(LoginInfo user, int AccountId, int UserId, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int OffSet, int FetchNext, string UserinfoName, string DbType)
        {

            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
            List<LmsFollowUpReport> finalLmsFollowUpreportdetails = new List<LmsFollowUpReport>();
            int userHierarchyUserId = 0;
            if (UserId == 0)
            {
                userHierarchyUserId = user.UserId;
                using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(DbType))
                {
                    userHierarchy = await objUserHierarchy.GetHisUsers(userHierarchyUserId, AccountId);
                    userHierarchy.Add(await objUserHierarchy.GetHisDetails(userHierarchyUserId));
                }
                userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();
            }
            else
            {
                userHierarchyUserId = UserId;
                using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(DbType))
                {
                    userHierarchy.Add(await objUserHierarchy.GetHisDetails(userHierarchyUserId));
                }
                userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();
            }
            List<int> usersId = new List<int>();
            string UserIdList = "";
            if (UserinfoName != null && UserinfoName != "")
                usersId = userHierarchy.Where(x => x.FirstName.ToLower().Contains("" + UserinfoName + "")).Select(x => x.UserInfoUserId).Distinct().ToList();
            else
                usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();
            UserIdList = string.Join(",", usersId.ToArray());
            DataSet dataSet = new DataSet();
            if (UserIdList != "")
            {
                using (var objDL = DLLmsFollowUpReport.GetDLLmsFollowUpReport(AccountId, DbType))
                {
                    dataSet = await objDL.GetLmsFollowUpReport(UserIdList, FromDateTime, ToDateTime, OffSet, FetchNext);
                }
            }

            var myData = dataSet.Tables[0].AsEnumerable().Select(r => new LmsFollowUpReport
            {
                FollowUpUserId = r.Field<int>("FollowUpUserId"),
                PlannedCount = r.Field<int>("PlannedCount"),
                MissedCount = r.Field<int>("MissedCount"),
                CompleteCount = r.Field<int>("CompleteCount")
            });

            List<LmsFollowUpReport> eachdetails = myData.ToList();

            if (eachdetails != null && eachdetails.Count() > 0)
            {
                List<int> userList = eachdetails.Select(x => x.FollowUpUserId).Distinct().ToList();

                if (userList != null && userList.Count() > 0)
                {
                    for (int i = 0; i < userList.Count(); i++)
                    {
                        List<LmsFollowUpReport> eachfollowupdetails = new List<LmsFollowUpReport>();

                        eachfollowupdetails = eachdetails.Where(x => x.FollowUpUserId == userList[i]).Select(x => x).ToList();
                        LmsFollowUpReport _eachfollowupdetails = new LmsFollowUpReport();
                        if (eachfollowupdetails != null && eachfollowupdetails.Count() > 0)
                        {
                            for (int j = 0; j < eachfollowupdetails.Count(); j++)
                            {
                                _eachfollowupdetails.PlannedCount += eachfollowupdetails[j].PlannedCount;
                                _eachfollowupdetails.MissedCount += eachfollowupdetails[j].MissedCount;
                                _eachfollowupdetails.CompleteCount += eachfollowupdetails[j].CompleteCount;

                            }

                            _eachfollowupdetails.FollowUpUserId = eachfollowupdetails[0].FollowUpUserId;
                            if (eachfollowupdetails[0].FollowUpUserId == 0)
                                _eachfollowupdetails.UserinfoName = "NA";
                            else
                                _eachfollowupdetails.UserinfoName = userHierarchy.Where(x => x.UserInfoUserId == eachfollowupdetails[0].FollowUpUserId).Select(x => x).ToList()[0].FirstName;

                            finalLmsFollowUpreportdetails.Add(_eachfollowupdetails);
                        }

                    }
                }
            }
            return finalLmsFollowUpreportdetails.OrderByDescending(x => x.FollowUpUserId).Skip(OffSet).Take(FetchNext).ToList(); ;
        }
        public async Task PublisherExport(int AdsId, List<MLLeadsDetails> mLContacts, List<MLUserHierarchy> userHierarchy, string FileType, string DbType)
        {
            DataSet dataSet = new DataSet("General");
            DataTable MainDataTable = new DataTable();
            List<string> DistinctFieldNames = new List<string>();

            List<LmsStage> lmsStageList = new List<LmsStage>();
            using (var objStage = DLLmsStage.GetDLLmsStage(AdsId, DbType))
            {
                lmsStageList = await objStage.GetAllList();
            }

            List<ContactFieldProperty> ContactFieldPropertyList;
            using (var objDL = DLContactFieldProperty.GetDLContactFieldProperty(AdsId, DbType))
            {
                ContactFieldPropertyList = await objDL.GetSelectedContactField();
            }
            List<LmsCustomFields> LmsCustomFields;
            List<ContactFieldProperty> addlmspropertieslist = new List<ContactFieldProperty>();
            using (var objLmsLeads = DLLmsCustomFields.GetDLLmsCustomFields(AdsId, DbType))
            {
                LmsCustomFields = await objLmsLeads.GetDetails();
            }
            LmsCustomFields = LmsCustomFields.Where(x => x.PublisherField == true).Select(x => x).ToList();
            ContactFieldPropertyList = ContactFieldPropertyList.Where(x => x.IsPublisherField == true).Select(x => x).ToList();


            if (mLContacts != null && mLContacts.Count > 0)
            {
                DataTable dtListOfResponsesData = new DataTable();
                dtListOfResponsesData = Helper.ToDataTables(mLContacts);

                if (dtListOfResponsesData != null && dtListOfResponsesData.Rows.Count > 0)
                {
                    foreach (var ContactFieldProperty in ContactFieldPropertyList)
                    {
                        if (ContactFieldProperty.PropertyName != "UserInfoUserId" && ContactFieldProperty.PropertyName != "Score" && ContactFieldProperty.PropertyName != "Remarks")

                            MainDataTable.Columns.Add(ContactFieldProperty.DisplayName);
                    }

                    if (LmsCustomFields != null && LmsCustomFields.Count > 0)
                    {
                        for (int i = 0; i < LmsCustomFields.Count; i++)
                        {
                            ContactFieldProperty addlmsproperties = new ContactFieldProperty();
                            MainDataTable.Columns.Add(LmsCustomFields[i].FieldDisplayName);
                            addlmsproperties.DisplayName = LmsCustomFields[i].FieldDisplayName.ToString();
                            addlmsproperties.PropertyName = LmsCustomFields[i].FieldName.ToString();
                            addlmspropertieslist.Add(addlmsproperties);
                        }
                    }
                    MainDataTable.Columns.Add("Stage");
                    MainDataTable.Columns.Add("Source");
                    MainDataTable.Columns.Add("Created Date");

                    string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(AdsId, DbType);
                    ContactFieldPropertyList.AddRange(addlmspropertieslist);
                    for (int i = 0; i < dtListOfResponsesData.Rows.Count; i++)
                    {
                        DataRow dr = MainDataTable.NewRow();

                        foreach (var ContactFieldProperty in ContactFieldPropertyList)
                        {
                            if (ContactFieldProperty.PropertyName != "UserInfoUserId" && ContactFieldProperty.PropertyName != "Score")
                                dr[ContactFieldProperty.DisplayName] = String.IsNullOrEmpty(Convert.ToString(dtListOfResponsesData.Rows[i][ContactFieldProperty.PropertyName])) ? "NA" : Convert.ToString(dtListOfResponsesData.Rows[i][ContactFieldProperty.PropertyName]);
                        }

                        dr["Source"] = Convert.ToString(dtListOfResponsesData.Rows[i]["LmsGroupName"]);

                        //if (!String.IsNullOrEmpty(Convert.ToString(dtListOfResponsesData.Rows[i]["UserInfoUserId"])) && userHierarchy != null && userHierarchy.Count > 0)
                        //{
                        //    var userList = (from p in userHierarchy
                        //                    where p.UserInfoUserId == Convert.ToInt32(dtListOfResponsesData.Rows[i]["UserInfoUserId"])
                        //                    select p.FirstName).ToList();
                        //    if (userList != null && userList.Count > 0)
                        //        dr["Handled By"] = userList[0];
                        //}

                        int ScoreValue = 0;
                        if (!String.IsNullOrEmpty(Convert.ToString(dtListOfResponsesData.Rows[i]["Score"])))
                            ScoreValue = Convert.ToInt32(Convert.ToString(dtListOfResponsesData.Rows[i]["Score"]));

                        if (ScoreValue > -1 && lmsStageList != null && lmsStageList.Count > 0)
                        {
                            var stageList = (from p in lmsStageList
                                             where p.Score == ScoreValue
                                             select p.Stage).ToList();
                            if (stageList != null && stageList.Count > 0)
                                dr["Stage"] = stageList[0];
                        }

                        dr["Created Date"] = Convert.ToString(dtListOfResponsesData.Rows[i]["CreatedDate"]) == "" ? "" : Convert.ToString(Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(Convert.ToString(dtListOfResponsesData.Rows[i]["CreatedDate"]))));

                        MainDataTable.Rows.Add(dr);
                    }
                    dataSet.Tables.Add(MainDataTable);
                }
            }
            else
            {
                dataSet.Tables.Add(MainDataTable);
            }

            string FileName = "LMSPublisherExport_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + FileType;

            string Path = Convert.ToString(AllConfigURLDetails.KeyValueForConfig["MAINPATH"]) + "\\TempFiles\\" + FileName;

            if (FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, Path);
            else
                Helper.SaveDataSetToExcel(dataSet, Path);

            MainPath = Convert.ToString(AllConfigURLDetails.KeyValueForConfig["ONLINEURL"]) + "TempFiles/" + FileName;
        }
    }
}
