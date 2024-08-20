using P5GenralDL;
using P5GenralML;
using Plumb5GenralFunction;
using System.Data;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Sheets.v4; 
using System;
using System.Collections.Generic; 
using System.Linq;
using System.Web;

namespace Plumb5.Areas.ManageContact.Models
{
    public class GenerateSpreadSheetFile
    {
        int AdsId;
        private readonly string SQLProvider;
         
        public GenerateSpreadSheetFile(int adsid, string sqlprovider)
        {
            AdsId = adsid;
            SQLProvider = sqlprovider;
        }
        public async void GenerateSpreadSheets(List<String> Plumb5contactColumns, string SpreedsheetID, string Range, ContactImportOverview contactImportOverview, int UserId)
        {
            ContactImportFileFieldMapping contactImportFileFieldMapping = new ContactImportFileFieldMapping();
            Google.Apis.Sheets.v4.Data.ValueRange response = null;
            SheetsService sheetsService = null;
            try
            {
                string[] Scopes = { SheetsService.Scope.SpreadsheetsReadonly };
                string ApplicationName = "P5 lead imports";

                IConfiguration Configuration = new ConfigurationBuilder()
                      .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true).Build();
                string AuthGoogleJSON = Configuration.GetSection("JSON").Value; 
                using (var AuthGoogleJSONStream = new System.IO.FileStream(AuthGoogleJSON, System.IO.FileMode.Open, System.IO.FileAccess.Read))
                {
                    // Do your file operations here
                    //string datea = ConvertStreamToString(AuthGoogleJSONStream);
                    var credential1 = GoogleCredential.FromStream(AuthGoogleJSONStream).CreateScoped(Scopes);
                    sheetsService = new SheetsService(new Google.Apis.Services.BaseClientService.Initializer()
                    {
                        HttpClientInitializer = credential1,
                        ApplicationName = ApplicationName,
                    });
                    try
                    {
                        if (!String.IsNullOrEmpty(SpreedsheetID) && !String.IsNullOrEmpty(Range))
                        {
                            SpreadsheetsResource.ValuesResource.GetRequest request = sheetsService.Spreadsheets.Values.Get(SpreedsheetID, Range);
                            response = request.Execute();
                        }
                    }
                    catch (Exception ex)
                    {
                        using (ErrorUpdation objError = new ErrorUpdation("SheetsService"))
                            objError.AddError(ex.Message.ToString(), "Google credential error", DateTime.Now.ToString(), "GetGoogleService==>exception", ex.ToString());
                    }
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("SheetsService"))
                    objError.AddError(ex.Message.ToString(), "Google credential error", DateTime.Now.ToString(), "GetGoogleService==>exception", ex.ToString());
            }

            System.Data.DataTable MainDataTable = new System.Data.DataTable();
            if (Plumb5contactColumns != null && Plumb5contactColumns.Count > 0)
            {
                for (int i = 0; i < Plumb5contactColumns.Count; i++)
                {
                    MainDataTable.Columns.Add(Plumb5contactColumns[i].Split(',')[1]);

                }
            }
            if (response.Values != null && response.Values.Count > 0 && Plumb5contactColumns != null && Plumb5contactColumns.Count > 0)
            {


                for (int j = 1; j < response.Values.Count; j++)
                {
                    DataRow dr = MainDataTable.NewRow();
                    for (int k = 0; k < MainDataTable.Columns.Count; k++)
                    {

                        dr[Plumb5contactColumns[k].Split(',')[1]] = response.Values[j][Convert.ToInt32(Plumb5contactColumns[k].Split(',')[0])];
                    }

                    MainDataTable.Rows.Add(dr);
                }


            }
            System.Data.DataSet dataSet = new System.Data.DataSet("General");
            string _FileName = "SpreadSheetImport_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff");
            string FileName = "SpreadSheetImport_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + ".csv";
            string _MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\SpreadSheetImport\\";
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\SpreadSheetImport\\" + FileName;
            dataSet.Tables.Add(MainDataTable);
            Helper.SaveDataSetToCSV(dataSet, _MainPath + "\\" + _FileName + ".csv", ",");

            int Id = 0;
            using (var objDL = DLContactImportOverview.GetDLContactImportOverview(AdsId, SQLProvider))
            {
                contactImportOverview.ContactFileName = MainPath;
                contactImportOverview.ImportedFileName = FileName;
                contactImportOverview.ImportSource = "SpreadSheet";
                contactImportOverview.UserInfoUserId = UserId;


                Id = await objDL.Save(contactImportOverview);

            }
            if (Id > 0)
            {
                if (Plumb5contactColumns != null && Plumb5contactColumns.Count > 0)
                {
                    for (int i = 0; i < Plumb5contactColumns.Count; i++)
                    {
                        contactImportFileFieldMapping.FileFieldIndex = Convert.ToInt32(Plumb5contactColumns[i].Split(',')[0]);
                        contactImportFileFieldMapping.P5ColumnName = Plumb5contactColumns[i].Split(',')[1];
                        contactImportFileFieldMapping.FrontEndName = Plumb5contactColumns[i].Split(',')[2];
                        contactImportFileFieldMapping.FileFieldName = Plumb5contactColumns[i].Split(',')[3];
                        contactImportFileFieldMapping.ImportOverViewId = Id;

                        using (var objDL = DLContactImportFileFieldMapping.GetDLContactImportFileFieldMapping(AdsId, SQLProvider))
                        {
                            await objDL.Save(contactImportFileFieldMapping);
                        }
                    }
                }
            }
        }

    }
}