using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.WebPush.Dto;
using Plumb5.Areas.WebPush.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;

namespace Plumb5.Areas.WebPush.Controllers
{
    [Area("WebPush")]
    public class TemplateController : BaseController
    {
        public TemplateController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("Template");
        }
        [HttpPost]
        public async Task<JsonResult> GetCampaignList([FromBody] Template_GetCampaignListDto details)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            using (var objDL = DLCampaignIdentifier.GetDLCampaignIdentifier(domainDetails.AdsId, SQLProvider))
            {
                return Json(await objDL.GetList(new CampaignIdentifier(), 0, 0));
            }
        }
        [HttpPost]
        public async Task<ActionResult> GetMaxCount([FromBody] Template_GetMaxCountDto details)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            details.webpushTemplate.UserInfoUserId = user.UserId;
            int returnVal;
            using (var objDL = DLWebPushTemplate.GetDLWebPushTemplate(domainDetails.AdsId, SQLProvider))
            {
                returnVal = await objDL.GetMaxCount(details.webpushTemplate);
            }
            return Json(new
            {
                returnVal
            });
        }
        [HttpPost]
        public async Task<ActionResult> GetTemplateList([FromBody] Template_GetTemplateListDto details)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            details.webpushTemplate.UserInfoUserId = user.UserId;
            ArrayList data = new ArrayList() { details.webpushTemplate };
            HttpContext.Session.SetString("webpushTemplate", JsonConvert.SerializeObject(data));

            WebPushTemplateDetails webpushTemplateDetails = new WebPushTemplateDetails(domainDetails.AdsId, SQLProvider);
            var Value =await webpushTemplateDetails.GetWebPushTemplateDetails(details.webpushTemplate, details.OffSet, details.FetchNext);

            var getdata = JsonConvert.SerializeObject(Value, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        [HttpPost]
        public async Task<JsonResult> GetTemplateDetails([FromBody] Template_GetTemplateDetailsDto details)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            WebPushTemplate webpush = null;
            using (var objDL = DLWebPushTemplate.GetDLWebPushTemplate(domainDetails.AdsId, SQLProvider))
            {
                webpush = await objDL.GetDetails(details.webpushTemplate);
            }
            return Json(webpush);
        }
        [HttpPost]
        public async Task<JsonResult> GetAllTemplate([FromBody] Template_GetAllTemplateDto details)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;

            List<WebPushTemplate> webpushTemplateList = null;
            using (var objDL = DLWebPushTemplate.GetDLWebPushTemplate(domainDetails.AdsId, SQLProvider))
            {
                webpushTemplateList = await objDL.GetAllTemplates(details.webpushTemplate, details.OffSet, details.FetchNext);
            }
            return Json(webpushTemplateList);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Delete([FromBody] Template_DeleteDto details)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs  
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "Template", "Sms", "Delete", Helper.GetIP(), JsonConvert.SerializeObject(new { Id = Id }));
            //#endregion
            bool result = false;


            using (var objDL = DLWebPushTemplate.GetDLWebPushTemplate(domainDetails.AdsId, SQLProvider))
            {
                result = await objDL.Delete(details.Id);
                //if (result)
                //    LogMessage = "The template has been deleted";
                //else
                //    LogMessage = "Unable to delete the template";
                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), LogMessage);
                return Json(result);
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetArchiveTemplate([FromBody] Template_GetArchiveTemplateDto details)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            WebPushTemplate webPushTemplate = null;
            using (var objDL = DLWebPushTemplate.GetDLWebPushTemplate(domainDetails.AdsId, SQLProvider))
            {
                webPushTemplate = await objDL.GetArchiveTemplate(details.TemplateName);
            }
            return Json(new { Template = webPushTemplate });
        }
        [HttpPost]
        public async Task<JsonResult> UpdateArchiveStatus([FromBody] Template_UpdateArchiveStatusDto details)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            bool result = false;
            using (var objDL = DLWebPushTemplate.GetDLWebPushTemplate(domainDetails.AdsId, SQLProvider))
            {
                result = await objDL.UpdateArchiveStatus(details.Id);
            }
            return Json(result);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Export([FromBody] Template_ExportDto details)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");

                List<WebPushTemplate> webpushTemplateDetails = null;
                WebPushTemplate webpushTemplate = new WebPushTemplate();

                try
                {
                    if (HttpContext.Session.GetString("webpushTemplate") != null && HttpContext.Session.GetString("webpushTemplate")!="null")
                    {
                        ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("webpushTemplate"));                       
                        webpushTemplate = JsonConvert.DeserializeObject<WebPushTemplate>(data[0].ToString());
                    }
                }
                catch (Exception ex)
                {
                    return Json(ex);
                }

                using (var objDL = DLWebPushTemplate.GetDLWebPushTemplate(domainDetails.AdsId, SQLProvider))
                {
                    webpushTemplateDetails = await objDL.GetAllTemplates(webpushTemplate, details.OffSet, details.FetchNext);
                }

                string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(details.AccountId, SQLProvider);
                var NewListData = webpushTemplateDetails.Select(x => new
                {
                    x.TemplateName,
                    x.MessageContent,
                    x.TemplateDescription,
                    x.OnClickRedirect,
                    x.Button1_Label,
                    x.Button1_Redirect,
                    x.Button2_Label,
                    x.Button2_Redirect,
                    x.IsAutoHide,
                    x.IsCustomBadge,
                    CreatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.CreatedDate)).ToString()
                });

                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = NewListData.CopyToDataTable();
                dataSet.Tables.Add(dtt);

                string FileName = DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

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
        public async Task<JsonResult> CheckCounselorTags([FromBody] Template_CheckCounselorTagsDto details)
        {
            bool result = false;
            string MessageContent = "", TitleContent = "";
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            var objDL = DLWebPushTemplate.GetDLWebPushTemplate(domainDetails.AdsId, SQLProvider);
            WebPushTemplate pushTemplate = await objDL.GetDetails(details.webpushTemplate);

            MessageContent = System.Web.HttpUtility.HtmlDecode(pushTemplate.MessageContent);
            TitleContent = System.Web.HttpUtility.HtmlDecode(pushTemplate.Title);

            if ((MessageContent.Contains("[{*Signatory") && MessageContent.Contains("*}]")) || (TitleContent.Contains("[{*Signatory") && TitleContent.Contains("*}]")))
            {
                result = true;
            }

            return Json(result);
        }
    }
}
