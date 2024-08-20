using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WorkFlowTriggerFormChatApp
    {
        public int Id { get; set; }
        public int ConfigId { get; set; }
        public string MachineId { get; set; }
        public int ContactId { get; set; }
        public int WorkFlowId { get; set; }
        public int WorkFlowDataId { get; set; }
        public int FormId { get; set; }
        public string Channel { get; set; }
        public string ChannelType { get; set; }
        public DateTime CreatedDate { get; set; }
        public int ChatId { get; set; }
    }
}
