using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MailTrackForIndividual
    {
        public int Id { get; set; }
        public string? ToEmailId { get; set; }
        public string? CCEmailId { get; set; }
        public string? FromEmailId { get; set; }
        public string? MailSubject { get; set; }
        public string? MailMessage { get; set; }
        public int ContactId { get; set; }
        public int MailTemplateId { get; set; }
        public string? IsFormIsChatIsLmsIsMail { get; set; }
        public DateTime SentDate { get; set; }
        public string? Attachment { get; set; }
        public string? FromName { get; set; }
        public string? ReplyAt { get; set; }
        public int UserInfoUserId { get; set; }
    }
}
