using Plumb5GenralFunction;

namespace Plumb5.Areas.Mail.Models
{
    public class GeneralConfigurationSetting
    {
        public string ElasticMailDeliveryURL { get; set; }
        public string NetCoreFalconideDeliveryURL { get; set; }
        public string SendGridDeliveryURL { get; set; }
        public string EverlyticDeliveryURL { get; set; }
        public string JuvlonDeliveryURL { get; set; }

        public GeneralConfigurationSetting()
        {
            try
            {
                ElasticMailDeliveryURL = AllConfigURLDetails.KeyValueForConfig["ELASTICMAILDELIVERYURL"].ToString();
                NetCoreFalconideDeliveryURL = AllConfigURLDetails.KeyValueForConfig["NETCOREFALCONIDEDELIVERYURL"].ToString();
                SendGridDeliveryURL = AllConfigURLDetails.KeyValueForConfig["SENDGRIDDELIVERYURL"].ToString();
                EverlyticDeliveryURL = AllConfigURLDetails.KeyValueForConfig["EVERLYTICDELIVERYURL"].ToString();
                JuvlonDeliveryURL = AllConfigURLDetails.KeyValueForConfig["JUVLONDELIVERYURL"].ToString();
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("GeneralConfigurationSettingMailMarketing"))
                {
                    objError.AddError(ex.Message.ToString(), "Key value not found in the plumbmaster table", DateTime.Now.ToString(), "GeneralConfigurationSetting->GeneralConfigurationSetting->InnerException", ex.ToString());
                }
            }
        }
    }
}
