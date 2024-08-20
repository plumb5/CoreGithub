using System;

namespace P5GenralML
{
    public class WorkFlowBrowserInfo
    {
        public int Id { get; set; }
        public string? MachineId { get; set; }
        public string? Name { get; set; }
        public string? RegId { get; set; }
        public DateTime BrowserDate { get; set; }
        public bool AllowedStatus { get; set; }
        public int GcmSettingsId { get; set; }
        public DateTime IsAllowedOrBlockedDate { get; set; }
        public string? EndpointUrl { get; set; }
        public string? tokenkey { get; set; }
        public string? authkey { get; set; }
    }
}
