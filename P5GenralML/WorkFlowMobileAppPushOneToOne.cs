using System;

namespace P5GenralML
{
    public class WorkFlowMobileAppPushOneToOne
    {
        public int Id { get; set; }
        public int MobileFormId { get; set; }
        public string DeviceId { get; set; }
        public byte? SendStatus { get; set; }
        public int WorkFlowId { get; set; }
        public int WorkFlowDataId { get; set; }
        public string CampaignJobName { get; set; }
        public DateTime? SentDate { get; set; }
        public int ContactId { get; set; }
        public string ResponseId { get; set; }
        public string VendorName { get; set; }
        public string MessageContent { get; set; }
        public string P5UniqueId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string GcmRegId { get; set; }
        public int ConfigureMobileId { get; set; }
    }
}
