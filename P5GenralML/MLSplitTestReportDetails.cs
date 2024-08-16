using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLSplitTestReportDetails
    {
        public long RowsNumber { get; set; }
        public int MailSplitTestId { get; set; }
        public string MailTemplateName { get; set; }
        public int MailSendingSettingId { get; set; }
        public int MailTemplateId { get; set; }
        public string GroupName { get; set; }
        public string Subject { get; set; }
        public string FromName { get; set; }
        public int SplitTestScore { get; set; }
        public int TotalSent { get; set; }
        public int TotalOpen { get; set; }
        public int TotalClick { get; set; }
        public int TotalUnsubscribe { get; set; }
        public int TotalForward { get; set; }
        public int TotalBounced { get; set; }
        public int NumberOfContactInPer { get; set; }
        public byte IsCompleted { get; set; }
        public DateTime? CompletedTime { get; set; }
        public byte StopTestOrContinue { get; set; }
        public byte TestTypeFor { get; set; }
        public bool MailSplitTestShowInReport { get; set; }
    }
}
