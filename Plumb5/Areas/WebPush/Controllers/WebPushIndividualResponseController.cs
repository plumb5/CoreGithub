using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.WebPush.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Globalization;

namespace Plumb5.Areas.WebPush.Controllers
{
    [Area("WebPush")]
    public class WebPushIndividualResponseController : BaseController
    {
        public WebPushIndividualResponseController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /WebPush/WebPushIndividualResponse/

        public IActionResult Index()
        {
            return View("WebPushIndividualResponse");
        }
        public async Task<ActionResult> GetMaxCount([FromBody] WebPushIndividualResponse_GetMaxCountDto WebPushIndividualResponseDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(WebPushIndividualResponseDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(WebPushIndividualResponseDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

            int returnVal;
            using (var objBL = DLWebPushSent.GetDLWebPushSent(domainDetails.AdsId,SQLProvider))
            {
                returnVal =await  objBL.GetWebPushTestCampaignMaxCount(FromDateTime, ToDateTime, WebPushIndividualResponseDto.WebPushTemplateId, WebPushIndividualResponseDto.MachineId);
            }
            return Json(new
            {
                returnVal
            });
        }
        public async Task<ActionResult> GetIndividualResponses([FromBody] WebPushIndividualResponse_GetIndividualResponsesDto WebPushIndividualResponseDto)
        {
            DateTime FromDateTime = DateTime.ParseExact(WebPushIndividualResponseDto.fromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(WebPushIndividualResponseDto.toDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            System.Data.DataSet DataSet = new System.Data.DataSet("General");

            using (var objBL =   DLWebPushSent.GetDLWebPushSent(domainDetails.AdsId,SQLProvider))
            {
                DataSet = await objBL.GetWebPushIndividualResponses(FromDateTime, ToDateTime, WebPushIndividualResponseDto.OffSet, WebPushIndividualResponseDto.FetchNext, WebPushIndividualResponseDto.WebPushTemplateId, WebPushIndividualResponseDto.MachineId);
            }
            var getdata = JsonConvert.SerializeObject(DataSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");

        }
        public async Task<ActionResult> ExportWebPushIndividualResponseReport([FromBody] WebPushIndividualResponse_ExportWebPushIndividualResponseReportDto WebPushIndividualResponseDto)
        {
            DateTime FromDateTimes = DateTime.ParseExact(WebPushIndividualResponseDto.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime ToDateTime = DateTime.ParseExact(WebPushIndividualResponseDto.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            System.Data.DataSet DataSet = new System.Data.DataSet("General");
            System.Data.DataSet dataSet = new System.Data.DataSet("General");
            using (var objBL =   DLWebPushSent.GetDLWebPushSent(WebPushIndividualResponseDto.AccountId, SQLProvider))
            {
                DataSet = await objBL.GetWebPushIndividualResponses(FromDateTimes, ToDateTime, WebPushIndividualResponseDto.OffSet, WebPushIndividualResponseDto.FetchNext);
            }

            System.Data.DataTable dtt = new System.Data.DataTable();
            dtt.Columns.Add("SentDate", typeof(string));
            dtt.Columns.Add("IsSent", typeof(string));
            dtt.Columns.Add("IsViewed", typeof(string));
            dtt.Columns.Add("IsClicked", typeof(string));
            dtt.Columns.Add("ErrorMessage", typeof(string));
            dtt.Columns.Add("TemplateName", typeof(string));
            dtt.Columns.Add("MessageContent", typeof(string));
            dtt.Columns.Add("IconImage", typeof(string));
            dtt.Columns.Add("BannerImage", typeof(string));
            dtt.Columns.Add("Button1_Label", typeof(string));
            dtt.Columns.Add("Button2_Label", typeof(string));
            dtt.Columns.Add("MachineId", typeof(string));

            for (int i = 0; i < DataSet.Tables[0].Rows.Count; i++)
            {
                try
                {
                    dtt.Rows.Add(DataSet.Tables[0].Rows[i]["SentDate"].ToString(),
                        (int.Parse(DataSet.Tables[0].Rows[i]["IsSent"].ToString()) == 1 ? "Yes" : "No"),
                       int.Parse(DataSet.Tables[0].Rows[i]["IsViewed"].ToString()) == 1 ? "Yes" : "No",
                        int.Parse(DataSet.Tables[0].Rows[i]["IsClicked"].ToString()) == 1 ? "Yes" : "No",
                        string.IsNullOrEmpty(DataSet.Tables[0].Rows[i]["ErrorMessage"].ToString()) ? "NA" : DataSet.Tables[0].Rows[i]["ErrorMessage"].ToString(),
                        string.IsNullOrEmpty(DataSet.Tables[0].Rows[i]["TemplateName"].ToString()) ? "NA" : DataSet.Tables[0].Rows[i]["TemplateName"].ToString(),
                        string.IsNullOrEmpty(DataSet.Tables[0].Rows[i]["MessageContent"].ToString()) ? "NA" : DataSet.Tables[0].Rows[i]["MessageContent"].ToString(),
                        string.IsNullOrEmpty(DataSet.Tables[0].Rows[i]["IconImage"].ToString()) ? "NA" : DataSet.Tables[0].Rows[i]["IconImage"].ToString(),
                       string.IsNullOrEmpty(DataSet.Tables[0].Rows[i]["BannerImage"].ToString()) ? "NA" : DataSet.Tables[0].Rows[i]["BannerImage"].ToString(),
                        string.IsNullOrEmpty(DataSet.Tables[0].Rows[i]["Button1_Label"].ToString()) ? "NA" : DataSet.Tables[0].Rows[i]["Button1_Label"].ToString(),
                       string.IsNullOrEmpty(DataSet.Tables[0].Rows[i]["Button2_Label"].ToString()) ? "NA" : DataSet.Tables[0].Rows[i]["Button2_Label"].ToString(),
                       DataSet.Tables[0].Rows[i]["MachineId"].ToString());
                }
                catch (Exception ex)
                {
                    using (ErrorUpdation objError = new ErrorUpdation("BulkMailWindowsService"))
                    {
                        objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "InsertMailSent->InnerException", ex.ToString());
                    }
                }
            }

            dataSet.Tables.Add(dtt);
            string FileName = "WebPushIndividualResponseReport" + DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + WebPushIndividualResponseDto.FileType;
            string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

            //string MainPath = "E:/" + FileName;

            if (WebPushIndividualResponseDto.FileType.ToLower() == "csv")
                Helper.SaveDataSetToCSV(dataSet, MainPath);
            else
                Helper.SaveDataSetToExcel(dataSet, MainPath);

            MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

            return Json(new { Status = true, MainPath } );
        }


    }
}
