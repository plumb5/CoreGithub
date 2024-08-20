using System;

namespace P5GenralML
{
   public class TransactionCancelationDetails
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public float ProductPrice { get; set; }
        public float MRP { get; set; }
        public float UnitCost { get; set; }
        public float PurchasePrice { get; set; }
        public int ContactId { get; set; }
        public string? StoreNumber { get; set; }
        public DateTime TransactionDate { get; set; }
        public bool IsOnlineOrOfflineTransaction { get; set; }
        public string? OrderId { get; set; }
        public string? AlternateOrderId { get; set; }
        public string? MachineId { get; set; }
        public string? SessionId { get; set; }
        public string? SourceType { get; set; }
        public string? MemberId { get; set; }
        public string? OfferCode { get; set; }
        public float Discount { get; set; }
        public string? FreeProductId1 { get; set; }
        public string? FreeProductId2 { get; set; }
        public DateTime OrderCancelationDate { get; set; }
        
    }
}
