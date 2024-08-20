using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class WorkFlowForm
    {
        public int ConfigureFormId { get; set; }
        public int FormId { get; set; }
        public Int16 ViewedCount { get; set; }
        public Int16 ClosedCount { get; set; }
        public Int16 ResponseCount { get; set; }
        public DateTime CreatedDate { get; set; }
        public Int16 FormType { get; set; }
    }
}
