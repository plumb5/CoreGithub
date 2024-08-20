using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public static class CallGeneralBaseFactory
    {
        public static IClickToCallVendor GetCallVendor(int accountId, MLCallApiConfiguration callApiConfiguration, string agentPhoneNumberWithoutCC = "")
        {
            string VendorName = callApiConfiguration.ProviderName.ToLower();
            switch (VendorName)
            {
                case "exotel": return new ExotelConnectCall(accountId, callApiConfiguration);
                case "voxbay": return new VoxbayConnectCall(accountId, callApiConfiguration, agentPhoneNumberWithoutCC);
                case "mcube": return new MCubeClickToCall(accountId, callApiConfiguration);
                default: throw new NotImplementedException("Call Vendor Not foud in plumb5");
            }
        }
    }
}
