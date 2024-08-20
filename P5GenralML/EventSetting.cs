using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class EventSetting
    {
        public int EId { get; set; }
        public string EventName { get; set; }
        public string Name { get; set; }
        public string EventType { get; set; }
        public DateTime Date { get; set; }
        public bool ActiveStatus { get; set; }
    }
}
