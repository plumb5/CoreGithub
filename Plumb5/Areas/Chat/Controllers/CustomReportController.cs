using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using System.Data;
using Plumb5GenralFunction;
using NPOI.SS.Formula.Functions;
using System.Globalization;
using System.Collections;
using System.Reflection;
using System.Text;
using Plumb5.Areas.CaptureForm.Dto;
using Org.BouncyCastle.Asn1.Ocsp;
using Plumb5.Areas.CaptureForm.Models;
using Plumb5.Areas.Chat.Dto;
namespace Plumb5.Areas.Chat.Controllers
{
    [Area("Chat")]
    public class CustomReportController : BaseController
    {
        public CustomReportController(IConfiguration _configuration) : base(_configuration)
        { }
        public IActionResult Index()
        {
            return View("CustomReport");
        }

        public async Task<JsonResult> IpAddress([FromBody] CustomReport_IpAddressDto CustomReportDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            List<ChatIpAddress> getIpAddress = null;
            using (var objDAL =   DLChatCustomeReport.GetDLChatCustomeReport(account.AdsId, SQLProvider))
            {
                getIpAddress = await objDAL.IpAddress(CustomReportDto.ChatId);
               
            }
            return Json(getIpAddress );
        }

        public async Task<JsonResult> GetCountOfSelecCamp([FromBody] CustomReport_GetCountOfSelecCampDto CustomReportDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            using (var objDAL = DLChatCustomeReport.GetDLChatCustomeReport(account.AdsId, SQLProvider))
            {
                return Json(await objDAL.GetCountOfSelecCamp(CustomReportDto.chatCustomReport) );
            }
        }

        public async Task<JsonResult> GetData([FromBody] CustomReport_GetDataDto CustomReportDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            DomainInfo account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            List<ChatCustomReportData> getCustomReport = null;
            ArrayList data = new ArrayList() { CustomReportDto.chatCustomReport }; 
            HttpContext.Session.SetString("ChatCustomResponses", JsonConvert.SerializeObject(data));
            CustomReportDto.chatCustomReport.UserId = user.UserId;

            using (var objDAL = DLChatCustomeReport.GetDLChatCustomeReport(account.AdsId, SQLProvider))
            {
                getCustomReport = await objDAL.GetData(CustomReportDto.chatCustomReport, CustomReportDto.OffSet, CustomReportDto.FetchNext);
            }
            return Json(getCustomReport);
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Export([FromBody] CustomReport_ChatExportDto CustomReportDto)
        {
            if (HttpContext.Session.GetString("UserInfo") != null) 
            {
                DomainInfo domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                System.Data.DataTable dtt = new System.Data.DataTable();

                // Create a DataSet and put both tables in it.
                System.Data.DataSet dataSet = new System.Data.DataSet("General");
                MLChatCustomeReport chatCustomReport = new MLChatCustomeReport();
                List<ChatAllResponsesForExport> getCustomReport = null;
                
                if (HttpContext.Session.GetString("ChatCustomResponses") != null)
                {
                    ArrayList data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("ChatCustomResponses"));  
                    chatCustomReport = (MLChatCustomeReport)data[0];
                }

                using (var objDAL = DLChatCustomeReport.GetDLChatCustomeReport(domainDetails.AdsId, SQLProvider))
                {
                    getCustomReport = await objDAL.ExportData(chatCustomReport, CustomReportDto.OffSet, CustomReportDto.FetchNext);
                }

                var NewListData = getCustomReport.Select(x => new
                {
                    x.Name,
                    x.EmailId,
                    x.PhoneNumber,
                    x.RecentDate,
                    x.City,
                    x.StateName,
                    x.Country,
                    x.IpAddress,
                    x.ChatText,
                    x.AgentName
                });

                dtt = NewListData.CopyToDataTable();
                dataSet.Tables.Add(dtt);

                string FileName = DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + CustomReportDto.FileType;

                string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                if (CustomReportDto.FileType == "csv")
                    Helper.SaveDataSetToCSV(dataSet, MainPath);
                else
                    Helper.SaveDataSetToExcel(dataSet, MainPath);

                MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;
                return Json(new { Status = true, MainPath } );
            }
            else
            {
                return Json(new { Status = false } );
            }
        }
    }
}
