using Microsoft.Data.SqlClient;
using P5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace Plumb5GenralFunction
{
    public class ErrorUpdation : IDisposable
    {
        private string _xmlPath;

        public string XmlPath { get { return _xmlPath; } set { _xmlPath = value; } }
        private string LogName = String.Empty;

        public ErrorUpdation(string fileName)
        {
            LogName = fileName;
            XmlPath = AllConfigURLDetails.KeyValueForConfig["MAINPATH"] + "\\ErrorLog\\EPAllHistoryDetailsP5ABCD\\" + fileName + ".xml";
        }

        public void AddError(string Error, string ErrorDescription, string ErrorDateTime, string pageName, string stackTrace, bool IsCritical = false)
        {
            try
            {
                ErrorUpdation.AddErrorLog(LogName, Error, ErrorDescription, DateTime.Now, pageName, stackTrace, IsCritical);
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("ErrorUpdation"))
                    objError.AddXlmErrorLog(ex.Message.ToString(), "", DateTime.Now.ToString(), "AddError", ex.ToString());
            }
        }

        //DataBase Log
        public static void AddErrorLog(string LogName, string Error, string ErrorDescription, DateTime ErrorDateTime, string pageName, string stackTrace, bool IsCritical = false)
        {
            try
            {
                MLErrorUpdation mLErrorUpdation = new MLErrorUpdation
                {
                    LogName = LogName,
                    Error = Error,
                    ErrorDescription = ErrorDescription,
                    ErrorDateTime = ErrorDateTime,
                    PageName = pageName,
                    StackTrace = stackTrace
                };

                //using (DLErrorUpdation objDL = new DLErrorUpdation())
                //{
                //    objDL.SaveLog(mLErrorUpdation);
                //}

                if (IsCritical)
                    SendMail(mLErrorUpdation);

            }
            catch (SqlException sqlEx)
            {
                using (ErrorUpdation objError = new ErrorUpdation(LogName))
                    objError.AddXlmErrorLog(Error, ErrorDescription, ErrorDateTime.ToString(), pageName, stackTrace);

                using (ErrorUpdation objError = new ErrorUpdation("ErrorUpdation"))
                    objError.AddXlmErrorLog(sqlEx.Message.ToString(), "", DateTime.Now.ToString(), "AddErrorLog", sqlEx.ToString());
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("ErrorUpdation"))
                    objError.AddXlmErrorLog(ex.Message.ToString(), "", DateTime.Now.ToString(), "AddErrorLog", ex.ToString());
            }
        }

        //Xml Log
        public void AddXlmErrorLog(string Error, string ErrorDescription, string ErrorDateTime, string pageName, string stackTrace)
        {
            try
            {
                XDocument xmlDoc;
                if (File.Exists(XmlPath))
                {
                    xmlDoc = XDocument.Load(XmlPath);
                }
                else
                {
                    using (FileStream fs = new FileStream(XmlPath, FileMode.CreateNew, FileAccess.Write))
                    {
                        using (StreamWriter strwrt = new StreamWriter(fs))
                        {
                            strwrt.Write("<?xml version='1.0' encoding='utf-8' ?>");
                            strwrt.WriteLine("<Plumb5>");
                            strwrt.WriteLine("</Plumb5>");
                            strwrt.Flush();
                            fs.Close();
                            xmlDoc = XDocument.Load(XmlPath);
                        }
                    }
                }

                var xElement = xmlDoc.Element("Plumb5");
                if (xElement != null)
                    xElement.Add(
                        new XElement("Plumb5",
                                     new XElement("Error", Error),
                                     new XElement("ErrorDescription", ErrorDescription),
                                     new XElement("ErrorDateTime", ErrorDateTime),
                                     new XElement("pageName", pageName),
                                     new XElement("stackTrace", stackTrace)));

                xmlDoc.Save(XmlPath);
            }
            catch
            {
                //throw ex;
            }
        }

        public static void SendMail(MLErrorUpdation mLErrorUpdation)
        {
            try
            {
                string EmailId = AllConfigURLDetails.KeyValueForConfig["LOGEMAILID"].ToString();
                string ServerName = Convert.ToString(AllConfigURLDetails.KeyValueForConfig["SERVERNAME"]);

                string Body = String.Format("Log Name :- {0} {1}", mLErrorUpdation.LogName, Environment.NewLine);
                Body += String.Format("Error :- {0} {1}", mLErrorUpdation.Error, Environment.NewLine);
                Body += String.Format("Error Description :- {0} {1}", mLErrorUpdation.ErrorDescription, Environment.NewLine);
                Body += String.Format("Page Name :- {0} {1}", mLErrorUpdation.PageName, Environment.NewLine);
                Body += String.Format("Stack Trace :- {0} {1}", mLErrorUpdation.StackTrace, Environment.NewLine);
                Body += String.Format("Error Date Time :- {0} {1}", mLErrorUpdation.ErrorDateTime, Environment.NewLine);
                Body += String.Format("Domain :- {0} {1}", ServerName, Environment.NewLine);

                MailMessage mailMsg = new MailMessage();
                mailMsg.Subject = "PLUMB5 APPLICATION ISSUE! CRITICAL ISSUE in LOG {" + mLErrorUpdation.LogName + "}";
                mailMsg.Body = Body;
                mailMsg.IsBodyHtml = false;
                mailMsg.To.Add(EmailId);
                //Helper.SendMail(mailMsg);
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("ErrorUpdation"))
                    objError.AddXlmErrorLog(ex.Message.ToString(), "", DateTime.Now.ToString(), "SendMail", ex.ToString());
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
                    _xmlPath = null;
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
