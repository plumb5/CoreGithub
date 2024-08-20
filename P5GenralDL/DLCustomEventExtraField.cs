﻿using IP5GenralDL;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralDL
{
    public class DLCustomEventExtraField
    {
        public static IDLCustomEventExtraField GetDLCustomEventExtraField(int AccountId, string vendor)
        {
            if (vendor.Equals("mssql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLCustomEventExtraFieldSQL(AccountId);
            }
            else if (vendor.Equals("npgsql", StringComparison.OrdinalIgnoreCase))
            {
                return new DLCustomEventExtraFieldPG(AccountId);
            }
            throw new ArgumentException("Unknown sql vendor: " + vendor);
        }
    }
}
