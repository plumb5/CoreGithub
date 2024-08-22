using Microsoft.AspNetCore.Razor.Language;
using Microsoft.Web.Administration;
using Plumb5GenralFunction;
using System.Net;


namespace Plumb5.Areas.Mail.Models
{
    public class IISWebsite : IDisposable
    {
        public static string PortNumber = AllConfigURLDetails.KeyValueForConfig["PORTNUMBER"].ToString();
        public static string WebsiteName = AllConfigURLDetails.KeyValueForConfig["WEBSITENAME"].ToString();
        public static string protocol = AllConfigURLDetails.KeyValueForConfig["PROTOCOL"].ToString();
        public static string Plumb5IPAddress = AllConfigURLDetails.KeyValueForConfig["PLUMB5IPADDRESS"].ToString();

        public string ErrorMessage { get; set; }
        public bool IISResult { get; set; }

        //public string AddWebsiteToIIs()
        //{
        //    string message = "";
        //    try
        //    {
        //        Boolean bWebsite = IsWebsiteExists(WebsiteName);
        //        if (!bWebsite)
        //        {
        //            using (ServerManager serverMgr = new ServerManager())
        //            {
        //                Site mySite = serverMgr.Sites.Add(WebsiteName, "", Convert.ToInt32(PortNumber));
        //                //serverMgr.ApplicationPools.Add(ApplicationPoolName);
        //                //mySite.ApplicationDefaults.ApplicationPoolName = ApplicationPoolName;
        //                //mySite.TraceFailedRequestsLogging.Enabled = true;
        //                //mySite.TraceFailedRequestsLogging.Directory = PhysicalPath;
        //                serverMgr.CommitChanges();
        //            }
        //        }

        //        else
        //        {
        //            message = "Website name already exist";


        //        }

        //        return message;
        //    }
        //    catch (Exception ex)
        //    {

        //        return ex.Message;
        //    }
        //}


        public void EditBinding(string DomainName)
        {

            try
            {
                bool IsDomainExist = ISDomainExist(DomainName, Plumb5IPAddress);
                if (IsDomainExist)
                {

                    using (ServerManager serverManager = new ServerManager())
                    {
                        bool IsHostExistsinlist = IsHostExists(DomainName, WebsiteName);
                        if (!IsHostExistsinlist)
                        {
                            IISResult = AddDomainToSite(DomainName, WebsiteName);
                            ErrorMessage = "Host added sucessfully";
                        }
                        else
                        {
                            IISResult = false;
                            ErrorMessage = "This domain is already exists,add new domain for tracking ";
                        }
                    }
                }
                else
                {
                    ErrorMessage = "Domain name not belongs to server.";
                    IISResult = false;

                }
            }
            catch
            {
                ErrorMessage = "Technical problem while creating a tracking domain";
                IISResult = false;
            }
        }

        public void UpdateBinding(string newDomainName, string oldDomainName)
        {
            try
            {

                bool IsDomainExist = ISDomainExist(newDomainName, Plumb5IPAddress);
                if (IsDomainExist)
                {
                    bool IsHostExistsinlist = IsHostExists(oldDomainName, WebsiteName);

                    if (IsHostExistsinlist)
                    {
                        IISResult = RemoveDomain(oldDomainName, WebsiteName);
                        if (IISResult)
                        {
                            bool IsHostExist = IsHostExists(newDomainName, WebsiteName);
                            if (!IsHostExist)
                            {
                                IISResult = AddDomainToSite(newDomainName, WebsiteName);
                                ErrorMessage = "Host added sucessfully";

                            }
                            else
                            {
                                IISResult = false;
                                ErrorMessage = "This domain is already exists,add new domain for tracking";
                            }
                        }
                        else
                        {
                            IISResult = false;
                            ErrorMessage = "Enable to update tracking domain";
                        }

                    }
                    else
                    {
                        IISResult = false;
                        ErrorMessage = "Enable to update tracking domain";
                    }
                }
                else
                {
                    ErrorMessage = "Domain name not belongs to server.";
                    IISResult = false;

                }
            }
            catch
            {
                IISResult = false;
                ErrorMessage = "Technical problem while updating a tracking domain";
            }
        }

        public bool IsWebsiteExists(string strWebsitename)
        {
            Boolean flagset = false;
            using (ServerManager serverMgr = new ServerManager())
            {
                SiteCollection sitecollection = serverMgr.Sites;
                foreach (Site site in sitecollection)
                {
                    if (site.Name == strWebsitename.ToString())
                    {
                        flagset = true;
                        break;
                    }
                    else
                    {
                        flagset = false;
                    }
                }

            }


            return flagset;
        }

        public bool IsHostExists(string HostName, string SiteName)
        {
            using (ServerManager serverManager = new ServerManager())
            {
                bool flagset = false;
                BindingCollection biningCollection = serverManager.Sites[SiteName].Bindings;
                foreach (Binding item in biningCollection)
                {
                    if (item.Host == HostName)
                        return true;
                }
                return flagset;
            }

        }

        public bool ISDomainExist(string HostName, string IpAddress)
        {
            bool flagset = false;
            foreach (IPAddress address in Dns.GetHostAddresses(HostName))
            {
                if (address.ToString() == IpAddress)
                    return true;
            }
            return flagset;
        }


        public bool AddDomainToSite(string NewDomain, string WebsiteName)
        {
            using (ServerManager serverManager = new ServerManager())
            {
                BindingCollection biningCollection = serverManager.Sites[WebsiteName].Bindings;
                Binding binding = serverManager.Sites[WebsiteName].Bindings.CreateElement("binding");
                binding["protocol"] = protocol;
                binding["bindingInformation"] = string.Format(@"{0}:{1}:{2}", "*", PortNumber, NewDomain);
                biningCollection.Add(binding);
                serverManager.CommitChanges();
            }
            return true;
        }



        public bool RemoveDomain(string oldDomainName, string WebsiteName)
        {
            using (ServerManager serverManager = new ServerManager())
            {
                Site mySite = serverManager.Sites[WebsiteName];
                for (int i = 0; i < mySite.Bindings.Count; i++)
                {
                    if (mySite.Bindings[i].Host == oldDomainName)
                    {
                        mySite.Bindings.RemoveAt(i);
                        serverManager.CommitChanges();
                        return true;
                    }
                }
            }
            return false;
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
            disposed = true;
        }
        public void Dispose()
        {
            Dispose(true);
        }
        #endregion End of Dispose Method
    }
}
