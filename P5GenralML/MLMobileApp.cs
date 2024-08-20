namespace P5GenralML
{
    public class MLVisitMobile
    {
        public int AccountId { get; set; }
        public int Duration { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
    }
    public class MLTimeOnMobile
    {
        public int AccountId { get; set; }
        public int Duration { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
    }
    public class MLAudienceMobile
    {
        public int AccountId { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int Offset { get; set; }
        public int FetchNext { get; set; }
    }
    public class MLRecencyMobile
    {
        public int AccountId { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
    }
    public class MLTimeSpendMobile
    {
        public int AccountId { get; set; }
        public int Duration { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
    }

    public class MLCitiesMobile
    {
        public int AccountId { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public int Duration { get; set; }
    }
    public class MLCountriesMobile
    {
        public int AccountId { get; set; }
        public int Duration { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
    }
    public class MLNetworkMobile
    {
        public int AccountId { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public int Duration { get; set; }
    }
    public class MLGeofence
    {
        public int AccountId { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public System.Data.DataTable GeoData { get; set; }
    }
    public class MLBeacon
    {
        public int AccountId { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public System.Data.DataTable BeaconData { get; set; }
    }
    public class MLEventTrackingMobile
    {
        public int Id { get; set; }
        public int AccountId { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }


        public string Names { get; set; }
        public string Events { get; set; }
        public string EventType { get; set; }
        public string Action { get; set; }
        public string drpSearchBy { get; set; }
        public string SearchTextValue { get; set; }
    }
    public class MLGetDevicesMobile
    {

        public int AccountId { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int startcount { get; set; }
        public int endcount { get; set; }
    }
    public class MLGetOSMobile
    {
        public int AccountId { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int startcount { get; set; }
        public int endcount { get; set; }
        public int Duration { get; set; }
    }
    public class MLUniqueVisitsMobile
    {
        public int AccountId { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public string Key { get; set; }
        public string Data { get; set; }
        public string Location { get; set; }
    }
    public class MLGetVisitorsMobile
    {
        public int AccountId { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public int Duration { get; set; }
        public string Type { get; set; }
        public string SearchBy { get; set; }
    }
    public class MLAutosuggestMobile
    {
        public int AccountId { get; set; }
        public string SearchText { get; set; }
        public string Type { get; set; }
    }
    public class MLMobilePopularPage
    {
        public int AccountId { get; set; }
        public string ScreenName { get; set; }
        public string FromDate { get; set; }
        public string ToDate { get; set; }
        public int StartCount { get; set; }
        public int EndCount { get; set; }
    }
}
