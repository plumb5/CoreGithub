using P5GenralDL;
using P5GenralML;
using System.Data;
using Plumb5GenralFunction;
using System.Reflection;
using System.Net;
using Microsoft.Identity.Client;
using System.Globalization;
using Org.BouncyCastle.Asn1.Ocsp;
namespace Plumb5.Areas.Dashboard.Models
{
    public class CampaignCalendar:IDisposable
    {
        public async  Task<List<CalendarData>> GetJsonData(int AdsId, DateTime FromDateTime, DateTime ToDateTime,string SQLProvider)
        {
            List<MLCampaignCalendar> campaignlist = null;
            using (var objDL = DLCampaignCalendar.GetDLCampaignCalendar(AdsId, SQLProvider)) 
            {
                campaignlist = await objDL.GetOverallScheduledDetails(FromDateTime, ToDateTime);
            }
            List<CalendarData> calendardata = new List<CalendarData>();
            try
            {
                string TimeZone = await Helper.GetAccountTimeZoneFromCachedMemory(AdsId, SQLProvider);
                if (campaignlist != null && campaignlist.Count > 0)
                {
                    foreach (var data in campaignlist)
                    {
                        CalendarData eachData = new CalendarData();
                        ExtendedProps extendedProps = new ExtendedProps();
                        var Url = "";
                        if (data.CampaignType == "sms")
                        {
                            if (data.ScheduledStatus == 1)
                                Url = "/Sms/ScheduleCampaign/?Action=Edit&Id=" + data.CampaignId;
                            else
                                Url = "/Sms/Report";
                        }
                        else if (data.CampaignType == "email")
                        {
                            if (data.ScheduledStatus == 1)
                                Url = "/Mail/MailSchedule?MailSendingSettingId=" + data.CampaignId;
                            else
                                Url = "/Mail/Responses";
                        }
                        else if (data.CampaignType == "whatsapp")
                        {
                            if (data.ScheduledStatus == 1)
                                Url = "/WhatsApp/ScheduleCampaign?SettingsId=" + data.CampaignId;
                            else
                                Url = "/WhatsApp/Report";
                        }
                        else if (data.CampaignType == "web")
                        {
                            if (data.ScheduledStatus == 1)
                                Url = "/WebPush/ScheduleCampaign?SettingsId=" + data.CampaignId;
                            else
                                Url = "/WebPush/Report";
                        }
                        else
                        {
                            if (data.ScheduledStatus == 1)
                                Url = "/MobilePushNotification/CampaignSchedule?SettingsId=" + data.CampaignId;
                            else
                                Url = "/MobilePushNotification/Report";
                        }

                        eachData.title = data.CampaignTitle;
                        eachData.start = Helper.ConvertFromUTCToLocalTimeZone(TimeZone, data.ScheduledDate).Value.ToString("yyyy-MM-dd HH:mm:ss").Replace(" ", "T");
                        eachData.url = Url;
                        extendedProps.campaignid = data.CampaignId;
                        extendedProps.campaigntype = data.CampaignType;
                        extendedProps.campaigndesc = data.CampaignDescription;
                        extendedProps.templatename = data.TemplateName;
                        extendedProps.groupname = data.GroupName;
                        eachData.extendedProps = extendedProps;

                        calendardata.Add(eachData);
                    }
                }
            }
            catch (Exception ex)
            {
                //throw ex;
            }

            return calendardata;
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

    public class CalendarData
    {
        public string title { get; set; }
        public string start { get; set; }
        public string url { get; set; }

        public ExtendedProps extendedProps { get; set; }
    }
    public class ExtendedProps
    {
        public int campaignid { get; set; }
        public string campaigntype { get; set; }
        public string campaigndesc { get; set; }
        public string templatename { get; set; }
        public string groupname { get; set; }
    }
}

