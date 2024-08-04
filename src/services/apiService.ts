
class ApiService {
    getBasePath() {
        return process.env.EXPO_PUBLIC_API_URL;
    }

    getToken() {
        return process.env.EXPO_PUBLIC_API_TOKEN;
    }

    async getHeaderApi() {
        try {
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + this.getToken() || '',
            };
            return headers;
        } catch (error) {
            console.error('Erro:', error);
            return {};
        }
    }
}

export default ApiService;