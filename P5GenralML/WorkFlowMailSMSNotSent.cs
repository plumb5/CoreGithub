using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WorkFlowMailSMSNotSent
    {
        public int Id { get; set; }
        public int WorkFlowDataId { get; set; }
        public int ConfigId { get; set; }
        public int ContactId { get; set; }
        public string ChannelType { get; set; }
        public int CreatedDate { get; set; }
        public string ErrorMessage { get; set; }
    }
}
