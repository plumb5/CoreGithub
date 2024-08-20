using System;

namespace P5GenralML
{
    public class MLSmsGroups
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? GroupDescription { get; set; }
        public Nullable<DateTime> CreatedDate { get; set; }
        public int Total { get; set; }
        public int UnSubscribe { get; set; }
        public int Dnd { get; set; }//0
        public int UnVerified { get; set; }//-1
        public int Verified { get; set; }//1
        public int InValid { get; set; }//2
        public Int16 GroupType { get; set; }
    }
}
