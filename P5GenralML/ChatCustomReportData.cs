using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class ChatCustomReportData
    {
        public int ChatId { get; set; }
        public string ChatName { get; set; }
        public string MachineId { get; set; }
        public string Name { get; set; }
        public string IpAddress { get; set; }
        public string EmailId { get; set; }
        public string PhoneNumber { get; set; }
        public string AlternateEmailIds { get; set; }
        public string AlternatePhoneNumbers { get; set; }
        public int ContactId { get; set; }
        public DateTime ChatUserTime { get; set; }
        public int Score { get; set; }
    }
}
