using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLProduct:IDisposable
    {
        Task<IEnumerable<Product>> GET(string Name, int? OffSet = null, int? FetchNext = null);
        Task<IEnumerable<Product>> GetCategories(string Name);
        Task<IEnumerable<Product>> GetSubCategories(string Name);
        Task<IEnumerable<Product>> GetProductList(Product Product, List<string> ProductIdList = null, List<string> ProductNameList = null, List<string> CategoryList = null, List<string> SubCategoryList = null, string FromDateTime = null, string ToDateTime = null, int? OffSet = null, int? FetchNext = null, List<string> fieldName = null);
        Task<IEnumerable<Product>> ExecuteFilterQuery(int Id, int ContactId);
        Task<IEnumerable<Product>> GetDetailByQuery(string FilterQuery);
        Task<IEnumerable<Product>> GetProductDetailsByProductId(string Id);

    }
}
