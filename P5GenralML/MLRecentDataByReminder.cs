using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLRecentDataByReminder
    {
        public int LastModifyByUserId { get; set; }
        public string Name { get; set; }
        public int Score { get; set; }
        public string Stage { get; set; }
        public DateTime ReminderDate { get; set; }
        public string IdentificationColor { get; set; }
    }
}
