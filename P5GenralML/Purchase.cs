using System;

namespace P5GenralML
{
    public class Purchase
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public Int16 FeatureId { get; set; }
        public Int64 Allocated { get; set; }
        public DateTime LastUpdatedDate { get; set; }
        public DateTime ExpiryDate { get; set; }
        public DateTime PurchaseDate { get; set; }
        public bool FeatureStatus { get; set; }
        public Int64 ConsumedTillYesterday { get; set; }
        public int AccountId { get; set; }
    }
}
