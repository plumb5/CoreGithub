using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLCustomEventRevenueChannels:IDisposable
    {
        Task<DataSet> GetDayWiseRevenue(string EventName, string EventPriceColumn, DateTime FromDateTime, DateTime ToDateTime);
        Task<DataSet> GetChannelCount(string EventName, string EventPriceColumn, DateTime FromDateTime, DateTime ToDateTime);
        Task<Int32> GetRevenueMaxCount(string Channel, string EventName, string EventPriceColumn, DateTime FromDateTime, DateTime ToDateTime);
        Task<DataSet> GetRevenueData(string Channel, string EventName, string EventPriceColumn, DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext);
        Task<Int32> GetIndividualRevenueCount(string Channel, int CampaignId, string EventName, DateTime FromDateTime, DateTime ToDateTime, Int16 CampignType);
        Task<IEnumerable<Customevents>> GetIndividualRevenueData(string Channel, int CampaignId, string EventName, DateTime FromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, Int16 CampignType);
    }
}
