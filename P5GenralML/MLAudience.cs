using System;

namespace P5GenralML
{
    public class _Plumb5MLGetVisitors
    {
        public int AccountId { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public int Duration { get; set; }
        public string? drpSearchBy { get; set; }
        public string? SearchTextValue { get; set; }
        public int VisitorSummary { get; set; }
    }
    public class _Plumb5MLGetNetwork
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public int Duration { get; set; }
    }
    public class _Plumb5MLGetDevices
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int startcount { get; set; }
        public int endcount { get; set; }
        public int Duration { get; set; }
    }
    public class _Plumb5MLBrowsersDetails
    {
        public int AccountId { get; set; }

        public int Duration { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int startcount { get; set; }
        public int endcount { get; set; }
    }
    public class _Plumb5MLTimeSpend
    {
        public int AccountId { get; set; }
        public int Duration { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
    }

    public class _Plumb5MLPageDepth
    {
        public int AccountId { get; set; }
        public int Duration { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
    }
    // page depth Ml Ends Here
    public class _Plumb5MLCity
    {
        public int AccountId { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public int Duration { get; set; }
    }
    // page depth Ml Ends Here

    // Frequency Ml Starts Here
    public class _Plumb5MLFrequency
    {
        public int AccountId { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int Duration { get; set; }
    }
    public class _Plumb5MLRecency
    {
        public int AccountId { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
    }
    public class _Plumb5MLUpdateScore
    {
        public int AccountId { get; set; }
        public string? MachineId { get; set; }
        public string? Key { get; set; }
    }
    public class _Plumb5MLGroupName
    {
        public int AccountId { get; set; }
        public int GroupId { get; set; }
        public System.Data.DataTable? ListData { get; set; }

    }
    public class _Plumb5MLRecencyReturn
    {
        public int AccountId { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
    }
    public class _Plumb5MLAutosuggest
    {
        public int AccountId { get; set; }
        public string? SearchText { get; set; }
        public string? Type { get; set; }
    }
    public class _Plumb5MLSearchBy
    {
        public int AccountId { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public int Duration { get; set; }
        public string? Type { get; set; }
        public string? SearchBy { get; set; }
        public int VisitorSummary { get; set; }
        public string? SearchParameter { get; set; }
        public string? SearchParameterType { get; set; }
        public string? Data { get; set; }
        public string? Data1 { get; set; }
        public string? FilterCondition { get; set; }
    }
    public class MLDeviceinfoData
    {
        public int DeviceId { get; set; }
        public string? Device { get; set; }
        public long PageViews { get; set; }
        public long Session { get; set; }
        public long UniqueVisitors { get; set; }
        public long AvgTime { get; set; }


    }
}
