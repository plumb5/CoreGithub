using P5GenralML;

namespace Plumb5.Areas.SegmentBuilder.Models
{
    public class TableAndColumnNames
    {
        public string TableName { get; set; }
        public string IdentityColumn { get; set; }
        public string DisplayTableName { get; set; }
        public List<MLTableColumns> ColumnNames { get; set; }
    }
}
