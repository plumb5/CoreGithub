using System;

namespace P5GenralML
{
    public class MailDataSyncDetailsByAPI
    {
        public int Id { get; set; }
        public string MailFileName { get; set; }
        public int SuccessCount { get; set; }
        public int ErrorCount { get; set; }
        public bool CompletedStatus { get; set; }
        public string Reason { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
