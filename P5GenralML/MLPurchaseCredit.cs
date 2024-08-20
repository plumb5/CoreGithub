using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLPurchaseCredit
    {
        public int AccountId { get; set; }
        public int UserInfoUserId { get; set; }
        public Int64 TotalMailAllocated { get; set; }
        public Int64 TotalMailConsumed { get; set; }
        public Int64 TotalMailRemaining { get; set; }
        public Int64 TotalSmsAllocated { get; set; }
        public Int64 TotalSmsConsumed { get; set; }
        public Int64 TotalSmsRemaining { get; set; }
        public Int64 TotalSpamCheckAllocated { get; set; }
        public Int64 TotalSpamCheckConsumed { get; set; }
        public Int64 TotalSpamCheckRemaining { get; set; }
        public Int64 TotalEmailVerifiedAllocated { get; set; }
        public Int64 TotalEmailVerifiedConsumed { get; set; }
        public Int64 TotalEmailVerifiedRemaining { get; set; }
        public Int64 TotalWebPushAllocated { get; set; }
        public Int64 TotalWebPushConsumed { get; set; }
        public Int64 TotalWebPushRemaining { get; set; }
        public Int64 TotalMobilePushAllocated { get; set; }
        public Int64 TotalMobilePushConsumed { get; set; }
        public Int64 TotalMobilePushRemaining { get; set; }
        public Int64 TotalWhatsappConsumed { get; set; } 
        public Int64 TotalWhatsAppAllocated { get; set; }
        public Int64 TotalWhatsAppRemaining { get; set; }
    }
    public class CombinedCreditInfo
    {
        public MLPurchaseCredit PurchaseConsumption { get; set; }
        public string? AccountManagerName { get; set; }
        public string? SupportManagerName { get; set; }
    }
}
