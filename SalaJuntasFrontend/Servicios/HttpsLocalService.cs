using System.Net.Http.Headers;

namespace SalaJuntasFrontend.Servicios
{
    public class HttpsLocalService
    {
        public HttpClient VotarSSL(string token = "")
        {
            HttpClientHandler clientHandler = new HttpClientHandler();
            clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };

            HttpClient client = new HttpClient(clientHandler);

            //Agregamos el token que llegue
            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer"," " + token);
            return client;

        }

    }
}
