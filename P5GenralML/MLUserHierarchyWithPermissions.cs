namespace P5GenralML
{
    public class MLUserHierarchyWithPermissions
    {
        public int UserInfoUserId { get; set; }
        public int AccountId { get; set; }
        public int SeniorUserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailId { get; set; }
        public string MobilePhone { get; set; }
        public bool IsAdmin { get; set; }
        public bool ActiveStatus { get; set; }
        public int Levels { get; set; }
        public int PermissionLevelsId { get; set; }
        public DateTime RegistrationDate { get; set; }
    }
}
