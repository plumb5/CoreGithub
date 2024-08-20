using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLWorkFlowWhatsApp
    {
        public int ConfigureWhatsAppId { get; set; }
        public int WhatsAppTemplateId { get; set; }
        public string? TemplateName { get; set; }
        public Int32 SentCount { get; set; }
        public Int32 NotSentCount { get; set; }
        public Int32 DeliverCount { get; set; }
        public Int32 ReadCount { get; set; }
        public Int32 NotReadCount { get; set; }
        public Int32 ClickCount { get; set; }
        public Int32 NotClickCount { get; set; }
        public Int32 FailedCount { get; set; }
        public DateTime Date { get; set; }
        public int? IsTriggerEveryActivity { get; set; }
        public int WhatsAppConfigurationNameId { get; set; }
    }

    public class SendingDatalist
    {
        public int ConfigureWhatsAppId { get; set; }
        public int WhatsAppTemplateId { get; set; }
        public int IsTriggerEveryActivity { get; set; }
        public int WhatsAppConfigurationNameId { get; set; }
    }
}
