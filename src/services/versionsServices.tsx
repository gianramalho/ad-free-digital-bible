import ApiService from "@/services/apiService"

const apiService = new ApiService();
const basePath = apiService.getBasePath();

async function getVersions() {

    try {
        const headers = await apiService.getHeaderApi();
        const response = await fetch(`${basePath}/versions`, {
            headers: headers,
        });
        
        const responseData = await response.json();

        if (responseData && Array.isArray(responseData)) {
            const versions: versionsResponse[] = responseData.map((data: any) => ({
                version: data.version,
                verses: data.verses,
            }));

            return versions;
        } else {
            console.error('Erro ao buscar versões: Dados inválidos');
            return [];
        }
    } catch (error) {
        console.error('Erro ao buscar versões:', error);
        return [];
    }
}

export { getVersions }
