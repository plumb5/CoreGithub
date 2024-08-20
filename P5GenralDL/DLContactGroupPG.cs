using Dapper;
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
    public class DLContactGroupPG : CommonDataBaseInteraction, IDLContactGroup
    {
        CommonInfo connection;
        public DLContactGroupPG(int adsId)
        {
            connection = GetDBConnection(adsId);
        }

        public DLContactGroupPG(string connectionString)
        {
            connection = new CommonInfo() { Connection = connectionString };
        }

        public async Task<bool> ImportAndAddToGroup(MLContactGroup contactWithGroup)
        {
            string storeProcCommand = "select * from Contact_NewList(@Action,@UserInfoUserId, @UserGroupId, @Name, @EmailId, @PhoneNumber, @Gender, @Age, @MaritalStatus, @Education, @Occupation, @Interests, @Location, @CustomField1, @CustomField2, @CustomField3, @CustomField4, @CustomField5, @CustomField6, @CustomField7, @CustomField8, @CustomField9, @CustomField10, @CustomField11, @CustomField12, @CustomField13, @CustomField14, @CustomField15, @CustomField16, @CustomField17, @CustomField18, @CustomField19, @CustomField20, @GroupId )";
            object? param = new { Action = "InsertUpdateFullDetailsContacts", contactWithGroup.UserInfoUserId, contactWithGroup.UserGroupId, contactWithGroup.Name, contactWithGroup.EmailId, contactWithGroup.PhoneNumber, contactWithGroup.Gender, contactWithGroup.Age, contactWithGroup.MaritalStatus, contactWithGroup.Education, contactWithGroup.Occupation, contactWithGroup.Interests, contactWithGroup.Location, contactWithGroup.CustomField1, contactWithGroup.CustomField2, contactWithGroup.CustomField3, contactWithGroup.CustomField4, contactWithGroup.CustomField5, contactWithGroup.CustomField6, contactWithGroup.CustomField7, contactWithGroup.CustomField8, contactWithGroup.CustomField9, contactWithGroup.CustomField10, contactWithGroup.CustomField11, contactWithGroup.CustomField12, contactWithGroup.CustomField13, contactWithGroup.CustomField14, contactWithGroup.CustomField15, contactWithGroup.CustomField16, contactWithGroup.CustomField17, contactWithGroup.CustomField18, contactWithGroup.CustomField19, contactWithGroup.CustomField20, contactWithGroup.GroupId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }

        public async Task<int> ImportContact(MLContactGroup contactWithGroup)
        {
            string storeProcCommand = "select * from Contact_NewList(@Action,@UserInfoUserId,@UserGroupId,@Name,@EmailId,@PhoneNumber)";
            object? param = new { Action = "ImportContact", contactWithGroup.UserInfoUserId, contactWithGroup.UserGroupId, contactWithGroup.Name, contactWithGroup.EmailId, contactWithGroup.PhoneNumber };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param);

        }

        public async Task<bool> UpdateOnlyNameEmailPhone(MLContactGroup contact)
        {
            string storeProcCommand = "select * from Contact_NewList(@Action,@Name,@EmailId,@PhoneNumber,@ContactId)";
            object? param = new { Action = "UpdateOnlyNameEmailPhone", contact.Name, contact.EmailId, contact.PhoneNumber, contact.ContactId };

            using var db = GetDbConnection(connection.Connection);
            return await db.ExecuteScalarAsync<int>(storeProcCommand, param) > 0;

        }
    }
}
