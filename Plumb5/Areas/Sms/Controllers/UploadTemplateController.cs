using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Sms.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Data;

namespace Plumb5.Areas.Sms.Controllers
{
    [Area("Sms")]
    public class UploadTemplateController : BaseController
    {
        public UploadTemplateController(IConfiguration _configuration) : base(_configuration)
        { }
        public async Task<ActionResult> Index()
        {
            if (HttpContext.Session.GetString("TemplateData") == null)
            {
                return RedirectToAction("../Template");
            }

            if (HttpContext.Session.GetString("MessageContent") != null)
            {
                ViewBag.Message = HttpContext.Session.GetString("MessageContent");
            }
            return View("CreateTemplate");
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveOrUpdateTemplate([FromBody] UploadTemplate_SaveOrUpdateTemplateDto objDto)
        {
            SmsTemplate smsTemplate = objDto.smsTemplateData;
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            bool result = false;
            //#region Logs  
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "Template", "Sms", "SaveOrUpdateTemplate", Helper.GetIP(), JsonConvert.SerializeObject(new { smsTemplate = smsTemplate, smsTemplateUrls = smsTemplateUrls }));
            //#endregion

            if (HttpContext.Session.GetString("TemplateData") != null)
            {
                var filterdata = JsonConvert.DeserializeObject<SmsTemplate>(HttpContext.Session.GetString("TemplateData"));
                smsTemplate.Id = Convert.ToInt32(filterdata.Id.ToString());
                smsTemplate.SmsCampaignId = Convert.ToInt32(filterdata.SmsCampaignId.ToString());
                smsTemplate.Name = filterdata.Name.ToString();
                smsTemplate.Description = filterdata.Description.ToString();
                smsTemplate.UserInfoUserId = user.UserId;
                smsTemplate.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
                smsTemplate.VendorTemplateId = filterdata.VendorTemplateId != null ? filterdata.VendorTemplateId.ToString() : "";
                smsTemplate.DLTUploadMessageFile = filterdata.DLTUploadMessageFile;
                smsTemplate.IsPromotionalOrTransactionalType = filterdata.IsPromotionalOrTransactionalType;
                smsTemplate.Sender = filterdata.Sender;
                if (smsTemplate.Id == 0)
                {
                    HttpContext.Session.SetString("TemplateData", JsonConvert.SerializeObject(null));
                    HttpContext.Session.SetString("MessageContent", JsonConvert.SerializeObject(null));
                }
            }

            using (var objDL = DLSmsTemplate.GetDLSmsTemplate(domainDetails.AdsId, SQLProvider))
            {
                if (smsTemplate.Id <= 0)
                {
                    smsTemplate.Id = await objDL.Save(smsTemplate);
                    if (smsTemplate.Id > 0)
                        result = true;
                    else
                        result = false;

                    //if (smsTemplate.Id > 0)
                    //    LogMessage = "The sms template '" + smsTemplate.Name + "' has been created";
                    //else
                    //    LogMessage = "Unable to created the sms template '" + smsTemplate.Name + "'";
                }

                else if (smsTemplate.Id > 0)
                {
                    result = await objDL.Update(smsTemplate);
                    //if (result)
                    //    LogMessage = "The sms template '" + smsTemplate.Name + "' has been updated";
                    //else
                    //    LogMessage = "Unable to update the sms template '" + smsTemplate.Name + "'";
                }
            }

            List<SmsTemplateUrl> smsTemplateUrls = objDto.smsTemplateUrlsData;
            if (smsTemplate.Id > 0 && smsTemplateUrls != null)
            {
                using (var objDL = DLSmsTemplateUrl.GetDLSmsTemplateUrl(domainDetails.AdsId, SQLProvider))
                {
                    for (int i = 0; i < smsTemplateUrls.Count; i++)
                    {
                        smsTemplateUrls[i].SmsTemplateId = smsTemplate.Id;
                        await objDL.Update(smsTemplateUrls[i]);
                    }
                }
            }
            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { smsTemplate = smsTemplate }), LogMessage);
            return Json(new { data = smsTemplate, status = result });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveSmsTemplateUrl([FromBody] UploadTemplate_SaveSmsTemplateUrlDto objDto)
        {
            SmsTemplateUrl smsTemplateUrl = objDto.smsTemplateUrlData;
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            bool result = false;
            //#region Logs    
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "UploadTemplate", "Sms", "SaveSmsTemplateUrl", Helper.GetIP(), JsonConvert.SerializeObject(new { smsTemplateUrl = smsTemplateUrl }));
            //#endregion
            using (var objDL = DLSmsTemplateUrl.GetDLSmsTemplateUrl(domainDetails.AdsId, SQLProvider))
            {
                if (smsTemplateUrl.Id == 0)
                {
                    smsTemplateUrl.Id = await objDL.SaveSmsTemplateUrl(smsTemplateUrl);
                    if (smsTemplateUrl.Id > 0)
                        result = true;
                    else
                        result = false;

                    //if (smsTemplateUrl.Id > 0)
                    //    LogMessage = "The sms template url has been created";
                    //else
                    //    LogMessage = "Unable to create sms template url";
                }
                else if (smsTemplateUrl.Id > 0)
                {
                    result = await objDL.Update(smsTemplateUrl);
                    //if (result)
                    //    LogMessage = "The sms template url has been updated";
                    //else
                    //    LogMessage = "Unable to update sms template url";
                }
            }
            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { smsTemplateUrl = smsTemplateUrl }), LogMessage);
            return Json(new { smsTemplateUrl, result });
        }
        [HttpPost]
        public async Task<JsonResult> GetSmsTemplateUrl([FromBody] UploadTemplate_GetSmsTemplateUrlDto objDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<SmsTemplateUrl> smsUrlDetails = null;
            using (var objDL = DLSmsTemplateUrl.GetDLSmsTemplateUrl(domainDetails.AdsId, SQLProvider))
            {
                smsUrlDetails = (await objDL.GetDetail(objDto.SmsTemplateId)).ToList();
            }

            return Json(smsUrlDetails);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Delete([FromBody] UploadTemplate_DeleteDto objDto)
        {
            SmsTemplateUrl SmsTemplateUrl = new SmsTemplateUrl() { Id = objDto.SmsTemplateUrlId };
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs     
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "UploadTemplate", "Sms", "Delete", Helper.GetIP(), JsonConvert.SerializeObject(new { SmsTemplateUrlId = SmsTemplateUrlId }));
            //#endregion
            bool result = false;
            using (var objDL = DLSmsTemplateUrl.GetDLSmsTemplateUrl(domainDetails.AdsId, SQLProvider))
            {
                result = await objDL.Delete(SmsTemplateUrl);
                //if (result)
                //    LogMessage = "The sms template url has been deleted";
                //else
                //    LogMessage = "Unable to delete sms template url";
            }
            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), LogMessage);
            return Json(result);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> CreateTemplate([FromBody] UploadTemplate_CreateTemplateDto objDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            var objDL = DLSmsTemplate.GetDLSmsTemplate(domainDetails.AdsId, SQLProvider);
            SmsTemplate chksmstemplate = await objDL.GetDetailsByName(objDto.smsTemplate.Name);
            string TemplateName = "";
            if (chksmstemplate == null || (chksmstemplate != null && chksmstemplate.Id == objDto.smsTemplate.Id))
            {
                TemplateName = objDto.smsTemplate.Name;
                HttpContext.Session.SetString("TemplateData", JsonConvert.SerializeObject(objDto.smsTemplate));
                return Json(new { Status = true, TemplateName = TemplateName });
            }
            else { return Json(new { Status = false }); }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> DuplicateTemplate([FromBody] UploadTemplate_DuplicateTemplateDto objDto)
        {
            SmsTemplate smsTemplate = objDto.smsTemplateData;
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs    
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "DuplicateTemplate", "Sms", "Save Duplicate Template", Helper.GetIP(), JsonConvert.SerializeObject(new { smsTemplate = smsTemplate }));
            //#endregion

            using (var objDL = DLSmsTemplate.GetDLSmsTemplate(domainDetails.AdsId, SQLProvider))
            {
                smsTemplate = await objDL.GetDetails(smsTemplate.Id);

                if (smsTemplate != null && smsTemplate.Id > 0)
                {
                    List<SmsTemplateUrl> smsUrlDetailsUrl = null;
                    using (var objDLUrl = DLSmsTemplateUrl.GetDLSmsTemplateUrl(domainDetails.AdsId, SQLProvider))
                        smsUrlDetailsUrl = (await objDLUrl.GetDetail(smsTemplate.Id)).ToList();

                    string TemplateName = smsTemplate.Name + "_Copy_" + Helper.GenerateUniqueNumber();
                    if (TemplateName.Length > 50)
                        smsTemplate.Name = (smsTemplate.Name + "_Copy_" + Helper.GenerateUniqueNumber()).Substring(0, 50);
                    else
                        smsTemplate.Name = (smsTemplate.Name + "_Copy_" + Helper.GenerateUniqueNumber());

                    smsTemplate.Id = await objDL.Save(smsTemplate);

                    if (smsTemplate.Id > 0 && smsUrlDetailsUrl != null && smsUrlDetailsUrl.Count > 0)
                    {
                        using (var objDLURl = DLSmsTemplateUrl.GetDLSmsTemplateUrl(domainDetails.AdsId, SQLProvider))
                        {
                            for (int i = 0; i < smsUrlDetailsUrl.Count; i++)
                            {
                                smsUrlDetailsUrl[i].SmsTemplateId = smsTemplate.Id;
                                await objDLURl.SaveSmsTemplateUrl(smsUrlDetailsUrl[i]);
                            }
                        }
                    }
                }
            }
            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { smsTemplate = smsTemplate }), LogMessage);
            return Json(smsTemplate);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> CheckDTLFileFormat()
        {
            DomainInfo? domainInfo = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            int AccountId = domainInfo.AdsId;

            string message = string.Empty; bool status = false;
            try
            {
                var upload = this.Request.Form.Files[0];
                var fileName = Helper.GenerateUniqueNumber();
                var fileExtension = System.IO.Path.GetExtension(Request.Form.Files[0] != null ? Request.Form.Files[0].FileName : "").ToLower();
                if (fileExtension == ".csv" || fileExtension == ".xlsx")
                {
                    var filePath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "/TempFiles/" + fileName + fileExtension;
                    using var stream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.ReadWrite, bufferSize: 4096, useAsync: true);
                    await Request.Form.Files[0].CopyToAsync(stream);

                    DataSet dsExcelFields = Helper.ExcelOrCsvConnReadDs(filePath);
                    if (dsExcelFields != null && dsExcelFields.Tables.Count > 0 && dsExcelFields.Tables[0].Columns.Count > 0 && dsExcelFields.Tables[0].Rows.Count == 1)
                    {
                        SmsConfiguration smsConfiguration = null;
                        using (var bLSmsConfiguration = DLSmsConfiguration.GetDLSmsConfiguration(AccountId, SQLProvider))
                            smsConfiguration = await bLSmsConfiguration.GetActive();

                        if (smsConfiguration != null && !String.IsNullOrEmpty(smsConfiguration.DLTOperatorName))
                        {
                            SmsDLTConfiguration smsDLTConfiguration = null;
                            using (var bLSmsDLTConfiguration = DLSmsDLTConfiguration.GetDLSmsDLTConfiguration(SQLProvider))
                                smsDLTConfiguration = await bLSmsDLTConfiguration.GetOperatorData(smsConfiguration.DLTOperatorName);

                            if (smsDLTConfiguration != null)
                            {
                                string[] opratorcolumns = { smsDLTConfiguration.VendorTemplateId.ToLower(), smsDLTConfiguration.CommunicationType.ToLower(), smsDLTConfiguration.MessageContent.ToLower(), smsDLTConfiguration.SenderName.ToLower() };
                                List<string> filecolumns = new List<string>();
                                foreach (DataColumn col in dsExcelFields.Tables[0].Columns)
                                {
                                    filecolumns.Add(col.ToString().ToLower());
                                }

                                foreach (var operatcolumn in opratorcolumns)
                                {
                                    if (!filecolumns.Contains(operatcolumn.ToString().ToLower()))
                                    {
                                        status = false;
                                        message = $"The coloumn {operatcolumn.ToString().ToLower()} provided in the csv or xlsx file is not match with DLT operator configured";
                                        break;
                                    }
                                    else
                                    {
                                        status = true;
                                        message = $"The columns matched with DLT operator configured";
                                    }
                                }
                            }
                            else
                            {
                                status = false;
                                message = "No DLT operator configured";
                            }
                        }
                        else
                        {
                            status = false;
                            message = "No DLT operator configured";
                        }
                    }
                    else
                    {
                        status = false;
                        message = "No data or rows present more than one in the uploaded file, kindly upload a correct file";
                    }
                }
                else
                {
                    status = false;
                    message = "The uploaded file is not in the csv or xlsx format, kindly upload a correct file";
                }
            }
            catch (Exception ex)
            {
                status = false;
                message = ex.Message;
            }

            return Json(new { Message = message, Status = status });
        }

        [Log]
        [HttpPost]
        public async Task<ActionResult> ImportFile()
        {
            DomainInfo? domainInfo = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            int AccountId = domainInfo.AdsId;

            HttpContext.Session.SetString("MessageContent", JsonConvert.SerializeObject(null));
            string Message = ""; bool Status = false;
            string TemplateName = "";

            try
            {
                var upload = Request.Form.Files[0];
                var fileName = Request.Form.Files[0] != null ? Request.Form.Files[0].FileName : "";
                var fileExtension = System.IO.Path.GetExtension(Request.Form.Files[0] != null ? Request.Form.Files[0].FileName : "").ToLower();
                if (fileExtension == ".csv" || fileExtension == ".xlsx")
                {
                    var filePath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "/TempFiles/" + fileName;
                    using var stream = new FileStream(filePath, FileMode.Create);
                    await Request.Form.Files[0].CopyToAsync(stream);

                    DataSet dsExcelFields = Helper.ExcelOrCsvConnReadDs(filePath);
                    if (dsExcelFields != null && dsExcelFields.Tables.Count > 0 && dsExcelFields.Tables[0].Columns.Count > 0)
                    {
                        SmsConfiguration smsConfiguration = null;
                        using (var bLSmsConfiguration = DLSmsConfiguration.GetDLSmsConfiguration(AccountId, SQLProvider))
                            smsConfiguration = await bLSmsConfiguration.GetActive();
                        if (smsConfiguration != null && !String.IsNullOrEmpty(smsConfiguration.DLTOperatorName))
                        {
                            SmsDLTConfiguration smsDLTConfiguration = null;
                            using (var bLSmsDLTConfiguration = DLSmsDLTConfiguration.GetDLSmsDLTConfiguration(SQLProvider))
                                smsDLTConfiguration = await bLSmsDLTConfiguration.GetOperatorData(smsConfiguration.DLTOperatorName);

                            if (smsDLTConfiguration != null)
                            {
                                var messageContent = dsExcelFields.Tables[0].Rows[0][smsDLTConfiguration.MessageContent].ToString();
                                var VenderTemplatId = dsExcelFields.Tables[0].Rows[0][smsDLTConfiguration.VendorTemplateId].ToString();
                                var IsPromotionalOrTransactionalType = Convert.ToBoolean((dsExcelFields.Tables[0].Rows[0][smsDLTConfiguration.CommunicationType].ToString().ToLower().Contains("promo") ? 0 : 1));
                                var senderName = dsExcelFields.Tables[0].Rows[0][smsDLTConfiguration.SenderName].ToString();

                                if (HttpContext.Session.GetString("TemplateData") != null)
                                {
                                    SmsTemplate smsTemplate = JsonConvert.DeserializeObject<SmsTemplate>(HttpContext.Session.GetString("TemplateData"));
                                    TemplateName = smsTemplate.Name;
                                    smsTemplate.DLTUploadMessageFile = fileName;
                                    smsTemplate.VendorTemplateId = VenderTemplatId;
                                    smsTemplate.IsPromotionalOrTransactionalType = IsPromotionalOrTransactionalType;
                                    smsTemplate.Sender = senderName;

                                    HttpContext.Session.SetString("TemplateData", JsonConvert.SerializeObject(smsTemplate));
                                    HttpContext.Session.SetString("MessageContent", JsonConvert.SerializeObject(messageContent));
                                }
                                Status = true; Message = messageContent;
                            }
                            else
                            {
                                Message = "No DLT operator configured";
                                Status = false;
                            }
                        }
                        else
                        {
                            Message = "No DLT operator configured";
                            Status = false;
                        }
                    }
                    else
                    {
                        Message = "No record found or format is wrong";
                        Status = false;
                    }

                    return Json(new { Status = Status, Message = Message, TemplateName = (String.IsNullOrEmpty(TemplateName) ? "" : TemplateName) });
                }
                else
                {
                    return Json(new { Status = Status, Message = "File is not in correct format. upload csv or xlsx file." });
                }
            }

            catch (Exception ex)
            {
                //TrackLogs.UpdateLogs(LogId, "Unable to save file " + ex.ToString(), LogMessage);
                return Json(new { Status = false, Message = ex.Message });
            }
        }

        [Log]
        [HttpPost]
        public async Task<ActionResult> ImportFileForEdit([FromBody] UploadTemplate_ImportFileForEditDto objDto)
        {
            HttpContext.Session.SetString("TemplateData", JsonConvert.SerializeObject(null));
            HttpContext.Session.SetString("MessageContent", JsonConvert.SerializeObject(null));
            bool Status = false;

            SmsTemplate smsTemplate = null;
            using (var obj = DLSmsTemplate.GetDLSmsTemplate(objDto.AccountId, SQLProvider))
                smsTemplate = await obj.GetDetails(objDto.SmsTemplateId);
            if (smsTemplate != null)
            {
                HttpContext.Session.SetString("TemplateData", JsonConvert.SerializeObject(smsTemplate));
                HttpContext.Session.SetString("MessageContent", JsonConvert.SerializeObject(smsTemplate.MessageContent));

                Status = true;
            }
            return Json(new { Status = Status, TemplateName = (String.IsNullOrEmpty(smsTemplate.Name) ? "" : smsTemplate.Name) }); ;
        }


        [Log]
        [HttpPost]
        public async Task<ActionResult> CheckDLTRequired([FromBody] UploadTemplate_CheckDLTRequiredDto objDto)
        {
            var Status = false;
            SmsConfiguration promotionalSmsConfiguration = null;
            SmsConfiguration transactionalSmsConfiguration = null;

            using (var objDL = DLSmsConfiguration.GetDLSmsConfiguration(objDto.adsId, SQLProvider))
            {
                promotionalSmsConfiguration = await objDL.GetConfigurationDetailsForSending(false, IsDefaultProvider: true);

                transactionalSmsConfiguration = await objDL.GetConfigurationDetailsForSending(true, IsDefaultProvider: true);
            }

            if (promotionalSmsConfiguration != null)
            {
                if (promotionalSmsConfiguration.DLTRequired == true)
                    Status = true;
            }
            if (transactionalSmsConfiguration != null)
            {
                if (transactionalSmsConfiguration.DLTRequired == true)
                    Status = true;
            }
            return Json(new { Status = Status });
        }
    }
}
