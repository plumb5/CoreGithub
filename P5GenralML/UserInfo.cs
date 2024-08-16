using System;

namespace P5GenralML
{
    public class UserInfo
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string EmailId { get; set; }
        public string MobilePhone { get; set; }
        public string Password { get; set; }
        public bool IsAdmin { get; set; }
        public bool ActiveStatus { get; set; }
        public DateTime RegistrationDate { get; set; }
        public string DomainForTrack { get; set; }
        public string CompanyName { get; set; }
        public string CompanyWebUrl { get; set; }
        public string AddressDetails { get; set; }
        public string SecondaryAddress { get; set; }
        public string City { get; set; }
        public string StateDetail { get; set; }
        public string Country { get; set; }
        public string ZipPostalCode { get; set; }
        public string BusinessPhone { get; set; }
        public bool IsTrial { get; set; }
        public string ApiKey { get; set; }
        public int PasswordPolicyStatus { get; set; }
        public DateTime PasswordExpiry { get; set; }
        public bool IsOnPremise { get; set; }
        public string EmployeeCode { get; set; }
        public bool FirstTimePasswordReset { get; set; }
        public int LastModifiedByUserId { get; set; }
        public DateTime UpdatedDate { get; set; }
        public string Otp { get; set; }
        public bool IsOtp { get; set; }
        public string UserAccountType { get; set; }
        public string UserAccountRedirectDomain { get; set; }
        public string SetPrimaryPhoneNumber { get; set; }
        public DateTime UserLastActiveDateTime { get; set; }
        public int PreferredAccountId { get; set; }
    }
}
