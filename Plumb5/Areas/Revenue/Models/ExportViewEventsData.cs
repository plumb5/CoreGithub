using P5GenralDL;
using P5GenralML;
using Plumb5GenralFunction;
using System.Data;
using System.Globalization;

namespace Plumb5.Areas.Revenue.Models
{
    public class ExportViewEventsData
    {
        int AdsId;
        string sqlprovider;
        public ExportViewEventsData(int adsid, string Sqlprovider = null)
        {
            AdsId = adsid;
            sqlprovider = Sqlprovider;
        }
        public string MainPath { get; set; }

        public async void ExportCustomised(int eventimportoverviewid, DateTime FromDateTime, DateTime ToDateTime, int contactid, int offset, int fetchnext, string FileType, Contact contact, string MachineID, Customevents customevents, string moduletype, string Channel = "", int CampaignId = 0, string EventName = "", Int16 CampignType = 0)
        {
            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(AdsId, sqlprovider);

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
                using (var objBL = DLCustomEventRevenueChannels.GetDLCustomEventRevenueChannels(AdsId, sqlprovider))
                {
                    CustomEventsCartDetails = (await objBL.GetIndividualRevenueData(Channel, CampaignId, EventName, FromDateTime, ToDateTime, offset, fetchnext, CampignType)).ToList();
                    FileName = "RevenueEventViewDetails_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + FileType;
                }
            }
            else
            {
                using (var objBL = DLCustomEvents.GetDLCustomEvents(AdsId, sqlprovider))
                {
                    if (moduletype == "CustomEvents")

                        CustomEventsCartDetails = (await objBL.GetEventsReportData(FromDateTime, ToDateTime, eventimportoverviewid, contactid, offset, fetchnext, contact, MachineID, customevents)).ToList();

                    else if (moduletype == "Revenue")
                    {
                        CustomEventsCartDetails = (await objBL.GetRevenueEventsReportData(FromDateTime, ToDateTime, eventimportoverviewid, offset, fetchnext)).ToList();
                        FileName = "RevenueEventViewDetails_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + FileType;
                    }

                }
            }



            //for (int i = 0; i < CustomEventsCartDetails.Count; i++)
            //{

            //    using (DLCustomEventExtraField objBL = new DLCustomEventExtraField(AdsId))
            //    {
            //        List<CustomEventExtraField> CustomExtraFieldDetails = objBL.GetCustomEventExtraField(CustomEventsCartDetails[i].CustomEventOverViewId, FromDateTime, ToDateTime, contactid);


            //        CustomExtraFieldDetails = Helper.GetListDecodeProperties(CustomExtraFieldDetails);
            //        EventExtraFieldList.AddRange(CustomExtraFieldDetails);

            //    }
            //}
            if (CustomEventsCartDetails.Count > 0)
            {

                using (var objBL = DLCustomEventExtraField.GetDLCustomEventExtraField(AdsId, sqlprovider))
                {
                    CustomExtraFieldDetails = await objBL.GetCustomEventExtraField(CustomEventsCartDetails[0].CustomEventOverViewId, FromDateTime, ToDateTime, contactid);


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
        

    }
}
