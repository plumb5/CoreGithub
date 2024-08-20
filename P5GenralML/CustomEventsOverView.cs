using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class CustomEventsOverView
    {
        public int Id { get; set; }
        public string EventName { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public int TrackScript { get; set; }
        public int TotalEventCount { get; set; }
    }
}
