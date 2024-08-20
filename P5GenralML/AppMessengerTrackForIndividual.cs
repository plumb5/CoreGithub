using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class AppMessengerTrackForIndividual
    {
        public int Id { get; set; }
        public string PhoneNumber { get; set; }
        public string AppMessengerContent { get; set; }
        public int ContactId { get; set; }
        public int AppMessengerTemplateId { get; set; }
        public string IsFormIsChatIsLmsIsMail { get; set; }
        public DateTime SentDate { get; set; }
    }
}
