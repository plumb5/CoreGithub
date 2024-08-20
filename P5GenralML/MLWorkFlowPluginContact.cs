using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLWorkFlowPluginContact
    {
        public int WorkFlowDataId { get; set; }
        public int WorkFlowId { get; set; }
        public int ConfigId { get; set; }
        public string? Segment { get; set; }
        public string? SegmentName { get; set; }
        public string? SegmentId { get; set; }
    }
}
