﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace P5GenralML
{
    public class MLWorkFlowMobileAppReport
    {
        public string? Action { get; set; }
        public string? Key { get; set; }
        public int WorkFlowId { get; set; }
        public int ConfigId { get; set; }
        public int MobileCampaignId { get; set; }
        public int CampaignType { get; set; }
        public string? FromDate { get; set; }
        public string? ToDate { get; set; }
        public int Start { get; set; }
        public int End { get; set; }
    }
}