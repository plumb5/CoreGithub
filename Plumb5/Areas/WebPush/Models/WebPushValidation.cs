using P5GenralML;

namespace Plumb5.Areas.WebPush.Models
{
    public class WebPushValidation
    {
        public WebPushValidation()
        {
        }

        public bool WebPushTemplateValidation(WebPushTemplate webpushTemplate)
        {
            var result = true;
            if (webpushTemplate.UserInfoUserId == 0)
            {
                throw new ArgumentException("UserId missing");
            }
            else if (webpushTemplate.CampaignId == 0)
            {
                throw new ArgumentException("CampaignId missing");
            }
            else if (String.IsNullOrEmpty(webpushTemplate.TemplateName))
            {
                throw new ArgumentException("TemplateName missing");
            }
            else if (webpushTemplate.NotificationType == 0)
            {
                throw new ArgumentException("NotificationType missing");
            }
            else if (String.IsNullOrEmpty(webpushTemplate.Title))
            {
                throw new ArgumentException("Title missing");
            }
            else if (String.IsNullOrEmpty(webpushTemplate.MessageContent))
            {
                throw new ArgumentException("MessageContent missing");
            }
            else if (String.IsNullOrEmpty(webpushTemplate.IconImage))
            {
                throw new ArgumentException("IconImage missing");
            }
            else if (String.IsNullOrEmpty(webpushTemplate.OnClickRedirect))
            {
                throw new ArgumentException("OnClickRedirect missing");
            }
            else if (webpushTemplate.NotificationType == 2 && String.IsNullOrEmpty(webpushTemplate.BannerImage))
            {
                throw new ArgumentException("BannerImage missing");
            }
            else if (!String.IsNullOrEmpty(webpushTemplate.Button1_Label) && String.IsNullOrEmpty(webpushTemplate.Button1_Redirect))
            {
                throw new ArgumentException("Button1_Redirect missing");
            }
            else if (!String.IsNullOrEmpty(webpushTemplate.Button2_Label) && String.IsNullOrEmpty(webpushTemplate.Button2_Redirect))
            {
                throw new ArgumentException("Button2_Redirect missing");
            }
            return result;
        }

        public bool WebPushSendingSettingValidation(WebPushSendingSetting webpushSendingSetting)
        {
            DateTime dateTime;

            var result = true;
            if (webpushSendingSetting.UserInfoUserId == 0)
            {
                throw new ArgumentException("UserID missing");
            }
            else if (String.IsNullOrEmpty(webpushSendingSetting.Name))
            {
                throw new ArgumentException("Name missing");
            }
            else if (webpushSendingSetting.WebPushTemplateId == 0)
            {
                throw new ArgumentException("TemplateId missing");
            }
            else if (webpushSendingSetting.GroupId == 0)
            {
                throw new ArgumentException("GroupId missing");
            }
            else if (webpushSendingSetting.CampaignId == 0)
            {
                throw new ArgumentException("CampaignId missing");
            }

            else if (!DateTime.TryParse(webpushSendingSetting.ScheduledDate.ToString(), out dateTime))
            {

                throw new ArgumentException("ScheduledDate missing");
            }

            return result;
        }
    }
}
