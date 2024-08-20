using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLWorkFlowBrowserPushResponses
    {
        public int Id { get; set; }
        public int PushId { get; set; }
        public string? SessionId { get; set; }
        public string? MachineId { get; set; }
        public int ContactId { get; set; }
        public int PushSent { get; set; }
        public int PushView { get; set; }
        public int PushClick { get; set; }
        public int PushClose { get; set; }
        public DateTime ResposesDate { get; set; }
        public DateTime UpdateDate { get; set; }
        public int PushBounce { get; set; }
        public byte SendStatus { get; set; }
        public int WorkFlowId { get; set; }
        public int WorkFlowDataId { get; set; }
        public string? CampaignJobName { get; set; }
        public DateTime SentDate { get; set; }
        public DateTime ViewDate { get; set; }
        public DateTime ClickDate { get; set; }
        public DateTime CloseDate { get; set; }
        public DateTime BounceDate { get; set; }
        public string? ResponseId { get; set; }
        public string? VendorName { get; set; }
        public string? ErrorMessage { get; set; }
        public string? MessageContent { get; set; }
        public bool? IsContentDynamic { get; set; }
    }
}
