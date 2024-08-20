using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class IpRestrictions
    {
        public int Id { get; set; }
        public bool IsAllowSubdomain { get; set; }
        public string? IncludeIPAddress { get; set; }
        public string? IncludeSubDirectory { get; set; }
        public string? IncludeCity { get; set; }
        public string? IncludeCountry { get; set; }
        public string? ExcludeIPAddress { get; set; }
        public string? ExcludeSubDirectory { get; set; }
        public string? ExcludeCity { get; set; }
        public string? ExcludeCountry { get; set; }
        public bool IsDeviceTrackingRequired { get; set; }
    }
}
