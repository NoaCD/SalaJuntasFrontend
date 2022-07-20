using System.ComponentModel.DataAnnotations;

namespace ApiSalaJuntas.Model.DTOS.Areas
{
    public class AreaCreacionDTO
    {
        [Required(ErrorMessage = "{0} es obligatorio")]
        public int idEstatus { get; set; }
        [Required(ErrorMessage = "{0} es obligatorio")]
        [MaxLength(60)]
        public string nombre { get; set; }

        private int _capacidad;
        //Encapsulamiento
        [Required(ErrorMessage = "{0} es obligatorio")]
        public int capacidad
        {
            get { return _capacidad; }
            set
            {
                //Nos convierta al ser llamados numero absoluto postivo
                this._capacidad = Math.Abs(value);
            }
        }
    }
}
