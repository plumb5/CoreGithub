using System;

namespace P5GenralML
{
    public class CreditHistory
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int FeatureId { get; set; }
        public long TotalCredit { get; set; }
        public long TotalAllocated { get; set; }
        public DateTime CreditAddDate { get; set; }
        public string Remarks { get; set; }
        public int AccountId { get; set; }
    }
}
