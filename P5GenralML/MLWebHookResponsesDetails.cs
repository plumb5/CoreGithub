using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLWebHookResponsesDetails
    {
        public Int64 Id { get; set; }
        public int WebHookSendingSettingId { get; set; }
        public int ContactId { get; set; }
        public string? WebHookPostContent { get; set; }
        public string? WebHookResponseContent { get; set; }
        public byte SendStatus { get; set; }
        public string? ErrorMessage { get; set; }
        public int WorkFlowId { get; set; }
        public int WorkFlowDataId { get; set; }
        public string? WebHookStatusCode { get; set; }
    }
}
