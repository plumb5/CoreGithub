using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class FormMultiUrlVariate
    {
        public int Id { get; set; }
        public int FormId { get; set; }
        public string Url { get; set; }
        public byte Weightage { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime LastUpdatedDate { get; set; }
    }
}
