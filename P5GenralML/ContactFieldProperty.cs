namespace P5GenralML
{
    public class ContactFieldProperty
    {
        public int Id { get; set; }
        public string? PropertyName { get; set; }
        public string? DisplayName { get; set; }
        public short FieldType { get; set; }
        public string? FieldOption { get; set; }
        public bool IsCustomField { get; set; }
        public bool IsSearchbyColumn { get; set; }
        public bool IsPublisherField { get; set; }
        public bool IsMasterFilterColumn { get; set; }
    }
}
