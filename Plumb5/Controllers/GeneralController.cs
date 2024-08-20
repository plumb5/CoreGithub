using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Dto;
using Plumb5GenralFunction;

namespace Plumb5.Controllers
{
    public class GeneralController : BaseController
    {
        public GeneralController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /General/

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<JsonResult> GetActiveEmailIds([FromBody] General_GetActiveEmailIdsDto commonDetails)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            List<string> ListOfFromEmailds = new List<string>();
            var fromemailConfig = new FromEmailIdConfig(commonDetails.accountId, SQLProvider);

            List<MailConfigForSending> listOfEmailIds = await fromemailConfig.GetActiveEmails();

            ListOfFromEmailds = (from p in listOfEmailIds
                                 where p.FromEmailId == user.EmailId || p.ShowFromEmailIdBasedOnUserLogin == true
                                 select p.FromEmailId).ToList();
            return Json(new { Data = ListOfFromEmailds });
        }

        [HttpPost]
        public async Task<JsonResult> GetAllTemplateList([FromBody] General_GetActiveEmailIdsDto commonDetails)
        {
            MailTemplate template = new MailTemplate();
            List<MailTemplate> mailTemplateList = null;
            List<string> fields = new List<string>() { "Id", "Name", "MailCampaignId", "SubjectLine" };
            using (var objDL = DLMailTemplate.GetDLMailTemplate(commonDetails.accountId, SQLProvider))
            {
                mailTemplateList = await objDL.GET(template, 0, 0, null, fields);
                return Json(new { Data = mailTemplateList });
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetTemplateList([FromBody] General_GetActiveEmailIdsDto commonDetails)
        {
            using (var objDL = DLSmsTemplate.GetDLSmsTemplate(commonDetails.accountId, SQLProvider))
            {
                return Json(await objDL.GetTemplateDetails(new SmsTemplate()));
            }
        }

        [HttpPost]
        public async Task<JsonResult> GetUserLoginFullDetails()
        {
            if (HttpContext.Session.GetString("UserInfo") != null)
            {
                LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));

                UserInfo? userInfo = null;
                using (var objUserInfo = DLUserInfo.GetDLUserInfo(SQLProvider))
                {
                    userInfo = await objUserInfo.GetDetail(user.UserId);
                }

                return Json(userInfo);
            }
            return null;
        }

        [HttpPost]
        public async Task<JsonResult> GetContactDetails([FromBody] General_GetContactDetails commonDetails)
        {
            MLLeadsDetails? leaddetails = new MLLeadsDetails();
            Contact? contact = new Contact();
            contact.EmailId = commonDetails.EmailId;
            contact.PhoneNumber = commonDetails.PhoneNumber;
            bool AssociatedUserStatus = false; //Status To check Contact Assigned to Login User
            using (var objDL = DLContact.GetContactDetails(commonDetails.AccountId, SQLProvider))
            {
                contact = await objDL.GetContactDetailsByEmailIdPhoneNumber(contact);
            }
            if (contact != null)
            {
                List<MLUserHierarchy> userHierarchy = new List<MLUserHierarchy>();
                using (var objUserHierarchy = DLUserHierarchy.GetDLUserHierarchy(SQLProvider))
                {
                    userHierarchy = await objUserHierarchy.GetHisUsers(commonDetails.UserId, commonDetails.AccountId);
                    userHierarchy.Add(await objUserHierarchy.GetHisDetails(commonDetails.UserId));
                }
                userHierarchy = userHierarchy.GroupBy(x => x.UserInfoUserId).Select(x => x.First()).ToList();

                List<int> usersId = new List<int>();
                if (userHierarchy != null)
                    usersId = userHierarchy.Select(x => x.UserInfoUserId).Distinct().ToList();

                foreach (int UID in usersId)
                {
                    //here we have changed the code to 0 beacuse if we add contact in contact section it wont be visible so we are giving an option to add it in lms leads
                    if (UID == contact.UserInfoUserId || contact.UserInfoUserId == 0)
                    {
                        AssociatedUserStatus = true;
                        break;
                    }
                }
                if (!AssociatedUserStatus)
                    contact = null;

                using (var objDL = DLLmsCustomReport.GetDLLmsCustomReport(commonDetails.AccountId, SQLProvider))
                    leaddetails = await objDL.GetLmsGrpDetailsByContactId(contact.ContactId, 0);
            }
            else
            {
                AssociatedUserStatus = true;
            }
            return Json(new { contact, AssociatedUserStatus, leaddetails });
        }

        [HttpPost]
        public async Task<JsonResult> GetContactExtraField([FromBody] General_GetContactExtraField commonDetails)
        {

            List<ContactExtraField> ExtraContactFields = new List<ContactExtraField>();
            using (var objBAL = DLContactExtraField.GetDLContactExtraField(commonDetails.AccountId, SQLProvider))
            {
                ExtraContactFields = await objBAL.GetList();
            }

            return Json(ExtraContactFields);
        }

        [HttpPost]
        public async Task<JsonResult> GetLmsContactDetailsForUpdate([FromBody] General_GetLmsContactDetailsForUpdate commonDetails)
        {
            using (var objDL = DLLmsCustomReport.GetDLLmsCustomReport(commonDetails.AccountId, SQLProvider))
                return Json(await objDL.GetLmsGrpDetailsByContactId(commonDetails.ContactId, commonDetails.LmsGroupId));
        }
    }
}
