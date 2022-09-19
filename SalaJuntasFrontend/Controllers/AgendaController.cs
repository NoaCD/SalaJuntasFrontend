using ApiSalaJuntas.Model.DTOS.Areas;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SalaJuntasFrontend.Models.DTOS.ViewsModel;

namespace SalaJuntasFrontend.Controllers
{
    public class AgendaController : Controller
    {
        private readonly IMapper mapper;
        private readonly IConfiguration configuration;

        public AgendaController(IMapper mapper, IConfiguration configuration)
        {
            this.mapper = mapper;
            this.configuration = configuration;
        }

        public IActionResult Index()
        {
            AreasController areasController = new AreasController(mapper, configuration);


            //Realizamos una peticion para obtener todas las salas
            var todasSalas = (dynamic)areasController.TodosAreas().Result.Result;

            List<AreaDTO> jsonSalas = todasSalas.Value.Data;



            var areasViewModel = new AreasViewModel();

            if (jsonSalas != null)
            {
                areasViewModel.areas = jsonSalas;
                areasViewModel.estatus = "success";
            }

            areasViewModel.estatus = "error";

            return View(areasViewModel);
        }
    }
}
