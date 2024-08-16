using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class VisitorInformation
    {
        public int ContactId { get; set; }
        public string MachineId { get; set; }
        public Int16 SourceType { get; set; }
        public Nullable<DateTime> Date { get; set; }
    }
}
