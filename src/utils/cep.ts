export interface ViaCepResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge?: string;
  gia?: string;
  ddd?: string;
  siafi?: string;
  erro?: boolean | string;
}

export async function fetchAddressByCep(cep: string): Promise<{
  street: string;
  neighborhood: string;
  city: string;
  state: string;
  complement?: string;
  error?: string;
}> {
  const cleanCep = cep.replace(/\D/g, '');
  if (cleanCep.length !== 8) {
    return { street: '', neighborhood: '', city: '', state: '', error: 'CEP deve ter 8 dígitos' };
  }

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Erro na busca do CEP (${response.status})`);
    }

    const data: ViaCepResponse = await response.json();

    if (data.erro) {
      return { street: '', neighborhood: '', city: '', state: '', error: 'CEP não encontrado' };
    }

    return {
      street: data.logradouro || '',
      neighborhood: data.bairro || '',
      city: data.localidade || '',
      state: data.uf || '',
      complement: data.complemento || '',
    };
  } catch (err: unknown) {
    console.warn('ViaCep request failed, allowing manual entry:', err);
    return {
      street: '',
      neighborhood: '',
      city: '',
      state: '',
      error: 'Não foi possível consultar o CEP automaticamente. Preencha manualmente.',
    };
  }
}
