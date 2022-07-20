using ApiSalaJuntas.Model.DTOS.Eventos;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SalaJuntasFrontend.Models.DTOS.Eventos;
using System.Text.Json.Serialization;

namespace SalaJuntasFrontend.Controllers
{
    public class EventosController : Controller
    {
        static readonly HttpClient client = new HttpClient();
        private readonly IMapper mapper;

        public EventosController(IMapper mapper)
        {
            this.mapper = mapper;
        }

        // GET: EventosController
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet("obtener-eventos")]
        public async Task<ActionResult<List<EventoViewDTO>>> GetAll([FromQuery]DateTime? start = null, DateTime? end = null, int? idAreaMostrar = 1)
        {
            // Call asynchronous network methods in a try/catch block to handle exceptions.
            try
            {
                HttpResponseMessage response = await client.GetAsync("https://localhost:44365/api/eventos");
                response.EnsureSuccessStatusCode();
                string responseBody = await response.Content.ReadAsStringAsync();
                // Above three lines can be replaced with new helper method below
                // string responseBody = await client.GetStringAsync(uri);
                var e = JsonConvert.DeserializeObject<List<EventoDTO>>(responseBody).ToList();

                var eventos = mapper.Map<List<EventoViewDTO>>(e).ToList();

                return eventos;
            }
            catch (HttpRequestException e)
            {
                return BadRequest();
            }
        }


        // GET: EventosController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: EventosController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: EventosController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: EventosController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: EventosController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: EventosController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: EventosController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}
