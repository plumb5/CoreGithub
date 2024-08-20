using System;

namespace P5GenralML
{
    public class APILog
    {
        public int LogId { get; set; }
        public string? UniqueId { get; set; }
        public string? UserHostAddress { get; set; }
        public string? Headers { get; set; }
        public string? StatusCode { get; set; }
        public string? RequestBody { get; set; }
        public string? RequestedMethod { get; set; }
        public string? Useragent { get; set; }
        public string? AbsoluteUri { get; set; }
        public string? RequestType { get; set; }
        public DateTime? CreatedDate { get; set; }
    }
}
