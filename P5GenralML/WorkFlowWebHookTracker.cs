using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WorkFlowWebHookTracker
    {
        public int Id { get; set; }
        public int ConfigureAlertId { get; set; }
        public string? CallingSource { get; set; }
        public string? PostedUrl { get; set; }
        public string? Response { get; set; }
        public double ResponseCode { get; set; }
        public string? ResponseFromServer { get; set; }
        public DateTime SentDate { get; set; }
        public int WorkFlowDataId { get; set; }
        public int PostedDataCount { get; set; }
        public int ReceivedDataCount { get; set; }
        public int UpdatedDataCount { get; set; }
    }
}
