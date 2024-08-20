﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class AdminGeoIPDatabaseDetails
    {
        public int Id { get; set; }
        public string? IPDBFileName { get; set; }
        public string? IPFileUrl { get; set; }
        public Int64 TotalRows { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
