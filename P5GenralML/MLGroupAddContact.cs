using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLGroupAddContact
    {
        public FirstName FirstName { get; set; }

        public LastName LastName { get; set; }

        public string? Education { get; set; }

        public Genders Gender { get; set; }

        public string? Occupation { get; set; }

        public Martial MaritalStatus { get; set; }

        public string? Location { get; set; }

        public string? Interests { get; set; }

        public string? UtmSource { get; set; }

        public string? UtmMedium { get; set; }

        public string? UtmCampaign { get; set; }

        public string? UtmTerm { get; set; }

        public string? UtmContent { get; set; }

        public MailSubscribe MailSubscribe { get; set; }

        public SmsSubscribe SmsSubscribe { get; set; }

        public WhatsAppOptin IsWhatsAppOptIn { get; set; }

        //public string? AccountType { get; set; }

        //public string? AccountOpenedSource { get; set; }

        //public string? LastActivityLoginDate { get; set; }

        //public string? LastActivityLoginSource { get; set; }

        //public string? CustomerScore { get; set; }

        //public string? AccountAmount { get; set; }

        //public Customer IsCustomer { get; set; }

        //public MoneyTransferCustomer IsMoneyTransferCustomer { get; set; }

        //public Referred IsReferred { get; set; }

        //public GoalSaver IsGoalSaver { get; set; }

        //public ReferredOpenedAccount IsReferredOpenedAccount { get; set; }

        //public ComplaintRaised IsComplaintRaised { get; set; }

        //public string? ComplaintType { get; set; }

        //public string? WhatsAppConsentDate { get; set; }
    }
    public class FieldDetails
    {
        public string? FieldName { get; set; }
        public string? FieldType { get; set; }
        public string? FieldValue { get; set; }
        public string? CustomFieldName { get; set; }
    }
    public enum Genders
    {
        Male, Female, Others
    }
    public enum FirstName
    {
        Available, NotAvailable
    }
    public enum LastName
    {
        Available, NotAvailable
    }
    public enum Martial
    {
        Married,
        NotMarried,
        Others
    }
    public enum MailSubscribe
    {
        False, True
    }
    public enum MailOverAllSubscribe
    {
        False, True, NA
    }
    public enum SmsSubscribe
    {
        False, True
    }
    public enum SmsOverAllSubscribe
    {
        False, True, NA
    }
    public enum AccountHolder
    {
        True, False, NA
    }
    public enum Customer
    {
        True, False, NA
    }
    public enum MoneyTransferCustomer
    {
        True, False, NA
    }
    public enum Referred
    {
        True, False, NA
    }
    public enum GoalSaver
    {
        True, False, DateTime
    }
    public enum ComplaintRaised
    {
        True, False, NA
    }
    public enum WhatsAppOptin
    {
        True, False
    }
    public enum ReferredOpenedAccount
    {
        True, False, NA
    }
}
