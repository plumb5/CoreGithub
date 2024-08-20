namespace P5GenralML
{
    public class MLCustomDashboard
    {
        public int AccountId { get; set; }
        public string? DashboardName { get; set; }
        public string? Segments { get; set; }
        public int Duration { get; set; }
        public string? DurationOrder { get; set; }
        public string? NameOrder { get; set; }
        public int PeakTime { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int DashId { get; set; }
        public string? SegmentName { get; set; }
        public string? Type { get; set; }
        public string? DataViewOrder { get; set; }
        public int CrId { get; set; }
    }
    public class MLCustomReportDashboard
    {
        public int AdsId { get; set; }
        public string? ColValue { get; set; }
        public string? Score { get; set; }
        public string? Query { get; set; }
        public string? Title { get; set; }
        public string? DisplayOrSave { get; set; }
        public int RowId { get; set; }
    }
}
