using System;

namespace P5GenralML
{
    public class FeatureGroups
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? CurrencyType { get; set; }
        public string? PurgeSettings { get; set; }
    }
}
