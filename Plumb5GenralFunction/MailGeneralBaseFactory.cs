using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public static class MailGeneralBaseFactory
    {
        public static List<mailvendor> EmailVendorList = new List<mailvendor>
            {
            new mailvendor { Name = "netcore falconide", Domain = "netcore.in",Logo="logonetcore",IconStyle="provcomplogo logonetcore",MaxLimit=1000 },
            new mailvendor { Name = "elastic mail", Domain = "elasticemail.com" ,Logo="logoelastic",IconStyle="provcomplogo logoelastic",MaxLimit=1000},
            new mailvendor { Name = "everlytic", Domain = "everlytic.co.za",Logo="logoevelytic",IconStyle="provcomplogo logoevelytic",MaxLimit=1000 },
            new mailvendor { Name = "promotexter", Domain = "promotexter.com",Logo="logopromotexter",IconStyle="provcomplogo logopromotexter",MaxLimit=1000  },
            new mailvendor { Name = "juvlon", Domain = "juvlon.com",Logo="logojuvlon",IconStyle="provcomplogo logojuvlon",MaxLimit=1000  },
            new mailvendor { Name = "sendgrid", Domain = "sendgrid.com",Logo="logoSendGrid",IconStyle="provcomplogo logoSendGrid",MaxLimit=1000  }
        };

        public static IBulkMailSending GetMailVendor(int accountId, MailSetting mailSetting, MailSentSavingDetials mailSentSavingDetials, MailConfiguration currentMailConfigration, string mailTrackController, string jobTagName, int lmsgroupmemberid = 0, string SqlProvider = null)
        {
            string VendorName = currentMailConfigration.ProviderName.ToLower();
            switch (VendorName)
            {
                case "netcore falconide": return new SendNetCoreMail(accountId, mailSetting, currentMailConfigration, jobTagName, lmsgroupmemberid, SqlProvider: SqlProvider);
                case "elastic mail": return new SendElasticMail(accountId, mailSetting, currentMailConfigration, jobTagName, lmsgroupmemberid, SqlProvider: SqlProvider);
                case "everlytic": return new SendEverlyticMail(accountId, mailSetting, mailSentSavingDetials, currentMailConfigration, mailTrackController, jobTagName, SqlProvider: SqlProvider);
                case "promotexter": return new SendPromotexterMail(accountId, mailSetting, currentMailConfigration, jobTagName, SqlProvider: SqlProvider);
                case "juvlon": return new SendJuvlonMail(accountId, mailSetting, currentMailConfigration, jobTagName, lmsgroupmemberid, SqlProvider: SqlProvider);
                case "sendgrid": return new SendGridMail(accountId, mailSetting, currentMailConfigration, jobTagName, lmsgroupmemberid, SqlProvider: SqlProvider);
                default: throw new NotImplementedException("Mail Vendor Not foud in plumb5");
            }
        }
    }

    public class mailvendor
    {
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public string Domain { get; set; }
        public string Logo { get; set; }
        public string IconStyle { get; set; }
        public int MaxLimit { get; set; }
    }
}
