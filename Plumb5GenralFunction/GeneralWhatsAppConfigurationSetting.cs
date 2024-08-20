using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class GeneralWhatsAppConfigurationSetting
    {
        public string WHATSAPP_RESPONSES { get; set; }
        public GeneralWhatsAppConfigurationSetting()
        {
            try
            {

                WHATSAPP_RESPONSES = AllConfigURLDetails.KeyValueForConfig["WHATSAPP_RESPONSES"].ToString();

            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("GeneralConfigurationSettingWhatsAppMarketing"))
                {
                    objError.AddError(ex.Message.ToString(), "WhatsApp Marketing Key value not found in the plumbmaster table", DateTime.Now.ToString(), "GeneralConfigurationSetting->GeneralConfigurationSetting->InnerException", ex.ToString());
                }
            }
        }
    }
}
