using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MobileFormRequest
    {
        public int AdsId { get; set; }
        public int MobileFormId { get; set; }
        public string? SessionId { get; set; }
        public string? DeviceId { get; set; }
        public string? ScreenName { get; set; }
        public string? FormResponses { get; set; }
        public int BannerView { get; set; }
        public int BannerClick { get; set; }
        public int BannerClose { get; set; }
        public string? GeofenceName { get; set; }
        public string? BeaconName { get; set; }
        public string? ButtonName { get; set; }
        public int SendReport { get; set; }
        public string? WidgetName { get; set; }
        public int WorkFlowDataId { get; set; }

        public string? P5UniqueId { get; set; }
    }
}
