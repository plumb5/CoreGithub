namespace P5GenralML
{
    public class MLSmsSentStatusReport
    {
        public int SmsSendingSettingId { get; set; }
        public int Total { get; set; }
        public int TotalSent { get; set; }
        public int TotalNotSent { get; set; }
        public int TotalYetToSend { get; set; }
        public int TotalReTry { get; set; }
        public int TotalFailed { get; set; }
    }
}
