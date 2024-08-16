using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLMobileDeviceInfo
    {
        public int Id { get; set; }
        public string DeviceId { get; set; }
        public string Manufacturer { get; set; }
        public string Name { get; set; }
        public string OS { get; set; }
        public string OsVersion { get; set; }
        public string AppVersion { get; set; }
        public string CarrierName { get; set; }
        public DateTime DeviceDate { get; set; }
        public string GcmRegId { get; set; }
        public string Resolution { get; set; }
        public bool InstalledStatus { get; set; }
        public int GcmSettingsId { get; set; }
        public DateTime IsInstalledStatusDate { get; set; }
        public int TotalInstalledCount { get; set; }
        public int ContactId { get; set; }
    }
}
