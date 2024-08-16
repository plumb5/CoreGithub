using System;

namespace P5GenralML
{
    public class TransactionInitiated
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public string TxId { get; set; }
        public string TxRefNo { get; set; }
        public string TxStatus { get; set; }
        public Decimal amount { get; set; }
        public string TxMsg { get; set; }
        public string pgTxnNo { get; set; }
        public string issuerRefNo { get; set; }
        public string authIdCode { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string pgRespCode { get; set; }
        public string addressZip { get; set; }
        public string signature { get; set; }
    }
}
