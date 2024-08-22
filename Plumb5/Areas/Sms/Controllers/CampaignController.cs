using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Prospect.Dto;
using Plumb5.Areas.Sms.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;

namespace Plumb5.Areas.Sms.Controllers
{
    [Area("Sms")]
    public class CampaignController : BaseController
    {
        public CampaignController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("Campaign");
        }
        [HttpPost]
        public async Task<ActionResult> MaxCount([FromBody] Campaign_MaxCountDto objDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            int returnVal;
            using (var objDL = DLSmsCampaign.GetDLSmsCampaign(domainDetails.AdsId, SQLProvider))
            {
                returnVal = await objDL.MaxCount(objDto.smsCampaign);
            }
            return Json(new
            {
                returnVal
            });
        }


        [Log]
        [HttpPost]
        public async Task<JsonResult> SaveOrUpdateDetails([FromBody] Campaign_SaveOrUpdateDetailsDto objDto)
        {
            SmsCampaign smsCampaign = objDto.smsCampaignData;
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs     
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "Campaign", "Sms", "SaveOrUpdateDetails", Helper.GetIP(), JsonConvert.SerializeObject(new { smsCampaign = smsCampaign }));
            //#endregion
            if (smsCampaign.Id <= 0)
            {
                smsCampaign.UserInfoUserId = user.UserId;
                smsCampaign.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;

                using (var objDL = DLSmsCampaign.GetDLSmsCampaign(domainDetails.AdsId, SQLProvider))
                {
                    smsCampaign.Id = await objDL.Save(smsCampaign);
                    //if (smsCampaign.Id > 0)
                    //    LogMessage = "Campaign details has been Created successfully";
                    //else
                    //    LogMessage = "Campaign name has already exists.";
                }
            }
            else if (smsCampaign.Id > 0)
            {
                using (var objDL = DLSmsCampaign.GetDLSmsCampaign(domainDetails.AdsId, SQLProvider))
                {
                    if (!await objDL.Update(smsCampaign))
                    {
                        smsCampaign.Id = -1;
                        //LogMessage = "Unable to updated campaign details";
                    }
                    //else
                    //{
                    //    LogMessage = "Campaign details has been updated successfully";
                    //}
                }
            }
            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { MailCampaign = smsCampaign, UserName = user.UserName }), LogMessage);
            return Json(new { MailCampaign = smsCampaign, UserName = user.UserName });
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Delete([FromBody] Campaign_DeleteDto objDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs  
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(domainDetails.AdsId, user.UserId, user.UserName, user.EmailId, "Campaign", "Sms", "Delete", Helper.GetIP(), JsonConvert.SerializeObject(new { Id = Id }));
            //#endregion
            using (var objDL = DLSmsCampaign.GetDLSmsCampaign(domainDetails.AdsId, SQLProvider))
            {
                bool result = await objDL.Delete(objDto.Id);
                //if (result)
                //    LogMessage = "Campaign details has been deleted successfully";
                //else
                //    LogMessage = "Unable to delete campaign details ";

                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), LogMessage);
                return Json(result);
            }
        }

        [Log]
        [HttpPost]
        public async Task<ActionResult> ExportCampaignIdentifier([FromBody] Campaign_ExportCampaignIdentifierDto objDto)
        {
            System.Data.DataSet dataSet = new System.Data.DataSet("General");

            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            List<CampaignIdentifier> campaignDetails = null;
            CampaignIdentifier identifier = new CampaignIdentifier();
            if (HttpContext.Session.GetString("CampaignDetails") != null)
            {
                ArrayList data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("CampaignDetails"));
                identifier = JsonConvert.DeserializeObject<CampaignIdentifier>(data[0].ToString());
            }

            using (var objDL = DLCampaignIdentifier.GetDLCampaignIdentifier(objDto.AccountId, SQLProvider))
            {
                campaignDetails = await objDL.GetList(identifier, objDto.OffSet, objDto.FetchNext);
            }
            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(objDto.AccountId, SQLProvider);
            var NewListData = campaignDetails.Select(x => new
            {
                CampaignName = x.Name,
                Description = x.CampaignDescription,
                UpdatedOn = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.UpdatedDate.ToString())).ToString()
            });

            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTable();
            dataSet.Tables.Add(dtt);

            string FileName = "CampaignIdentifierReport_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + objDto.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (objDto.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath });
        }
    }
}
