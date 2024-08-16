namespace P5GenralML
{
    public class MLUser
    {
        public string Action { get; set; }
        public int UserId { get; set; }
        public int Status { get; set; }
        public string EmailId { get; set; }
        public string Password { get; set; }
        public string UserName { get; set; }

    }

    public class MLAccount
    {
        public string Action { get; set; }
        public int UserId { get; set; }
        public int AccountId { get; set; }
        public string AccountName { get; set; }
        public string CreatedDate { get; set; }
        public string ExpirayDate { get; set; }
        public int Feature { get; set; }
    }


    public class MLNotification
    {
        public string Action { get; set; }
        public string Name { get; set; }
        public string Account { get; set; }
        public int UserId { get; set; }
        public int AccountId { get; set; }
        public string Title { get; set; }
        public string Updates { get; set; }
        public int Analytic { get; set; }
        public int AnalyticShowOn { get; set; }
        public string AnalyticsShowonUrl { get; set; }
        public string Fromdate { get; set; }
        public string Todate { get; set; }
        public int NotificationStatus { get; set; }
        public int Leads { get; set; }
        public int LeadsShowon { get; set; }
        public string LeadsShowonUrl { get; set; }
        public int Quant5 { get; set; }
        public int Q5Showon { get; set; }
        public string Q5ShowonUrl { get; set; }
        public int Engauge { get; set; }
        public int EngaugeShowon { get; set; }
        public string EngaugeshownUrl { get; set; }
        public int Multimedium { get; set; }
        public int MultimediumShowon { get; set; }
        public string MultimediumShowonUrl { get; set; }
        public string Createddate { get; set; }

    }
    public class _Plumb5IncludeExclude
    {
        public int AccountId { get; set; }
        public bool AllowSubDomain { get; set; }
        public string IncludeKey { get; set; }
        public string ExcludeKey { get; set; }
    }

    public class MLResetPassword
    {
        public string EmailId { get; set; }
        public string Password { get; set; }
    }
}
