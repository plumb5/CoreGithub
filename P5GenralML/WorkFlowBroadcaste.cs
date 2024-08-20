using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WorkFlowBroadcaste
    {
        public int ConfigureBroadcasteId { get; set; }
        public int Twitter { get; set; }
        public int Facebook { get; set; }
        public int LinkedIn { get; set; }
        public string? Message { get; set; }
        public string? FacebookToken { get; set; }
        public string? TwitterToken { get; set; }
        public string? TwitterSecretToken { get; set; }
        public string? LinkedinToken { get; set; }
    }
}
