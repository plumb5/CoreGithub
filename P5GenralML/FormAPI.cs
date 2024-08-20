using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class FormAPI
    {
        public int Id { get; set; }
        public int FormId { get; set; }
        public bool? IsFormTagIdType { get; set; }
        public string FormTag { get; set; }
        public bool? IsSubmitTagIdType { get; set; }
        public string SubmitTag { get; set; }
    }
}
