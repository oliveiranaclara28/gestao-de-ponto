from supabase import create_client

# Colando direto aqui para testar sem o arquivo .env atrapalhar
url = "https://plcjvgkveieadgrojig.supabase.co"
key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsY2p2Z2t2ZWllYWRnZHJvamlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwMzExOTgsImV4cCI6MjA5ODYwNzE5OH0.7nxbU-j-sPx6WcdtmcwxYyHQqcPCb6p49OLqk-fhjSg"

try:
    print("Tentando conectar diretamente...")
    supabase = create_client(url, key)
    
    # Dados do funcionário de teste
    novo_funcionario = {
        "nome": "João Silva",
        "cargo": "Assistente Administrativo"
    }
    
    resposta = supabase.table("funcionarios").insert(novo_funcionario).execute()
    print("Funcionário cadastrado com sucesso direto pelo Python!")
    print("Dados:", resposta.data)

except Exception as e:
    print(f"O erro que deu foi: {e}")