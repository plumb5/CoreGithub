using System;

namespace P5GenralML
{
    public class MLMailBouncedContact : MailBouncedContact
    {
        public int ContactId { get; set; }
    }

    public class MailBouncedContact
    {
        public int Id { get; set; }
        public string? Category { get; set; }
        public string? ReasonForBounce { get; set; }
        public string? Errorcode { get; set; }
        public DateTime? BounceDate { get; set; }
        public string? Emailid { get; set; }
        public string? BounceType { get; set; }
    }
}
