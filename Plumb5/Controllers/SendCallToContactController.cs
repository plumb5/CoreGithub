using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Models;
using Plumb5GenralFunction;
using System.Collections.Specialized;
using System.Net.Mail;
using System.Text.RegularExpressions;
using System.Text;
using Newtonsoft.Json;
using System.Text.Encodings.Web;
using System;
using Plumb5.Dto;
using System.Data;

namespace Plumb5.Controllers
{
    public class SendCallToContactController : BaseController
    {
        public SendCallToContactController(IConfiguration _configuration) : base(_configuration)
        { }

        //
        // GET: /SendCallToContact/

        public ActionResult Index()
        {
            return View();
        }

        public async Task<JsonResult> GetDetailsForCall([FromBody] SendCallToContact_GetDetailsForCallDto SendCallToContactDto)
        {
            List<Contact> contacts = new List<Contact>();
            using (var objDL =   DLContact.GetContactDetails(SendCallToContactDto.accountId, SQLProvider))
            {
                contacts = (await objDL.GET(new Contact() { ContactId = SendCallToContactDto.ContactId }, 0, 0, 0, 0, null, null, null, 0)).ToList();
            }

            if (contacts.Count > 0)
            {
                foreach (var contact in contacts)
                {
                    contact.PhoneNumber = !String.IsNullOrEmpty(contact.PhoneNumber) ? Helper.MaskPhoneNumber(contact.PhoneNumber) : contact.PhoneNumber;
                }
            }

            bool isConfigured = false; string CountryCode = String.Empty;
            MLCallApiConfiguration callApiConfiguration = new MLCallApiConfiguration();
            using (var objApiConfig =   DLCallApiConfiguration.GetDLCallApiConfiguration(SendCallToContactDto.accountId, SQLProvider))
            {
                callApiConfiguration =   await objApiConfig.GetCallConfigurationDetails();
            }

            if (callApiConfiguration != null)
            {
                isConfigured = true;
                if (contacts.Count > 0)
                {
                    DataTable dtListOfResponsesData = new DataTable();
                    dtListOfResponsesData = Helper.ToDataTables(contacts);
                    if (!String.IsNullOrEmpty(callApiConfiguration.CountryCode))
                    {
                        for (int i = 0; i < dtListOfResponsesData.Rows.Count; i++)
                        {
                            if (!String.IsNullOrEmpty(Convert.ToString(dtListOfResponsesData.Rows[i][callApiConfiguration.CountryCode])))
                            {
                                CountryCode = Convert.ToString(dtListOfResponsesData.Rows[i][callApiConfiguration.CountryCode]);
                                break;
                            }
                            else
                                break;
                        }
                    }
                }
            }

            return Json(new { contacts = contacts, CountryCode = CountryCode, isConfigured = isConfigured } );
        }

        [Log]
        public async Task<JsonResult> ScheduleOrSendCall([FromBody] SendCallToContact_ScheduleOrSendCallDto SendCallToContactDto)
        {
            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            string VisitorPhoneNumber = SendCallToContactDto.VisitorPhoneNumber;
            if (SendCallToContactDto.VisitorPhoneNumber.Contains("*"))
            {
                Contact contact = new Contact();
                using (var objDL = DLContact.GetContactDetails(SendCallToContactDto.accountId, SQLProvider))
                {
                    contact = await objDL.GetContactDetails(new Contact() { ContactId = SendCallToContactDto.ContactId });
                }
                VisitorPhoneNumber = contact.PhoneNumber;
            }

            PhonecallCalling phoneCal = new PhonecallCalling(SendCallToContactDto.accountId, SendCallToContactDto.VisitorCountryCode + VisitorPhoneNumber, SendCallToContactDto.AgentCountryCode + SendCallToContactDto.AgentPhoneNumber, contactId: SendCallToContactDto.ContactId, lmsGroupId: SendCallToContactDto.LmsGroupId, score: SendCallToContactDto.Score, leadlabel: SendCallToContactDto.LeadLabel, AgentPhoneNumberWithoutCC: SendCallToContactDto.AgentPhoneNumber, userInfoUserId: user.UserId, campaignJobName: "lms", publisher: SendCallToContactDto.Publisher, lmsGroupMemberId: SendCallToContactDto.LmsGroupMemberId,SQLProvider);
            bool CallStatus = await phoneCal.Call();
            return Json(new { Result = CallStatus, ErrorMessage = phoneCal.ErrorMessage } );
        }
    }
}
