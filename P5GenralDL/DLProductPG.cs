using Dapper;
using DBInteraction;
using IP5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace P5GenralDL
{
    public class DLProductPG : CommonDataBaseInteraction, IDLProduct
    {
        CommonInfo connection;
        List<string> paramName = new List<string>();
        object[] objDat = new object[] { };
        string storeProcCommand = "";
        public DLProductPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLProductPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<IEnumerable<Product>>  GET(string Name, int? OffSet = null, int? FetchNext = null)
        {
            storeProcCommand = "select * from product_details_get(@Name, @OffSet, @FetchNext)";
            object? param = new {  Name, OffSet, FetchNext };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<Product>(storeProcCommand, param);

        }
        public async Task<IEnumerable<Product>> GetCategories(string Name)
        {
            storeProcCommand = "select * from product_details_getcategories(@Name)";
            object? param = new {   Name };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<Product>(storeProcCommand, param);
        }
        public async Task<IEnumerable<Product>> GetSubCategories(string Name)
        {
            storeProcCommand = "select * from product_details_getsubcategories(@Name)";
            object? param = new {   Name };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<Product>(storeProcCommand, param);
        }


        public async Task<IEnumerable<Product>> GetProductList(Product Product, List<string> ProductIdList = null, List<string> ProductNameList = null, List<string> CategoryList = null, List<string> SubCategoryList = null, string FromDateTime = null, string ToDateTime = null, int? OffSet = null, int? FetchNext = null, List<string> fieldName = null)
        {
            decimal? SellingPrices= Product.SellingPrice == null ? Product.MRP : Product.SellingPrice;
            string ProductIdLists = ProductIdList != null ? string.Join(",", ProductIdList.Select(x => string.Format("'{0}'", x)).ToList()) : null;
            string ProductNameLists = ProductNameList != null ? string.Join(",", ProductNameList.Select(x => string.Format("'{0}'", x)).ToList()) : null;
            string CategoryLists = CategoryList != null ? string.Join(",", CategoryList.Select(x => string.Format("'{0}'", x)).ToList()) : null;
            string SubCategoryLists = SubCategoryList != null ? string.Join(",", SubCategoryList.Select(x => string.Format("'{0}'", x)).ToList()) : null;
            string fieldNames = fieldName != null ? string.Join(",", fieldName.ToArray()) : null;
            
            
            storeProcCommand = "select * from product_details_get(@Id,@StoreNumber,@Name,@SecondaryName,@ProductImageUrl,@ImageSize, @ProductPageUrl,@ProductCategoryUrl, @ProductSubCategoryUrl,@Brand,@ShortTitle,@Description,@CategoryId1,@CategoryId2,@CategoryId3,@CategoryId4,@CategoryId5,@SubCategoryId1,@SubCategoryId2,@SubCategoryId3,@SubCategoryId4,@SubCategoryId5,@Inventory,@MinOrderQty,@MaxOrderQty, @CreateDate,@Threshold,@SeasonalSegment,@IsActive,@MRP,@SellingPrices,@TAX,@PriceGap,@Discount,@PriceUpdateDate,@Rating,@SlabPrice1, @SlabPrice2,@SlabPrice3,@SlabPrice4,@SlabPrice5,@SlabPrice6,@SlabQty1,@SlabQty2,@SlabQty3,@SlabQty4,@SlabQty5,@SlabQty6, @SlabsDetailsUpdateDate,@FreeProductId1,@FreeProductName1,@FreeProductDesp1,@FreeProductQty1,@FreeProductStock1,@FreeProduct1isActive,@FreeProductUpdateDate1, @FreeProductId2,@FreeProductName2,@FreeProductDesp2,@FreeProductQty2,@FreeProductStock2,@FreeProduct2isActive,@FreeProductUpdateDate2,@ProductAffinityWithThisProduct,@ProductAffinityWithThisCategoryAndSameCategory,@SKU,@OfferCode,@slug,@Weight, @ProductIdLists,  @ProductNameLists,  @CategoryLists,  @SubCategoryLists,@FromDateTime, @ToDateTime, @OffSet, @FetchNext, @fieldNames )";

             object? param = new{  Product.Id,Product.StoreNumber,Product.Name,Product.SecondaryName,Product.ProductImageUrl,Product.ImageSize, Product.ProductPageUrl,Product.ProductCategoryUrl,
             Product.ProductSubCategoryUrl,Product.Brand,Product.ShortTitle,Product.Description,Product.CategoryId1,Product.CategoryId2,Product.CategoryId3,Product.CategoryId4,Product.CategoryId5,Product.SubCategoryId1,Product.SubCategoryId2,Product.SubCategoryId3,Product.SubCategoryId4,Product.SubCategoryId5,Product.Inventory,Product.MinOrderQty,Product.MaxOrderQty,
             Product.CreateDate,Product.Threshold,Product.SeasonalSegment,Product.IsActive,Product.MRP,SellingPrices,Product.TAX,Product.PriceGap,Product.Discount,Product.PriceUpdateDate,Product.Rating,Product.SlabPrice1,
             Product.SlabPrice2,Product.SlabPrice3,Product.SlabPrice4,Product.SlabPrice5,Product.SlabPrice6,Product.SlabQty1,Product.SlabQty2,Product.SlabQty3,Product.SlabQty4,Product.SlabQty5,Product.SlabQty6,
             Product.SlabsDetailsUpdateDate,Product.FreeProductId1,Product.FreeProductName1,Product.FreeProductDesp1,Product.FreeProductQty1,Product.FreeProductStock1,Product.FreeProduct1isActive,Product.FreeProductUpdateDate1,
             Product.FreeProductId2,Product.FreeProductName2,Product.FreeProductDesp2,Product.FreeProductQty2,Product.FreeProductStock2,Product.FreeProduct2isActive,Product.FreeProductUpdateDate2,Product.ProductAffinityWithThisProduct,Product.ProductAffinityWithThisCategoryAndSameCategory,Product.SKU,Product.OfferCode,Product.slug,Product.Weight,
             ProductIdLists,  ProductNameLists,  CategoryLists,  SubCategoryLists,
             FromDateTime, ToDateTime, OffSet, FetchNext, fieldNames };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<Product>(storeProcCommand, param);
        }
         
        public async Task<IEnumerable<Product>> ExecuteFilterQuery(int Id, int ContactId)
        {
            string storeProcCommand = "select * from product_group_executefilterquery( @Id, @ContactId)";
            object? param = new {  Id, ContactId };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<Product>(storeProcCommand, param);
        }

        public async Task<IEnumerable<Product>> GetDetailByQuery(string FilterQuery)
        {
            string storeProcCommand = "select * from product_details_getdetailbyquery(@FilterQuery)";
            object? param = new {   FilterQuery };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<Product>(storeProcCommand, param);
        }

        public async Task<IEnumerable<Product>> GetProductDetailsByProductId(string Id)
        {
            string storeProcCommand = "select * from product_details_getproductdetailsbystorenumber(@Id)";
            object? param = new {  Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<Product>(storeProcCommand, param);
        }

         
        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {
                    connection = null;
                }
            }
            //dispose unmanaged ressources
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}
