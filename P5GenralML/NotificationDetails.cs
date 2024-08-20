using System;

namespace P5GenralML
{
    public class NotificationDetails
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Account { get; set; }
        public int AccountAccountId { get; set; }
        public int UserInfoUserId { get; set; }
        public string? Title { get; set; }
        public string? Updates { get; set; }
        public int FeatureType { get; set; }
        public bool ActiveStatus { get; set; }
        public string? ShowonUrl { get; set; }
        public DateTime Fromdate { get; set; }
        public DateTime Todate { get; set; }
        public DateTime Createddate { get; set; }

        public NotificationDetails()
        {
            Fromdate = Todate = Createddate = DateTime.Now;
        }
    }
}
