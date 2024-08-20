using System;

namespace P5GenralML
{
    public class TransactionShipment
    {
        public int OrderId { get; set; }
        public int ContactId { get; set; }
        public string? SMSResposeId { get; set; }
        public bool ShipmentStatus { get; set; }
        public DateTime Orderdate { get; set; }
        public DateTime shippeddate { get; set; }
    }
}
