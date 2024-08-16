using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLSmsCampaign
    {

        public string? TemplateName { get; set; }
        public string? CampaignName { get; set; }
        public string? PhoneNumber { get; set; }
        public int IsSent { get; set; }
        public int IsDelivered { get; set; }
        public int IsClicked { get; set; }
        public int IsBounced { get; set; }
        public bool IsUnsubscribed { get; set; }
        public DateTime? SentDate { get; set; }
        public DateTime? DeliveryTime { get; set; }
        public DateTime? ClickedDate { get; set; }
        public DateTime? BouncedDate { get; set; }
        public DateTime? UnSubScribedDate { get; set; }
        public string? ReasonForNotDelivery { get; set; }
        public string? ResponseId { get; set; }
    }
}
