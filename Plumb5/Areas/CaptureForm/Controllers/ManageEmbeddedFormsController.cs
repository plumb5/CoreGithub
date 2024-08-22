using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.CaptureForm.Dto;
using Plumb5.Areas.CaptureForm.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Data;

namespace Plumb5.Areas.CaptureForm.Controllers
{
    [Area("CaptureForm")]
    public class ManageEmbeddedFormsController : BaseController
    {
        public ManageEmbeddedFormsController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /CaptureForm/ManageEmbeddedForms/

        public IActionResult Index()
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            ViewBag.AdsId = account.AdsId;
            return View("ManageEmbeddedForms");
        }

        [HttpPost]
        public async Task<IActionResult> GetMaxCount([FromBody] ManageEmbeddedForms_GetMaxCount commonDetails)
        {
            commonDetails.formDetails.EmbeddedFormOrPopUpFormOrTaggedForm = "EmbeddedForm";

            int returnVal;
            using (var objDL = DLFormDetails.GetDLFormDetails(commonDetails.accountId, SQLProvider))
            {
                returnVal = await objDL.GetMaxCount(commonDetails.formDetails, null, null);
            }
            return Json(new { returnVal });
        }

        [HttpPost]
        public async Task<IActionResult> GetAllDetails([FromBody] ManageEmbeddedForms_GetAllDetails commonDetails)
        {

            commonDetails.formDetails.EmbeddedFormOrPopUpFormOrTaggedForm = "EmbeddedForm";

            List<FormDetails> formDetailsList = null;

            ArrayList data = new ArrayList() { commonDetails.formDetails };
            HttpContext.Session.SetString("AllForms", JsonConvert.SerializeObject(data));

            using (var objDL = DLFormDetails.GetDLFormDetails(commonDetails.accountId, SQLProvider))
            {
                formDetailsList = await objDL.GET(commonDetails.formDetails, commonDetails.OffSet, commonDetails.FetchNext, null, null, false, null, null, null, null);
            }

            var getdata = JsonConvert.SerializeObject(formDetailsList, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Delete([FromBody] ManageEmbeddedForms_Delete commonDetails)
        {
            using (var objDL = DLFormDetails.GetDLFormDetails(commonDetails.accountId, SQLProvider))
            {
                bool result;
                result = await objDL.Delete(commonDetails.Id);
                return Json(result);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ToogleStatus([FromBody] ManageEmbeddedForms_GetMaxCount commonDetails)
        {
            using (var objDL = DLFormDetails.GetDLFormDetails(commonDetails.accountId, SQLProvider))
            {
                bool result;
                result = await objDL.ToogleStatus(commonDetails.formDetails);
                return Json(result);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> CopyFormDetails([FromBody] ManageEmbeddedForms_CopyFormDetails commonDetails)
        {
            int newFormId = 0;
            using DuplicateFormCreation objcreateform = new DuplicateFormCreation(commonDetails.accountId, SQLProvider);
            newFormId = await objcreateform.CreateDuplicate(commonDetails.Id);
            return Json(newFormId);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> EmbeddedFormsExport([FromBody] ManageEmbeddedForms_EmbeddedFormsExport commonDetails)
        {

            DataSet dataSet = new DataSet();
            FormDetails? formDetails = new FormDetails();
            List<FormDetails> formDetailsList = new List<FormDetails>();

            if (HttpContext.Session.GetString("AllForms") != null)
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("AllForms"));
                formDetails = JsonConvert.DeserializeObject<FormDetails>(Convert.ToString(data[0]));
            }

            using (var objDL = DLFormDetails.GetDLFormDetails(commonDetails.AccountId, SQLProvider))
            {
                formDetailsList = await objDL.GET(formDetails, commonDetails.OffSet, commonDetails.FetchNext, null, null, false, null, null, null, null);
            }

            var NewListData = formDetailsList.Select(x => new
            {
                Name = x.Heading,
                FormIdentifier = x.FormIdentifier,
                SubHeading = x.SubHeading,
                FormType = x.FormType == 1 ? "Lead Generation" : x.FormType == 2 ? "Custom HTML" : x.FormType == 3 ? "Custom IFRAMES" : x.FormType == 4 ? "Custom Banner" : x.FormType == 5 ? "Video" : x.FormType == 19 ? "Conditional Multi Banner" : "Multivariate analysis",
                FormStatus = x.FormStatus == true ? "Active" : "InActive",
                UpdatedDate = x.UpdatedDate
            });

            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTableExport();
            dataSet.Tables.Add(dtt);

            string FileName = "EmbeddedFormDetails_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }


        [Log]
        [HttpPost]
        public async Task<JsonResult> ChangePriority([FromBody] ManageEmbeddedForms_ChangePriority commonDetails)
        {
            if (commonDetails.formdetails != null && commonDetails.formdetails.Count() > 0)
            {
                for (int i = 0; i < commonDetails.formdetails.Count(); i++)
                {
                    //#region Logs 
                    //string LogMessage = string.Empty;
                    //Int64 LogId = TrackLogs.SaveLog(AccountId, user.UserId, user.UserName, user.EmailId, "AllForms", "CaptureForm", "ChangePriority", Helper.GetIP(), JsonConvert.SerializeObject(new { Id = formdetails[i].Id, FormPriority = formdetails[i].FormPriority }));
                    //#endregion

                    using (var objDL = DLFormDetails.GetDLFormDetails(commonDetails.AccountId, SQLProvider))
                    {
                        bool result;

                        result = await objDL.ChangePriority(commonDetails.formdetails[i].Id, commonDetails.formdetails[i].FormPriority);

                        //if (result == true)
                        //    LogMessage = "Priority changed successfully";
                        //else
                        //    LogMessage = "Unable to change the Priority";

                        //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), LogMessage);
                    }
                }
            }
            return Json(true);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveFormDetails([FromBody] ManageEmbeddedForms_SaveFormDetails commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));


            commonDetails.formdetails.UserInfoUserId = user.UserId;

            //#region Logs 
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(AccountId, user.UserId, user.UserName, user.EmailId, "CaptureForm", "CaptureForm", "SaveFormDetails", Helper.GetIP(), JsonConvert.SerializeObject(new { formdetails = formdetails, formfieldbindingdetails = formfieldbindingdetails, allFormFields = allFormFields, rulesData = rulesData, responseSettings = responseSettings, responseMailSettingFieldIndex = responseMailSettingFieldIndex, responseSMSSettingFieldIndex = responseSMSSettingFieldIndex, responseMailOutSettingIndex = responseMailOutSettingIndex, responseSalesAssigmentSettingIndex = responseSalesAssigmentSettingIndex, mailSettingList = mailSettingList, smsSettingList = smsSettingList, responseSmsOutSettingIndex = responseSmsOutSettingIndex, responseRedirectUrlSettingIndex = responseRedirectUrlSettingIndex, responseAutoAssignToGroupIndex = responseAutoAssignToGroupIndex, responseReportToPhoneIndex = responseReportToPhoneIndex, AutoAssignToGroupIndexValues = AutoAssignToGroupIndexValues }));
            //#endregion

            using GenralFormDetails saveForm = new GenralFormDetails(commonDetails.AccountId, user.UserId, SQLProvider);
            FormDetails formDetails = new FormDetails();
            FormRules formRules = new FormRules();

            if (user != null)
            {
                Helper.CopyWithDateTimeWhenString(commonDetails.formdetails, formDetails);
                Helper.CopyWithDateTimeWhenString(commonDetails.rulesData, formRules);
                await saveForm.SaveAllDetailsOfForm(formDetails, commonDetails.formfieldbindingdetails, commonDetails.allFormFields, formRules, commonDetails.responseSettings, commonDetails.WebHookData, commonDetails.responseMailSettingFieldIndex, commonDetails.responseSMSSettingFieldIndex, commonDetails.responseMailOutSettingIndex, commonDetails.responseSalesAssigmentSettingIndex, commonDetails.mailSettingList, commonDetails.smsSettingList, commonDetails.responseSmsOutSettingIndex, commonDetails.responseRedirectUrlSettingIndex, commonDetails.responseAutoAssignToGroupIndex, commonDetails.WhatsAppSettingList, commonDetails.responseWhatsAppOutSettingIndex, commonDetails.responseWhatsAppSettingFieldIndex, commonDetails.responseReportToPhoneIndex, commonDetails.AutoAssignToGroupIndexValues, commonDetails.DeletedWebhookId, commonDetails.RuleChecking, commonDetails.IsOverSourceIndexValues);
                //LogMessage = "Form details saved successfully";
            }
            else
            {
                saveForm.Status = false;
                saveForm.ErrorMessage = "Session Expired";
                //LogMessage = "Unable to save Form details";
            }

            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { saveForm = saveForm }), LogMessage);
            return Json(saveForm);
        }

        [HttpPost]
        public async Task<JsonResult> GetFormDetails([FromBody] ManageEmbeddedForms_GetFormDetails commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            GenralFormDetails saveForm = new GenralFormDetails(commonDetails.AccountId, user.UserId, SQLProvider);

            if (user != null)
            {
                await saveForm.GetFormDetailsRules(commonDetails.FormId);
                await saveForm.GetFormField(commonDetails.FormId);
                await saveForm.GetFormBindingFieldDetails(commonDetails.FormId);
            }
            else
            {
                saveForm.Status = false;
                saveForm.ErrorMessage = "Session Expired";
            }

            return Json(saveForm);
        }

        [HttpPost]
        public async Task<JsonResult> GetContactProperties([FromBody] ManageEmbeddedForms_GetContactProperties commonDetails)
        {
            using (var objDL = DLContactExtraField.GetDLContactExtraField(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDL.GetList());
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> DeleteField([FromBody] ManageEmbeddedForms_DeleteField commonDetails)
        {
            using var objField = DLFormFields.GetDLFormFields(commonDetails.AccountId, SQLProvider);
            bool status = await objField.Delete(commonDetails.Id);
            return Json(status);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> DeleteFormBindingField(int AccountId, Int16 Id)
        {
            using var objField = DLFormFieldsBindingDetails.GetDLFormFieldsBindingDetails(AccountId, SQLProvider);
            bool status = await objField.Delete(Id);
            return Json(status);
        }
    }
}

