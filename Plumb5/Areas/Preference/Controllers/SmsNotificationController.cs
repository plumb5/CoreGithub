using Microsoft.AspNetCore.Mvc;
using P5GenralDL;
using P5GenralML;
using Plumb5.Areas.Preference.Dto;
using Plumb5.Areas.SegmentBuilder.Models;
using Plumb5.Controllers;
using Plumb5.Dto;
using Plumb5GenralFunction;

namespace Plumb5.Areas.Preference.Controllers
{
    [Area("Preference")]
    public class SmsNotificationController : BaseController
    {
        public SmsNotificationController(IConfiguration _configuration) : base(_configuration)
        { }
        public ActionResult Index()
        {
            return View("SmsNotification");
        }
        [HttpPost]
        public async Task<ActionResult> GetMaxCount([FromBody] SmsNotification_GetMaxCountDto objDto)
        {
            int returnVal = 0;
            using (var objDL = DLSmsNotificationTemplate.GetDLSmsNotificationTemplate(objDto.AdsId, SQLProvider))
            {
                returnVal = await objDL.GetMaxCount();
            }
            return Json(new { returnVal });
        }
        [HttpPost]
        public async Task<ActionResult> GetTemplateList([FromBody] SmsNotification_GetTemplateListDto objDto)
        {
            List<SmsNotificationTemplate> mailTemplateList = null;

            using (var objDL = DLSmsNotificationTemplate.GetDLSmsNotificationTemplate(objDto.AdsId, SQLProvider))
            {
                mailTemplateList = await objDL.Get(objDto.OffSet, objDto.FetchNext);
            }

            return Json(new
            {
                Data = mailTemplateList,
                MaxJsonLength = Int32.MaxValue
            });

        }
        [HttpPost]
        public async Task<ActionResult> GetById([FromBody] SmsNotification_GetByIdDto objDto)
        {
            SmsNotificationTemplate mailTemplateList = null;

            using (var objDL = DLSmsNotificationTemplate.GetDLSmsNotificationTemplate(objDto.AdsId, SQLProvider))
            {
                mailTemplateList = await objDL.GetById(objDto.Id);
            }
            return Json(new
            {
                Data = mailTemplateList,
                MaxJsonLength = Int32.MaxValue
            });


        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> Update([FromBody] SmsNotification_UpdateDto objDto)
        {
            using (var objDL = DLSmsNotificationTemplate.GetDLSmsNotificationTemplate(objDto.AdsId, SQLProvider))
            {
                return Json(await objDL.Update(objDto.notificationTemplate));
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> UpdateStatus([FromBody] SmsNotification_UpdateStatusDto objDto)
        {
            using (var objDL = DLSmsNotificationTemplate.GetDLSmsNotificationTemplate(objDto.AdsId, SQLProvider))
            {
                return Json(await objDL.UpdateStatus(objDto.IsSmsNotificationEnabled));
            }
        }

        [Log]
        [HttpPost]
        public async Task<JsonResult> SendIndividualTestSMS([FromBody] SmsNotification_SendIndividualTestSMSDto objDto)
        {
            string MessageContent = objDto.MessageContentData;
            SmsConfiguration smsConfiguration = new SmsConfiguration();

            if (objDto.IsPromotionalOrTransactionalType)
            {
                using (var objDLSMSConfig = DLSmsConfiguration.GetDLSmsConfiguration(objDto.accountId, SQLProvider))
                {
                    smsConfiguration = await objDLSMSConfig.GetConfigurationDetailsForSending(true, IsDefaultProvider: true);
                }
            }
            else
            {
                using (var objDLSMSConfig = DLSmsConfiguration.GetDLSmsConfiguration(objDto.accountId, SQLProvider))
                {
                    smsConfiguration = await objDLSMSConfig.GetConfigurationDetailsForSending(false, IsDefaultProvider: true);
                }
            }

            bool SentStatus = false;
            string Message = "";
            string ResponseId = "";



            if (smsConfiguration != null && smsConfiguration.Id > 0)
            {
                if (!smsConfiguration.IsPromotionalOrTransactionalType && smsConfiguration.ProviderName.ToLower() == "everlytic")
                {
                    SentStatus = false;
                    Message = "You cannot send test sms for everlytic promotional";
                }
                else if (smsConfiguration.IsBulkSupported.HasValue && smsConfiguration.IsBulkSupported.Value)
                {
                    Contact contactDetails = new Contact() { PhoneNumber = objDto.PhoneNumber };

                    using (var objDL = DLContact.GetContactDetails(objDto.accountId, SQLProvider))
                    {
                        contactDetails = await objDL.GetDetails(contactDetails, null, true);
                    }

                    if (contactDetails == null)
                    {
                        contactDetails = new Contact() { PhoneNumber = objDto.PhoneNumber };
                    }



                    if (MessageContent != null)
                    {
                        MessageContent = System.Web.HttpUtility.HtmlDecode(objDto.MessageContentData);

                        string P5UniqueID = Guid.NewGuid().ToString();
                        HelperForSMS HelpSMS = new HelperForSMS(objDto.accountId, SQLProvider);

                        if (MessageContent.Contains("[{*") && MessageContent.Contains("*}]"))
                        {
                            SentStatus = false;
                            Message = "Template dynamic content not replaced";
                        }
                        else
                        {
                            bool IsUnicodeMessage = Helper.ContainsUnicodeCharacter(MessageContent);
                            List<SmsSent> smsSentList = new List<SmsSent>();
                            SmsSent smsSent = new SmsSent()
                            {
                                CampaignJobName = "campaign",
                                ContactId = contactDetails.ContactId,
                                GroupId = 0,
                                MessageContent = MessageContent,
                                PhoneNumber = contactDetails.PhoneNumber,
                                SmsSendingSettingId = 0,
                                SmsTemplateId = 0,
                                VendorName = smsConfiguration.ProviderName,
                                IsUnicodeMessage = IsUnicodeMessage,
                                VendorTemplateId = objDto.VendorRegisteredTemplateId
                            };
                            smsSentList.Add(smsSent);

                            //IBulkSmsSending SmsGeneralBaseFactory = Plumb5GenralFunction.SmsGeneralBaseFactory.GetSMSVendor(accountId, smsConfiguration, "campaign");
                            //SentStatus = SmsGeneralBaseFactory.SendBulkSms(smsSentList);
                            //Message = SmsGeneralBaseFactory.ErrorMessage;

                            //if (SmsGeneralBaseFactory.VendorResponses != null && SmsGeneralBaseFactory.VendorResponses.Count > 0)
                            //{
                            //    ResponseId = SmsGeneralBaseFactory.VendorResponses[0].ResponseId;
                            //    Helper.Copy(SmsGeneralBaseFactory.VendorResponses[0], smsSent);

                            //    smsSent.SentDate = DateTime.Now;
                            //    smsSent.IsDelivered = 0;
                            //    smsSent.IsClicked = 0;
                            //    smsSent.Operator = null;
                            //    smsSent.Circle = null;
                            //    smsSent.DeliveryTime = null;
                            //    smsSent.SmsConfigurationNameId = smsConfiguration.SmsConfigurationNameId;
                            //    using (var objDL = DLSmsSent.GetDLSmsSent(accountId, SQLProvider))
                            //    {
                            //        await objDL.Save(smsSent);
                            //    }
                            //}
                        }
                    }
                    else
                    {
                        SentStatus = false;
                        Message = "Template not found";
                    }
                }
            }
            else
            {
                SentStatus = false;
                Message = "You have not configured for sms";
            }
            return Json(new { SentStatus, Message, MessageContent, ResponseId });
        }
    }
}
