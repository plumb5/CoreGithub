namespace P5GenralML
{
    public class _Plumb5MLHome
    {
        public int AccountId { get; set; }
        public string? DomainName { get; set; }
    }
    public class _Plumb5MLVisits
    {
        public int AccountId { get; set; }
        public int Duration { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int Compare { get; set; }
    }
    public class _Plumb5MLCountry
    {
        public int AccountId { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int Duration { get; set; }
    }
    public class _Plumb5MLNewRepeat
    {
        public int AccountId { get; set; }
        public int Duration { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int Compare { get; set; }
    }
    public class _Plumb5MLTimeOnSite
    {
        public int AccountId { get; set; }
        public int Duration { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int Compare { get; set; }
    }
    public class _Plumb5MLTimeTrends
    {
        public int AccountId { get; set; }
        public int Duration { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int Compare { get; set; }
        public int Offset { get; set; }
        public int Fetchnext { get; set; }
    }
}
