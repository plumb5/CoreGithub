using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public static class EmailVerifyGeneralBaseFactory
    {
        public static List<emailverifiervendor> EmailVerifierVendorList = new List<emailverifiervendor> {
            new emailverifiervendor { Name = "million verifier", Domain = "api.millionverifier.com",MaxLimit=500 }};

        public static IBulkVerifyEmailContact GetEmailVerifierVendor(int adsid, EmailVerifyProviderSetting currentVerifierConfigration)
        {
            string VendorName = currentVerifierConfigration.ProviderName.ToLower();
            switch (VendorName)
            {
                case "million verifier": return new VerifyMillionVerifierEmailContact(currentVerifierConfigration);
                default: throw new NotImplementedException("Vendor Not foud in plumb5");
            }
        }
    }

    public class emailverifiervendor
    {
        public string Name { get; set; }
        public string Domain { get; set; }
        public int MaxLimit { get; set; }
    }
}
