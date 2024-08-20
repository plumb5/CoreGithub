using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WorkFlowBrowserPushOneToOne
    {
        public int Id { get; set; }
        public int PushId { get; set; }
        public string? MachineId { get; set; }
        public byte SendStatus { get; set; }
        public int WorkFlowId { get; set; }
        public int WorkFlowDataId { get; set; }
        public string? CampaignJobName { get; set; }
        public DateTime? SentDate { get; set; }
        public int ContactId { get; set; }
        public string? VendorName { get; set; }
        public string? MessageContent { get; set; }
        public string? P5UniqueId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public int ConfigureWebPushId { get; set; }
        public string? RegId { get; set; }
        public string? EndpointUrl { get; set; }
        public string? Tokenkey { get; set; }
        public string? Authkey { get; set; }
    }
}
