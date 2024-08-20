using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.WhatsApp.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;

namespace Plumb5.Areas.WhatsApp.Controllers
{
    [Area("WhatsApp")]
    public class WhatsAppSettingsController : BaseController
    {
        public WhatsAppSettingsController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("WhatsAppSettings");
        }

        [HttpPost]
        public async Task<JsonResult> SaveOrUpdate([FromBody] WhatsAppSettings_SaveOrUpdateDto details)
        {
            int Ids = 0;
            using (var objBL = DLWhatsAppConfiguration.GetDLWhatsAppConfiguration(details.accountId, SQLProvider))
            {
                //objBL.TruncateWSPDetails();
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                details.WhatsAppConfigurationDetails.UserInfoUserId = user.UserId;
                if (details.WhatsAppConfigurationDetails.ApiKey == Convert.ToString(TempData["WhatsAppMaskedApiKey"]))
                    details.WhatsAppConfigurationDetails.ApiKey = TempData["WhatsAppApiKey"].ToString();
                if (details.WhatsAppConfigurationDetails.Id == 0)
                    Ids = await objBL.Save(details.WhatsAppConfigurationDetails, details.ConfigurationName);
                else
                    Ids = await objBL.update(details.WhatsAppConfigurationDetails, details.ConfigurationName);
            }
            return Json(Ids);
        }
        [HttpPost]
        public async Task<ActionResult> GetAllDetails([FromBody] WhatsAppSettings_GetAllDetailsDto details)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<MLWhatsAppConfiguration> WhatsAppConfigurationList = null;
            int cnt = 0;


            using (var objBL = DLWhatsAppConfiguration.GetDLWhatsAppConfiguration(details.accountId, SQLProvider))
            {
                WhatsAppConfigurationList = await objBL.GETWSPCongigureDetails();
            }

            return Json(WhatsAppConfigurationList);

        }
        [HttpPost]
        public ActionResult DeleteWSP([FromBody] WhatsAppSettings_DeleteWSPDto details)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            using (var objBL = DLWhatsAppConfiguration.GetDLWhatsAppConfiguration(details.accountId, SQLProvider))
            {

                objBL.TruncateWSPDetails();
                return Json(true);
                //id= objBL.Delete(WSPID);


            }

        }
        [HttpPost]
        public async Task<JsonResult> GetWhatsAppConfigurationDetails([FromBody] WhatsAppSettings_GetWhatsAppConfigurationDetailsDto details)
        {
            WhatsAppConfiguration whatsappConfigurationDetails = null;

            using (var objBL = DLWhatsAppConfiguration.GetDLWhatsAppConfiguration(details.accountId, SQLProvider))
            {
                whatsappConfigurationDetails = await objBL.GetConfigurationDetails(details.Id);
                int cnt = 0;

                if (whatsappConfigurationDetails != null)
                {
                    if (whatsappConfigurationDetails.ApiKey != null)
                    {
                        TempData["WhatsAppApiKey"] = whatsappConfigurationDetails.ApiKey;
                        cnt = whatsappConfigurationDetails.ApiKey.Length;
                        whatsappConfigurationDetails.ApiKey = whatsappConfigurationDetails.ApiKey.Substring(cnt).PadLeft(whatsappConfigurationDetails.ApiKey.Length, '*');
                        TempData["WhatsAppMaskedApiKey"] = whatsappConfigurationDetails.ApiKey;
                    }

                }
            }

            return Json(whatsappConfigurationDetails);
        }
        [HttpPost]
        public async Task<JsonResult> CheckWhatsAppSettingConfigured([FromBody] WhatsAppSettings_CheckWhatsAppSettingConfiguredDto details)
        {
            List<WhatsAppConfiguration> whatsappConfiguration = null;
            bool result = false;
            using (var objBL = DLWhatsAppConfiguration.GetDLWhatsAppConfiguration(details.accountId, SQLProvider))
            {
                whatsappConfiguration = await objBL.GetWhatsAppConfigurationDetails(new WhatsAppConfiguration { });

                if (whatsappConfiguration != null && whatsappConfiguration.Count > 0)
                    result = true;
                else
                    result = false;

                return Json(result);
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetConfiguredDeliveryURL()
        {
            var GeneralConfigurationSetting = new GeneralWhatsAppConfigurationSetting();
            return Json(GeneralConfigurationSetting);
        }
        public async Task<JsonResult> GetConfigurationNames([FromBody] WhatsAppSettings_GetConfigurationNamesDto details)
        {
            using (var objBL = DLWhatsAppConfigurationName.GetDLWhatsAppConfigurationName(details.accountId, SQLProvider))
            {
                return Json(await objBL.GetConfigurationNames());
            }
        }

        [HttpPost]
        public async Task<JsonResult> ArchiveVendorDetails([FromBody] WhatsAppSettings_ArchiveVendorDetailsDto details)
        {
            bool result = false;
            using (var objBL = DLWhatsAppConfiguration.GetDLWhatsAppConfiguration(details.accountId, SQLProvider))
            {
                result = await objBL.ArchiveVendorDetails(details.whatsappConfigurationNameId);
            }
            return Json(result);
        }
    }
}
