using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.ManageContact.Dto;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using System.Collections;
using System.Data;
using System.Globalization;

namespace Plumb5.Areas.ManageContact.Controllers
{
    [Area("ManageContact")]
    public class ApiImportRequestController : BaseController
    {
        public ApiImportRequestController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /ManageContact/ApiImportRequest/

        public ActionResult Index()
        {
            return View("ApiImportRequest");
        }

        [HttpPost]
        public async Task<JsonResult> GetApiNames([FromBody] ApiImportRequest_GetApiNames commonDetails)
        {
            using (var objBL = DLApiImportResponseSetting.GetDLApiImportResponseSetting(commonDetails.AccountId, SQLProvider))
                return Json(new { Data = await objBL.GetNames() });
        }

        [HttpPost]
        public async Task<JsonResult> GetMaxCount([FromBody] ApiImportRequest_GetMaxCount commonDetails)
        {
            DateTime fromDateTime = DateTime.ParseExact(commonDetails.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime toDateTime = DateTime.ParseExact(commonDetails.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            using (var objBL = DLApiImportRequest.GetDLApiImportRequest(commonDetails.AccountId, SQLProvider))
                return Json(new { returnVal = await objBL.GetMaxCount(fromDateTime, toDateTime, commonDetails.Requestcontent, commonDetails.Name, commonDetails.IsContactSuccess, commonDetails.IsLmsSuccess) });
        }

        [HttpPost]
        public async Task<ActionResult> GetDetails([FromBody] ApiImportRequest_GetDetails commonDetails)
        {
            DateTime fromDateTime = DateTime.ParseExact(commonDetails.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
            DateTime toDateTime = DateTime.ParseExact(commonDetails.ToDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

            ArrayList data = new ArrayList() { commonDetails.Requestcontent, commonDetails.Name, commonDetails.IsContactSuccess, commonDetails.IsLmsSuccess };

            HttpContext.Session.SetString("APIRequest", JsonConvert.SerializeObject(data));

            DataSet ds = null;
            using (var objBL = DLApiImportRequest.GetDLApiImportRequest(commonDetails.AccountId, SQLProvider))
                ds = await objBL.GetDetails(fromDateTime, toDateTime, commonDetails.Requestcontent, commonDetails.Name, commonDetails.IsContactSuccess, commonDetails.IsLmsSuccess, commonDetails.offset, commonDetails.fetchnext);

            var getdata = JsonConvert.SerializeObject(ds, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }

        [Log]
        [HttpPost]
        public async Task<ActionResult> Export([FromBody] ApiImportRequest_Export commonDetails)
        {
            try
            {
                if (HttpContext.Session.GetString("UserInfo") != null)
                {
                    System.Data.DataSet dataSet = new System.Data.DataSet("General");
                    LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
                    DomainInfo? account = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

                    string Requestcontent = null; string Name = null; bool? IsContactSuccess = null; bool? IsLmsSuccess = null;

                    DateTime fromDateTime = DateTime.ParseExact(commonDetails.FromDateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);
                    DateTime toDateTime = DateTime.ParseExact(commonDetails.TodateTime, "yyyy-MM-dd HH:mm:ss", CultureInfo.InvariantCulture);

                    if (HttpContext.Session.GetString("APIRequest") != null)
                    {
                        ArrayList? data = JsonConvert.DeserializeObject<ArrayList>(HttpContext.Session.GetString("APIRequest"));
                        Requestcontent = Convert.ToString(data[0]);
                        Name = Convert.ToString(data[1]);
                        IsContactSuccess = (bool?)data[2];
                        IsLmsSuccess = (bool?)data[3];
                    }

                    DataSet ds = null;
                    using (var objBL = DLApiImportRequest.GetDLApiImportRequest(commonDetails.AccountId, SQLProvider))
                        ds = await objBL.GetDetails(fromDateTime, toDateTime, Requestcontent, Name, IsContactSuccess, IsLmsSuccess, commonDetails.OffSet, commonDetails.FetchNext);

                    DataTable apidetails = ds.Tables[0];
                    string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(commonDetails.AccountId, SQLProvider);
                    DataTable resultDataTable = (from dataRow in apidetails.Select()
                                                 select new
                                                 {
                                                     Name = String.IsNullOrEmpty(Convert.ToString(dataRow["Name"])) ? "Direct API Import" : Convert.ToString(dataRow["Name"]),
                                                     RequestContent = Convert.ToString(dataRow["RequestContent"]),
                                                     IsContactSuccess = !String.IsNullOrEmpty(Convert.ToString(dataRow["IsLmsSuccess"])) && Convert.ToBoolean(dataRow["IsContactSuccess"]) == true ? "True" : "False",
                                                     ContactErrorMessage = Convert.ToString(dataRow["ContactErrorMessage"]),
                                                     IsLmsSuccess = !String.IsNullOrEmpty(Convert.ToString(dataRow["IsLmsSuccess"])) && Convert.ToBoolean(dataRow["IsLmsSuccess"]) == true ? "True" : "False",
                                                     LmsErrorMessage = Convert.ToString(dataRow["LmsErrorMessage"]),
                                                     P5UniqueId = Convert.ToString(dataRow["P5UniqueId"]),
                                                     CreatedDate = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(dataRow["CreatedDate"])).ToString(),
                                                     ErrorMessage = Convert.ToString(dataRow["ErrorMessage"])
                                                 }).CopyToDataTableExport();

                    DataSet resultDataSet = new DataSet();
                    resultDataSet.Tables.Add(resultDataTable);

                    string FileName = DateTime.Now.ToString("ddMMyyyyHHmmssfff") + "." + commonDetails.FileType;

                    string MainPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\TempFiles\\" + FileName;

                    if (commonDetails.FileType.ToLower() == "csv")
                        Helper.SaveDataSetToCSV(resultDataSet, MainPath);
                    else
                        Helper.SaveDataSetToExcel(resultDataSet, MainPath);

                    MainPath = AllConfigURLDetails.KeyValueForConfig["ONLINEURL"] + "TempFiles/" + FileName;

                    return Json(new { Status = true, MainPath });
                }
                else
                {
                    return Json(new { Status = false });
                }

            }
            catch (Exception ex)
            {
                return Json(new { Status = false });
            }
        }
    }
}
