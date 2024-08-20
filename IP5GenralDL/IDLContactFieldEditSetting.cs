using P5GenralML;

namespace P5GenralDL
{
    public interface IDLContactFieldEditSetting : IDisposable
    {
        Task DeleteProperty(int PropertyId);
        Task DeletePropertyByName(string PropertyName);
        Task<List<MLContactFieldEditSetting>> GetFullList();
        Task<List<MLContactFieldEditSetting>> GetMLIsPublisher();
        Task<List<MLContactFieldEditSetting>> GetMLIsSearchbyColumn();
        Task<List<ContactFieldEditSetting>> GetSetting();
        Task SaveProperty(ContactFieldEditSetting editSetting);
        Task SaveupdateLmsheaderflag(bool headerflag);
        Task UpdateDisplayOrder(ContactFieldEditSetting editSetting);
        Task<bool> UpdateProperty(ContactFieldProperty c);
        Task<bool> UpdatePublisherField(ContactFieldProperty c);
    }
}