using Microsoft.AspNetCore.Mvc;
using P5GenralML;
using P5GenralDL;
using Plumb5.Controllers;
using System.Globalization;
using System.Data;
using System.Collections;
using Microsoft.DotNet.Scaffolding.Shared.CodeModifier.CodeChange;
using Newtonsoft.Json;
using Plumb5GenralFunction;
using Microsoft.Identity.Client;
using System.Text.RegularExpressions;
using System.Reflection.PortableExecutable;
using NPOI.SS.Formula.Functions;
using System.Web;
using Plumb5.Areas.Analytics.Dto;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.Blazor;

namespace Plumb5.Areas.Analytics.Controllers
{
    [Area("Analytics")]
    public class ClickStreamController : BaseController
    {
        public ClickStreamController(IConfiguration _configuration) : base(_configuration)
        { }

        private static int _accountId;
        private DomainInfo _accountInfo;

        [HttpPost]
        public async Task<ActionResult> ContactInfo([FromBody] ClickStream_ContactInfoDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                DomainInfo? _accountInfo = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
                _accountId = _accountInfo.AdsId;
                using (var objDL = DLClickStream.GetDLClickStream(_accountId, SQLProvider))
                {
                    ds = await objDL.Select_Aggregate_Data(new _Plumb5MLClickStream()
                    {
                        AccountId = _accountId,
                        MachineId = details.contactId,
                        DeviceId = details.deviceId,
                        Key = details.key
                    });
                }

                var getdata = JsonConvert.SerializeObject(Models.MaskEmailPhoneNumber.UCPMaskEmailId(ds), Newtonsoft.Json.Formatting.Indented);
                return Content(getdata, "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> AggregateData([FromBody] ClickStream_AggregateDataDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                using (var objDL = DLClickStream.GetDLClickStream(_accountId, SQLProvider))
                {
                    ds = await objDL.Select_Aggregate_Data(new _Plumb5MLClickStream()
                    {
                        AccountId = _accountId,
                        MachineId = details.machineId,
                        Key = details.key
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata, "application/json");
            }
            catch
            {
                return null;
            }
        }
        [HttpPost]
        public async Task<ActionResult> RecentData([FromBody] ClickStream_RecentDataDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                using (var objDL = DLClickStream.GetDLClickStream(_accountId, SQLProvider))
                {
                    ds = await objDL.Select_Aggregate_Data(new _Plumb5MLClickStream()
                    {
                        AccountId = _accountId,
                        MachineId = details.machineId,
                        Key = details.key
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata, "application/json");
            }
            catch
            {
                return null;
            }
        }
        [HttpPost]
        public async Task<ActionResult> ScoreData([FromBody] ClickStream_ScoreDataDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                using (var objDL = DLClickStream.GetDLClickStream(_accountId, SQLProvider))
                {
                    ds = await objDL.Select_Aggregate_Data(new _Plumb5MLClickStream()
                    {
                        AccountId = _accountId,
                        MachineId = details.machineId,
                        Key = details.key
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata, "application/json");
            }
            catch
            {
                return null;
            }
        }
        [HttpPost]
        public async Task<ActionResult> GroupsData([FromBody] ClickStream_GroupsDataDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                using (var objDL = DLClickStream.GetDLClickStream(_accountId, SQLProvider))
                {
                    ds = await objDL.Select_Aggregate_Data(new _Plumb5MLClickStream()
                    {
                        AccountId = _accountId,
                        MachineId = details.machineId,
                        ContactId = details.contactId,
                        Key = details.key
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata, "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> PercentageData([FromBody] ClickStream_PercentageDataDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                using (var objDL = DLClickStream.GetDLClickStream(_accountId, SQLProvider))
                {
                    ds = await objDL.Select_Aggregate_Data(new _Plumb5MLClickStream()
                    {
                        AccountId = _accountId,
                        MachineId = details.machineId,
                        Key = details.key
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata, "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> PercentageDataScoring([FromBody] ClickStream_PercentageDataScoringDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                using (var objDL = DLClickStream.GetDLClickStream(_accountId, SQLProvider))
                {
                    ds = await objDL.Select_Aggregate_Data(new _Plumb5MLClickStream()
                    {
                        AccountId = _accountId,
                        MachineId = details.machineId,
                        Key = details.key
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata, "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> ClickStreamData([FromBody] ClickStream_ClickStreamDataDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                using (var objDL = DLClickStream.GetDLClickStream(_accountId, SQLProvider))
                {
                    ds = await objDL.Select_Aggregate_Data(new _Plumb5MLClickStream()
                    {
                        AccountId = _accountId,
                        MachineId = details.machineId,
                        Key = details.key
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata, "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> CityData([FromBody] ClickStream_CityDataDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                using (var objDL = DLClickStream.GetDLClickStream(_accountId, SQLProvider))
                {
                    ds = await objDL.Select_Aggregate_Data(new _Plumb5MLClickStream()
                    {
                        AccountId = _accountId,
                        MachineId = details.machineId,
                        Key = details.key
                    });
                }

                if (ds != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
                {
                    ds.Tables[0].Columns.Add("latitude", typeof(string));
                    ds.Tables[0].Columns.Add("longitude", typeof(string));

                    foreach (DataRow row in ds.Tables[0].Rows)
                    {
                        using (var objDL = DLIpligenceCityList.GetDLIpligenceCityList(SQLProvider))
                        {
                            IpligenceDAS cityDetails = await objDL.GetCityCoOrdinate(Convert.ToString(row["City"]));
                            row["latitude"] = cityDetails.latitude;
                            row["longitude"] = cityDetails.longitude;
                        }
                    }
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata, "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> PageDetails([FromBody] ClickStream_PageDetailsDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                using (var objDL = DLClickStream.GetDLClickStream(_accountId, SQLProvider))
                {
                    ds = await objDL.Select_ClickStream_PageDetails(new _Plumb5MLClickStreamPageDetails()
                    {
                        AccountId = _accountId,
                        SessionId = details.sessionId
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata, "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> TransactionDetails([FromBody] ClickStream_TransactionDetailsDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                using (var objDL = DLClickStream.GetDLClickStream(_accountId, SQLProvider))
                {
                    ds = await objDL.Select_Transaction(new _Plumb5MLTransactionData()
                    {
                        AccountId = _accountId,
                        MachineId = details.machineId,
                        Start = details.Start,
                        End = details.End
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata, "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> MobileAppData([FromBody] ClickStream_MobileAppDataDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                using (var objDL = DLClickStream.GetDLClickStream(_accountId, SQLProvider))
                {
                    ds = await objDL.Select_ClickStream_PageDetailsMobile(new _Plumb5MLClickStreamPageDetailsMobile()
                    {
                        AccountId = _accountId,
                        SessionId = details.sessionId,
                        DeviceId = details.deviceId,
                        Key = details.key,
                        contactId = details.contactId
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata, "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> MobileVisitor([FromBody] ClickStream_MobileVisitorDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                using (var objDL = DLClickStream.GetDLClickStream(_accountId, SQLProvider))
                {
                    ds = await objDL.Select_MobileVisitor(new _Plumb5MLClickStream()
                    {
                        AccountId = _accountId,
                        MachineId = details.machineId,
                        Key = details.key
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata, "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> MobileVisitorLocation([FromBody] ClickStream_MobileVisitorLocationDto details)
        {
            DataSet ds = new DataSet();
            try
            {
                using (var objDL = DLClickStream.GetDLClickStream(_accountId, SQLProvider))
                {
                    ds = await objDL.Select_MobileVisitor(new _Plumb5MLClickStream()
                    {
                        AccountId = _accountId,
                        MachineId = details.machineId,
                        Key = details.key
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata, "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> AddNotes([FromBody] ClickStream_AddNotesDto details)
        {
            DataSet ds = new DataSet();
            string Note= "";

            if (!String.IsNullOrEmpty(details.Note))
            {
                Note = HttpUtility.HtmlEncode(details.Note);
            }
            try
            {
                using (var objDL = DLClickStream.GetDLClickStream(_accountId, SQLProvider))
                {
                    ds = await objDL.Insert_Notes(new _Plumb5MLAddNotes()
                    {
                        AccountId = _accountId,
                        Note = Note,
                        MachineId = details.MachineId,
                        ContactId = details.ContactId,
                        ImageName = details.ImageName
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata, "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> BindNotes([FromBody] ClickStream_BindNotesDto details)
        {
            DataSet ds = new DataSet();
            int _ContactId = 0;
            if (!String.IsNullOrEmpty(details.ContactId))
            {
                try
                {
                    _ContactId = Convert.ToInt32(details.ContactId);
                }
                catch { }
            }
            try
            {
                using (var objDL = DLClickStream.GetDLClickStream(_accountId, SQLProvider))
                {
                    ds = await objDL.Select_Notes(new _Plumb5MLAddNotes()
                    {
                        AccountId = _accountId,
                        MachineId = details.MachineId,
                        ContactId = _ContactId
                    });
                }

                var getdata = JsonConvert.SerializeObject(ds, Newtonsoft.Json.Formatting.Indented);
                return Content(getdata, "application/json");
            }
            catch
            {
                return null;
            }
        }

        [HttpPost]
        public async Task<ActionResult> CheckFileFormat()
        {
            var files = Request.Form.Files;

            string FileName = Request.Form.Files[0].FileName;
            string fileExtension = System.IO.Path.GetExtension(Request.Form.Files[0].FileName);
            List<string> fileExtensionList = new List<string>() { ".jpg", ".png", ".gif", ".jpeg" };
            if (fileExtensionList.Contains(fileExtension))
            {
                List<string> presentExtensionList = Helper.GetFileExtensionFromFileStream(Request.Form.Files[0].OpenReadStream());
                if (presentExtensionList != null && fileExtensionList.Any(presentExtensionList.Contains))
                {
                    var getdata = JsonConvert.SerializeObject(FileName, Newtonsoft.Json.Formatting.Indented);
                    return Content(getdata.ToString(), "application/json");
                }
                else
                {
                    var getdata = JsonConvert.SerializeObject("0", Newtonsoft.Json.Formatting.Indented);
                    return Content(getdata.ToString(), "application/json");
                }
            }
            else
            {
                var getdata = JsonConvert.SerializeObject("0", Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
        }

        [HttpPost]
        public async Task<ActionResult> ImportFile()
        {
            var files = Request.Form.Files;

            string FileName = Request.Form.Files[0].FileName;
            string fileExtension = System.IO.Path.GetExtension(Request.Form.Files[0].FileName);
            List<string> fileExtensionList = new List<string>() { ".jpg", ".png", ".gif", ".jpeg" };
            if (fileExtensionList.Contains(fileExtension))
            {
                List<string> presentExtensionList = Helper.GetFileExtensionFromFileStream(Request.Form.Files[0].OpenReadStream());
                if (presentExtensionList != null && fileExtensionList.Any(presentExtensionList.Contains))
                {
                    var getdata = JsonConvert.SerializeObject(FileName, Newtonsoft.Json.Formatting.Indented);
                    return Content(getdata.ToString(), "application/json");
                }
                else
                {
                    var getdata = JsonConvert.SerializeObject("0", Newtonsoft.Json.Formatting.Indented);
                    return Content(getdata.ToString(), "application/json");
                }
            }
            else
            {
                var getdata = JsonConvert.SerializeObject("0", Newtonsoft.Json.Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
        }
    }
}
