using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLGeneralFormFilter
    {
        public int FormId { get; set; }

        public string SearchByText { get; set; }

        public string MachineId { get; set; }

        public string IPAddress { get; set; }

        public DateTime FromDate { get; set; }

        public DateTime ToDate { get; set; }

        public int OffSet { get; set; }

        public int Fetch { get; set; }

        public string EmbeddedFormOrPopUpFormOrTaggedForm { get; set; }

        public int VisitorType { get; set; }
    }
}
