using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using System.Data; 
using System.Web;
using Plumb5GenralFunction;
using NPOI.SS.Formula.Functions;
using System.Globalization;
using Plumb5.Areas.ManageContact.Dto;
using System.ComponentModel;
using static Npgsql.Replication.PgOutput.Messages.RelationMessage;

namespace Plumb5.Areas.ManageContact.Controllers
{
    
    [Area("ManageContact")]
    public class UCPController : BaseController
    { 
        public UCPController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /ManageContact/UCP/

        public ActionResult Index()
        {
            return View();
        }
        [HttpPost]
        public async Task<ActionResult> GetMchineIdsByContactId([FromBody] UCP_GetMchineIdsByContactIdDto UCPDto)
        {
            MLUCPVisitor mLUCPVisitor = new MLUCPVisitor();
            Helper.CopyWithDateTimeWhenString(UCPDto.mLUCPVisitor, mLUCPVisitor);
            DataSet resultSet;
            using (var objDL = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
            {
                MLUCPVisitor? vistordetails = await objDL.GetVisitorDetail(mLUCPVisitor);
                UCPDto.mLUCPVisitor.ContactId = vistordetails.ContactId;
                UCPDto.mLUCPVisitor.MachineId = vistordetails.MachineId;
                UCPDto.mLUCPVisitor.DeviceId = vistordetails.DeviceId;
                resultSet = await objDL.GetMchineIdsByContactId(mLUCPVisitor);
            }

            var getdata = JsonConvert.SerializeObject(resultSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        [HttpPost]
        public async Task<ActionResult> GetDevicedsByContactId([FromBody] UCP_GetDevicedsByContactIdDto UCPDto)
        {
            MLUCPVisitor mLUCPVisitor = new MLUCPVisitor();
            Helper.CopyWithDateTimeWhenString(UCPDto.mLUCPVisitor, mLUCPVisitor);
            DataSet resultSet;
            using (var objDL = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
            {
                MLUCPVisitor? vistordetails = await objDL.GetVisitorDetail(mLUCPVisitor);
                UCPDto.mLUCPVisitor.ContactId = vistordetails.ContactId;
                UCPDto.mLUCPVisitor.MachineId = vistordetails.MachineId;
                UCPDto.mLUCPVisitor.DeviceId = vistordetails.DeviceId;
                resultSet = await objDL.GetDevicedsByContactId(mLUCPVisitor);
            }

            var getdata = JsonConvert.SerializeObject(resultSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        [HttpPost]
        public async Task<ActionResult> GetBasicDetails([FromBody] UCP_GetBasicDetailsDto UCPDto)
        {
            MLUCPVisitor mLUCPVisitor = new MLUCPVisitor();
            Helper.CopyWithDateTimeWhenString(UCPDto.mLUCPVisitor, mLUCPVisitor);
            DataSet resultSet=new DataSet();
            using (var objDL = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
            {
                MLUCPVisitor? vistordetails = await objDL.GetVisitorDetail(mLUCPVisitor);
                UCPDto.mLUCPVisitor.ContactId = vistordetails.ContactId;
                UCPDto.mLUCPVisitor.MachineId = vistordetails.MachineId;
                UCPDto.mLUCPVisitor.DeviceId = vistordetails.DeviceId;
                resultSet = await objDL.GetBasicDetails(mLUCPVisitor);
            }

             

            if (resultSet != null && resultSet.Tables.Count > 0 && resultSet.Tables[0].Rows.Count > 0)
            {
                try
                {
                    foreach (System.Data.DataColumn col in resultSet.Tables[0].Columns) col.ReadOnly = false;

                    if (resultSet.Tables[0].Columns.Contains("Name") && resultSet.Tables[0].Columns.Contains("EmailId") && resultSet.Tables[0].Columns.Contains("PhoneNumber"))
                    {
                    
                        resultSet.Tables[0].Rows[0]["Name"] = !String.IsNullOrEmpty(Convert.ToString(resultSet.Tables[0].Rows[0]["Name"])) ? Helper.MaskName(Convert.ToString(resultSet.Tables[0].Rows[0]["Name"])) : Convert.ToString(resultSet.Tables[0].Rows[0]["Name"]);
                        resultSet.Tables[0].Rows[0]["EmailId"] = !String.IsNullOrEmpty(Convert.ToString(resultSet.Tables[0].Rows[0]["EmailId"])) ? Helper.MaskEmailAddress(Convert.ToString(resultSet.Tables[0].Rows[0]["EmailId"])) : Convert.ToString(resultSet.Tables[0].Rows[0]["EmailId"]);
                        resultSet.Tables[0].Rows[0]["PhoneNumber"] = !String.IsNullOrEmpty(Convert.ToString(resultSet.Tables[0].Rows[0]["PhoneNumber"])) ? Helper.MaskPhoneNumber(Convert.ToString(resultSet.Tables[0].Rows[0]["PhoneNumber"])) : Convert.ToString(resultSet.Tables[0].Rows[0]["PhoneNumber"]);
                    }
                }

                catch (Exception ex)
                {
                    ex.ToString();
                }
            }

            var getdata = JsonConvert.SerializeObject(resultSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        [HttpPost]
        public async Task<ActionResult> GetWebSummary([FromBody] UCP_GetWebSummaryDto UCPDto)
        {
            MLUCPVisitor mLUCPVisitor = new MLUCPVisitor();
            Helper.CopyWithDateTimeWhenString(UCPDto.mLUCPVisitor, mLUCPVisitor);
            DataSet resultSet;
            using (var objDL = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
            {
                MLUCPVisitor? vistordetails = await objDL.GetVisitorDetail(mLUCPVisitor);
                UCPDto.mLUCPVisitor.ContactId = vistordetails.ContactId;
                UCPDto.mLUCPVisitor.MachineId = vistordetails.MachineId;
                UCPDto.mLUCPVisitor.DeviceId = vistordetails.DeviceId;
                resultSet = await objDL.GetWebSummary(mLUCPVisitor);
            }

            var getdata = JsonConvert.SerializeObject(resultSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        [HttpPost]
        public async Task<ActionResult> GetMobileSummary([FromBody] UCP_GetMobileSummaryDto UCPDto)
        {
            MLUCPVisitor mLUCPVisitor = new MLUCPVisitor();
            Helper.CopyWithDateTimeWhenString(UCPDto.mLUCPVisitor, mLUCPVisitor);
            DataSet resultSet;
            using (var objDL = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
            {
                MLUCPVisitor? vistordetails = await objDL.GetVisitorDetail( mLUCPVisitor);
                UCPDto.mLUCPVisitor.ContactId = vistordetails.ContactId;
                UCPDto.mLUCPVisitor.MachineId = vistordetails.MachineId;
                UCPDto.mLUCPVisitor.DeviceId = vistordetails.DeviceId;
                resultSet = await objDL.GetMobileSummary( mLUCPVisitor);
            }

            var getdata = JsonConvert.SerializeObject(resultSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        [HttpPost]
        public async Task<ActionResult> GetMailDetails([FromBody] UCP_GetMailDetailsDto UCPDto)
        {
            MLUCPVisitor mLUCPVisitor = new MLUCPVisitor();
            Helper.CopyWithDateTimeWhenString(UCPDto.mLUCPVisitor, mLUCPVisitor);
            var PermissionDetails = JsonConvert.DeserializeObject<PermissionsLevels>(HttpContext.Session.GetString("MyPermission"));

            string CampaignJobName = null;

            if (PermissionDetails != null && (PermissionDetails.EmailMarketing || PermissionDetails.EmailMarketingView || PermissionDetails.EmailMarketingContribute || PermissionDetails.EmailMarketingHasFullControl))
                CampaignJobName = null;
            else if (PermissionDetails != null && (PermissionDetails.LeadManagement || PermissionDetails.LeadManagementView || PermissionDetails.LeadManagementContribute || PermissionDetails.LeadManagementHasFullControl))
                CampaignJobName = "lms";
            else
                CampaignJobName = null;

            DataSet resultSet;
            using (var objDL = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
            {
                MLUCPVisitor? vistordetails = await objDL.GetVisitorDetail( mLUCPVisitor);
                UCPDto.mLUCPVisitor.ContactId = vistordetails.ContactId;
                UCPDto.mLUCPVisitor.MachineId = vistordetails.MachineId;
                UCPDto.mLUCPVisitor.DeviceId = vistordetails.DeviceId;
                resultSet = await objDL.GetMailDetails( mLUCPVisitor, CampaignJobName);
            }

            var getdata = JsonConvert.SerializeObject(resultSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        [HttpPost]
        public async Task<ActionResult> GetSmsDetails([FromBody] UCP_GetSmsDetailsDto UCPDto)
        {
            MLUCPVisitor mLUCPVisitor = new MLUCPVisitor();
            Helper.CopyWithDateTimeWhenString(UCPDto.mLUCPVisitor, mLUCPVisitor);
            var PermissionDetails = JsonConvert.DeserializeObject<PermissionsLevels>(HttpContext.Session.GetString("MyPermission"));


            string CampaignJobName = null;

            if (PermissionDetails != null && (PermissionDetails.SMS || PermissionDetails.SMSView || PermissionDetails.SMSContribute || PermissionDetails.SMSHasFullControl))
                CampaignJobName = null;
            else if (PermissionDetails != null && (PermissionDetails.LeadManagement || PermissionDetails.LeadManagementView || PermissionDetails.LeadManagementContribute || PermissionDetails.LeadManagementHasFullControl))
                CampaignJobName = "lms";
            else
                CampaignJobName = null;

            DataSet resultSet;
            using (var objDL = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
            {
                MLUCPVisitor? vistordetails = await objDL.GetVisitorDetail( mLUCPVisitor);
                UCPDto.mLUCPVisitor.ContactId = vistordetails.ContactId;
                UCPDto.mLUCPVisitor.MachineId = vistordetails.MachineId;
                UCPDto.mLUCPVisitor.DeviceId = vistordetails.DeviceId;
                resultSet = await objDL.GetSmsDetails( mLUCPVisitor, CampaignJobName);
            }

            if (resultSet != null && resultSet.Tables.Count > 0 && resultSet.Tables[0].Rows.Count > 0)
            {
                foreach (System.Data.DataColumn col in resultSet.Tables[0].Columns) col.ReadOnly = false;
                for (var i = 0; i < resultSet.Tables[0].Rows.Count; i++)
                {
                    
                    resultSet.Tables[0].Rows[i]["PhoneNumber"] = !String.IsNullOrEmpty(Convert.ToString(resultSet.Tables[0].Rows[i]["PhoneNumber"])) ? Helper.MaskPhoneNumber(Convert.ToString(resultSet.Tables[0].Rows[i]["PhoneNumber"])) : Convert.ToString(resultSet.Tables[0].Rows[i]["PhoneNumber"]);
                }
            }

            var getdata = JsonConvert.SerializeObject(resultSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        [HttpPost]
        public async Task<ActionResult> GetWhatsappDetails([FromBody] UCP_GetWhatsappDetailsDto UCPDto)
        {
            MLUCPVisitor mLUCPVisitor = new MLUCPVisitor();
            Helper.CopyWithDateTimeWhenString(UCPDto.mLUCPVisitor, mLUCPVisitor);
            var PermissionDetails = JsonConvert.DeserializeObject<PermissionsLevels>(HttpContext.Session.GetString("MyPermission"));

            string CampaignJobName = null;

            if (PermissionDetails != null && (PermissionDetails.Whatsapp || PermissionDetails.WhatsappView || PermissionDetails.WhatsappContribute || PermissionDetails.WhatsappHasFullControl))
                CampaignJobName = null;
            else if (PermissionDetails != null && (PermissionDetails.LeadManagement || PermissionDetails.LeadManagementView || PermissionDetails.LeadManagementContribute || PermissionDetails.LeadManagementHasFullControl))
                CampaignJobName = "lms";
            else
                CampaignJobName = null;

            DataSet resultSet;
            using (var objDL = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
            {
                resultSet = await objDL.GetWhatsappDetails( mLUCPVisitor, CampaignJobName);
            }

            if (resultSet != null && resultSet.Tables.Count > 0 && resultSet.Tables[0].Rows.Count > 0)
            {
                foreach (System.Data.DataColumn col in resultSet.Tables[0].Columns) col.ReadOnly = false;
                for (var i = 0; i < resultSet.Tables[0].Rows.Count; i++)
                {
                   
                    resultSet.Tables[0].Rows[i]["PhoneNumber"] = !String.IsNullOrEmpty(Convert.ToString(resultSet.Tables[0].Rows[i]["PhoneNumber"])) ? Helper.MaskPhoneNumber(Convert.ToString(resultSet.Tables[0].Rows[i]["PhoneNumber"])) : Convert.ToString(resultSet.Tables[0].Rows[i]["PhoneNumber"]);
                }
            }

            var getdata = JsonConvert.SerializeObject(resultSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        [HttpPost]
        public async Task<ActionResult> GetFormDetails([FromBody] UCP_GetFormDetailsDto UCPDto)
        {
            MLUCPVisitor mLUCPVisitor = new MLUCPVisitor();
            Helper.CopyWithDateTimeWhenString(UCPDto.mLUCPVisitor, mLUCPVisitor);
            DataSet resultSet;
            using (var objDL = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
            {
                MLUCPVisitor? vistordetails = await objDL.GetVisitorDetail( mLUCPVisitor);
                UCPDto.mLUCPVisitor.ContactId = vistordetails.ContactId;
                UCPDto.mLUCPVisitor.MachineId = vistordetails.MachineId;
                UCPDto.mLUCPVisitor.DeviceId = vistordetails.DeviceId;
                resultSet = await objDL.GetFormDetails( mLUCPVisitor);
            }

            var getdata = JsonConvert.SerializeObject(resultSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        [HttpPost]
        public async Task<ActionResult> GetCallDetails([FromBody] UCP_GetCallDetailsDto UCPDto)
        {
            MLUCPVisitor mLUCPVisitor = new MLUCPVisitor();
            Helper.CopyWithDateTimeWhenString(UCPDto.mLUCPVisitor, mLUCPVisitor);
            DataSet resultSet;
            using (var objDL = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
            {
                MLUCPVisitor? vistordetails = await objDL.GetVisitorDetail( mLUCPVisitor);
                UCPDto.mLUCPVisitor.ContactId = vistordetails.ContactId;
                UCPDto.mLUCPVisitor.MachineId = vistordetails.MachineId;
                UCPDto.mLUCPVisitor.DeviceId = vistordetails.DeviceId;
                resultSet = await objDL.GetCallDetails( mLUCPVisitor);
            }

            if (resultSet != null && resultSet.Tables.Count > 0 && resultSet.Tables[0].Rows.Count > 0)
            {
                for (var i = 0; i < resultSet.Tables[0].Rows.Count; i++)
                {
                    resultSet.Tables[0].Rows[i]["PhoneNumber"] = !String.IsNullOrEmpty(Convert.ToString(resultSet.Tables[0].Rows[i]["PhoneNumber"])) ? Helper.MaskPhoneNumber(Convert.ToString(resultSet.Tables[0].Rows[i]["PhoneNumber"])) : Convert.ToString(resultSet.Tables[0].Rows[i]["PhoneNumber"]);
                }
            }

            var getdata = JsonConvert.SerializeObject(resultSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        [HttpPost]
        public async Task<ActionResult> GetTransactionDetails([FromBody] UCP_GetTransactionDetailsDto UCPDto)
        {
            MLUCPVisitor mLUCPVisitor = new MLUCPVisitor();
            Helper.CopyWithDateTimeWhenString(UCPDto.mLUCPVisitor, mLUCPVisitor);
            DataSet resultSet;
            using (var objDL = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
            {
                resultSet = await objDL.GetTransactionDetails( mLUCPVisitor);
            }

            var getdata = JsonConvert.SerializeObject(resultSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        [HttpPost]
        public async Task<ActionResult> GetClickStreamDetails([FromBody] UCP_GetClickStreamDetailDto UCPDto)
        {
            MLUCPVisitor mLUCPVisitor = new MLUCPVisitor();
            Helper.CopyWithDateTimeWhenString(UCPDto.mLUCPVisitor, mLUCPVisitor);

            DataSet resultSet;
            using (var objDL = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
            {
                MLUCPVisitor? vistordetails = await objDL.GetVisitorDetail(mLUCPVisitor);
                UCPDto.mLUCPVisitor.ContactId = vistordetails.ContactId;
                UCPDto.mLUCPVisitor.MachineId = vistordetails.MachineId;
                UCPDto.mLUCPVisitor.DeviceId = vistordetails.DeviceId;
                resultSet = await objDL.GetClickStreamDetails(mLUCPVisitor);
            }

            var getdata = JsonConvert.SerializeObject(resultSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        [HttpPost]
        public async Task<ActionResult> GetMobileAppDetails([FromBody] UCP_GetMobileAppDetailsDto UCPDto)
        {
            MLUCPVisitor mLUCPVisitor = new MLUCPVisitor();
            Helper.CopyWithDateTimeWhenString(UCPDto.mLUCPVisitor, mLUCPVisitor);
            DataSet resultSet;
            using (var objDL = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
            {
                MLUCPVisitor? vistordetails = await objDL.GetVisitorDetail( mLUCPVisitor);
                UCPDto.mLUCPVisitor.ContactId = vistordetails.ContactId;
                UCPDto.mLUCPVisitor.MachineId = vistordetails.MachineId;
                UCPDto.mLUCPVisitor.DeviceId = vistordetails.DeviceId;
                resultSet = await objDL.GetMobileAppDetails( mLUCPVisitor);
            }

            var getdata = JsonConvert.SerializeObject(resultSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        [HttpPost]
        public async Task<ActionResult> GetUserJourney([FromBody] UCP_GetUserJourneyDto UCPDto)
        {
            MLUCPVisitor mLUCPVisitor = new MLUCPVisitor();
            Helper.CopyWithDateTimeWhenString(UCPDto.mLUCPVisitor, mLUCPVisitor);
            var AccountInfo = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            string Domain = AccountInfo.DomainName.Replace("www.", "");
            UCPDto.mLUCPVisitor.Domain = Domain;
            List<MLUserJourney> userJourney = null;
            using (var objDL = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
            {
                MLUCPVisitor? vistordetails = await objDL.GetVisitorDetail( mLUCPVisitor);
                UCPDto.mLUCPVisitor.ContactId = vistordetails.ContactId;
                UCPDto.mLUCPVisitor.MachineId = vistordetails.MachineId;
                UCPDto.mLUCPVisitor.DeviceId = vistordetails.DeviceId;
                userJourney = (await objDL.GetUserJourney( mLUCPVisitor)).ToList();
            }
            return Json(userJourney);
        }

        [HttpPost]
        public async Task<ActionResult> SaveNotes([FromBody] UCP_SaveNotesDto UCPDto)
        {
            bool result = false;
            Notes notes = new Notes() { ContactId = UCPDto.ContactId, Content = UCPDto.Notes, Date = DateTime.Now };
            using (var objDLNotes = DLNotes.GetDLNotes(UCPDto.AccountId, SQLProvider))
            {
                result = await objDLNotes.Save(notes);
            }
            var getdata = JsonConvert.SerializeObject(new { result = result, notes = notes }, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        [HttpPost]
        public async Task<ActionResult> GetNoteList([FromBody] UCP_GetNoteListDto UCPDto)
        {
            MLUCPVisitor mLUCPVisitor = new MLUCPVisitor();
            Helper.CopyWithDateTimeWhenString(UCPDto.mLUCPVisitor, mLUCPVisitor);
            using (var objDL = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
            {
                MLUCPVisitor? vistordetails = await objDL.GetVisitorDetail( mLUCPVisitor);
                UCPDto.mLUCPVisitor.ContactId = vistordetails.ContactId;
                UCPDto.mLUCPVisitor.MachineId = vistordetails.MachineId;
                UCPDto.mLUCPVisitor.DeviceId = vistordetails.DeviceId;

                List<Notes> notes = (await objDL.GetLmsNoteList( mLUCPVisitor)).ToList();
                var getdata = JsonConvert.SerializeObject(notes, Formatting.Indented);
                return Content(getdata.ToString(), "application/json");
            }
        }
        [HttpPost]
        public async Task<ActionResult> GetLmsAuditDetails([FromBody] UCP_GetLmsAuditDetailsDto UCPDto)
        {
            MLUCPVisitor mLUCPVisitor = new MLUCPVisitor();
            Helper.CopyWithDateTimeWhenString(UCPDto.mLUCPVisitor, mLUCPVisitor);
            List<MLContact> historyDetails = new List<MLContact>();
            List<UserInfo> UserDetails = new List<UserInfo>();
            bool Status = false;
            var LeadsData = new Object();

            using (var objDL = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
            {
                MLUCPVisitor? vistordetails = await objDL.GetVisitorDetail( mLUCPVisitor);
                UCPDto.mLUCPVisitor.ContactId = vistordetails.ContactId;
                UCPDto.mLUCPVisitor.MachineId = vistordetails.MachineId;
                UCPDto.mLUCPVisitor.DeviceId = vistordetails.DeviceId;
                historyDetails = (await objDL.GetLmsAuditDetails( mLUCPVisitor)).ToList();
            }

            if (historyDetails != null)
            {
                Status = true;
                List<int> result = historyDetails.Select(x => x.UserInfoUserId).Distinct().ToList();

                using (var objDL = DLUserInfo.GetDLUserInfo(SQLProvider))
                {
                    UserDetails = objDL.GetDetail(result);
                }

                LeadsData = from MLContact in historyDetails
                            join UserInfo in UserDetails on MLContact.UserInfoUserId equals UserInfo.UserId
                            into UserInformationValues
                            from output in UserInformationValues.DefaultIfEmpty(new UserInfo())
                            select new
                            {
                                UserInfoUserId = output.UserId,
                                UserName = output.FirstName,
                                LastModifyByUserId = MLContact.LastModifyByUserId,
                                UserGroupId = MLContact.UserGroupId,
                                ContactId = MLContact.ContactId,
                                LmsGroupId = MLContact.LmsGroupId,
                                Score = MLContact.Score,
                                ScoreUpdatedDate = MLContact.ScoreUpdatedDate,
                                UpdatedDate = MLContact.UpdatedDate,
                                LmsGroupName = MLContact.LmsGroupName,
                                CustomField1 = MLContact.CustomField1,
                                CustomField2 = MLContact.CustomField2,
                                CustomField3 = MLContact.CustomField3,
                                CustomField4 = MLContact.CustomField4,
                                CustomField5 = MLContact.CustomField5,
                                CustomField6 = MLContact.CustomField6,
                                CustomField7 = MLContact.CustomField7,
                                CustomField8 = MLContact.CustomField8,
                                CustomField9 = MLContact.CustomField9,
                                CustomField10 = MLContact.CustomField10,
                                CustomField11 = MLContact.CustomField11,
                                CustomField12 = MLContact.CustomField12,
                                CustomField13 = MLContact.CustomField13,
                                CustomField14 = MLContact.CustomField14,
                                CustomField15 = MLContact.CustomField15,
                                CustomField16 = MLContact.CustomField16,
                                CustomField17 = MLContact.CustomField17,
                                CustomField18 = MLContact.CustomField18,
                                CustomField19 = MLContact.CustomField19,
                                CustomField20 = MLContact.CustomField20,
                                CustomField21 = MLContact.CustomField21,
                                CustomField22 = MLContact.CustomField22,
                                CustomField23 = MLContact.CustomField23,
                                CustomField24 = MLContact.CustomField24,
                                CustomField25 = MLContact.CustomField25,
                                CustomField26 = MLContact.CustomField26,
                                CustomField27 = MLContact.CustomField27,
                                CustomField28 = MLContact.CustomField28,
                                CustomField29 = MLContact.CustomField29,
                                CustomField30 = MLContact.CustomField30,
                                CustomField31 = MLContact.CustomField31,
                                CustomField32 = MLContact.CustomField32,
                                CustomField33 = MLContact.CustomField33,
                                CustomField34 = MLContact.CustomField34,
                                CustomField35 = MLContact.CustomField35,
                                CustomField36 = MLContact.CustomField36,
                                CustomField37 = MLContact.CustomField37,
                                CustomField38 = MLContact.CustomField38,
                                CustomField39 = MLContact.CustomField39,
                                CustomField40 = MLContact.CustomField40,
                                CustomField41 = MLContact.CustomField41,
                                CustomField42 = MLContact.CustomField42,
                                CustomField43 = MLContact.CustomField43,
                                CustomField44 = MLContact.CustomField44,
                                CustomField45 = MLContact.CustomField45,
                                CustomField46 = MLContact.CustomField46,
                                CustomField47 = MLContact.CustomField47,
                                CustomField48 = MLContact.CustomField48,
                                CustomField49 = MLContact.CustomField49,
                                CustomField50 = MLContact.CustomField50,
                                CustomField51 = MLContact.CustomField51,
                                CustomField52 = MLContact.CustomField52,
                                CustomField53 = MLContact.CustomField53,
                                CustomField54 = MLContact.CustomField54,
                                CustomField55 = MLContact.CustomField55,
                                CustomField56 = MLContact.CustomField56,
                                CustomField57 = MLContact.CustomField57,
                                CustomField58 = MLContact.CustomField58,
                                CustomField59 = MLContact.CustomField59,
                                CustomField60 = MLContact.CustomField60,
                                Remarks = MLContact.Remarks,
                                PageUrl = MLContact.PageUrl,
                                Place = MLContact.Place,
                                ReferrerUrl = MLContact.ReferrerUrl,
                                Name = MLContact.Name,
                                EmailId = MLContact.EmailId,
                                PhoneNumber = MLContact.PhoneNumber,
                                Address1 = MLContact.Address1,
                                Address2 = MLContact.Address2,
                                CompanyName = MLContact.CompanyName,
                                CompanyWebUrl = MLContact.CompanyWebUrl,
                                DomainName = MLContact.DomainName,
                                CompanyAddress = MLContact.CompanyAddress,
                                Projects = MLContact.Projects,
                                State = MLContact.StateName,
                                PostalCode = MLContact.ZipCode,
                                Religion = MLContact.Religion,
                                MaritalStatus = MLContact.MaritalStatus,
                                Country = MLContact.Country,
                                Age = MLContact.Age,
                                Gender = MLContact.Gender,
                                Education = MLContact.Education,
                                Occupation = MLContact.Occupation,
                                Location = MLContact.Location,
                                Interests = MLContact.Interests,
                                LastName = MLContact.LastName,
                                Label = MLContact.LeadLabel,
                                LeadLabelUpdatedDate = MLContact.LeadLabelUpdatedDate,
                                ReminderDate = MLContact.ReminderDate,
                                FollowUpDate = MLContact.FollowUpDate,
                                HandledByUpdatedDate = MLContact.HandledByUpdatedDate,
                                RepeatLeadCount = MLContact.RepeatLeadCount
                            };
            }
            return Json(new { Status = Status, LeadsData = LeadsData });
        }
        [HttpPost]
        public async Task<ActionResult> GetPastChatDetails([FromBody] UCP_GetPastChatDetailsDto UCPDto)
        {
            MLUCPVisitor mLUCPVisitor = new MLUCPVisitor();
            Helper.CopyWithDateTimeWhenString(UCPDto.mLUCPVisitor, mLUCPVisitor);
            List<ChatFullTranscipt> chatTranscript = null;
            dynamic dates = null;
            dynamic chatTranscripts = null;
            using (var objDL = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
            {
                MLUCPVisitor? vistordetails = await objDL.GetVisitorDetail( mLUCPVisitor);
                UCPDto.mLUCPVisitor.ContactId = vistordetails.ContactId;
                UCPDto.mLUCPVisitor.MachineId = vistordetails.MachineId;
                UCPDto.mLUCPVisitor.DeviceId = vistordetails.DeviceId;

                chatTranscript = (await objDL.GetPastChatDetails( mLUCPVisitor)).ToList();

                if (chatTranscript != null && chatTranscript.Count > 0)
                {
                    chatTranscripts = (from chat in chatTranscript
                                       select new
                                       {
                                           Name = chat.Name,
                                           IsAdmin = chat.IsAdmin,
                                           ChatText = chat.ChatText,
                                           ChatDate = chat.ChatDate,
                                           ChatDateString = chat.ChatDate.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture)
                                       }).Distinct().ToList();


                    dates = (from chat in chatTranscript
                             select new
                             {
                                 ChatDate = chat.ChatDate.ToString("dd/MM/yyyy", CultureInfo.InvariantCulture)
                             }).Distinct().ToList();
                }

            }
            return Json(new { dates = dates, chatTranscript = chatTranscripts });
        }
        [HttpPost]
        public async Task<ActionResult> GetWebPushDetails([FromBody] UCP_GetWebPushDetailsDto UCPDto)
        {
            MLUCPVisitor mLUCPVisitor = new MLUCPVisitor();
            Helper.CopyWithDateTimeWhenString(UCPDto.mLUCPVisitor, mLUCPVisitor);
            DataSet resultSet;
            using (var objDL = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
            {
                MLUCPVisitor? vistordetails = await objDL.GetVisitorDetail( mLUCPVisitor);
                UCPDto.mLUCPVisitor.ContactId = vistordetails.ContactId;
                UCPDto.mLUCPVisitor.MachineId = vistordetails.MachineId;
                UCPDto.mLUCPVisitor.DeviceId = vistordetails.DeviceId;
                resultSet = await objDL.GetWebPushDetails( mLUCPVisitor);
            }

            var getdata = JsonConvert.SerializeObject(resultSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        [HttpPost]
        public async Task<ActionResult> GetMobilePushDetails([FromBody] UCP_GetMobilePushDetailsDto UCPDto)
        {
            MLUCPVisitor mLUCPVisitor = new MLUCPVisitor();
            Helper.CopyWithDateTimeWhenString(UCPDto.mLUCPVisitor, mLUCPVisitor);
            DataSet resultSet;
            using (var objDL = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
            {
                MLUCPVisitor? vistordetails = await objDL.GetVisitorDetail( mLUCPVisitor);
                UCPDto.mLUCPVisitor.ContactId = vistordetails.ContactId;
                UCPDto.mLUCPVisitor.MachineId = vistordetails.MachineId;
                UCPDto.mLUCPVisitor.DeviceId = vistordetails.DeviceId;
                resultSet = await objDL.GetMobilePushDetails( mLUCPVisitor);
            }

            var getdata = JsonConvert.SerializeObject(resultSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        [HttpPost]
        public async Task<ActionResult> GetFromAndToDate([FromBody] UCP_GetFromAndToDateDto UCPDto)
        {
            MLUCPVisitor mLUCPVisitor = new MLUCPVisitor();
            Helper.CopyWithDateTimeWhenString(UCPDto.mLUCPVisitor, mLUCPVisitor);
            DataSet resultSet;
            using (var objDL = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
            {
                MLUCPVisitor? vistordetails = await objDL.GetVisitorDetail( mLUCPVisitor);
                UCPDto.mLUCPVisitor.ContactId = vistordetails.ContactId;
                UCPDto.mLUCPVisitor.MachineId = vistordetails.MachineId;
                UCPDto.mLUCPVisitor.DeviceId = vistordetails.DeviceId;
                resultSet = await objDL.GetFromAndToDate( mLUCPVisitor, UCPDto.Module);
            }

            var getdata = JsonConvert.SerializeObject(resultSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        [HttpPost]
        public async Task<JsonResult> SaveContactName([FromBody] UCP_SaveContactNameDto UCPDto)
        {
            int result = 0;
            using (var objDLNotes = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
                result = await objDLNotes.SaveContactName(UCPDto.ContactId, UCPDto.Name);

            return Json(result);
        }
        [HttpPost]
        public async Task<JsonResult> GetEventTrackerDetails([FromBody] UCP_GetEventTrackerDetailsDto UCPDto)
        {

            List<EventTracker> EventTracker = new List<EventTracker>();
            using (var objDL = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
            {
                EventTracker = (await objDL.GetEventTrackerDetails(UCPDto.eVenttracker)).ToList();
            }
            return Json(EventTracker);

        }
        [HttpPost]
        public async Task<JsonResult> GetMailDetailsClickStream([FromBody] UCP_GetMailDetailsClickStreamDto UCPDto)
        {

            List<MailTemplate> mailcampaign = new List<MailTemplate>();
            using (var objDL = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
            {
                mailcampaign = (await objDL.GetMailclcikstreamDetails(UCPDto.MailP5UniqueID, UCPDto.startdatetime, UCPDto.enddatetime)).ToList();
            }
            return Json(mailcampaign);

        }
        [HttpPost]
        public async Task<JsonResult> GetsmsDetailsClickStream([FromBody] UCP_GetsmsDetailsClickStreamDto UCPDto)
        {
            List<SmsTemplate> smscampaign = new List<SmsTemplate>();
            using (var objDL = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
            {
                smscampaign = (await objDL.clickstreamGetSmsTemplateDetails(UCPDto.SMSP5UniqueID, UCPDto.startdatetime, UCPDto.enddatetime)).ToList();
            }
            return Json(smscampaign);

        }
        [HttpPost]
        public async Task<JsonResult> GetWhatsappDetailsClickStream([FromBody] UCP_GetWhatsappDetailsClickStreamDto UCPDto)
        {
            List<MLWhatsAppTemplates> mLWhatsAppTemplates = new List<MLWhatsAppTemplates>();

            using (var objDL = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
            {
                mLWhatsAppTemplates = (await objDL.clickstreamGetwhatsappTemplateDetails(UCPDto.WhatsAppP5UniqueID, UCPDto.startdatetime, UCPDto.enddatetime)).ToList();
            }
            return Json(new
            {
                Data = mLWhatsAppTemplates,
                MaxJsonLength = Int32.MaxValue

            });


        }
        [HttpPost]
        public async Task<JsonResult> GetEventdetailsClickStream([FromBody] UCP_GetEventdetailsClickStreamDto UCPDto)
        {

            List<Customevents> CustomEventsNameDetails = null;

            using (var objDL = DLUCP.GetDLUCP(UCPDto.accountId, SQLProvider))
            {
                CustomEventsNameDetails = (await objDL.GetEventdetailsClickStream(UCPDto.machineid, UCPDto.sessionid)).ToList();
            }

            return Json(CustomEventsNameDetails);
        }
        [HttpPost]
        public async Task<JsonResult> GetWebPushClickStream([FromBody] UCP_GetWebPushClickStreamDto UCPDto)
        {

            List<MLWebPushTemplate> webpushDetails = null;

            using (var objDL = DLUCP.GetDLUCP(UCPDto.accountId, SQLProvider))
            {
                webpushDetails = (await objDL.GetGetWebPushClickStream(UCPDto.P5WebPushUniqueID)).ToList();
            }

            return Json(webpushDetails);
        }
        [HttpPost]
        public async Task<ActionResult> GetCaptureFormDetailsClickStream([FromBody] UCP_GetCaptureFormDetailsClickStreamDto UCPDto)
        {
            DataSet resultSet;
            using (var objDL = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
            {
                resultSet = await objDL.ClickStreamGetCaptureFormDetails(UCPDto.machineid, UCPDto.sessionid);
            }

            var getdata = JsonConvert.SerializeObject(resultSet, Formatting.Indented);
            return Content(getdata.ToString(), "application/json");
        }
        [HttpPost]
        public async Task<JsonResult> GetScroingDetailss([FromBody] UCP_GetScroingDetailssDto UCPDto)
        {
            MLUCPVisitor mLUCPVisitor = new MLUCPVisitor();
            Helper.CopyWithDateTimeWhenString(UCPDto.mLUCPVisitor, mLUCPVisitor);
            List<MLLeadScroinghistroy> getscroingdetails = null;
            DataSet resultSet;


            using (var objDL = DLUCP.GetDLUCP(UCPDto.AccountId, SQLProvider))
            {
                getscroingdetails = (await objDL.GetscroingDetails( mLUCPVisitor)).ToList();
            }
            return Json(getscroingdetails);
        }
    }
}

