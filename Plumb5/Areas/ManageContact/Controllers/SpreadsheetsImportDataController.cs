using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.ManageContact.Models;
using Plumb5.Controllers;
using System.Data;
using System.Web;
using Plumb5GenralFunction;
using Google.Apis.Sheets.v4;
using Google.Apis.Auth.OAuth2;
using Plumb5.Areas.ManageContact.Dto;

namespace Plumb5.Areas.ManageContact.Controllers
{
    [Area("ManageContact")]
    public class SpreadsheetsImportDataController : BaseController
    {
        public SpreadsheetsImportDataController(IConfiguration _configuration) : base(_configuration)
        { }
        
         
        public IActionResult Index()
        {
            return View();
        }

        public async Task<JsonResult> SaveSpreadsheetsImportData([FromBody] SpreadsheetsImportData_SaveSpreadsheetsImportDataDto SpreadsheetsImportDataDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            if (SpreadsheetsImportDataDto.spreadsheets.ImportType == "bulkimport")
            {
                GenerateSpreadSheetFile generateexceldetails = new GenerateSpreadSheetFile(SpreadsheetsImportDataDto.accountId, SQLProvider);
                  generateexceldetails.GenerateSpreadSheets(SpreadsheetsImportDataDto.Plumb5contactColumns, SpreadsheetsImportDataDto.SpreedsheetID, SpreadsheetsImportDataDto.Range, SpreadsheetsImportDataDto.contactImportOverview, user.UserId);

            }

            using (var objDL = DLSpreadsheetsImportData.GetDLSpreadsheetsImportData(SpreadsheetsImportDataDto.accountId, SQLProvider))
            {
                SpreadsheetsImportDataDto.spreadsheets.MappingFields = "[" + SpreadsheetsImportDataDto.spreadsheets.MappingFields + "]";
                SpreadsheetsImportDataDto.spreadsheets.MappingLmscustomFields = "[" + SpreadsheetsImportDataDto.spreadsheets.MappingLmscustomFields + "]";
                if (SpreadsheetsImportDataDto.Action.ToLower() == "save")
                    return Json(await objDL.Save(SpreadsheetsImportDataDto.spreadsheets));
                else
                {
                    SpreadsheetsImportDataDto.spreadsheets.Id = SpreadsheetsImportDataDto.Id;
                    return Json(await objDL.Update(SpreadsheetsImportDataDto.spreadsheets));
                }
            }
        }

        public async Task<JsonResult> GetLiveSheetDetails([FromBody] SpreadsheetsImportData_GetLiveSheetDetailsDto SpreadsheetsImportDataDto)
        {
            using (var objDL = DLSpreadsheetsImportData.GetDLSpreadsheetsImportData(SpreadsheetsImportDataDto.accountId, SQLProvider))
            {
                return Json(await objDL.GetLiveSheetDetails(SpreadsheetsImportDataDto.ImportType));
            }
        }

