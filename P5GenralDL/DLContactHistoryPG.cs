﻿using Dapper;
using DBInteraction;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLContactHistoryPG : CommonDataBaseInteraction, IDLContactHistory
    {
        CommonInfo connection;
        public DLContactHistoryPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLContactHistoryPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<List<ContactHistory>> GetContactDeleteHistory(List<int> contactIdList)
        {
            string storeProcCommand = "select * from Contact_History(@Action,@ContactIdList)";
            object? param = new { Action = "GetContactDeleteHistory", ContactIdList = string.Join(",", contactIdList) };

            using var db = GetDbConnection(connection.Connection);
            return (await db.QueryAsync<ContactHistory>(storeProcCommand, param)).ToList();

        }
    }
}
