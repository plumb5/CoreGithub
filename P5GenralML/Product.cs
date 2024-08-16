using System;

namespace P5GenralML
{
    public class Product
    {
        public string Id { get; set; }
        public string StoreNumber { get; set; }
        public string Name { get; set; }
        public string SecondaryName { get; set; }
        public string ProductImageUrl { get; set; }
        public string ImageSize { get; set; }
        public string ProductPageUrl { get; set; }
        public string ProductCategoryUrl { get; set; }
        public string ProductSubCategoryUrl { get; set; }
        public string Brand { get; set; }
        public string ShortTitle { get; set; }
        public string Description { get; set; }
        public string CategoryId1 { get; set; }
        public string CategoryId2 { get; set; }
        public string CategoryId3 { get; set; }
        public string CategoryId4 { get; set; }
        public string CategoryId5 { get; set; }
        public string SubCategoryId1 { get; set; }
        public string SubCategoryId2 { get; set; }
        public string SubCategoryId3 { get; set; }
        public string SubCategoryId4 { get; set; }
        public string SubCategoryId5 { get; set; }
        public int? Inventory { get; set; }
        public double? MinOrderQty { get; set; }
        public double? MaxOrderQty { get; set; }
        public DateTime? CreateDate { get; set; }
        public int NumberPersonPurchaseCount { get; set; }
        public int Threshold { get; set; }
        public string SeasonalSegment { get; set; }
        public bool? IsActive { get; set; }
        public decimal? MRP { get; set; }
       //public decimal? OldMRP { get; set; }
        public decimal? SellingPrice { get; set; }
        public decimal? TAX { get; set; }
        public decimal? PriceGap { get; set; }
        public decimal? Discount { get; set; }
        public DateTime? PriceUpdateDate { get; set; }
        public string Rating { get; set; }
        public double? SlabPrice1 { get; set; }
        public double? SlabPrice2 { get; set; }
        public double? SlabPrice3 { get; set; }
        public double? SlabPrice4 { get; set; }
        public double? SlabPrice5 { get; set; }
        public double? SlabPrice6 { get; set; }
        public double? SlabQty1 { get; set; }
        public double? SlabQty2 { get; set; }
        public double? SlabQty3 { get; set; }
        public double? SlabQty4 { get; set; }
        public double? SlabQty5 { get; set; }
        public double? SlabQty6 { get; set; }
        public DateTime? SlabsDetailsUpdateDate { get; set; }
        public string FreeProductId1 { get; set; }
        public string FreeProductName1 { get; set; }
        public string FreeProductDesp1 { get; set; }
        public string FreeProductQty1 { get; set; }
        public double? FreeProductStock1 { get; set; }
        public bool? FreeProduct1isActive { get; set; }
        public DateTime? FreeProductUpdateDate1 { get; set; }
        public string FreeProductId2 { get; set; }
        public string FreeProductName2 { get; set; }
        public string FreeProductDesp2 { get; set; }
        public string FreeProductQty2 { get; set; }
        public double? FreeProductStock2 { get; set; }
        public bool? FreeProduct2isActive { get; set; }
        public DateTime? FreeProductUpdateDate2 { get; set; }
        public string ProductAffinityWithThisProduct { get; set; }
        public string ProductAffinityWithThisCategoryAndSameCategory { get; set; }
        public string OfferCode { get; set; }
        public string SKU { get; set; }
        public string slug { get; set; }
        public double? Weight { get; set; }
        public DateTime? UpdatedDate { get; set; }
    }
}
