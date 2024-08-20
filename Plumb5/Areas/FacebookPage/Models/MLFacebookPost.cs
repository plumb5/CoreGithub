namespace Plumb5.Areas.FacebookPage.Models
{
    public class MLFacebookPost
    {
        public string ID { get; set; }
        public string Message { get; set; }
        public string postURL { get; set; }
        public string CreatedDate { get; set; }
        public int Clicks { get; set; }
        public int Likes { get; set; }
        public int Comments { get; set; }
        public int TotalImpressions { get; set; }
        public int PaidImpressions { get; set; }
        public int EngagementRate_prc { get; set; }
        public string oEmbedHTML { get; set; }
    }
}
