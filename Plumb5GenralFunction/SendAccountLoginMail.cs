using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class SendAccountLoginMail : IDisposable
    {
        public int SendLoginDetails(string UserName, string UserEmailId, string Password)
        {
            int result = -1;
            bool Status = false;
            try
            {
                string filename = AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString() + "\\Template\\welcome-new-account.html";
                FileInfo fileInfo = new FileInfo(filename);
                if (fileInfo.Exists)
                {
                    string html = File.ReadAllText(filename);
                    string MailBody = html.Replace("[{UserName}]", UserName).Replace("[{UserEmail}]", UserEmailId).Replace("[{Password}]", Password).Replace("<!--CLIENTLOGO_ONLINEURL-->", AllConfigURLDetails.KeyValueForConfig["CLIENTLOGO_ONLINEURL"].ToString());

                    using (MailMessage mailMsg = new MailMessage())
                    {
                        mailMsg.To.Add(UserEmailId);
                        mailMsg.Subject = "Welcome to Plumb5! Let's Get Started.";
                        mailMsg.Body = MailBody;
                        mailMsg.IsBodyHtml = true;
                        Status = Helper.SendMail(mailMsg);

                        if (Status)
                            result = 1;
                        else if (!Status)
                            result = 0;
                    }
                }
                return result;
            }
            catch (Exception ex)
            {
                return result;
            }
        }

        public int SendAccountAdded(string DomainName, string UserEmailId)
        {
            int result = -1;
            bool Status = false;
            try
            {
                string filename = AllConfigURLDetails.KeyValueForConfig["MAINPATH"].ToString() + "\\Template\\DomainAdd_Account.html";
                FileInfo fileInfo = new FileInfo(filename);
                if (fileInfo.Exists)
                {
                    string html = File.ReadAllText(filename);
                    string MailBody = html.Replace("[{DomainName}]", DomainName).Replace("<!--CLIENTLOGO_ONLINEURL-->", AllConfigURLDetails.KeyValueForConfig["CLIENTLOGO_ONLINEURL"].ToString());

                    using (MailMessage mailMsg = new MailMessage())
                    {
                        mailMsg.To.Add(UserEmailId);
                        mailMsg.Subject = "Domain added to your Plumb5 account";
                        mailMsg.Body = MailBody;
                        mailMsg.IsBodyHtml = true;
                        Status = Helper.SendMail(mailMsg);

                        if (Status)
                            result = 1;
                        else if (!Status)
                            result = 0;
                    }
                }
                return result;
            }
            catch (Exception ex)
            {
                return result;
            }
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
