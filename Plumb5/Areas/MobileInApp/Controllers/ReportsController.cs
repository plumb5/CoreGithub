using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.MobileInApp.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Data;
using System.Globalization;
using System.Net;

namespace Plumb5.Areas.MobileInApp.Controllers
{
    [Area("MobileInApp")]
    public class ReportsController : BaseController
    {
        public ReportsController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /MobileInApp/Reports/

        #region In App Responses
        public IActionResult Index()
        {
            return View("InAppResponses");
        }

        [HttpPost]
        public async Task<JsonResult> GetMobileInAppCampaign([FromBody] Reports_GetMobileInAppFormCampaign commonDetails)
        {
            using (var objDL = DLMobileInAppCampaign.GetDLMobileInAppCampaign(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDL.GetMobileInAppCampaign());
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetInAppResponsesMaxCount([FromBody] Reports_GetInAppResponsesMaxCount commonDetails)
        {
            DateTime FromDate = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var objDL = DLMobileInAppResponses.GetDLMobileInAppResponses(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDL.GetMaxCount(FromDate, ToDate, commonDetails.InAppCampaignName));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetInAppResponsesReport([FromBody] Reports_GetInAppResponsesReport commonDetails)
        {
            List<MobileInAppCampaign> mobileInAppCampaign = new List<MobileInAppCampaign>();

            DateTime FromDate = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            ArrayList data = new ArrayList() { FromDate, ToDate, commonDetails.InAppCampaignName };

            HttpContext.Session.SetString("InAppResponses", JsonConvert.SerializeObject(data));

            using (var objDL = DLMobileInAppResponses.GetDLMobileInAppResponses(commonDetails.accountId, SQLProvider))
            {
                mobileInAppCampaign = await objDL.GetInAppResponsesReport(FromDate, ToDate, commonDetails.OffSet, commonDetails.FetchNext, commonDetails.InAppCampaignName);
            }
            return Json(mobileInAppCampaign);
        }

        [HttpPost]
        public async Task<JsonResult> InAppResponsesExport(int AccountId, string FromDateTime, string TodateTime, int OffSet, int FetchNext, string FileType)
        {
            DataSet dataSet = new DataSet();
            List<MobileInAppCampaign> mobileInAppCampaigns = new List<MobileInAppCampaign>();
            string InAppCampaignName = "";
            DateTime FromDate = new DateTime(), ToDate = new DateTime();

            if (HttpContext.Session.GetString("InAppResponses") != null)
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("InAppResponses"));
                FromDate = Convert.ToDateTime(data[0]);
                ToDate = Convert.ToDateTime(data[1]);
                InAppCampaignName = Convert.ToString(data[2]);
            }
            using (var objDL = DLMobileInAppCampaign.GetDLMobileInAppCampaign(AccountId, SQLProvider))
            {
                mobileInAppCampaigns = await objDL.GetAllInAppCampaigns(FromDate, ToDate, OffSet, FetchNext, InAppCampaignName);
            }
            var NewListData = mobileInAppCampaigns.Select(x => new
            {
                x.Name,
                x.ImpressionCount,
                x.ResponseCount,
                x.ClosedCount,
                ConversionRate = x.ImpressionCount > 0 ? (x.ResponseCount / x.ImpressionCount) * 100 : 0,
                x.CreatedDate
            });
            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTableExport();
            dataSet.Tables.Add(dtt);

            string FileName = "MobileInAppResponses_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }
        #endregion

        #region Form Responses
        public IActionResult FormResponses()
        {
            return View("FormResponses");
        }

        [HttpPost]
        public async Task<JsonResult> GetMobileInAppFormCampaign([FromBody] Reports_GetMobileInAppFormCampaign commonDetails)
        {
            using (var objDL = DLMobileInAppCampaign.GetDLMobileInAppCampaign(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDL.GetMobileInAppFormCampaign());
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetFormResponsesMaxCount([FromBody] Reports_GetFormResponsesMaxCount commonDetails)
        {
            DateTime FromDate = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var objDL = DLMobileInAppFormResponses.GetDLMobileInAppFormResponses(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDL.MaxCount(FromDate, ToDate, commonDetails.InAppCampaignId));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetFormResponsesReport([FromBody] Reports_GetFormResponsesReport commonDetails)
        {
            List<MobileInAppFormResponses> mobileInAppForms = new List<MobileInAppFormResponses>();

            DateTime FromDate = DateTime.ParseExact(commonDetails.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(commonDetails.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            ArrayList data = new ArrayList() { FromDate, ToDate, commonDetails.InAppCampaignId };
            HttpContext.Session.SetString("FormResponses", JsonConvert.SerializeObject(data));

            using (var objDL = DLMobileInAppFormResponses.GetDLMobileInAppFormResponses(commonDetails.accountId, SQLProvider))
            {
                mobileInAppForms = await objDL.GetDetails(commonDetails.OffSet, commonDetails.FetchNext, FromDate, ToDate, commonDetails.InAppCampaignId);
            }
            return Json(mobileInAppForms);
        }

        [HttpPost]
        public async Task<JsonResult> UpdateIsNew([FromBody] Reports_UpdateIsNew commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            using (var objDL = DLMobileInAppFormResponses.GetDLMobileInAppFormResponses(commonDetails.AdsId, SQLProvider))
            {
                bool result = await objDL.UpdateIsNew(commonDetails.Id, commonDetails.isNew);
                return Json(result);
            }
        }

        [HttpPost]
        public async Task<JsonResult> FormResponsesExport([FromBody] Reports_FormResponsesExport commonDetails)
        {
            DataSet dataSet = new DataSet();
            List<MobileInAppFormResponses> mobileInAppForms = new List<MobileInAppFormResponses>();
            int InAppCampaignId = 0;
            DateTime FromDate = new DateTime(), ToDate = new DateTime();

            if (HttpContext.Session.GetString("InAppResponses") != null)
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("InAppResponses"));
                FromDate = Convert.ToDateTime(data[0]);
                ToDate = Convert.ToDateTime(data[1]);
                InAppCampaignId = Convert.ToInt32(data[2]);
            }
            using (var objDL = DLMobileInAppFormResponses.GetDLMobileInAppFormResponses(commonDetails.AccountId, SQLProvider))
            {
                mobileInAppForms = await objDL.GetDetails(commonDetails.OffSet, commonDetails.FetchNext, FromDate, ToDate, InAppCampaignId);
            }
            var NewListData = mobileInAppForms.Select(x => new
            {
                x.Field1,
                x.TrackIp,
                x.ResponseDate
            });
            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTableExport();
            dataSet.Tables.Add(dtt);

            string FileName = "MobileInAppResponses_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (commonDetails.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
            return Json(new { Status = true, MainPath });
        }
        #endregion

        [HttpPost]
        public async Task<JsonResult> GetFields([FromBody] Reports_GetFields commonDetails)
        {
            List<MobileInAppFormFields> formFields = new List<MobileInAppFormFields>();

            using (var objFormField = DLMobileInAppFormFields.GetDLMobileInAppFormFields(commonDetails.AccountId, SQLProvider))
            {
                formFields = await objFormField.GET(commonDetails.InAppCampaignId);

                if (formFields != null && formFields.Count() > 0)
                {
                    int PhoneNumberFieldIndex = -1;

                    if (formFields.Any(x => x.FieldType == 3))
                        PhoneNumberFieldIndex = formFields.Select((field, index) => new { field, index }).First(x => x.field.FieldType == 3).index;

                    if (PhoneNumberFieldIndex > -1)
                        formFields[PhoneNumberFieldIndex].PhoneValidationType = WebUtility.HtmlDecode(formFields[PhoneNumberFieldIndex].PhoneValidationType);
                }
            }

            return Json(new { formFields = formFields });
        }
    }
}
