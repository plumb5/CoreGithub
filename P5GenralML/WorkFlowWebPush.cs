using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WorkFlowWebPush
    {
        public int ConfigureWebPushId { get; set; }
        public int WebPushTemplateId { get; set; }
        public int SentCount { get; set; }
        public int ViewCount { get; set; }
        public int ClickCount { get; set; }
        public int CloseCount { get; set; }
        public DateTime Date { get; set; }
        public Int16 IsTriggerEveryActivity { get; set; }
    }
}
