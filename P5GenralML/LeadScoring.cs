using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class LeadScoring
    {
        public int Id { get; set; }
        public bool? IsActiveScoreSettings { get; set; }
        public bool? IsActiveThresholdSettings { get; set; }
        public bool? IsActiveDecaySettings { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
