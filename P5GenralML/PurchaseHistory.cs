using System;

namespace P5GenralML
{
    public class PurchaseHistory
    {
        public int UserInfoUserId { get; set; }
        public Int16 FeatureId { get; set; }
        public Int64 Allocated { get; set; }
        public Int64 Consumed { get; set; }
        public int ConsumedForAlerts { get; set; }
        public int DayDiffernce { get; set; }
        public DateTime? CreateDate { get; set; }
    }
}
