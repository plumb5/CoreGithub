using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLWorkFlowSetRules
    {
        public int RuleId { get; set; }
        public string TriggerHeading { get; set; }        
        public Nullable<DateTime> TriggerCreateDate { get; set; }
        public Boolean TriggerStatus { get; set; }
        public int IsSplitTester { get; set; }
    }
}
