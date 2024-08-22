using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using Plumb5GenralFunction;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Plumb5.Models
{
    public static class AccountDetails
    {
        public static async Task<string> GetAccountConnection(int AccountId, string vendor)
        {
            string ConnectionString = string.Empty;
            //if (HttpContext.Session.GetString["AccountInfo"] != null)
            //{
            //    DomainInfo domainInfo = (DomainInfo)HttpContext.Session.GetString["AccountInfo"];
            //    if (domainInfo != null && domainInfo.Connection != null && domainInfo.Connection != string.Empty)
            //    {
            //        ConnectionString = domainInfo.Connection;
            //    }
            //}

            if (string.IsNullOrEmpty(ConnectionString))
            {
                using (var objDL = DLAccountConnection.GetDLAccountConnection(vendor))
                {
                    CommonInfo? commonInfo = await objDL.GetAccountConnection(AccountId);
                    if (commonInfo != null && commonInfo.Connection != null && commonInfo.Connection != string.Empty)
                    {
                        ConnectionString = commonInfo.Connection;
                    }
                }
            }

            return ConnectionString;
        }

        public static async Task<string> GetEncryptedValueAccountId(int AccountId, int UserId, string vendor)
        {
            string encryptedid = "";
            List<MLLmsAdvancedSettings> advancedsettingsdetails = null;

            using (var objBL = DLLmsAdvancedSettings.GetLmsAdvancedSettings(AccountId, vendor))
                advancedsettingsdetails = await objBL.GetDetailsAdvancedSettings("PUBLISHER");

            if (advancedsettingsdetails != null && advancedsettingsdetails.Count > 0)
            {
                List<PublisherValue> listpublishervalues = new List<PublisherValue>();
                PublisherValue eachlmsobject = new PublisherValue();

                listpublishervalues = JsonConvert.DeserializeObject<List<PublisherValue>>(advancedsettingsdetails[0].Value);

                if (listpublishervalues != null && listpublishervalues.Count() > 0)
                {
                    for (int i = 0; i < listpublishervalues.Count(); i++)
                    {
                        if (listpublishervalues[i].userinfoid == UserId)
                        {
                            encryptedid = "" + listpublishervalues[i].userinfoid + "~" + listpublishervalues[i].value + "~" + listpublishervalues[i].IsMasking + "";
                            encryptedid = EncryptDecrypt.Encrypt(encryptedid.ToString());
                            encryptedid = encryptedid.Replace('+', '~');
                        }
                    }
                }
            }

            return encryptedid;
        }
    }
}