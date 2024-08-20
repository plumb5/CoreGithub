using System;

namespace P5GenralML
{
    public class ChatInteractionOverView
    {
        public string ChatUserId { get; set; }
        public int LastAgentServedBy { get; set; }
        public bool? InitiatedByUser { get; set; }
        public bool? IsCompleted { get; set; }
        public bool? IsMissed { get; set; }
        public double FeedBack { get; set; }
        public int FeedBackForAgentId { get; set; }
        public bool? IsTransferd { get; set; }
        public Int16 IsConvertedToLeadOrCustomer { get; set; }
        public string ChatInitiatedOnPageUrl { get; set; }
        public int ResponseCount { get; set; }
        public DateTime? Date { get; set; }
        public bool? IsFormFilled { get; set; }
    }
}
