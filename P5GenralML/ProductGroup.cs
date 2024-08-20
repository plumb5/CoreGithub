using System;

namespace P5GenralML
{
    public class ProductGroup
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? GroupDescription { get; set; }
        public Int16 GroupType { get; set; }
        public string? FilterContent { get; set; }
        public string? FilterQuery { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
    }

  
}
