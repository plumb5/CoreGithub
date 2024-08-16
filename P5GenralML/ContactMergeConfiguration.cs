using System;

namespace P5GenralML
{
    public class ContactMergeConfiguration
    {
        public int Id { get; set; }
        public int UserInfoUserId { get; set; }
        public bool PrimaryEmail { get; set; }
        public bool PrimarySMS { get; set; }
        public bool AlternateEmail { get; set; }
        public bool AlternateSMS { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
