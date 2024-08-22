using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Mail.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;

namespace Plumb5.Areas.Mail.Controllers
{
    [Area("Mail")]
    public class CampaignController : BaseController
    {
        public CampaignController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("Campaign");
        }


        [Log]
        [HttpPost]
        public async Task<JsonResult> ExportCampaignIdentifier([FromBody] Campaign_ExportCampaignIdentifierDto CampaignDto)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                CampaignIdentifier? identifier = new CampaignIdentifier();
                if (HttpContext.Session.GetString("CampaignDetails") != null)
                {
                    ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("CampaignDetails"));
                    identifier = JsonConvert.DeserializeObject<CampaignIdentifier>(Convert.ToString(data[0]));
                }

                List<CampaignIdentifier> campaignDetails = null;
                using (var objDL = DLCampaignIdentifier.GetDLCampaignIdentifier(CampaignDto.AccountId, SQLProvider))
                {
                    campaignDetails = (await objDL.GetList(identifier, CampaignDto.OffSet, CampaignDto.FetchNext)).ToList();
                }
                string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(CampaignDto.AccountId, SQLProvider);
                var NewListData = campaignDetails.Select(x => new
                {
                    x.Name,
                    x.CampaignDescription,
                    UpdatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(x.UpdatedDate)).ToString()
                });

                System.Data.DataSet dataSet = new System.Data.DataSet("General");
                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = NewListData.CopyToDataTableExport();
                dataSet.Tables.Add(dtt);

                string FileName = "Draft_" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + CampaignDto.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (CampaignDto.FileType.ToLower() == "csv")
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
