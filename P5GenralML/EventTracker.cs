using System;

namespace P5GenralML
{
    public class EventTracker
    {
        public int EId { get; set; }
        public string Name { get; set; }
        public string Events { get; set; }
        public string PageName { get; set; }
        public string VisitorIp { get; set; }
        public string MachineId { get; set; }
        public string SessionId { get; set; }
        public DateTime Date { get; set; }

        public string EventValue { get; set; }
    }
}
