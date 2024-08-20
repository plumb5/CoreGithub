using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLSmsShortUrl:IDisposable
    {
        Task<long> Save(SmsShortUrl ShortUrl);
        Task<SmsShortUrl?> GetDetails(long SmsShortUrlId);
        Task<IEnumerable<SmsShortUrl>> GetDetailsAsync(long SmsShortUrlId);

    }
}
