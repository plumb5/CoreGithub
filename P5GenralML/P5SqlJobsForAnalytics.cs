using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class P5SqlJobsForAnalytics
    {
        public int Id { get; set; }
        public int P5SqlJobsId { get; set; }
        public int AccountId { get; set; }
        public string? ScheduleTime { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? LastExecuteDateTime { get; set; }
    }
}
