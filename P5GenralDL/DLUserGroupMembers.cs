﻿using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLUserGroupMembers
    {
        public static IDLUserGroupMembers GetDLUserGroupMembers(string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLUserGroupMembersSQL();
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLUserGroupMembersPG();
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
