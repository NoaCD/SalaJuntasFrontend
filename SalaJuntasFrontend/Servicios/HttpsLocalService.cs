namespace SalaJuntasFrontend.Servicios
{
    public class HttpsLocalService
    {
        public HttpClient VotarSSL()
        {
            HttpClientHandler clientHandler = new HttpClientHandler();
            clientHandler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };

            HttpClient client = new HttpClient(clientHandler);
            return client;

        }

    }
}
