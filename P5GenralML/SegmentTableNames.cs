using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class SegmentTableNames
    {
        public int Id { get; set; }
        public string? TableName { get; set; }
        public string? IdentityColumn { get; set; }
        public string? DisplayTableName { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
