using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLCampaignCalendar
    {
        public int CampaignId { get; set; }
        public string CampaignTitle { get; set; }
        public string CampaignDescription { get; set; }
        public string CampaignType { get; set; }
        public int  ScheduledStatus { get; set; }
        public string TemplateName { get; set; }
        public string GroupName { get; set; }
        public DateTime ScheduledDate { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}

