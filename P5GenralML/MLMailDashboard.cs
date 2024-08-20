using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLMailDashboard
    {
        public int Opened { get; set; }
        public int Clicked { get; set; }
        public int Forward { get; set; }
        public int Unsubscribe { get; set; }
        public int Bounced { get; set; }
        public string? GDate { get; set; }
        public int Hour { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public int SentMail { get; set; }

        public int TotalOpened { get; set; }
        public int TotalClicked { get; set; }
        public int TotalSent { get; set; }
        public int TotalForward { get; set; }
        public int TotalUnsubscribe { get; set; }
        public int TotalBounced { get; set; }
    }
}
