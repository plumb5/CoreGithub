using Newtonsoft.Json;
using P5GenralDL;
using P5GenralML;
using StackExchange.Redis;

namespace Plumb5.Areas.Dashboard.Models
{
    public class Realtime : IDisposable
    {
        public int Id { get; set; }
        public string PageName { get; set; }
        public string PageNameShorten { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string CountryCode { get; set; }
        public string VisitorIp { get; set; }
        public string MachineId { get; set; }
        public string Referrer { get; set; }
        public string ReferType { get; set; }
        public string ReferrerShort { get; set; }
        public string RepeatOrNew { get; set; }
        public string SearchBy { get; set; }
        public string EmailId { get; set; }
        public string PageTitle { get; set; }
        public DateTime Date { get; set; }
        public DateTime TimeEnd { get; set; }
        public int SessionStart { get; set; }
        public string Network { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public int DeviceId { get; set; }
        public string UserAgent { get; set; }
        public string Browser { get; set; }
        public string SessionId { get; set; }
        public int TranFlag { get; set; }
        public string VisitorId { get; set; }
        public string UtmSource { get; set; }
        public string UtmMedium { get; set; }
        public string UtmCampaign { get; set; }
        public string UtmTerm { get; set; }

        public string Name { get; set; }
        public string PhoneNumber { get; set; }

        public async Task<List<Realtime>> GetRealTimeDetails(int AdsId,string SqlType)
        {
            List<Realtime> objRealTime = new List<Realtime>();
            try
            {
                IConfiguration Configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json", optional: false, reloadOnChange: true).Build();
                var RedisEndPoint  = Configuration.GetSection("RedisConnection").Value;

                //ConfigurationOptions option = new ConfigurationOptions
                //{
                //    AbortOnConnectFail = false,
                //    EndPoints = { RedisEndPoint }
                //};
                //ConnectionMultiplexer redis = ConnectionMultiplexer.Connect(option);
                //IDatabase redisconnection = redis.GetDatabase();

                ConnectionMultiplexer redis = ConnectionMultiplexer.Connect(RedisEndPoint);
                IDatabase redisconnection = redis.GetDatabase();

                redisconnection.StringSetAsync("RealTime_" + AdsId + "", DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"), TimeSpan.FromMinutes(5));

                //var  RealTime_Data = redisconnection.StringGet("RealTime_" + AdsId + "").ToString();

                #region Removing greater than 5 min data from Redis SortedSet
                double RedisEndScore = ToUnixTime(DateTimeOffset.UtcNow.AddMinutes(-5));// DateTimeOffset.UtcNow.AddMinutes(-5).ToUnixTimeMilliseconds();
                redisconnection.SortedSetRemoveRangeByScore("VisitorsDetails_" + AdsId, 0, RedisEndScore);
                #endregion

                var redisvisitordetails = redisconnection.SortedSetScan("VisitorsDetails_" + AdsId);
                var visitordetailsList = redisvisitordetails.ToList();

                foreach (var obj in visitordetailsList)
                {
                    var trackData = JsonConvert.DeserializeObject<Realtime>(obj.Element);

                    DateTime GetDate = DateTime.Now;
                    DateTime VisitorDate = trackData.Date;
                    double minuteDiff = (GetDate - VisitorDate).TotalMinutes;
                    if (minuteDiff <= 5)
                    {
                        //get visitor conyact details
                        Contact contact = null; VisitorInformation objVisitorInformation = null;
                        using (var objDLVisitorInformation = DLVisitorInformation.GetDLVisitorInformation(AdsId, SqlType))
                        {
                            objVisitorInformation =await objDLVisitorInformation.Get(new VisitorInformation { MachineId = trackData.MachineId });
                        }
                        if (objVisitorInformation != null && objVisitorInformation.ContactId > 0)
                        {
                            using (var objDLcontact =  DLContact.GetContactDetails(AdsId,SqlType))
                            {
                                contact =await objDLcontact.GetContactDetails(new Contact { ContactId = objVisitorInformation.ContactId });
                            }

                            trackData.Name = contact.Name;
                            trackData.EmailId = contact.EmailId;
                            trackData.PhoneNumber = contact.PhoneNumber;
                        }

                        objRealTime.Add(trackData);
                    }

                }
            }
            catch (Exception ex)
            {
                //throw ex;
            }
            return objRealTime;
        }

        public static long ToUnixTime(DateTimeOffset dateTime)
        {
            var epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            return (long)(dateTime.ToUniversalTime() - epoch).TotalMilliseconds;
        }

        #region Dispose Method
        bool disposed;
        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {

                }

                //dispose unmanaged ressources
                disposed = true;
            }

        }
        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method

    }
}
