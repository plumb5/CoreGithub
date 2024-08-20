using System;

namespace P5GenralML
{
    public class MLWorkFlowOBD
    {
        public int ConfigureOBDId { get; set; }
        public int AudioTemplateId { get; set; }
        public Int16 DeliverCount { get; set; }
        public Int16 PickCount { get; set; }
        public Int16 RejectCount { get; set; }
        public byte IsPromotionalOrTransactionalType { get; set; }
        public DateTime Date { get; set; }
    }
    public class OBDSendingDataList
    {
        public int ConfigureOBDId { get; set; }
        public int AudioTemplateId { get; set; }
        public byte IsPromotionalOrTransactionalType { get; set; }
        public string? TextMessage { get; set; }
        public string? AudioFile { get; set; }
    }
    public class MLWorkFlowOBDResponse
    {
        public int AccountId { get; set; }
        public int ContactId { get; set; }
        public string? PhoneNumber { get; set; }
        public int IsDelivered { get; set; }
        public int IsPicked { get; set; }
        public int IsRejected { get; set; }
        public int Pulse { get; set; }
        public int DurationOfCall { get; set; }
        public string? Status { get; set; }
        public string? Source { get; set; }
        public string? Circle { get; set; }
        public string? Operator { get; set; }
        public string? JobId { get; set; }
        public string? UniqueId { get; set; }
        public int WorkFlowId { get; set; }
        public int WorkFlowDataId { get; set; }
        public int ConfigId { get; set; }
        public string? Actions { get; set; }
        public System.Data.DataTable? OBDData { get; set; }

    }
}
