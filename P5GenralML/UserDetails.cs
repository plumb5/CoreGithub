using System.Collections.Generic;

namespace P5GenralML
{
    public class UserDetails
    {
        public int MainUserId { get; set; }
        public int UserInfoUserId { get; set; }
        public int SeniorUserId { get; set; }
        public int AccountId { get; set; }
        public List<int> GroupId { get; set; }
        public int CreatedByUserId { get; set; }
        public int PermissionLevelsId { get; set; }
    }

    public class UserDetail
    {
        public int UserInfoUserId { get; set; }
        public int SeniorUserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailId { get; set; }
        public bool IsAdmin { get; set; }
        public bool ActiveStatus { get; set; }
    }

    public class UserDetailswithSenior
    {
        public int UserInfoUserId { get; set; }
        public int SeniorUserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailId { get; set; }
        public string Senior { get; set; }
        public bool IsAdmin { get; set; }
        public bool ActiveStatus { get; set; }
    }

    public class UserDetailsHierarchyWithPermissions
    {
        public int UserInfoUserId { get; set; }
        public int SeniorUserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailId { get; set; }
        public string Senior { get; set; }
        public bool IsAdmin { get; set; }
        public bool? ActiveStatus { get; set; }
        public int PermissionLevelsId { get; set; }
        public DateTime? RegistrationDate { get; set; }
    }


    public class UserSignUpDetails
    {
        public int UserInfoUserId { get; set; }
        public int SeniorUserId { get; set; }
        public int AccountId { get; set; }
        public int Levels { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailId { get; set; }
        public bool IsAdmin { get; set; }
        public bool ActiveStatus { get; set; }
    }
}
