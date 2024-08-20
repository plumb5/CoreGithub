using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLErrorUpdation
    {
        public int Id { get; set; }
        public string LogName { get; set; }
        public string Error { get; set; }
        public string ErrorDescription { get; set; }
        public DateTime ErrorDateTime { get; set; }
        public string PageName { get; set; }
        public string StackTrace { get; set; }
    }
}
