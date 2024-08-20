using System;

namespace P5GenralML
{
   public class SMSDataSyncDetailsByAPI
    {
        public int Id { get; set; }      
        public string FileName { set; get; }
        public int NumberOfRecordsInserted { set; get; }
        public int ErrorCount { set; get; }
        public Boolean CompletedStatus { set; get; }
        public string RejectedReason { set; get; }
        public Nullable<DateTime> CreatedDate { get; set; }
    }
}
