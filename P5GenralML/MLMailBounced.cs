using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLMailBounced
    {
        public int ContactId { get; set; }
        public string? EmailId { get; set; }
        public string? Category { get; set; }
        public string? ReasonForBounce { get; set; }
        public string? ErrorCode { get; set; }
        public Nullable<DateTime> BounceDate { get; set; }
    }
}
