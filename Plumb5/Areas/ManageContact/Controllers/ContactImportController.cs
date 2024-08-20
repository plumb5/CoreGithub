using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.ManageContact.Dto;
using Plumb5.Areas.ManageContact.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Data;
using System.Text.RegularExpressions;

namespace Plumb5.Areas.ManageContact.Controllers
{
    [Area("ManageContact")]
    public class ContactImportController : BaseController
    {
        private readonly IWebHostEnvironment _env;

        public ContactImportController(IConfiguration _configuration, IWebHostEnvironment env) : base(_configuration)
        {
            _env = env;
        }

        public async Task<IActionResult> Index()
        {
            HttpContext.Session.SetString("ContactImportOverview", "");
            HttpContext.Session.SetString("ContactImportRemoveContactsFromGroup", "");
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            bool IsOverrideAssignmentPermission = false;
            bool IsOverrideSourcePermission = false;

            if (user.IsSuperAdmin == 1)
            {
                IsOverrideAssignmentPermission = true;
                IsOverrideSourcePermission = true;
            }
            else
            {
                var objBLPermission = DLPermissionsLevel.GetDLPermissionsLevel(SQLProvider);
                PermissionsLevels permissions = await objBLPermission.UserPermissionbyAccountId(user.UserId, domainDetails.AdsId);

                if (permissions != null)
                {
                    PermissionSubLevels subPermissionAssignment = new PermissionSubLevels();
                    PermissionSubLevels subPermissionSource = new PermissionSubLevels();
                    using (var objBL = DLPermissionSubLevels.GetDLPermissionSubLevels(SQLProvider))
                    {
                        subPermissionAssignment = await objBL.GetDetails(new PermissionSubLevels() { PermissionLevelId = permissions.Id }, "RetainAssignment");
                        subPermissionSource = await objBL.GetDetails(new PermissionSubLevels() { PermissionLevelId = permissions.Id }, "RetainSource");
                    }
                    if (subPermissionAssignment != null && subPermissionAssignment.HasPermission)
                    {
                        IsOverrideAssignmentPermission = true;
                    }

                    if (subPermissionSource != null && subPermissionSource.HasPermission)
                    {
                        IsOverrideSourcePermission = true;
                    }
                }
            }
            ViewBag.IsOverrideAssignmentPermission = IsOverrideAssignmentPermission;
            ViewBag.IsOverrideSourcePermission = IsOverrideSourcePermission;
            return View("ContactImport");
        }

