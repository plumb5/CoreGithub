using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5.Dto;
using Plumb5GenralFunction;
using System.Text;

namespace Plumb5.Controllers
{
    public class SendWhatsAppToContactController : BaseController
    {
        public SendWhatsAppToContactController(IConfiguration _configuration) : base(_configuration)
        { }
        //
        // GET: /SendWhatsAppToContact/

        public IActionResult Index()
        {
            return View();
        }

        public async Task<JsonResult> ScheduleOrSendWhatsApp([FromBody] SendWhatsAppToContact_ScheduleOrSendWhatsAppDto SendWhatsAppToContactDto)
        {
            bool Result = false;
            string Message = "";

            LoginInfo? user = JsonConvert.DeserializeObject<LoginInfo>(HttpContext.Session.GetString("UserInfo"));
            Contact contactnew = new Contact() { ContactId = SendWhatsAppToContactDto.whatsappcontact.ContactId };

            if (SendWhatsAppToContactDto.SendType == 1)
            {
                SendWhatsAppToContactDto.ReminderDetails.UserInfoUserId = user.UserId;
                SendWhatsAppToContactDto.ReminderDetails.LmsGroupMemberId = SendWhatsAppToContactDto.lmsgroupmemberid;
                SendWhatsAppToContactDto.ReminderDetails.Score = SendWhatsAppToContactDto.Score;
                SendWhatsAppToContactDto.ReminderDetails.LeadLabel = SendWhatsAppToContactDto.LeadLabel;
                SendWhatsAppToContactDto.ReminderDetails.Publisher = SendWhatsAppToContactDto.Publisher;
                ContactMailSMSReminderDetails ReminderDetails = new ContactMailSMSReminderDetails();
                Helper.CopyWithDateTimeWhenString(SendWhatsAppToContactDto.ReminderDetails, ReminderDetails);

                if (SendWhatsAppToContactDto.ReminderDetails.Id == 0)
                {
                    if (String.IsNullOrEmpty(SendWhatsAppToContactDto.ReminderDetails.Name))
                        SendWhatsAppToContactDto.ReminderDetails.Name = contactnew.Name;

                    using (var objDL =   DLContactMailSMSReminderDetails.GetDLContactMailSMSReminderDetails(SendWhatsAppToContactDto.accountId,SQLProvider))
                        SendWhatsAppToContactDto.ReminderDetails.Id = await objDL.SaveScheduledAlerts( ReminderDetails);

                    if (SendWhatsAppToContactDto.ReminderDetails.Id > 0)
                        Result = true;
                    else
                        Result = false;
                }
                else
                {
                    using (var objDL = DLContactMailSMSReminderDetails.GetDLContactMailSMSReminderDetails(SendWhatsAppToContactDto.accountId, SQLProvider))
                        Result = await objDL.UpdateScheduledSmsAlerts(ReminderDetails);
                }
            }
            else
            {
                WhatsAppConfiguration whatsappConfiguration = new WhatsAppConfiguration();
                bool SentStatus = false;
                string UserAttributeMessageDetails = "";
                string UserButtonOneDynamicURLDetails = "";
                string UserButtonTwoDynamicURLDetails = "";
                string MediaURLDetails = "";
                string langcode = "";
                WhatsappSent watsAppSent = new WhatsappSent();
                string P5WhatsappUniqueID = Guid.NewGuid().ToString();
                List<WhatsAppTemplateUrl> whatsappUrlList = new List<WhatsAppTemplateUrl>();

                using (var objDL =   DLWhatsAppConfiguration.GetDLWhatsAppConfiguration(SendWhatsAppToContactDto.accountId,SQLProvider))
                {
                    whatsappConfiguration = await objDL.GetConfigurationDetailsForSending(SendWhatsAppToContactDto.WhatsAppConfigurationNameId, true);
                }

                if (whatsappConfiguration != null && whatsappConfiguration.Id > 0)
                {
                    Contact contactDetails = new Contact() { PhoneNumber = SendWhatsAppToContactDto.whatsappcontact.PhoneNumber };

                    using (var objDL =   DLContact.GetContactDetails(SendWhatsAppToContactDto.accountId, SQLProvider))
                        contactDetails = await objDL.GetDetails(contactDetails, null, true);

                    if (contactDetails == null)
                        contactDetails = new Contact() { PhoneNumber = SendWhatsAppToContactDto.whatsappcontact.PhoneNumber, CountryCode = whatsappConfiguration.CountryCode };

                    if (contactDetails != null && string.IsNullOrEmpty(contactDetails.CountryCode))
                        contactDetails.CountryCode = whatsappConfiguration.CountryCode;

                    WhatsAppTemplates whatsapptemplateDetails;

                    using (var objDLTemplate =   DLWhatsAppTemplates.GetDLWhatsAppTemplates(SendWhatsAppToContactDto.accountId,SQLProvider))
                        whatsapptemplateDetails =await objDLTemplate.GetSingle(SendWhatsAppToContactDto.TemplateId);

                    using (var objsmstempUrl =   DLWhatsappTemplateUrl.GetDLWhatsappTemplateUrl(SendWhatsAppToContactDto.accountId, SQLProvider))
                        whatsappUrlList = await objsmstempUrl.GetDetail(SendWhatsAppToContactDto.TemplateId);

                    if (whatsapptemplateDetails != null)
                    {
                        WhatsAppLanguageCodes whatsapplanguagecodes;

                        using (var objDLTemplate =   DLWhatsAppLanguageCodes.GetDLWhatsAppLanguageCodes(SendWhatsAppToContactDto.accountId,SQLProvider))
                            whatsapplanguagecodes = await objDLTemplate.GetWhatsAppShortenLanguageCode(whatsappConfiguration.ProviderName, whatsapptemplateDetails.TemplateLanguage);

                        UserAttributeMessageDetails = "";
                        UserButtonOneDynamicURLDetails = "";
                        UserButtonTwoDynamicURLDetails = "";

                        HelperForSMS HelpSMS = new HelperForSMS(SendWhatsAppToContactDto.accountId,SQLProvider);
                        HelperForWhatsApp HelpWhatsApp = new HelperForWhatsApp(SendWhatsAppToContactDto.accountId, SQLProvider);
                        StringBuilder UserAttrBodydata = new StringBuilder();
                        StringBuilder UserButtonOneBodydata = new StringBuilder();
                        StringBuilder UserButtonTwoBodydata = new StringBuilder();
                        StringBuilder MediaUrlBodyData = new StringBuilder();

                        if (!string.IsNullOrEmpty(whatsapptemplateDetails.UserAttributes))
                        {
                            UserAttrBodydata.Append(whatsapptemplateDetails.UserAttributes);
                            HelpWhatsApp.ReplaceMessageWithWhatsAppUrl(SendWhatsAppToContactDto.CampaignJobName, UserAttrBodydata, 0, contactDetails.ContactId, whatsappUrlList, P5WhatsappUniqueID, 0, true);
                            HelpSMS.ReplaceContactDetails(UserAttrBodydata, contactDetails, SendWhatsAppToContactDto.accountId, "", SendWhatsAppToContactDto.TemplateId, 0, P5WhatsappUniqueID, "whatsapp", whatsapptemplateDetails.ConvertLinkToShortenUrl);

                            UserAttributeMessageDetails = UserAttrBodydata.ToString();
                        }

                        if (!string.IsNullOrEmpty(whatsapptemplateDetails.ButtonOneDynamicURLSuffix))
                        {
                            UserButtonOneBodydata.Append(whatsapptemplateDetails.ButtonOneDynamicURLSuffix);

                            ConvertWhatsAppURLToShortenCode helpconvert = new ConvertWhatsAppURLToShortenCode(SendWhatsAppToContactDto.accountId, SQLProvider);
                            helpconvert.GenerateShortenLinkByUrl(UserButtonOneBodydata, contactDetails, Convert.ToInt32(SendWhatsAppToContactDto.TemplateId), 0, P5WhatsappUniqueID);
                            HelpWhatsApp.ReplaceMessageWithWhatsAppUrl(SendWhatsAppToContactDto.CampaignJobName, UserButtonOneBodydata, 0, contactDetails.ContactId, whatsappUrlList, P5WhatsappUniqueID, 0);
                            HelpSMS.ReplaceContactDetails(UserButtonOneBodydata, contactDetails, SendWhatsAppToContactDto.accountId, "", SendWhatsAppToContactDto.TemplateId, 0, P5WhatsappUniqueID, "whatsapp", whatsapptemplateDetails.ConvertLinkToShortenUrl);
                            UserButtonOneDynamicURLDetails = UserButtonOneBodydata.ToString();
                        }

                        if (!string.IsNullOrEmpty(whatsapptemplateDetails.ButtonTwoDynamicURLSuffix))
                        {
                            UserButtonTwoBodydata.Append(whatsapptemplateDetails.ButtonTwoDynamicURLSuffix);
                            ConvertWhatsAppURLToShortenCode helpconvert = new ConvertWhatsAppURLToShortenCode(SendWhatsAppToContactDto.accountId, SQLProvider);
                            helpconvert.GenerateShortenLinkByUrl(UserButtonTwoBodydata, contactDetails, Convert.ToInt32(SendWhatsAppToContactDto.TemplateId), 0, P5WhatsappUniqueID);
                            HelpWhatsApp.ReplaceMessageWithWhatsAppUrl(SendWhatsAppToContactDto.CampaignJobName, UserButtonTwoBodydata, 0, contactDetails.ContactId, whatsappUrlList, P5WhatsappUniqueID);
                            HelpSMS.ReplaceContactDetails(UserButtonTwoBodydata, contactDetails, SendWhatsAppToContactDto.accountId, "", SendWhatsAppToContactDto.TemplateId, 0, P5WhatsappUniqueID, "whatsapp", whatsapptemplateDetails.ConvertLinkToShortenUrl);
                            UserButtonTwoDynamicURLDetails = UserButtonTwoBodydata.ToString();
                        }

                        if (!string.IsNullOrEmpty(whatsapptemplateDetails.MediaFileURL))
                        {
                            MediaUrlBodyData.Append(whatsapptemplateDetails.MediaFileURL);
                            HelpSMS.ReplaceContactDetails(MediaUrlBodyData, contactDetails, SendWhatsAppToContactDto.accountId, "", SendWhatsAppToContactDto.TemplateId, 0, P5WhatsappUniqueID, "whatsapp", whatsapptemplateDetails.ConvertLinkToShortenUrl);
                            MediaURLDetails = MediaUrlBodyData.ToString();
                        }

                        if (whatsapplanguagecodes != null && !string.IsNullOrEmpty(whatsapplanguagecodes.ShortenLanguageCode))
                            langcode = whatsapplanguagecodes.ShortenLanguageCode;

                        if (UserAttributeMessageDetails.Contains("[{*") && UserAttributeMessageDetails.Contains("*}]"))
                        {
                            Result = false;
                            Message = "User Attributes dynamic content not replaced";
                        }
                        else if (UserButtonOneDynamicURLDetails.Contains("[{*") && UserButtonOneDynamicURLDetails.Contains("*}]"))
                        {
                            Result = false;
                            Message = "Template button one dynamic url content not replaced";
                        }
                        else if (UserButtonTwoDynamicURLDetails.Contains("[{*") && UserButtonTwoDynamicURLDetails.Contains("*}]"))
                        {
                            Result = false;
                            Message = "Template button two dynamic url content not replaced";
                        }
                        else
                        {
                            List<MLWhatsappSent> whatsappSentList = new List<MLWhatsappSent>();

                            MLWhatsappSent mlwatsappsent = new MLWhatsappSent()
                            {
                                MediaFileURL = MediaURLDetails,
                                CountryCode = contactDetails.CountryCode,
                                PhoneNumber = contactDetails.PhoneNumber,
                                WhiteListedTemplateName = whatsapptemplateDetails.WhitelistedTemplateName,
                                LanguageCode = langcode,
                                UserAttributes = UserAttributeMessageDetails,
                                ButtonOneText = whatsapptemplateDetails.ButtonOneText,
                                ButtonTwoText = whatsapptemplateDetails.ButtonTwoText,
                                ButtonOneDynamicURLSuffix = UserButtonOneDynamicURLDetails,
                                ButtonTwoDynamicURLSuffix = UserButtonTwoDynamicURLDetails,
                                CampaignJobName = SendWhatsAppToContactDto.CampaignJobName,
                                ContactId = contactDetails.ContactId,
                                GroupId = 0,
                                MessageContent = whatsapptemplateDetails.TemplateContent,
                                WhatsappSendingSettingId = 0,
                                WhatsappTemplateId = SendWhatsAppToContactDto.TemplateId,
                                VendorName = whatsappConfiguration.ProviderName,
                                P5WhatsappUniqueID = P5WhatsappUniqueID
                            };
                            whatsappSentList.Add(mlwatsappsent);

                            IBulkWhatsAppSending WhatsAppGeneralBaseFactory = Plumb5GenralFunction.WhatsAppGeneralBaseFactory.GetWhatsAppVendor(SendWhatsAppToContactDto.accountId, whatsappConfiguration, SendWhatsAppToContactDto.CampaignJobName);
                            SentStatus = WhatsAppGeneralBaseFactory.SendWhatsApp(whatsappSentList);
                            Message = WhatsAppGeneralBaseFactory.ErrorMessage;

                            if (SentStatus && WhatsAppGeneralBaseFactory.VendorResponses != null && WhatsAppGeneralBaseFactory.VendorResponses.Count > 0)
                            {
                                Helper.Copy(WhatsAppGeneralBaseFactory.VendorResponses[0], watsAppSent);

                                watsAppSent.UserAttributes = UserAttributeMessageDetails;
                                watsAppSent.ButtonOneDynamicURLSuffix = UserButtonOneDynamicURLDetails;
                                watsAppSent.ButtonTwoDynamicURLSuffix = UserButtonTwoDynamicURLDetails;
                                watsAppSent.MediaFileURL = MediaURLDetails;
                                watsAppSent.IsDelivered = 0;
                                watsAppSent.IsClicked = 0;
                                watsAppSent.P5WhatsappUniqueID = P5WhatsappUniqueID;
                                watsAppSent.WhatsAppConfigurationNameId = whatsappConfiguration.WhatsAppConfigurationNameId;
                                watsAppSent.Score = SendWhatsAppToContactDto.Score;
                                watsAppSent.LeadLabel = SendWhatsAppToContactDto.LeadLabel;
                                watsAppSent.Publisher = SendWhatsAppToContactDto.Publisher;
                                watsAppSent.LmsGroupMemberId = SendWhatsAppToContactDto.lmsgroupmemberid;
                                watsAppSent.UserInfoUserId = user.UserId;
                                using (var objDL =   DLWhatsAppSent.GetDLWhatsAppSent(SendWhatsAppToContactDto.accountId, SQLProvider))
                                    await objDL.Save(watsAppSent);

                                Result = true;
                                Message = "WhatsApp has been sent.";
                            }
                            else
                            {
                                Result = false;
                                Message = "WhatsApp Message has not been sent - " + Message + "";
                            }
                        }
                    }
                    else
                    {
                        Result = false;
                        Message = "Template not found";
                    }
                }
                else
                {
                    Result = false;
                    Message = "You have not configured for WhatsApp";
                }
            }

            return Json(new { Result, Message } );
        }

    }
}
