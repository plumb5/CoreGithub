using System;
using System.IO;
using System.Xml.Linq;

namespace P5GenralML
{
    public class LogError : IDisposable
    {
        private bool _disposed = false;
        public void AddErrorInLog(int accountId, string xmlName, string error, string methodName, string stackTrace)
        {
            try
            {
                var _xmlPath = "D:\\Plumb5 Projects\\Plumb5\\ErrorLogging\\" + xmlName + ".xml";
                XDocument xmlDoc;
                if (File.Exists(_xmlPath))
                {
                    xmlDoc = XDocument.Load(_xmlPath);
                }
                else
                {
                    using (FileStream fs = new FileStream(_xmlPath, FileMode.CreateNew, FileAccess.Write))
                    {
                        using (StreamWriter strwrt = new StreamWriter(fs))
                        {
                            strwrt.Write("<?xml version='1.0' encoding='utf-8' ?>");
                            strwrt.WriteLine("<Plumb5>");
                            strwrt.WriteLine("</Plumb5>");
                            strwrt.Flush();
                            fs.Close();
                            xmlDoc = XDocument.Load(_xmlPath);
                        }
                    }
                }
                var xElement = xmlDoc.Element("Plumb5");
                if (xElement != null)
                    xElement.Add(
                        new XElement("WorkFlowError",
                                     new XElement("AccountId", accountId),
                                     new XElement("Error", error),
                                     new XElement("Date", DateTime.Now),
                                     new XElement("Method", methodName),
                                     new XElement("StackTrace", stackTrace)
                                     ));

                xmlDoc.Save(_xmlPath);
            }
            catch
            { }
        }
        #region Dispose
        protected void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                _disposed = true;
                if (disposing)
                {

                }
            }
        }
        public void Dispose()
        {
            Dispose(true);
        }
        #endregion
    }
}
