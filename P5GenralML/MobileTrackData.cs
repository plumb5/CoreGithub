using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
  public class MobileTrackData
    {
        public string? AppKey { get; set; }
        public string? SessionId { get; set; }
        public string? GcmRegId { get; set; }
        public string? ScreenName { get; set; }
        public int CampaignId { get; set; }
        public int NewSession { get; set; }
        public int Offline { get; set; }
        public DateTime TrackDate { get; set; }
        public int GeofenceId { get; set; }
        public string? Locality { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Country { get; set; }
        public string? CountryCode { get; set; }
        public string? Latitude { get; set; }
        public string? Longitude { get; set; }
        public string? DeviceId { get; set; }
        public string? PageParameter { get; set; }
        public int WorkFlowDataId { get; set; }
        public string? CarrierName { get; set; }
        public string? VisitorIp { get; set; }
        public double IpDecimal { get; set; }
    }
}
