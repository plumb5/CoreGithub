using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WorkFlowAlertReport
    {
        public int Id { get; set; }
        public int ConfigureAlertId { get; set; }
        public string AlertType { get; set; }       
        public string EmailId { get; set; }
        public string PhoneNumber { get; set; }
        public bool SentStatus { get; set; }
        public string Reason { get; set; }
        public string Message { get; set; }
        public DateTime CreatedDate { get; set; }
        public int WorkFlowDataId { get; set; }
    }
}
