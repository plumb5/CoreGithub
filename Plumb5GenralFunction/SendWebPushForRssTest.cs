using P5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class ResponseMessage
    {
        public bool Status { get; set; }
        public string Message { get; set; }
    }

    public class SendWebPushForRssTest
    {
        private readonly int AdsId;
        private readonly WebPushRssFeed webPushRssFeed;
        private readonly string sqlVendor;
        HelperForSMS helper;
        public SendWebPushForRssTest(int adsId, WebPushRssFeed webPushRssFeeds, string sqlVendor)
        {
            AdsId = adsId;
            webPushRssFeed = webPushRssFeeds;
            this.sqlVendor = sqlVendor;
            helper = new HelperForSMS(adsId, sqlVendor);
        }

        public async Task<ResponseMessage> SendWebPush(WebPushUser webPushUser, RSSFeedModel rSSFeedModel)
        {
            ResponseMessage responseMessage = new ResponseMessage();
            StringBuilder MessageContent = new StringBuilder();
            StringBuilder titleContent = new StringBuilder();

            try
            {
                if (rSSFeedModel != null && !String.IsNullOrEmpty(rSSFeedModel.Title) && !String.IsNullOrEmpty(rSSFeedModel.Description) && !String.IsNullOrEmpty(rSSFeedModel.RedirectTo) && !String.IsNullOrEmpty(rSSFeedModel.RssPubDate))
                {
                    MessageContent.Clear().Append(rSSFeedModel.Description);
                    titleContent.Clear().Append(rSSFeedModel.Title);

                    if (webPushUser.ContactId > 0)
                    {
                        Contact? contact = new Contact() { ContactId = webPushUser.ContactId };
                        using (var bLContact = DLContact.GetContactDetails(AdsId, sqlVendor))
                            contact = await bLContact.GetContactDetails(contact);

                        if (contact != null)
                        {
                            await helper.ReplaceContactDetails(MessageContent, contact);
                            await helper.ReplaceContactDetails(titleContent, contact);
                        }
                    }


                    WebPushSettings? webpushSetting = null;
                    using (var objDL = DLWebPushSettings.GetDLWebPushSettings(AdsId, sqlVendor))
                        webpushSetting = await objDL.GetWebPushSettings();

                    if (webpushSetting != null)
                    {
                        WebPushSent webPushBulkSent = new WebPushSent()
                        {
                            MachineId = webPushUser.MachineId,
                            MessageTitle = titleContent.ToString(),
                            MessageContent = MessageContent.ToString(),
                            VapidEndpointUrl = webPushUser.VapidEndPointUrl,
                            VapidTokenkey = webPushUser.VapidTokenKey,
                            VapidAuthkey = webPushUser.VapidAuthKey,
                            FCMRegId = webPushUser.FCMRegId,
                            VendorName = "vapid",
                            BrowserName = webPushUser.BrowserName
                        };

                        WebPushTemplate webPushTemplate = new WebPushTemplate()
                        {
                            UserInfoUserId = webPushRssFeed.UserInfoUserId,
                            CampaignId = webPushRssFeed.CampaignId,
                            TemplateName = rSSFeedModel.Title,
                            TemplateDescription = "Rss Feed Campaign",
                            NotificationType = 1,
                            Title = titleContent.ToString(),
                            MessageContent = MessageContent.ToString(),
                            OnClickRedirect = rSSFeedModel.RedirectTo,
                            IsAutoHide = webPushRssFeed.IsAutoHide,
                            IsCustomBadge = webPushRssFeed.IsAndroidBadgeDefaultOrCustom,
                            BadgeImage = webPushRssFeed.ImageUrl,
                            IconImage = webPushRssFeed.UploadedIconUrl,
                            Button1_Label = "",
                            Button1_Redirect = "",
                            Button2_Label = "",
                            Button2_Redirect = "",
                            BannerImage = ""
                        };


                        IBulkWebPushSending SmsGeneralBaseFactory = Plumb5GenralFunction.WebPushGeneralBaseFactory.GetPushVendor(AdsId, 0, webpushSetting, "campaign");
                        bool result = SmsGeneralBaseFactory.SendSingleRssWebPush(0, webPushBulkSent, webPushTemplate);
                        if (result)
                        {
                            responseMessage.Status = true;
                            responseMessage.Message = "Notification sent successfully";
                        }
                        else
                        {
                            responseMessage.Status = false;
                            responseMessage.Message = SmsGeneralBaseFactory.ErrorMessage;
                        }
                    }
                    else
                    {
                        responseMessage.Status = false;
                        responseMessage.Message = "Configuration settings does not exists";
                    }
                }
                else
                {
                    responseMessage.Status = false;
                    responseMessage.Message = "There is no data found for this rss url";
                }
            }
            catch (Exception ex)
            {
                responseMessage.Status = false;
                responseMessage.Message = "Something went wrong on our end";
                ErrorUpdation.AddErrorLog("SendWebPushForTest", ex.Message, "Unable to send test push", DateTime.Now, "Plumb5.Areas.WebPush.Models-->SendWebPushForTest-->SendWebPush", ex.StackTrace);
            }

            return responseMessage;
        }
    }
}
