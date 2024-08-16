using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLWorkFlowMobileFormResponses
    {
        public int Id { get; set; }
        public int MobileFormId { get; set; }
        public string SessionId { get; set; }
        public string DeviceId { get; set; }
        public string ScreenName { get; set; }
        public string FormResponces { get; set; }
        public int BannerSent { get; set; }
        public int BannerView { get; set; }
        public int BannerClick { get; set; }
        public int BannerClose { get; set; }
        public int BannerBounce { get; set; }
        public DateTime? FormDate { get; set; }
        public DateTime? UpdateDate { get; set; }
        public string GeofenceName { get; set; }
        public string BeaconName { get; set; }
        public byte? SendStatus { get; set; }
        public int WorkFlowId { get; set; }
        public int WorkFlowDataId { get; set; }
        public string CampaignJobName { get; set; }
        public DateTime? SentDate { get; set; }
        public DateTime? ViewDate { get; set; }
        public DateTime? ClickDate { get; set; }
        public DateTime? CloseDate { get; set; }
        public DateTime? BounceDate { get; set; }
        public int ContactId { get; set; }
        public string ResponseId { get; set; }
        public string VendorName { get; set; }
        public string ErrorMessage { get; set; }
        public string MessageContent { get; set; }
        public bool? IsContentDynamic { get; set; }
    }
}
