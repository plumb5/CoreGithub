using System.Collections.Generic;

namespace P5GenralML
{
    public class _Plumb5MLAllSources
    {
        public int AccountId { get; set; }
        public int Duration { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int Compare { get; set; }
        public int Maintain { get; set; }
        public string Key { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public string Page { get; set; }
        public string Type { get; set; }
    }
    public class GetSource
    {
        public string Date { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int Direct { get; set; }
        public int SearchBy { get; set; }
        public int Referrer { get; set; }
        public List<GetSourceSummary> SourceSummary { get; set; }
    }
    public class GetSourceSummary
    {
        public int TotalDirect { get; set; }
        public int TotalSearchBy { get; set; }
        public int TotalReferrer { get; set; }
    }
    public class SourcePercentageComparison
    {
        public int DirectComparison { get; set; }
        public int SearchComparison { get; set; }
        public int ReferComparison { get; set; }
    }
    public class _Plumb5MLEmailSmsSources
    {
        public int AccountId { get; set; }
        public int Duration { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string Key { get; set; }
    }
    public class _Plumb5MLPaidCampaigns
    {
        public string Action { get; set; }
        public int AccountId { get; set; }
        public int Duration { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string Mode { get; set; }
        public int End { get; set; }
        public int Start { get; set; }
        public string PageName { get; set; }
        public int Maintain { get; set; }
        public string Key { get; set; }
        public int OnChange { get; set; }
        public string UTMParameter { get; set; }
        public string UTMSourceParameter { get; set; }
        public string UTMMediumParameter { get; set; }
        public string UTMCampaignParameter { get; set; }
        public string SearchText { get; set; }
        public string UTMSourceTags { get; set; }
        public string UTMMediumTags { get; set; }
        public string UTMCampaignTags { get; set; }


    }
    public class _Plumb5MLAttributionModel
    {
        public int AccountId { get; set; }
        public string ModelName { get; set; }
        public string PageName { get; set; }
        public int AttributionId { get; set; }
        public string Key { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
    }

    public class _Plumb5MVisitorsFlow
    {
        public int AccountId { get; set; }
        public int Interaction { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public System.Data.DataTable ListData { get; set; }
        public System.Data.DataTable ListDataNew { get; set; }
        public string Action { get; set; }
        public string Domain { get; set; }
        public int Duration { get; set; }
    }

    public class _Plumb5UserVisitorsFlow
    {
        public int AccountId { get; set; }
        public int Interaction { get; set; }
        public System.Data.DataTable ListData { get; set; }
        public string Action { get; set; }
        public string Domain { get; set; }
        public string MachineId { get; set; }
    }
    public class _Plumb5PaidCampaignsFilter
    {
        public string Action { get; set; }
        public int Id { get; set; }
        public int AccountId { get; set; }
        public string LandingPage { get; set; }
        public string Mode { get; set; }
        public int Start { get; set; }
        public int End { get; set; }

    }
    public class _Plumb5MLLandingPageAutosuggest
    {
        public int AccountId { get; set; }
        public string SearchText { get; set; }
    }
}
