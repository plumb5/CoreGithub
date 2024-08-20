using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class P5SqlJobsErrorLog
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public string? StoreProcedureName { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public string? TimeTookToExecute { get; set; }        
        public string? ErrorLog { get; set; }
    }
}
