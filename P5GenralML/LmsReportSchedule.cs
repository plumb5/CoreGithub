
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
   public class LmsReportSchedule
    {
        public int Id { get; set; }
        public int CreatedUserInfoUserId { get; set; }
        public int SalesUserInfoUserId { get; set; }
        public int ReportUserInfoUserId { get; set; }
        public bool Daily { get; set; }
        public string Weekly { get; set; }
        public int Monthly { get; set; }
        public DateTime CreatedDate { get; set; }      
        public DateTime ScheduleTime { get; set; }
        public bool ActiveStatus { get; set; }
    }
}
