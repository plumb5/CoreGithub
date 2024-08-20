using System;

namespace P5GenralML
{
    public class ContactExtraField
    {
        public Int16 Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int UserGroupId { get; set; }
        public string? FieldName { get; set; }
        public Nullable<DateTime> CreateDate { get; set; }
        public Int16 FieldType { get; set; }
        public string? SubFields { get; set; }
        public Boolean IsEditable { get; set; }
        public Int16 HideField { get; set; }
        public bool IsMandatory { get; set; }
    }
}
