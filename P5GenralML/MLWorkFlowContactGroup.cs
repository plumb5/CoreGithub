using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLWorkFlowContactGroup
    {
        public string? DeviceId { get; set; }
        public string? Name { get; set; }
        public string? EmailId { get; set; }
        public string? PhoneNumber { get; set; }
        public Nullable<short> IsVerifiedMailId { get; set; }
        public byte? Unsubscribe { get; set; }
        public Nullable<short> IsVerifiedContactNumber { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public int GroupMemberId { get; set; }
        public int GroupId { get; set; }
    }
}
