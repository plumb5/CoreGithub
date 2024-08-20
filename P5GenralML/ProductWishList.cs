using System;

namespace P5GenralML
{
   public class ProductWishList
    {
        public int ContactId { get; set; }
        public string? MachineId { get; set; }
        public string? SessionId { get; set; }
        public string? ProductId { get; set; }
        public string? StoreNumber { get; set; }
        public decimal? ProductPrice { get; set; }
        public bool IsAddedToCart { get; set; }
        public int? IsAddedToCartCount { get; set; }
        public DateTime? AddToCartDate { get; set; }
        public bool IsViewed { get; set; }
        public int? IsViewdCount { get; set; }
        public DateTime? ViewdDate { get; set; }
        public bool IsDroped { get; set; }
        public int? IsDropedCount { get; set; }
        public DateTime? DroppedCartDate { get; set; }
        public string? MemberId { get; set; }
        public Double Quantity { get; set; }
        public bool? IsSearched { get; set; }
        public DateTime? IsSearchedDate { get; set; }
        public string? SearchedData { get; set; }
        public int? IsSearchedCount { get; set; }

    }
}
