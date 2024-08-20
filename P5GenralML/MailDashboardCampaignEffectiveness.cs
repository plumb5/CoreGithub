using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MailDashboardCampaignEffectiveness
    {
        public string? CampaignIdentifier { get; set; }
        public string? CampaignName { get; set; }
        public string? TemplateName { get; set; }
        public int Opened { get; set; }
        public int Clicked { get; set; }
        public int TotalSent { get; set; }
    }
}
