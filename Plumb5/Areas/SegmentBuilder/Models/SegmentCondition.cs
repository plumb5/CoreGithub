namespace Plumb5.Areas.SegmentBuilder.Models
{
    public class SegmentCondition
    {
        public string Table { get; set; }
        public string Column { get; set; }
        public string DataType { get; set; }
        public string Comparison { get; set; }
        public string Operator { get; set; }
        public string Value { get; set; }
        public int Level { get; set; }
    }
}
