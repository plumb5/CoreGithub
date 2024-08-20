using System;

namespace P5GenralML
{
    public class DeviceInfo
    {
        public int DId { get; set; }
        public string? UserAgent { get; set; }
        public string? DeviceId { get; set; }
        public string? BrandName { get; set; }
        public string? ModelName { get; set; }
        public string? MarketingName { get; set; }
        public string? OS { get; set; }
        public string? OsVersion { get; set; }
        public string? Tablet { get; set; }
        public string? FallBack { get; set; }
        public int Veriy { get; set; }
        public DateTime? DeviceDate { get; set; }
    }
}
