using P5GenralML;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using Npgsql;
using NpgsqlTypes;
using System.IO;
using System.Reflection;
using System.Web;
using System.Xml.Linq;
using Newtonsoft.Json;
using System.Globalization;
using System.Data.Common;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using Microsoft.Extensions.Configuration;
using Microsoft.Data.SqlClient;
using Dapper;
using Microsoft.Identity.Client;

namespace DBInteraction
{
    public abstract class CommonDataBaseInteraction
    {
        private readonly string? _masterConnectionString;
        private readonly string? _sqlProvider;


        #region Get Setting or ConnectionString from appsetting.json
        protected CommonDataBaseInteraction()
        {
            IConfiguration Configuration = new
                ConfigurationBuilder()
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true).Build();
            _masterConnectionString = Configuration.GetSection("ConnectionStrings:MasterConnection").Value;
            _sqlProvider = Configuration.GetSection("SqlProvider").Value;
        }

        public IDbConnection GetDbConnection(string? connectionString = null)
        {
            if (!String.IsNullOrEmpty(_sqlProvider) && _sqlProvider.ToLower() == "mssql")// By default it will take postgresql
            {
                if (string.IsNullOrEmpty(connectionString))
                    return new SqlConnection(_masterConnectionString);
                else
                    return new SqlConnection(connectionString);
            }
            else
            {
                if (string.IsNullOrEmpty(connectionString))
                    return new NpgsqlConnection(_masterConnectionString);
                else
                    return new NpgsqlConnection(connectionString);
            }
        }

        protected CommonInfo GetDBConnection()
        {
            return new CommonInfo() { Connection = _masterConnectionString };
        }

        protected CommonInfo GetDBConnection(int AccountId)
        {
            CommonInfo commonInfo = new CommonInfo();
            if (!String.IsNullOrEmpty(_sqlProvider) && _sqlProvider.ToLower() == "mssql")
            {
                using IDbConnection db = GetDbConnection();
                commonInfo.Connection = db.ExecuteScalar<string>("GetAccount", new { Action = "GetConnectionSting", AccountId }, commandType: CommandType.StoredProcedure);
            }
            else
            {
                const string query = "select * from getaccount_getconnectionsting(@AccountId)";
                using var db = GetDbConnection();
                commonInfo.Connection = db.ExecuteScalar<string>(query, new { AccountId });
            }
            return commonInfo;
            //using (var connection = new NpgsqlConnection(_masterConnectionString))
            //{
            //    using (NpgsqlCommand Command = new NpgsqlCommand())
            //    {
            //        try
            //        {
            //            CommonInfo connectionDetails = new CommonInfo();
            //            Command.CommandText = "select * from getaccount_getconnectionsting(@_accountid)";
            //            Command.CommandType = CommandType.Text;
            //            Command.Parameters.Add("@_accountid", NpgsqlDbType.Integer).Value = AccountId;
            //            connection.Open();
            //            Command.Connection = connection;
            //            using (var reader = Command.ExecuteReader())
            //            {
            //                if (reader.Read())
            //                {
            //                    var properties = typeof(CommonInfo).GetProperties();
            //                    foreach (var f in properties)
            //                    {
            //                        var o = reader[f.Name];
            //                        if (!(o is DBNull)) f.SetValue(connectionDetails, o, null);
            //                    }
            //                }
            //            }
            //            return connectionDetails;
            //        }
            //        catch (Exception ex)
            //        {
            //            throw ex;
            //        }
            //        finally
            //        {
            //            connection.Close();
            //        }
            //    }
            //}
        }


        #endregion

        #region Procedure Command Of All type

        protected DbCommand GetCommand(CommonInfo connction, string commandName, List<string> paramName, object[] dataList, params object[] outPutData)
        {
            return GetSQLDBCommand(connction, commandName, paramName, dataList, outPutData);
        }

