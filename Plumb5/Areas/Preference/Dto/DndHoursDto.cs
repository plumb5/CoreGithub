using P5GenralML;

namespace Plumb5.Areas.Preference.Dto
{
    public record DndHoursDto_SaveDndHourDto(int AccountId, DndHour dndHour, int startHour, int startMinutes, int endHour, int endMinutes);
    public record DndHoursDto_GetDndHourDetailsDto(int AccountId);
}
