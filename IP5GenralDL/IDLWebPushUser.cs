using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLWebPushUser:IDisposable
    {
        Task<Int32> GetMaxCount(WebPushUser webPushUser, DateTime FromDateTime, DateTime ToDateTime, string FilterByEmailorPhone);
        Task<IEnumerable<WebPushUser>> GetDetails(WebPushUser webPushUser, DateTime FromDateTime, DateTime ToDateTime, int Offset, int FetchNext, string FilterByEmailorPhone);
        Task<WebPushUser?> GetWebPushInfo(WebPushUser objInfo);
        Task<Int32> GetGroupMaxCount(WebPushUser webPushUser, int GroupId);
        Task<IEnumerable<MLWebPushUser>> GetGroupDetails(WebPushUser webPushUser, int Offset, int FetchNext, int GroupId);
        Task<Int32> Save(WebPushUser webPushUserInfo);

    }
}
