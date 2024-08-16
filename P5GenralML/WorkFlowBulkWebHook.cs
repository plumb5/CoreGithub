using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WorkFlowBulkWebHook
    {
        public Int64 Id { get; set; }
        public int ContactId { get; set; }
        public int WebHookSendingSettingId { get; set; }
        public int WorkFlowId { get; set; }
        public int WorkFlowDataId { get; set; }
        public Int16 SendStatus { get; set; }
    }
}