        [Log]
        [HttpPost]
        public async Task<IActionResult> InitiateImport(int GroupId, int LmsGroupId, bool OverrideAssignment, bool OverrideSources, string UserIdList, bool AssociateContactsToGrp = true, bool RemoveOldContactsFromTheGroup = false, string ImportSource = "ManageContact", bool NotoptedforEmailValidation = false, bool IgnoreUpdateContact = false, int SourceType = 0)
        {
            HttpContext.Session.SetString("ContactImportOverview", "");
            HttpContext.Session.SetString("ContactImportRemoveContactsFromGroup", "");
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            if (user.IsSuperAdmin != 1)
            {
                var objBLPermission = DLPermissionsLevel.GetDLPermissionsLevel(SQLProvider);
                PermissionsLevels permissions = await objBLPermission.UserPermissionbyAccountId(user.UserId, domainDetails.AdsId);

                if (permissions != null)
                {
                    PermissionSubLevels subPermissionAssignment = new PermissionSubLevels();
                    PermissionSubLevels subPermissionSource = new PermissionSubLevels();
                    using (var objBL = DLPermissionSubLevels.GetDLPermissionSubLevels(SQLProvider))
                    {
                        subPermissionAssignment = await objBL.GetDetails(new PermissionSubLevels() { PermissionLevelId = permissions.Id }, "RetainAssignment");
                        subPermissionSource = await objBL.GetDetails(new PermissionSubLevels() { PermissionLevelId = permissions.Id }, "RetainSource");
                    }

                    if (subPermissionAssignment == null || !subPermissionAssignment.HasPermission)
                    {
                        OverrideAssignment = false;
                    }

                    if (subPermissionSource == null || !subPermissionSource.HasPermission)
                    {
                        OverrideSources = false;
                        //sourcetype = 0;
                    }
                }
                else
                {
                    OverrideAssignment = false;
                    OverrideSources = false;
                    //sourcetype = 0;
                }
            }

            string Message = "";
            bool Status = false;
            try
            {
                var httpPostedFile = Request.Form.Files;

                //HttpFileCollectionBase httpPostedFile = HttpContext.Request.Files;

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
                            string fileName = "_P5Temp_ContactImport_" + domainDetails.AdsId + "_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + Path.GetExtension(httpPostedFile[0].FileName);
                            if (!(Directory.Exists(Path.Combine(webRootPath, "~/TempFiles/ContactImport/"))))
                            {
                                Directory.CreateDirectory(Path.Combine(webRootPath, "~/TempFiles/ContactImport/"));
                            }
                            string fileSavePath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString() + "/TempFiles/ContactImport/" + fileName;//Path.Combine(HttpContext.Server.MapPath("~/TempFiles/"), fileName);
                            using var stream = new FileStream(fileSavePath, FileMode.Create, FileAccess.Write, FileShare.ReadWrite, bufferSize: 4096, useAsync: true);
                            await httpPostedFile[0].CopyToAsync(stream);

                            DataSet dsImportedFile;

                            if (fileExtension == ".csv")
                            {
                                dsImportedFile = Helper.GetCSVDataSetWithSpecifiedRows(fileSavePath, 3);
                            }
                            else
                            {
                                dsImportedFile = Helper.ExcelOrCsvConnReadDs(fileSavePath);
                            }

                            if (dsImportedFile != null && dsImportedFile.Tables.Count > 0 && dsImportedFile.Tables[0].Columns.Count > 0 && dsImportedFile.Tables[0].Rows.Count > 0)
                            {
                                Status = true;
                                Message = "";

                                ContactImportOverview contactImportOverview = new ContactImportOverview()
                                {
                                    UserInfoUserId = user.UserId,
                                    GroupId = GroupId,
                                    UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0,
                                    ContactFileName = fileSavePath,
                                    ImportedFileName = httpPostedFile[0].FileName,
                                    AssociateContactsToGroup = AssociateContactsToGrp,
                                    OverrideAssignment = OverrideAssignment,
                                    LmsGroupId = LmsGroupId,
                                    UserIdList = UserIdList,
                                    OverrideSources = OverrideSources,
                                    ImportSource = ImportSource,
                                    NotoptedforEmailValidation = NotoptedforEmailValidation,
                                    IgnoreUpdateContact = IgnoreUpdateContact,
                                    SourceType = SourceType
                                };

                                object returnObject = new { Status, Message, returnDataSet = dsImportedFile };
                                var returnData = JsonConvert.SerializeObject(returnObject, Formatting.Indented);

                                HttpContext.Session.SetString("ContactImportOverview", JsonConvert.SerializeObject(contactImportOverview));
                                HttpContext.Session.SetString("ContactImportRemoveContactsFromGroup", RemoveOldContactsFromTheGroup.ToString());

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
        [HttpPost]
        public async Task<IActionResult> ChangeFileAndSendImport([FromBody] ContactImport_ChangeFileAndSendImportDto details)
        {
            try
            {
                if (HttpContext.Session.GetString("ContactImportOverview") != null && HttpContext.Session.GetString("ContactImportRemoveContactsFromGroup") != null)
                {
                    DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                    LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

                    ContactImportOverview contactImportOverview = JsonConvert.DeserializeObject<ContactImportOverview>(HttpContext.Session.GetString("ContactImportOverview"));
                    bool RemoveOldContactsFromTheGroup = Convert.ToBoolean(HttpContext.Session.GetString("ContactImportRemoveContactsFromGroup").ToString());

                    List<ContactImportFileFieldMapping> deletedColumnList = details.ColumnMappingList.Where(x => x.IsMapped == false).ToList();
                    List<ContactImportFileFieldMapping> nameChangeColumnList = details.ColumnMappingList.Where(x => x.IsMapped == true && x.IsNameChanged == true).ToList();

                    string fileType = Path.GetExtension(contactImportOverview.ImportedFileName).ToLower();
                    string newFileName = contactImportOverview.ContactFileName.Replace("_P5Temp_", "");
                    if (fileType == ".csv")
                    {
                        //Helper.SaveDataSetToCSV(dsImportedFile, newFileName);
                        RenameDeleteCsvFile(contactImportOverview.ContactFileName, newFileName, deletedColumnList, nameChangeColumnList);
                    }
                    else
                    {
                        DataSet dsImportedFile = Helper.ExcelOrCsvConnReadDs(contactImportOverview.ContactFileName);
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

                    using (var objBL = DLContactImportOverview.GetDLContactImportOverview(domainDetails.AdsId, SQLProvider))
                    {
                        contactImportOverview.Id = await objBL.Save(new ContactImportOverview()
                        {
                            AssociateContactsToGroup = contactImportOverview.AssociateContactsToGroup,
                            ContactFileName = newFileName,
                            GroupId = contactImportOverview.GroupId,
                            ImportedFileName = contactImportOverview.ImportedFileName,
                            ImportSource = contactImportOverview.ImportSource,
                            IsCompleted = 0,
                            TotalInputRow = 0,
                            TotalCompletedRow = 0,
                            UserGroupId = contactImportOverview.UserGroupId,
                            UserInfoUserId = contactImportOverview.UserInfoUserId,
                            LmsGroupId = contactImportOverview.LmsGroupId,
                            OverrideAssignment = contactImportOverview.OverrideAssignment,
                            UserIdList = contactImportOverview.UserIdList,
                            OverrideSources = contactImportOverview.OverrideSources,
                            NotoptedforEmailValidation = contactImportOverview.NotoptedforEmailValidation,
                            IgnoreUpdateContact = contactImportOverview.IgnoreUpdateContact,
                            SourceType = contactImportOverview.SourceType
                        });
                    }

                    if (contactImportOverview.Id > 0)
                    {
                        // Here Remove all the contacts from the exisitng group
                        if (RemoveOldContactsFromTheGroup && contactImportOverview.GroupId > 0)
                        {
                            using (var objGroupMember = DLGroupMember.GetDLGroupMember(domainDetails.AdsId, SQLProvider))
                            {
                                await objGroupMember.RemoveAll(contactImportOverview.GroupId);
                            }
                        }

                        // Save mapping in ContactImportFileFieldMapping table
                        for (int i = 0; i < details.ColumnMappingList.Count; i++)
                        {
                            details.ColumnMappingList[i].ImportOverViewId = contactImportOverview.Id;
                            using (var objBL = DLContactImportFileFieldMapping.GetDLContactImportFileFieldMapping(domainDetails.AdsId, SQLProvider))
                            {
                                await objBL.Save(details.ColumnMappingList[i]);
                            }
                        }
                    }
                    HttpContext.Session.SetString("ContactImportOverview", "");
                    HttpContext.Session.SetString("ContactImportRemoveContactsFromGroup", "");

                    return Json(true);
                }
                return Json(false);
            }
            catch (Exception ex)
            {
                HttpContext.Session.SetString("ContactImportOverview", "");
                HttpContext.Session.SetString("ContactImportRemoveContactsFromGroup", "");
                return Json(false);
            }
        }

        [HttpPost]
        public async Task<IActionResult> GetGroupList([FromBody] ContactImport_GetGroupListDto details)
        {
            List<Groups> groupList = null;

            using (var objBL = DLGroups.GetDLGroups(details.accountId, SQLProvider))
            {
                groupList = await objBL.GetGroupList(new Groups());
            }

            return Json(groupList);
        }

        [HttpPost]
        public async Task<JsonResult> GetContactProperties([FromBody] ContactImport_GetContactPropertiesDto details)
        {
            using (var objBL = DLContactExtraField.GetDLContactExtraField(details.accountId, SQLProvider))
            {
                return Json(await objBL.GetList());
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetLMSContactProperties([FromBody] ContactImport_GetLMSContactPropertiesDto details)
        {
            using (var objBL = DLLmsCustomFields.GetDLLmsCustomFields(details.accountId, SQLProvider))
            {
                return Json(await objBL.GetDetails());
            }
        }

        [Log]
        [HttpPost]
        public async Task<IActionResult> FTPInitiateImport([FromBody] ContactImport_FTPInitiateImportDto details)
        {
            string Message = "";
            bool Status = true;
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<int> ids = new List<int>();

            if (user.IsSuperAdmin != 1)
            {
                var objBLPermission = DLPermissionsLevel.GetDLPermissionsLevel(SQLProvider);
                PermissionsLevels permissions = await objBLPermission.UserPermissionbyAccountId(user.UserId, domainDetails.AdsId);

                if (permissions != null)
                {
                    PermissionSubLevels subPermissionAssignment = new PermissionSubLevels();
                    PermissionSubLevels subPermissionSource = new PermissionSubLevels();
                    using (var objBL = DLPermissionSubLevels.GetDLPermissionSubLevels(SQLProvider))
                    {
                        subPermissionAssignment = await objBL.GetDetails(new PermissionSubLevels() { PermissionLevelId = permissions.Id }, "RetainAssignment");
                        subPermissionSource = await objBL.GetDetails(new PermissionSubLevels() { PermissionLevelId = permissions.Id }, "RetainSource");
                    }

                    if (subPermissionAssignment == null || !subPermissionAssignment.HasPermission)
                    {
                        details.ftpContactImport.OverrideAssignment = false;
                    }

                    if (subPermissionSource == null || !subPermissionSource.HasPermission)
                    {
                        details.ftpContactImport.OverrideAssignment = false;
                        details.ftpContactImport.OverrideSources = false;
                        details.ftpContactImport.SourceType = 0;
                    }
                }
                else
                {
                    details.ftpContactImport.OverrideAssignment = false;
                    details.ftpContactImport.OverrideSources = false;
                    details.ftpContactImport.SourceType = 0;
                }
            }


            try
            {

                List<ContactExtraField> contactExtraField = null;
                using (var objBL = DLContactExtraField.GetDLContactExtraField(details.accountid, SQLProvider))
                {
                    contactExtraField = await objBL.GetList();

                    if (contactExtraField != null && contactExtraField.Count > 0)
                    {
                        foreach (var eachdata in contactExtraField)
                        {
                            ContactPropertyList contactPropertyLists = new ContactPropertyList { P5ColumnName = eachdata.FieldName, FrontEndName = eachdata.FieldName, FieldType = "" };
                            details.ContactPropertyList.Add(contactPropertyLists);
                        }
                    }
                }

                FtpImportSettings ftpImportSettings = null;
                using (var objBL = DLFtpImportSettings.GetDLFtpImportSettings(details.accountid, SQLProvider))
                {
                    ftpImportSettings = objBL.GetFtpImportSettingsDetails(details.ftpContactImport.ConnectionId);
                }

                if (ftpImportSettings != null && ftpImportSettings.Id > 0)
                {
                    FtpImportContactDownload ftpImportContactDownload = new FtpImportContactDownload(details.accountid, ftpImportSettings.Protocol, SQLProvider);
                    Tuple<bool, string, List<string>> items = ftpImportContactDownload.DownloadAndMoveToTempFiles(details.ftpContactImport.ConnectionId, details.ftpContactImport.Path, details.ftpContactImport.Files);

                    for (int i = 0; i < details.ftpContactImport.Files.Length; i++)
                    {
                        DataSet dsImportedFile = Helper.ExcelOrCsvConnReadDs(items.Item3[i]);

                        if (dsImportedFile != null && dsImportedFile.Tables != null && dsImportedFile.Tables.Count > 0 && dsImportedFile.Tables[0].Rows.Count > 0)
                        {
                            List<ContactImportFileFieldMapping> ColumnMappingList = ftpImportContactDownload.MappingFTPFile(dsImportedFile, details.ContactPropertyList);
                            List<ContactImportFileFieldMapping> deletedColumnList = ColumnMappingList.Where(x => x.IsMapped == false).ToList();
                            List<ContactImportFileFieldMapping> nameChangeColumnList = ColumnMappingList.Where(x => x.IsMapped == true && x.IsNameChanged == true).ToList();

                            string fileType = Path.GetExtension(details.ftpContactImport.Files[i]).ToLower();
                            string newFileName = items.Item3[i].Replace("_P5Temp_", "");
                            if (fileType == ".csv")
                            {
                                //Helper.SaveDataSetToCSV(dsImportedFile, newFileName);
                                RenameDeleteCsvFile(items.Item3[i], newFileName, deletedColumnList, nameChangeColumnList);
                            }
                            else
                            {
                                if (deletedColumnList != null && deletedColumnList.Count > 0)
                                {
                                    for (int k = 0; k < deletedColumnList.Count; k++)
                                    {
                                        dsImportedFile = RemoveDataSetColumn(dsImportedFile, deletedColumnList[k].FileFieldName);
                                    }
                                }

                                if (nameChangeColumnList != null && nameChangeColumnList.Count > 0)
                                {
                                    for (int l = 0; l < nameChangeColumnList.Count; l++)
                                    {
                                        dsImportedFile = ChangeDataSetColumnName(dsImportedFile, nameChangeColumnList[l].FileFieldName, nameChangeColumnList[l].P5ColumnName);
                                    }
                                }

                                Helper.SaveDataSetToExcel(dsImportedFile, newFileName);
                            }

                            using (var objBL = DLContactImportOverview.GetDLContactImportOverview(domainDetails.AdsId, SQLProvider))
                            {
                                int Id = await objBL.Save(new ContactImportOverview()
                                {
                                    AssociateContactsToGroup = details.ftpContactImport.AssociateContactsToGrp,
                                    ContactFileName = newFileName,
                                    GroupId = details.ftpContactImport.GroupId,
                                    ImportedFileName = details.ftpContactImport.Files[i],
                                    ImportSource = details.ftpContactImport.ImportSource,
                                    IsCompleted = 0,
                                    TotalInputRow = 0,
                                    TotalCompletedRow = 0,
                                    UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0,
                                    UserInfoUserId = user.UserId,
                                    LmsGroupId = details.ftpContactImport.LmsGroupId,
                                    OverrideAssignment = details.ftpContactImport.OverrideAssignment,
                                    UserIdList = details.ftpContactImport.UserIdList,
                                    OverrideSources = details.ftpContactImport.OverrideSources
                                });
                                ids.Add(Id);



                                if (Id > 0)
                                {
                                    // Save mapping in ContactImportFileFieldMapping table
                                    for (int u = 0; u < ColumnMappingList.Count; u++)
                                    {
                                        ColumnMappingList[u].ImportOverViewId = Id;
                                        using (var objBLs = DLContactImportFileFieldMapping.GetDLContactImportFileFieldMapping(domainDetails.AdsId, SQLProvider))
                                        {
                                            objBLs.Save(ColumnMappingList[u]);
                                        }
                                    }
                                }
                            }
                        }
                        else
                        {
                            Status = false;
                            Message = $"Unable to fetch file, Something went wrong. Please try again.";
                        }
                    }
                }
                else
                {
                    Status = false;
                    Message = $"Connection not found.";
                }
            }
            catch (Exception ex)
            {
                Status = false;
                Message = ex.Message;
            }

            if (ids.Count > 0 && Status)
            {
                // Here Remove all the contacts from the exisitng group
                if (details.ftpContactImport.RemoveOldContactsFromTheGroup && details.ftpContactImport.GroupId > 0)
                {
                    using (var objGroupMember = DLGroupMember.GetDLGroupMember(domainDetails.AdsId, SQLProvider))
                    {
                        objGroupMember.RemoveAll(details.ftpContactImport.GroupId);
                    }
                }

                Status = true;
                Message = $"Import file has been uploaded and will start soon, Out of {details.ftpContactImport.Files.Length} files, total file initialized is {ids.Count}";
            }
            else
            {
                Status = false;
                Message = String.IsNullOrEmpty(Message) ? $"Unable to initialized, Something went wrong. Please try again." : Message;
            }


            return Json(new { Status, Message });
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
        private bool RenameDeleteCsvFile(string filePath, string newFilePath, List<ContactImportFileFieldMapping> deletedColumnList, List<ContactImportFileFieldMapping> nameChangeColumnList)
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
                                    eachLineValues.Add(currentLineValues[i]);
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

    }
}
