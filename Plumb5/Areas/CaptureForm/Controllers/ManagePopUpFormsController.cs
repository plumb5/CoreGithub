using Microsoft.AspNetCore.Mvc;
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
    public class ManagePopUpFormsController : BaseController
    {
        public ManagePopUpFormsController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /CaptureForm/ManagePopUpForms/

        public IActionResult Index()
        {
            DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            ViewBag.AdsId = account.AdsId;
            return View("ManagePopUpForms");
        }

        [HttpPost]
        public async Task<IActionResult> GetMaxCount([FromBody] ManagePopUpForms_GetMaxCount commonDetails)
        {
            commonDetails.formDetails.EmbeddedFormOrPopUpFormOrTaggedForm = "PopUpForm";

            int returnVal;
            using (var objDL = DLFormDetails.GetDLFormDetails(commonDetails.accountId, SQLProvider))
            {
                returnVal = await objDL.GetMaxCount(commonDetails.formDetails, null, null);
            }
            return Json(new { returnVal });
        }

        [HttpPost]
        public async Task<IActionResult> GetAllDetails([FromBody] ManagePopUpForms_GetAllDetails commonDetails)
        {
            commonDetails.formDetails.EmbeddedFormOrPopUpFormOrTaggedForm = "PopUpForm";

            List<FormDetails> formDetailsList = null;

            ArrayList data = new ArrayList() { commonDetails.formDetails };
            HttpContext.Session.SetString("AllForms", JsonConvert.SerializeObject(data));

            using (var objDL = DLFormDetails.GetDLFormDetails(commonDetails.accountId, SQLProvider))
            {
                formDetailsList = await objDL.GET(commonDetails.formDetails, commonDetails.OffSet, commonDetails.FetchNext, null, null, false, null, null, null, null);
            }

            var getdata = JsonConvert.SerializeObject(formDetailsList, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Delete([FromBody] ManagePopUpForms_Delete commonDetails)
        {
            using (var objDL = DLFormDetails.GetDLFormDetails(commonDetails.accountId, SQLProvider))
            {
                bool result;
                result = await objDL.Delete(commonDetails.Id);

                return Json(result);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ToogleStatus([FromBody] ManagePopUpForms_ToogleStatus commonDetails)
        {
            using (var objDL = DLFormDetails.GetDLFormDetails(commonDetails.accountId, SQLProvider))
            {
                bool result;
                result = await objDL.ToogleStatus(commonDetails.formDetails);
                return Json(result);
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> CopyFormDetails([FromBody] ManagePopUpForms_CopyFormDetails commonDetails)
        {
            int newFormId = 0;
            using var objcreateform = new DuplicateFormCreation(commonDetails.accountId, SQLProvider);
            newFormId = await objcreateform.CreateDuplicate(commonDetails.Id);
            return Json(newFormId);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> ChangePriority([FromBody] ManagePopUpForms_ChangePriority commonDetails)
        {

            if (commonDetails.formdetails != null && commonDetails.formdetails.Count() > 0)
            {
                for (int i = 0; i < commonDetails.formdetails.Count(); i++)
                {
                    using (var objDL = DLFormDetails.GetDLFormDetails(commonDetails.AccountId, SQLProvider))
                    {
                        bool result = await objDL.ChangePriority(commonDetails.formdetails[i].Id, commonDetails.formdetails[i].FormPriority);
                    }
                }
            }
            return Json(true);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> PopUpFormsExport([FromBody] ManagePopUpForms_PopUpFormsExport commonDetails)
        {

            DataSet dataSet = new DataSet();
            FormDetails formDetails = new FormDetails();
            List<FormDetails> formDetailsList = new List<FormDetails>();

            if (HttpContext.Session.GetString("AllForms") != null)
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("AllForms"));
                formDetails = JsonConvert.DeserializeObject<FormDetails>(Convert.ToString(data[0]));
            }

            using (var objDL = DLFormDetails.GetDLFormDetails(commonDetails.AccountId, SQLProvider))
            {
                formDetailsList = await objDL.GET(formDetails, commonDetails.OffSet, commonDetails.FetchNext, null, null, false, null, null, null, null);
            }

            var NewListData = formDetailsList.Select(x => new
            {
                Name = x.Heading,
                FormIdentifier = x.FormIdentifier,
                SubHeading = x.SubHeading,
                FormType = x.FormType == 1 ? "Lead Generation" : x.FormType == 2 ? "Custom HTML" : x.FormType == 3 ? "Custom IFRAMES" : x.FormType == 4 ? "Custom Banner" : x.FormType == 5 ? "Video" : "",
                FormStatus = x.FormStatus == true ? "Active" : "InActive",
                UpdatedDate = x.UpdatedDate
            });

            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTableExport();
            dataSet.Tables.Add(dtt);

            string FileName = "PopUpFormDetails_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }
    }
}
