namespace P5GenralML
{
    //PopularPage
    public class _Plumb5MLPopularPages
    {
        public int AccountId { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public int Duration { get; set; }
        public string? Channel { get; set; }
    }
    public class _Plumb5MLEntryandExit
    {
        public int AccountId { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public string? Source { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public string? Key { get; set; }
        public int Duration { get; set; }
    }
    public class _Plumb5MLPageAnalysisPopularPage
    {
        public int AccountId { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
    }
    public class _Plumb5MLPageAnalysis
    {
        public int AccountId { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int Duration { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public string? PageName { get; set; }
        public string? DomainName { get; set; }
        public string? Key { get; set; }
        public int devicetype { get; set; }
        public string? LeadSource { get; set; }
    }
    public class _Plumb5MLAutoSuggest
    {
        public int AccountId { get; set; }
        public string? Query { get; set; }
    }
    public class MLTotalDataInTheDuration
    {
        public int PageViews { get; set; }
        public int UniqueVisits { get; set; }
        public int SourceCounts { get; set; }
        public int CityCounts { get; set; }
        public int SearchKeys { get; set; }
    }
    public class MLBindSourcesPageAnalysis
    {
        public int PageViews { get; set; }
        public string? Source { get; set; }
    }
    public class MLBindCitiesPageAnalysis
    {
        public int PageViews { get; set; }
        public string? City { get; set; }
        public int Uniques { get; set; }
    }
    public class _Plumb5MLEventTracking
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public string? Names { get; set; }
        public string? Events { get; set; }
        public string? EventType { get; set; }
        public string? Action { get; set; }
        public string? drpSearchBy { get; set; }
        public string? SearchTextValue { get; set; }
        public int Status { get; set; }
    }
    public class MLEventTrackingPages
    {
        public string? PageName { get; set; }
        public string? PageTitle { get; set; }
    }
    public class MLPopularPagesLocation
    {

        public string? City { get; set; }
        public string? Latitude { get; set; }
        public string? Longitude { get; set; }
    }
    public class MLRecommendation
    {
        public int AccountId { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
    }
    public class MLHeatMap
    {
        public int AccountId { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public System.Data.DataTable ListData { get; set; }
    }
}
