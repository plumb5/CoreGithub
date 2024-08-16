using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class CouponConsumption
    {
        public int Id { get; set; }

        public int CouponId { get; set; }

        public string CouponIdentifier { get; set; }

        public string CouponCode { get; set; }

        public bool? IsSent { get; set; }

        public string Channel { get; set; }

        public DateTime? SentDate { get; set; }

        public bool? IsConsumed { get; set; }

        public DateTime? ConsumedDate { get; set; }

        public int? ContactId { get; set; }

        public string EmailOrPhone { get; set; }

        public string MachineId { get; set; }

        public DateTime? CreatedDate { get; set; }
    }
}
