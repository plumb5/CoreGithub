using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WorkFlowABTestTemp
    {
        public int Id { get; set; }       
        public string MachineId { get; set; }
        public int ContactId { get; set; }
        public int WorkFlowId { get; set; }
        public int WorkFlowDataId { get; set; }
        public string ChannelType { get; set; }
        public int RuleId { get; set; }
        public string SetIdentifier { get; set; }
        public DateTime CreatedDate { get; set; }
        public byte IsUsed { get; set; }
        public int ConfigId { get; set; }        
    }
}
