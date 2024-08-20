using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class CartDetails
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public string TxId { get; set; }
        public Int16 FeatureId { get; set; }
        public string FeatureName { get; set; }
        public string PurchaseLink { get; set; }
        public decimal MonthlyPrice { get; set; }
        public decimal YearlyPrice { get; set; }
        public string UnitType { get; set; }
        public int OpttedRange { get; set; }
        public bool SelectedYearly { get; set; }
        public bool PriceInINRorDollar { get; set; }
    }
}
