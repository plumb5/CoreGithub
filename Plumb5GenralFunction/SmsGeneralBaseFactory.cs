using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public static class SmsGeneralBaseFactory
    {
        public static List<smsvendor> SMSVendorList = new List<smsvendor> {
            new smsvendor { Name = "Netcore",DisplayName="Netcore", Domain = "netcore.in",CountryCode="IN",IconStyle="provcomplogo logonetcore",MaxLimit=1000,Logo="logonetcore" },
            //new smsvendor { Name = "routemobile",DisplayName="Routemobile", Domain = "routemobile.com",CountryCode="IN",IconStyle="provcomplogo logoroutemobile",MaxLimit=1000,Logo="logoroutemobile" },
            new smsvendor { Name = "SMSPortal",DisplayName="SMSPortal", Domain = "smsportal.com",CountryCode="SA",IconStyle="provcomplogo logosmsportal",MaxLimit=100,Logo="logosmsportal" },
            new smsvendor { Name = "AclMobile",DisplayName="Aclmobile", Domain = "aclmobile.com",CountryCode="IN",IconStyle="provcomplogo logotaclmobile",MaxLimit=1000,Logo="logotaclmobile" },
            new smsvendor { Name = "DoveSoft",DisplayName="Dove Soft", Domain = "dove-soft.com",CountryCode="IN",IconStyle="provcomplogo logodovesoft",MaxLimit=1000,Logo="logodovesoft" },
            new smsvendor { Name = "Promotexter",DisplayName="Promotexter", Domain = "promotexter.com",CountryCode="PH",IconStyle="provcomplogo logopromotexter",MaxLimit=1000,Logo="logopromotexter" },
            new smsvendor { Name = "TMarc",DisplayName="TMarc", Domain = "tmarc.co.za",CountryCode="SA",IconStyle="provcomplogo logotmarc",MaxLimit=1000,Logo="logotmarc" },
            new smsvendor { Name = "DigiSpice",DisplayName="DigiSpice", Domain = "digispice.com",CountryCode="IN",IconStyle="provcomplogo logoDigispice",MaxLimit=200,Logo="logoDigispice" },
            new smsvendor { Name = "Winnovature",DisplayName="Winnovature", Domain = "winnovature.com",CountryCode="IN",IconStyle="provcomplogo logowinnovature",MaxLimit=1000,Logo="logowinnovature" },
            new smsvendor { Name = "ValueFirst",DisplayName="ValueFirst", Domain = "vfirst.com",CountryCode="IN",IconStyle="provcomplogo logovaluefirst",MaxLimit=1000,Logo="logovaluefirst" },
        };
        public static IBulkSmsSending GetSMSVendor(int adsid, SmsConfiguration currentSmsConfigration, string jobTagName,string SqlVendor)
        {
            string VendorName = currentSmsConfigration.ProviderName.ToLower();
            switch (VendorName)
            {
                case "netcore": return new SendNetCoreSms(currentSmsConfigration, jobTagName);
                //case "routemobile": return new SendRouteMobileSms(currentSmsConfigration, jobTagName);
                case "smsportal": return new SendSmsPortalSms(currentSmsConfigration, jobTagName);
                case "aclmobile": return new SendACLMobileSms(adsid, currentSmsConfigration, jobTagName);
                case "dovesoft": return new SendDoveSoftSms(currentSmsConfigration, jobTagName);
                case "promotexter": return new SendPromotexterSms(adsid, currentSmsConfigration, jobTagName);
                case "tmarc": return new SendTmarcSms(adsid, currentSmsConfigration, SqlVendor, jobTagName);
                case "digispice": return new SendDigiSpiceSms(adsid, currentSmsConfigration, jobTagName);
                case "winnovature": return new SendWinnoVatureSms(adsid, currentSmsConfigration, jobTagName);
                case "valuefirst": return new SendValueFirstSms(adsid, currentSmsConfigration, jobTagName);
                default: throw new NotImplementedException("Vendor Not foud in plumb5");
            }
        }
    }


    public class smsvendor
    {
        public string Name { get; set; }
        public string DisplayName { get; set; }
        public string Domain { get; set; }
        public string CountryCode { get; set; }
        public string IconStyle { get; set; }
        public int MaxLimit { get; set; }
        public string Logo { get; set; }
    }
}
