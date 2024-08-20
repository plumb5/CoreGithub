using System;

namespace P5GenralML
{
    public class _Plumb5MLUniqueVisits
    {
        public int AccountId { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public string? Location { get; set; }
        public string? Key { get; set; }
        public string? Data { get; set; }
        public string? Data2 { get; set; }
        public string? Data3 { get; set; }
    }
    public class MLDeviceUniqueVisits
    {
        public string? Visitor { get; set; }
        public string? MachineId { get; set; }
        public string? City { get; set; }
        public Int64 Session { get; set; }
        public DateTime Recency { get; set; } 
        public decimal AvgTime { get; set; }
    }
}
