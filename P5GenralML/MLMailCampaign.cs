using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLMailCampaign
    {
        public string? CampaignName { get; set; }
        public string? TemplateName { get; set; }
        public string? EmailId { get; set; }
        public int IsSent { get; set; }
        public int IsOpened { get; set; }
        public int IsClicked { get; set; }
        public int MultipleClickCount { get; set; }
        public bool IsUnsubscribed { get; set; }
        public string? ErrorMessage { get; set; }
        public DateTime? SentDate { get; set; }
        public int IsBounced { get; set; }
        public Nullable<DateTime> OpenedDate { get; set; }
        public DateTime? ClickedDate { get; set; }
        public DateTime? ReadDate { get; set; }
        public DateTime? FailedDate { get; set; }
        public DateTime? UnsubscribedDate { get; set; }
        public string? ResponseId { get; set; }

    }
}
