using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Sms.Dto;
using Plumb5.Areas.WhatsApp.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Globalization;
namespace Plumb5.Areas.WhatsApp.Controllers
{
    [Area("WhatsApp")]
    public class CampaignController : BaseController
    {
        public CampaignController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /WhatsApp/Campaign/

        public IActionResult Index()
        {
            return View("Campaign");
        }

        public async Task<ActionResult> MaxCount([FromBody] WhatsAppCampaign_MaxCountDto CampaignDto)
        {
             
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
             
            int returnVal;
            using (var objBL = DLWhatsAppCampaign.GetDLWhatsAppCampaign(domainDetails.AdsId,SQLProvider))
            {
                returnVal = await objBL.MaxCount(CampaignDto.WhatsAppCampaign);
            }
            return Json(new
            {
                returnVal
            });
        }



        [Log]
        public async Task<JsonResult> SaveOrUpdateDetails([FromBody] WhatsAppCampaign_SaveOrUpdateDetailsDto CampaignDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
             

            if (CampaignDto.WhatsAppCampaign.Id <= 0)
            {
                CampaignDto.WhatsAppCampaign.UserInfoUserId = user.UserId;
                CampaignDto.WhatsAppCampaign.UserGroupId = user.UserGroupIdList != null && user.UserGroupIdList.ToArray().Length > 0 ? user.UserGroupIdList.ToArray()[0] : 0;

                using (var objDL =   DLWhatsAppCampaign.GetDLWhatsAppCampaign(domainDetails.AdsId,SQLProvider))
                {
                    CampaignDto.WhatsAppCampaign.Id =await objDL.Save(CampaignDto.WhatsAppCampaign);

                }
            }
            else if (CampaignDto.WhatsAppCampaign.Id > 0)
            {
                using (var objDL = DLWhatsAppCampaign.GetDLWhatsAppCampaign(domainDetails.AdsId, SQLProvider))
                {
                    if (!await objDL.Update(CampaignDto.WhatsAppCampaign))
                    {
                        CampaignDto.WhatsAppCampaign.Id = -1;
                        //LogMessage = "Unable to updated campaign details";
                    }
                    //else
                    //{
                    //    LogMessage = "Campaign details has been updated successfully";
                    //}
                }
            }
            //TrackLogs.UpdateLogs(LogId, JsonConvert.SerializeObject(new { MailCampaign = WhatsAppCampaign, UserName = user.UserName }), LogMessage);
            return Json(new { MailCampaign = CampaignDto.WhatsAppCampaign, UserName = user.UserName } );
        }

        [Log]
        public async Task<JsonResult> Delete([FromBody] WhatsAppCampaign_DeleteDto CampaignDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));


            using (var objDL = DLWhatsAppCampaign.GetDLWhatsAppCampaign(domainDetails.AdsId, SQLProvider))
            {
                bool result = await objDL.Delete(CampaignDto.Id);

                return Json(result);
            }
        }

        [Log]
        public async Task<ActionResult> ExportCampaignIdentifier([FromBody] WhatsAppCampaign_ExportCampaignIdentifierDto CampaignDto)
        {
            System.Data.DataSet dataSet = new System.Data.DataSet("General"); 
             
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<int> UserInfoUserIdList = (user.Members != null && user.Members.Count > 0) ? user.Members.Select(x => x.UserInfoUserId).ToList<int>() : null;
            List<CampaignIdentifier> campaignDetails = null;
            CampaignIdentifier identifier = new CampaignIdentifier();
            if (HttpContext.Session.GetString("CampaignDetails") != null )
            {
                ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("CampaignDetails"));
                
                identifier = JsonConvert.DeserializeObject<CampaignIdentifier>(data[0].ToString()); 
            }

            using (var objBL =   DLCampaignIdentifier.GetDLCampaignIdentifier(CampaignDto.AccountId,SQLProvider))
            {
                campaignDetails = await objBL.GetList(identifier, CampaignDto.OffSet, CampaignDto.FetchNext);
            }
            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(CampaignDto.AccountId,SQLProvider);
            var NewListData = campaignDetails.Select(x => new
            {
                CampaignName = x.Name,
                Description = x.CampaignDescription,
                UpdatedOn = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.UpdatedDate.ToString())).ToString()
            });

            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt = NewListData.CopyToDataTable();
            dataSet.Tables.Add(dtt);

            string FileName = "CampaignIdentifierReport_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + CampaignDto.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            if (CampaignDto.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath } );
        }

    }
}

