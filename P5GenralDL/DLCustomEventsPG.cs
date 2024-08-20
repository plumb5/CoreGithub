using Dapper;
using DBInteraction;
using IP5GenralDL;
using Npgsql;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLCustomEventsPG : CommonDataBaseInteraction, IDLCustomEvents
    {

        readonly CommonInfo connection;
        public DLCustomEventsPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }
        public async Task<Int32> GetEventscounts(Nullable<DateTime> fromDateTime, Nullable<DateTime> ToDateTime, int customeventoverviewid, Contact contact, string machineid, Customevents customevents)
        {
            string storeProcCommand = "select custom_events_maxcount(@fromDateTime, @ToDateTime ,@Id, @customeventoverviewid,@Name,@EmailId,@PhoneNumber, @machineid , @EventData1,@EventData2,@EventData3,@EventData4,@EventData5,@EventData6,@EventData7,@EventData8,@EventData9,@EventData10,@EventData11,@EventData12,@EventData13,@EventData14,@EventData15,@EventData16,@EventData17,@EventData18,@EventData19,@EventData20, @EventData21,@EventData22,@EventData23,@EventData24,@EventData25,@EventData26,@EventData27,@EventData28,@EventData29,@EventData30,@EventData31,@EventData32,@EventData33,@EventData34,@EventData35,@EventData36,@EventData37,@EventData38,@EventData39,@EventData40,@EventData41,@EventData42,@EventData43,@EventData44,@EventData45,@EventData46,@EventData47,@EventData48,@EventData49,@EventData50)";

            object? param = new
            {
                fromDateTime,
                ToDateTime,
                customevents.Id,
                customeventoverviewid,
                contact.Name,
                contact.EmailId,
                contact.PhoneNumber,
                machineid,
                customevents.EventData1,
                customevents.EventData2,
                customevents.EventData3,
                customevents.EventData4,
                customevents.EventData5,
                customevents.EventData6,
                customevents.EventData7,
                customevents.EventData8,
                customevents.EventData9,
                customevents.EventData10,
                customevents.EventData11,
                customevents.EventData12,
                customevents.EventData13,
                customevents.EventData14,
                customevents.EventData15,
                customevents.EventData16,
                customevents.EventData17,
                customevents.EventData18,
                customevents.EventData19,
                customevents.EventData20,
                customevents.EventData21,
                customevents.EventData22,
                customevents.EventData23,
                customevents.EventData24,
                customevents.EventData25,
                customevents.EventData26,
                customevents.EventData27,
                customevents.EventData28,
                customevents.EventData29,
                customevents.EventData30,
                customevents.EventData31,
                customevents.EventData32,
                customevents.EventData33,
                customevents.EventData34,
                customevents.EventData35,
                customevents.EventData36,
                customevents.EventData37,
                customevents.EventData38,
                customevents.EventData39,
                customevents.EventData40,
                customevents.EventData41,
                customevents.EventData42,
                customevents.EventData43,
                customevents.EventData44,
                customevents.EventData45,
                customevents.EventData46,
                customevents.EventData47,
                customevents.EventData48,
                customevents.EventData49,
                customevents.EventData50,
            };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public async Task<IEnumerable<Customevents>> GetEventsReportData(Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int customeventoverviewid, int ContactId, int OffSet, int FetchNext, Contact contact, string machineid, Customevents customevents)
        {
            string storeProcCommand = "select * from custom_events_getcustomeventcartreport(@FromDateTime, @ToDateTime,@Id, @customeventoverviewid, @ContactId, @OffSet, @FetchNext, @Name, @EmailId, @PhoneNumber, @machineid , @EventData1,@EventData2,@EventData3,@EventData4,@EventData5,@EventData6,@EventData7,@EventData8,@EventData9,@EventData10,@EventData11,@EventData12,@EventData13,@EventData14,@EventData15,@EventData16,@EventData17,@EventData18,@EventData19,@EventData20, @EventData21,@EventData22,@EventData23,@EventData24,@EventData25,@EventData26,@EventData27,@EventData28,@EventData29,@EventData30,@EventData31,@EventData32,@EventData33,@EventData34,@EventData35,@EventData36,@EventData37,@EventData38,@EventData39,@EventData40,@EventData41,@EventData42,@EventData43,@EventData44,@EventData45,@EventData46,@EventData47,@EventData48,@EventData49,@EventData50)";
            object? param = new
            {
                FromDateTime,
                ToDateTime,
                customevents.Id,
                customeventoverviewid,
                ContactId,
                OffSet,
                FetchNext,
                contact.Name,
                contact.EmailId,
                contact.PhoneNumber,
                machineid,
                customevents.EventData1,
                customevents.EventData2,
                customevents.EventData3,
                customevents.EventData4,
                customevents.EventData5,
                customevents.EventData6,
                customevents.EventData7,
                customevents.EventData8,
                customevents.EventData9,
                customevents.EventData10,
                customevents.EventData11,
                customevents.EventData12,
                customevents.EventData13,
                customevents.EventData14,
                customevents.EventData15,
                customevents.EventData16,
                customevents.EventData17,
                customevents.EventData18,
                customevents.EventData19,
                customevents.EventData20,
                customevents.EventData21,
                customevents.EventData22,
                customevents.EventData23,
                customevents.EventData24,
                customevents.EventData25,
                customevents.EventData26,
                customevents.EventData27,
                customevents.EventData28,
                customevents.EventData29,
                customevents.EventData30,
                customevents.EventData31,
                customevents.EventData32,
                customevents.EventData33,
                customevents.EventData34,
                customevents.EventData35,
                customevents.EventData36,
                customevents.EventData37,
                customevents.EventData38,
                customevents.EventData39,
                customevents.EventData40,
                customevents.EventData41,
                customevents.EventData42,
                customevents.EventData43,
                customevents.EventData44,
                customevents.EventData45,
                customevents.EventData46,
                customevents.EventData47,
                customevents.EventData48,
                customevents.EventData49,
                customevents.EventData50,
            };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<Customevents>(storeProcCommand, param);
        }

        public async Task<IEnumerable<Customevents>> UCPGetEventsName(DateTime? fromDateTime, DateTime? toDateTime, int customeventoverviewid, int contactID, string customEventName, int offSet, int fetchNext, string machineid)
        {
            try
            {
                string storeProcCommand = "select * from custom_events_ucpgetcustomeventname(@fromDateTime, @toDateTime, @customeventoverviewid, @contactID, @machineid)";
                object? param = new { fromDateTime, toDateTime, customeventoverviewid, contactID, machineid };

                using var db = GetDbConnection(connection.Connection);
                return await db.QueryAsync<Customevents>(storeProcCommand, param);
            }
            catch(Exception ex)
            {
                throw new Exception();
            }
            
        }

        public async Task<IEnumerable<Customevents>> UCPGetEventsReportData(Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int customeventoverviewid, int ContactId, int OffSet, int FetchNext, Contact contact, string machineid, Customevents customevents)
        {
            try
            {
                string storeProcCommand = "select * from custom_events_ucpgetcustomeventcartreport(@FromDateTime, @ToDateTime,@Id, @customeventoverviewid, @ContactId, @OffSet, @FetchNext, @Name, @EmailId, @PhoneNumber, @machineid , @EventData1,@EventData2,@EventData3,@EventData4,@EventData5,@EventData6,@EventData7,@EventData8,@EventData9,@EventData10,@EventData11,@EventData12,@EventData13,@EventData14,@EventData15,@EventData16,@EventData17,@EventData18,@EventData19,@EventData20,@EventData21,@EventData22,@EventData23,@EventData24,@EventData25,@EventData26,@EventData27,@EventData28,@EventData29,@EventData30,@EventData31,@EventData32,@EventData33,@EventData34,@EventData35,@EventData36,@EventData37,@EventData38,@EventData39,@EventData40,@EventData41,@EventData42,@EventData43,@EventData44,@EventData45,@EventData46,@EventData47,@EventData48,@EventData49,@EventData50)";

                object? param = new
                {
                    FromDateTime,
                    ToDateTime,
                    customevents.Id,
                    customeventoverviewid,
                    ContactId,
                    OffSet,
                    FetchNext,
                    contact.Name,
                    contact.EmailId,
                    contact.PhoneNumber,
                    machineid,
                    customevents.EventData1,
                    customevents.EventData2,
                    customevents.EventData3,
                    customevents.EventData4,
                    customevents.EventData5,
                    customevents.EventData6,
                    customevents.EventData7,
                    customevents.EventData8,
                    customevents.EventData9,
                    customevents.EventData10,
                    customevents.EventData11,
                    customevents.EventData12,
                    customevents.EventData13,
                    customevents.EventData14,
                    customevents.EventData15,
                    customevents.EventData16,
                    customevents.EventData17,
                    customevents.EventData18,
                    customevents.EventData19,
                    customevents.EventData20,
                    customevents.EventData21,
                    customevents.EventData22,
                    customevents.EventData23,
                    customevents.EventData24,
                    customevents.EventData25,
                    customevents.EventData26,
                    customevents.EventData27,
                    customevents.EventData28,
                    customevents.EventData29,
                    customevents.EventData30,
                    customevents.EventData31,
                    customevents.EventData32,
                    customevents.EventData33,
                    customevents.EventData34,
                    customevents.EventData35,
                    customevents.EventData36,
                    customevents.EventData37,
                    customevents.EventData38,
                    customevents.EventData39,
                    customevents.EventData40,
                    customevents.EventData41,
                    customevents.EventData42,
                    customevents.EventData43,
                    customevents.EventData44,
                    customevents.EventData45,
                    customevents.EventData46,
                    customevents.EventData47,
                    customevents.EventData48,
                    customevents.EventData49,
                    customevents.EventData50,
                };

                using var db = GetDbConnection(connection.Connection);
                return await db.QueryAsync<Customevents>(storeProcCommand, param);
            }
            catch(Exception ex)
            {
                throw new Exception();
            }
            
        }
        public async Task<bool> SearchAndAddtoGroup(int UserInfoUserId, int UserGroupId, int customeventoverviewid, Customevents customevents, int GroupId, Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime)
        {
            string storeProcCommand = "select custom_events_inserttorequestedgroup( @FromDateTime, @ToDateTime, @customeventoverviewid, @EventData1,@EventData2,@EventData3,@EventData4,@EventData5,@EventData6,@EventData7,@EventData8,@EventData9,@EventData10,@EventData11,@EventData12,@EventData13,@EventData14,@EventData15,@EventData16,@EventData17,@EventData18,@EventData19,@EventData20,@EventData21,@EventData22,@EventData23,@EventData24,@EventData25,@EventData26,@EventData27,@EventData28,@EventData29,@EventData30,@EventData31,@EventData32,@EventData33,@EventData34,@EventData35,@EventData36,@EventData37,@EventData38,@EventData39,@EventData40,@EventData41,@EventData42,@EventData43,@EventData44,@EventData45,@EventData46,@EventData47,@EventData48,@EventData49,@EventData50,@GroupId,@UserInfoUserId,@UserGroupId)";

            object? param = new
            {
                FromDateTime,
                ToDateTime,
                customeventoverviewid,
                customevents.EventData1,
                customevents.EventData2,
                customevents.EventData3,
                customevents.EventData4,
                customevents.EventData5,
                customevents.EventData6,
                customevents.EventData7,
                customevents.EventData8,
                customevents.EventData9,
                customevents.EventData10,
                customevents.EventData11,
                customevents.EventData12,
                customevents.EventData13,
                customevents.EventData14,
                customevents.EventData15,
                customevents.EventData16,
                customevents.EventData17,
                customevents.EventData18,
                customevents.EventData19,
                customevents.EventData20,
                customevents.EventData21,
                customevents.EventData22,
                customevents.EventData23,
                customevents.EventData24,
                customevents.EventData25,
                customevents.EventData26,
                customevents.EventData27,
                customevents.EventData28,
                customevents.EventData29,
                customevents.EventData30,
                customevents.EventData31,
                customevents.EventData32,
                customevents.EventData33,
                customevents.EventData34,
                customevents.EventData35,
                customevents.EventData36,
                customevents.EventData37,
                customevents.EventData38,
                customevents.EventData39,
                customevents.EventData40,
                customevents.EventData41,
                customevents.EventData42,
                customevents.EventData43,
                customevents.EventData44,
                customevents.EventData45,
                customevents.EventData46,
                customevents.EventData47,
                customevents.EventData48,
                customevents.EventData49,
                customevents.EventData50,
                GroupId,
                UserInfoUserId,
                UserGroupId
            };
            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;
        }
        public async Task<Int32> GetAggergatecounts(DateTime fromDateTime, DateTime ToDateTime, int customeventoverviewid, string groupbyeventfields, string displayextrafields)
        {
            string storeProcCommand = "select * from custom_eventsaggregatedetails_aggergatemaxcount(@fromDateTime, @ToDateTime, @customeventoverviewid, @groupbyeventfields)";
            object? param = new { fromDateTime, ToDateTime, customeventoverviewid, groupbyeventfields };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public async Task<DataSet> GetAggregateData(string FromDateTime, string ToDateTime, int customeventoverviewid, string groupbyeventfields, string displayextrafields, int OffSet, int FetchNext)
        {

            string connectionStrings = connection.Connection;
            using (var connection = new NpgsqlConnection(connectionStrings))
            {
                connection.Open();
                string query = "select max(customeventoverviewid)  CustomEventOverViewId," + displayextrafields + ",count(1) TotalViews,coalesce(count(distinct case WHEN  coalesce(Machineid, '''') != ''''  THEN Machineid  End), 0)UniqueVisitors ,coalesce(count(distinct case WHEN  ContactId > 0 THEN ContactId  End), 0) As UniqueCustomers, max(eventtime) as LastTranDate from customevents where customeventoverviewid =" + customeventoverviewid + " and  eventtime  between '" + FromDateTime + "' and '" + ToDateTime + "'  group by " + groupbyeventfields + " order by max(eventtime) desc offset " + OffSet + " rows fetch next " + FetchNext + " rows only ";

                NpgsqlDataAdapter da = new NpgsqlDataAdapter(query, connection);
                DataSet ds = new DataSet();
                da.Fill(ds);
                ds = Encode(ds);
                connection.Close();
                return ds;
            }
        }
        public async Task<IEnumerable<Customevents>> GetMaxAggregateDetails(DateTime fromDateTime, DateTime ToDateTime, int customeventoverviewid, int OffSet, int FetchNext, Customevents customevents, string queryforaggrgatedetails, string groupbyquery, string CustomFieldname)
        {
            string storeProcCommand = "";
            if (groupbyquery == "")
                storeProcCommand = "select * from custom_eventsaggregatedetails_getmaxaggvisitordetails(   @fromDateTime,  @ToDateTime,  @customeventoverviewid,  @OffSet,  @FetchNext, @EventData1,@EventData2,@EventData3,@EventData4,@EventData5,@EventData6,@EventData7,@EventData8,@EventData9,@EventData10,@EventData11,@EventData12,@EventData13,@EventData14,@EventData15,@EventData16,@EventData17,@EventData18,@EventData19,@EventData20,@EventData21,@EventData22,@EventData23,@EventData24,@EventData25,@EventData26,@EventData27,@EventData28,@EventData29,@EventData30,@EventData31,@EventData32,@EventData33,@EventData34,@EventData35,@EventData36,@EventData37,@EventData38,@EventData39,@EventData40,@EventData41,@EventData42,@EventData43,@EventData44,@EventData45,@EventData46,@EventData47,@EventData48,@EventData49,@EventData50, @queryforaggrgatedetails,  @groupbyquery)";
            else
                storeProcCommand = "select * from custom_eventsaggregatedetails_getmaxaggvisitordetails_groupby(   @fromDateTime,  @ToDateTime,  @customeventoverviewid,  @OffSet,  @FetchNext, @EventData1,@EventData2,@EventData3,@EventData4,@EventData5,@EventData6,@EventData7,@EventData8,@EventData9,@EventData10,@EventData11,@EventData12,@EventData13,@EventData14,@EventData15,@EventData16,@EventData17,@EventData18,@EventData19,@EventData20,@EventData21,@EventData22,@EventData23,@EventData24,@EventData25,@EventData26,@EventData27,@EventData28,@EventData29,@EventData30,@EventData31,@EventData32,@EventData33,@EventData34,@EventData35,@EventData36,@EventData37,@EventData38,@EventData39,@EventData40,@EventData41,@EventData42,@EventData43,@EventData44,@EventData45,@EventData46,@EventData47,@EventData48,@EventData49,@EventData50, @queryforaggrgatedetails,  @groupbyquery)";


            object? param = new
            {
                fromDateTime,
                ToDateTime,
                customeventoverviewid,
                OffSet,
                FetchNext,
                customevents.EventData1,
                customevents.EventData2,
                customevents.EventData3,
                customevents.EventData4,
                customevents.EventData5,
                customevents.EventData6,
                customevents.EventData7,
                customevents.EventData8,
                customevents.EventData9,
                customevents.EventData10,
                customevents.EventData11,
                customevents.EventData12,
                customevents.EventData13,
                customevents.EventData14,
                customevents.EventData15,
                customevents.EventData16,
                customevents.EventData17,
                customevents.EventData18,
                customevents.EventData19,
                customevents.EventData20,
                customevents.EventData21,
                customevents.EventData22,
                customevents.EventData23,
                customevents.EventData24,
                customevents.EventData25,
                customevents.EventData26,
                customevents.EventData27,
                customevents.EventData28,
                customevents.EventData29,
                customevents.EventData30,
                customevents.EventData31,
                customevents.EventData32,
                customevents.EventData33,
                customevents.EventData34,
                customevents.EventData35,
                customevents.EventData36,
                customevents.EventData37,
                customevents.EventData38,
                customevents.EventData39,
                customevents.EventData40,
                customevents.EventData41,
                customevents.EventData42,
                customevents.EventData43,
                customevents.EventData44,
                customevents.EventData45,
                customevents.EventData46,
                customevents.EventData47,
                customevents.EventData48,
                customevents.EventData49,
                customevents.EventData50,
                queryforaggrgatedetails,
                groupbyquery
            };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<Customevents>(storeProcCommand, param);
        }

        public async Task<IEnumerable<Contact>> GeteventcontactData(DateTime fromDateTime, DateTime ToDateTime, int customeventoverviewid, int OffSet, int FetchNext, Customevents customevents)
        {
            string storeProcCommand = "select * from custom_eventsaggregatedetails_getaggconactdetails(@fromDateTime, @ToDateTime, @customeventoverviewid, @OffSet, @FetchNext, @EventData1,@EventData2,@EventData3,@EventData4,@EventData5,@EventData6,@EventData7,@EventData8,@EventData9,@EventData10,@EventData11,@EventData12,@EventData13,@EventData14,@EventData15,@EventData16,@EventData17,@EventData18,@EventData19,@EventData20,@EventData21,@EventData22,@EventData23,@EventData24,@EventData25,@EventData26,@EventData27,@EventData28,@EventData29,@EventData30,@EventData31,@EventData32,@EventData33,@EventData34,@EventData35,@EventData36,@EventData37,@EventData38,@EventData39,@EventData40,@EventData41,@EventData42,@EventData43,@EventData44,@EventData45,@EventData46,@EventData47,@EventData48,@EventData49,@EventData50)";

            object? param = new
            {
                fromDateTime,
                ToDateTime,
                customeventoverviewid,
                OffSet,
                FetchNext,
                customevents.EventData1,
                customevents.EventData2,
                customevents.EventData3,
                customevents.EventData4,
                customevents.EventData5,
                customevents.EventData6,
                customevents.EventData7,
                customevents.EventData8,
                customevents.EventData9,
                customevents.EventData10,
                customevents.EventData11,
                customevents.EventData12,
                customevents.EventData13,
                customevents.EventData14,
                customevents.EventData15,
                customevents.EventData16,
                customevents.EventData17,
                customevents.EventData18,
                customevents.EventData19,
                customevents.EventData20,
                customevents.EventData21,
                customevents.EventData22,
                customevents.EventData23,
                customevents.EventData24,
                customevents.EventData25,
                customevents.EventData26,
                customevents.EventData27,
                customevents.EventData28,
                customevents.EventData29,
                customevents.EventData30,
                customevents.EventData31,
                customevents.EventData32,
                customevents.EventData33,
                customevents.EventData34,
                customevents.EventData35,
                customevents.EventData36,
                customevents.EventData37,
                customevents.EventData38,
                customevents.EventData39,
                customevents.EventData40,
                customevents.EventData41,
                customevents.EventData42,
                customevents.EventData43,
                customevents.EventData44,
                customevents.EventData45,
                customevents.EventData46,
                customevents.EventData47,
                customevents.EventData48,
                customevents.EventData49,
                customevents.EventData50
            };


            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<Contact>(storeProcCommand, param);
        }
        public async Task<IEnumerable<Customevents>> GetUniquevisitorDetails(DateTime fromDateTime, DateTime ToDateTime, int customeventoverviewid, int OffSet, int FetchNext, Customevents customevents)
        {
            string storeProcCommand = "select * from custom_eventsaggregatedetails_getaggvisitordetails(@fromDateTime, @ToDateTime, @customeventoverviewid, @OffSet, @FetchNext, @EventData1,@EventData2,@EventData3,@EventData4,@EventData5,@EventData6,@EventData7,@EventData8,@EventData9,@EventData10,@EventData11,@EventData12,@EventData13,@EventData14,@EventData15,@EventData16,@EventData17,@EventData18,@EventData19,@EventData20,@EventData21,@EventData22,@EventData23,@EventData24,@EventData25,@EventData26,@EventData27,@EventData28,@EventData29,@EventData30,@EventData31,@EventData32,@EventData33,@EventData34,@EventData35,@EventData36,@EventData37,@EventData38,@EventData39,@EventData40,@EventData41,@EventData42,@EventData43,@EventData44,@EventData45,@EventData46,@EventData47,@EventData48,@EventData49,@EventData50)";

            object? param = new
            {
                fromDateTime,
                ToDateTime,
                customeventoverviewid,
                OffSet,
                FetchNext,
                customevents.EventData1,
                customevents.EventData2,
                customevents.EventData3,
                customevents.EventData4,
                customevents.EventData5,
                customevents.EventData6,
                customevents.EventData7,
                customevents.EventData8,
                customevents.EventData9,
                customevents.EventData10,
                customevents.EventData11,
                customevents.EventData12,
                customevents.EventData13,
                customevents.EventData14,
                customevents.EventData15,
                customevents.EventData16,
                customevents.EventData17,
                customevents.EventData18,
                customevents.EventData19,
                customevents.EventData20,
                customevents.EventData21,
                customevents.EventData22,
                customevents.EventData23,
                customevents.EventData24,
                customevents.EventData25,
                customevents.EventData26,
                customevents.EventData27,
                customevents.EventData28,
                customevents.EventData29,
                customevents.EventData30,
                customevents.EventData31,
                customevents.EventData32,
                customevents.EventData33,
                customevents.EventData34,
                customevents.EventData35,
                customevents.EventData36,
                customevents.EventData37,
                customevents.EventData38,
                customevents.EventData39,
                customevents.EventData40,
                customevents.EventData41,
                customevents.EventData42,
                customevents.EventData43,
                customevents.EventData44,
                customevents.EventData45,
                customevents.EventData46,
                customevents.EventData47,
                customevents.EventData48,
                customevents.EventData49,
                customevents.EventData50
            };


            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<Customevents>(storeProcCommand, param);
        }

        public Customevents? GetCustomevents(int ContactId, string CustomEventName, string CustomEventColumnNames, string TopData, string Orderby, string MachineId = null)
        {
            string storeProcCommand = "select * from custom_events_getcustomevents(@ContactId, @MachineId, @CustomEventName, @CustomEventColumnNames, @TopData, @Orderby)";
            object? param = new { ContactId, MachineId, CustomEventName, CustomEventColumnNames, TopData, Orderby };

            using var db = GetDbConnection(connection.Connection);
            return db.QueryFirstOrDefault<Customevents?>(storeProcCommand, param);
        }
        public async Task<IEnumerable<Customevents>> GetRevenueEventsReportData(Nullable<DateTime> FromDateTime, Nullable<DateTime> ToDateTime, int customeventoverviewid, int OffSet, int FetchNext)
        {
            string storeProcCommand = "select * from custom_events_getrevenuecustomeventreport(@FromDateTime, @ToDateTime, @customeventoverviewid, @OffSet, @FetchNext)";
            object? param = new { FromDateTime, ToDateTime, customeventoverviewid, OffSet, FetchNext };

            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<Customevents>(storeProcCommand, param);
        }
        public async Task<IEnumerable<Customevents>> GetRevenuesingleEventsReportData(int customeventoverviewid, int Id)
        {
            string storeProcCommand = "select * from custom_events_getrevenuesinglecustomeventreport(@customeventoverviewid,@Id)";

            object? param = new { customeventoverviewid, Id };
            using var db = GetDbConnection(connection.Connection);
            return await db.QueryAsync<Customevents>(storeProcCommand, param);
        }

        public async Task<Int32> GetRevenueMaxCount(int customeventoverviewid, DateTime fromDateTime, DateTime ToDateTime)
        {
            string storeProcCommand = "select * from custom_events_getrevenuemaxcount( @fromDateTime, @ToDateTime, @customeventoverviewid)";
            object? param = new { fromDateTime, ToDateTime, customeventoverviewid };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);
        }
        public async Task<DataSet> GetRevenueDetails(int customeventoverviewid, string dynamicefieldnames, DateTime fromDateTime, DateTime ToDateTime, int OffSet, int FetchNext, string BindType)
        {
            string storeProcCommand = "select * from custom_events_getrevenuereport(@customeventoverviewid, @fromDateTime, @ToDateTime, @dynamicefieldnames, @OffSet, @FetchNext, @BindType)";
            object? param = new { customeventoverviewid, fromDateTime, ToDateTime, dynamicefieldnames, OffSet, FetchNext, BindType };

            using var db = GetDbConnection(connection.Connection);
            var list = await db.ExecuteReaderAsync(storeProcCommand, param);
            var dataset = ConvertDataReaderToDataSet(list);
            return dataset;
        }

        #region Dispose Method
        private bool _disposed = false;
        protected void Dispose(bool disposing)
        {
            if (!_disposed)
            {
                _disposed = true;
                if (disposing)
                {

                }
            }
        }

        public void Dispose()
        {
            Dispose(true);
        }
        #endregion End of Dispose Method
    }
}