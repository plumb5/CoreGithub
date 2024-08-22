using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.ManageContact.Dto;
using Plumb5.Controllers;

namespace Plumb5.Areas.ManageContact.Controllers
{
    [Area("ManageContact")]
    public class GoogleAdWordsController : BaseController
    {
        public GoogleAdWordsController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<JsonResult> SaveGoogleadWordsImportData([FromBody] GoogleAdWords_SaveGoogleadWordsImportDataDto details)
        {
            int Ids = 0;
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            using (var objBL = DLGoogleAdWordsImportData.GetDLGoogleAdWordsImportData(details.accountId, SQLProvider))
            {
                details.GoogleAdwords.MappingFields = "[" + details.GoogleAdwords.MappingFields + "]";
                details.GoogleAdwords.MappingLmscustomFields = "[" + details.GoogleAdwords.MappingLmscustomFields + "]";
                if (details.Action.ToLower() == "save")
                    Ids = await objBL.Save(details.GoogleAdwords);
                else
                {
                    details.GoogleAdwords.Id = details.Id;
                    Ids = details.Id;
                }
                return Json(Ids);
            }
        }
        [HttpPost]
        public async Task<JsonResult> GetadwordsDetails([FromBody] GoogleAdWords_GetadwordsDetailsDto details)
        {
            List<GoogleAdWordsImportData> GoogleAdWordsImportData = null;
            using (var objDL = DLGoogleAdWordsImportData.GetDLGoogleAdWordsImportData(details.accountId, SQLProvider))
            {
                GoogleAdWordsImportData = await objDL.GetDetails();
            }
            return Json(GoogleAdWordsImportData);
        }
        [HttpPost]
        public async Task<JsonResult> ChangeStatusadwords([FromBody] GoogleAdWords_ChangeStatusadwordsDto details)
        {
            int returnVal;
            using (var objBL = DLGoogleAdWordsImportData.GetDLGoogleAdWordsImportData(details.AccountId, SQLProvider))
            {
                returnVal = await objBL.ChangeStatusadwords(details.Id);
            }
            return Json(new
            {
                returnVal
            });
        }

        [HttpPost]
        public async Task<JsonResult> DeleteadwordsData([FromBody] GoogleAdWords_DeleteadwordsDataDto details)
        {
            using (var objLmsLeads = DLGoogleAdWordsImportData.GetDLGoogleAdWordsImportData(details.AccountId, SQLProvider))
            {
                return Json(await objLmsLeads.DeleteadwordsData(details.Id));
            }
        }
    }
}
