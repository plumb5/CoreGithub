using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MobileGroupByFilter
    {
        public int GroupId { get; set; }
        public bool? IsOtherGroup { get; set; }
        public Int16? TimeInterval { get; set; }
        public string? FilterContent { get; set; }
        public string? FilterQuery { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
    }
}
