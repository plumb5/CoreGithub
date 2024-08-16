namespace P5GenralML
{
    public class ContactImportFileFieldMapping
    {
        public int Id { get; set; }
        public int ImportOverViewId { get; set; }
        public string FileFieldName { get; set; }
        public int FileFieldIndex { get; set; }
        public string P5ColumnName { get; set; }
        public string FrontEndName { get; set; }
        public bool? IsMapped { get; set; }
        public bool? IsNameChanged { get; set; }
    }
}
