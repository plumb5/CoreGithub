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
    public class TemplateArchiveController : BaseController
    {
        public TemplateArchiveController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("TemplateArchive");
        }
        [HttpPost]
        public async Task<ActionResult> GetMaxCount([FromBody] TemplateArchive_GetMaxCountDto details)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            details.webpushTemplate.UserInfoUserId = user.UserId;
            int returnVal;
            using (var objDL = DLWebPushTemplate.GetDLWebPushTemplate(domainDetails.AdsId, SQLProvider))
            {
                returnVal = await objDL.GetArchiveMaxCount(details.webpushTemplate);
            }
            return Json(new
            {
                returnVal
            });
        }
        [HttpPost]
        public async Task<ActionResult> GetTemplateList([FromBody] TemplateArchive_GetTemplateListDto details)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            details.webpushTemplate.UserInfoUserId = user.UserId;
            ArrayList data = new ArrayList() { details.webpushTemplate };
            HttpContext.Session.SetString("webpushTemplate", JsonConvert.SerializeObject(data));

            WebPushTemplateDetails webpushTemplateDetails = new WebPushTemplateDetails(domainDetails.AdsId, SQLProvider);
            var Value = await webpushTemplateDetails.GetWebPushArchiveTemplateDetails(details.webpushTemplate, details.OffSet, details.FetchNext);

            var getdata = JsonConvert.SerializeObject(Value, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Restore([FromBody] TemplateArchive_RestoreDto details)
        {
            bool result = false;
            using (var objDL = DLWebPushTemplate.GetDLWebPushTemplate(details.accountId, SQLProvider))
            {
                result = await objDL.RestoreTemplate(details.Id);
                return Json(result);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Export([FromBody] TemplateArchive_ExportDto details)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");

                List<WebPushTemplate> webpushTemplateDetails = null;
                WebPushTemplate webpushTemplate = new WebPushTemplate();

                if (HttpContext.Session.GetString("webpushTemplatearchive") != null && HttpContext.Session.GetString("webpushTemplate") != "null")
                {
                    ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("webpushTemplatearchive"));
                    webpushTemplate = JsonConvert.DeserializeObject<WebPushTemplate>(data[0].ToString());
                }

                using (var objDL = DLWebPushTemplate.GetDLWebPushTemplate(domainDetails.AdsId, SQLProvider))
                {
                    webpushTemplateDetails = await objDL.GetAllArchiveTemplates(webpushTemplate, details.OffSet, details.FetchNext);
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

                string FileName = "WebPushArchiveTemplate" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + details.FileType;

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
    }
}
