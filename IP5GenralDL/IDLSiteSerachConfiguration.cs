using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLSiteSerachConfiguration:IDisposable
    {
        Task<Int32> Save(LoginInfo user, string Plumb5AccountDomain, string Plumb5AccountName, string SiteUrl);
    }
}
