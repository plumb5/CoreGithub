using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic.FileIO;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.ManageContact.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Data;
using System.Data.OleDb;
using System.Globalization;
using System.IO.Compression;

namespace Plumb5.Areas.ManageContact.Controllers
{
    [Area("ManageContact")]
    public class ContactDeduplicateOverviewController : BaseController
    {
        public ContactDeduplicateOverviewController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /ManageContact/ContactDeduplicateOverview/

        public ActionResult Index()
        {
            return View("ContactDeDuplicateOverview");
        }

        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] ContactDeduplicateOverview_GetMaxCount commonDetails)
        {
            DateTime FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var objDL = DLContactDeduplicateOverview.GetDLContactDeduplicateOverview(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDL.GetMaxCount(FromDateTime, ToDateTime));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetDetails([FromBody] ContactDeduplicateOverview_GetDetails commonDetails)
        {
            DateTime FromDateTime = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            List<ContactDeDuplicateOverView> contactdeduplicatedetails = null;
            using (var objDL = DLContactDeduplicateOverview.GetDLContactDeduplicateOverview(commonDetails.accountId, SQLProvider))
            {
                contactdeduplicatedetails = (await objDL.GetDetails(commonDetails.OffSet, commonDetails.FetchNext, FromDateTime, ToDateTime)).ToList();
            }
            return Json(contactdeduplicatedetails);
        }

        [HttpPost]
        public async Task<JsonResult> ManageDuplicateExport([FromBody] ContactDeduplicateOverview_ManageDuplicateExport commonDetails)
        {
            DataSet dataSet = new DataSet();

            DateTime fromDateTime = DateTime.ParseExact(commonDetails.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime toDateTime = DateTime.ParseExact(commonDetails.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            List<ContactDeDuplicateOverView> contactdeduplicatedetails = null;
            using (var objDL = DLContactDeduplicateOverview.GetDLContactDeduplicateOverview(commonDetails.accountId, SQLProvider))
            {
                contactdeduplicatedetails = (await objDL.GetDetails(commonDetails.OffSet, commonDetails.FetchNext, fromDateTime, toDateTime)).ToList();
            }
            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(commonDetails.accountId, SQLProvider);
            var NewListData = contactdeduplicatedetails.Select(x => new
            {
                x.ImportedFileName,
                x.TotalCounts,
                x.UniqueCounts,
                x.ExistingCounts,
                x.DuplicateCounts,
                CreatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.CreatedDate.ToString())).ToString(),
                UpdatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.UpdatedDate.ToString())).ToString(),
                Status = x.IsCompleted == 0 ? "Queued" : x.IsCompleted == 1 ? "Completed" : x.IsCompleted == 2 ? "In-Progress" : x.ErrorMessage
            });
            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTableExport();
            dataSet.Tables.Add(dtt);

            string FileName = "ManageDuplicates_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }

        [HttpPost]
        public JsonResult SampleDeDuplicateContactFileForImport([FromBody] ContactDeduplicateOverview_SampleDeDuplicateContactFileForImport commonDetails)
        {
            DataSet contactSampleDataSet = new DataSet();
            DataTable contactSampleDataTable = new DataTable();

            contactSampleDataTable.Columns.Add("EmailId");
            contactSampleDataTable.Columns.Add("PhoneNumber");
            contactSampleDataSet.Tables.Add(contactSampleDataTable);

            string FileNameFormat = "P5ManageDuplicateSampleFile_" + commonDetails.AccountId.ToString() + "_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff");
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileNameFormat;

            if (!(Directory.Exists(MainPath)))
            {
                Directory.CreateDirectory(MainPath);
            }

            //Create CSV File
            Helper.SaveDataSetToCSV(contactSampleDataSet, MainPath + "\\" + FileNameFormat + ".csv", ",");
            //Create XLS File
            Helper.SaveDataSetToExcel(contactSampleDataSet, MainPath + "\\" + FileNameFormat + ".xls");
            //Create XLSX File
            Helper.SaveDataSetToExcel_XLSX(contactSampleDataSet, MainPath + "\\" + FileNameFormat + ".xlsx");
            //Put ReadMe file in folder
            System.IO.File.Copy(AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\Template\\ContactSample_ReadMe.txt", MainPath + "\\ReadMe.txt");
            //Create ZIP File
            ZipFile.CreateFromDirectory(MainPath, MainPath + ".zip");
            //Delete the folder
            Directory.Delete(MainPath, true);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileNameFormat + ".zip";
            return Json(new { Status = true, MainPath });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> DownLoadFileContent([FromBody] ContactDeduplicateOverview_DownLoadFileContent commonDetails)
        {
            ContactDeDuplicateOverView? contactDeDuplicateOverView = new ContactDeDuplicateOverView();
            using (var objDL = DLContactDeduplicateOverview.GetDLContactDeduplicateOverview(commonDetails.AccountId, SQLProvider))
            {
                contactDeDuplicateOverView = await objDL.GetFileContentToDownload(commonDetails.Id, commonDetails.ContactFileType);
            }
            string FileName = commonDetails.ContactFileType + "_" + Convert.ToString(commonDetails.AccountId) + "_" + Convert.ToString(commonDetails.Id) + "_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + ".csv";
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;


            byte[] fileBytes = new byte[] { };

            if (commonDetails.ContactFileType == "NewContacts")
                fileBytes = contactDeDuplicateOverView.UniqueFileContent;
            else if (commonDetails.ContactFileType == "ExistingContacts")
                fileBytes = contactDeDuplicateOverView.ExistingFileContent;
            else if (commonDetails.ContactFileType == "DuplicateContacts")
                fileBytes = contactDeDuplicateOverView.DuplicateFileContent;

            using (Stream file = System.IO.File.OpenWrite(MainPath))
                file.Write(fileBytes, 0, fileBytes.Length);

            DataSet dsExcelFields = Helper.ExcelOrCsvConnReadDs(MainPath);

            string FileNames = "DuplicateFields_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPaths = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileNames;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dsExcelFields, MainPaths);
            else
                Helper.SaveDataSetToExcel(dsExcelFields, MainPaths);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileNames;

            return Json(new { Status = true, MainPath });
        }

        [HttpPost]
        public async Task<IActionResult> SaveImportedFileContent([FromForm] ContactDeduplicateOverview_SaveImportedFileContent commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            int result = 0;
            var httpPostedFile = HttpContext.Request.Form.Files;
            if (httpPostedFile != null && httpPostedFile.Count > 0)
            {
                BinaryReader b = new BinaryReader(httpPostedFile[0].OpenReadStream());
                byte[] ImportedFileBinaryData = b.ReadBytes((int)httpPostedFile[0].Length);
                string ImportedFileName = httpPostedFile[0].FileName;
                using (var objDL = DLContactDeduplicateOverview.GetDLContactDeduplicateOverview(account.AdsId, SQLProvider))
                {
                    result = await objDL.Save(user.UserId, ImportedFileName, ImportedFileBinaryData);
                }
            }
            return Json(result);
        }

        [HttpPost]
        public async Task<JsonResult> GetContactDeDuplicateImportOverViewDetails([FromBody] ContactDeduplicateOverview_GetContactDeDuplicateImportOverViewDetails commonDetails)
        {
            using (var objDL = DLContactDeduplicateOverview.GetDLContactDeduplicateOverview(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDL.Get(new ContactDeDuplicateOverView() { Id = commonDetails.Id }));
            }
        }

        [HttpPost]
        public async Task<JsonResult> CheckForColumns()
        {
            bool result = false;
            var httpPostedFile = HttpContext.Request.Form.Files;
            if (httpPostedFile != null && httpPostedFile.Count > 0)
            {
                string fileName = DateTime.Now.ToString("ddMMyyyyHHmmssfff") + Path.GetExtension(httpPostedFile[0].FileName);
                string fullPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + fileName;

                using (var fileStream = new FileStream(fullPath, FileMode.Create))
                {
                    await httpPostedFile[0].CopyToAsync(fileStream);
                }

                DataSet dsExcelFields = ExcelOrCsvConnReadDsAllRows(fullPath);

                if (dsExcelFields != null && dsExcelFields.Tables.Count > 0 && dsExcelFields.Tables[0].Columns.Count > 0)
                {
                    if (dsExcelFields.Tables[0].Columns.Contains("emailid") && dsExcelFields.Tables[0].Columns.Contains("phonenumber"))
                        result = true;
                    DataTable dt = new DataTable();
                    dt = dsExcelFields.Tables[0];
                    //Checking PhoneNumber Column contains only numeric data
                    //int i;
                    //bool allInts = dt.AsEnumerable().All(r => int.TryParse(r.Field<string>("PhoneNumber"), out i));
                    // hasDigits = dt.Rows.OfType<DataRow>().Where(r => r.Field<string>("PhoneNumber") != null).Any(r => Regex.IsMatch(r.Field<string>("PhoneNumber"), "[0-9]"));

                }
                //Check  if file exists delete 
                if (System.IO.File.Exists(fullPath))
                    System.IO.File.Delete(fullPath);
            }
            return Json(result);
        }

        public static DataSet ExcelOrCsvConnReadDsAllRows(string fileFullPath)  //Here File Full path is passed and dataset is returned//
        {
            try
            {
                string extension = Path.GetExtension(fileFullPath).ToLower();
                string delimiter = ",";
                if (extension == ".csv")
                {

                    delimiter = findFileDelimiterNew(fileFullPath);
                }

                if (delimiter == null)
                    delimiter = ",";

                if (extension == ".csv" && delimiter != ",")
                {
                    return GetDataSetFromCSVUsingParserNew(fileFullPath, delimiter);
                }
                else
                {
                    OleDbCommand cmd = GetImportCommandNew(fileFullPath);
                    try
                    {
                        DataSet ds = new DataSet();
                        DataSet dsClone = new DataSet();
                        using (OleDbDataAdapter oleda = new OleDbDataAdapter())
                        {
                            if (cmd.Connection.State == ConnectionState.Closed)
                                cmd.Connection.Open();
                            oleda.SelectCommand = cmd;
                            oleda.Fill(ds);

                            if (ds != null && ds.Tables.Count > 0)
                            {
                                for (int i = 0; i < ds.Tables[0].Columns.Count; i++)
                                {
                                    if (!String.IsNullOrEmpty(ds.Tables[0].Columns[i].ColumnName))
                                        ds.Tables[0].Columns[i].ColumnName = ds.Tables[0].Columns[i].ColumnName.Trim();
                                }

                                //To make all column as a type of string
                                dsClone = ds.Clone(); //just copy structure, no data
                                for (int i = 0; i < dsClone.Tables[0].Columns.Count; i++)
                                {
                                    if (dsClone.Tables[0].Columns[i].DataType != typeof(string))
                                        dsClone.Tables[0].Columns[i].DataType = typeof(string);
                                }

                                //Copy All data row by row
                                foreach (DataRow dr in ds.Tables[0].Rows)
                                {
                                    bool result = false;
                                    if (!String.IsNullOrEmpty(dr.ItemArray[0].ToString()))
                                    {
                                        result = true;
                                    }
                                    if (!String.IsNullOrEmpty(dr.ItemArray[1].ToString()))
                                    {
                                        result = true;
                                    }
                                    else
                                    {
                                        result = false;
                                    }
                                    //foreach (var rowdata in dr.ItemArray)
                                    //{
                                    //    if (!String.IsNullOrEmpty(rowdata.ToString()))
                                    //    {
                                    //        result = true;
                                    //        break;
                                    //    }

                                    //}

                                    if (result)
                                        dsClone.Tables[0].ImportRow(dr);
                                }
                            }
                        }
                        return dsClone;
                    }
                    catch
                    {
                        return null;
                    }
                    finally
                    {
                        cmd.Connection.Close();
                    }
                }
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public static string findFileDelimiterNew(string strFilename)
        {
            // define delimiters of interest
            string[] delimiters = new string[] { ",", "|", ";" };

            // test file against delimiters
            for (int delcnt = 0; delcnt < delimiters.Length; delcnt++)
            {
                using (TextFieldParser parser = new TextFieldParser(strFilename))
                {
                    parser.TextFieldType = FieldType.Delimited;
                    parser.SetDelimiters(delimiters[delcnt]);

                    if (!parser.EndOfData)
                    {
                        string[] fields = parser.ReadFields();
                        // if we get more than one field, we have found the correct delimiter
                        if (fields.Length > 1)
                            return delimiters[delcnt];
                    }
                }
            } // end_of_for (int delcnt = 0; delcnt < delimiters.Length; delcnt++)
            return delimiters[0];
        }

        private static DataSet GetDataSetFromCSVUsingParserNew(string fileFullPath, string delimiter)
        {
            try
            {
                using (var myCsvFile = new TextFieldParser(fileFullPath))
                {
                    myCsvFile.TextFieldType = FieldType.Delimited;
                    myCsvFile.SetDelimiters(delimiter);

                    //convert to dataset:
                    DataSet ds = new DataSet("Plumb5");
                    ds.Tables.Add("DataList");

                    String[] stringRow = myCsvFile.ReadFields();
                    foreach (String field in stringRow)
                    {
                        ds.Tables[0].Columns.Add(field, Type.GetType("System.String"));
                    }
                    //populate with data:
                    while (!myCsvFile.EndOfData)
                    {
                        stringRow = myCsvFile.ReadFields();

                        bool result = false;
                        foreach (var rowdata in stringRow)
                        {
                            if (!String.IsNullOrEmpty(rowdata.ToString()))
                            {
                                result = true;
                                break;
                            }
                        }

                        if (result)
                            ds.Tables[0].Rows.Add(stringRow);
                    }
                    return ds;
                }
            }
            catch
            {
                return null;
            }
        }

        private static OleDbCommand GetImportCommandNew(string fileFullPath)
        {
            string connString = ExcelorCSVConnectionNew(fileFullPath);

            OleDbConnection oledbConn = new OleDbConnection(connString);

            oledbConn.Open();

            string extension = Path.GetExtension(fileFullPath).ToLower();
            if (extension == ".csv")
            {
                using (DataTable Sheets = oledbConn.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null))
                {
                    OleDbCommand cmd = new OleDbCommand("SELECT * FROM [" + Path.GetFileName(fileFullPath) + "]", oledbConn);

                    return cmd;
                }
            }
            else if (extension == ".xls" || extension == ".xlsx")
            {
                using (DataTable Sheets = oledbConn.GetOleDbSchemaTable(OleDbSchemaGuid.Tables, null))
                {
                    foreach (DataRow dr in Sheets.Rows)
                    {
                        string sht = dr[2].ToString().Replace("'", "");
                        OleDbCommand cmd = new OleDbCommand("SELECT * FROM [" + sht + "]", oledbConn);
                        return cmd;
                    }
                }
            }
            return null;
        }

        private static string ExcelorCSVConnectionNew(string fileFullPath)
        {
            string connString = "";

            string extension = Path.GetExtension(fileFullPath).ToLower();
            if (extension == ".csv")
            {
                connString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + Path.GetDirectoryName(fileFullPath) + ";Extended Properties =\"Text;HDR=YES;FMT=Delimited\"";
            }
            else if (extension == ".xls")
            {
                connString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + fileFullPath + ";Extended Properties=Excel 12.0;";
            }
            else if (extension == ".xlsx")
            {
                connString = "Provider=Microsoft.ACE.OLEDB.12.0;Data Source=" + fileFullPath + ";Extended Properties=Excel 12.0;";
            }
            return connString;
        }
    }
}
