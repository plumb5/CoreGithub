
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLUCPVisitor
    {
        public string? MachineId { get; set; }
        public string? DeviceId { get; set; }
        public int? ContactId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public string? Domain { get; set; }
    }
}
