namespace P5GenralML
{
    public class _Plumb5MLGoal
    {
        public int AccountId { get; set; }
        public int GoalId { get; set; }
        public string? Channel { get; set; }
        public string? GoalName { get; set; }
        public string? PageName1 { get; set; }
        public string? PageName2 { get; set; }
        public string? PageName3 { get; set; }
        public string? PageName4 { get; set; }
        public string? PageName5 { get; set; }
        public string? PageName6 { get; set; }
        public string? PageName7 { get; set; }
        public string? PageName8 { get; set; }
        public string? PageName9 { get; set; }
        public string? PageName10 { get; set; }
        public string? Key { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }

        public int Start { get; set; }
        public int End { get; set; }
    }
    public class _Plumb5MLForwardGoal
    {
        public int AccountId { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int GoalId { get; set; }
    }
    public class _Plumb5MLReverseGoal
    {
        public int AccountId { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int GoalId { get; set; }
        public string? Domain { get; set; }
    }
    public class _Plumb5MLTransaction
    {
        public int AccountId { get; set; }
        public int Duration { get; set; }
        public string? Fromdate { get; set; }
        public string? Todate { get; set; }
        public int Maintain { get; set; }
        public string? ProductId { get; set; }
        public string? SearchKey { get; set; }
    }
    public class _Plumb5MLTransactionDetails
    {
        public int AccountId { get; set; }
        public int Duration { get; set; }
        public string? Fromdate { get; set; }
        public string? Todate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
    }
    public class _Plumb5MLCohortAnalysis
    {
        public int AccountId { get; set; }
    }

    public class _Plumb5MLVisitorsByStage
    {
        public int AccountId { get; set; }
        public string? Fromdate { get; set; }
        public string? Todate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public string? Stage { get; set; }
    }
    public class _Plumb5MLSegments
    {
        public int AccountId { get; set; }
        public string? Fromdate { get; set; }
        public string? Todate { get; set; }
        public string? Actions { get; set; }
    }
    public class listAllPages
    {
        public string? PageName { get; set; }
    }
}
