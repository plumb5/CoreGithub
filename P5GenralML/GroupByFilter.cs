using System;

namespace P5GenralML
{
    public class GroupByFilter
    {
     
        public int GroupId { get; set; }
        public bool? IsOtherGroup { get; set; }
        public Int16? TimeInterval { get; set; }
        public string FilterContent { get; set; }
        public string FilterQuery { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
    }
}
