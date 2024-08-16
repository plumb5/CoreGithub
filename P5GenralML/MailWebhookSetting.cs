using System;

namespace P5GenralML
{
    public class MailWebhookSetting
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public bool? Status { get; set; }
        public string WebHookUrl { get; set; }
        public string WebHookFinalUrl { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public string WebHookCondition { get; set; }
    }


}