        public async Task<ActionResult> OverviewMaxCount([FromBody] SpreadsheetsImportData_OverviewMaxCountDto SpreadsheetsImportDataDto)
        {
            int returnVal;
            using (var objDL = DLSpreadsheetsImporOverview.GetDLSpreadsheetsImporOverview(SpreadsheetsImportDataDto.AdsId, SQLProvider))
            {
                returnVal = await objDL.MaxCount(SpreadsheetsImportDataDto.SpreadsheetsImportId);
            }

            return Json(new
            {
                returnVal
            });
        }
        public async Task<ActionResult> GetSpreadsheetsOverviewData([FromBody] SpreadsheetsImportData_GetSpreadsheetsOverviewDataDto SpreadsheetsImportDataDto)
        {

            List<SpreadsheetsImporOverview> spreadsheetsimporoverview = new List<SpreadsheetsImporOverview>();
            using (var objDL = DLSpreadsheetsImporOverview.GetDLSpreadsheetsImporOverview(SpreadsheetsImportDataDto.AdsId, SQLProvider))
            {
                spreadsheetsimporoverview = (await objDL.GetDetails(SpreadsheetsImportDataDto.SpreadsheetsImportId, SpreadsheetsImportDataDto.OffSet, SpreadsheetsImportDataDto.FetchNext)).ToList();
                return Json(spreadsheetsimporoverview);
            }

        }
        public async Task<ActionResult> GetGoogleService([FromBody] SpreadsheetsImportData_GetGoogleServiceDto SpreadsheetsImportDataDto)
        {
            Google.Apis.Sheets.v4.Data.ValueRange response = null;
            SheetsService sheetsService = null;
            string errormessage = "";
            try
            {
                string[] Scopes = { SheetsService.Scope.SpreadsheetsReadonly };
                string ApplicationName = "P5 lead imports";
                IConfiguration Configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json", optional: false, reloadOnChange: true).Build(); 
                string AuthGoogleJSON = Configuration.GetSection("JSON").Value;
                using (var AuthGoogleJSONStream = new System.IO.FileStream(AuthGoogleJSON, System.IO.FileMode.Open, System.IO.FileAccess.Read))
                {
                    // Do your file operations here
                    var credential1 = GoogleCredential.FromStream(AuthGoogleJSONStream);
                    //var credential1 = GoogleCredential.FromStream(AuthGoogleJSONStream).CreateScoped(Scopes);
                    sheetsService = new SheetsService(new Google.Apis.Services.BaseClientService.Initializer()
                    {
                        HttpClientInitializer = credential1,
                        ApplicationName = ApplicationName,
                    });
                    try
                    {
                        if (!String.IsNullOrEmpty(SpreadsheetsImportDataDto.SpreadsheetId) && !String.IsNullOrEmpty(SpreadsheetsImportDataDto.Range))
                        {
                            SpreadsheetsResource.ValuesResource.GetRequest request = sheetsService.Spreadsheets.Values.Get(SpreadsheetsImportDataDto.SpreadsheetId, SpreadsheetsImportDataDto.Range);
                            response = request.Execute();
                        }
                    }
                    catch (Exception ex)
                    {
                        errormessage = ex.Message.ToString();
                        using (ErrorUpdation objError = new ErrorUpdation("SheetsService"))
                            objError.AddError(ex.Message.ToString(), "Google credential error", DateTime.Now.ToString(), "GetGoogleService==>exception", ex.ToString());

                    }
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("SheetsService"))
                    objError.AddError(ex.Message.ToString(), "Google credential error", DateTime.Now.ToString(), "GetGoogleService==>exception", ex.ToString());

            }
            if (response == null)
            {
                return Json("Nodata");
            }
            else
                return Json(response);
        }

        public async Task<JsonResult> GetAllProperty([FromBody] SpreadsheetsImportData_GetAllPropertyDto SpreadsheetsImportDataDto)
        {
            List<ContactFieldProperty> ContactFieldPropertyList;
            using (var objBL = DLContactFieldProperty.GetDLContactFieldProperty(SpreadsheetsImportDataDto.AccountId, SQLProvider))
            {
                ContactFieldPropertyList = (await objBL.GetAll()).ToList();
            }
            List<ContactPropertyList> ContactPropertyList = new List<ContactPropertyList>();
            if (ContactFieldPropertyList != null && ContactFieldPropertyList.Count > 0)
            {
                for (int i = 0; i < ContactFieldPropertyList.Count; i++)
                {

                    Contact contact = new Contact();
                    System.Reflection.PropertyInfo pInfo = contact.GetType().GetProperty(ContactFieldPropertyList[i].PropertyName);

                    ContactPropertyList contactPropertyLists = new ContactPropertyList { P5ColumnName = ContactFieldPropertyList[i].PropertyName, FrontEndName = ContactFieldPropertyList[i].DisplayName, FieldType = pInfo.PropertyType.Name };

                    ContactPropertyList.Add(contactPropertyLists);

                }
            }
            return Json(ContactPropertyList);
        }
        public async Task<JsonResult> DeleteRealTimeData([FromBody] SpreadsheetsImportData_DeleteRealTimeDataDto SpreadsheetsImportDataDto)
        {
            using (var objLmsLeads = DLSpreadsheetsImportData.GetDLSpreadsheetsImportData(SpreadsheetsImportDataDto.AccountId, SQLProvider))
            {
                return Json(await objLmsLeads.DeleteSpreadSheetRealTimeData(SpreadsheetsImportDataDto.Id));
            }
        }
        public async Task<JsonResult> ChangeStatusRealTime([FromBody] SpreadsheetsImportData_ChangeStatusRealTimeDto SpreadsheetsImportDataDto)
        {
            int returnVal;
            using (var objDL = DLSpreadsheetsImportData.GetDLSpreadsheetsImportData(SpreadsheetsImportDataDto.AccountId, SQLProvider))
            {
                returnVal = await objDL.ChangeStatusofRealTime(SpreadsheetsImportDataDto.Id);
            }
            return Json(new
            {
                returnVal
            });

        }
        public async Task<ActionResult> GetLMSGroupList([FromBody] SpreadsheetsImportData_GetLMSGroupListDto SpreadsheetsImportDataDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));


            using (var objGroup = DLLmsGroup.GetDLLmsGroup(SpreadsheetsImportDataDto.accountId, SQLProvider))
            {
                return Json(await objGroup.GetLMSGroupList());
            }
        }
    }
}
