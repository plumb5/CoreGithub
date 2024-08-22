using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.GoogleAds.Dto;
using Plumb5.Areas.GoogleAds.Models;
using Plumb5.Areas.ManageContact.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;

namespace Plumb5.Areas.GoogleAds.Controllers
{
    [Area("GoogleAds")]
    public class OverviewController : BaseController
    {
        public OverviewController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("Overview");
        }
        [HttpPost]
        public async Task<JsonResult> MaxCount([FromBody] Overview_MaxCountDto objDto)
        {
            DomainInfo? domainInfo = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            int returnVal;
            using (var objDL = DLGoogleImportSettings.GetDLGoogleImportSettings(domainInfo.AdsId,SQLProvider))
            {
                returnVal =await objDL.MaxCount(FromDateTime, ToDateTime, objDto.Groupname);
            }

            return Json(new
            {
                returnVal
            });
        }
        [HttpPost]
        public async Task<JsonResult> GetGoogleAds([FromBody] Overview_GetGoogleAdsDto objDto)
        {
            List<GooglList> g_list = new List<GooglList>();
            GoogleAdsConnector gad = new GoogleAdsConnector();
            g_list =await gad.GetAllList(objDto.AccountId, objDto.googleaccountsid,SQLProvider);
            return Json(g_list);
        }
        [HttpPost]
        public async Task<JsonResult> GetReportData([FromBody] Overview_GetReportDataDto objDto)
        {
            List<GoogleImportSettings> overviewDetails = null;
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);


            ArrayList data = new ArrayList() { objDto.Groupname };
            HttpContext.Session.SetString("GoogdAds", JsonConvert.SerializeObject(data));
            using (var objDL = DLGoogleImportSettings.GetDLGoogleImportSettings(objDto.accountId,SQLProvider))
            {
                overviewDetails =await objDL.GetOverviewDetails(FromDateTime, ToDateTime, objDto.OffSet, objDto.FetchNext, objDto.Groupname);
            }

