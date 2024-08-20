using System;

namespace P5GenralML
{
    public class SmsBulkSentInitiation
    {
        public int SendingSettingId { get; set; }
        public short InitiationStatus { get; set; }
        public bool? IsPromotionalOrTransactionalType { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
