using P5GenralDL;
using P5GenralML;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Plumb5GenralFunction
{
    public class GeneralAddToGroups : IDisposable
    {
        private readonly int AdsId;
        public GeneralAddToGroups(int adsId, string? sqlVendor)
        {
            AdsId = adsId;
            SqlVendor = sqlVendor;
        }

        public async Task<Tuple<List<Int64>, List<Int64>, List<Int64>>> AddToGroupMemberAndRespectiveModule(int UserInfoUserId, int UserGroupId, int[] Groups, int[] contactIds = null, string[] MachineIds = null, string[] DeviceIds = null)
        {
            List<Int64> addToGroupMember = new List<Int64>();
            List<Int64> webPushGroupMember = new List<Int64>();
            List<Int64> mobilePushGroupMember = new List<Int64>();
            try
            {
                foreach (var GroupId in Groups)
                {
                    try
                    {
                        GroupMember groupMember = new GroupMember()
                        {
                            GroupId = GroupId,
                            UserInfoUserId = UserInfoUserId,
                            UserGroupId = UserGroupId

                        };
                        WebPushGroupMembers webPushGroupMembers = new WebPushGroupMembers()
                        {
                            GroupId = GroupId,
                            UserInfoUserId = UserInfoUserId,
                            UserGroupId = UserGroupId
                        };
                        MobilePushGroupMembers mobilePushGroupMembers = new MobilePushGroupMembers()
                        {
                            GroupId = GroupId,
                            UserInfoUserId = UserInfoUserId,
                            UserGroupId = UserGroupId
                        };

                        if (contactIds != null && contactIds.Length > 0)
                        {
                            var contactresult = await AddToGroupByContactIds(contactIds, groupMember, webPushGroupMembers, mobilePushGroupMembers);
                            addToGroupMember = contactresult.Item1;
                            webPushGroupMember = contactresult.Item2;
                            mobilePushGroupMember = contactresult.Item3;
                        }

                        if (MachineIds != null && MachineIds.Length > 0)
                        {
                            var contactresult = await AddToGroupByMachineIds(MachineIds, groupMember, webPushGroupMembers, mobilePushGroupMembers);
                            addToGroupMember = contactresult.Item1;
                            webPushGroupMember = contactresult.Item2;
                            mobilePushGroupMember = contactresult.Item3;
                        }

                        if (DeviceIds != null && DeviceIds.Length > 0)
                        {
                            var contactresult = await AddToGroupByDeviceIds(DeviceIds, groupMember, webPushGroupMembers, mobilePushGroupMembers);
                            addToGroupMember = contactresult.Item1;
                            webPushGroupMember = contactresult.Item2;
                            mobilePushGroupMember = contactresult.Item3;
                        }
                    }
                    catch (Exception ex)
                    {
                        using (ErrorUpdation objError = new ErrorUpdation("GeneralAddToGroups"))
                            objError.AddError(ex.Message, "GeneralAddToGroups--> Insert into group inner error", DateTime.Now.ToString(), "GeneralAddToGroups-->AddToGroupMemberAndRespectiveModule", ex.StackTrace, true);
                    }
                }
            }
            catch (Exception ex)
            {
                using (ErrorUpdation objError = new ErrorUpdation("GeneralAddToGroups"))
                    objError.AddError(ex.Message, "GeneralAddToGroups--> Insert into group error", DateTime.Now.ToString(), "GeneralAddToGroups-->AddToGroupMemberAndRespectiveModule", ex.StackTrace);
            }
            return Tuple.Create(addToGroupMember, webPushGroupMember, mobilePushGroupMember);
        }

        private async Task<Tuple<List<Int64>, List<Int64>, List<Int64>>> AddToGroupByContactIds(int[] contactIds, GroupMember groupMember, WebPushGroupMembers webPushGroupMembers, MobilePushGroupMembers mobilePushGroupMembers)
        {
            List<Int64> addToGroupMember = new List<Int64>();
            List<Int64> webPushGroupMember = new List<Int64>();
            List<Int64> mobilePushGroupMember = new List<Int64>();
            try
            {
                if (contactIds != null && contactIds.Length > 0)
                {
                    foreach (var ContactId in contactIds)
                    {
                        try
                        {
                            #region Inserting to GroupMember table
                            groupMember.ContactId = ContactId;
                            using (var objGroupMember = DLGroupMember.GetDLGroupMember(AdsId, SqlVendor))
                            {
                                try
                                {
                                    Int64 id = await objGroupMember.Save(groupMember);
                                    if (id > 0)
                                        addToGroupMember.Add(id);
                                    else
                                        addToGroupMember.Add(id);
                                }
                                catch { }
                            }
                            #endregion Inserting to GroupMember table

                            #region Getting visitorInfo data list by contactId                        
                            List<VisitorInformation> visitorinformationList = null;
                            using (var objDL = DLVisitorInformation.GetDLVisitorInformation(AdsId, SqlVendor))
                            {
                                visitorinformationList = await objDL.GetList(new VisitorInformation() { ContactId = ContactId });
                            }
                            #endregion Getting visitorInfo data list by contactId

                            #region WebPushGroupMembers table insertion
                            if (visitorinformationList != null && visitorinformationList.Count > 0 && visitorinformationList.Where(x => x.SourceType == 1).ToList().Count > 0)
                            {
                                var webvisitorInfo = visitorinformationList.Where(x => x.SourceType == 1).OrderByDescending(d => d.Date).FirstOrDefault();
                                if (webvisitorInfo != null)
                                {
                                    webPushGroupMembers.ContactId = ContactId;
                                    webPushGroupMembers.MachineId = webvisitorInfo.MachineId;
                                    using (var objDLMember = DLWebPushGroupMembers.GetDLWebPushGroupMembers(AdsId, SqlVendor))
                                    {
                                        try
                                        {
                                            Int64 id = await objDLMember.AddToGroup(webPushGroupMembers);
                                            if (id > 0)
                                                webPushGroupMember.Add(id);
                                            else
                                                webPushGroupMember.Add(id);
                                        }
                                        catch { }
                                    }
                                }
                            }
                            #endregion WebPushGroupMembers table insertion

                            #region MobilePushGroupMembers table insertion
                            if (visitorinformationList != null && visitorinformationList.Count > 0 && visitorinformationList.Where(x => x.SourceType == 2).ToList().Count > 0)
                            {
                                var mobvisitorInfo = visitorinformationList.Where(x => x.SourceType == 2).OrderByDescending(d => d.Date).FirstOrDefault();
                                if (mobvisitorInfo != null)
                                {
                                    mobilePushGroupMembers.ContactId = ContactId;
                                    mobilePushGroupMembers.DeviceId = mobvisitorInfo.MachineId;
                                    using (var objDLMobilePushGroupMembers = DLMobilePushGroupMembers.GetDLMobilePushGroupMembers(AdsId, SqlVendor))
                                    {
                                        try
                                        {
                                            Int64 id = await objDLMobilePushGroupMembers.AddToGroup(mobilePushGroupMembers);
                                            if (id > 0)
                                                mobilePushGroupMember.Add(id);
                                            else
                                                mobilePushGroupMember.Add(id);
                                        }
                                        catch { }
                                    }
                                }
                            }
                            #endregion MobilePushGroupMembers table insertion
                        }
                        catch { }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return Tuple.Create(addToGroupMember, webPushGroupMember, mobilePushGroupMember);
        }

        private async Task<Tuple<List<Int64>, List<Int64>, List<Int64>>> AddToGroupByMachineIds(string[] MachineIds, GroupMember groupMember, WebPushGroupMembers webPushGroupMembers, MobilePushGroupMembers mobilePushGroupMembers)
        {
            List<Int64> addToGroupMember = new List<Int64>();
            List<Int64> webPushGroupMember = new List<Int64>();
            List<Int64> mobilePushGroupMember = new List<Int64>();

            try
            {
                if (MachineIds != null && MachineIds.Length > 0)
                {
                    foreach (var eachMachineId in MachineIds)
                    {
                        try
                        {
                            #region Get VisitorInfo By MachineId
                            VisitorInformation? visitorInfo = new VisitorInformation() { MachineId = eachMachineId };
                            using (var objDLVisitorInformation = DLVisitorInformation.GetDLVisitorInformation(AdsId, SqlVendor))
                            {
                                visitorInfo = await objDLVisitorInformation.Get(visitorInfo);
                            }
                            #endregion Get VisitorInfo By MachineId

                            #region Inserting to WebPushGroupMembers Table
                            webPushGroupMembers.MachineId = eachMachineId;
                            webPushGroupMembers.ContactId = visitorInfo != null ? visitorInfo.ContactId : 0;
                            using (var objDLWebPushGroupMember = DLWebPushGroupMembers.GetDLWebPushGroupMembers(AdsId, SqlVendor))
                            {
                                try
                                {
                                    Int64 id = await objDLWebPushGroupMember.AddToGroup(webPushGroupMembers);
                                    if (id > 0)
                                        webPushGroupMember.Add(id);
                                    else
                                        webPushGroupMember.Add(id);
                                }
                                catch { }
                            }
                            #endregion Inserting to WebPushGroupMembers Table

                            #region Inserting to GroupMembers Table
                            if (visitorInfo != null && visitorInfo.ContactId > 0)
                            {
                                groupMember.ContactId = visitorInfo.ContactId;
                                using (var objDLGroupMember = DLGroupMember.GetDLGroupMember(AdsId, SqlVendor))
                                {
                                    try
                                    {
                                        Int64 id = await objDLGroupMember.Save(groupMember);
                                        if (id > 0)
                                            addToGroupMember.Add(id);
                                        else
                                            addToGroupMember.Add(id);
                                    }
                                    catch { }
                                }
                            }
                            #endregion

                            #region Inserting to MobilePushGroupMembers Table
                            if (visitorInfo != null && visitorInfo.ContactId > 0)
                            {
                                #region Getting visitorInfo data list by contactId
                                VisitorInformation mobvisitorInfo = new VisitorInformation() { ContactId = visitorInfo.ContactId };
                                List<VisitorInformation> visitorinformationList = new List<VisitorInformation>();
                                using (var objDL = DLVisitorInformation.GetDLVisitorInformation(AdsId, SqlVendor))
                                {
                                    visitorinformationList = await objDL.GetList(mobvisitorInfo);
                                }
                                #endregion Getting visitorInfo data list by contactId
                                if (visitorinformationList != null && visitorinformationList.Count > 0)
                                {
                                    mobvisitorInfo = visitorinformationList.Where(x => x.SourceType == 2).OrderByDescending(d => d.Date).FirstOrDefault();
                                    if (mobvisitorInfo != null)
                                    {
                                        mobilePushGroupMembers.ContactId = mobvisitorInfo.ContactId;
                                        mobilePushGroupMembers.DeviceId = mobvisitorInfo.MachineId;
                                        using (var objMobilePushGroupMember = DLMobilePushGroupMembers.GetDLMobilePushGroupMembers(AdsId, SqlVendor))
                                        {
                                            try
                                            {
                                                Int64 id = await objMobilePushGroupMember.AddToGroup(mobilePushGroupMembers);
                                                if (id > 0)
                                                    mobilePushGroupMember.Add(id);
                                                else
                                                    mobilePushGroupMember.Add(id);
                                            }
                                            catch { }
                                        }
                                    }
                                }
                            }
                            #endregion
                        }
                        catch { }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return Tuple.Create(addToGroupMember, webPushGroupMember, mobilePushGroupMember);
        }

        private async Task<Tuple<List<Int64>, List<Int64>, List<Int64>>> AddToGroupByDeviceIds(string[] DeviceIds, GroupMember groupMember, WebPushGroupMembers webPushGroupMembers, MobilePushGroupMembers mobilePushGroupMembers)
        {
            List<Int64> addToGroupMember = new List<Int64>();
            List<Int64> webPushGroupMember = new List<Int64>();
            List<Int64> mobilePushGroupMember = new List<Int64>();

            try
            {
                if (DeviceIds != null && DeviceIds.Length > 0)
                {
                    foreach (var eachDeviceId in DeviceIds)
                    {
                        try
                        {
                            #region Get VisitorInfo by DeviceId
                            VisitorInformation? visitorInfo = new VisitorInformation() { MachineId = eachDeviceId };
                            using (var objDLVisitorInformation = DLVisitorInformation.GetDLVisitorInformation(AdsId, SqlVendor))
                            {
                                visitorInfo = await objDLVisitorInformation.Get(visitorInfo);
                            }
                            #endregion Get VisitorInfo by DeviceId

                            #region Inserting to MobilePushGroupMembers Table
                            mobilePushGroupMembers.DeviceId = eachDeviceId;
                            mobilePushGroupMembers.ContactId = visitorInfo != null ? visitorInfo.ContactId : 0;
                            using (var objMobilePushGroupMember = DLMobilePushGroupMembers.GetDLMobilePushGroupMembers(AdsId, SqlVendor))
                            {
                                try
                                {
                                    Int64 id = await objMobilePushGroupMember.AddToGroup(mobilePushGroupMembers);
                                    if (id > 0)
                                        mobilePushGroupMember.Add(id);
                                    else
                                        mobilePushGroupMember.Add(id);
                                }
                                catch { }
                            }
                            #endregion Inserting to MobilePushGroupMembers Table

                            #region Inserting to GroupMembers Table
                            if (visitorInfo != null && visitorInfo.ContactId > 0)
                            {
                                groupMember.ContactId = visitorInfo.ContactId;
                                using (var objDLGroupMember = DLGroupMember.GetDLGroupMember(AdsId, SqlVendor))
                                {
                                    try
                                    {
                                        Int64 id = await objDLGroupMember.Save(groupMember);
                                        if (id > 0)
                                            addToGroupMember.Add(id);
                                        else
                                            addToGroupMember.Add(id);
                                    }
                                    catch { }
                                }
                            }
                            #endregion Inserting to GroupMembers Table

                            #region WebPushGroupMembers table insertion
                            if (visitorInfo != null && visitorInfo.ContactId > 0)
                            {
                                #region Getting visitorInfo data list by contactId
                                VisitorInformation webvisitorInfo = new VisitorInformation() { ContactId = visitorInfo.ContactId };
                                List<VisitorInformation> visitorinformationList = new List<VisitorInformation>();
                                using (var objDL = DLVisitorInformation.GetDLVisitorInformation(AdsId, SqlVendor))
                                {
                                    visitorinformationList = await objDL.GetList(visitorInfo);
                                }
                                #endregion Getting visitorInfo data list by contactId
                                if (visitorinformationList != null && visitorinformationList.Count > 0)
                                {
                                    try
                                    {
                                        webvisitorInfo = visitorinformationList.Where(x => x.SourceType == 1).OrderByDescending(d => d.Date).FirstOrDefault();
                                        if (webvisitorInfo != null)
                                        {
                                            webPushGroupMembers.ContactId = webvisitorInfo.ContactId;
                                            webPushGroupMembers.MachineId = webvisitorInfo.MachineId;
                                            using (var objDLMember = DLWebPushGroupMembers.GetDLWebPushGroupMembers(AdsId, SqlVendor))
                                            {
                                                Int64 id = await objDLMember.AddToGroup(webPushGroupMembers);
                                                if (id > 0)
                                                    webPushGroupMember.Add(id);
                                                else
                                                    webPushGroupMember.Add(id);
                                            }
                                        }
                                    }
                                    catch { }
                                }
                            }
                            #endregion
                        }
                        catch { }
                    }
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return Tuple.Create(addToGroupMember, webPushGroupMember, mobilePushGroupMember);
        }

        #region Dispose Method
        bool disposed;

        public string? SqlVendor { get; }

        protected virtual void Dispose(bool disposing)
        {
            if (!disposed)
            {
                if (disposing)
                {

                }
            }
            //dispose unmanaged ressources
            disposed = true;
        }

        public void Dispose()
        {
            Dispose(true);
        }

        #endregion End of Dispose Method
    }
}
