using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class CustomEventImportError
    {
        public string? EmailId { get; set; }
        public string? PhoneNumber { get; set; }
        public DateTime CreatedDate { get; set; }
        public int EventImportOverViewId { get; set; }
        public string? RejectReason { get; set; }
    }
}
