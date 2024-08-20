using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.CustomEvents.Dto;
using Plumb5.Areas.CustomEvents.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Data;
using System.Text.RegularExpressions;

namespace Plumb5.Areas.CustomEvents.Controllers
{
    [Area("CustomEvents")]
    public class EventImportController : BaseController
    {
        private readonly IWebHostEnvironment _env;

        public EventImportController(IConfiguration _configuration, IWebHostEnvironment env) : base(_configuration)
        {
            _env = env;
        }

        //
        // GET: /CustomEvents/EventImport/

        public IActionResult Index()
        {
            HttpContext.Session.SetString("EventImportOverview", "");
            return View("EventImport");
        }

        [Log]
        [HttpPost]
        public async Task<IActionResult> InitiateImport(IFormFile file, string ImportSource)
        {
            HttpContext.Session.SetString("EventImportOverview", "");

            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            List<string> alreadypresentfields = new List<string>();
            alreadypresentfields.Add("eventname");
            alreadypresentfields.Add("email-id");
            alreadypresentfields.Add("phonenumber");
            alreadypresentfields.Add("eventtime");

            List<string> newfields = new List<string>();
            CustomEventsOverView? customevntsoverview = new CustomEventsOverView();
            List<CustomEventExtraField> objlistcustomevents = new List<CustomEventExtraField>();

            string Message = "";
            bool Status = false;
            bool fresheventorrepeatevent = false;

            bool eventnameclmexists = false;
            bool emailorphone = false;
            bool eventtime = false;
            bool othercolumns = false;
            bool eventmismatchcondition = false;
            string eventname1 = "";
            string eventname2 = "";
            string eventname3 = "";

            try
            {
                var httpPostedFile = HttpContext.Request.Form.Files;

                if (httpPostedFile != null && httpPostedFile.Count > 0)
                {
                    string fileExtension = Path.GetExtension(httpPostedFile[0].FileName).ToLower();
                    List<string> fileExtensionList = new List<string>() { ".xls", ".xlsx", ".csv" };
                    if (fileExtensionList.Contains(fileExtension))
                    {
                        List<string> presentExtensionList = Helper.GetFileExtensionFromFileStream(httpPostedFile[0].OpenReadStream());
                        if (fileExtension == ".csv" || (presentExtensionList != null && fileExtensionList.Any(presentExtensionList.Contains)))
                        {
                            // Get the path to the wwwroot folder
                             
                            var webRootPath = _env.WebRootPath;
                            string fileName = "_P5Temp_CustomEventImport_" + domainDetails.AdsId + "_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + Path.GetExtension(httpPostedFile[0].FileName);
                            if (!(Directory.Exists(Path.Combine(webRootPath, "~/TempFiles/CustomEventImport/"))))
                            {
                                Directory.CreateDirectory(Path.Combine(webRootPath, "~/TempFiles/CustomEventImport/"));
                            }
                            string fileSavePath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString() + "/TempFiles/CustomEventImport/" + fileName;//Path.Combine(HttpContext.Server.MapPath("~/TempFiles/"), fileName);
                             

                            using var stream = new FileStream(fileSavePath, FileMode.Create, FileAccess.Write, FileShare.ReadWrite, bufferSize: 4096, useAsync: true);

                            await httpPostedFile[0].CopyToAsync(stream);

                            //httpPostedFile[0].SaveAs(fileSavePath);

                            DataSet dsImportedFile;

                            if (fileExtension == ".csv")
                                dsImportedFile = Helper.GetCSVDataSetWithSpecifiedRows(fileSavePath, 3);
                            else
                                dsImportedFile = Helper.ExcelOrCsvConnReadDs(fileSavePath);

                            if (dsImportedFile != null && dsImportedFile.Tables.Count > 0 && dsImportedFile.Tables[0].Columns.Count > 0 && dsImportedFile.Tables[0].Rows.Count > 0)
                            {
                                //Here we are checking whether the event name is same or different in the uploaded file
                                using var objBL = DLCustomEventsOverView.GetDLCustomEventsOverView(domainDetails.AdsId, SQLProvider);

                                if (dsImportedFile.Tables[0].Rows.Count == 1)
                                {
                                    eventname1 = dsImportedFile.Tables[0].Rows[0]["eventname"].ToString();

                                    customevntsoverview = await objBL.GetCustomEventByName(eventname1);

                                    if (customevntsoverview == null)
                                        fresheventorrepeatevent = true;
                                }
                                else if (dsImportedFile.Tables[0].Rows.Count == 2)
                                {
                                    eventname1 = dsImportedFile.Tables[0].Rows[0]["eventname"].ToString();
                                    eventname2 = dsImportedFile.Tables[0].Rows[1]["eventname"].ToString();

                                    if (String.Compare(eventname1, eventname2) == 0)
                                    {
                                        eventmismatchcondition = false;
                                        customevntsoverview = await objBL.GetCustomEventByName(eventname1);

                                        if (customevntsoverview == null)
                                            fresheventorrepeatevent = true;
                                    }
                                    else
                                    {
                                        eventmismatchcondition = true;
                                    }
                                }
                                else if (dsImportedFile.Tables[0].Rows.Count >= 3)
                                {
                                    eventname1 = dsImportedFile.Tables[0].Rows[0]["eventname"].ToString();
                                    eventname2 = dsImportedFile.Tables[0].Rows[1]["eventname"].ToString();
                                    eventname3 = dsImportedFile.Tables[0].Rows[2]["eventname"].ToString();

                                    if (String.Compare(eventname1, eventname2) == 0 && String.Compare(eventname2, eventname3) == 0)
                                    {
                                        eventmismatchcondition = false;
                                        customevntsoverview = await objBL.GetCustomEventByName(eventname1);

                                        if (customevntsoverview == null)
                                            fresheventorrepeatevent = true;
                                    }
                                    else
                                    {
                                        eventmismatchcondition = true;
                                    }
                                }

                                //Here we are checking if the event is a fresh event or repeat event

                                List<ManageCustomEventFields> eachfieldslist = new List<ManageCustomEventFields>();
                                ManageCustomEventFields objmanagefields = new ManageCustomEventFields(domainDetails.AdsId, SQLProvider);

                                if (fresheventorrepeatevent)
                                    customevntsoverview = new CustomEventsOverView() { Id = 0 };

                                eachfieldslist = await objmanagefields.GetCustomEventFieldsList(fresheventorrepeatevent, customevntsoverview.Id);

                                //Here we are checking whether in the given file predefined columns are there or not
                                for (int i = 0; i < dsImportedFile.Tables[0].Columns.Count; i++)
                                {
                                    string columnname = dsImportedFile.Tables[0].Columns[i].ColumnName;

                                    if (columnname.ToLower() == "eventname")
                                        eventnameclmexists = true;

                                    if (columnname.ToLower() == "emailid")
                                        emailorphone = true;

                                    if (columnname.ToLower() == "phonenumber")
                                        emailorphone = true;

                                    if (columnname.ToLower() == "eventtime")
                                        eventtime = true;

                                    if (columnname.ToLower() != "eventname" && columnname.ToLower() != "email-id" && columnname.ToLower() != "emailid" && columnname.ToLower() != "phonenumber" && columnname.ToLower() != "eventtime")
                                        othercolumns = true;

                                    if (eachfieldslist != null && eachfieldslist.Count() > 0 && !eachfieldslist.Any(x => x.P5ColumnName.ToLower() == columnname.ToLower()) && columnname.ToLower() != "email-id")
                                    {
                                        ManageCustomEventFields eachfield = new ManageCustomEventFields();
                                        eachfield.P5ColumnName = columnname;
                                        eachfield.FrontEndName = columnname;
                                        eachfield.FieldMappingType = "NA";
                                        eachfield.IsNewField = true;
                                        eachfieldslist.Add(eachfield);
                                    }
                                }

                                //Here we are checking if the event is a fresh event or repeat event

                                List<ManageCustomEventDataType> customdatatypelist = new List<ManageCustomEventDataType>();
                                ManageCustomEventDataType objcusttype = new ManageCustomEventDataType(domainDetails.AdsId);
                                customdatatypelist = objcusttype.GetEventDataTypeByFile(dsImportedFile, eachfieldslist, fresheventorrepeatevent);

                                if (eventmismatchcondition)
                                {
                                    Status = false;
                                    Message = "There is a mismatch in the event names in the uploaded file.Please provide unique event names.";
                                }
                                else if (!eventnameclmexists && !emailorphone && !eventtime && !othercolumns)
                                {
                                    Status = false;
                                    Message = "Mandatory columns are not present in the file.Please upload the correct columns to import";
                                }
                                else
                                {
                                    Status = true;
                                    Message = "";

                                    CustomEventImportOverview eventImportOverview = new CustomEventImportOverview()
                                    {
                                        UserInfoUserId = user.UserId,
                                        UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0,
                                        EventFileName = fileSavePath,
                                        ImportedFileName = httpPostedFile[0].FileName,
                                        ImportSource = ImportSource
                                    };
                                    HttpContext.Session.SetString("EventImportOverview", JsonConvert.SerializeObject(eventImportOverview));
                                }

                                object returnObject = new { Status, Message, returnDataSet = dsImportedFile, eachfieldslist, fresheventorrepeatevent, customdatatypelist };
                                var returnData = JsonConvert.SerializeObject(returnObject, Formatting.Indented);
                                return Content(returnData.ToString(), "application/json");
                            }
                            else
                            {
                                Message = "No record found or format is wrong";
                                Status = false;
                            }
                        }
                        else
                        {
                            Message = "File is not in correct format. Please upload only xls, xlsx and csv.";
                            Status = false;
                        }
                    }
                    else
                    {
                        Message = "File is not in correct format. Please upload only xls, xlsx and csv.";
                        Status = false;
                    }
                }
                else
                {
                    Status = false;
                    Message = "Their is no valid file exists";
                }
            }
            catch (Exception ex)
            {
                Message = ex.Message.ToString();
                Status = false;
            }

            return Json(new
            {
                Status,
                Message
            });
        }

