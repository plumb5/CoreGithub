using P5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class HelperForWhatsApp
    {
        readonly int AdsId;
        readonly string SqlVendor;
        public HelperForWhatsApp(int adsId,string sqlvendor)
        {
            AdsId = adsId;
            SqlVendor = sqlvendor;
        }
        #region SMS Url Shorten

        public string URLfromID(long ID)
        {
            //ID should be converted to base 62 format

            char[] map = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".ToCharArray();
            StringBuilder shortURL = new StringBuilder();
            while (ID > 0)
            {
                shortURL.Append(map[ID % 62]);
                ID /= 62;
            }
            return ReverseString(shortURL.ToString());
        }
        public string ReverseString(string s)
        {
            char[] arr = s.ToCharArray();
            Array.Reverse(arr);
            return new string(arr);
        }
        public static long URLtoID(String url)
        {
            long id = 0;
            char[] arr = url.ToCharArray();
            for (int i = 0; i < arr.Length; i++)
            {
                if ('a' <= arr[i] && arr[i] <= 'z')
                    id = id * 62 + arr[i] - 'a';
                if ('A' <= arr[i] && arr[i] <= 'Z')
                    id = id * 62 + arr[i] - 'A' + 26;
                if ('0' <= arr[i] && arr[i] <= '9')
                    id = id * 62 + arr[i] - '0' + 52;
            }
            return id;
        }

        #endregion SMS Url Shorten

        #region Replace SMS Content

        public async void ReplaceMessageWithWhatsAppUrl(string CampaignTypeIs, StringBuilder Body, int whatsappId, int ContactId, List<WhatsAppTemplateUrl> whatsappUrlList, string P5UniqueID = "", int WorkFlowId = 0, bool IsLinkReplaceNeeded = false)
        {
            try
            {
                if (whatsappUrlList != null && whatsappUrlList.Count > 0)
                {
                    StringBuilder Bodydata = new StringBuilder();
                    for (int i = 0; i < whatsappUrlList.Count; i++)
                    {
                        if (Body.ToString().Contains("<!-" + whatsappUrlList[i].Id + "->") || Body.ToString().Contains("<!--" + whatsappUrlList[i].Id + "-->") || Body.ToString().Contains("[{*" + whatsappUrlList[i].Id + "*}]"))
                        {
                            string trackingCode = "";

                            long SavedShortUrlId = 0;
                            if (CampaignTypeIs.ToLower() == "campaign")
                            {
                                SavedShortUrlId = await SaveWhatsAppShortUrl(new WhatsappShortUrl() { AccountId = AdsId, CampaignType = "campaign", URLId = whatsappUrlList[i].Id, WhatsappSendingSettingId = whatsappId, WorkflowId = 0, P5WhatsappUniqueID = P5UniqueID });
                            }
                            if (CampaignTypeIs.ToLower() == "lms")
                            {
                                SavedShortUrlId = await SaveWhatsAppShortUrl(new WhatsappShortUrl() { AccountId = AdsId, CampaignType = "lms", URLId = whatsappUrlList[i].Id, WhatsappSendingSettingId = whatsappId, WorkflowId = 0, P5WhatsappUniqueID = P5UniqueID });
                            }
                            else if (CampaignTypeIs.ToLower() == "trigger")
                            {
                                SavedShortUrlId = await SaveWhatsAppShortUrl(new WhatsappShortUrl() { AccountId = AdsId, CampaignType = "trigger", URLId = whatsappUrlList[i].Id, WhatsappSendingSettingId = 0, WorkflowId = 0, P5WhatsappUniqueID = P5UniqueID });
                            }
                            else if (CampaignTypeIs.ToLower() == "workflow")
                            {
                                SavedShortUrlId = await SaveWhatsAppShortUrl(new WhatsappShortUrl() { AccountId = AdsId, CampaignType = "workflow", URLId = whatsappUrlList[i].Id, WhatsappSendingSettingId = whatsappId, WorkflowId = WorkFlowId, P5WhatsappUniqueID = P5UniqueID }); ;
                            }

                            if (SavedShortUrlId > 0)
                            {
                                string WhatsAppShortUrlString = URLfromID(SavedShortUrlId);
                                string ContactIdString = URLfromID(ContactId);
                                trackingCode = WhatsAppShortUrlString + "-" + ContactIdString;

                                if (IsLinkReplaceNeeded)
                                    trackingCode = Convert.ToString(AllConfigURLDetails.KeyValueForConfig["WHATSAPP_RESPONSES"]) + trackingCode;
                            }

                            Bodydata.Clear().Append(Regex.Replace(Body.ToString(), "<!-" + whatsappUrlList[i].Id + "->", trackingCode, RegexOptions.IgnoreCase));
                            Body.Clear().Append(Bodydata);

                            Bodydata.Clear().Append(Regex.Replace(Body.ToString(), "<!--" + whatsappUrlList[i].Id + "-->", trackingCode, RegexOptions.IgnoreCase));
                            Body.Clear().Append(Bodydata);

                            Bodydata.Clear();
                            Bodydata.Clear().Append(Regex.Replace(Body.ToString(), @"\[\{\*" + whatsappUrlList[i].Id + @"\*\}\]", trackingCode, RegexOptions.IgnoreCase));
                            Body.Clear().Append(Bodydata);
                        }
                    }
                    Bodydata = null;
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("ReplaceMessageWithWhatsAppUrl"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "HelperForWhatsApp->ReplaceMessageWithWhatsAppUrl->Inner", ex.ToString());
                }
            }
        }

        #endregion Replace SMS Content

        public async Task<long> SaveWhatsAppShortUrl(WhatsappShortUrl WhatsappShortUrlDetails)
        {
            long SavedShortUrlId = 0;
            try
            {
                using (var objBL =   DLWhatsappShortUrl.GetDLWhatsappShortUrl(SqlVendor))
                {
                    SavedShortUrlId = await objBL.Save(new WhatsappShortUrl()
                    {
                        AccountId = AdsId,
                        WhatsappSendingSettingId = WhatsappShortUrlDetails.WhatsappSendingSettingId,
                        URLId = WhatsappShortUrlDetails.URLId,
                        WorkflowId = WhatsappShortUrlDetails.WorkflowId,
                        CampaignType = WhatsappShortUrlDetails.CampaignType,
                        P5WhatsappUniqueID = WhatsappShortUrlDetails.P5WhatsappUniqueID
                    });
                }
            }
            catch (Exception ex)
            {
                SavedShortUrlId = 0;
                using (ErrorUpdation objError = new ErrorUpdation("ReplaceMessageWithWhatsAppUrl"))
                {
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "HelperForWhatsApp->SaveWhatsAppShortUrl", ex.ToString());
                }
            }
            return SavedShortUrlId;
        }

        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                }
            }
            //dispose unmanaged ressources
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}