            return Json(overviewDetails);
        }
        [HttpPost]
        public async Task<JsonResult> ExportGoogleAdsData([FromBody] Overview_ExportGoogleAdsDataDto objDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            List<GoogleImportSettings> overviewDetails = null;
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            System.Data.DataSet dataSet = new System.Data.DataSet("General");
            string Groupname = "";
            if (HttpContext.Session.GetString("GoogdAds") != null)
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("GoogdAds"));

                Groupname = Convert.ToString(data[0]);
            }
            using (var objDL = DLGoogleImportSettings.GetDLGoogleImportSettings(domainDetails.AdsId,SQLProvider))
            {
                overviewDetails =await objDL.GetOverviewDetails(FromDateTime, ToDateTime, objDto.OffSet, objDto.FetchNext, Groupname);
            }

            List<Groups> groupList = null;

            using (var objDL = P5GenralDL.DLGroups.GetDLGroups(domainDetails.AdsId,SQLProvider))
            {
                Groups group = new Groups();
                groupList =await objDL.GetGroupList(group);
            }
            string TimeZone =await Helper.GetAccountTimeZoneFromCachedMemory(domainDetails.AdsId,SQLProvider);
            var NewListData = overviewDetails.Select(x => new
            {
                GroupName = groupList.Where(p => p.Id == x.GroupId).Select(p => p.Name).FirstOrDefault(),
                GoogleAudienceName = x.GoogleAudienceName,
                TypeofExport = !x.IsRecurring ? "One-Time" : "Recurring",
                CreatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.CreatedDate)).ToString()
            });

            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTable();
            dataSet.Tables.Add(dtt);
            string FileName = "GoogleAdsReportData_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + objDto.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            //string MainPath = "E:/" + FileName;

            if (objDto.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }
        [HttpPost]
        public async Task<ActionResult> GetGroupsDetails([FromBody] GetGroupsDetailsDto objDto)
        {

            List<Groups> groupList = null;

            using (var objDL =P5GenralDL.DLGroups.GetDLGroups(objDto.AccountId,SQLProvider))
            {
                Groups group = new Groups();
                groupList =await objDL.GetGroupList(group);
            }

            return Json(groupList);
        }
        [HttpPost]
        public async Task<JsonResult> SaveOrUpdateDetails([FromBody] Overview_SaveOrUpdateDetailsDto objDto)
        {
            int Id = 0;
            string result = "0";
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            try
            {
                if (objDto.googleimportsettings != null)
                {
                    if (!string.IsNullOrEmpty(objDto.googleAudience) && !string.IsNullOrEmpty(objDto.googlediscription) && objDto.googlediscription != "" && objDto.googleAudience != "")
                    {
                        GoogleAdsConnector gad = new GoogleAdsConnector();
                        CreateGooglList audiencelist = new CreateGooglList();
                        Id = -1;
                        audiencelist =await gad.CreateList(objDto.accountId, objDto.Googleaccountid, objDto.googleAudience, objDto.googlediscription,SQLProvider);
                        if (audiencelist.Sucess)
                        {
                            objDto.googleimportsettings.GoogleGroupId = Convert.ToInt64(audiencelist.List);
                            objDto.googleimportsettings.GoogleAudienceName = objDto.googleAudience;
                        }
                        else
                            result = audiencelist.List;

                    }
                    if (objDto.googleimportsettings.GoogleGroupId > 0)
                    {
                        if (objDto.googleimportsettings.Id == 0)
                        {
                            using (var objBLSave = DLGoogleImportSettings.GetDLGoogleImportSettings(objDto.accountId,SQLProvider))
                            {
                                Id =await objBLSave.Save(objDto.googleimportsettings);
                                result = Id.ToString();
                            }
                        }
                        else
                        {
                            using (var objBLSave = DLGoogleImportSettings.GetDLGoogleImportSettings(objDto.accountId,SQLProvider))
                            {
                                Id =await objBLSave.Update(objDto.googleimportsettings);
                                result = Id.ToString();
                            }
                        }

                    }

                }


            }
            catch (Exception ex)
            {
                result = ex.ToString();
            }

            return Json(result);
        }
        [HttpPost]
        public async Task<JsonResult> GetGooglAccountSettingsDetails([FromBody] Overview_GetGooglAccountSettingsDetailsDto objDto)
        {
            List<GooglAccountSettings> GooglAccountSettingsData = null;


            using (var objDL = DLGooglAccountSettings.GetDLGooglAccountSettings(objDto.AdsId,SQLProvider))
            {
                GooglAccountSettingsData =await objDL.GetDetails(objDto.Id);
            }
            return Json(GooglAccountSettingsData);

        }
        [HttpPost]
        public async Task<JsonResult> DeleteGooglerecord([FromBody] Overview_DeleteGooglerecordDto objDto)
        {
            using (var objBL = DLGoogleImportSettings.GetDLGoogleImportSettings(objDto.accountId,SQLProvider))
            {
                return Json(await objBL.Delete(objDto.Id));
            }
        }
        [HttpPost]
        public async Task<JsonResult> ChangeStatusadwords([FromBody] Overview_ChangeStatusadwordsDto objDto)
        {
            using (var objBL = DLGoogleImportSettings.GetDLGoogleImportSettings(objDto.accountId,SQLProvider))
            {
                return Json(await objBL.ChangeStatusadwords(objDto.Id));
            }
        }
        [HttpPost]
        public async Task<JsonResult> ResponsesMaxCount([FromBody] Overview_ResponsesMaxCountDto objDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            int returnVal;
            using (var objDL = DLGoogleImportJobsResponse.GetDLGoogleImportJobsResponse(domainDetails.AdsId,SQLProvider))
            {
                returnVal =await objDL.ResponsesMaxCount(objDto.Googleimportsettingsid, FromDateTime, ToDateTime);
            }

            return Json(new
            {
                returnVal
            });
        }
        [HttpPost]
        public async Task<JsonResult> GetGoogleAdsResponses([FromBody] Overview_GetGoogleAdsResponsesDto objDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            List<GoogleImportJobsResponse> ResponsesDetails = null;
            using (var objDL = DLGoogleImportJobsResponse.GetDLGoogleImportJobsResponse(objDto.accountId,SQLProvider))
            {
                ResponsesDetails =await objDL.GetGoogleAdsResponses(objDto.Googleimportsettingsid, FromDateTime, ToDateTime, objDto.OffSet, objDto.FetchNext);
            }

            ArrayList data = new ArrayList() { objDto.Googleimportsettingsid };
            HttpContext.Session.SetString("GoogdAdsResponse", JsonConvert.SerializeObject(data));

            return Json(ResponsesDetails);
        }
        [HttpPost]
        public async Task<JsonResult> GetGoogleAdsResponseStatus([FromBody] Overview_GetGoogleAdsResponseStatusDto objDto)
        {
            string status = null;
            GoogleAdsConnector gad = new GoogleAdsConnector();
            status = gad.GetGoogleAccessToken(objDto.AccountId, objDto.googleresponsesname, objDto.GoogleGroupId);
            using (var objDLUpdate = DLGoogleImportJobsResponse.GetDLGoogleImportJobsResponse(objDto.AccountId,SQLProvider))
            {
                if (status != "")                
                    await objDLUpdate.Update(objDto.Id, status);
                  
            }
            return Json(status);
        }
        [HttpPost]
        public async Task<JsonResult> ExportGoogleAdsResponses([FromBody] Overview_ExportGoogleAdsResponsesDto objDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            DateTime FromDateTime = DateTime.ParseExact(objDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(objDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            System.Data.DataSet dataSet = new System.Data.DataSet("General");
            int Googleimportsettingsid = 0;
            if (HttpContext.Session.GetString("GoogdAdsResponse") != null)
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("GoogdAdsResponse"));
                Googleimportsettingsid = Convert.ToInt32(data[0]);
            }
            List<GoogleImportJobsResponse> ResponsesDetails = null;
            using (var objDL = DLGoogleImportJobsResponse.GetDLGoogleImportJobsResponse(domainDetails.AdsId,SQLProvider))
            {
                ResponsesDetails = await objDL.GetGoogleAdsResponses(Googleimportsettingsid, FromDateTime, ToDateTime, objDto.OffSet, objDto.FetchNext);
            }

            string TimeZone =await Helper.GetAccountTimeZoneFromCachedMemory(domainDetails.AdsId,SQLProvider);
            var NewListData = ResponsesDetails.Select(x => new
            {
                Resourcename = x.ResourceName,
                Status = x.Status,
                Date = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.CreatedDate)).ToString()
            });

            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTable();
            dataSet.Tables.Add(dtt);
            string FileName = "GoogleAdsResponseData_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + objDto.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            //string MainPath = "E:/" + FileName;

            if (objDto.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }
    }
}
