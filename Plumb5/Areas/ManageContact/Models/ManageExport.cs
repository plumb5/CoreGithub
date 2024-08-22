using P5GenralDL;
using P5GenralML;
using Plumb5GenralFunction;
using System.Data;

namespace Plumb5.Areas.ManageContact.Models
{
    public class ManageExport
    {
        private readonly string? sqlVendor;

        public string MainPath { get; set; }
        public ManageExport(string? sqlVendor)
        {
            this.sqlVendor = sqlVendor;
        }
        //Darshan
        public async Task Export(int AdsId, int UserId, List<Contact> mLContacts, List<MLContactFieldEditSetting> ContactPropertyList, string FileType)
        {
            System.Data.DataSet dataSet = new System.Data.DataSet("General");
            System.Data.DataTable MainDataTable = new System.Data.DataTable();

            if (mLContacts != null && mLContacts.Count > 0)
            {
                System.Data.DataTable dtListOfResponsesData = new System.Data.DataTable();
                dtListOfResponsesData = Helper.ToDataTables(mLContacts);

                if (dtListOfResponsesData != null && dtListOfResponsesData.Rows.Count > 0)
                {
                    foreach (var ContactFieldProperty in ContactPropertyList)
                    {
                        MainDataTable.Columns.Add(ContactFieldProperty.DisplayName);
                    }

                    MainDataTable.Columns.Add("Created Date");
                    MainDataTable.Columns.Add("Updated Date");

                    string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(AdsId, this.sqlVendor);
                    for (int i = 0; i < dtListOfResponsesData.Rows.Count; i++)
                    {
                        DataRow dr = MainDataTable.NewRow();

                        foreach (var ContactFieldProperty in ContactPropertyList)
                        {
                            if (ContactFieldProperty.PropertyName != "UserInfoUserId" && ContactFieldProperty.PropertyName != "Score")
                                dr[ContactFieldProperty.DisplayName] = dtListOfResponsesData.Rows[i][ContactFieldProperty.PropertyName].ToString();
                        }

                        if (MainDataTable.Columns.Contains("Handled By") && !String.IsNullOrEmpty(Convert.ToString(dtListOfResponsesData.Rows[i]["UserInfoUserId"])))
                        {
                            List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
                            using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(this.sqlVendor))
                            {

                                userHierarchy = await objUserHierarchy.GetHisUsers(UserId, AdsId);
                                userHierarchy.Add(await objUserHierarchy.GetHisDetails(UserId));
                            }
                            userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();

                            if (userHierarchy != null && userHierarchy.Count > 0)
                            {
                                var userList = (from p in userHierarchy
                                                where p.UserInfoUserId == Convert.ToInt32(dtListOfResponsesData.Rows[i]["UserInfoUserId"])
                                                select p.FirstName).ToList();
                                if (userList != null && userList.Count > 0)
                                    dr["Handled By"] = userList[0];
                            }
                        }


                        if (MainDataTable.Columns.Contains("Stage") && !String.IsNullOrEmpty(Convert.ToString(dtListOfResponsesData.Rows[i]["Score"])))
                        {
                            int ScoreValue = 0;
                            List<LmsStage> lmsStageList = new List<LmsStage>();
                            using (var objStage = DLLmsStage.GetDLLmsStage(AdsId, this.sqlVendor))
                            {
                                lmsStageList = await objStage.GetAllList();
                            }

                            ScoreValue = Convert.ToInt32(Convert.ToString(dtListOfResponsesData.Rows[i]["Score"]));

                            if (ScoreValue > -1 && lmsStageList != null && lmsStageList.Count > 0)
                            {
                                var stageList = (from p in lmsStageList
                                                 where p.Score == ScoreValue
                                                 select p.Stage).ToList();
                                if (stageList != null && stageList.Count > 0)
                                    dr["Stage"] = stageList[0];
                            }
                        }
                        dr["Created Date"] = dtListOfResponsesData.Rows[i]["CreatedDate"].ToString() == "" ? "" : Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(dtListOfResponsesData.Rows[i]["CreatedDate"].ToString())).ToString();
                        dr["Updated Date"] = dtListOfResponsesData.Rows[i]["UpdatedDate"].ToString() == "" ? "" : Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(dtListOfResponsesData.Rows[i]["UpdatedDate"].ToString())).ToString();
                        MainDataTable.Rows.Add(dr);
                    }
                    dataSet.Tables.Add(MainDataTable);
                }
            }
            else
            {
                dataSet.Tables.Add(MainDataTable);
            }

            string FileName = "ContactsExport_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + FileType;

            string Path = AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString() + "\\TempFiles\\" + FileName;

            if (FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, Path);
            else
                Helper.SaveDataSetToExcel(dataSet, Path);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"].ToString() + "TempFiles/" + FileName;
        }
    }
}
