using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLWorkFlowInitialRun
    {
        public string? DataUniqueId { get; set; }
        public int RuleId { get; set; }
        public bool IsRuleSatisfied { get; set; }
        public int WorkFlowId { get; set; }
        public int WorkFlowDataId { get; set; }
        public string? ChannelType { get; set; }
        public int PreviousWorkFlowDataId { get; set; }
        public int ConfigId { get; set; }
    }
}
