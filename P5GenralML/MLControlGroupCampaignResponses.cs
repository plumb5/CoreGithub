using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLControlGroupCampaignResponses
    {
        public string CampaignName { get; set; }
        public string GroupName { get; set; }
        public string EmailId { get; set; }
        public string SendStatus { get; set; }
        public string SendDate { get; set; }
        public string Opened { get; set; }
        public string OpenDate { get; set; }
        public string Clicked { get; set; }
        public string ClickedURL { get; set; }
        public string UnSubscribe { get; set; }
        public string UnsubscribeDate { get; set; }
        public string Bounced { get; set; }
        public string BouncedReason { get; set; }
        public string BouncedDate { get; set; }
    }
}
