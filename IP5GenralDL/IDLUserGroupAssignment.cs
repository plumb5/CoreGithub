using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLUserGroupAssignment : IDisposable
    {
        Task<int> SaveOrUpdate(int channelid, string channeltype, int usergroupid, int lastassignuserinfouserid, string userassignedvalues, int id = 0);
        Task<UserGroupAssignment?> GetDetails(int channelid = 0, string channeltype = null, int usergroupid = 0);
    }
}
