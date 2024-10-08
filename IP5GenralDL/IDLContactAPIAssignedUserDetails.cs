﻿using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IP5GenralDL
{
    public interface IDLContactAPIAssignedUserDetails:IDisposable
    {
        Task<ContactAPIAssignedUserDetails?> Get();
        Task<Int32> Save(ContactAPIAssignedUserDetails assignedUser);
    }
}
