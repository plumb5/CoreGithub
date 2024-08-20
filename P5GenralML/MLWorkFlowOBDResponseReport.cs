using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLWorkFlowOBDResponseReport
    {
        public int AccountId { get; set; }
        public string? Action { get; set; }
        public int WorkFlowId { get; set; }
        public int ConfigId { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public int DeliveredCount { get; set;}
        public int PickedCount { get; set; }
        public int RejectedCount { get; set; }
        public string? TemplateName { get; set; }
    }
}
