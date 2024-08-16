using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class Coupon
    {
        public int Id { get; set; }

        public int UserInfoUserId { get; set; }

        public string CouponIdentifier { get; set; }

        public int NumOfCoupon { get; set; }

        public int TotalConsumed { get; set; }

        public bool? Status { get; set; }

        public DateTime? ExpiryDate { get; set; }

        public string CodeType { get; set; }

        public string Code { get; set; }

        public string IfAutoCouponThenStartWith { get; set; }

        public DateTime? CreatedDate { get; set; }

        public string FileName { get; set; }

        public bool? IsArchive { get; set; }
    }
}
