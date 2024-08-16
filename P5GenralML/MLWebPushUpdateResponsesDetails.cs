using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLWebPushUpdateResponsesDetails
    {
        public int AdsId { get; set; }
        public string P5UniqueId { get; set; }
        public string MachineId { get; set; }
        public int WebPushTemplateId { get; set; }
        public int WebPushSendingSettingId { get; set; }
        public string StatusCode { get; set; }
        public string StatusMessage { get; set; }
        public int IsUnsubscribed { get; set; }
    }
}
