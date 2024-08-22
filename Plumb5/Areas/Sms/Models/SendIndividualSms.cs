using P5GenralDL;
using P5GenralML;
using Plumb5GenralFunction;

namespace Plumb5.Areas.Sms.Models
{
    public class SentResponses
    {
        public string Message { get; set; }
        public bool SentStatus { get; set; }
        public string ResponseId { get; set; }
        public bool IsPromotionalTransactional { get; set; }
    }

    public class SendIndividualSms : IDisposable
    {
        readonly int AdsId;
        public SendIndividualSms(int adsId)
        {
            AdsId = adsId;
        }

        public async Task<SentResponses> ValidateSmsSettingss(SmsConfiguration smsConfiguration, string MessageContent, string PhoneNumber, bool IsSmsNotificationEnabled, string VendorTemplateId = null,string DbType=null)
        {
            SentResponses sentResponses = new SentResponses();
            if (smsConfiguration != null && smsConfiguration.Id > 0 && IsSmsNotificationEnabled)
            {
                if (!smsConfiguration.IsPromotionalOrTransactionalType && smsConfiguration.ProviderName.ToLower() == "everlytic")
                {
                    sentResponses.SentStatus = false;
                    sentResponses.Message = "You cannot send test sms for everlytic promotional";
                }
                else if (smsConfiguration.IsBulkSupported.HasValue && smsConfiguration.IsBulkSupported.Value)
                {
                    MessageContent = System.Web.HttpUtility.HtmlDecode(MessageContent);
                    string P5UniqueID = Guid.NewGuid().ToString();
                    List<SmsSent> smsSentList = new List<SmsSent>();
                    SmsSent smsSent = new SmsSent()
                    {
                        CampaignJobName = "campaign",
                        ContactId = 0,
                        GroupId = 0,
                        MessageContent = MessageContent,
                        PhoneNumber = PhoneNumber,
                        SmsSendingSettingId = 0,
                        SmsTemplateId = 0,
                        VendorName = smsConfiguration.ProviderName,
                        IsUnicodeMessage = false,
                        VendorTemplateId = VendorTemplateId
                    };
                    smsSentList.Add(smsSent);

                    IBulkSmsSending SmsGeneralBaseFactory = Plumb5GenralFunction.SmsGeneralBaseFactory.GetSMSVendor(AdsId, smsConfiguration, "campaign", DbType);
                    sentResponses.SentStatus = SmsGeneralBaseFactory.SendBulkSms(smsSentList);
                    sentResponses.Message = SmsGeneralBaseFactory.ErrorMessage;

                    if (SmsGeneralBaseFactory.VendorResponses != null && SmsGeneralBaseFactory.VendorResponses.Count > 0)
                    {
                        sentResponses.ResponseId = SmsGeneralBaseFactory.VendorResponses[0].ResponseId;
                        Helper.Copy(SmsGeneralBaseFactory.VendorResponses[0], smsSent);

                        smsSent.SentDate = DateTime.Now;
                        smsSent.IsDelivered = 0;
                        smsSent.IsClicked = 0;
                        smsSent.Operator = null;
                        smsSent.Circle = null;
                        smsSent.DeliveryTime = null;
                        smsSent.SmsConfigurationNameId = smsConfiguration.SmsConfigurationNameId;
                        using (var objDL = DLSmsSent.GetDLSmsSent(AdsId,DbType))
                        {
                            objDL.Save(smsSent);
                        }
                    }
                }
                else
                {
                    //SmsSetting smsSetting = new SmsSetting()
                    //{
                    //    IsPromotionalOrTransactionalType = smsConfiguration.IsPromotionalOrTransactionalType,
                    //    IsSchedule = false,
                    //    MessageContent = MessageContent,
                    //    SmsTemplateId = 0
                    //};

                    //SmsSentSavingDetials smsSentSavingDetials = new SmsSentSavingDetials()
                    //{
                    //    ConfigurationId = 0,
                    //    GroupId = 0
                    //};

                    //Contact contactDetails = new Contact() { PhoneNumber = PhoneNumber };

                    //SendSmsGeneral sendSMS = new SendSmsGeneral(AdsId, smsSetting, smsConfiguration, "CAMPAIGN", false, smsSentSavingDetials);
                    List<SmsSent> smsSentList = new List<SmsSent>();
                    SmsSent smsSent = new SmsSent()
                    {
                        CampaignJobName = "campaign",
                        ContactId = 0,
                        GroupId = 0,
                        MessageContent = MessageContent,
                        PhoneNumber = PhoneNumber,
                        SmsSendingSettingId = 0,
                        SmsTemplateId = 0,
                        VendorName = smsConfiguration.ProviderName,
                        IsUnicodeMessage = false,
                        VendorTemplateId = VendorTemplateId
                    };
                    smsSentList.Add(smsSent);
                    IBulkSmsSending SmsGeneralBaseFactory = Plumb5GenralFunction.SmsGeneralBaseFactory.GetSMSVendor(AdsId, smsConfiguration, "campaign",DbType);
                    sentResponses.SentStatus = SmsGeneralBaseFactory.SendBulkSms(smsSentList);
                    bool result = SmsGeneralBaseFactory.SendBulkSms(smsSentList);

                    //Task<bool> Status = sendSMS.SendSms(contactDetails, Guid.NewGuid().ToString());
                    sentResponses.SentStatus = result;




                    if (smsConfiguration.ProviderName.ToLower() == "justpalm")
                        smsSent.DeliveryTime = DateTime.Now;

                    smsSent.SmsConfigurationNameId = smsConfiguration.SmsConfigurationNameId;

                    using (var objDL =DLSmsSent.GetDLSmsSent(AdsId,DbType))
                    {
                       await objDL.Save(smsSent);
                    }
                }
            }
            else
            {
                sentResponses.SentStatus = false;
                sentResponses.Message = "You have not configured for sms";
            }

            return sentResponses;
        }


        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                }
            }
            disposed = true;
        }
        public void Dispose()
        {
            Dispose(true);
        }
        #endregion End of Dispose Method
    }
}