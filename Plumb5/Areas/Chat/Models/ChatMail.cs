using IP5GenralDL;
using P5GenralDL;
using P5GenralML;
using Plumb5GenralFunction;

namespace Plumb5.Areas.Chat.Models
{
    public class ChatMail : IDisposable
    {
        readonly int AdsId;
        private readonly string? SQLProvider;

        public ChatMail(int adsId, string? sQLProvider)
        {
            AdsId = adsId;
            SQLProvider = sQLProvider;
        }

        public async Task<Tuple<bool, string>> SendTranscriptMail(int AccountId, int chatId, string userId, string emailId, string DomainName)
        {
            string ErrorMessage = string.Empty;
            bool Result = false;
            string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(AccountId, SQLProvider);

            List<ChatFullTranscipt> chatTranscript = null;
            using (var objDAL = DLChatRoom.GetDLChatRoom(AdsId, SQLProvider))
                chatTranscript = await objDAL.GetTranscriptAdmin(chatId, userId);

            if (chatTranscript != null && chatTranscript.Count > 0)
            {
                MailConfiguration? configration = new MailConfiguration();
                using (var objDLConfig = DLMailConfiguration.GetDLMailConfiguration(AdsId, SQLProvider))
                    configration = await objDLConfig.GetConfigurationDetailsForSending(true, IsDefaultProvider: true);

                if (configration != null && configration.IsBulkSupported.Value)
                {
                    string format = "MMM ddd d HH:mm yyyy";
                    string chatTranscriptContent = "";

                    for (int i = 0; i < chatTranscript.Count; i++)
                    {
                        if (i > 0)
                        {

                            var presentDate = Convert.ToDateTime(Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(chatTranscript[i].ChatDate))).ToString("MMM ddd d");
                            var pastDate = Convert.ToDateTime(Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(chatTranscript[i - 1].ChatDate))).ToString("MMM ddd d");
                            if (presentDate != pastDate)
                                chatTranscriptContent += "<br/>";
                        }
                        if (chatTranscript[i].IsAdmin.ToString() == "1")
                        {
                            chatTranscriptContent += @"<div class='chatagentwrp' style='background-color:#ffffff;padding:10px 20px;border:solid 1px #ccc;border-left:solid 2px #1515af;margin-top: 5px;'>
                                                            <h6 style='font-family:sans-serif;font-size:14px;color:#222222;margin:0;'>
                                                                " + chatTranscript[i].Name +
                                                                @"<span style='font-size:11px;color:#616060;font-weight:400;'> " + Convert.ToDateTime(Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(chatTranscript[i].ChatDate))).ToString(format) + @" </span></h6>        
                                                            <p class='p5textdescp' style='font-family:'Open Sans',sans-serif;font-size:13px;color:#222222;padding:5px 20px 5px 0px;margin:0;line-height:22px;'>
                                                                " + chatTranscript[i].ChatText + @"
                                                            </p>
                                                      </div>";


                        }
                        else
                        {
                            chatTranscriptContent += @"<div class='chatagentwrp' style='background-color:#f8f9fa;padding:10px 20px;border:solid 1px #ccc;border-left:solid 2px #5e5e5f;margin-top:5px;'>
                                                            <h6 style='font-family:sans-serif;font-size:14px;color:#222222;margin:0;'>
                                                                " + chatTranscript[i].Name +
                                                                @"<span style='font-size:11px;color:#616060;font-weight:400;'> " + Convert.ToDateTime(Helper.ConvertFromUTCToLocalTimeZone(TimeZone, Convert.ToDateTime(chatTranscript[i].ChatDate))).ToString(format) + @" </span>
                                                            </h6>        
                                                            <p class='p5textdescp' style='font-family:'Open Sans', sans-serif; font-size:13px;color:#222222;padding:5px 0px 5px 0px; margin:0;line-height:22px;'>
                                                                " + chatTranscript[i].ChatText + @"
                                                            </p>
                                                      </div>";

                        }
                    }

                    string MailBody = chatTranscriptContent;
                    string filename = AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString() + "\\Template\\chat-history.html";
                    FileInfo fileInfo = new FileInfo(filename);
                    if (fileInfo.Exists)
                    {
                        string html = File.ReadAllText(filename);
                        MailBody = html.Replace("{@render}", MailBody).Replace("<!--CLIENTLOGO_ONLINEURL-->", AllConfigURLDetails.KeyValueForConfig["CLIENTLOGO_ONLINEURL"].ToString());
                    }

                    string FromEmailId = "";
                    string FromName = AllConfigURLDetails.KeyValueForConfig["FROM_NAME_EMAIL"].ToString();
                    using (var objDL = DLMailConfigForSending.GetDLMailConfigForSending(AccountId, SQLProvider))
                    {
                        MailConfigForSending? mailConfig = await objDL.GetActiveFromEmailId();
                        if (mailConfig != null && !string.IsNullOrWhiteSpace(mailConfig.FromEmailId))
                            FromEmailId = mailConfig.FromEmailId;
                    }