        [Log]
        public async Task<IActionResult> ChangeFileAndSendImport([FromBody] EventImport_ChangeFileAndSendImport commonDetails)
        {
            try
            {
                if (HttpContext.Session.GetString("EventImportOverview") != null)
                {
                    LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                    DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

                    int CustomEventsOverViewId = 0;

                    CustomEventImportOverview? customeventImportOverview = JsonConvert.DeserializeObject<CustomEventImportOverview>(HttpContext.Session.GetString("EventImportOverview"));

                    List<CustomEventImportFileFieldMapping> deletedColumnList = commonDetails.ColumnMappingList.Where(x => x.IsMapped == false).ToList();
                    List<CustomEventImportFileFieldMapping> nameChangeColumnList = commonDetails.ColumnMappingList.Where(x => x.IsMapped == true && x.IsNameChanged == true).ToList();

                    string fileType = Path.GetExtension(customeventImportOverview.ImportedFileName).ToLower();
                    string newFileName = customeventImportOverview.EventFileName.Replace("_P5Temp_", "");

                    DataSet dsImportedFile = Helper.ExcelOrCsvConnReadDs(customeventImportOverview.EventFileName);

                    if (fileType == ".csv")
                    {
                        //Helper.SaveDataSetToCSV(dsImportedFile, newFileName);
                        RenameDeleteCsvFile(customeventImportOverview.EventFileName, newFileName, deletedColumnList, nameChangeColumnList);
                    }
                    else
                    {
                        //DataSet dsImportedFile = Helper.ExcelOrCsvConnReadDs(customeventImportOverview.EventFileName);

                        if (deletedColumnList != null && deletedColumnList.Count > 0)
                        {
                            for (int i = 0; i < deletedColumnList.Count; i++)
                            {
                                dsImportedFile = RemoveDataSetColumn(dsImportedFile, deletedColumnList[i].FileFieldName);
                            }
                        }

                        if (nameChangeColumnList != null && nameChangeColumnList.Count > 0)
                        {
                            for (int i = 0; i < nameChangeColumnList.Count; i++)
                            {
                                dsImportedFile = ChangeDataSetColumnName(dsImportedFile, nameChangeColumnList[i].FileFieldName, nameChangeColumnList[i].P5ColumnName);
                            }
                        }

                        Helper.SaveDataSetToExcel(dsImportedFile, newFileName);
                    }

                    if (dsImportedFile.Tables[0].Rows.Count > 0)
                    {
                        string eventname = dsImportedFile.Tables[0].Rows[0]["eventname"].ToString();
                        CustomEventsOverView customevntsoverview = new CustomEventsOverView();
                        using var objBL = DLCustomEventsOverView.GetDLCustomEventsOverView(domainDetails.AdsId, SQLProvider);
                        customevntsoverview.EventName = eventname;

                        CustomEventsOverView? custevent = await objBL.GetCustomEventByName(eventname);

                        if (custevent == null)
                            CustomEventsOverViewId = await objBL.Save(customevntsoverview);
                        else if (custevent != null && custevent.Id > 0)
                            CustomEventsOverViewId = custevent.Id;
                    }

                    using (var objBL = DLCustomEventImportOverview.GetDLCustomEventImportOverview(domainDetails.AdsId, SQLProvider))
                    {
                        customeventImportOverview.Id = await objBL.Save(new CustomEventImportOverview()
                        {
                            EventFileName = newFileName,
                            ImportedFileName = customeventImportOverview.ImportedFileName,
                            ImportSource = customeventImportOverview.ImportSource,
                            IsCompleted = 0,
                            TotalInputRow = 0,
                            TotalCompletedRow = 0,
                            UserGroupId = customeventImportOverview.UserGroupId,
                            UserInfoUserId = customeventImportOverview.UserInfoUserId
                        });
                    }

                    if (customeventImportOverview.Id > 0)
                    {
                        //Save mapping in ContactImportFileFieldMapping table
                        for (int i = 0; i < commonDetails.ColumnMappingList.Count; i++)
                        {
                            commonDetails.ColumnMappingList[i].ImportOverViewId = customeventImportOverview.Id;
                            using (var objBL = DLCustomEventImportFileFieldMapping.GetDLCustomEventImportFileFieldMapping(domainDetails.AdsId, SQLProvider))
                            {
                                await objBL.Save(commonDetails.ColumnMappingList[i]);
                            }

                            // Save field name by reading from file to CustomEventExtraField table
                            string fieldname = commonDetails.ColumnMappingList[i].P5ColumnName;
                            bool isMapped = Convert.ToBoolean(commonDetails.ColumnMappingList[i].IsMapped);

                            if (isMapped && fieldname.ToLower() != "eventname" && fieldname.ToLower() != "emailid" && fieldname.ToLower() != "email-id" && fieldname.ToLower() != "phonenumber" && fieldname.ToLower() != "eventtime")
                            {
                                CustomEventExtraField customevent = new CustomEventExtraField();
                                customevent.FieldName = fieldname;
                                customevent.UserGroupId = customeventImportOverview.UserGroupId;
                                customevent.UserInfoUserId = customeventImportOverview.UserInfoUserId;
                                customevent.FieldMappingType = commonDetails.ColumnMappingList[i].FieldMappingType;
                                customevent.CustomEventOverViewId = CustomEventsOverViewId;

                                using (var objbleventextafield = DLCustomEventExtraField.GetDLCustomEventExtraField(domainDetails.AdsId, SQLProvider))
                                {
                                    await objbleventextafield.Save(customevent);
                                }
                            }
                        }

                        //The below method is for changing the column names with respect to custom event extra field table

                        DataSet dsImportedNewFile = Helper.ExcelOrCsvConnReadDs(newFileName);

                        if (dsImportedNewFile != null && dsImportedNewFile.Tables.Count > 0 && dsImportedNewFile.Tables[0].Columns.Count > 0 && dsImportedNewFile.Tables[0].Rows.Count > 0)
                        {
                            using var objBL = DLCustomEventsOverView.GetDLCustomEventsOverView(domainDetails.AdsId, SQLProvider);

                            List<CustomEventExtraField> objlistcustomevents = new List<CustomEventExtraField>();

                            using (var objBLnew = DLCustomEventExtraField.GetDLCustomEventExtraField(domainDetails.AdsId, SQLProvider))
                            {
                                objlistcustomevents = await objBLnew.GetList(0, null, CustomEventsOverViewId);
                            }

                            for (int i = 0; i < dsImportedNewFile.Tables[0].Columns.Count; i++)
                            {
                                string columnname = dsImportedNewFile.Tables[0].Columns[i].ColumnName;

                                if (columnname.ToLower() != "eventname" && columnname.ToLower() != "email-id" && columnname.ToLower() != "emailid" && columnname.ToLower() != "phonenumber" && columnname.ToLower() != "eventtime")
                                {
                                    int fieldindex = -1;
                                    if (objlistcustomevents.Any(x => x.FieldName.ToLower() == columnname.ToLower()))
                                        fieldindex = objlistcustomevents.Select((field, eindex) => new { field, eindex }).First(x => x.field.FieldName.ToLower() == columnname.ToLower()).eindex;

                                    if (fieldindex > -1)
                                        dsImportedNewFile = ChangeDataSetColumnName(dsImportedNewFile, columnname, "EventData" + (fieldindex + 1));
                                }
                            }

                            try
                            {
                                //Create CSV File
                                if (fileType == ".csv")
                                    Helper.SaveDataSetToCSV(dsImportedNewFile, newFileName);
                                else if (fileType == ".xls")
                                    //Create XLS File
                                    Helper.SaveDataSetToExcel(dsImportedNewFile, newFileName);
                                else if (fileType == ".xlsx")
                                    //Create XLSX File
                                    Helper.SaveDataSetToExcel_XLSX(dsImportedNewFile, newFileName);

                                //Helper.SaveDataSetToExcel(dsImportedNewFile, newFileName);
                            }
                            catch (Exception ex)
                            {
                                using (ErrorUpdation objError = new ErrorUpdation("SavingCustomEventfile"))
                                {
                                    objError.AddError(ex.Message, "Not able to save the file", DateTime.Now.ToString(), "EventImportController->SavingCustomEventfile", ex.ToString(), true);
                                }
                            }
                        }
                    }

                    HttpContext.Session.SetString("EventImportOverview", "");
                    return Json(true);
                }
                return Json(false);
            }
            catch (Exception ex)
            {
                HttpContext.Session.SetString("EventImportOverview", "");
                return Json(false);
            }
        }

