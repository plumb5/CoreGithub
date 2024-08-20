using System;

namespace P5GenralML
{
    public class AdminCreditAllocationReport
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public int UserInfoUserId { get; set; }
        public int FeatureId { get; set; }
        public string ProviderName { get; set; }
        public long TotalCredit { get; set; }
        public DateTime CreditAddDate { get; set; }
        public string Remarks { get; set; }

    }
}