                    if (MailBody != null && MailBody.Length > 0 && !string.IsNullOrWhiteSpace(FromEmailId))
                    {
                        string subject = "Your chat transcript as on  " + Convert.ToDateTime(Helper.ConvertFromUTCToLocalTimeZone(TimeZone, DateTime.Now)).ToString(format) + " ";
                        Contact? contact = new Contact() { EmailId = emailId };
                        using (var objDLContact = DLContact.GetContactDetails(AdsId, SQLProvider))
                        {
                            contact = await objDLContact.GetDetails(contact);
                            if (contact == null)
                            {
                                contact = new Contact() { EmailId = emailId };
                                using (var objDL = DLContact.GetContactDetails(AdsId, SQLProvider))
                                {
                                    contact.ContactId = await objDL.Save(contact);
                                }
                            }
                        }

                        MailSetting mailSetting = new MailSetting()
                        {
                            Forward = false,
                            FromEmailId = FromEmailId,
                            FromName = FromName,
                            MailTemplateId = 0,
                            ReplyTo = FromEmailId,
                            Subject = subject,
                            Subscribe = true,
                            IsTransaction = true,
                            MessageBodyText = MailBody
                        };

                        MLMailSent mailSent = new MLMailSent()
                        {
                            MailTemplateId = 0,
                            MailCampaignId = 0,
                            MailSendingSettingId = 0,
                            GroupId = 0,
                            ContactId = contact.ContactId,
                            EmailId = contact.EmailId,
                            P5MailUniqueID = Guid.NewGuid().ToString()
                        };

                        MailSentSavingDetials mailSentSavingDetials = new MailSentSavingDetials()
                        {
                            ConfigurationId = 0,
                            GroupId = 0
                        };

                        List<MLMailSent> mailSentList = new List<MLMailSent>();
                        mailSentList.Add(mailSent);
                        Tuple<bool, string> response = SendMail(mailSentList, mailSetting, mailSentSavingDetials, configration);
                        ErrorMessage = response.Item2;
                        Result = response.Item1;
                    }
                    else
                    {
                        ErrorMessage = "Chat transcript template not found to send a mail";
                        Result = false;
                    }
                }
                else
                {
                    ErrorMessage = "Please check transactional configuration not found to send a mail";
                    Result = false;
                }
            }
            else
            {
                ErrorMessage = "Transcript not found to send a mail";
                Result = false;
            }

            return Tuple.Create(Result, ErrorMessage);
        }

        public Tuple<bool, string> SendMail(List<MLMailSent> mailSentList, MailSetting mailSetting, MailSentSavingDetials mailSentSavingDetials, MailConfiguration configration)
        {
            bool result = false;
            string Error = string.Empty;
            try
            {
                IBulkMailSending MailGeneralBaseFactory = Plumb5GenralFunction.MailGeneralBaseFactory.GetMailVendor(AdsId, mailSetting, mailSentSavingDetials, configration, "MailTrack", "Chat");
                result = MailGeneralBaseFactory.SendBulkMail(mailSentList);

                if (MailGeneralBaseFactory.VendorResponses != null && MailGeneralBaseFactory.VendorResponses.Count > 0)
                {
                    List<MLMailVendorResponse> responses = MailGeneralBaseFactory.VendorResponses;
                    MailSent responseMailSent = new MailSent()
                    {
                        FromEmailId = mailSetting.FromEmailId,
                        FromName = mailSetting.FromName,
                        MailTemplateId = mailSetting.MailTemplateId,
                        Subject = mailSetting.Subject,
                        MailCampaignId = responses[0].MailCampaignId,
                        MailSendingSettingId = responses[0].MailSendingSettingId,
                        GroupId = responses[0].GroupId,
                        ContactId = responses[0].ContactId,
                        EmailId = responses[0].EmailId,
                        P5MailUniqueID = responses[0].P5MailUniqueID,
                        CampaignJobName = responses[0].CampaignJobName,
                        ErrorMessage = responses[0].ErrorMessage,
                        ProductIds = responses[0].ProductIds,
                        ResponseId = responses[0].ResponseId,
                        SendStatus = (byte)responses[0].SendStatus,
                        WorkFlowDataId = responses[0].WorkFlowDataId,
                        WorkFlowId = responses[0].WorkFlowId,
                        SentDate = DateTime.Now,
                        ReplayToEmailId = mailSetting.ReplyTo,
                        TriggerMailSmsId = 0,
                        MailConfigurationNameId = configration.MailConfigurationNameId
                    };

                    using (var objDL = DLMailSent.GetDLMailSent(AdsId, SQLProvider))
                    {
                        objDL.Send(responseMailSent);
                    }

                    string ErrorMessage = MailGeneralBaseFactory.ErrorMessage;

                    if (result)
                    {
                        Error = "";
                        result = true;
                    }
                    else
                    {
                        Error = ErrorMessage;
                        result = false;
                    }
                }
                else
                {
                    Error = "Unable to send mail";
                    result = false;
                }
            }
            catch (Exception ex)
            {
                Error = ex.Message;
                result = false;
            }

            return Tuple.Create(result, Error);
        }


        #region Dispose Method

        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    //dispose managed ressources
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
