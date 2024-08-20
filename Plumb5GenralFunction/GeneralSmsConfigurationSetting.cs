using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class GeneralSmsConfigurationSetting
    {
        public string NetcoreDeliveryURL { get; set; }
        public string RouteMobileDeliveryURL { get; set; }
        public string SmsPortal { get; set; }
        public string TmarcDeliveryURL { get; set; }
        public string PlivoDeliveryURL { get; set; }
        public string ChannelMobileDeliveryURL { get; set; }
        public string EverlyticDeliveryURL { get; set; }

        public GeneralSmsConfigurationSetting()
        {
            try
            {
                NetcoreDeliveryURL = AllConfigURLDetails.KeyValueForConfig["NETCOREDELIVERYURL"].ToString();
                RouteMobileDeliveryURL = AllConfigURLDetails.KeyValueForConfig["ROUTEMOBILEDELIVERYURL"].ToString();
                SmsPortal = AllConfigURLDetails.KeyValueForConfig["SMSPORTAL"].ToString();
                TmarcDeliveryURL = AllConfigURLDetails.KeyValueForConfig["TMARCDELIVERYURL"].ToString();
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("GeneralConfigurationSettingSMSMarketing"))
                {
                    objError.AddError(ex.Message.ToString(), "Sms Marketing Key value not found in the plumbmaster table", DateTime.Now.ToString(), "GeneralConfigurationSetting->GeneralConfigurationSetting->InnerException", ex.ToString());
                }
            }
        }

        public static MLSmsConfiguration EncrptSmsDetails(MLSmsConfiguration smsConfigurationDetails)
        {
            int proCnt, tranCnt;
            if (!String.IsNullOrEmpty(smsConfigurationDetails.PromotionalAPIKey))
            {
                proCnt = smsConfigurationDetails.PromotionalAPIKey.Length <= 5 ? smsConfigurationDetails.PromotionalAPIKey.Length - 1 : smsConfigurationDetails.PromotionalAPIKey.Length - 5;

                smsConfigurationDetails.PromotionalAPIKey = smsConfigurationDetails.PromotionalAPIKey.Substring(proCnt).PadLeft(smsConfigurationDetails.PromotionalAPIKey.Length, '*');
            }

            if (!String.IsNullOrEmpty(smsConfigurationDetails.TransactionalAPIKey))
            {
                tranCnt = smsConfigurationDetails.TransactionalAPIKey.Length <= 5 ? smsConfigurationDetails.TransactionalAPIKey.Length - 1 : smsConfigurationDetails.TransactionalAPIKey.Length - 5;

                smsConfigurationDetails.TransactionalAPIKey = smsConfigurationDetails.TransactionalAPIKey.Substring(tranCnt).PadLeft(smsConfigurationDetails.TransactionalAPIKey.Length, '*');
            }

            return smsConfigurationDetails;
        }
    }
}
