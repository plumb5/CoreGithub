using System;

namespace P5GenralML
{
    public class WorkFlowMailBulkSentInitiation
    {
        public int SendingSettingId { get; set; }
        public int WorkFlowId { get; set; }
        public int WorkFlowDataId { get; set; }
        public Int16 InitiationStatus { get; set; }
        public bool? IsPromotionalOrTransactionalType { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
