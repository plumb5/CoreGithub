using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WorkFlowOverAllHistory
    {
        public int ContactId { get; set; }
        public int ConfigId { get; set; }
        public string? Name { get; set; }
        public string? EmailId { get; set; }
        public string? PhoneNumber { get; set; }
        public int WorkFlowId { get; set; }
        public string? MachineId { get; set; }
        public int TotalWorkFlow { get; set; }
        public int TotalSent { get; set; }
        public int TotalViewed { get; set; }
        public int TotalResponsed { get; set; }
        public int TotalDelivered { get; set; }
        public string? ChannelType { get; set; }
        public DateTime LastSentDate { get; set; }
        public int TemplateId { get; set; }
        public string? TemplateName { get; set; }
        public string? WorkFlowName { get; set; }
        public int TotalUnsubscribe { get; set; }
        public int TotalBounced { get; set; }
    }
}