        private DataSet ChangeDataSetColumnName(DataSet originalDataSet, string oldColumnName, string newColumnName)
        {
            DataSet changedDataSet = originalDataSet;
            try
            {
                if (changedDataSet != null && changedDataSet.Tables.Count > 0 && changedDataSet.Tables[0].Columns.Contains(oldColumnName))
                {
                    changedDataSet.Tables[0].Columns[oldColumnName].ColumnName = newColumnName;
                    changedDataSet.AcceptChanges();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return changedDataSet;
        }

        private DataSet RemoveDataSetColumn(DataSet originalDataSet, string columnName)
        {
            DataSet changedDataSet = originalDataSet;
            try
            {
                if (changedDataSet != null && changedDataSet.Tables.Count > 0 && changedDataSet.Tables[0].Columns.Contains(columnName))
                {
                    changedDataSet.Tables[0].Columns.Remove(columnName);
                    changedDataSet.AcceptChanges();
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return changedDataSet;
        }

        private bool RenameDeleteCsvFile(string filePath, string newFilePath, List<CustomEventImportFileFieldMapping> deletedColumnList, List<CustomEventImportFileFieldMapping> nameChangeColumnList)
        {
            try
            {
                string delimiter = Helper.findFileDelimiter(filePath);
                string[] fileLines = System.IO.File.ReadAllLines(filePath);
                string[] fileHeader = Regex.Split(fileLines[0], delimiter);

                string[] changedFileHeader = new string[fileHeader.Length - deletedColumnList.Count];

                List<int> deleteColumnIndex = new List<int>();
                int j = 0;
                for (int i = 0; i < fileHeader.Length; i++)
                {
                    if (deletedColumnList.Exists(x => x.FileFieldIndex == i))
                    {
                        //Ignore as need to delete
                    }
                    else
                    {
                        if (nameChangeColumnList.Exists(x => x.FileFieldName == fileHeader[i]))
                        {
                            changedFileHeader[j] = nameChangeColumnList.FirstOrDefault(x => x.FileFieldName == fileHeader[i]).P5ColumnName;
                        }
                        else
                        {
                            changedFileHeader[j] = fileHeader[i];
                        }
                        j++;
                    }
                }

                using (StreamWriter file = new StreamWriter(newFilePath))
                {
                    foreach (string eachLine in fileLines)
                    {
                        List<string> eachLineValues = new List<string>();
                        string writeLine = "";
                        if (eachLine == fileLines[0])
                        {
                            writeLine = string.Join(delimiter, changedFileHeader);
                        }
                        else
                        {
                            var currentLineValues = Regex.Split(eachLine, delimiter);
                            for (int i = 0; i < fileHeader.Length; i++)
                            {
                                if (deletedColumnList.Exists(x => x.FileFieldIndex == i))
                                {
                                    //Ignore as need to delete
                                }
                                else
                                {
                                    eachLineValues.Add(currentLineValues[i].Replace("\"", "").TrimStart().TrimEnd());
                                }
                            }
                            writeLine = string.Join(delimiter, eachLineValues);
                        }
                        file.WriteLine(writeLine);
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetCustomEventExtraProperties([FromBody] EventImport_GetCustomEventExtraProperties commonDetails)
        {
            using (var objBL = DLCustomEventExtraField.GetDLCustomEventExtraField(commonDetails.accountId, SQLProvider))
            {
                return Json(await objBL.GetList());
            }
        }
    }
}
