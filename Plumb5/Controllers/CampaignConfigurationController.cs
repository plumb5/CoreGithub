using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Dto;
using System.Collections;

namespace Plumb5.Controllers
{
    public class CampaignConfigurationController : BaseController
    {
        public CampaignConfigurationController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /Configuration/

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult CampaignIdentifier()
        {
            return View("CampaignIdentifier");
        }

        public async Task<JsonResult> GetCampaignIdentifierMaxCount([FromBody] CampaignConfiguration_GetCampaignIdentifierMaxCountDto CampaignConfigurationDto)
        {
            using (var objDL =  DLCampaignIdentifier.GetDLCampaignIdentifier(CampaignConfigurationDto.accountId, SQLProvider))
            {
                int count = await objDL.MaxCount(CampaignConfigurationDto.identifier);
                return Json(count);
            }
        }

        public async Task<JsonResult> GetCampaignIdentifierDetails([FromBody] CampaignConfiguration_GetCampaignIdentifierDetailsDto CampaignConfigurationDto)
        {
            ArrayList data = new ArrayList() { CampaignConfigurationDto.identifier };

            HttpContext.Session.SetString("CampaignDetails", JsonConvert.SerializeObject(data)); 
            List<CampaignIdentifier> campaignDetails = null;
            using (var objDL = DLCampaignIdentifier.GetDLCampaignIdentifier(CampaignConfigurationDto.accountId, SQLProvider))
            {
                campaignDetails = await objDL.GetList(CampaignConfigurationDto.identifier, CampaignConfigurationDto.OffSet, CampaignConfigurationDto.FetchNext);
            }

            return Json(campaignDetails);
        }



        public async Task<JsonResult> CampaignIdentifierSaveOrUpdateDetails([FromBody] CampaignConfiguration_CampaignIdentifierSaveOrUpdateDetailsDto CampaignConfigurationDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            CampaignConfigurationDto.identifier.UserInfoUserId = user.UserId;
            CampaignConfigurationDto.identifier.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;
            //#region Logs  
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(accountId, user.UserId, user.UserName, user.EmailId, "CampaignConfiguration", "CampaignConfiguration", "CampaignIdentifierSaveOrUpdateDetails", Helper.GetIP(), JsonConvert.SerializeObject(new { CampaignIdentifier = identifier }));
            //#endregion
            if (CampaignConfigurationDto.identifier.Id > 0)
            {
                using (var objDL = DLCampaignIdentifier.GetDLCampaignIdentifier(CampaignConfigurationDto.accountId, SQLProvider))
                {
                    if (!await objDL.Update(CampaignConfigurationDto.identifier))
                    {
                        CampaignConfigurationDto.identifier.Id = -1;
                        //LogMessage = "Unable to update the campaign '" + identifier.Name + "'";
                    }
                    //else
                    //    LogMessage = "The campiagn '" + identifier.Name + "' has been updated";
                }
            }
            else
            {
                CampaignConfigurationDto.identifier.UserInfoUserId = user.UserId;
                using (var objDL = DLCampaignIdentifier.GetDLCampaignIdentifier(CampaignConfigurationDto.accountId, SQLProvider))
                {
                    CampaignConfigurationDto.identifier.Id = await objDL.Save(CampaignConfigurationDto.identifier);
                    //if (identifier.Id > 0)
                    //    LogMessage = "The campiagn '" + identifier.Name + "' has been created";
                    //else
                    //    LogMessage = "Unable to create the campaign '" + identifier.Name + "'";
                }
            }
            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { CampaignIdentifier = identifier, UserName = user.UserName }), LogMessage);
            return Json(CampaignConfigurationDto.identifier);
        }

        public async Task<JsonResult> CampaignIdentifierToogleStatus([FromBody] CampaignConfiguration_CampaignIdentifierToogleStatusDto CampaignConfigurationDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(accountId, user.UserId, user.UserName, user.EmailId, "CampaignConfiguration", "CampaignConfiguration", "CampaignIdentifierToogleStatus", Helper.GetIP(), JsonConvert.SerializeObject(new { CampaignIdentifier = identifier }));
            //#endregion
            using (var objDL =  DLCampaignIdentifier.GetDLCampaignIdentifier(CampaignConfigurationDto.accountId,SQLProvider))
            {
                bool result = await objDL.ToogleStatus(CampaignConfigurationDto.identifier);
                //if (result)
                //    LogMessage = "The campaign status has been changed for '" + identifier.Name + "'";
                //else
                //    LogMessage = "Unable to change a campaign status for '" + identifier.Name + "'";
                //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), LogMessage);
                return Json(result);
            }
        }

        public async Task<JsonResult> CampaignIdentifierArchive([FromBody] CampaignConfiguration_CampaignIdentifierArchiveDto CampaignConfigurationDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            //#region Logs
            //string LogMessage = string.Empty;
            //Int64 LogId = TrackLogs.SaveLog(accountId, user.UserId, user.UserName, user.EmailId, "CampaignConfiguration", "CampaignConfiguration", "CampaignIdentifierArchive", Helper.GetIP(), JsonConvert.SerializeObject(new { CampaignIdentifierId = Id }));
            //#endregion
            CampaignIdentifier identifier;
            using (var objDL = DLCampaignIdentifier.GetDLCampaignIdentifier(CampaignConfigurationDto.accountId, SQLProvider))
            {
                identifier = await objDL.Get(new CampaignIdentifier() { Id = CampaignConfigurationDto.Id });
            }

            bool result;
            using (var objDL = DLCampaignIdentifier.GetDLCampaignIdentifier(CampaignConfigurationDto.accountId, SQLProvider))
            {
                result = await objDL.Archive(CampaignConfigurationDto.Id);
            }
            //if (result)
            //    LogMessage = "The campaign '" + identifier.Name + "' has been deleted";
            //else
            //    LogMessage = "Unable to delete the campaign '" + identifier.Name + "'";
            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { result = result }), LogMessage);
            return Json(result);
        }
    }
}

