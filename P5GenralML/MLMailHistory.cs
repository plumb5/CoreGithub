using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLMailHistory
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public long MailSendingSettingId { get; set; }
        public long MailCampaignId { get; set; }

        public string? EmailId { get; set; }
        public int MailScoreCondition { get; set; }
        public int MailTemplateId { get; set; }

        public int TotalSent { get; set; }
        public int TotalTemplate { get; set; }
        public int Opened { get; set; }
        public int Clicked { get; set; }
        public int Forward { get; set; }
        public int Unsubscribe { get; set; }
        public string? Subject { get; set; }
        public Nullable<DateTime> SentDate { get; set; }
        public string? TemplateName { get; set; }
        public int ContactId { get; set; }
    }
}
