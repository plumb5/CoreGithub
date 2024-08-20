using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class AnlyticsNotificationLog
    {
        public int Id { get; set; }
        public int Accountid { get; set; }
        public DateTime LastSentDate { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }
}
