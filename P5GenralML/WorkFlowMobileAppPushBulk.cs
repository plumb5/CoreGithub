using System;

namespace P5GenralML
{
    public class WorkFlowMobileAppPushBulk
    {
        public long Id { get; set; }
        public int ConfigureMobileId { get; set; }
        public int MobilePushTemplateId { get; set; }
        public int GroupId { get; set; }
        public string DeviceId { get; set; }
        public int ContactId { get; set; }
        public byte? SendStatus { get; set; }
        public string P5UniqueId { get; set; }
        public DateTime? CreatedDate { get; set; }
        public string Title { get; set; }
        public string SubTitle { get; set; }
        public string MessageContent { get; set; }
        public string FCMRegId { get; set; }
        public bool IsDynamicContent { get; set; }
        public string OSName { get; set; }
        public int WorkFlowId { get; set; }
        public int WorkFlowDataId { get; set; }        
    }
}
