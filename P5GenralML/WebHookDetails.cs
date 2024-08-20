using System;

namespace P5GenralML
{
    public class WebHookDetails
    {
        public int WebHookId { get; set; }
        public string? RequestURL { get; set; }
        public string? MethodType { get; set; }
        public string? ContentType { get; set; }
        public string? FieldMappingDetails { get; set; }
        public string? Headers { get; set; }
        public string? BasicAuthentication { get; set; }
        public DateTime CreatedDate { get; set; }
        public string? ErrorMessage { get; set; }
        public int TotalContactPost { get; set; }
        public int TotalContactNotPost { get; set; }
        public string? RawBody { get; set; }
    }
}
