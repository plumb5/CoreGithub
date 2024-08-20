using P5GenralML;

namespace Plumb5.Dto
{
    public record CampaignConfiguration_GetCampaignIdentifierMaxCountDto(int accountId, CampaignIdentifier identifier);
    public record CampaignConfiguration_GetCampaignIdentifierDetailsDto(int accountId, CampaignIdentifier identifier, int OffSet, int FetchNext);
    public record CampaignConfiguration_CampaignIdentifierSaveOrUpdateDetailsDto(int accountId, CampaignIdentifier identifier);
    public record CampaignConfiguration_CampaignIdentifierToogleStatusDto(int accountId, CampaignIdentifier identifier);
    public record CampaignConfiguration_CampaignIdentifierArchiveDto(int accountId, int Id);
}
