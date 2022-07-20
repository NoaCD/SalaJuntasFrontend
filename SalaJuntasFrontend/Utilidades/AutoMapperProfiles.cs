using ApiSalaJuntas.Model.DTOS.Eventos;
using AutoMapper;
using SalaJuntasFrontend.Models.DTOS.Eventos;

namespace SalaJuntasFrontend.Utilidades
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<EventoViewDTO, EventoDTO>()
                            .ForMember(dest => dest.id, opt => opt.MapFrom(src => src.id))
                            .ForMember(dest => dest.titulo, opt => opt.MapFrom(src => src.title))
                            .ForMember(dest => dest.descripcion, opt => opt.MapFrom(src => src.description))
                            .ForMember(dest => dest.colorEvento, opt => opt.MapFrom(src => src.backgroundColor))
                            .ForMember(dest => dest.inicio, opt => opt.MapFrom(src => src.start))
                            .ForMember(dest => dest.final, opt => opt.MapFrom(src => src.end))
                            .ForMember(dest => dest.fechaCreacion, opt => opt.MapFrom(src => src.fechaCreacion))
                            .ForMember(dest => dest.fechaModificacion, opt => opt.MapFrom(src => src.fechaModificacion))
                            .ForMember(dest => dest.usuario, opt => opt.MapFrom(src => src.usuario))
                            .ForMember(dest => dest.area, opt => opt.MapFrom(src => src.area))
                            .ForMember(dest => dest.estatus, opt => opt.MapFrom(src => src.estatus))


                            .ReverseMap();

        }
    }
}
