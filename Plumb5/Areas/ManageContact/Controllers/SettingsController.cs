using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.ManageContact.Dto;
using Plumb5.Areas.ManageUsers.Dto;
using Plumb5.Controllers;

namespace Plumb5.Areas.ManageContact.Controllers
{
    [Area("ManageContact")]
    public class SettingsController : BaseController
    {
        public SettingsController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("Settings");
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Save([FromBody] Settings_SaveDto objDto)
        {
            ContactMergeConfiguration settingsdata = objDto.settings;
            int Id = -1;
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            settingsdata.UserInfoUserId = user != null ? user.UserId : 0;

            using (var objDL = DLContactMergeConfiguration.GetDLContactMergeConfiguration(objDto.AccountId, SQLProvider))
                Id =await objDL.Save(settingsdata);

            return Json(Id);
        }
        [HttpPost]
        public async Task<JsonResult> GetSettingDetails([FromBody] Settings_GetSettingDetailsDto objDto)
        {
            using (var objDL = DLContactMergeConfiguration.GetDLContactMergeConfiguration(objDto.AccountId, SQLProvider))
            {
                ContactMergeConfiguration contactMergeConfiguration =await objDL.GetSettingDetails();
                return Json(new { contactMergeConfiguration = contactMergeConfiguration });
            }
        }
    }
}
