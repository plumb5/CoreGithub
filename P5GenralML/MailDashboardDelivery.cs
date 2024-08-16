using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MailDashboardDelivery
    {
        public int TotalSent { get; set; }
        public int Forwarded { get; set; }
        public int Unsubscribed { get; set; }
        public int Bounced { get; set; }
    }
}
