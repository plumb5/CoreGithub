using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLWebPushReport
    {
        public int Id { get; set; }
        public string TemplateName { get; set; }
        public string CampaignName { get; set; }
        public string Name { get; set; }
        public string CampaignDescription { get; set; }
        public string SentTo { get; set; }
        public int TotalView { get; set; }
        public int TotalSent { get; set; }
        public int TotalClick { get; set; }
        public int TotalClose { get; set; }
        public int TotalNotSent { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public int TotalUnsubscribed { get; set; }
        public Nullable<DateTime> ScheduledDate { get; set; }
        public string StoppedReason { get; set; }

        public string NotificationType { get; set; }
        public string Title { get; set; }
        public string MessageContent { get; set; }
        public string OnClickRedirect { get; set; }
        public string Button1_Redirect { get; set; }
        public string Button2_Redirect { get; set; }

    }
}
