using P5GenralDL;
using P5GenralML;
using System.Data;
using Plumb5GenralFunction;
using System.Reflection;
using System.Net;
using Microsoft.Identity.Client;
using System.Globalization;

namespace Plumb5.Areas.CustomEvents.Models
{
    public class ExportViewEventsData
    {
        int AdsId;
        private readonly string SQLProvider;
        public ExportViewEventsData(int adsid, string sqlProvider)
        {
            AdsId = adsid;
            SQLProvider = sqlProvider;
        }
        public string MainPath { get; set; }

        public async Task  ExportCustomised(int eventimportoverviewid, DateTime FromDateTime, DateTime ToDateTime, int contactid, int offset, int fetchnext, string FileType, Contact contact, string MachineID, Customevents customevents, string moduletype, string Channel = "", int CampaignId = 0, string EventName = "", Int16 CampignType = 0)
        {
            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(AdsId, SQLProvider);

            System.Data.DataSet dataSet = new System.Data.DataSet("General");

            List<CustomEventExtraField> EventExtraFieldList = new List<CustomEventExtraField>();
            List<CustomEventExtraField> UniqueFormFields = new List<CustomEventExtraField>();
            List<CustomEventExtraField> CustomExtraFieldDetails = new List<CustomEventExtraField>();
            System.Data.DataTable MainDataTable = new System.Data.DataTable();
            List<Customevents> CustomEventsCartDetails = null;
            List<string> DistinctFieldNames = null;
            string FileName = "CustomEventViewDetails_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + FileType;

            if (!String.IsNullOrEmpty(Channel))
            {
                using (var objDL = DLCustomEventRevenueChannels.GetDLCustomEventRevenueChannels(AdsId, SQLProvider)) 
                {
                    CustomEventsCartDetails = (await objDL.GetIndividualRevenueData(Channel, CampaignId, EventName, FromDateTime, ToDateTime, offset, fetchnext, CampignType)).ToList();
                    FileName = "RevenueEventViewDetails_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + FileType;
                }
            }
            else
            {
                using (var objDLs = DLCustomEvents.GetDLCustomEvents(AdsId, SQLProvider)) 
                {
                    if (moduletype == "CustomEvents")

                        CustomEventsCartDetails = (await objDLs.GetEventsReportData(FromDateTime, ToDateTime, eventimportoverviewid, contactid, offset, fetchnext, contact, MachineID, customevents)).ToList();

                    else if (moduletype == "Revenue")
                    {
                        CustomEventsCartDetails = (await objDLs.GetRevenueEventsReportData(FromDateTime, ToDateTime, eventimportoverviewid, offset, fetchnext)).ToList();
                        FileName = "RevenueEventViewDetails_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + FileType;
                    }

                }
            }

             
            if (CustomEventsCartDetails.Count > 0)
            {
                using (var objDal = DLCustomEventExtraField.GetDLCustomEventExtraField(AdsId, SQLProvider)) 
                {
                    CustomExtraFieldDetails = (await objDal.GetCustomEventExtraField(CustomEventsCartDetails[0].CustomEventOverViewId, FromDateTime, ToDateTime, contactid)).ToList();


                    CustomExtraFieldDetails = Helper.GetListDecodeProperties(CustomExtraFieldDetails);
                    EventExtraFieldList.AddRange(CustomExtraFieldDetails.Select(x => x).OrderBy(x => x.DisplayOrder).ToList());

                }
            }
            if (EventExtraFieldList != null && EventExtraFieldList.Count > 0)
            {
                DistinctFieldNames = EventExtraFieldList.Select(x => x.FieldName).Distinct().ToList();
            }

            MainDataTable.Columns.Add("EventName");
            DataTable dtListOfResponsesData = Helper.ToDataTables(CustomEventsCartDetails);
            if (DistinctFieldNames != null && DistinctFieldNames.Count > 0)
            {
                for (int i = 0; i < DistinctFieldNames.Count; i++)
                {

                    MainDataTable.Columns.Add(DistinctFieldNames[i]);
                }
            }
            for (int i = 0; i < dtListOfResponsesData.Rows.Count; i++)
            {
                DataRow dr = MainDataTable.NewRow();

                dr["EventName"] = dtListOfResponsesData.Rows[i]["EventName"].ToString();
                UniqueFormFields = (from p in EventExtraFieldList
                                    where p.CustomEventOverViewId == CustomEventsCartDetails[i].CustomEventOverViewId
                                    select p).ToList();

                if (UniqueFormFields != null && UniqueFormFields.Count > 0)
                {

                    for (int j = 0; j < UniqueFormFields.Count; j++)
                    {
                        int index = CustomExtraFieldDetails.FindIndex(c => c.FieldName == (UniqueFormFields[j].FieldName).ToString());

                        //int sindexs = CustomExtraFieldDetails.FindIndex(c => c.FieldName =="price");
                        dr[UniqueFormFields[j].FieldName] = dtListOfResponsesData.Rows[i]["EventData" + (CustomExtraFieldDetails.FindIndex(c => c.FieldName == (UniqueFormFields[j].FieldName).ToString()) + 1)].ToString();
                    }
                }
                MainDataTable.Rows.Add(dr);
            }
            dataSet.Tables.Add(MainDataTable);
            MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);
              MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

        }
        public async Task  Exportaggregatedata(string FromDateTime, string TodateTime, int customEventOverViewId, string groupbyeventfields, string displayextrafields, string DisplayFieldsforexport, string FileType, int OffSet, int FetchNext)
        {
            DateTime FromDateTimes = DateTime.ParseExact(FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            System.Data.DataSet DataSet = new System.Data.DataSet("General");
            List<CustomEventExtraField> CustomExtraFieldDetails = new List<CustomEventExtraField>();
            List<CustomEventExtraField> EventExtraFieldList = new List<CustomEventExtraField>();
            List<string> DistinctFieldNames = null;
            using (var objDL =   DLCustomEvents.GetDLCustomEvents(AdsId,SQLProvider))
            {
                DataSet = await objDL.GetAggregateData(FromDateTime, TodateTime, customEventOverViewId, groupbyeventfields, displayextrafields, OffSet, FetchNext);
            }
            //Checking for display names and removeing other columns
            //DisplayFieldsforexport contains the values need to be remove
            if (DisplayFieldsforexport.Length > 0)
            {
                for (int i = 0; i < DisplayFieldsforexport.Split(',').Count(); i++)
                {
                    DataSet.Tables[0].Columns.Remove(DisplayFieldsforexport.Split(',')[i]);

                }

            }

            DataSet.Tables[0].Columns.Remove("CustomEventOverViewId");
            DataSet.Tables[0].AcceptChanges();
            using (var objDLs = DLCustomEventExtraField.GetDLCustomEventExtraField(AdsId,SQLProvider))
            {
                CustomExtraFieldDetails = (await objDLs.GetCustomEventExtraField(customEventOverViewId, FromDateTimes, ToDateTime, 0)).ToList();
                CustomExtraFieldDetails = Helper.GetListDecodeProperties(CustomExtraFieldDetails);
                EventExtraFieldList.AddRange(CustomExtraFieldDetails);

            }
            if (EventExtraFieldList != null && EventExtraFieldList.Count > 0)
            {
                DistinctFieldNames = EventExtraFieldList.Select(x => x.FieldName).Distinct().ToList();
            }
            DataTable dtListOfResponsesData = DataSet.Tables[0];
            string[] Columnnamestoreplace = dtListOfResponsesData.Columns.Cast<DataColumn>()
                                  .Select(x => x.ColumnName)
                                  .ToArray();

            for (int i = 0; i < CustomExtraFieldDetails.Count; i++)
            {
                for (int ccount = 0; ccount < Columnnamestoreplace.Count(); ccount++)
                {
                    //Replacing the header names
                    if (Columnnamestoreplace[ccount] == "eventdata" + i)
                    {
                        DataSet.Tables[0].Columns[Columnnamestoreplace[ccount]].ColumnName = DistinctFieldNames[i - 1];
                        break;
                    }
                }
            }
            string FileName = "CustomEventAggregateData_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + FileType;
            MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            //string MainPath = "E:/" + FileName;

            if (FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(DataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(DataSet, MainPath);

              MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
        }

    }
}