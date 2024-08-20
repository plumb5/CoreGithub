using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MailDrips
    {
        public int Id { get; set; }
        public int MailSendingSettingId { get; set; }
        public int MailTemplateId { get; set; }
        public string? DripSubject { get; set; }
        public bool Subscribe { get; set; }
        public bool Forward { get; set; }
        public short DripSequence { get; set; }
        public short DripConditionType { get; set; }
        public short MySeniorDripConditionType { get; set; }
        public bool ScheduledStatus { get; set; }
        public DateTime? CompletedDateTime { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? ScheduledDate { get; set; }
        public int TotalSent { get; set; }
        public int TotalOpen { get; set; }
        public int TotalClick { get; set; }
        public int TotalUnsubscribe { get; set; }
        public int TotalForward { get; set; }
        public int TotalBounced { get; set; }
        public int TotalNotSent { get; set; }
    }
}
