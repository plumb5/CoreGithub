using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using P5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public static class DependencyInjection
    {
        public static async Task<IServiceCollection> AddGeneralInfrastructure(this IServiceCollection service, IConfiguration config)
        {
            await AllConfigURLDetails.Get(config["SqlProvider"]);
            service.AddScoped<P5MemoryCache>();

            return service;
        }
    }
}
