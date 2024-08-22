using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Prospect.Dto;
using Plumb5.Areas.Prospect.Models;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Text.RegularExpressions;

namespace Plumb5.Areas.Prospect.Controllers
{
    [Area("Prospect")]
    public class PublisherController : BaseController
    {
        public PublisherController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /Prospect/Publisher/
        public IActionResult  Index(string value)
        {
            value = value.Replace('~', '+');
            string decryptedvalue = EncryptDecrypt.Decrypt(value.ToString());
            ViewBag.DocumentationProvider = decryptedvalue;
            TempData["Lmscustompublisherfields"] = ViewBag.DocumentationProvider;
            return View("Publisher");
        }

        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] PublisherDto_GetMaxCount commonDetails)
        {
            //string Lmscustompublisherfields= Convert.ToString(TempData["Lmscustompublisherfields"]);
            int LmsCount = 0;

            //filterLead.GetType().GetProperty(Lmscustompublisherfields.Split('~')[1]).SetValue(filterLead, Lmscustompublisherfields.Split('~')[2], null);
            using (var objDL = DLLmsCustomReport.GetDLLmsCustomReport(commonDetails.AccountId, SQLProvider))
            {
                LmsCount = await objDL.GetMaxCount(commonDetails.filterLead, commonDetails.publishertype);
            }

            return Json(LmsCount);
        }

        [HttpPost]
        public async Task<JsonResult> GetReport([FromBody] PublisherDto_GetReport commonDetails)
        {
            List<MLLeadsDetails> customReports = new List<MLLeadsDetails>();
            ArrayList exportdata = new ArrayList() { commonDetails.filterLead, commonDetails.IsMaskRequired, commonDetails.publishertype };

            HttpContext.Session.SetString("LmsPublisherData", JsonConvert.SerializeObject(exportdata));

            using (var objDL = DLLmsCustomReport.GetDLLmsCustomReport(commonDetails.AccountId, SQLProvider))
            {
                customReports = await objDL.GetLeadsWithContact(commonDetails.filterLead, commonDetails.OffSet, commonDetails.FetchNext, commonDetails.publishertype);
            }
            if (commonDetails.IsMaskRequired)
            {
                customReports = (from item in customReports
                                 let email = item.EmailId = String.IsNullOrEmpty(item.EmailId) ? "NA" : Regex.Replace(item.EmailId, @"(?<=[\w]{2})[\w-\._\+%]*(?=[\w]{0}@)", m => new string('*', m.Length))
                                 let phonenumber = item.PhoneNumber = String.IsNullOrEmpty(item.PhoneNumber) ? "NA" : Regex.Replace(item.PhoneNumber, @".(?=.{4,}$)", m => new string('*', m.Length))
                                 select item).ToList();
            }


            return Json(customReports);
        }

        [HttpPost]
        public async Task<JsonResult> LeadsPublisherExport([FromBody] PublisherDto_LeadsPublisherExport commonDetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                List<MLLeadsDetails> customReports = new List<MLLeadsDetails>();
                LmsCustomReport filterLead = new LmsCustomReport();
                bool IsMaskRequired = false;
                int publishertype = 0;
                if (HttpContext.Session.GetString("LmsPublisherData") != null)
                {
                    ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("LmsPublisherData"));
                    filterLead = JsonConvert.DeserializeObject<LmsCustomReport>(data[0].ToString()); 
                    IsMaskRequired = (bool)data[1];
                    publishertype = (int)data[2];
                }

                using (var objDL = DLLmsCustomReport.GetDLLmsCustomReport(commonDetails.AccountId, SQLProvider))
                {
                    customReports = await objDL.GetLeadsWithContact(filterLead, commonDetails.OffSet, commonDetails.FetchNext, publishertype);
                }

                List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
                string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(commonDetails.AccountId, SQLProvider);
                List<LmsStage> lmsStageList = new List<LmsStage>();
                using (var objStage = DLLmsStage.GetDLLmsStage(commonDetails.AccountId, SQLProvider))
                {
                    lmsStageList = await objStage.GetAllList();
                }

                if (IsMaskRequired)
                {
                    customReports = (from item in customReports
                                     let email = item.EmailId = String.IsNullOrEmpty(item.EmailId) ? "NA" : Regex.Replace(item.EmailId, @"(?<=[\w]{2})[\w-\._\+%]*(?=[\w]{0}@)", m => new string('*', m.Length))
                                     let phonenumber = item.PhoneNumber = String.IsNullOrEmpty(item.PhoneNumber) ? "NA" : Regex.Replace(item.PhoneNumber, @".(?=.{4,}$)", m => new string('*', m.Length))
                                     select item).ToList();
                }

                LmsExport exporttoexceldetails = new LmsExport();
                await exporttoexceldetails.PublisherExport(commonDetails.AccountId, customReports, userHierarchy, commonDetails.FileType, null);


                return Json(new { Status = true, exporttoexceldetails.MainPath });

            }
            else
            {
                return Json(new { Status = false });
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetPropertySetting([FromBody] PublisherDto_GetPropertySetting commonDetails)
        {
            List<MLContactFieldEditSetting> ContactFieldSettingList;
            using (var objBL = DLContactFieldEditSetting.GetDLContactFieldEditSetting(commonDetails.AccountId, SQLProvider))
            {
                ContactFieldSettingList = await objBL.GetFullList();
            }

            return Json(ContactFieldSettingList);
        }

        [HttpPost]
        public async Task<JsonResult> GetIsPublisherColumn([FromBody] PublisherDto_GetIsPublisherColumn commonDetails)
        {
            List<MLContactFieldEditSetting> IsSearchbyColumns = new List<MLContactFieldEditSetting>();
            using (var objBL = DLContactFieldEditSetting.GetDLContactFieldEditSetting(commonDetails.AccountId, SQLProvider))
            {
                var SearchbyColumns = await objBL.GetMLIsPublisher();
                if (SearchbyColumns != null)
                    IsSearchbyColumns.AddRange(SearchbyColumns);
            }

            using (var objDL = DLLmsCustomFields.GetDLLmsCustomFields(commonDetails.AccountId, SQLProvider))
            {
                var lmsSearhbyColumns = await objDL.GetMLIsPublisher();
                if (lmsSearhbyColumns != null)
                    IsSearchbyColumns.AddRange(lmsSearhbyColumns);
            }

            return Json(IsSearchbyColumns);
        }
    }
}
