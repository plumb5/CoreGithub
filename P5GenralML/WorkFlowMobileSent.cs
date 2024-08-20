using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WorkFlowMobileSent
    {
        public int WorkFlowMobileSentId { get; set; }

        public int ContactId { get; set; }

        public string? DeviceId { get; set; }

        public string? SessionId { get; set; }

        public int? WorkFlowId { get; set; }

        public int? WorkFlowDataId { get; set; }

        public int? ConfigureMobileId { get; set; }

        public int MobileCampaignId { get; set; }

        public byte CampaignType { get; set; }

        public string? ScreenName { get; set; }

        public string? FormResponces { get; set; }

        public int SentCount { get; set; }

        public DateTime SentDate { get; set; }

        public int ViewCount { get; set; }

        public DateTime ViewDate { get; set; }

        public int ClickCount { get; set; }

        public DateTime ClickDate { get; set; }

        public int CloseCount { get; set; }

        public DateTime CloseDate { get; set; }

        public string? GeofenceName { get; set; }

        public string? BeaconName { get; set; }

        public bool? IsSplitTester { get; set; }

        public byte? IsSplitTestWinner { get; set; }

        public int InappRead { get; set; }

        public int? BounceCount { get; set; }

        public DateTime? BounceDate { get; set; }

        public string? ResponseId { get; set; }

        public string? VendorName { get; set; }

        public string? ErrorMessage { get; set; }

        public byte? SendStatus { get; set; }
    }
}
