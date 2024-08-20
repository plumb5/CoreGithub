using System;
using System.Collections.Generic;
using System.Text;

namespace P5GenralML
{
    public class WorkFlowMail
    {
        public int ConfigureMailId { get; set; }
        public int MailTemplateId { get; set; }
        public string? MailSubject { get; set; }
        public string? FromName { get; set; }
        public string? FromEmailId { get; set; }
        public string? ReplyToEmailId { get; set; }
        public Int16 Subscribe { get; set; }
        public bool IsPromotionalOrTransactionalType { get; set; }
        public int SentCount { get; set; }
        public int DeliveredCount { get; set; }
        public int ViewCount { get; set; }
        public int ResponseCount { get; set; }
        public int OptOutCount { get; set; }
        public int BounceCount { get; set; }
        public int NotSentCount { get; set; }
        public int NotViewCount { get; set; }
        public int NotResponseCount { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsStopped { get; set; }
        public string? TemplateName { get; set; }
        public bool IsSplitTester { get; set; }
        public Int16 IsSplitTestWinner { get; set; }
        public Int16 IsTriggerEveryActivity { get; set; }
        public int MailConfigurationNameId { get; set; }
        public int WorkflowId { get; set; }

    }
}
