using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;
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
    public class ManageTaggedFormsController : BaseController
    {
        public ManageTaggedFormsController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            ViewBag.AdsId = account.AdsId;
            return View("ManageTaggedForms");
        }

        [HttpPost]
        public async Task<IActionResult> GetMaxCount([FromBody] ManageTaggedForms_GetMaxCountDto commomdetails)
        {
            int returnVal;
            using (var objDL = DLFormScripts.GetDLFormScripts(commomdetails.accountId, SQLProvider))
            {
                returnVal = await objDL.GetMaxCount(commomdetails.formScripts);
            }
            return Json(new { returnVal });
        }

        [HttpPost]
        public async Task<IActionResult> GetAllDetails([FromBody] ManageTaggedForms_GetAllDetailsDto commonDetails)
        {
            List<MLFormScripts> listDetails = new List<MLFormScripts>();

            ArrayList data = new ArrayList() { commonDetails.formScripts };
            HttpContext.Session.SetString("TaggedFormDetails", JsonConvert.SerializeObject(data));

            using (var objDL = DLFormScripts.GetDLFormScripts(commonDetails.accountId, SQLProvider))
            {
                listDetails = await objDL.Get(commonDetails.formScripts, commonDetails.OffSet, commonDetails.FetchNext);
            }

            var getdata = JsonConvert.SerializeObject(listDetails, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ToogleStatus([FromBody] ManageTaggedForms_ToogleStatusDto commonDetails)
        {
            using (var objDL = DLFormScripts.GetDLFormScripts(commonDetails.accountId, SQLProvider))
            {
                bool result;
                result = await objDL.ToogleStatus(commonDetails.Id, commonDetails.FormScriptStatus);
                return Json(result);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Delete([FromBody] ManageTaggedForms_DeleteDto commonDetails)
        {
            using (var objDL = DLFormScripts.GetDLFormScripts(commonDetails.accountId, SQLProvider))
            {
                bool result;
                result = await objDL.Delete(commonDetails.Id);

                return Json(result);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> TaggedFormsExport([FromBody] ManageTaggedForms_TaggedFormsExportDto commonDetails)
        {
            DataSet dataSet = new DataSet();
            List<MLFormScripts> listDetails = new List<MLFormScripts>();
            MLFormScripts formScripts = new MLFormScripts();

            if (HttpContext.Session.GetString("TaggedFormDetails") != null)
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("TaggedFormDetails"));
                formScripts = (MLFormScripts)data[0];
            }

            using (var objDL = DLFormScripts.GetDLFormScripts(commonDetails.AccountId, SQLProvider))
            {
                listDetails = await objDL.Get(formScripts, commonDetails.OffSet, commonDetails.FetchNext);
            }

            var NewListData = listDetails.Select(x => new
            {
                FormIdentifier = x.FormIdentifier,
                PageUrl = x.PageUrl,
                AlternatePageUrls = x.AlternatePageUrls,
                Status = x.FormScriptStatus == true ? "Active" : "In-Active",
                UpdatedDate = x.UpdatedDate
            });

            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTableExport();
            dataSet.Tables.Add(dtt);

            string FileName = "TaggedFormDetails_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
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
        public async Task<JsonResult> UpdateAlternateUrl([FromBody] ManageTaggedForms_UpdateAlternateUrlDto commonDetails)
        {
            using (var objDL = DLFormScripts.GetDLFormScripts(commonDetails.accountId, SQLProvider))
            {
                bool result;
                result = await objDL.UpdateAlternateUrl(commonDetails.FormId, commonDetails.AlternatePageUrls);
                return Json(result);
            }
        }
    }
}
