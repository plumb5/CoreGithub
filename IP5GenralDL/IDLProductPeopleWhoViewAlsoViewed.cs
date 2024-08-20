using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLProductPeopleWhoViewAlsoViewed:IDisposable
    {
        Task<IEnumerable<ProductPeopleWhoViewAlsoViewed>> GetProductViewedList(ProductPeopleWhoViewAlsoViewed productdetails, List<string> ProductIdList = null);
    }
}
