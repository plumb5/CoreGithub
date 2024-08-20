using System;

namespace P5GenralML
{
    public class MLTicketDetails
    {
        public string? Connection { get; set; }
        public int DbType { get; set; }
        public string? Action { get; set; }
        public int TicketId { get; set; }
        public string? TicketNumber { get; set; }
        public string? AppType { get; set; }
        public string? Query { get; set; }
        public int CustomizationStatus { get; set; }
        public int Status { get; set; }
        public int NewTicketStatus { get; set; }
        public string? ClosedBy { get; set; }
        public DateTime QueryDate { get; set; }
        public int AccountId { get; set; }
        public string? AccountName { get; set; }
        public string? EmailId { get; set; }
        public string? Attachment { get; set; }
        public string? ReplyContent { get; set; }
        public DateTime ReplyDate { get; set; }
        public DateTime TaskCompleteDate { get; set; }
        public int Feedback { get; set; }
        public int UserId { get; set; }
        public string? ScreenShot { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
        public int TicketType { get; set; }
        public int TotalHours { get; set; }

        public string? Title { get; set; }
        public string? SubmitterName { get; set; }
        public string? SubmitterDescription { get; set; }
        public DateTime SubmittedDate { get; set; } = DateTime.Now;
        public DateTime RequiredDate { get; set; } = DateTime.Now;
        public string? Priority { get; set; }
        public string? EstimateDay { get; set; }
        public string? EstimateTime { get; set; }
        public string? Resource { get; set; }
        public string? DevComment { get; set; }
        public string? Cost { get; set; }
        public string? TotalCost { get; set; }

        public MLTicketDetails()
        {
            QueryDate = DateTime.Now;
            ReplyDate = DateTime.Now;
            TaskCompleteDate = DateTime.Now;
        }


    }
}
