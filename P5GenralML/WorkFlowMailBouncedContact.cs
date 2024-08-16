using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WorkFlowMailBouncedContact
    {
        public int ContactId { get; set; }
        public string Category { get; set; }
        public string ReasonForBounce { get; set; }
        public string Errorcode { get; set; }
        public DateTime? BounceDate { get; set; }
    }
}
