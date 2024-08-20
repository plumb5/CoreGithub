using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WhatsAppTrackForIndividual
    {

        public int Id { get; set; }
        public string? PhoneNumber { get; set; }
        public string? WhatsAppContent { get; set; }
        public int ContactId { get; set; }
        public int WhatsAppTemplateId { get; set; }
        public string? IsFormIsChatIsLmsIsMail { get; set; }
        public DateTime SentDate { get; set; }
        public bool? IsUnicodeMessage { get; set; }
        public int UserInfoUserId { get; set; }
    }
}
