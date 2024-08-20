using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
   public class MLLmsFormFields
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public string? FieldName { get; set; }
        public int FieldType { get; set; }
        public string? SubFields { get; set; }
        public Boolean IsEditable { get; set; }
        public int HideField { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
    }
}
