using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLIpligenceCityList : IDisposable
    {
        Task<List<IpligenceCityList>> GET(string CityName);
        Task<IpligenceDAS?> GetCityCoOrdinate(string CityName);
    }
}
