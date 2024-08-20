using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLApiUserGroup : IDisposable
    {
        Task<Int16> Save(int lastassignuserinfouserid, int usergroupid);
        Task<ApiUserGroup?> GET(int usergroupid);
    }
}
