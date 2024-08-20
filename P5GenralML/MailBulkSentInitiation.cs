using System;

namespace P5GenralML
{
    public class MailBulkSentInitiation
    {
        public int SendingSettingId { get; set; }
        public Int16 InitiationStatus { get; set; }
        public bool? IsPromotionalOrTransactionalType { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
