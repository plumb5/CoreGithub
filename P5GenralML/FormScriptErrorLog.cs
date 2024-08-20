using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class FormScriptErrorLog
    {
        public int Id { get; set; }
        public int FormScriptId { get; set; }
        public string? ErrorLog { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public Nullable<DateTime> UpdatedDate { get; set; }
    }
}
