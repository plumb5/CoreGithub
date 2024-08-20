using System.Data;

namespace P5GenralML
{
    public class _Plumb5MLScores
    {
        public int AccountId { get; set; }
        public string? DomainName { get; set; }
        public string? ScoreType { get; set; }
        public string? SearchValue { get; set; }
        public DataTable Data { get; set; }
        public decimal Score { get; set; }
        public string? FullText { get; set; }
        public string? Channel { get; set; }


    }
    public class _Plumb5MLAutoComplete
    {
        public int AccountId { get; set; }
        public string? Query { get; set; }
        public string? Key { get; set; }
    }
    public class _Plumb5MLCustomReporting
    {
        public int AccountId { get; set; }
        public string? Query { get; set; }
        public string? Title { get; set; }
        public bool DisplayOrSave { get; set; }
        public string? Key { get; set; }
        public int Id { get; set; }
    }
    public class _Plumb5MLGetAllVisitors
    {
        public int AccountId { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public int Duration { get; set; }
        public string? Type { get; set; }
        public float StartScore { get; set; }
        public float EndScore { get; set; }
        public string? Channel { get; set; }
    }
}
