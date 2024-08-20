using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using Plumb5.Areas.MyProfile.Dto;
using Plumb5.Controllers;
using Plumb5.Models;
using System.Data;

namespace Plumb5.Areas.MyProfile.Controllers
{
    [Area("MyProfile")]
    public class ApiKeyController : BaseController
    {
        public ApiKeyController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> GetApiKey([FromBody] ApiKey_GetApiKeyDto details)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                try
                {
                    using (var objAccount = DLAccountNew.GetDLAccountNew(SQLProvider))
                    {
                        DataSet ds = await objAccount.SelectApikey(details.UserId);
                        var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
                        if (ds.Tables[0].Rows[0]["ApiKey"].ToString() == "")
                        {
                            getdata = "0";
                        }
                        return Content(getdata.ToString(), "application/json");
                    }
                }
                catch
                {
                    return null;
                }
            }
            return Redirect("~/Login");
        }
        [HttpPost]
        public async Task<JsonResult> Developers([FromBody] ApiKey_DevelopersDto details)
        {
            MyAccountsDetails myAccount = new MyAccountsDetails(SQLProvider);
            await myAccount.GetInformationForHome(details.UserId);
            return Json(new { myAccount = myAccount });
        }

        [Log]
        [HttpPost]
        public async Task<IActionResult> UpdateApiKey([FromBody] ApiKey_UpdateApiKeyDto details)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                string ApiKey = Guid.NewGuid().ToString().Replace("-", "b5e");
                try
                {
                    using (var objAccount = DLAccountNew.GetDLAccountNew(SQLProvider))
                    {
                        var ds = await objAccount.UpdateApikey(details.UserId, ApiKey);
                        var getdata = JsonConvert.SerializeObject(ApiKey, Formatting.Indented);
                        return Content(getdata.ToString(), "application/json");
                    }
                }
                catch
                {
                    return null;
                }
            }
            return Redirect("~/Login");
        }
    }
}
