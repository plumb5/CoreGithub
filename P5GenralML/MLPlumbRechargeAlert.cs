using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLPlumbRechargeAlert
    {
        public int UserInfoUserId { get; set; }
        public long Allocated { get; set; }
        public long Consumed { get; set; }
        public string Name { get; set; }

        public Nullable<DateTime> LastUpdatedDate { get; set; }
        public Nullable<DateTime> ExpiryDate { get; set; }
        public Nullable<DateTime> PurchaseDate { get; set; }
    }

}