        private DbCommand GetSQLDBCommand(CommonInfo connction, string commandName, List<string> paramName, object[] dataList, params object[] outPutData)
        {
            NpgsqlCommand command = new NpgsqlCommand();

            NpgsqlConnection connection = new NpgsqlConnection(connction.Connection);
            command.Connection = connection;
            command.CommandText = commandName;
            command.CommandType = CommandType.StoredProcedure;
            command.CommandTimeout = 300;
            int i = 0;
            if (paramName != null && paramName.Count > 0 && dataList != null)
            {
                foreach (var eachData in dataList)
                {
                    if (eachData != null)
                    {
                        if (eachData.GetType() == typeof(long))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Bigint).Value = eachData;
                        else if (eachData.GetType() == typeof(bool))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Boolean).Value = eachData;
                        else if (eachData.GetType() == typeof(DateTime))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Timestamp).Value = eachData;
                        else if (eachData.GetType() == typeof(decimal))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Numeric).Value = eachData;
                        else if (eachData.GetType() == typeof(float))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Real).Value = eachData;
                        else if (eachData.GetType() == typeof(int))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Integer).Value = eachData;
                        else if (eachData.GetType() == typeof(double))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Double).Value = eachData;
                        else if (eachData.GetType() == typeof(string))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Text).Value = eachData;
                        else if (eachData.GetType() == typeof(Single))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Real).Value = eachData;
                        else if (eachData.GetType() == typeof(short))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Smallint).Value = eachData;
                        else if (eachData.GetType() == typeof(byte))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Smallint).Value = eachData;
                        else if (eachData.GetType() == typeof(DataTable))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Json).Value = JsonConvert.SerializeObject(eachData, Formatting.Indented);
                        else if (eachData.GetType() == typeof(TimeSpan))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Time).Value = eachData;
                        else if (eachData.GetType() == typeof(byte[]))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Bytea).Value = eachData;

                    }
                    i++;
                }
            }
            foreach (var eachData in outPutData)
                if (eachData.GetType() == typeof(long))
                    command.Parameters.Add(eachData.ToString(), NpgsqlDbType.Bigint).Direction = ParameterDirection.Output;
                else if (eachData.GetType() == typeof(bool))
                    command.Parameters.Add(eachData.ToString(), NpgsqlDbType.Boolean).Direction = ParameterDirection.Output;
                else if (eachData.GetType() == typeof(DateTime))
                    command.Parameters.Add(eachData.ToString(), NpgsqlDbType.Timestamp).Direction = ParameterDirection.Output;
                else if (eachData.GetType() == typeof(Decimal))
                    command.Parameters.Add(eachData.ToString(), NpgsqlDbType.Numeric).Direction = ParameterDirection.Output;
                else if (eachData.GetType() == typeof(float))
                    command.Parameters.Add(eachData.ToString(), NpgsqlDbType.Real).Direction = ParameterDirection.Output;
                else if (eachData.GetType() == typeof(int))
                    command.Parameters.Add(eachData.ToString(), NpgsqlDbType.Integer).Direction = ParameterDirection.Output;
                else if (eachData.GetType() == typeof(string))
                    command.Parameters.Add(eachData.ToString(), NpgsqlDbType.Text).Direction = ParameterDirection.Output;
                else if (eachData.GetType() == typeof(Single))
                    command.Parameters.Add(eachData.ToString(), NpgsqlDbType.Real).Direction = ParameterDirection.Output;
                else if (eachData.GetType() == typeof(Int16))
                    command.Parameters.Add(eachData.ToString(), NpgsqlDbType.Smallint).Direction = ParameterDirection.Output;
                else if (eachData.GetType() == typeof(Byte))
                    command.Parameters.Add(eachData.ToString(), NpgsqlDbType.Smallint).Direction = ParameterDirection.Output;
                else if (eachData.GetType() == typeof(DataTable))
                    command.Parameters.Add(eachData.ToString(), NpgsqlDbType.Json).Direction = ParameterDirection.Output;
                else if (eachData.GetType() == typeof(TimeSpan))
                    command.Parameters.Add(eachData.ToString(), NpgsqlDbType.Time).Direction = ParameterDirection.Output;
                else if (eachData.GetType() == typeof(Byte[]))
                    command.Parameters.Add(eachData.ToString(), NpgsqlDbType.Bytea).Direction = ParameterDirection.Output;
            return command;
        }



        #endregion Procedure Command Of All type

        #region Procedure Command Of string as Nvarchar type
        /// <summary>
        /// Use This if string have to use as NVarChar insteed of VarChar (It will treat all string as NVarChar)
        /// </summary>
        /// <param name="connction"></param>
        /// <param name="commandName"></param>
        /// <param name="paramName"></param>
        /// <param name="dataList"></param>
        /// <param name="outPutData"></param>
        /// <returns>IDbCommand</returns>

        protected IDbCommand GetNvarCharSQLDBCommand(CommonInfo connction, string commandName, List<string> paramName, object[] dataList, params object[] outPutData)
        {
            NpgsqlCommand command = new NpgsqlCommand();

            NpgsqlConnection connection = new NpgsqlConnection(connction.Connection);
            command.Connection = connection;
            command.CommandText = commandName;
            command.CommandType = CommandType.StoredProcedure;
            //command.CommandTimeout = 600;
            int i = 0;
            if (paramName != null && paramName.Count > 0 && dataList != null)
            {
                foreach (var eachData in dataList)
                {
                    if (eachData != null)
                    {
                        if (eachData.GetType() == typeof(long))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Bigint).Value = eachData;
                        else if (eachData.GetType() == typeof(Boolean))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Boolean).Value = eachData;
                        else if (eachData.GetType() == typeof(DateTime))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Timestamp).Value = eachData;
                        else if (eachData.GetType() == typeof(Decimal))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Numeric).Value = eachData;
                        else if (eachData.GetType() == typeof(float))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Real).Value = eachData;
                        else if (eachData.GetType() == typeof(int))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Integer).Value = eachData;
                        else if (eachData.GetType() == typeof(double))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Double).Value = eachData;
                        else if (eachData.GetType() == typeof(string))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Text).Value = eachData;
                        else if (eachData.GetType() == typeof(Single))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Real).Value = eachData;
                        else if (eachData.GetType() == typeof(Int16))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Smallint).Value = eachData;
                        else if (eachData.GetType() == typeof(Byte))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Smallint).Value = eachData;
                        else if (eachData.GetType() == typeof(DataTable))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Json).Value = JsonConvert.SerializeObject(eachData, Formatting.Indented);
                        else if (eachData.GetType() == typeof(TimeSpan))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Time).Value = eachData;
                        else if (eachData.GetType() == typeof(Byte[]))
                            command.Parameters.Add(paramName[i], NpgsqlDbType.Bytea).Value = eachData;

                    }
                    i++;
                }
            }
            foreach (var eachData in outPutData)
                if (eachData.GetType() == typeof(long))
                    command.Parameters.Add(eachData.ToString(), NpgsqlDbType.Bigint).Direction = ParameterDirection.Output;
                else if (eachData.GetType() == typeof(bool))
                    command.Parameters.Add(eachData.ToString(), NpgsqlDbType.Boolean).Direction = ParameterDirection.Output;
                else if (eachData.GetType() == typeof(DateTime))
                    command.Parameters.Add(eachData.ToString(), NpgsqlDbType.Timestamp).Direction = ParameterDirection.Output;
                else if (eachData.GetType() == typeof(Decimal))
                    command.Parameters.Add(eachData.ToString(), NpgsqlDbType.Numeric).Direction = ParameterDirection.Output;
                else if (eachData.GetType() == typeof(float))
                    command.Parameters.Add(eachData.ToString(), NpgsqlDbType.Real).Direction = ParameterDirection.Output;
                else if (eachData.GetType() == typeof(int))
                    command.Parameters.Add(eachData.ToString(), NpgsqlDbType.Integer).Direction = ParameterDirection.Output;
                else if (eachData.GetType() == typeof(string))
                    command.Parameters.Add(eachData.ToString(), NpgsqlDbType.Text).Direction = ParameterDirection.Output;
                else if (eachData.GetType() == typeof(Single))
                    command.Parameters.Add(eachData.ToString(), NpgsqlDbType.Real).Direction = ParameterDirection.Output;
                else if (eachData.GetType() == typeof(Int16))
                    command.Parameters.Add(eachData.ToString(), NpgsqlDbType.Smallint).Direction = ParameterDirection.Output;
                else if (eachData.GetType() == typeof(Byte))
                    command.Parameters.Add(eachData.ToString(), NpgsqlDbType.Smallint).Direction = ParameterDirection.Output;
                else if (eachData.GetType() == typeof(DataTable))
                    command.Parameters.Add(eachData.ToString(), NpgsqlDbType.Json).Direction = ParameterDirection.Output;
                else if (eachData.GetType() == typeof(TimeSpan))
                    command.Parameters.Add(eachData.ToString(), NpgsqlDbType.Time).Direction = ParameterDirection.Output;
                else if (eachData.GetType() == typeof(Byte[]))
                    command.Parameters.Add(eachData.ToString(), NpgsqlDbType.Bytea).Direction = ParameterDirection.Output;
            return command;
        }
        #endregion Procedure Command Of string as Nvarchar type

        #region Genral Fun

        protected static List<T> DataReaderMapToList<T>(IDbCommand Command)
        {
            try
            {
                Command.Connection.Open();
                using (IDataReader reader = Command.ExecuteReader())
                {
                    List<T> list = new List<T>();
                    T obj = default(T);
                    while (reader.Read())
                    {
                        obj = Activator.CreateInstance<T>();
                        foreach (PropertyInfo prop in obj.GetType().GetProperties())
                        {
                            if (!object.Equals(reader[prop.Name], DBNull.Value))
                            {
                                try
                                {
                                    if (prop.PropertyType == typeof(string))
                                    {
                                        Object newobj;

                                        newobj = reader[prop.Name].ToString();

                                        prop.SetValue(obj, newobj, null);
                                    }
                                    else
                                    {
                                        prop.SetValue(obj, reader[prop.Name], null);
                                    }
                                }
                                catch
                                {
                                    prop.SetValue(obj, reader[prop.Name], null);
                                }
                            }
                        }
                        list.Add(obj);
                    }
                    return list;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                Command.Connection.Close();
            }
        }
        protected static List<T> DataReaderMapToList<T>(IDbCommand Command, List<string> parameters)
        {
            try
            {
                Command.Connection.Open();
                using (IDataReader reader = Command.ExecuteReader())
                {
                    List<T> list = new List<T>();
                    T obj = default(T);
                    while (reader.Read())
                    {
                        obj = Activator.CreateInstance<T>();
                        foreach (PropertyInfo prop in obj.GetType().GetProperties())
                        {
                            if (parameters.Contains(prop.Name) && !object.Equals(reader[prop.Name], DBNull.Value))
                            {
                                try
                                {
                                    if (prop.PropertyType == typeof(string))
                                    {
                                        Object newobj;
                                        newobj = reader[prop.Name].ToString();

                                        prop.SetValue(obj, newobj, null);
                                    }
                                    else
                                    {
                                        prop.SetValue(obj, reader[prop.Name], null);
                                    }
                                }
                                catch
                                {
                                    prop.SetValue(obj, reader[prop.Name], null);
                                }
                            }
                        }
                        list.Add(obj);
                    }
                    return list;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                Command.Connection.Close();
            }
        }

        protected static T DataReaderMapToDetail<T>(IDbCommand Command)
        {
            try
            {
                Command.Connection.Open();
                using (IDataReader reader = Command.ExecuteReader())
                {
                    T obj = default(T);
                    if (reader.Read())
                    {
                        obj = Activator.CreateInstance<T>();
                        foreach (PropertyInfo prop in obj.GetType().GetProperties())
                        {
                            if (!object.Equals(reader[prop.Name], DBNull.Value))
                            {
                                try
                                {
                                    if (prop.PropertyType == typeof(string))
                                    {
                                        Object newobj;

                                        newobj = reader[prop.Name].ToString();

                                        prop.SetValue(obj, newobj, null);
                                    }
                                    else
                                    {
                                        prop.SetValue(obj, reader[prop.Name], null);
                                    }
                                }
                                catch
                                {
                                    prop.SetValue(obj, reader[prop.Name], null);
                                }
                            }
                        }
                    }
                    return obj;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                Command.Connection.Close();
            }
        }


        protected static T DataReaderMapToDetail<T>(IDbCommand Command, List<string> parameters)
        {
            var configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json", false, true).Build();
            string EncodeKey = configuration.GetSection("EncodeKey").Value;

            try
            {
                Command.Connection.Open();
                using (IDataReader reader = Command.ExecuteReader())
                {
                    T obj = default(T);
                    if (reader.Read())
                    {
                        obj = Activator.CreateInstance<T>();
                        foreach (PropertyInfo prop in obj.GetType().GetProperties())
                        {
                            if (parameters.Contains(prop.Name) && !object.Equals(reader[prop.Name], DBNull.Value))
                            {
                                try
                                {
                                    if (prop.PropertyType == typeof(string))
                                    {
                                        Object newobj;
                                        if (EncodeKey != null && !string.IsNullOrEmpty(EncodeKey) && EncodeKey.ToLower() == "yes")
                                            newobj = HttpUtility.HtmlEncode(reader[prop.Name].ToString());
                                        else
                                            newobj = reader[prop.Name].ToString();

                                        prop.SetValue(obj, newobj, null);
                                    }
                                    else
                                    {
                                        prop.SetValue(obj, reader[prop.Name], null);
                                    }
                                }
                                catch
                                {
                                    prop.SetValue(obj, reader[prop.Name], null);
                                }
                            }
                        }
                    }
                    return obj;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                Command.Connection.Close();
            }
        }


        #endregion Genral Fun

        #region New Fun

        protected static int UpdateDB(IDbCommand command)
        {
            try
            {
                int returnData = default(int);
                command.Connection.Open();
                object obj = command.ExecuteScalar();
                if (obj != null && obj != DBNull.Value)
                {
                    returnData = (int)Convert.ChangeType(obj, typeof(int));
                }
                return returnData;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                command.Connection.Dispose();
            }
        }

        protected static int DeleteDB(IDbCommand command)
        {
            try
            {
                int returnData = default(int);
                command.Connection.Open();
                object obj = command.ExecuteScalar();
                if (obj != null && obj != DBNull.Value)
                {
                    returnData = (int)Convert.ChangeType(obj, typeof(int));
                }
                return returnData;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                command.Connection.Dispose();
            }
        }

        protected static T SaveDB<T>(IDbCommand command)
        {
            try
            {
                T returnData = default(T);
                command.Connection.Open();
                object obj = command.ExecuteScalar();
                if (obj != null && obj != DBNull.Value)
                {
                    returnData = (T)Convert.ChangeType(obj, typeof(T));
                }
                return returnData;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                command.Connection.Dispose();
            }
        }

        protected static bool SaveDB(IDbCommand command)
        {
            try
            {
                int returnData = default(int);
                command.Connection.Open();
                object obj = command.ExecuteScalar();
                if (obj != null && obj != DBNull.Value)
                {
                    returnData = (int)Convert.ChangeType(obj, typeof(int));
                }
                return returnData > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                command.Connection.Dispose();
            }
        }

        protected static T ReadSingleValue<T>(IDbCommand command)
        {
            try
            {
                T returnData = default(T);
                command.Connection.Open();
                object obj = command.ExecuteScalar();
                if (obj != null && obj != DBNull.Value)
                {
                    if (typeof(T) == typeof(string))
                    {
                        obj = obj.ToString();
                    }
                    returnData = (T)Convert.ChangeType(obj, typeof(T));
                }
                return returnData;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                command.Connection.Dispose();
            }
        }

        protected static T ReadSingleValue<T>(IDbCommand command, string Column)
        {
            var configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json", false, true).Build();
            string EncodeKey = configuration.GetSection("EncodeKey").Value;

            try
            {
                T returnData = default(T);
                command.Connection.Open();
                using (IDataReader dr = command.ExecuteReader())
                {
                    if (dr.Read())
                    {
                        if (typeof(T) == typeof(string))
                        {
                            if (EncodeKey != null && !string.IsNullOrEmpty(EncodeKey) && EncodeKey.ToLower() == "yes")
                                returnData = (T)Convert.ChangeType(HttpUtility.HtmlEncode(dr[Column].ToString()), typeof(T));
                            else
                                returnData = (T)Convert.ChangeType(dr[Column].ToString(), typeof(T));
                        }

                        else
                            returnData = (T)Convert.ChangeType(dr[Column].ToString(), typeof(T));
                    }
                }
                return returnData;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                command.Connection.Dispose();
            }
        }

        protected DataSet BindGridSearch(IDbCommand command)
        {
            try
            {
                if (typeof(NpgsqlCommand) == command.GetType())
                {
                    command.Connection.Open();
                    NpgsqlDataAdapter dataAdapter = new NpgsqlDataAdapter((NpgsqlCommand)command);
                    DataSet ds = new DataSet();
                    dataAdapter.Fill(ds);
                    ds = Encode(ds);
                    return ds;
                }
            }
            catch (Exception e)
            {
                throw e;
            }
            finally
            {
                command.Connection.Dispose();
            }
            return null;
        }

        protected static List<string> DataReaderMapToStringList(IDbCommand Command, string parameter)
        {
            var configuration = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json", false, true).Build();
            string EncodeKey = configuration.GetSection("EncodeKey").Value;

            try
            {
                Command.Connection.Open();
                using (IDataReader reader = Command.ExecuteReader())
                {
                    List<string> StringList = new List<string>();
                    while (reader.Read())
                    {
                        if (EncodeKey != null && !string.IsNullOrEmpty(EncodeKey) && EncodeKey.ToLower() == "yes")
                            StringList.Add(string.Format("{0}", System.Web.HttpUtility.HtmlEncode(reader[parameter].ToString())));
                        else
                            StringList.Add(string.Format("{0}", reader[parameter].ToString()));
                    }
                    return StringList;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                Command.Connection.Close();
            }
        }

        #endregion New Fun


        #region Analytics Section

        protected static string UpdateScalar(IDbCommand command)
        {
            try
            {
                command.Connection.Open();
                return HttpUtility.HtmlEncode(command.ExecuteScalar().ToString());
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                command.Connection.Dispose();
            }
        }

        protected int CommanDB(IDbCommand command)
        {
            try
            {
                command.Connection.Open();
                command.ExecuteNonQuery();
                return 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                command.Connection.Dispose();
            }
        }

        protected int CheckExistence(IDbCommand command)
        {
            try
            {
                command.Connection.Open();
                object obj = command.ExecuteScalar();
                if (obj != null && obj != DBNull.Value)
                {
                    int id = int.Parse(obj.ToString());
                    return id;
                }
                return 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                command.Connection.Dispose();
            }
        }

        protected long GetIntValue(IDbCommand command)
        {
            try
            {
                command.Connection.Open();
                object obj = command.ExecuteScalar();
                if (obj != null && obj != DBNull.Value)
                {
                    return long.Parse(obj.ToString());
                }
                return 0;
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                throw ex;
            }
            finally
            {
                command.Connection.Dispose();
            }
        }

        protected string GetStringValue(IDbCommand command)
        {
            try
            {
                command.Connection.Open();
                object obj = command.ExecuteScalar();
                if (obj != null && obj != DBNull.Value)
                {
                    string result = obj.ToString();
                    return HttpUtility.HtmlEncode(result);
                }
                return "";
            }
            catch (Exception ex)
            {
                AddDbError(ex.ToString(), DateTime.Now.ToString(), "plumb5-db", ex.StackTrace.ToString());
                throw ex;
            }
            finally
            {
                command.Connection.Dispose();
            }
        }

        #endregion Analytics Section

        #region DataSet
        protected static DataSet Encode(DataSet data)
        {
            return data;
        }

        protected void AddDbError(string Error, string ErrorDateTime, string pageName, string stackTrace)
        {
            //try
            //{
            //    var XmlPath = ConfigurationManager.AppSettings["MainPath"] + "\\ErrorLog\\EPAllHistoryDetailsP5ABCD\\PlumbSDb.xml";
            //    XDocument xmlDoc;
            //    if (File.Exists(XmlPath))
            //    {
            //        xmlDoc = XDocument.Load(XmlPath);
            //    }
            //    else
            //    {
            //        using (FileStream fs = new FileStream(XmlPath, FileMode.CreateNew, FileAccess.Write))
            //        {
            //            using (StreamWriter strwrt = new StreamWriter(fs))
            //            {
            //                strwrt.Write("<?xml version='1.0' encoding='utf-8' ?>");
            //                strwrt.WriteLine("<Plumb5>");
            //                strwrt.WriteLine("</Plumb5>");
            //                strwrt.Flush();
            //                fs.Close();
            //                xmlDoc = XDocument.Load(XmlPath);
            //            }
            //        }
            //    }
            //    var xElement = xmlDoc.Element("Plumb5");
            //    if (xElement != null)
            //        xElement.Add(
            //            new XElement("p5Error",
            //                         new XElement("PageName", pageName),
            //                         new XElement("Error", Error),
            //                         new XElement("ErrorStackTrace", stackTrace),
            //                         new XElement("ErrorDateTime", ErrorDateTime)));

            //    xmlDoc.Save(XmlPath);
            //}
            //catch
            //{
            //    //throw ex;
            //}
        }

        public void CommonInsertGeoIpBulkData(string Connection, DataTable dataTable, string tableName)
        {
            using (var npgsqlConn = new NpgsqlConnection(Connection))
            {
                npgsqlConn.Open();
                try
                {
                    var commandFormat = string.Format(CultureInfo.InvariantCulture, "COPY {0} {1} FROM STDIN BINARY", tableName, "(ip_from_string,ip_to_string,city_name,state_name,country_code,country_name,latitude,longitude,owner,ip_to,ip_from)");
                    using (var writer = npgsqlConn.BeginBinaryImport(commandFormat))
                    {
                        foreach (DataRow item in dataTable.Rows)
                        {
                            //writer.WriteRow(item.ItemArray);

                            writer.StartRow();
                            writer.Write(item[0], NpgsqlDbType.Text);
                            writer.Write(item[1], NpgsqlDbType.Text);
                            writer.Write(item[2], NpgsqlDbType.Text);
                            writer.Write(item[3], NpgsqlDbType.Text);
                            writer.Write(item[4], NpgsqlDbType.Text);
                            writer.Write(item[5], NpgsqlDbType.Text);
                            writer.Write(item[6], NpgsqlDbType.Text);
                            writer.Write(item[7], NpgsqlDbType.Text);
                            writer.Write(item[8], NpgsqlDbType.Text);
                            writer.Write(item[9], NpgsqlDbType.Numeric);
                            writer.Write(item[10], NpgsqlDbType.Numeric);
                        }
                        writer.Complete();
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    npgsqlConn.Close();
                }
            }
        }

        public void CommonBulkInsert(string connectionstring, DataTable dataTable, string tableName)
        {
            using (var npgsqlConn = new NpgsqlConnection(connectionstring))
            {
                string ColumnNames = string.Empty;
                Int16 i = 1;
                foreach (DataColumn column in dataTable.Columns)
                {
                    if (i == 1)
                        ColumnNames = column.ColumnName.ToLower();
                    else
                        ColumnNames += "," + column.ColumnName.ToLower();
                    i++;
                }

                npgsqlConn.Open();
                try
                {
                    var commandFormat = string.Format(CultureInfo.InvariantCulture, "COPY {0} ({1}) FROM STDIN (FORMAT BINARY)", tableName.ToLower(), ColumnNames);

                    using (var writer = npgsqlConn.BeginBinaryImport(commandFormat))
                    {
                        foreach (DataRow item in dataTable.Rows)
                        {
                            writer.StartRow();

                            foreach (DataColumn column in dataTable.Columns)
                            {
                                if (column.DataType == typeof(long))
                                {
                                    if (item[column].GetType() == typeof(long))
                                        writer.Write(item[column], NpgsqlDbType.Bigint);
                                    else
                                        writer.Write(DBNull.Value, NpgsqlDbType.Bigint);
                                }
                                else if (column.DataType == typeof(bool))
                                {
                                    if (item[column].GetType() == typeof(bool))
                                        writer.Write(item[column], NpgsqlDbType.Boolean);
                                    else
                                        writer.Write(DBNull.Value, NpgsqlDbType.Boolean);
                                }
                                else if (column.DataType == typeof(DateTime))
                                {
                                    if (item[column].GetType() == typeof(DateTime))
                                        writer.Write(item[column], NpgsqlDbType.Timestamp);
                                    else
                                        writer.Write(DBNull.Value, NpgsqlDbType.Timestamp);
                                }
                                else if (column.DataType == typeof(decimal))
                                {
                                    if (item[column].GetType() == typeof(decimal))
                                        writer.Write(item[column], NpgsqlDbType.Numeric);
                                    else
                                        writer.Write(DBNull.Value, NpgsqlDbType.Numeric);
                                }
                                else if (column.DataType == typeof(float))
                                {
                                    if (item[column].GetType() == typeof(float))
                                        writer.Write(item[column], NpgsqlDbType.Real);
                                    else
                                        writer.Write(DBNull.Value, NpgsqlDbType.Real);
                                }
                                else if (column.DataType == typeof(int))
                                {
                                    if (item[column].GetType() == typeof(int))
                                        writer.Write(item[column], NpgsqlDbType.Integer);
                                    else
                                        writer.Write(DBNull.Value, NpgsqlDbType.Integer);
                                }
                                else if (column.DataType == typeof(double))
                                {
                                    if (item[column].GetType() == typeof(double))
                                        writer.Write(item[column], NpgsqlDbType.Double);
                                    else
                                        writer.Write(DBNull.Value, NpgsqlDbType.Double);
                                }
                                else if (column.DataType == typeof(string))
                                {
                                    if (item[column].GetType() == typeof(string))
                                        writer.Write(item[column], NpgsqlDbType.Text);
                                    else if (item[column] == DBNull.Value)
                                        writer.Write(string.Empty, NpgsqlDbType.Text);
                                    else
                                        writer.Write(string.Empty, NpgsqlDbType.Text);
                                }
                                else if (column.DataType == typeof(Single))
                                {
                                    if (item[column].GetType() == typeof(Single))
                                        writer.Write(item[column], NpgsqlDbType.Real);
                                    else
                                        writer.Write(DBNull.Value, NpgsqlDbType.Real);
                                }
                                else if (column.DataType == typeof(short))
                                {
                                    if (item[column].GetType() == typeof(short))
                                        writer.Write(item[column], NpgsqlDbType.Smallint);
                                    else
                                        writer.Write(DBNull.Value, NpgsqlDbType.Smallint);
                                }
                                else if (column.DataType == typeof(Int16))
                                {
                                    if (item[column].GetType() == typeof(Int16))
                                        writer.Write(item[column], NpgsqlDbType.Smallint);
                                    else
                                        writer.Write(DBNull.Value, NpgsqlDbType.Smallint);
                                }
                                else if (column.DataType == typeof(Byte))
                                {
                                    if (item[column].GetType() == typeof(Byte))
                                        writer.Write(item[column], NpgsqlDbType.Smallint);
                                    else
                                        writer.Write(DBNull.Value, NpgsqlDbType.Smallint);
                                }
                                else if (column.DataType == typeof(TimeSpan))
                                {
                                    if (item[column].GetType() == typeof(TimeSpan))
                                        writer.Write(item[column], NpgsqlDbType.Time);
                                    else
                                        writer.Write(DBNull.Value, NpgsqlDbType.Time);
                                }
                            }
                        }
                        writer.Complete();
                    }
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    npgsqlConn.Close();
                }
            }
        }
        protected static List<T> DataReaderMapToListDynamic<T>(IDbCommand Command, List<string> parameters)
        {
            try
            {
                Command.Connection.Open();
                using (IDataReader reader = Command.ExecuteReader())
                {
                    List<T> list = new List<T>();
                    T obj = default(T);
                    while (reader.Read())
                    {
                        obj = Activator.CreateInstance<T>();
                        foreach (PropertyInfo prop in obj.GetType().GetProperties())
                        {
                            if (parameters.Contains(prop.Name) && !object.Equals(reader[prop.Name.Substring(0, 9)], DBNull.Value))
                            {
                                try
                                {
                                    if (prop.PropertyType == typeof(string))
                                    {
                                        Object newobj;
                                        newobj = reader[prop.Name.Substring(0, 9)].ToString();
                                        prop.SetValue(obj, newobj, null);
                                    }
                                    else
                                    {
                                        prop.SetValue(obj, reader[prop.Name], null);
                                    }
                                }
                                catch
                                {
                                    prop.SetValue(obj, reader[prop.Name], null);
                                }
                            }
                        }
                        list.Add(obj);
                    }
                    return list;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                Command.Connection.Close();
            }
        }

        #endregion

        #region Asyn and Await Task
        protected static async Task<bool> SaveDBAsync(DbCommand command)
        {
            try
            {
                await command.Connection.OpenAsync();
                return await command.ExecuteNonQueryAsync() > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                command.Connection.Dispose();
            }
        }
        protected static async Task<T> SaveDBAsync<T>(DbCommand command)
        {
            try
            {
                T returnData = default(T);
                await command.Connection.OpenAsync();
                object obj = await command.ExecuteScalarAsync();
                if (obj != null)
                {
                    returnData = (T)Convert.ChangeType(obj, typeof(T));
                }
                return returnData;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                command.Connection.Dispose();
            }
        }
        protected static async Task<int> UpadateDBAsync(DbCommand command)
        {
            try
            {
                await command.Connection.OpenAsync();
                return await command.ExecuteNonQueryAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                command.Connection.Dispose();
            }
        }
        protected static async Task<int> DeleteDBAsync(DbCommand command)
        {
            try
            {
                await command.Connection.OpenAsync();
                return await command.ExecuteNonQueryAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                command.Connection.Dispose();
            }
        }

        protected static async Task<List<T>> DataReaderMapToListAsync<T>(DbCommand Command)
        {
            try
            {
                await Command.Connection.OpenAsync();
                using (DbDataReader reader = await Command.ExecuteReaderAsync())
                {
                    List<T> list = new List<T>();
                    T obj = default(T);
                    while (await reader.ReadAsync())
                    {
                        obj = Activator.CreateInstance<T>();
                        foreach (PropertyInfo prop in obj.GetType().GetProperties())
                        {
                            if (!object.Equals(reader[prop.Name], DBNull.Value))
                            {
                                try
                                {
                                    if (prop.PropertyType == typeof(string))
                                    {
                                        Object newobj;
                                        newobj = reader[prop.Name].ToString();

                                        prop.SetValue(obj, newobj, null);
                                    }
                                    else
                                    {
                                        prop.SetValue(obj, reader[prop.Name], null);
                                    }
                                }
                                catch
                                {
                                    prop.SetValue(obj, reader[prop.Name], null);
                                }
                            }
                        }
                        list.Add(obj);
                    }
                    return list;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                Command.Connection.Close();
            }
        }
        protected static async Task<T> DataReaderMapToDetailAsync<T>(DbCommand Command, List<string> parameters)
        {
            try
            {
                await Command.Connection.OpenAsync();
                using (var reader = await Command.ExecuteReaderAsync())
                {
                    T obj = default(T);
                    if (await reader.ReadAsync())
                    {
                        obj = Activator.CreateInstance<T>();
                        foreach (PropertyInfo prop in obj.GetType().GetProperties())
                        {
                            if (parameters.Contains(prop.Name) && !object.Equals(reader[prop.Name], DBNull.Value))
                            {
                                try
                                {
                                    if (prop.PropertyType == typeof(string))
                                    {
                                        Object newobj = reader[prop.Name].ToString();
                                        prop.SetValue(obj, newobj, null);
                                    }
                                    else
                                    {
                                        prop.SetValue(obj, reader[prop.Name], null);
                                    }
                                }
                                catch
                                {
                                    prop.SetValue(obj, reader[prop.Name], null);
                                }
                            }
                        }
                    }
                    return obj;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                Command.Connection.Close();
            }
        }
        protected static async Task<T> ReadSingleValueAsync<T>(DbCommand command)
        {
            try
            {
                T returnData = default(T);
                await command.Connection.OpenAsync();
                object obj = await command.ExecuteScalarAsync();
                if (obj != null && obj != DBNull.Value)
                {
                    if (typeof(T) == typeof(string))
                    {
                        obj = obj.ToString();
                    }
                    returnData = (T)Convert.ChangeType(obj, typeof(T));
                }
                return returnData;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                command.Connection.Dispose();
            }
        }
        protected static async Task<T> DataReaderMapToDetailAsync<T>(DbCommand Command)
        {
            try
            {
                await Command.Connection.OpenAsync();
                using (var reader = await Command.ExecuteReaderAsync())
                {
                    T obj = default(T);
                    if (await reader.ReadAsync())
                    {
                        obj = Activator.CreateInstance<T>();
                        foreach (PropertyInfo prop in obj.GetType().GetProperties())
                        {
                            if (!object.Equals(reader[prop.Name], DBNull.Value))
                            {
                                try
                                {
                                    if (prop.PropertyType == typeof(string))
                                    {
                                        Object newobj = reader[prop.Name].ToString();
                                        prop.SetValue(obj, newobj, null);
                                    }
                                    else
                                    {
                                        prop.SetValue(obj, reader[prop.Name], null);
                                    }
                                }
                                catch
                                {
                                    prop.SetValue(obj, reader[prop.Name], null);
                                }
                            }
                        }
                    }
                    return obj;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                Command.Connection.Close();
            }
        }

        protected static async Task<List<T>> DataReaderMapToListAsync<T>(DbCommand Command, List<string> parameters)
        {
            try
            {
                await Command.Connection.OpenAsync();
                using (DbDataReader reader = await Command.ExecuteReaderAsync())
                {
                    List<T> list = new List<T>();
                    T obj = default(T);
                    while (await reader.ReadAsync())
                    {
                        obj = Activator.CreateInstance<T>();
                        foreach (PropertyInfo prop in obj.GetType().GetProperties())
                        {
                            if (parameters.Contains(prop.Name) && !object.Equals(reader[prop.Name], DBNull.Value))
                            {
                                try
                                {
                                    if (prop.PropertyType == typeof(string))
                                    {
                                        Object newobj;
                                        newobj = reader[prop.Name].ToString();

                                        prop.SetValue(obj, newobj, null);
                                    }
                                    else
                                    {
                                        prop.SetValue(obj, reader[prop.Name], null);
                                    }
                                }
                                catch
                                {
                                    prop.SetValue(obj, reader[prop.Name], null);
                                }
                            }
                        }
                        list.Add(obj);
                    }
                    return list;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                Command.Connection.Close();
            }
        }

        protected async Task<DataSet> BindGridSearchAsync(DbCommand command)
        {
            try
            {
                if (typeof(NpgsqlCommand) == command.GetType())
                {
                    await command.Connection.OpenAsync();
                    NpgsqlDataAdapter dataAdapter = new NpgsqlDataAdapter((NpgsqlCommand)command);
                    DataSet ds = new DataSet();
                    dataAdapter.Fill(ds);
                    ds = Encode(ds);
                    return ds;
                }
            }
            catch (Exception e)
            {
                throw e;
            }
            finally
            {
                command.Connection.Dispose();
            }
            return null;
        }

        protected async Task<DataSet> BindGridSearchAsyncInlineAsync(string connectionString, string QueryString)
        {
            using (NpgsqlConnection connection = new NpgsqlConnection(connectionString))
            {
                try
                {
                    await connection.OpenAsync();

                    using (NpgsqlCommand command = new NpgsqlCommand(QueryString, connection))
                    {
                        NpgsqlDataAdapter adapter = new NpgsqlDataAdapter(command);
                        DataSet ds = new DataSet();
                        adapter.Fill(ds);
                        ds = Encode(ds);
                        return ds;
                    }
                }
                catch (Exception e)
                {
                    throw e;
                }
                finally
                {
                    connection.Dispose();
                }
            }
        }

        #endregion

        private static bool DontEncodeJsonData(string value)
        {
            bool data = false;
            try
            {
                var obj = JToken.Parse(value);
                data = true;
            }
            catch (JsonReaderException ex)
            {

            }

            return data;
        }

        protected DataSet ConvertDataReaderToDataSet(IDataReader data)
        {
            DataSet ds = new DataSet();
            int i = 0;
            while (!data.IsClosed)
            {
                ds.Tables.Add("Table" + (i + 1));
                ds.EnforceConstraints = false;
                ds.Tables[i].Load(data);
                i++;
            }
            return ds;
        }

        protected static string ConvertDataTableToJson(DataTable dt)
        {
            try
            {
                return JsonConvert.SerializeObject(dt);
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}