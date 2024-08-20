using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLWebPushCampaign
    {
        public string? MachineId { get; set; }
        public string? CampaignName { get; set; }
        public string? TemplateName { get; set; } 
        public int IsSent { get; set; }
        public int IsViewed { get; set; }
        public int IsClicked { get; set; }
        public int IsClosed { get; set; }
        public int IsUnSubScribed { get; set; }
        public Nullable<DateTime> SentDate { get; set; }
        public Nullable<DateTime> ViewedDate { get; set; }
        public Nullable<DateTime> ClickedDate { get; set; }
        public Nullable<DateTime> ClosedDate { get; set; }
        public Nullable<DateTime> UnSubScribedDate { get; set; }
        public string? ResponseId { get; set; } 
    }
}
