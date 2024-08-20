using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class SegmentInternalJoiningTableNames
    {
        public int Id { get; set; }
        public string? SourceTableName { get; set; }
        public string? DestinationTableName { get; set; }
        public string? InternalSourceTableName { get; set; }
        public string? InternalSourceTableIdentityColumn { get; set; }
        public string? InternalDestinationTableName { get; set; }
        public string? InternalDestinationTableIdentityColumn { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
