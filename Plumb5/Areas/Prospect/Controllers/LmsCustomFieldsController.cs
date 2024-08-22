using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Prospect.Dto;
using Plumb5.Controllers;

namespace Plumb5.Areas.Prospect.Controllers
{
    [Area("Prospect")]
    public class LmsCustomFieldsController : BaseController
    {
        public LmsCustomFieldsController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<JsonResult> SaveLmsCustomFields([FromBody] LmsCustomFields_SaveLmsCustomFieldsDto objDto)
        {
            using (var objBL = DLLmsCustomFields.GetDLLmsCustomFields(objDto.accountId, SQLProvider))
            {

                if (objDto.LmsCustomFields != null && objDto.LmsCustomFields.Count > 0)
                {
                    objBL.Delete();
                    for (int i = 0; i < objDto.LmsCustomFields.Count; i++)
                    {
                        await objBL.SaveProperty(objDto.LmsCustomFields[i]);
                    }
                }
                //  objBL.SaveLmsCustomFields(LmsCustomFields);
            }
            return Json(new { success = true, message = "Data Saved successfully" });
        }
        [HttpPost]
        public async Task<JsonResult> GetLmsCustomFields([FromBody] LmsCustomFields_GetLmsCustomFieldsDto objDto)
        {

            List<LmsCustomFields> LmsCustomFields = null;
            using (var objBL = DLLmsCustomFields.GetDLLmsCustomFields(objDto.accountId,SQLProvider))
            {
                LmsCustomFields =await objBL.GetPurgeSettings();
            }

            return Json(LmsCustomFields);
        }
    }
}
