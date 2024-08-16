using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLCustomDashboardMailAlertNew
    {
        public int UniqueVisitors { get; set; }
        public int Sessions { get; set; }
        public int PageViews { get; set; }
        public int NewVisitors { get; set; }
        public int RepeatVisitors { get; set; }
        public int ReturningVisitors { get; set; }

        public int EmbeddedFormLeads { get; set; }
        public int PopUpFormLeads { get; set; }
        public int TaggedFormLeads { get; set; }

        public int TotalMailCampaigns { get; set; }
        public int TotalMailSent { get; set; }
        public int TotalMailOpened { get; set; }
        public int TotalMailClicked { get; set; }
        public int TotalMailBounced { get; set; }

        public int TotalSmsCampaigns { get; set; }
        public int TotalSmsSent { get; set; }
        public int TotalSmsDelivered { get; set; }
        public int TotalSmsClicked { get; set; }
        public int TotalSmsBounced { get; set; }

        public int TotalNewLeads { get; set; }
        public int TotalNewWebSubscribers { get; set; }
    }
}
