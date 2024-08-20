using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class PaymentCardDetails
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public string? CardNumber { get; set; }
        public string? NameOnCard { get; set; }
        public string? ExpirationDate { get; set; }
        public string? CardCVV { get; set; }
        public DateTime AddedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public bool AutoBillingStatus { get; set; }
    }
}
