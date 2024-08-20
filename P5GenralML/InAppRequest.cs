using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace P5GenralML
{
    public class InAppRequest
    {
        public string? DeviceId { get; set; }
        public string? SessionId { get; set; }
        public string? ScreenName { get; set; }
        public string? EventId { get; set; }
        public string? EventValue { get; set; }
        public string? PageParameter { get; set; }
    }
}