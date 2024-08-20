using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WebHookTrackerScheduler
    {
        public string? PostedUrl { get; set; }
        public string? Response { get; set; }
        public double ResponseCode { get; set; }
        public string? ResponseFromServer { get; set; }
        public DateTime SentDate { get; set; }
    }
}
