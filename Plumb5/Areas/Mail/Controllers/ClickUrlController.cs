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
    public class ClickUrlController : BaseController
    {
        public ClickUrlController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("ClickUrl");
        }

        [HttpPost]
        public async Task<JsonResult> MaxCount([FromBody] ClickUrl_MaxCountDto ClickUrlDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            int returnVal;
            using (var objDL = DLMailClickUrl.GetDLMailClickUrl(domainDetails.AdsId, SQLProvider))
            {
                returnVal = await objDL.MaxCount(ClickUrlDto.mailSendingSettingId);
            }
            return Json(new
            {
                returnVal
            });
        }

        [HttpPost]
        public async Task<JsonResult> GetResponseData([FromBody] ClickUrl_GetResponseDataDto ClickUrlDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            List<MLMailClickUrl> responsedetails = null;
            HttpContext.Session.SetString("ClickUrl", JsonConvert.SerializeObject(ClickUrlDto.mailSendingSettingId));
            using (var objDL = DLMailClickUrl.GetDLMailClickUrl(domainDetails.AdsId, SQLProvider))
            {
                responsedetails = (await objDL.GetResponseData(ClickUrlDto.mailSendingSettingId, ClickUrlDto.OffSet, ClickUrlDto.FetchNext)).ToList();
            }
            return Json(responsedetails);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Export([FromBody] ClickUrl_ExportDto ClickUrlDto)
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");
                List<MLMailClickUrl> responsedetails = null;
                MLMailClickUrl mailSendingSettingId = new MLMailClickUrl();

                if (HttpContext.Session.GetString("ClickUrl") != null)
                {
                    mailSendingSettingId = JsonConvert.DeserializeObject<MLMailClickUrl>(HttpContext.Session.GetString("ClickUrl"));
                }

                using (var objDL = DLMailClickUrl.GetDLMailClickUrl(domainDetails.AdsId, SQLProvider))
                {
                    responsedetails = (await objDL.GetResponseData(mailSendingSettingId, ClickUrlDto.OffSet, ClickUrlDto.FetchNext)).ToList();
                }

                var NewListData = responsedetails.Select(x => new
                {
                    x.ClickURL,
                    x.TotalClick,
                    x.TotalUniqueClick
                });

                System.Data.DataTable dtt = new System.Data.DataTable();
                dtt = NewListData.CopyToDataTable();
                dataSet.Tables.Add(dtt);

                string FileName = DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + ClickUrlDto.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

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
