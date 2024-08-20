using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class CustomEventExtraField
    {
        public short Id { get; set; }
        public int UserInfoUserId { get; set; }
        public int CustomEventOverViewId { get; set; }
        public int UserGroupId { get; set; }
        public string FieldName { get; set; }
        public Nullable<DateTime> CreateDate { get; set; }
        public int FieldType { get; set; }
        public string SubFields { get; set; }
        public Boolean IsEditable { get; set; }
        public int HideField { get; set; }
        public bool IsMandatory { get; set; }
        public string FieldMappingType { get; set; }
        public int DisplayOrder { get; set; }

    }
}
