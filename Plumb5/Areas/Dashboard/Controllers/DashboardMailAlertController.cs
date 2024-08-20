using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML; 
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Globalization;
using Plumb5.Areas.CaptureForm.Models;
using Plumb5.Areas.Dashboard.Dto;

namespace Plumb5.Areas.Dashboard.Controllers
{
    [Area("Dashboard")]
    public class DashboardMailAlertController : BaseController
    {
        public DashboardMailAlertController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /Dashboard/DashboardMailAlert/

        public IActionResult Index()
        {
            return View("DashboardMailAlert");
        }
        public IActionResult DownloadForms()
        {
            return View("DownloadForms");
        }

        public async Task<JsonResult> GetJsonContent([FromBody] DashboardMailAlert_GetJsonContentDto DashboardMailAlertDto)
        {
            if (DashboardMailAlertDto.Guid != null)
            {
                var decData = DecodeFrom64(DashboardMailAlertDto.Guid).Split('~');
                if (decData.Length == 2)
                {

                    LoginInfo logIn = new LoginInfo() { UserId = 1, UserName = "support", EmailId = "support@plumb5.com", IsSuperAdmin = Convert.ToInt32(1) };
                    logIn.UserGroupIdList = new List<int>();
                    HttpContext.Session.SetString("UserInfo", JsonConvert.SerializeObject(logIn));  
                    DomainInfo? domainInfo = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                    HttpContext.Session.SetString("AccountInfo", JsonConvert.SerializeObject(domainInfo));
                    using (var objDL =   DLDashboard.GetDLDashboard(int.Parse(decData[0]), SQLProvider))
                    {
                        var JsonContent = await objDL.GetDashboarJsonContent(int.Parse(decData[1]));
                        var getdata = JsonConvert.SerializeObject(JsonContent, Formatting.Indented);
                        return Json("{\"AdsId\":" + int.Parse(decData[0]) + ",\"DashId\":" + int.Parse(decData[1]) + ",\"Data\":" + getdata + "}");
                    }
                }
                else
                {
                    return Json("{\"AdsId\":0,\"DashId\":0,\"Data\":[]}");
                }
            }
            else
            {
                return Json("{\"AdsId\":0,\"DashId\":0,\"Data\":[]}");
            }
        }


        public string DecodeFrom64(string encodedData)
        {
            System.Text.UTF8Encoding encoder = new System.Text.UTF8Encoding();
            System.Text.Decoder utf8Decode = encoder.GetDecoder();
            byte[] todecode_byte = Convert.FromBase64String(encodedData);
            int charCount = utf8Decode.GetCharCount(todecode_byte, 0, todecode_byte.Length);
            char[] decoded_char = new char[charCount];
            utf8Decode.GetChars(todecode_byte, 0, todecode_byte.Length, decoded_char, 0);
            string result = new String(decoded_char);
            return result;
        }
        public async Task<JsonResult> FormResponseAllExport([FromBody] DashboardMailAlert_FormResponseAllExportDto DashboardMailAlertDto)
        {
            System.Text.UTF8Encoding encoder = new System.Text.UTF8Encoding();
            System.Text.Decoder utf8Decode = encoder.GetDecoder();
            byte[] todecode_byte = Convert.FromBase64String(DashboardMailAlertDto.AccountId);
            int charCount = utf8Decode.GetCharCount(todecode_byte, 0, todecode_byte.Length);
            char[] decoded_char = new char[charCount];
            utf8Decode.GetChars(todecode_byte, 0, todecode_byte.Length, decoded_char, 0);
            string result = new String(decoded_char);

            int AdsId = Convert.ToInt32(result);
            // Create a DataSet and put both tables in it.
            System.Data.DataSet dataSet = new System.Data.DataSet("General");
            FormResponses formResponses = new FormResponses();
            List<MLFormResponseWithFormDetails> listOfData = new List<MLFormResponseWithFormDetails>();

            string EmbeddedFormOrPopUpFormOrTaggedForm = String.Empty;

            EmbeddedFormOrPopUpFormOrTaggedForm = null;


            using (var objBL =   DLFormResponses.GetDLFormResponses(AdsId,SQLProvider))
            {
                listOfData = (await objBL.GetCustomResponses(formResponses, 0, 0, DashboardMailAlertDto.FromDate, DashboardMailAlertDto.ToDate, EmbeddedFormOrPopUpFormOrTaggedForm)).ToList();
            }

            ExportToExcelCustomised exporttoexceldetails = new ExportToExcelCustomised(AdsId, SQLProvider);
            exporttoexceldetails.ExportCustomised(listOfData, "xls");

            return Json(new { Status = true, exporttoexceldetails.MainPath } );
            //}
            //else
            //{
            //    return Json(new { Status = false }, JsonRequestBehavior.AllowGet);
            //}
        }
    }
}
