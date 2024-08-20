 
using P5GenralDL;
using P5GenralML; 
using System.Data; 
using Plumb5GenralFunction;
using System.Reflection;
using System.Net;
namespace Plumb5.Areas.CaptureForm.Models
{
    public class ExportToExcelCustomised
    {
        int AdsId;
        private readonly string SQLProvider;
        public ExportToExcelCustomised(int adsid, string sqlProvider)
        {
            AdsId = adsid;
            SQLProvider = sqlProvider;
        } 
        
        public string MainPath { get; set; }

        public async void ExportCustomised(List<MLFormResponseWithFormDetails> listOfResponsesData, string FileType)
        {
            System.Data.DataSet dataSet = new System.Data.DataSet("General");

            List<FormFields> formDetailsList = new List<FormFields>();
            List<FormFields> UniqueFormFields = new List<FormFields>();
            System.Data.DataTable MainDataTable = new System.Data.DataTable();
            List<string> DistinctFieldNames = null;
            List<FormDetails> formsList = null;

            if (listOfResponsesData != null && listOfResponsesData.Count > 0)
            {
                List<int> FormIds = (from p in listOfResponsesData
                                     where p.FormType != 9 && p.FormType != 18 && p.FormType != 16
                                     select p.FormId).Distinct().ToList();

                FormDetails formDetail = new FormDetails();
                List<string> fields = new List<string>() { "Id", "Heading", "FormType", "FormIdentifier", "EmbeddedFormOrPopUpFormOrTaggedForm" };
                using (var objDLform = DLFormDetails.GetDLFormDetails( AdsId, SQLProvider))
                {
                    formsList = (await objDLform.GET(formDetail, -1, -1, null, fields, false, null, null)).ToList();
                }
                    

                if (FormIds != null && FormIds.Count > 0 && formsList != null && formsList.Count > 0)
                {
                    using (var objDL = DLFormFields.GetDLFormFields(AdsId, SQLProvider))
                    {
                        for (int i = 0; i < FormIds.Count; i++)
                        {
                            List<FormFields> formFields = (await objDL.GET(FormIds[i])).ToList();
                            formFields = Helper.GetListDecodeProperties(formFields);
                            formDetailsList.AddRange(formFields);
                        }
                    }
                }

                if (formDetailsList != null && formDetailsList.Count > 0)
                {
                    formDetailsList = formDetailsList.OrderBy(x => x.FieldPriority).ToList();
                    DistinctFieldNames = formDetailsList.Select(x => x.Name).Distinct().ToList();
                }


                MainDataTable.Columns.Add("FormIdentifier");
                MainDataTable.Columns.Add("FormHeading");
                MainDataTable.Columns.Add("FormDescription");
                MainDataTable.Columns.Add("CityName");
                MainDataTable.Columns.Add("ReferrerPage");
                MainDataTable.Columns.Add("SearchKeyword");
                MainDataTable.Columns.Add("DateTime");
                MainDataTable.Columns.Add("PageUrl");
                MainDataTable.Columns.Add("Country");
                MainDataTable.Columns.Add("IPAddress");
                MainDataTable.Columns.Add("FormType");
                MainDataTable.Columns.Add("UTMTagSource");
                MainDataTable.Columns.Add("UtmMedium");
                MainDataTable.Columns.Add("UtmCampaign");
                MainDataTable.Columns.Add("UtmTerm");
                MainDataTable.Columns.Add("VisitorType");

                if (listOfResponsesData.Any(x => x.FormType == 9 || x.FormType == 18 || x.FormType == 16))
                    MainDataTable.Columns.Add("Rated");

                if (DistinctFieldNames != null && DistinctFieldNames.Count > 0)
                {
                    for (int i = 0; i < DistinctFieldNames.Count; i++)
                    {
                        if (!MainDataTable.Columns.Contains(DistinctFieldNames[i]))
                            MainDataTable.Columns.Add(DistinctFieldNames[i]);
                    }
                }

                DataTable dtListOfResponsesData = Helper.ToDataTables(listOfResponsesData);

                for (int i = 0; i < dtListOfResponsesData.Rows.Count; i++)
                {
                    DataRow dr = MainDataTable.NewRow();

                    try
                    {
                        dr["FormIdentifier"] = formsList.Where(x => x.Id == listOfResponsesData[i].FormId).FirstOrDefault().FormIdentifier.ToString();
                    }
                    catch (Exception ex)
                    {
                        dr["FormIdentifier"] = "";
                    }

                    dr["FormHeading"] = dtListOfResponsesData.Rows[i]["Heading"].ToString();
                    dr["FormDescription"] = dtListOfResponsesData.Rows[i]["SubHeading"].ToString();
                    dr["CityName"] = dtListOfResponsesData.Rows[i]["City"].ToString();
                    dr["Country"] = dtListOfResponsesData.Rows[i]["Country"].ToString();
                    dr["ReferrerPage"] = dtListOfResponsesData.Rows[i]["Referrer"].ToString();
                    dr["SearchKeyword"] = dtListOfResponsesData.Rows[i]["SearchKeyword"].ToString();
                    dr["DateTime"] = dtListOfResponsesData.Rows[i]["TrackDate"].ToString();
                    dr["PageUrl"] = dtListOfResponsesData.Rows[i]["PageUrl"].ToString();
                    dr["IPAddress"] = dtListOfResponsesData.Rows[i]["TrackIp"].ToString();
                    dr["UTMTagSource"] = dtListOfResponsesData.Rows[i]["UtmTagSource"].ToString();
                    dr["UtmMedium"] = dtListOfResponsesData.Rows[i]["UtmMedium"].ToString();
                    dr["UtmCampaign"] = dtListOfResponsesData.Rows[i]["UtmCampaign"].ToString();
                    dr["UtmTerm"] = dtListOfResponsesData.Rows[i]["UtmTerm"].ToString();

                    if (listOfResponsesData[i].VisitorType > 0)
                        dr["VisitorType"] = listOfResponsesData[i].VisitorType > 1 ? "Repeat" : "New";
                    else
                        dr["VisitorType"] = "NA";

                    dr["FormType"] = listOfResponsesData[i].FormType == 9 ? "Polls" : listOfResponsesData[i].FormType == 12 ? "Lead Generation" : listOfResponsesData[i].FormType == 16 ? "Ratings" : listOfResponsesData[i].FormType == 18 ? "Questions" : "Click To Call";

                    if (listOfResponsesData[i].FormType == 9 || listOfResponsesData[i].FormType == 18 || listOfResponsesData[i].FormType == 16)
                    {
                        dr["Rated"] = dtListOfResponsesData.Rows[i]["Field1"].ToString();
                    }
                    else
                    {
                        UniqueFormFields = (from p in formDetailsList
                                            where p.FormId == listOfResponsesData[i].FormId
                                            select p).ToList();

                        if (UniqueFormFields != null && UniqueFormFields.Count > 0)
                        {
                            for (int j = 0; j < UniqueFormFields.Count; j++)
                            {
                                dr[UniqueFormFields[j].Name] = dtListOfResponsesData.Rows[i]["Field" + (j + 1)].ToString();
                            }
                        }
                    }
                    MainDataTable.Rows.Add(dr);
                }
                dataSet.Tables.Add(MainDataTable);
            }
            else
            {
                MainDataTable = Helper.ToDataTables(listOfResponsesData);
                dataSet.Tables.Add(MainDataTable);
            }

            string FileName = "FormResponse_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + FileType;
            MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);
            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
        }
      
    }
}