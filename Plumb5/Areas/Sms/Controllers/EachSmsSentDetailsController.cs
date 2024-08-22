using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Controllers;
using Plumb5GenralFunction;
using Plumb5.Areas.Sms.Models;
using Plumb5.Areas.Sms.Dto;
namespace Plumb5.Areas.Sms.Controllers
{
    [Area("Sms")]
    public class EachSmsSentDetailsController : BaseController
    {
        public EachSmsSentDetailsController(IConfiguration _configuration) : base(_configuration)
        { }

        [HttpPost]
        public async Task<JsonResult> EachSmsDetails([FromBody] EachSmsSentDetails_EachSmsDetailsDto objDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));
            List<MLSmsSentEachDetails> historyDetails = null;
            using (var objDL =DLEngagementClickStreamDetails.GetDLEngagementClickStreamDetails(domainDetails.AdsId,SQLProvider))
            {
                historyDetails =await objDL.EachSmsSentDetails(objDto.PhoneNumber);
                if (historyDetails != null && historyDetails.Count > 0)
                {
                    for (int i = 0; i < historyDetails.Count; i++)
                        historyDetails[i].PhoneNumber = !String.IsNullOrEmpty(historyDetails[i].PhoneNumber) ? Helper.MaskPhoneNumber(historyDetails[i].PhoneNumber) : historyDetails[i].PhoneNumber;
                }
            }
            return Json(historyDetails);
        }
        [HttpPost]
        public async Task<JsonResult> ClickStreamCampaignSmsHistory([FromBody] EachSmsSentDetails_ClickStreamCampaignSmsHistoryDto objDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            List<Contact> contactList;
            List<MLSmsSentEachDetails> historyDetails = new List<MLSmsSentEachDetails>();
            List<string> PhoneNumberList = new List<string>();
            Contact contact = new Contact();

            if (objDto.ContactIds != null && objDto.ContactIds.Length > 0)
            {
                using (var objcontact = DLContact.GetContactDetails(domainDetails.AdsId,SQLProvider))
                {
                    List<string> fieldname = new List<string> { "PhoneNumber", "AlternatePhoneNumbers" };
                    contactList =(await objcontact.GET(contact, 0, 0, 0, 0, string.Join(",", objDto.ContactIds), fieldname, true, 0)).ToList();
                }

                if (contactList != null && contactList.Count > 0)
                {
                    //the below line will add PhoneNumber 
                    PhoneNumberList.AddRange(contactList.Where(x => !string.IsNullOrEmpty(x.PhoneNumber)).Select(x => x.PhoneNumber));
                    //the below line will add AlternatePhoneNumbers if separated by comma as well as single AlternatePhoneNumber
                    PhoneNumberList.AddRange(contactList.Where(x => !string.IsNullOrEmpty(x.AlternatePhoneNumbers)).SelectMany(x => x.AlternatePhoneNumbers.Split(',').ToList()).ToList());
                }
            }

            if (PhoneNumberList.Count > 0)
            {
                PhoneNumberList = PhoneNumberList.Where(x => !string.IsNullOrEmpty(x)).Select(x => x).Distinct().ToList();

                foreach (var eachPhoneNumber in PhoneNumberList)
                {
                    using (var objDL = DLEngagementClickStreamDetails.GetDLEngagementClickStreamDetails(domainDetails.AdsId,SQLProvider))
                    {
                        List<MLSmsSentEachDetails> smsSent =await objDL.EachSmsSentDetails(eachPhoneNumber);
                        if (smsSent != null && smsSent.Count > 0)
                        {
                            for (int i = 0; i < smsSent.Count; i++)
                            {
                                smsSent[i].Name = !String.IsNullOrEmpty(smsSent[i].Name) ? Helper.MaskName(smsSent[i].Name) : smsSent[i].Name;
                                smsSent[i].PhoneNumber = !String.IsNullOrEmpty(smsSent[i].PhoneNumber) ? Helper.MaskPhoneNumber(smsSent[i].PhoneNumber) : smsSent[i].PhoneNumber;
                            }
                        }
                        historyDetails.AddRange(smsSent);
                    }
                }
            }
            return Json(historyDetails);
        }
        [HttpPost]
        public async Task<JsonResult> ClickStreamIndividualSmsTrack([FromBody] EachSmsSentDetails_ClickStreamIndividualSmsTrackDto objDto)
        {
            DomainInfo? domainDetails = JsonConvert.DeserializeObject<DomainInfo>(HttpContext.Session.GetString("AccountInfo"));

            List<SmsTrackForIndividual> smstrackdetails = new List<SmsTrackForIndividual>();
            List<IndividualSmsSentDetails> IndividualSmsSentDetails = new List<IndividualSmsSentDetails>();

            List<Contact> contactList;
            List<string> PhoneNumberList = new List<string>();
            Contact contact = new Contact();

            if (objDto.ContactIds != null && objDto.ContactIds.Length > 0)
            {
                using (var objcontact = DLContact.GetContactDetails(domainDetails.AdsId,SQLProvider))
                {
                    List<string> fieldname = new List<string> { "PhoneNumber", "AlternatePhoneNumbers" };
                    contactList =(await objcontact.GET(contact, 0, 0, 0, 0, string.Join(",", objDto.ContactIds), fieldname, true, 0)).ToList();
                }

                if (contactList != null && contactList.Count > 0)
                {
                    //the below line will add PhoneNumber 
                    PhoneNumberList.AddRange(contactList.Where(x => !string.IsNullOrEmpty(x.PhoneNumber)).Select(x => x.PhoneNumber));
                    //the below line will add AlternatePhoneNumbers if separated by comma as well as single AlternatePhoneNumber
                    PhoneNumberList.AddRange(contactList.Where(x => !string.IsNullOrEmpty(x.AlternatePhoneNumbers)).SelectMany(x => x.AlternatePhoneNumbers.Split(',').ToList()).ToList());
                }
            }

            if (PhoneNumberList.Count > 0)
            {
                PhoneNumberList = PhoneNumberList.Where(x => !string.IsNullOrEmpty(x)).Select(x => x).Distinct().ToList();

                foreach (var eachPhoneNumber in PhoneNumberList)
                {
                    //using (var objDL = DLSmsTrackForIndividual.GetDLSmsTrackForIndividual(domainDetails.AdsId,SQLProvider))
                    //{
                    //    smstrackdetails.AddRange(await objDL.GetSmsTrackForIndividual(eachPhoneNumber));
                    //}
                }
            }
            if (smstrackdetails.Count > 0)
            {
                IndividualSmsSentDetails obj = new IndividualSmsSentDetails(domainDetails.AdsId,SQLProvider);
                IndividualSmsSentDetails =await obj.GetIndividualSmsHistoryDetails(smstrackdetails,SQLProvider);
            }
            return Json(IndividualSmsSentDetails);
        }
    }
}
