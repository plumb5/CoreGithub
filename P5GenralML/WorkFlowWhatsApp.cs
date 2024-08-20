using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WorkFlowWhatsApp
    {
        public int ConfigureWhatsAppId { get; set; }
        public int WhatsAppTemplateId { get; set; }
        public int SentCount { get; set; }
        public int DeliverCount { get; set; }
        public int ReadCount { get; set; }
        public int ClickCount { get; set; }
        public int FailedCount { get; set; }
        public int NotReadCount { get; set; }
        public int NotClickCount { get; set; }
        public int NotSentCount { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsStopped { get; set; }
        public string? TemplateName { get; set; }
        public bool IsSplitTester { get; set; }
        public Int16 IsSplitTestWinner { get; set; }
        public int WhatsAppConfigurationNameId { get; set; }
        public Int16 IsTriggerEveryActivity { get; set; }
    }
}
