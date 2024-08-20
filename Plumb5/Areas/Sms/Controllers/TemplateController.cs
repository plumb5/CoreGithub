using Azure.Messaging;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Sms.Dto;
using Plumb5.Areas.Sms.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;


namespace Plumb5.Areas.Sms.Controllers
{
    [Area("Sms")]
    public class TemplateController : BaseController
    {
        public TemplateController(IConfiguration _configuration) : base(_configuration)
        { }
        public async Task<ActionResult> Index()
        {
            return View("Template");
        }
        [HttpPost]
        public async Task<JsonResult> GetSmsCampaign()
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            CampaignIdentifier smsCampaign = new CampaignIdentifier();
            var objDLform = DLCampaignIdentifier.GetDLCampaignIdentifier(domainDetails.AdsId, SQLProvider);
            List<CampaignIdentifier> SmsCampaignDetails = await objDLform.GetList(smsCampaign, 0, 0);
            return Json(SmsCampaignDetails);
        }
        [HttpPost]
        public async Task<ActionResult> GetMaxCount([FromBody] Template_GetMaxCountDto objDto)
        {
            SmsTemplate smsTemplate = objDto.smsTemplateData;
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            smsTemplate.UserInfoUserId = user.UserId;
            int returnVal;
            using (var objDL = DLSmsTemplate.GetDLSmsTemplate(domainDetails.AdsId, SQLProvider))
            {
                returnVal = await objDL.GetMaxCount(smsTemplate);
            }
            return Json(new
            {
                returnVal
            });
        }
        [HttpPost]
        public async Task<ActionResult> GetTemplateList([FromBody] Template_GetTemplateListDto objDto)
        {
            SmsTemplate smsTemplate = objDto.smsTemplateData;
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            smsTemplate.UserInfoUserId = user.UserId;

            ArrayList data = new ArrayList() { smsTemplate };
            HttpContext.Session.SetString("SmsTemplate", JsonConvert.SerializeObject(data));

            var smsTemplateDetails = new SmsTemplateDetails(domainDetails.AdsId);
            var Value = await smsTemplateDetails.GetSmsTemplateDetails(smsTemplate, objDto.OffSet, objDto.FetchNext, SQLProvider);

            var getdata = JsonConvert.SerializeObject(Value, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        [HttpPost]
        public async Task<ActionResult> GetTemplate([FromBody] Template_GetTemplateDto objDto)
        {
            SmsTemplate smsTemplate = null;
            using (var objDL = DLSmsTemplate.GetDLSmsTemplate(objDto.accountId, SQLProvider))
            {
                smsTemplate = await objDL.GetTemplateArchive(objDto.TemplateName);
            }

            var getdata = JsonConvert.SerializeObject(smsTemplate, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> UpdateTemplateStatus([FromBody] Template_UpdateTemplateStatusDto objDto)
        {
            bool result = false;

            using (var objDL = DLSmsTemplate.GetDLSmsTemplate(objDto.accountId, SQLProvider))
            {
                result = await objDL.UpdateTemplateStatus(objDto.TemplateId);
            }

            return Json(result);
        }
        [HttpPost]
        public async Task<JsonResult> GetTemplateDetails([FromBody] Template_GetTemplateDetailsDto objDto)
        {
            SmsTemplate smstemplateData = null;
            if (objDto.smsTemplate != null && objDto.smsTemplate.Id > 0)
            {
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

                var objDL = DLSmsTemplate.GetDLSmsTemplate(domainDetails.AdsId, SQLProvider);
                smstemplateData = await objDL.GetDetails(objDto.smsTemplate.Id);

                smstemplateData.MessageContent = System.Web.HttpUtility.HtmlDecode(smstemplateData.MessageContent);
            }

            return Json(smstemplateData);
        }
        [HttpPost]
        public async Task<JsonResult> GetAllTemplate([FromBody] Template_GetAllTemplateDto objDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            var objDL = DLSmsTemplate.GetDLSmsTemplate(domainDetails.AdsId, SQLProvider);
            List<SmsTemplate> smstemplateList = (await objDL.GetAllTemplate(user.UserId, UserInfoUserIdList, user.IsSuperAdmin)).ToList();

            return Json(smstemplateList);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Delete([FromBody] Template_DeleteDto objDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs  
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "Template", "Sms", "Delete", Helper.GetIP(), JsonConvert.SerializeObject(new { Id = Id }));
            //#endregion
            SmsTemplateUrl smstemplaterUrl = new SmsTemplateUrl();
            smstemplaterUrl.SmsTemplateId = objDto.Id;
            var obj = DLSmsTemplateUrl.GetDLSmsTemplateUrl(domainDetails.AdsId, SQLProvider);
            bool result = false;

            SmsTemplate smsTemplateDetails;
            using (var objDL = DLSmsTemplate.GetDLSmsTemplate(domainDetails.AdsId, SQLProvider))
            {
                smsTemplateDetails = await objDL.GetDetails(objDto.Id);
            }

            using (var objDL = DLSmsTemplate.GetDLSmsTemplate(domainDetails.AdsId, SQLProvider))
            {
                result = await objDL.Delete(objDto.Id);
                await obj.Delete(smstemplaterUrl);
                //if (result)
                //    LogMessage = "The sms template '" + smsTemplateDetails.Name + "' has been deleted";
                //else
                //    LogMessage = "Unable to delete the sms template '" + smsTemplateDetails.Name + "'";
                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), LogMessage);
                return Json(result);
            }
        }



        [Log]
        [HttpPost]
        public async Task<JsonResult> Export([FromBody] Template_ExportDto objDto)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");

                SmsTemplate smsTemplate = new SmsTemplate();

                if (HttpContext.Session.GetString("SmsTemplate") != null)
                {
                    ArrayList data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("SmsTemplate"));
                    smsTemplate = JsonConvert.DeserializeObject<SmsTemplate>(data[0].ToString());
                }

                SmsTemplateDetails TemplateDetails = new SmsTemplateDetails(objDto.AccountId);
                var Details = await TemplateDetails.GetSmsTemplateDetails(smsTemplate, objDto.OffSet, objDto.FetchNext, SQLProvider);
                string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(objDto.AccountId, SQLProvider);

                var NewListData = Details.Select(x => new
                {
                    x.TemplateName,
                    x.TemplateDescription,
                    x.CampaignName,
                    ContentType = x.IsPromotionalOrTransactionalType ? "Transactional" : "Promotional",
                    x.MessageContent,
                    CreatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.CreatedDate)).ToString()
                });



                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = NewListData.CopyToDataTable();
                dataSet.Tables.Add(dtt);

                string FileName = "SMSTemplate" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + objDto.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (objDto.FileType.ToLower() == "csv")
                    Helper.SaveDataSetToCSV(dataSet, MainPath);
                else
                    Helper.SaveDataSetToExcel(dataSet, MainPath);

                MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

                return Json(new { Status = true, MainPath });
            }
            else
            {
                return Json(new { Status = false });
            }
        }
        [HttpPost]
        public async Task<JsonResult> CheckCounselorTags([FromBody] Template_CheckCounselorTagsDto objDto)
        {
            bool result = false;
            string MessageContent = "";
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            var objDL = DLSmsTemplate.GetDLSmsTemplate(domainDetails.AdsId, SQLProvider);
            SmsTemplate smstemplate = await objDL.GetDetails(objDto.smsTemplate.Id);

            MessageContent = System.Web.HttpUtility.HtmlDecode(smstemplate.MessageContent);

            if (MessageContent.Contains("[{*Signatory") && MessageContent.Contains("*}]"))
            {
                result = true;
            }

            return Json(result);
        }
    }
}
