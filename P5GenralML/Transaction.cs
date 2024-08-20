using System;

namespace P5GenralML
{
   public class Transaction
    {
        public string? ProductId { get; set; }
        public double Quantity { get; set; }      
        public double UnitCost { get; set; }
        public decimal PurchasePrice { get; set; }
        public int ContactId { get; set; }
        public string? StoreNumber { get; set; }
        public DateTime? TransactionDate { get; set; }
        public bool IsOnlineOrOfflineTransaction { get; set; }
        public string? OrderId { get; set; }
        public string? AlternateOrderId { get; set; }
        public string? MachineId { get; set; }
        public string? SessionId { get; set; }
        public int? SourceType { get; set; }
        public string? MemberId { get; set; }
        public string? OfferCode { get; set; }
        public decimal Discount { get; set; }
        public string? FreeProductId1 { get; set; }
        public string? FreeProductId2 { get; set; }
    }
   
}
