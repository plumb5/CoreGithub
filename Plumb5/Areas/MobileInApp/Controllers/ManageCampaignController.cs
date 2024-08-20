using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.MobileInApp.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Data;
using System.Globalization;

namespace Plumb5.Areas.MobileInApp.Controllers
{
    [Area("MobileInApp")]
    public class ManageCampaignController : BaseController
    {
        public ManageCampaignController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /MobileInApp/ManageCampaign/

        public IActionResult Index()
        {
            return View("ManageCampaign");
        }

        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] ManageCampaign_GetMaxCount commonDetails)
        {
            DateTime FromDate = DateTime.ParseExact(commonDetails.fromdate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(commonDetails.todate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            int returnVal;
            using (var objDL = DLMobileInAppCampaign.GetDLMobileInAppCampaign(commonDetails.AccountId, SQLProvider))
            {
                returnVal = await objDL.GetMaxCount(FromDate, ToDate, commonDetails.Name);
            }
            return Json(new { returnVal });
        }

        [HttpPost]
        public async Task<JsonResult> GetReportData([FromBody] ManageCampaign_GetReportData commonDetails)
        {
            DateTime FromDate = DateTime.ParseExact(commonDetails.fromdate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDate = DateTime.ParseExact(commonDetails.todate, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<MobileInAppCampaign> mobileInAppCampaign = new List<MobileInAppCampaign>();
            HttpContext.Session.SetString("MobileInAppCampaignName", commonDetails.Name);

            using (var objDL = DLMobileInAppCampaign.GetDLMobileInAppCampaign(commonDetails.AccountId, SQLProvider))
            {
                mobileInAppCampaign = await objDL.GetAllInAppCampaigns(FromDate, ToDate, commonDetails.OffSet, commonDetails.FetchNext, commonDetails.Name);
            }
            return Json(mobileInAppCampaign);
        }

        [HttpPost]
        public async Task<JsonResult> DeleteCampaign([FromBody] ManageCampaign_DeleteCampaign commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            using (var objDL = DLMobileInAppCampaign.GetDLMobileInAppCampaign(commonDetails.AccountId, SQLProvider))
            {
                bool result;
                result = await objDL.Delete(commonDetails.Id);
                return Json(result);
            }
        }

        [HttpPost]
        public async Task<JsonResult> ChangePriority([FromBody] ManageCampaign_ChangePriority commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            if (commonDetails.campaigndetails != null && commonDetails.campaigndetails.Count() > 0)
            {
                for (int i = 0; i < commonDetails.campaigndetails.Count(); i++)
                {
                    using (var objDL = DLMobileInAppCampaign.GetDLMobileInAppCampaign(commonDetails.AccountId, SQLProvider))
                    {
                        await objDL.ChangePriority(commonDetails.campaigndetails[i].Id, commonDetails.campaigndetails[i].Priority);
                    }
                }
            }
            return Json(true);
        }

        [HttpPost]
        public async Task<JsonResult> ToogleStatus([FromBody] ManageCampaign_ToogleStatus commonDetails)
        {
            using (var objDLCamp = DLMobileInAppCampaign.GetDLMobileInAppCampaign(commonDetails.AccountId, SQLProvider))
            {
                bool result;
                result = await objDLCamp.ToogleCampaignStatus(commonDetails.inappCampaign);
                return Json(result);
            }
        }

        [HttpPost]
        public async Task<JsonResult> ExportInappManageCampaign([FromBody] ManageCampaign_ExportInappManageCampaign commonDetails)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DataSet dataSet = new DataSet();
                MobileInAppCampaign campaignDetails = new MobileInAppCampaign();
                List<MobileInAppCampaign> campaignDetailsList = new List<MobileInAppCampaign>();

                DateTime FromDate = DateTime.ParseExact(commonDetails.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                DateTime ToDate = DateTime.ParseExact(commonDetails.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

                string? Name = null;
                if (HttpContext.Session.GetString("MobileInAppCampaignName") != null)
                    Name = Convert.ToString(HttpContext.Session.GetString("MobileInAppCampaignName"));


                string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(commonDetails.AccountId, SQLProvider);
                using (var objDL = DLMobileInAppCampaign.GetDLMobileInAppCampaign(commonDetails.AccountId, SQLProvider))
                {
                    campaignDetailsList = await objDL.GetAllInAppCampaigns(FromDate, ToDate, commonDetails.OffSet, commonDetails.FetchNext, Name);
                }

                var NewListData = campaignDetailsList.Select(x => new
                {
                    Name = x.Name,
                    Status = x.Status,
                    Type = x.InAppCampaignType,
                    CreatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, x.CreatedDate.Value)
                });

                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = NewListData.CopyToDataTableExport();
                dataSet.Tables.Add(dtt);

                string FileName = "InappCampaign_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;
                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (commonDetails.FileType.ToLower() == "csv")
                    Helper.SaveDataSetToCSV(dataSet, MainPath);
                else
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
