using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WorkFlowSMS
    {
        public int ConfigureSmsId { get; set; }
        public int SmsTemplateId { get; set; }
        public int SentCount { get; set; }
        public int DeliverCount { get; set; }
        public int ClickCount { get; set; }
        public bool IsPromotionalOrTransactionalType { get; set; }
        public int BouncedCount { get; set; }
        public int NotSentCount { get; set; }
        public int NotClickCount { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsStopped { get; set; }
        public string? TemplateName { get; set; }
        public bool IsSplitTester { get; set; }
        public Int16 IsSplitTestWinner { get; set; }
        public Int16 IsTriggerEveryActivity { get; set; }
        public int SmsConfigurationNameId { get; set; }
    }
}
