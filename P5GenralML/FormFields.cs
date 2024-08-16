using System;

namespace P5GenralML
{
    public class FormFields
    {
        public Int16 Id { get; set; }
        public int UserInfoUserId { get; set; }
        public Int32 FormId { get; set; }
        public string? Name { get; set; }
        public short FieldType { get; set; }
        public string? SubFields { get; set; }
        public Int16 RelationField { get; set; }
        public bool Mandatory { get; set; }
        public string? FormScore { get; set; }
        public string? PhoneValidationType { get; set; }
        public string? FieldDisplay { get; set; }
        public short CalendarDisplayType { get; set; }
        public string? ContactMappingField { get; set; }
        public Int16 FieldPriority { get; set; }
        public short FormLayoutOrder { get; set; }
        public string? FormUniqueIdentifier { get; set; }
        public bool FieldShowOrHide { get; set; }
        public int FormFieldIndex { get; set; }
        public int ValidationType { get; set; }
    }
}
