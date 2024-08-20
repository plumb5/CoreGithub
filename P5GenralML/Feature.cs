using System;

namespace P5GenralML
{
    public class Feature
    {
        public Int16 Id { get; set; }
        public string? Name { get; set; }
        public string? PurchaseLink { get; set; }
        public decimal PricePerUnit { get; set; }
        public short FeatureUnitTypeId { get; set; }
        public Int16 MinUnitValue { get; set; }
        public Int32 MaxUnitValue { get; set; }
        public bool IsMainFeature { get; set; }
        public string? ApplicationPath { get; set; }
        public string? DisplayNameInDashboard { get; set; }
        public DateTime CreatedDate { get; set; }
        public decimal PricePerUnitInINR { get; set; }
    }
}
