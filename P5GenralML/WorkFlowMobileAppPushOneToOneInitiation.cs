using System;

namespace P5GenralML
{
    public class WorkFlowMobileAppPushOneToOneInitiation
    {
        public int SendingSettingId { get; set; }
        public int WorkFlowId { get; set; }
        public int WorkFlowDataId { get; set; }
        public byte? InitiationStatus { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
