using System;

namespace P5GenralML
{
    public class MLGroupEmailValidationOverView
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Status { get; set; }
        public int Unique_emails { get; set; }
        public int Verified { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
        public int Ok { get; set; }
        public int Invalid { get; set; }
        public int GroupUniqueCount { get; set; }
        public string ErrorMessage { get; set; }
    }
}
