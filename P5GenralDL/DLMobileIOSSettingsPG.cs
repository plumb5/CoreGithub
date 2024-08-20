using Dapper;
using DBInteraction;
using System.Configuration;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace P5GenralDL
{
    public class DLMobileIOSSettingsPG : CommonDataBaseInteraction, IDLMobileIOSSettings
    {
        CommonInfo connection;
        public DLMobileIOSSettingsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLMobileIOSSettingsPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<MobileGcmSettings?> GetGcmSettings()
        {
            string storeProcCommand = "select * from Mobil_GCM_Setting_PROC(@Action)";
            object? param = new { Action = "GetMobileGcmSettings" };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MobileGcmSettings?>(storeProcCommand, param);

        }

        public async Task<MobileIOSSettings?> GetMobileIOSSettings()
        {
            string storeProcCommand = "select * from Mobil_GCM_Setting_PROC(@Action)";
            object? param = new { Action = "GetMobileIOSSettings" };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<MobileIOSSettings?>(storeProcCommand, param);

        }

        public async Task<List<MobileGcmSettings>> GetGcmProjectNoPackageName()
        {
            string storeProcCommand = "select * from Mobile_Gcm_Settings(@Type,@SearchText)";
            object? param = new { Action = "GetActiveSettings" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MobileGcmSettings>(storeProcCommand, param)).ToList();

        }


        public async Task<List<MobileIOSSettings>> GetSettings()
        {
            string storeProcCommand = "select * from Mobile_IOSSettings(@Type,@SearchText)";
            object? param = new { Action = "GetSettings" };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MobileIOSSettings>(storeProcCommand, param)).ToList();

        }

        public async Task<bool> Save(MobileDeviceInfo rData)
        {
            string storeProcCommand = "select * from mobile_deviceinfo(@GcmRegId,@DeviceId,@Manufacturer,@Name,@OS,@OsVersion,@AppVersion,@CarrierName,@Resolution)";
            object? param = new { rData.GcmRegId, rData.DeviceId, rData.Manufacturer, rData.Name, rData.OS, rData.OsVersion, rData.AppVersion, rData.CarrierName, rData.Resolution };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<bool> SaveInitSession(MobileTrackData rData)
        {
            string storeProcCommand = "select * from mobile_tracker(@CarrierName,@SessionId,@ScreenName,@DeviceId,@VisitorIp,@IpDecimal,@CampaignId,@NewSession,@Offline,@TrackDate,@GeofenceId,@Locality,@City,@State,@Country,@CountryCode,@Latitude,@Longitude,@PageParameter,@WorkFlowDataId)";
            object? param = new { rData.CarrierName, rData.SessionId, rData.ScreenName, rData.DeviceId, rData.VisitorIp, rData.IpDecimal, rData.CampaignId, rData.NewSession, rData.Offline, rData.TrackDate, rData.GeofenceId, rData.Locality, rData.City, rData.State, rData.Country, rData.CountryCode, rData.Latitude, rData.Longitude, rData.PageParameter, rData.WorkFlowDataId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<bool> SaveLogData(MobileEventData eventData)
        {
            string storeProcCommand = "select * from mobile_eventtracker(@DeviceId, @SessionId, @Type, @Name, @Value)";
            object? param = new { eventData.DeviceId, eventData.SessionId, eventData.Type, eventData.Name, eventData.Value };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }


        public async Task<bool> SaveEndSession(MobileEndRequest eData)
        {
            string storeProcCommand = "select * from Mobile_EndSession(@SessionId)";
            object? param = new { eData.SessionId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<bool> RegisterUser(MobileUserInfo userData)
        {
            string storeProcCommand = "select * from Mobile_UserInfo(@DeviceId, @Name, @EmailId, @PhoneNumber)";
            object? param = new { userData.DeviceId, userData.Name, userData.EmailId, userData.PhoneNumber };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;


        }



        public async Task<bool> SaveFormResponses(MobileFormRequest formData)
        {
            string storeProcCommand = "select * from Mobile_FormResponses(@MobileFormId, @DeviceId, @SessionId, @ScreenName, @FormResponses, @BannerView, @BannerClick, @BannerClose, @GeofenceName, @BeaconName, @ButtonName, @WorkFlowDataId, @P5UniqueId )";
            object? param = new { formData.MobileFormId, formData.DeviceId, formData.SessionId, formData.ScreenName, formData.FormResponses, formData.BannerView, formData.BannerClick, formData.BannerClose, formData.GeofenceName, formData.BeaconName, formData.ButtonName, formData.WorkFlowDataId, formData.P5UniqueId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }
        public async Task<FormResponseReportToSetting?> GetresponseSettings(int MobileFormId)
        {
            string storeProcCommand = "select * from MobileResponseSettings(@Action)";
            object? param = new { Action = "GetReportSettings", MobileFormId };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryFirstOrDefaultAsync<FormResponseReportToSetting?>(storeProcCommand, param);

        }

        public async Task<List<MobileInAppDisplaySettings>> GetInAppDisplaySettings(InAppRequest InAppRequest)
        {
            string storeProcCommand = "select * from MobileSelectInAppTemplate(@DeviceId,@Key,@BannerId,@RecentStatus)";
            object? param = new { InAppRequest.DeviceId, Key = "DisplayAll", BannerId = 2, RecentStatus = 0 };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<MobileInAppDisplaySettings>(storeProcCommand, param)).ToList();

        }


        public async Task<string> GetIpInformation(int AccountId, double IpDecimal)
        {
            string returnvalue = null;
            CommonInfo _connection = new CommonInfo();

            IConfiguration Configuration = new ConfigurationBuilder().AddJsonFile("appsettings.json", optional: false, reloadOnChange: true).Build();            

            _connection.Connection = Configuration.GetSection("ConnectionStrings:MasterConnection").Value;

            string storeProcCommand = "select * from getaccount_getconnectionformobile(@AccountId,@IpDecimal)";
            object? param = new { AccountId, IpDecimal = IpDecimal.ToString() };

            using var db = GetDbConnection(connection.Connection);      
            var reader = await db.ExecuteReaderAsync(storeProcCommand, param);

            if (reader.Read())
                returnvalue = reader["IpDetails"].ToString();

            return returnvalue;

        }
    }
}
