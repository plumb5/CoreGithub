using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLWhatsAppReport
    {

        public int Id { get; set; }
        public string TemplateName { get; set; }
        public string TemplateType { get; set; }
        public string CampaignName { get; set; }
        public string Name { get; set; }
        public string CampaignDescription { get; set; }
        public string SentTo { get; set; }
        public int TotalDelivered { get; set; }
        public int TotalSent { get; set; }
        public int TotalRead { get; set; }
        public int TotalClick { get; set; }
        public int TotalFailed { get; set; }
        public int TotalNotSent { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public int TotalUnsubscribed { get; set; }
        public Nullable<DateTime> ScheduledDate { get; set; }
        public int URL { get; set; }
        public int UniqueClick { get; set; }
        public int Click { get; set; }
        public string StoppedReason { get; set; }
        public string TemplateContent { get; set; }
        public string ConfigurationName { get; set; }

    }
}
