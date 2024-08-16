using System;

namespace P5GenralML
{
    public class MLAdminUserInfo
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailId { get; set; }
        public string MobilePhone { get; set; }
        public string Password { get; set; }
        public int Role { get; set; }
        public bool ActiveStatus { get; set; }
        public DateTime RegistrationDate { get; set; }
        public DateTime LastSignedIn { get; set; }
        public bool IsTrail { get; set; }
        public bool IsAllAcc { get; set; }
        public bool IsAdmin { get; set; }
    }

    public class MLAdminManagersName
    {
        public string AccountManagerName { get; set; }
    }
    public class MLAdminManagersDetails
    {
        public string AccountManagerName { get; set; }
        public string EmailId { get; set; }
        public string MobilePhone { get; set; }
    }
}
