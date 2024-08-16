using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class LmsGroupImportOverview
    {
        public int Id { get; set; }
        public int ContactImportOverviewId { get; set; }
        public int LmsGroupId { get; set; }
        public int SuccessCount { get; set; }
        public int RejectedCount { get; set; }
        public int ContactErrorRejectedCount { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
