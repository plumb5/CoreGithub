using IP5GenralDL;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using P5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.AccessControl;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace Plumb5GenralFunction
{
    public class P5MemoryCache
    {
        private readonly IDistributedCache _cache;

        private readonly string? SQLProvider;
        public P5MemoryCache(IConfiguration _configuration, IDistributedCache cache)
        {
            SQLProvider = _configuration["SqlProvider"];
            _cache = cache;
        }

        public async Task<string?> GetAccountTimeZoneFromCachedMemory(int AdsId)
        {
            string? TimeZone = string.Empty;
            try
            {
                string CacheKey = $"CachedTimeZone_{AdsId}";
                TimeZone = await _cache.GetStringAsync(CacheKey);

                if (string.IsNullOrEmpty(TimeZone))
                {
                    AccountTimeZone? accounttimezoneDetails = null;
                    using (var objDLAccountTimeZone = DLAccountTimeZone.GetDLAccountTimeZone(AdsId, SQLProvider))
                        accounttimezoneDetails = await objDLAccountTimeZone.GET();

                    if (accounttimezoneDetails != null && !string.IsNullOrEmpty(accounttimezoneDetails.TimeZone))
                        TimeZone = accounttimezoneDetails.TimeZone;
                    else
                        TimeZone = "India Standard Time";


                    await _cache.SetStringAsync(CacheKey, TimeZone);
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("GetAccountTimeZoneFromCachedMemory"))
                    objError.AddError(ex.Message.ToString(), "", DateTime.Now.ToString(), "GetAccountTimeZoneFromCachedMemory", ex.ToString());
            }

            return TimeZone;
        }
    }
}
