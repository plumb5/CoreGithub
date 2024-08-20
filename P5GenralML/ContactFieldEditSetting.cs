using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class ContactFieldEditSetting
    {
        public int PropertyId { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsMandatory { get; set; }
        public bool IsCustomField { get; set; }
    }

    public class MLContactFieldEditSetting
    {
        public int Id { get; set; }
        public string PropertyName { get; set; }
        public string DisplayName { get; set; }
        public short FieldType { get; set; }
        public string FieldOption { get; set; }
        public int PropertyId { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsMandatory { get; set; }
        public bool IsCustomField { get; set; }
        public bool IsSearchbyColumn { get; set; }
        public bool IsPublisherField { get; set; }
        public bool IsMasterFilterColumn { get; set; }
    }
}
