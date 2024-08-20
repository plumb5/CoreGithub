namespace P5GenralML
{
    public class _Plumb5MLClickStream
    {
        public int AccountId { get; set; }
        public string MachineId { get; set; }
        public string ContactId { get; set; }
        public string DeviceId { get; set; }
        public string Key { get; set; }
        public string DomainName { get; set; }
    }
    public class _Plumb5MLTransactionData
    {
        public int AccountId { get; set; }
        public string MachineId { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
    }
    public class _Plumb5MLClickStreamPageDetails
    {
        public int AccountId { get; set; }
        public string SessionId { get; set; }
    }
    public class _Plumb5MLClickStreamPageDetailsMobile
    {
        public int AccountId { get; set; }
        public string SessionId { get; set; }
        public string DeviceId { get; set; }
        public string Key { get; set; }
        public string contactId { get; set; }
    }
    public class _Plumb5MLAddNotes
    {
        public int AccountId { get; set; }
        public string Note { get; set; }
        public string MachineId { get; set; }
        public int ContactId { get; set; }
        public string ImageName { get; set; }
    }
}
